import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // Make sure you have this installed via npm
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

        // Debugging: Log heatmap data
        console.log("Heatmap data:", data);

        //@ts-expect-error: heatLayer is not typed in leaflet.heat
        const heatLayer = L.heatLayer(data, {
            radius: 25, // Adjust to control the size of the heatmap points
            blur: 15,   // Controls the gradient smoothness
            maxZoom: 10 // Specifies clustering behavior
        });

        // Add the heat layer to the map
        heatLayer.addTo(map);

        // Cleanup: Remove the layer on unmount
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

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("http://picklehelp.us/api/users");
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

    // Heatmap data preparation
    const heatmapData: [number, number][] = users.map((user) => [
        user.geocode[0], // Latitude first
        user.geocode[1], // Longitude second
    ]);

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
                center={[37.7749, -122.4194]} // Center on San Francisco
                zoom={5}
                style={{ height: "40vh", width: "90vw", borderRadius: "8px" }}
            >
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
