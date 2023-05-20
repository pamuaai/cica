import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Issue } from "../components/Issue";
import useAuth from "../hooks/useAuth";

export default function Issues() {
  const navigate = useNavigate();
  const { auth } = useAuth() as { auth: any };

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/");
    }
  }, [navigate, auth.accessToken]);
  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <Card border="warning">
            <Card.Header className="bg-warning">New</Card.Header>
            <Card.Body>
              <Issue></Issue>
              <Issue></Issue>
              <Issue></Issue>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card border="info">
            <Card.Header className="bg-info">In progress</Card.Header>
            <Card.Body>
              <Issue></Issue>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card border="danger">
            <Card.Header className="bg-danger">Review</Card.Header>
            <Card.Body>
              <Issue></Issue>
              <Issue></Issue>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card border="success">
            <Card.Header className="bg-success">Done</Card.Header>
            <Card.Body>
              <Issue></Issue>
              <Issue></Issue>
              <Issue></Issue>
              <Issue></Issue>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
