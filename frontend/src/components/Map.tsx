import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect } from "react";

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
        // Add the heat layer
        // @ts-expect-error heatLayer
        const heatLayer = L.heatLayer(data, {
            radius: 50, // Larger radius for better visibility
            blur: 50,
            maxZoom: 7,
        });
        heatLayer.addTo(map);

        // Cleanup on component unmount
        return () => {
            map.removeLayer(heatLayer);
        };
    }, [data, map]);

    return null;
};

export default function Map({ friends }: MapProps) {
    // Prepare heatmap data
    const heatmapData: [number, number][] = friends.map((friend) => friend.geocode);

    return (
        <MapContainer
            center={[37.7749, -122.4194]}
            zoom={5}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Heatmap Layer */}
            <HeatmapLayer data={heatmapData} />

            {/* Markers for Friends */}
            {friends.map((friend) => (
                <Marker key={friend.phoneNumber} position={friend.geocode}>
                    <Popup>
                        <strong>{friend.name}</strong>
                        <br />
                        {friend.popup}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
