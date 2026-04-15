import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function loadClaims() {
  const file = path.resolve(process.cwd(), '../shared/data/json/claims.json');
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export function GET(req: NextRequest) {
  const data = loadClaims();
  const { searchParams } = req.nextUrl;
  const member = searchParams.get('member') || '';
  const provider = searchParams.get('provider') || '';
  const status = searchParams.get('status') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  let filtered = data.claims.filter((c: any) => {
    if (member && c.member !== member) return false;
    if (provider && !c.provider.toLowerCase().includes(provider.toLowerCase())) return false;
    if (status && c.status !== status) return false;
    if (startDate && c.date < startDate) return false;
    if (endDate && c.date > endDate) return false;
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const claims = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    claims,
    total,
    totalPages,
    page,
    members: data.members,
    statuses: data.statuses,
    providers: data.providers,
  });
}
