import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect, useState } from "react";

type Friend = {
    name: string;
    phoneNumber: string;
    geocode: [number, number];
    popup: string;
    location: string;
    distance: string;
    status: "safe" | "on-the-move" | "pickle";
};

type MapProps = {
    friends: Friend[];
};

const HeatmapLayer = ({ data }: { data: [number, number][] }) => {
    const map = useMap();

    useEffect(() => {
        // @ts-expect-error heatLayer
        const heatLayer = L.heatLayer(data, {
            radius: 50,
            blur: 50,
            maxZoom: 7,
        });
        heatLayer.addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [data, map]);
    return null;
};

export default function Map({ friends }: MapProps) {
    const [showHeatmap, setShowHeatmap] = useState(true);

    const heatmapData: [number, number][] = friends.map((friend) => friend.geocode);

    return (
        <div>
            <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                style={{ marginBottom: "10px", padding: "5px 10px", cursor: "pointer" }}>
                {showHeatmap ? "Show Friends" : "Show Heatmap"}
            </button>

            <MapContainer
                center={[37.7749, -122.4194]}
                zoom={5}
                style={{ height: "40vh", width: "90vw", borderRadius:"8px"}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {showHeatmap ? (
                    <HeatmapLayer data={heatmapData} />
                ) : (
                    friends.map((friend) => (
                        <Marker key={friend.phoneNumber} position={friend.geocode}>
                            <Popup>
                                <strong>{friend.name}</strong>
                                <br />
                                {friend.popup}
                            </Popup>
                        </Marker>
                    ))
                )}
            </MapContainer>
        </div>
    );
}
