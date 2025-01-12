import { useState } from "react";

export default function AddFriendButton() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const apiUrl = 'https://www.picklehelp.us';
            console.log('Sending request with:', {
                userPhone: '1234567890',
                friendPhone: phoneNumber,
            });

            const response = await fetch(`${apiUrl}/api/friends/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userPhone: '1234567890', // Placeholder phone number
                    friendPhone: phoneNumber,
                }),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            setPhoneNumber('');
            closeDialog();
            alert('Friend request sent successfully!');
        } catch (error) {
            console.error('Detailed error:', error);
            if (error instanceof Error) {
                alert(`Failed to add friend: ${error.message}`);
            } else {
                alert('Failed to add friend: An unknown error occurred');
            }
        }
    };

    return (
        <>
            <button className="dialogButton" onClick={openDialog}>
                Add Friend
            </button>

            {isDialogOpen && (
                <>
                    <div className="overlay" onClick={closeDialog}></div>
                    <div className="dialog-box">
                        <h2 style={{ color: "Black", margin: "0" }}>Add Friend</h2>
                        <form className="form" onSubmit={handleFormSubmit}>
                            <label htmlFor="phoneInput">Enter Friend's Phone Number:</label>
                            <input
                                type="tel"
                                id="phoneInput"
                                name="phoneInput"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                required
                            />
                            <div className="dialog-buttons">
                                <button type="submit" className="dialogButton">
                                    Send Request
                                </button>
                                <button type="button" className="dialogButton" onClick={closeDialog}>
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}