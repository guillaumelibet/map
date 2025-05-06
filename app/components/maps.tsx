'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';

// Fix bug de l'icône manquante
import L from 'leaflet';
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Company {
  latitude: number;
  longitude: number;
}

interface MapProps {
  companies: Company[];
}

export default function Map({ companies }: MapProps) {
  const center: LatLngExpression = [44.015618, 1.356086];

  return (
    <MapContainer center={center} zoom={14} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {companies.map((company, idx) => (
        <Marker key={idx} position={[company.latitude, company.longitude]}>
          <Popup>Point {idx + 1}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
