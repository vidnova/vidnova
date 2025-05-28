import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});

export const PointMap = () => {
  const [icon, setIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      const divIcon = L.divIcon({
        className: 'custom-div-icon',
        html: ReactDOMServer.renderToString(<MapPin size={24} color="red" />),
        iconAnchor: [12, 12],
      });
      setIcon(divIcon);
    });
  }, []);

  if (!icon) return null;

  return (
    <div>
      <span className="text-xl font-bold text-accent">Точка на карті</span>
      <div className="rounded-2xl max-w-[400px] h-[400px] overflow-hidden mt-3">
        <MapContainer
          center={[50.4501, 30.5234]}
          zoom={20}
          style={{ height: '400px', width: '400px' }}
          maxBounds={[
            [44.0, 22.0],
            [52.5, 40.5],
          ]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[50.4501, 30.5234]} icon={icon} />
        </MapContainer>
      </div>
    </div>
  );
};
