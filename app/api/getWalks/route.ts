import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const hikes: string[] = [];
  const files = fs.readdirSync(path.resolve("./config"));

  files.forEach(function (file) {
    hikes.push(file);
  });

  return NextResponse.json({ hikes });
}
