import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getFile() {
  return path.resolve(process.cwd(), '../shared/data/json/security.json');
}

export function GET() {
  const data = JSON.parse(fs.readFileSync(getFile(), 'utf-8'));
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const data = JSON.parse(fs.readFileSync(getFile(), 'utf-8'));
  Object.assign(data, body);
  fs.writeFileSync(getFile(), JSON.stringify(data, null, 2));
  return NextResponse.json(data);
}
