import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Button, Image } from "@nextui-org/react";
import Logo from "../../assets/Yamaha_logo.svg";

// if user is logged in as user, display the navbar with the following links:
// - communication
// - salon
// - chat
// - logout
// if user is logged in as admin, display the navbar with the following links:
// - communication
// - salon
// - chat
// - admin
// - logout
// if user is not logged in, display the navbar with the following links:
// - communication
// - salon
// - chat
// - login
// - signup

const CustomNavbar = () => {
  const [isLogged, setIsLogged] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <Navbar>
      <Navbar.Brand>
        <Image width={50} src={Logo} alt="logo" />
      </Navbar.Brand>

      {isLogged && !isAdmin && (
        <Navbar.Content>
          <Navbar.Link>
            <NavLink to="/communication">Communication</NavLink>
          </Navbar.Link>
          <Navbar.Link href="#">
            <NavLink to="/salon">Salon</NavLink>
          </Navbar.Link>
          <Navbar.Link href="#">
            <NavLink to="/chat">Chat</NavLink>
          </Navbar.Link>
        </Navbar.Content>
      )}

      {isLogged && isAdmin && (
        <Navbar.Content>
          <Navbar.Link>
            <NavLink to="/admin/communication">
              Demande De Communication
            </NavLink>
          </Navbar.Link>
          <Navbar.Link href="#">
            <NavLink to="/admin/salon">Gestion des Salons</NavLink>
          </Navbar.Link>
          <Navbar.Link href="#">
            <NavLink to="/chat">Chat</NavLink>
          </Navbar.Link>
        </Navbar.Content>
      )}

      {!isLogged ? (
        <Navbar.Content>
          <Navbar.Link href="#">
            <NavLink to="/login">Login</NavLink>
          </Navbar.Link>
          <Navbar.Item>
            <Button auto flat as="a">
              <NavLink to="/signup">Signup</NavLink>
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      ) : (
        <Navbar.Content>
          <Navbar.Item>
            <Button auto flat as="a">
              <NavLink to="/logout">Logout</NavLink>
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      )}
    </Navbar>
  );
};

export default CustomNavbar;
