import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Button, Image } from "@nextui-org/react";

function CustomNavbar() {
  return (
    <Navbar>
      <Navbar.Brand>
        <Image
          width={50}
          src="https://play-lh.googleusercontent.com/CcTpODlVjkZJLgvRAoeTamFcJCYsjFtwgNK_SWGykfTzM0fLKPDSszws1Ga3kmxjhA"
          alt="logo"
        />
      </Navbar.Brand>
      {/* only if user is logged */}
      <Navbar.Content>
        <Navbar.Link>
          <NavLink to="/communication">Communication</NavLink>
        </Navbar.Link>
        <Navbar.Link href="#">
          <NavLink to="/salon">Salon</NavLink>
        </Navbar.Link>
        <Navbar.Link href="#">
          <NavLink to="/chat">chat</NavLink>
        </Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Link href="#">
          <NavLink to="/login">Login</NavLink>
        </Navbar.Link>
        <Navbar.Item>
          <Button auto flat as="a" href="#">
            <NavLink to="/signup">Signup</NavLink>
          </Button>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
}

export default CustomNavbar;
