import "./App.css";
import ProfileCard from "./components/ProfileCard";
import Map from "./components/Map";
import ManualUpdate from "./components/ManualUpdate";
import AddFriendButton from "./components/AddFriendButton";
import { useState, useEffect } from "react";

type userStatus = "safe" | "on-the-move" | "pickle";

type Friend = {
    name: string;
    phoneNumber: string;
    geocode: [number, number];
    popup: string;
    location: string;
    distance: string;
    status: userStatus;
};

type ApiFriend = {
    name: string;
    phoneNumber: string;
    geocode: [number, number];
    status: string;
};

function AppContent() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const mainUserPhoneNumber = "+16476369303"; 
    const [mainUser, setMainUser] = useState<Friend | null>(null); 

    // Manually generated friends data
    useEffect(() => {
        const mockFriends: Friend[] = [
            {
                name: "James Marriott",
                phoneNumber: "+1234567890",
                geocode: [37.7749, -122.4194], 
                popup: "James Marriott's location",
                location: "San Francisco, CA",
                distance: "5 miles",
                status: "safe",
            },
            {
                name: "Ella Roberts",
                phoneNumber: "+1987654321",
                geocode: [34.0522, -118.2437],
                popup: "Ella Roberts's location",
                location: "Los Angeles, CA",
                distance: "300 miles",
                status: "on-the-move",
            },
            {
                name: "Liam Johnson",
                phoneNumber: "+14155552671",
                geocode: [40.7128, -74.006],
                popup: "Liam Johnson's location",
                location: "New York, NY",
                distance: "2,500 miles",
                status: "pickle",
            },
        ];

        const mainUserMock: Friend = {
            name: "Your Name",
            phoneNumber: mainUserPhoneNumber,
            geocode: [37.3382, -121.8863],
            popup: "Your location",
            location: "San Jose, CA",
            distance: "0 miles",
            status: "safe",
        };

        setFriends(mockFriends);
        setMainUser(mainUserMock);
    }, [mainUserPhoneNumber]);

    const handleUpdateMainUserStatus = (newStatus: userStatus) => {
        if (mainUser) {
            const updatedMainUser = { ...mainUser, status: newStatus };
            setMainUser(updatedMainUser);

            console.log("Updated Main User Status:", updatedMainUser);
        }
    };

    return (
        <div id="container">
            <Map friends={friends} />

            <AddFriendButton />

            <ManualUpdate friends={friends} />

            {mainUser && (
                <ProfileCard
                    key={mainUser.phoneNumber}
                    name={mainUser.name}
                    location={mainUser.location}
                    distance={mainUser.distance}
                    status={mainUser.status}
                />
            )}

            {friends.map((friend) => (
                <ProfileCard
                    key={friend.phoneNumber}
                    name={friend.name}
                    location={friend.location}
                    distance={friend.distance}
                    status={friend.status}
                />
            ))}

            {mainUser && (
                <div>
                    <h3>Update Your Status</h3>
                    <button onClick={() => handleUpdateMainUserStatus("safe")}>Safe</button>
                    <button onClick={() => handleUpdateMainUserStatus("on-the-move")}>On The Move</button>
                    <button onClick={() => handleUpdateMainUserStatus("pickle")}>Pickle</button>
                </div>
            )}
        </div>
    );
}

export default function App() {
    return <AppContent />;
}