"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { calculateDistance } from "@/utils/calculateDistance";

interface Dermatologist {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

export default function Home() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [dermatologists, setDermatologists] = useState<Dermatologist[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetch("/api/dermatologists")
        .then((res) => res.json())
        .then((data: Dermatologist[]) => {
          const sortedDermatologists = data
            .map((doc) => ({
              ...doc,
              distance: calculateDistance(userLocation, {
                lat: doc.latitude,
                lng: doc.longitude,
              }),
            }))
            .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
          setDermatologists(sortedDermatologists);
        });
    }
  }, [userLocation]);

  if (!userLocation)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading user location...</div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Nearby Dermatologists
      </h1>
      <ul className="space-y-4">
        {dermatologists.map((doc) => (
          <li
            key={doc.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Link
              href={`/doctor/${doc.id}`}
              className="text-lg md:text-xl font-semibold text-blue-600 hover:text-blue-800"
            >
              {doc.name}
            </Link>
            <p className="text-gray-600">
              {(doc.distance ?? 0).toFixed(2)} km away
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}