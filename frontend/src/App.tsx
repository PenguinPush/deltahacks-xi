import React from "react";
import "./App.css";
import ProfileCard from "./components/ProfileCard";
import Map from "./components/Map";
import ManualUpdate from "./components/ManualUpdate";
import AddFriendButton from "./components/AddFriendButton";
import SMSButton from "./components/SMSButton";
import { useState, useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

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

function AppContent() {
    const { isAuthenticated, loginWithRedirect, logout, user, getAccessTokenSilently } = useAuth0();
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!isAuthenticated) {
                return;
            }

            try {
                const accessToken = await getAccessTokenSilently();
                const apiUrl = 'http://www.picklehelp.us';
                const response = await fetch(`${apiUrl}/api/friends/${user?.phoneNumber}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const transformedFriends = data.map((friend: Friend) => ({
                    name: friend.name,
                    phoneNumber: friend.phoneNumber,
                    geocode: friend.geocode,
                    popup: `${friend.name}'s location`,
                    location: "", // Empty for now
                    distance: "", // Empty for now
                    status: friend.status as userStatus,
                }));

                setFriends(transformedFriends);
            } catch (error) {
                console.error('Error fetching friends:', error);
                setFriends([]); // Set empty array in case of error
            }
        };

        fetchFriends();
    }, [isAuthenticated, getAccessTokenSilently, user]);

    if (!isAuthenticated) {
        return (
            <div>
                <h1>Welcome to PickleHelp</h1>
                <button onClick={() => loginWithRedirect()}>Log In</button>
            </div>
        );
    }

    return (
        <div id="container">
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
            </button>
            <Map friends={friends} />
            <SMSButton />
            <AddFriendButton />
            <ManualUpdate friends={friends} />
            {friends.map((friend) => (
                <ProfileCard
                    key={friend.phoneNumber}
                    name={friend.name}
                    location={friend.location}
                    distance={friend.distance}
                    status={friend.status}
                />
            ))}
        </div>
    );
}

export default function App() {
    return (
        <Auth0Provider
            domain="your-auth0-domain.auth0.com"
            clientId="your-auth0-client-id"
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
        >
            <AppContent />
        </Auth0Provider>
    );
}
