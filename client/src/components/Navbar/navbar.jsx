import { Badge, Button, Image, Navbar } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import Logo from "../../assets/Yamaha_logo.svg";
import CustomToast from "../CustomToast/CustomToast";

const CustomNavbar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNotif, setIsNotif] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const data = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (data) {
      setIsLogged(true);
      setFirstName(data.user.firstName);
      setLastName(data.user.lastName);
      data?.user?.role === "ADMIN" ? setIsAdmin(true) : setIsAdmin(false);
    }
  }, [data]);

  const logout = () => {
    localStorage.removeItem("user");
    queryClient.clear();
    setIsLogged(false);
    navigate("/");
  };

  const [listening, setListening] = useState(false);

  useEffect(() => {
    const events = new EventSource("http://localhost:3000/events");
    if (!listening) {
      events.onmessage = (event) => {
        const { title, message } = JSON.parse(event.data);
        if (title && message) {
          toast.custom(
            <CustomToast title={title} message={message} isCommercial={true} />
          );
        }
      };
      setListening(true);
    }
  }, [listening]);

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
          <Navbar.Link isActive={location.pathname === "/chats"}>
            <NavLink to="/chats">Chats</NavLink>
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
          <Navbar.Link isActive={location.pathname === "/chats"}>
            <NavLink to="/chats">Chat</NavLink>
          </Navbar.Link>
          <Navbar.Link isActive={location.pathname === "/admin/notification"}>
            <NavLink to="/admin/notification">Notification</NavLink>
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
          {isAdmin ? (
            <Navbar.Item>
              <Badge color="success" variant="flat">
                {firstName} {lastName} - Admin
              </Badge>
            </Navbar.Item>
          ) : (
            <Navbar.Item>
              <Badge variant="flat">
                {firstName} {lastName} - User
              </Badge>
            </Navbar.Item>
          )}
          <Navbar.Item>
            <Button auto flat onPress={logout}>
              <NavLink>Logout</NavLink>
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      )}
    </Navbar>
  );
};

export default CustomNavbar;
