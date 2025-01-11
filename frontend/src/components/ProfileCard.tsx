import "./ProfileCard.css";

type userStatus = "safe" | "on-the-move" | "pickle";

function ProfileCard({ name, location, distance, status }: { name: string; location: string; distance: string; status: userStatus }) {
    return (
        <>
            <div className="card">
                <div className="profile">
                    <p>{Array.from(name)[0]}</p>
                </div>
                <div className="info">
                    <h1 className="name">{name}</h1>
                    <div className="secondaryInfo">
                        <p className="location">{location}</p>
                        <p className="distance">{distance}</p>
                    </div>
                </div>
                <div className="status">
                    <span className={`status-icon ${status}`}></span>
                </div>
            </div>
        </>
    );
}

export default ProfileCard;
