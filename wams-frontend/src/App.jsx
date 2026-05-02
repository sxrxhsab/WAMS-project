import { useState } from "react";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Equipment from "./Equipment";
import Reservation from "./Reservation";
import ReservationsList from "./ReservationsList";
import Login from "./Login";

function App() {
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔐 pas connecté
  if (!token) return <Login />;

  // 🔓 connecté
  return (
    <Layout
      onLogout={() => {
        localStorage.removeItem("token");
        window.location.reload();
      }}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div id="dashboard">
        <Dashboard searchTerm={searchTerm} />
      </div>

      <div id="equipment">
        <Equipment searchTerm={searchTerm} />
      </div>

      <div id="reservation">
        <Reservation />
      </div>

      <div id="reservations">
        <ReservationsList searchTerm={searchTerm} />
      </div>
    </Layout>
  );
}

export default App;