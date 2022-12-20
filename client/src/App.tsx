import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import CustomNavbar from "./components/Navbar/navbar";

import Login from "./routes/Login/login";
import Signup from "./routes/Signup/signup";
import Communication from "./routes/Communication/communication";
import Chat from "./routes/Chat/chat";
import Salon from "./routes/Salon/salon";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <NextUIProvider>
        <CustomNavbar />
        <Routes>
          <Route path="/communication" element={<Communication />} />
          <Route path="/salon" element={<Salon />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
