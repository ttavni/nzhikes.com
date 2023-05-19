import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const listOfHikes: string[] = [];
  const walkDirectory = path.join(process.cwd(), "config");
  const files = fs.readdirSync(walkDirectory);

  files.forEach(function (file) {
    listOfHikes.push(file);
  });

  const hikes = [];
  for (const hike of listOfHikes) {
    const hikeMeta = await import(`config/${hike}/meta.json`);
    hikes.push({ name: hike, info: hikeMeta });
  }

  return NextResponse.json({ hikes });
}
