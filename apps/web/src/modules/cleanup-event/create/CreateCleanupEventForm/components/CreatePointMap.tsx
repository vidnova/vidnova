import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { LatLngTuple } from 'leaflet';
import { MapPin } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

const MapEvents = dynamic(
  () =>
    import('react-leaflet').then((mod) => {
      const { useMapEvents } = mod;
      return function MapEventsComponent({
        onMapClick,
      }: {
        onMapClick: (lat: number, lng: number) => void;
      }) {
        useMapEvents({
          click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
          },
        });
        return null;
      };
    }),
  { ssr: false },
);

export const CreatePointMap = () => {
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
  };

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
    <div className="rounded-2xl max-w-[400px] h-[400px] overflow-hidden">
      <MapContainer
        center={[48.3794, 31.1656]}
        zoom={5}
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
        <MapEvents onMapClick={handleMapClick} />
        {markerPosition && (
          <Marker position={markerPosition} icon={icon}>
            <Popup>
              Lat: {markerPosition[0].toFixed(4)}, Lng: {markerPosition[1].toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
      {markerPosition && (
        <div className="mt-2 text-sm">
          Selected Coordinates: Lat: {markerPosition[0].toFixed(4)}, Lng:{' '}
          {markerPosition[1].toFixed(4)}
        </div>
      )}
    </div>
  );
};
