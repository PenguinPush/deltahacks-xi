
import './ProfileCard.css'
function ProfileCard({ name, location, distance }: { name: string; location: string; distance: string }) {
    return (
        <>
        <div className='card'>
            <div className="profile">
                <p>{Array.from(name)[0]}</p>
            </div>
            <div className='info'>
                <h1 className="name">{name}</h1>
                <div className='secondaryInfo'>
                    <p className="location">{location}</p>
                    <p className="distance">{distance}</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProfileCard