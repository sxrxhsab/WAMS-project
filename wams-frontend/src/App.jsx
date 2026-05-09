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
  if (!token) {
    return <Login />;
  }

  // 🔓 connecté
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      <Layout
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      >

        {/* DASHBOARD */}
        <section
          id="dashboard"
          className="mb-12"
        >
          <Dashboard searchTerm={searchTerm} />
        </section>

        {/* ÉQUIPEMENTS */}
        <section
          id="equipment"
          className="mb-12"
        >
          <Equipment searchTerm={searchTerm} />
        </section>

        {/* RÉSERVATION */}
        <section
          id="reservation"
          className="mb-12"
        >
          <Reservation />
        </section>

        {/* LISTE RÉSERVATIONS */}
        <section
          id="reservations"
          className="mb-12"
        >
          <ReservationsList searchTerm={searchTerm} />
        </section>

      </Layout>
    </div>
  );
}

export default App;