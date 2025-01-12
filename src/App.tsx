import "./App.css";
import ProfileCard from "./components/ProfileCard";
import Map from "./components/Map";
import ManualUpdate from "./components/ManualUpdate";
import AddFriendButton from "./components/AddFriendButton";
import {useState, useEffect} from "react";

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
        const fetchFriends = async () => {
            try {
                const myPhoneResponse = await fetch("https://www.picklehelp.us/phone", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const myPhoneData = await myPhoneResponse.json();
                const myPhone = myPhoneData;
                console.log(myPhone);

                const apiUrl = "https://www.picklehelp.us";
                const response = await fetch(`${apiUrl}/api/users`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiFriend[] = await response.json();

                const transformedFriends: Friend[] = data
                    .map((friend) => {
                        if (
                            typeof friend.name === "string" &&
                            typeof friend.phoneNumber === "string" &&
                            Array.isArray(friend.geocode) &&
                            friend.geocode.length === 2 &&
                            typeof friend.geocode[0] === "number" &&
                            typeof friend.geocode[1] === "number" &&
                            typeof friend.status === "string"
                        ) {
                            const validStatus = ["safe", "on-the-move", "pickle"].includes(friend.status)
                                ? (friend.status as userStatus)
                                : "safe";

                            return {
                                name: friend.name,
                                phoneNumber: friend.phoneNumber,
                                geocode: friend.geocode as [number, number],
                                popup: `${friend.name}'s location`,
                                location: "",
                                distance: "",
                                status: validStatus,
                            };
                        }
                        console.warn("Invalid friend data:", friend);
                        return null;
                    })
                    .filter((f): f is Friend => f !== null);

                const filteredFriends = transformedFriends.filter(
                    (friend) => friend.phoneNumber !== myPhone
                );
                const mainUserData = transformedFriends.find(
                    (friend) => friend.phoneNumber === myPhone
                );

                setFriends(filteredFriends);
                setMainUser(mainUserData || null);
            } catch (error) {
                console.error("Error fetching friends:", error);
                setFriends([]);
                setMainUser(null);
            }
        };

        fetchFriends();
    }, []);

    const handleUpdateMainUserStatus = (newStatus: userStatus) => {
        if (mainUser) {
            const updatedMainUser = {...mainUser, status: newStatus};
            setMainUser(updatedMainUser);

            console.log("Updated Main User Status:", updatedMainUser);
        }
    };

    return (
        <div id="container">
            <Map friends={friends}/>

            <AddFriendButton/>

            <ManualUpdate friends={friends}/>

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
    return <AppContent/>;
}
