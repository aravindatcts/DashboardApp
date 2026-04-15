import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export function GET(req: NextRequest) {
  const file = path.resolve(process.cwd(), '../shared/data/json/providers.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') || 'Search Using Agent';
  const name = searchParams.get('name') || '';
  const specialty = searchParams.get('specialty') || '';
  const facility = searchParams.get('facility') || '';
  const city = searchParams.get('city') || '';
  const radius = parseFloat(searchParams.get('radius') || '25');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  let filtered = data.providers.filter((p: any) => {
    if (category === 'By Name' && name) {
      if (!p.name.toLowerCase().includes(name.toLowerCase())) return false;
    } else if (category === 'By Specialty' && specialty && specialty !== 'All') {
      if (p.specialty !== specialty) return false;
    } else if (category === 'By Group/Facility' && facility && facility !== 'All') {
      if (p.facility !== facility) return false;
    }
    if (city && !p.city.toLowerCase().includes(city.toLowerCase())) return false;
    if (parseFloat(p.distance) > radius) return false;
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const providers = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    providers,
    total,
    totalPages,
    page,
    providerTypes: data.providerTypes,
    facilityTypes: data.facilityTypes,
    searchCategories: data.searchCategories,
  });
}
