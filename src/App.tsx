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
    status: string; // Use string here because the server might return any value
};

function AppContent() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const mainUserPhoneNumber = "+16476369303"; // Main user's phone number (static example)
    const [mainUser, setMainUser] = useState<Friend | null>(null); // For the main user's details

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const apiUrl = "https://www.picklehelp.us";
                const response = await fetch(`${apiUrl}/api/friends`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Expect the API to return an array of ApiFriend
                const data: ApiFriend[] = await response.json();

                const transformedFriends: Friend[] = data
                    .map((friend) => {
                        // Validate and transform data into Friend structure
                        if (
                            typeof friend.name === "string" &&
                            typeof friend.phoneNumber === "string" &&
                            Array.isArray(friend.geocode) &&
                            friend.geocode.length === 2 &&
                            typeof friend.geocode[0] === "number" &&
                            typeof friend.geocode[1] === "number" &&
                            typeof friend.status === "string"
                        ) {
                            // Transform status into userStatus
                            const validStatus = ["safe", "on-the-move", "pickle"].includes(friend.status)
                                ? (friend.status as userStatus)
                                : "safe"; // Default to "safe" if invalid

                            return {
                                name: friend.name,
                                phoneNumber: friend.phoneNumber,
                                geocode: friend.geocode as [number, number],
                                popup: `${friend.name}'s location`,
                                location: "", // Empty for now
                                distance: "", // Empty for now
                                status: validStatus,
                            };
                        }
                        console.warn("Invalid friend data:", friend);
                        return null; // Skip invalid entries
                    })
                    .filter((f): f is Friend => f !== null); // Filter out null entries

                // Separate the main user and their friends
                const filteredFriends = transformedFriends.filter(
                    (friend) => friend.phoneNumber !== mainUserPhoneNumber
                );
                const mainUserData = transformedFriends.find(
                    (friend) => friend.phoneNumber === mainUserPhoneNumber
                );

                setFriends(filteredFriends);
                setMainUser(mainUserData || null);
            } catch (error) {
                console.error("Error fetching friends:", error);
                setFriends([]); // Reset to empty on error
                setMainUser(null);
            }
        };

        fetchFriends();
    }, []);

    const handleUpdateMainUserStatus = (newStatus: userStatus) => {
        if (mainUser) {
            const updatedMainUser = { ...mainUser, status: newStatus };
            setMainUser(updatedMainUser);

            // Optionally send the updated status to the server
            fetch("https://www.picklehelp.us/api/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber: mainUser.phoneNumber,
                    status: newStatus,
                }),
            }).catch((error) => {
                console.error("Error updating status:", error);
            });
        }
    };

    return (
        <div id="container">
            {/* Map of friends */}
            <Map friends={friends} />

            {/* Buttons */}
            <AddFriendButton />

            {/* Manual update for friends */}
            <ManualUpdate friends={friends} />

            {/* Display the main user's profile */}
            {mainUser && (
                <ProfileCard
                    key={mainUser.phoneNumber}
                    name={mainUser.name}
                    location={mainUser.location}
                    distance={mainUser.distance}
                    status={mainUser.status}
                />
            )}

            {/* Display friends' profiles */}
            {friends.map((friend) => (
                <ProfileCard
                    key={friend.phoneNumber}
                    name={friend.name}
                    location={friend.location}
                    distance={friend.distance}
                    status={friend.status}
                />
            ))}

            {/* Control for main user's status */}
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
