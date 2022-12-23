import { BrowserRouter, Route, Routes } from "react-router-dom";

import { NextUIProvider } from "@nextui-org/react";
import CustomNavbar from "./components/Navbar/navbar";
import "./App.css";

import Home from "./routes/Home/home";
import Login from "./routes/Login/login";
import Signup from "./routes/Signup/signup";
import Communication from "./routes/Communication/communication";
import Chat from "./routes/Chat/chat";
import Salon from "./routes/Salon/salon";
import NotFound from "./routes/NotFound/notFound";
import AdminCommunication from "./routes/Admin/Communication/communication";
import AdminSalon from "./routes/Admin/Salon/salon";
import { useEffect, useState } from "react";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const data = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (data.user) {
      setIsLogged(true);
      if (data.user.role === "ADMIN") {
        setIsAdmin(true);
      }
    }
  }, [data]);

  return (
    <BrowserRouter>
      <NextUIProvider>
        <CustomNavbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/communication" element={<Communication />} />
          <Route path="/salon" element={<Salon />} />
          <Route path="/chat" element={<Chat />} />

          <Route path="/admin/communication" element={<AdminCommunication />} />
          <Route path="/admin/salon" element={<AdminSalon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
