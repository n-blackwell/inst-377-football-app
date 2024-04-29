import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'

function MainNavBar() {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Football App</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/Teams">Teams</Nav.Link>
                    <Nav.Link href="/Players">Players</Nav.Link>
                    <Nav.Link href="/Leagues">Leagues</Nav.Link>
                    <Nav.Link href="/About">About</Nav.Link>
                    <Nav.Link href="/Help">Help</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default MainNavBar