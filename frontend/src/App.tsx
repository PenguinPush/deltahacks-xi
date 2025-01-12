import "./App.css";
import ProfileCard from "./components/ProfileCard";
import Map from "./components/Map";
import ManualUpdate from "./components/ManualUpdate";
import { useState } from "react";

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
    const [friends, setFriends] = useState<Friend[]>([
        {
            name: "Nickrod",
            phoneNumber: "123-456-7890",
            geocode: [43.265777, -79.918213],
            popup: "Nickrod's location.",
            location: "Vaughan, ON",
            distance: "63km",
            status: "safe",
        },
        {
            name: "Patrick",
            phoneNumber: "098-765-4321",
            geocode: [43.275777, -79.918213],
            popup: "Patrick's location.",
            location: "Toronto, ON",
            distance: "70km",
            status: "safe",
        },
    ]);

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
