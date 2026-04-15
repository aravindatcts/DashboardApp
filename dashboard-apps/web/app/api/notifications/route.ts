import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export function GET() {
  const file = path.resolve(process.cwd(), '../shared/data/json/notifications.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return NextResponse.json(data);
}
