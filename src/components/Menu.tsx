import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "./Menu.scss";
import useAuth from "../hooks/useAuth";

export default function Menu() {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { auth, setAuth } = useAuth() as { auth: any; setAuth: any };
  useEffect(() => {
    setLoggedIn(auth.accessToken);
  }, [setLoggedIn, auth]);

  function logout() {
    setAuth({});
    localStorage.removeItem("auth");
    navigate("/");
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="p-3"
    >
      <Container>
        <Navbar.Brand>🐈 C.I.C.A.</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {isLoggedIn ? (
            <>
              <Nav className="me-auto">
                <NavLink
                  to="/issues"
                  className="text-decoration-none text-white me-3"
                >
                  Issues
                </NavLink>
              </Nav>
              <Nav className="gap-2 align-items-center">
                <div className="text-white me-3">👤 {auth.user?.username}</div>
                <Button variant="danger" onClick={() => logout()}>
                  Kilépés
                </Button>
              </Nav>
            </>
          ) : (
            <>
              <Nav className="me-auto">
                <NavLink to="/" className="text-decoration-none text-white">
                  Home
                </NavLink>
              </Nav>

              <Nav className="gap-2">
                <NavLink to="/login" className="btn btn-primary">
                  Belépés
                </NavLink>
                <NavLink to="/register" className="btn btn-light text-black">
                  Regisztráció
                </NavLink>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
