// Stopwords across the three languages used in the corpus (es / en / pt).
// Kept tight — high-frequency function words that add noise to phrase ranking.
const STOPWORDS = new Set<string>([
  // Spanish
  "el","la","los","las","un","una","unos","unas","de","del","al","y","o","u","e","a","en","con","por","para","sobre",
  "que","qué","quien","quién","como","cómo","cuando","cuándo","donde","dónde","cuanto","cuánto","más","menos",
  "es","fue","ser","sido","son","era","eran","esta","está","están","estoy","estamos","estás","sea","sean",
  "ha","he","hemos","han","había","hay","habían","haber","tener","tenemos","tienen","tiene","tener","tuvo",
  "no","sí","si","yo","tú","él","ella","nosotros","ustedes","ellos","ellas","mi","mí","tu","ti","su","sus","mis","tus",
  "este","esta","estos","estas","ese","esa","esos","esas","aquel","aquella","aquellos","aquellas","esto","eso",
  "lo","le","les","me","te","nos","se","todo","toda","todos","todas","muy","mucho","mucha","muchos","muchas",
  "poco","poca","tan","tanto","tantos","ya","aún","también","tambien","pero","aunque","porque","mientras",
  // Portuguese
  "o","os","das","dos","na","no","nas","nos","com","por","para","que","qual","quais","como","onde","quando",
  "ser","ter","foi","são","eram","está","estão","tem","tinha","esta","este","estes","estas","minha","minhas",
  "muito","muita","mais","menos","já","também","mas","porque","quando","fazer","feito","sobre","ao","à","às","aos",
  // English
  "the","a","an","and","or","but","of","to","in","on","at","by","for","with","about","as","is","are","was","were",
  "be","been","being","have","has","had","do","does","did","this","that","these","those","i","you","he","she","it",
  "we","they","my","your","his","her","its","our","their","me","him","us","them","not","no","yes","so","if","then",
  "than","as","very","more","less","also","too","just","only","still","when","where","why","how","what","which","who",
  "into","from","up","down","out","over","under","again","there","here",
]);

const PUNCT_RE = /[.,;:!¡¿?(){}\[\]"“”'’`*_/\\|<>—–-]+/g;

export function tokenize(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase().replace(PUNCT_RE, " ");
  return lower
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

export function topPhrases(
  texts: string[],
  options: { ngrams?: 1 | 2; limit?: number } = {},
): Array<{ phrase: string; count: number }> {
  const { ngrams = 2, limit = 30 } = options;
  const counts = new Map<string, number>();

  for (const text of texts) {
    const tokens = tokenize(text);
    if (ngrams === 1) {
      for (const t of tokens) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    } else {
      for (let i = 0; i < tokens.length - 1; i++) {
        const a = tokens[i];
        const b = tokens[i + 1];
        if (!a || !b) continue;
        const phrase = `${a} ${b}`;
        counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([phrase, count]) => ({ phrase, count }));
}

// Many tool/concept answers come as free text with separators (commas, dashes, pipes).
// Split into individual tool entries before frequency-counting.
export function splitToolEntries(text: string): string[] {
  if (!text) return [];
  return text
    .split(/[|,;\n]| - | – | y | and | e |\+/g)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3 && s.length <= 80);
}

export function topToolEntries(
  texts: string[],
  limit = 30,
): Array<{ entry: string; count: number; samples: string[] }> {
  const counts = new Map<string, { count: number; samples: Set<string> }>();
  for (const t of texts) {
    for (const entry of splitToolEntries(t)) {
      const key = entry.toLowerCase();
      let bucket = counts.get(key);
      if (!bucket) {
        bucket = { count: 0, samples: new Set() };
        counts.set(key, bucket);
      }
      bucket.count++;
      if (bucket.samples.size < 3) bucket.samples.add(entry);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([key, b]) => ({
      entry: [...b.samples][0] ?? key,
      count: b.count,
      samples: [...b.samples],
    }));
}

export function sampleQuotes(texts: string[], n = 5): string[] {
  const filtered = texts.filter((t) => t && t.length >= 20 && t.length <= 400);
  if (filtered.length <= n) return filtered;
  const out: string[] = [];
  const used = new Set<number>();
  while (out.length < n && used.size < filtered.length) {
    const idx = Math.floor(Math.random() * filtered.length);
    if (used.has(idx)) continue;
    used.add(idx);
    const q = filtered[idx];
    if (q) out.push(q);
  }
  return out;
}
