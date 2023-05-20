import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Issues from "./pages/Issues";
import Menu from "./components/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/inactive" element={<div>Blocked and denied</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
