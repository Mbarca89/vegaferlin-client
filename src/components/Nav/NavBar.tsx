import "./NavBar.css"
import { useRecoilState } from "recoil"
import { userState, logState, formState, alertModalState } from "../../app/store"
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import AlertModal from "../Modal/AlertModal";

const NavBar = () => {

    const [user, setUser] = useRecoilState(userState)
    let [isLogged, setLogged] = useRecoilState(logState)
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)
    const [showAlert, setShowAlert] = useRecoilState(alertModalState)
    const [expanded, setExpanded] = useState(false);

    const handleNavLinkClick = () => {
        setExpanded(false);
    };

    const navigate = useNavigate()

    const handleNavigate = (link:string) => {
        if(dirtyForm) {
            setShowAlert(true)
        } else {
            navigate(link)
        }
    }   

    const logOut = () => {
        setUser({
            id: 0,
            name: "",
            surname: "",
            userName: "",
            role: ""
        })

        localStorage.clear()
        setLogged(false)
        navigate("/")
    }

    return (
        <Container fluid className="p-0">
            <Navbar expand="lg" className="bg-body-tertiary nav_bar text-light" expanded={expanded}>
                <Container>
                    <Navbar.Brand>
                        <img
                            src="/images/logo.webp"
                            width="auto"
                            height="30"
                            className="d-inline-block align-top"
                            alt="Vega Ferlin Peridoncia"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                    <Navbar.Collapse id="basic-navbar-nav text-light">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => { handleNavigate("/home"); handleNavLinkClick() }}>Inicio</Nav.Link>
                            {user.role === "Administrador" && <NavDropdown title="Administrar" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => { handleNavigate("/users"); handleNavLinkClick() }}>Usuarios</NavDropdown.Item>
                            </NavDropdown>}
                            <Nav.Link onClick={() => { handleNavigate("/patients"); handleNavLinkClick() }}>Pacientes</Nav.Link>
                            <Nav.Link onClick={() => { handleNavigate("/agenda"); handleNavLinkClick() }}>Agenda</Nav.Link>
                        </Nav>
                        <hr />
                        <Navbar.Text>
                            Bienvenido {user.name}!
                        </Navbar.Text>
                        <Nav.Link className="m-2 text-dark" onClick={logOut}> Salir</Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {showAlert && <AlertModal/>}
        </Container>
    )
}

export default NavBar