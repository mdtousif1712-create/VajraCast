import React, { useState, useMemo } from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  Marker,
} from "react-map-gl/maplibre";
import { useStorms } from "../../services/api";
import { useLocationContext } from "../../context/LocationContext";
// Map style using Carto light for a clean cartographic look
const MAP_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      paint: {
        "raster-saturation": -0.1,
        "raster-contrast": 0.1,
        "raster-brightness-min": 0.3,
        "raster-brightness-max": 0.9,
      },
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

interface WeatherMapProps {
  onLocationClick?: (loc: { lng: number; lat: number }) => void;
  onStormClick?: (stormId: string) => void;
  selectedStormId?: string;
}

export function WeatherMap({
  onLocationClick,
  onStormClick,
  selectedStormId,
}: WeatherMapProps) {
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
    pitch: 0,
    bearing: 0,
  });

  const { location } = useLocationContext();
  const { data: activeStorms, isLoading } = useStorms(location);

  React.useEffect(() => {
    if (location?.coordinates) {
      setViewState((prev) => ({
        ...prev,
        longitude: location.coordinates.lng,
        latitude: location.coordinates.lat,
        zoom: 6,
      }));
    }
  }, [location?.coordinates]);

  const stormGeoJSON = useMemo(() => {
    if (!activeStorms) return { type: "FeatureCollection", features: [] };
    return {
      type: "FeatureCollection",
      features: activeStorms.map((storm) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: storm.coordinates,
        },
        properties: {
          id: storm.id,
          intensity: storm.intensity,
          risk: storm.risk,
          radius:
            storm.intensity === "Severe"
              ? 40
              : storm.intensity === "Strong"
                ? 30
                : 20,
        },
      })),
    };
  }, [activeStorms]);

  const handleClick = (e: any) => {
    const feature = e.features && e.features[0];
    if (feature && feature.layer.id === "storms-layer") {
      onStormClick?.(feature.properties.id);
    } else {
      onLocationClick?.({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    }
  };

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE as any}
        interactiveLayerIds={["storms-layer"]}
        onClick={handleClick}
        cursor="crosshair"
      >
        {/* India States Boundaries */}
        <Source id="india-states" type="geojson" data="/india-states.geojson">
          <Layer
            id="india-states-line"
            type="line"
            paint={{
              "line-color": "#22393C", // text-primary equivalent for borders
              "line-width": 1,
              "line-opacity": 0.3,
            }}
          />
        </Source>

        <Source id="storms" type="geojson" data={stormGeoJSON as any}>
          <Layer
            id="storms-layer"
            type="circle"
            paint={{
              "circle-radius": ["get", "radius"],
              "circle-color": [
                "match",
                ["get", "risk"],
                "Severe",
                "#C67A66", // rust
                "High",
                "#D6A87C", // amber
                "Moderate",
                "#8FA39A", // muted green
                "#AFBB98", // low/sage
              ],
              "circle-opacity": 0.4,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#22393C",
            }}
          />
          <Layer
            id="storms-centers"
            type="circle"
            paint={{
              "circle-radius": 4,
              "circle-color": "#FFFFFF",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#22393C",
            }}
          />
          <Layer
            id="storms-labels"
            type="symbol"
            layout={{
              "text-field": ["get", "id"],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 12,
              "text-anchor": "top",
              "text-offset": [0, 1],
            }}
            paint={{
              "text-color": "#22393C",
              "text-halo-color": "#FFFFFF",
              "text-halo-width": 2,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
