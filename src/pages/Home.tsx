import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkLoggedIn } from "../functions/auth";
import { Container } from "react-bootstrap";

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (checkLoggedIn()) {
      navigate("/issues");
    }
  }, [navigate]);

  return (
    <Container>
      <h1>Hello C.I.C.A.</h1>
      <h2>Van gazdád?</h2>
      <p>Ha még nincs, jelentkezz be, vagy regisztrálj!</p>
    </Container>
  );
}
