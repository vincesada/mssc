'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  destinationAddress: string;
}

// 🔵 Company coordinates
const COMPANY_LOCATION = {
  name: "Mustard Seed Systems",
  lat: 10.3157,
  lng: 123.8854,
};

export default function FieldMap({ destinationAddress }: Props) {
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [isBrowser, setIsBrowser] = useState(false);

  // Fix Leaflet marker icons in Next.js
  useEffect(() => {
    setIsBrowser(true);
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Geocode destination address
  useEffect(() => {
    async function geocode() {
      if (!destinationAddress || !isBrowser) return;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationAddress)}`
        );
        const data = await res.json();

        if (data && data.length > 0) {
          setDestination({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      }
    }

    geocode();
  }, [destinationAddress, isBrowser]);

  // Fetch route from company to client
  useEffect(() => {
    async function fetchRoute() {
      if (!destination) return;

      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${COMPANY_LOCATION.lng},${COMPANY_LOCATION.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
        );
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] // flip lat/lng
          );
          setRoute(coords);

          const km = (data.routes[0].distance / 1000).toFixed(2);
          const mins = Math.round(data.routes[0].duration / 60);
          setDistance(`${km} km`);
          setDuration(`${mins} mins`);
        }
      } catch (err) {
        console.error('Routing error:', err);
      }
    }

    fetchRoute();
  }, [destination]);

  if (!isBrowser) return null; // prevent SSR rendering

  return (
    <div className="mt-4">
      <MapContainer
        center={[COMPANY_LOCATION.lat, COMPANY_LOCATION.lng]}
        zoom={12}
        style={{ height: '350px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Company Marker */}
        <Marker position={[COMPANY_LOCATION.lat, COMPANY_LOCATION.lng]}>
          <Popup>{COMPANY_LOCATION.name}</Popup>
        </Marker>

        {/* Client Marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Client Location</Popup>
          </Marker>
        )}

        {/* Route */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>

      {distance && (
        <div className="bg-blue-50 p-3 mt-3 rounded-lg border">
          <p className="text-sm font-medium text-blue-700">Distance: {distance}</p>
          <p className="text-sm text-blue-600">Estimated Time: {duration}</p>
        </div>
      )}
    </div>
  );
}