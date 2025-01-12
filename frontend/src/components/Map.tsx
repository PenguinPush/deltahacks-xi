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
    const [users, setUsers] = useState<APIUser[]>([]); // State for all users
    const [showHeatmap, setShowHeatmap] = useState(true); // Toggle for heatmap/markers

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/users");
                if (!response.ok) {
                    // Log the response if it's not OK
                    const text = await response.text();
                    console.error("Error fetching users:", text);
                    return;
                }
                const data: Array<{
                    name: string;
                    phoneNumber: string;
                    geocode: [number, number];
                    status: "safe" | "on-the-move" | "pickle";
                }> = await response.json();

                const users: APIUser[] = data.map((user) => ({
                    name: user.name || "Unknown",
                    phoneNumber: user.phoneNumber || "N/A",
                    geocode: user.geocode || [0.0, 0.0],
                    status: user.status || "unknown",
                }));
                

                setUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();
    }, []);

    const heatmapData: [number, number][] = users.map((user) => user.geocode);

    return (
        <div>
            <div className="buttonContainer">
                <button className="dialogButton"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    style={{ marginBottom: "10px", padding: "5px 10px", cursor: "pointer" }}>
                    {showHeatmap ? "Show Friends" : "Show Heatmap"}
                </button>
                <SMSButton></SMSButton>
            </div>
            <MapContainer
                center={[37.7749, -122.4194]} // Center on San Francisco
                zoom={5}
                style={{ height: "40vh", width: "90vw", borderRadius: "8px" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {showHeatmap ? (
                    // Heatmap: Show all users
                    <HeatmapLayer data={heatmapData} />
                ) : (
                    // Marker view: Show only friends
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
