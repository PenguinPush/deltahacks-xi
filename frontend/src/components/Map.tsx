import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

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
    addFriend: (friend: Friend) => void;
};

export default function Map({ friends, addFriend }: MapProps) {
    const [location, setLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocation([latitude, longitude]);
            },
            (error) => {
                console.error("Error getting location", error);
            }
        );
    }, []);

    return (
        <>
            {location ? (
                <MapContainer center={location} zoom={13} style={{ height: "100vh", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
            ) : (
                <p>Loading map...</p>
            )}

            <button
                onClick={() =>
                    addFriend({
                        name: "New Friend",
                        phoneNumber: "555-123-4567",
                        geocode: [43.68074464549336, -79.62829621671438],
                        popup: `New Friend's location.`,
                        location: "Mississauga, ON",
                        distance: "50km",
                        status: "on-the-move",
                    })
                }
            >
                Add New Friend
            </button>
        </>
    );
}
