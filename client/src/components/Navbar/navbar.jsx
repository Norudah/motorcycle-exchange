import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Button, Image, Switch } from "@nextui-org/react";
import Logo from "../../assets/Yamaha_logo.svg";

import { Check, Moon, ShieldCheck, SignIn, Sun, User } from "phosphor-react";

const CustomNavbar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Navbar>
      <Navbar.Content>
        <Navbar.Brand>
          <Image width={50} src={Logo} alt="logo" />
        </Navbar.Brand>

        <Switch
          iconOn={<Check />}
          iconOff={<SignIn />}
          onChange={() => setIsLogged(!isLogged)}
        />
        <Switch
          iconOn={<ShieldCheck />}
          iconOff={<User />}
          onChange={() => setIsAdmin(!isAdmin)}
        />
      </Navbar.Content>

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
