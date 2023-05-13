import "./App.scss";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Issues } from "./pages/Issues";
import Menu from "./components/Menu";

function App() {
  return (
    <div className="App">
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
      </Routes>
    </div>
  );
}

export default App;
