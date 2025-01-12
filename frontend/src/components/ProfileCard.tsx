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

    const { label, color } = getStatusLabel(status);

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

            <div className="status">
                <span
                    className="status-icon"
                    style={{
                        backgroundColor: color,
                    }}
                ></span>
                <span className="status-label" style={{ color }}>
                    {label}
                </span>
            </div>
        </div>
    );
}

export default ProfileCard;
