import { useState, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type MarkerData = {
    geocode: [number, number];
    popUp: string;
};

type Markers = {
    [phoneNumber: string]: MarkerData;
};

export default function Map() {
    const [location, setLocation] = useState<[number, number] | null>(null);
    const [markers, setMarkers] = useState<Markers>({
        "123-456-7890": {
            geocode: [43.265777, -79.918213],
            popUp: "Nickrod's location."
        },
        "098-765-4321": {
            geocode: [43.275777, -79.918213],
            popUp: "Patrick's location."
        },
    });

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

    const addMarker = (phoneNumber: string, geocode: [number, number], popUp: string) => {
        setMarkers((prevMarkers) => ({
            ...prevMarkers,
            [phoneNumber]: { geocode, popUp },
        }));
    };

    return (
        <>
            {location ? (
                <MapContainer center={location} zoom={13} style={{ height: "100vh", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {Object.entries(markers).map(([phoneNumber, markerData]) => (
                        <Marker key={phoneNumber} position={markerData.geocode}>
                            <Popup>{markerData.popUp}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            ) : (
                <p>Loading map...</p>
            )}

            <button
                onClick={() => addMarker("555-123-4567", [43.68074464549336, -79.62829621671438], "New Marker")}
            >
                Add New Marker
            </button>
        </>
    );
}
