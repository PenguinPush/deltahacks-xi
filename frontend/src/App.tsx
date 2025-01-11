import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
