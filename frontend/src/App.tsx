import "./App.css";
import ProfileCard from "./components/ProfileCard";
import Map from "./components/Map";

type userStatus = "safe" | "on-the-move" | "pickle";

function App() {
    const dummyInfo = [
        { name: "Patrick Yeh", location: "Toronto, ON", distance: "70km", status: "safe" as userStatus },
        { name: "Nickrod Basiri", location: "Vaughan, ON", distance: "63km", status: "safe" as userStatus },
    ];

    return (
        <>
            <Map></Map>
            {dummyInfo.map((info) => (
                <ProfileCard {...info} />
            ))}
        </>
    );
}

export default App;
