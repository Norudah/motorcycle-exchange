import { NextUIProvider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import CustomNavbar from "./components/Navbar/navbar";
import AdminCommunication from "./routes/Admin/Communication/communication";
import AdminNotification from "./routes/Admin/notification/notification";
import AdminSalon from "./routes/Admin/Salon/salon";
import Chat from "./routes/Chat/chat";
import Communication from "./routes/Communication/communication";
import Home from "./routes/Home/home";
import Login from "./routes/Login/login";
import NotFound from "./routes/NotFound/notFound";
import Salon from "./routes/Salon/salon";
import Signup from "./routes/Signup/signup";

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
        <Toaster position="bottom-right" />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/communication" element={<Communication />} />
          <Route path="/salon" element={<Salon />} />
          {/* <Route path="/chat" element={<Chat />} /> */}
          {/* <Route path="/chat/:id" element={<Chat />} /> */}

          <Route path="chats" element={<Chat />}>
            <Route path="p/:contactId" element={<Chat />} />
            <Route path="g/:roomId" element={<Chat />} />
          </Route>

          <Route path="/admin/communication" element={<AdminCommunication />} />
          <Route path="/admin/salon" element={<AdminSalon />} />
          <Route path="/admin/notification" element={<AdminNotification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;