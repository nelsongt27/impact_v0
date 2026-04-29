const BASE_URL = "https://api.typeform.com";

export class TypeformError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: string,
  ) {
    super(message);
    this.name = "TypeformError";
  }
}

export class TypeformClient {
  private readonly token: string;

  constructor(token: string | undefined) {
    if (!token || token.trim() === "") {
      throw new Error(
        "TYPEFORM_API_KEY is missing. Add it to .env (see .env.example).",
      );
    }
    this.token = token.trim();
  }

  async get<T>(path: string): Promise<T> {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const maxAttempts = 5;
    let attempt = 0;

    while (true) {
      attempt++;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        return (await res.json()) as T;
      }

      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= maxAttempts) {
        const body = await res.text();
        throw new TypeformError(
          `Typeform API ${res.status} on ${path}`,
          res.status,
          body.slice(0, 500),
        );
      }

      const retryAfterHeader = res.headers.get("retry-after");
      const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : null;
      const baseDelay =
        retryAfter && Number.isFinite(retryAfter)
          ? retryAfter * 1000
          : 500 * 2 ** (attempt - 1);
      const jitter = Math.floor(Math.random() * 200);
      const delay = baseDelay + jitter;
      console.warn(
        `  ↻ ${res.status} on ${path} — retry ${attempt}/${maxAttempts} in ${delay}ms`,
      );
      await Bun.sleep(delay);
    }
  }
}
