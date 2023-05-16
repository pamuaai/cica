import "./App.scss";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Issues } from "./pages/Issues";
import Menu from "./components/Menu";
import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/inactive" element={<div>Blocked and denied</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register</div>} />
      </Routes>
    </div>
  );
}

export default App;
