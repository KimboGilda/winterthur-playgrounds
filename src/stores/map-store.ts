import { makeAutoObservable } from "mobx";

class MapStore {
  target?: { lat: number; lon: number; zoom: number; label?: string };

  constructor() {
    makeAutoObservable(this);
  }

  flyTo(lat: number, lon: number, zoom: number, label?: string) {
    this.target = { lat, lon, zoom, label };
  }

  clear() {
    this.target = undefined;
  }
}

export const mapStore = new MapStore();
