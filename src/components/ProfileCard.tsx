import { useState } from "react";
import "./ProfileCard.css";

type userStatus = "safe" | "on-the-move" | "pickle";

function ProfileCard({
    name,
    location,
    distance,
    status,
}: {
    name: string;
    location: string;
    distance: string;
    status: userStatus;
}) {
    const [currentStatus, setCurrentStatus] = useState<userStatus>(status);

    const getStatusLabel = (status: userStatus) => {
        switch (status) {
            case "safe":
                return { label: "Safe", color: "green" };
            case "on-the-move":
                return { label: "On the Move", color: "blue" };
            case "pickle":
                return { label: "In a Pickle", color: "red" };
            default:
                return { label: "Unknown", color: "gray" };
        }
    };

    const toggleStatus = () => {
        const statusOptions: userStatus[] = ["safe", "on-the-move", "pickle"];
        const currentIndex = statusOptions.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statusOptions.length;
        setCurrentStatus(statusOptions[nextIndex]);
    };

    const { label, color } = getStatusLabel(currentStatus);

    return (
        <div className="card">
            <div className="profile">
                <p className="profile-initial">{Array.from(name)[0]}</p>
            </div>
            <div className="info">
                <h1 className="name">{name}</h1>
                <div className="secondary-info">
                    <p className="location">{location}</p>
                    <p className="distance">{distance}</p>
                </div>
            </div>

            <div className="status" onClick={toggleStatus} style={{ cursor: "pointer" }}>
                <span
                    className="status-icon"
                    style={{backgroundColor: color}}/>
                <span className="status-label" style={{ color }}>
                    {label}
                </span>
            </div>
        </div>
    );
}

export default ProfileCard;
