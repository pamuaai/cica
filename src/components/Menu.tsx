import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import "./Menu.scss";
import useAuth from "../hooks/useAuth";

export default function Menu() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { auth } = useAuth() as { auth: any };
  useEffect(() => {
    setLoggedIn(!!auth.accessToken);
  }, [auth.accessToken]);

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
                  Active Issues
                </NavLink>
                <NavLink
                  to="/inactive"
                  className="text-decoration-none text-white"
                >
                  Blocked & Denied issues
                </NavLink>
              </Nav>
              <Nav className="gap-2">
                <NavLink to="/logout" className="btn btn-danger">
                  Logout
                </NavLink>
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
