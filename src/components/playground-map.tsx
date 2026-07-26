import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import playgrounds from "../data/playgrounds.json";
import type { Playground } from "../stores/types";

const playgroundIcon = new L.Icon({
  iconUrl: "public/playground.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const WINTERTHUR_CENTER: [number, number] = [47.5001, 8.7241];

function PlaygroundMap() {
  const data = playgrounds as Playground[];

  return (
    <MapContainer
      center={WINTERTHUR_CENTER}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        className="map-tiles-soft"
      />
      {data.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lon]} icon={playgroundIcon}>
          <Popup minWidth={180}>
            <div className="font-semibold">{p.name}</div>
            {p.surface && <div className="text-sm">Surface: {p.surface}</div>}
            {p.operator && (
              <div className="text-sm">Operator: {p.operator}</div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default PlaygroundMap;
