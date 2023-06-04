import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { auth } = useAuth() as { auth: any };

  useEffect(() => {
    if (!!auth?.accessToken) {
      navigate("/issues");
    }
  }, [navigate, auth]);

  return (
    <Container>
      <h1>Hello C.I.C.A.</h1>
      <h2>Van gazdád?</h2>
      <p>Ha még nincs, jelentkezz be, vagy regisztrálj!</p>
    </Container>
  );
}
