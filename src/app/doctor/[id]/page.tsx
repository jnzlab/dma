'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { calculateDistance } from '@/utils/calculateDistance';

interface Dermatologist {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
}

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function DoctorProfile() {
  const params = useParams();
  const { id } = params;
  const [doctor, setDoctor] = useState<Dermatologist | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error fetching user location:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (id) {
      let doctorId: string;
      if (Array.isArray(id)) {
        // Handle the case where id is an array of strings
        doctorId = id[0]; // For example, use the first segment
      } else {
        doctorId = id;
      }

      fetch(`/api/dermatologists`)
        .then((res) => res.json())
        .then((data: Dermatologist[]) => {
          const selectedDoctor = data.find((doc) => doc.id === parseInt(doctorId, 10));
          setDoctor(selectedDoctor ?? null);
        })
        .catch((error) => {
          console.error('Error fetching dermatologist data:', error);
        });
    }
  }, [id]);

  if (!doctor) return <div>Loading doctor information...</div>;
  if (!userLocation) return <div>Loading your location...</div>;

  const distance = calculateDistance(userLocation, {
    lat: doctor.latitude,
    lng: doctor.longitude,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
      <p className="mb-2">Address: {doctor.address}</p>
      <p className="mb-2">Phone: {doctor.phone}</p>
      <p className="mb-4">Distance: {distance.toFixed(2)} km</p>
      <Map userLocation={userLocation} doctorLocation={{ lat: doctor.latitude, lng: doctor.longitude }} />
    </div>
  );
}
