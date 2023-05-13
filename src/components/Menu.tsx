import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { checkLoggedIn } from "../functions/auth";
import "./Menu.scss";

export default function Menu() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(checkLoggedIn());
  }, []);

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
          <Nav className="me-auto">
            <NavLink
              to={isLoggedIn ? "/issues" : "/"}
              className="text-decoration-none text-white"
            >
              Home
            </NavLink>
          </Nav>
          {!isLoggedIn && (
            <Nav className="gap-2">
              <NavLink to="/login" className="btn btn-primary">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-light text-black">
                Register
              </NavLink>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
