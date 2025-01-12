import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; 
import { useEffect, useState } from "react";
import SMSButton from "./SMSButton";

type Friend = {
    name: string;
    phoneNumber: string;
    geocode: [number, number];
    popup: string;
    status: "safe" | "on-the-move" | "pickle";
};

type APIUser = {
    name: string;
    phoneNumber: string;
    geocode: [number, number];
    status: "safe" | "on-the-move" | "pickle";
};

type MapProps = {
    friends: Friend[];
};

const HeatmapLayer = ({ data }: { data: [number, number][] }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) {
            console.error("Map context is not available");
            return;
        }

        console.log("Heatmap data:", data);

        //@ts-expect-error: heatLayer 
        const heatLayer = L.heatLayer(data, {
            radius: 100, 
            blur: 25,   
            maxZoom: 10 
        });

        heatLayer.addTo(map);

        return () => {
            if (map.hasLayer(heatLayer)) {
                map.removeLayer(heatLayer);
            }
        };
    }, [data, map]);

    return null;
};

export default function Map({ friends }: MapProps) {
    const [users, setUsers] = useState<APIUser[]>([]);
    const [showHeatmap, setShowHeatmap] = useState(true);

    const fakeFriends: Friend[] = [
        {
            name: "John Doe",
            phoneNumber: "+1234567890",
            geocode: [37.7749, -122.4194],
            popup: "John Doe's location",
            status: "safe",
        },
        {
            name: "Jane Smith",
            phoneNumber: "+1234567891",
            geocode: [34.0522, -118.2437],
            popup: "Jane Smith's location",
            status: "on-the-move",
        },
        {
            name: "Alice Brown",
            phoneNumber: "+1234567892",
            geocode: [36.7783, -119.4179],
            popup: "Alice Brown's location",
            status: "pickle",
        },
        {
            name: "Bob White",
            phoneNumber: "+1234567893",
            geocode: [38.5816, -121.4944],
            popup: "Bob White's location",
            status: "safe",
        },
        {
            name: "Charlie Green",
            phoneNumber: "+1234567894",
            geocode: [32.7157, -117.1611],
            popup: "Charlie Green's location",
            status: "on-the-move",
        },
    ];

    const allFriends = [...friends, ...fakeFriends];

    const heatmapData: [number, number][] = allFriends.map((friend) => friend.geocode);

    return (
        <div>
            <div className="buttonContainer">
                <button
                    className="dialogButton"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    style={{ marginBottom: "10px", padding: "5px 10px", cursor: "pointer" }}
                >
                    {showHeatmap ? "Show Friends" : "Show Heatmap"}
                </button>
                <SMSButton />
            </div>
            <MapContainer
                center={[36.7783, -119.4179]}
                zoom={6}
                style={{ height: "40vh", width: "90vw", borderRadius: "8px" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {showHeatmap ? (
                    <HeatmapLayer data={heatmapData} />
                ) : (
                    allFriends.map((friend) => (
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
