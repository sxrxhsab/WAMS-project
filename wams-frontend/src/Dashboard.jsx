import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [equipments, setEquipments] = useState(0);
  const [reservations, setReservations] = useState([]);

  const token = localStorage.getItem("token");
  
<input
  placeholder="Rechercher équipement..."
  style={{
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "100%",
    marginBottom: "20px"
  }}
/>
  useEffect(() => {
    // 📦 équipements
    fetch("http://127.0.0.1:8000/api/equipment/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEquipments(data.length);
      });

    // 📅 réservations
    fetch("http://127.0.0.1:8000/api/reservations/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReservations(data);
      });
  }, []);

  // 📊 stats par statut
  const stats = [
    {
      name: "Pending",
      value: reservations.filter((r) => r.status === "pending").length,
    },
    {
      name: "Confirmed",
      value: reservations.filter((r) => r.status === "confirmed").length,
    },
    {
      name: "Cancelled",
      value: reservations.filter((r) => r.status === "cancelled").length,
    },
  ];

  return (
    
    <div>
      <h2 style={styles.title}>Dashboard 📊</h2>
<p>Architecture: Microservices + RabbitMQ</p>
      {/* 🔢 CARDS */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Équipements 📦</h3>
          <p style={styles.number}>{equipments}</p>
        </div>

        <div style={styles.card}>
          <h3>Réservations 📅</h3>
          <p style={styles.number}>{reservations.length}</p>
        </div>
      </div>

      {/* 📊 GRAPH */}
      <div style={styles.chart}>
        <h3>Statut des réservations</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  title: {
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "15px",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
  },

  number: {
    fontSize: "30px",
    fontWeight: "bold",
  },

  chart: {
    marginTop: "30px",
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "15px",
    backdropFilter: "blur(20px)",
  },
  title: {
  fontSize: "24px",
  fontWeight: "bold",
  background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
  WebkitBackgroundClip: "text",
  color: "transparent",
},
};

export default Dashboard;