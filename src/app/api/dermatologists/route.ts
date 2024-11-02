import { NextResponse } from 'next/server';

interface Dermatologist {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
}

const dermatologists: Dermatologist[] = [
  { id: 1, name: 'Dr. Jameel', latitude: 32.163254, longitude: 74.182943, address: 'Gondal Medical Complex Gujranwala', phone: '055 3251056' },
  { id: 2, name: 'Dr. Nouman', latitude: 31.512251047206703, longitude: 74.32824370956716, address: 'Hameed Lateef Hospital Lahore', phone: '042 111000043' },
  { id: 3, name: 'Dr. Zainab', latitude: 32.20563217058036, longitude: 74.17612622362527, address: 'Gujranwala Medical Complex', phone: '055 3416004' },
  // Add more dermatologists as needed
];

export async function GET() {
  return NextResponse.json(dermatologists);
}
