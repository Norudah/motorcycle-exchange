import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink, useLocation } from "react-router-dom";
import { Navbar, Button, Image, Switch, Badge } from "@nextui-org/react";

import Logo from "../../assets/Yamaha_logo.svg";
import {
  Bell,
  BellSlash,
  Check,
  ShieldCheck,
  SignIn,
  User,
} from "phosphor-react";

const CustomNavbar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNotif, setIsNotif] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();

  let data = queryClient.getQueryData({ queryKey: "user" });
  console.log(data);

  useEffect(() => {
    if (data) {
      setIsLogged(true);

      if (data?.user?.role === "ADMIN") {
        setIsAdmin(true);
      }
    }
  }, [data]);

  return (
    <Navbar>
      <Navbar.Content>
        <Navbar.Brand>
          <NavLink to="/">
            <Image width={50} src={Logo} alt="logo" />
          </NavLink>
        </Navbar.Brand>
      </Navbar.Content>

      {isLogged && !isAdmin && (
        <Navbar.Content variant="underline">
          <Navbar.Link isActive={location.pathname === "/communication"}>
            <NavLink to="/communication">Communication</NavLink>
          </Navbar.Link>
          <Navbar.Link isActive={location.pathname === "/salon"}>
            <NavLink to="/salon">Salon</NavLink>
          </Navbar.Link>
          <Navbar.Link isActive={location.pathname === "/chat"}>
            <NavLink to="/chat">Chat</NavLink>
          </Navbar.Link>
        </Navbar.Content>
      )}

      {isLogged && isAdmin && (
        <Navbar.Content variant="underline">
          <Navbar.Link isActive={location.pathname === "/admin/communication"}>
            <NavLink to="/admin/communication">Communication request</NavLink>
          </Navbar.Link>
          <Navbar.Link isActive={location.pathname === "/admin/salon"}>
            <NavLink to="/admin/salon">Managed chat room</NavLink>
          </Navbar.Link>
          <Navbar.Link isActive={location.pathname === "/chat"}>
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
          {isAdmin && (
            <Switch
              color="error"
              size="xl"
              iconOn={<BellSlash />}
              iconOff={<Bell />}
            />
          )}

          {isAdmin ? (
            <Navbar.Item>
              <Badge color="success" variant="flat">
                Admin
              </Badge>
            </Navbar.Item>
          ) : (
            <Navbar.Item>
              <Badge variant="flat">User</Badge>
            </Navbar.Item>
          )}
          <Navbar.Item>
            <Button auto flat as="a">
              <NavLink>Logout</NavLink>
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      )}
    </Navbar>
  );
};

export default CustomNavbar;
