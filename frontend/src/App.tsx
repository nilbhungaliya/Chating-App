import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from "./components/Room";
import Chat from "./components/Chat";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Room />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;