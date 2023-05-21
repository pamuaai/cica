import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Issues from "./pages/Issues";
import Menu from "./components/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import useAuth from "./hooks/useAuth";

function App() {
  const { setAuth } = useAuth() as { setAuth: any };
  useEffect(() => {
    const authString = localStorage.getItem("auth");
    if (authString !== null) {
      setAuth(JSON.parse(authString));
    }
  }, [setAuth]);

  return (
    <div className="App">
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
