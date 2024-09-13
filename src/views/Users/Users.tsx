import Nav from 'react-bootstrap/Nav';
import UserList from "../../components/Users/UserList/UserList";
import Register from "../../components/Users/Register/Register"
import { useState } from "react";

const Users = () => {

    const setTab = () => {
        setCurrentTab("users")
    }

    const [currentTab, setCurrentTab] = useState("users")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="users" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="users" onClick={() => setCurrentTab("users")}>Usuarios</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="register" onClick={() => setCurrentTab("register")}>Registrar usuario</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab === "users" ? <UserList /> : null}
                {currentTab === "register" ? <Register updateList={setTab}/> : null}
            </div>
        </div>
    )
}

export default Users