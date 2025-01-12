import "./App.css";
import ProfileCard from "./components/ProfileCard";
import Map from "./components/Map";
import ManualUpdate from "./components/ManualUpdate";
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

function App() {
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/friends/1234567890', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                const transformedFriends = data.map((friend: any) => ({
                    name: friend.name,
                    phoneNumber: friend.phoneNumber,
                    geocode: friend.geocode,
                    popup: `${friend.name}'s location`,
                    location: "", // Empty for now
                    distance: "", // Empty for now
                    status: friend.status as userStatus
                }));
                
                setFriends(transformedFriends);
            } catch (error) {
                console.error('Error fetching friends:', error);
                setFriends([]); // Set empty array in case of error
            }
        };

        fetchFriends();
    }, []);

    const addFriend = (friend: Friend) => {
        setFriends((prevFriends) => [...prevFriends, friend]);
    };

    return (
        <>
            <Map friends={friends} addFriend={addFriend} />
            {friends.map((friend) => (
                <ProfileCard
                    key={friend.phoneNumber}
                    name={friend.name}
                    location={friend.location}
                    distance={friend.distance}
                    status={friend.status}
                />
            ))}
            <ManualUpdate friends={friends}/>
        </>
    );
}

export default App;