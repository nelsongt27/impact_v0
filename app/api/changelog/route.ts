import changelog from "@data/normalized/changelog.json";

import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(changelog);
}
