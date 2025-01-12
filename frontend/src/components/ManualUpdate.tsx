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

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const textInputValue = (event.currentTarget.elements.namedItem("textInput") as HTMLInputElement).value;
        console.log("Form submitted with input:", textInputValue);
    };

    return (
        <>
            <button className="dialogButton" onClick={openDialog}>
                Open Dialog
            </button>

            {isDialogOpen && (
                <>
                    <div className="overlay" onClick={closeDialog}></div>
                    <div className="dialog-box">
                        <h2 style={{ color: "Black", margin: "0"}}>Dialog Box</h2>
                        <form className="form" onSubmit={handleFormSubmit}>
                            <label htmlFor="textInput">Enter Text:</label>
                            <input type="text" id="textInput" name="textInput" required />
                            <button type="submit" className="dialogButton">
                                Update Locations
                            </button>
                            <button className="dialogButton" onClick={closeDialog}>
                            Close
                        </button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}

export default ManualUpdate;
