import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const hikes: string[] = [];
  const walkDirectory = path.join(process.cwd(), "config");
  const files = fs.readdirSync(walkDirectory);

  files.forEach(function (file) {
    hikes.push(file);
  });

  return NextResponse.json({ hikes });
}
