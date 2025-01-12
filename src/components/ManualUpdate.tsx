import { useState } from "react";
import "./ManualUpdate.css";

type Friend = {
    name: string;
    phoneNumber: string;
    geocode: [number, number];
    popup: string;
    location: string;
    distance: string;
    status: "safe" | "on-the-move" | "pickle";
};

function ManualUpdate({ friends }: { friends: Friend[] }) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [friendList, setFriendList] = useState(friends); 

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const parseAndUpdateFriends = (text: string) => {
        const updates = text.split("\n").map((line) => {
            const [phoneNumber, location, lat, lng, status] = line.split(":");
            if (!phoneNumber || !location || !lat || !lng || !status) {
                console.warn(`Invalid data format: ${line}`);
                return null;
            }
            return {
                phoneNumber,
                location,
                geocode: [parseFloat(lat), parseFloat(lng)] as [number, number], 
                status: status as "safe" | "on-the-move" | "pickle",
            };
        }).filter(Boolean) as Array<{
            phoneNumber: string;
            location: string;
            geocode: [number, number];
            status: "safe" | "on-the-move" | "pickle";
        }>;

        const updatedFriends = friendList.map((friend) => {
            const update = updates.find((u) => u.phoneNumber === friend.phoneNumber);
            if (update) {
                return {
                    ...friend,
                    location: update.location,
                    geocode: update.geocode,
                    status: update.status,
                };
            }
            return friend;
        });

        setFriendList(updatedFriends);
        console.log("Updated Friends:", updatedFriends);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const textInputValue = (event.currentTarget.elements.namedItem("textInput") as HTMLInputElement).value;

        parseAndUpdateFriends(textInputValue);

        closeDialog();
    };

    return (
        <>
            <button className="dialogButton" onClick={openDialog}>
                Update Friends
            </button>

            {isDialogOpen && (
                <>
                    <div className="overlay" onClick={closeDialog}></div>
                    <div className="dialog-box">
                        <h2 style={{ color: "Black", margin: "0" }}>Update Locations</h2>
                        <form className="form" onSubmit={handleFormSubmit}>
                            <label htmlFor="textInput"></label>
                            <textarea
                                id="textInput"
                                name="textInput"
                                required
                                style={{ width: "100%", height: "100px" }}
                            ></textarea>
                            <button type="submit" className="dialogButton">
                                Update Locations
                            </button>
                            <button type="button" className="dialogButton" onClick={closeDialog}>
                                Close
                            </button>
                        </form>
                    </div>
                </>
            )}

            <div className="friend-list">
                <h3>Updated Friends</h3>
                <ul>
                    {friendList.map((friend) => (
                        <li key={friend.phoneNumber}>
                            <strong>{friend.name}</strong> - {friend.phoneNumber} - {friend.location} - {friend.status}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default ManualUpdate;
