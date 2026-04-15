import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const file = path.resolve(process.cwd(), '../shared/data/json/claims.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const claim = data.claims.find((c: any) => c.id === id);
  if (!claim) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(claim);
}
