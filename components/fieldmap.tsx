'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  destinationAddress: string;
}

const OFFICE = {
  name: 'Our Office — Mabolo Royal Hotel, Cebu City',
  lat: 10.31722,
  lng: 123.90421,
};

// Adjusts map view to fit both markers + route
function MapController({
  route,
  destination,
}: {
  route: [number, number][];
  destination: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 1) {
      const bounds = L.latLngBounds(route.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    } else if (destination) {
      map.flyTo([destination.lat, destination.lng], 14, { animate: true });
    }
  }, [route, destination, map]);

  return null;
}

export default function FieldMap({ destinationAddress }: Props) {
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [isBrowser, setIsBrowser] = useState(false);
  const [status, setStatus] = useState<'idle' | 'geocoding' | 'routing' | 'done' | 'error'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsBrowser(true);
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Step 1 — geocode address (debounced)
  useEffect(() => {
    if (!destinationAddress?.trim() || !isBrowser) {
      setDestination(null);
      setRoute([]);
      setDistance('');
      setDuration('');
      setStatus('idle');
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setStatus('geocoding');
      setRoute([]);
      setDistance('');
      setDuration('');

      try {
        const query = destinationAddress.toLowerCase().includes('cebu')
          ? destinationAddress
          : `${destinationAddress}, Cebu City, Philippines`;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();

        if (data?.length > 0) {
          setDestination({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          setStatus('routing');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }, 700);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [destinationAddress, isBrowser]);

  // Step 2 — fetch driving route once destination is set
  useEffect(() => {
    if (!destination) return;

    async function fetchRoute() {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${OFFICE.lng},${OFFICE.lat};${destination!.lng},${destination!.lat}` +
          `?overview=full&geometries=geojson&steps=false`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 'Ok' && data.routes?.length > 0) {
          // OSRM returns [lng, lat] — flip to [lat, lng] for Leaflet
          const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
          );
          setRoute(coords);
          setDistance(`${(data.routes[0].distance / 1000).toFixed(1)} km`);
          setDuration(`${Math.round(data.routes[0].duration / 60)} mins`);
          setStatus('done');
        } else {
          // Fallback: straight dashed line between the two points
          setRoute([[OFFICE.lat, OFFICE.lng], [destination!.lat, destination!.lng]]);
          setStatus('done');
        }
      } catch {
        // Fallback: straight dashed line
        setRoute([[OFFICE.lat, OFFICE.lng], [destination!.lat, destination!.lng]]);
        setStatus('done');
      }
    }

    fetchRoute();
  }, [destination]);

  if (!isBrowser) return null;

  return (
    <div style={{ width: '100%' }}>

      {/* Status indicator */}
      {(status === 'geocoding' || status === 'routing') && (
        <div style={{ fontSize: '12px', color: '#888', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span style={{
            display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
            border: '2px solid #ccc', borderTopColor: '#555',
            animation: 'mapspin 0.7s linear infinite', flexShrink: 0,
          }} />
          {status === 'geocoding' ? 'Finding location…' : 'Calculating route…'}
        </div>
      )}
      {status === 'error' && (
        <div style={{ fontSize: '12px', color: '#999', paddingBottom: '8px' }}>
          ⚠ Location not found. Try a more specific address.
        </div>
      )}

      {/* Map — never re-keyed so Polyline state persists */}
      <MapContainer
        center={[OFFICE.lat, OFFICE.lng]}
        zoom={13}
        style={{ height: '300px', width: '100%', borderRadius: '10px', zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Adjusts bounds/view reactively */}
        <MapController route={route} destination={destination} />

        {/* Office marker */}
        <Marker position={[OFFICE.lat, OFFICE.lng]}>
          <Popup>
            <strong>Our Office</strong><br />
            Mabolo Royal Hotel, Cebu City
          </Popup>
        </Marker>

        {/* Destination marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>
              <strong>Destination</strong><br />
              {destinationAddress}
            </Popup>
          </Marker>
        )}

        {/* Route line */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{ color: '#111111', weight: 4, opacity: 0.9 }}
          />
        )}
      </MapContainer>

      {/* Distance + drive time */}
      {status === 'done' && distance && (
        <div style={{
          display: 'flex', gap: '16px', marginTop: '8px',
          padding: '10px 14px', background: '#f8f8f8',
          borderRadius: '8px', border: '1px solid #eee',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#aaa' }}>Distance</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>{distance}</span>
          </div>
          <div style={{ width: '1px', background: '#e0e0e0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#aaa' }}>Drive time</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>{duration}</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes mapspin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}