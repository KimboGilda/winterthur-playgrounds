import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Playground } from "../stores/types";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { mapStore } from "../stores/map-store";

interface Props {
  playgrounds: Playground[];
}

interface ClusterLike {
  getChildCount: () => number;
}

const playgroundIcon = new L.Icon({
  iconUrl: "public/playground.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const WINTERTHUR_CENTER: [number, number] = [47.5001, 8.7241];

const PlaygroundMap = observer(function PlaygroundMap({ playgrounds }: Props) {
  const data = playgrounds as Playground[];

  const mapRef = useRef<L.Map | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);

  const t = mapStore.target;

  useEffect(() => {
    if (!mapRef.current) return;

    if (!t) {
      if (searchMarkerRef.current) {
        mapRef.current.removeLayer(searchMarkerRef.current);
        searchMarkerRef.current = null;
      }
      return;
    }

    mapRef.current.flyTo([t.lat, t.lon], t.zoom);

    if (t.label) {
      if (searchMarkerRef.current) {
        mapRef.current.removeLayer(searchMarkerRef.current);
      }
      const marker = L.marker([t.lat, t.lon])
        .addTo(mapRef.current)
        .bindPopup(t.label)
        .openPopup();
      searchMarkerRef.current = marker;
    }
  }, [t]);

  return (
    <MapContainer
      center={WINTERTHUR_CENTER}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
      ref={mapRef}
    >
      <ZoomControl position="topright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        className="map-tiles-soft"
      />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        iconCreateFunction={(cluster: ClusterLike) => {
          const count = cluster.getChildCount();
          const size = count < 10 ? "small" : count < 30 ? "medium" : "large";
          return L.divIcon({
            html: `<div class="cluster-bubble cluster-${size}"><span>${count}</span></div>`,
            className: "custom-cluster-icon",
            iconSize: L.point(40, 40, true),
          });
        }}
      >
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
      </MarkerClusterGroup>
    </MapContainer>
  );
});

export default PlaygroundMap;
