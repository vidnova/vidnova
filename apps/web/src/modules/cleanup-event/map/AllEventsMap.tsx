import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export const AllEventsMap = () => {
  const [icon, setIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      const divIcon = L.divIcon({
        className: "custom-div-icon",
        html: ReactDOMServer.renderToString(<MapPin size={24} color="red" />),
        iconAnchor: [12, 12],
      });
      setIcon(divIcon);
    });
  }, []);

  const testMarkers = [
    { position: [50.4501, 30.5234], label: "Локація 1", id: "1" },
    { position: [49.9935, 36.2304], label: "Локація 2", id: "2" },
    { position: [46.4825, 30.7233], label: "Локація 3", id: "3" },
  ];

  if (!icon) return null;

  return (
    <MapContainer
      center={[48.3794, 31.1656]}
      zoom={6}
      style={{ height: "600px", width: "100%" }}
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
      {testMarkers.map((marker, idx) => (
        <Marker
          key={idx}
          position={marker.position as [number, number]}
          icon={icon}
        >
          <Popup>
            <Link href={`/event/${marker.id}`}>{marker.label}</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
