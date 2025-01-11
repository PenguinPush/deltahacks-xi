import React from 'react';
import { MapContainer, Marker, TileLayer, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'

export default function Map() {
    var markers = [
        {
            geocode: [43.78074464549336, -79.62829621671438],
            popUp: "Nickrod's location.",
        },
        {
            geocode: [43.58074464549336, -79.62829621671438],
            popUp: "Patrick's location.",
        }
    ];
    return(

    <>
        <MapContainer center={[43.68074464549336, -79.62829621671438]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(marker => (
            <Marker position={marker.geocode as [number, number]}>
                <Popup>{marker.popUp}</Popup>
            </Marker>
        ))}
        </MapContainer>
        <button>Update Friend's Location</button>
    </>
)
}
