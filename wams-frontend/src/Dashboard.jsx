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

  useEffect(() => {
    // 📦 équipements
    fetch("http://localhost:8001/api/equipment/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEquipments(data.length);
      });

    // 📅 réservations
    fetch("http://localhost:8001/api/reservations/", {
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
    <div style={styles.container}>

      {/* TITRE */}
      <h2
        style={{
          fontSize: "60px",
          fontWeight: "900",
          marginBottom: "15px",
          background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Dashboard 📊
      </h2>

      <p style={styles.subtitle}>
        Architecture: Microservices + RabbitMQ
      </p>

      {/* 🔢 CARDS */}
      <div style={styles.grid}>

        {/* CARD ÉQUIPEMENTS */}
        <div
  style={styles.card}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.03)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>

          <h3
            style={{
              fontSize: "38px",
              fontWeight: "900",
              marginBottom: "10px",
            }}
          >
            📦 Équipements
          </h3>

          <p style={styles.number}>
            {equipments}
          </p>

        </div>

        {/* CARD RÉSERVATIONS */}
        <div
  style={styles.card}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.03)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>

          <h3
            style={{
              fontSize: "38px",
              fontWeight: "900",
              marginBottom: "10px",
            }}
          >
            📅 Réservations
          </h3>

          <p style={styles.number}>
            {reservations.length}
          </p>

        </div>

      </div>

      {/* 📊 GRAPH */}
      <div style={styles.chart}>

        <h3
          style={{
            marginBottom: "20px",
            fontSize: "40px",
            fontWeight: "900",
          }}
        >
          📊 Statut des réservations
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={stats}>
            <XAxis dataKey="name" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#6ae3ff"
              radius={[12, 12, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  subtitle: {
    color: "#cbd5e1",
    marginBottom: "35px",
    fontSize: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "25px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "40px",
    borderRadius: "25px",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 8px 30px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "0.3s",
    cursor: "pointer",
    transition: "0.3s",
transform: "scale(1)",
cursor: "pointer",
  },

  number: {
    fontSize: "85px",
    fontWeight: "900",
    marginTop: "20px",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  chart: {
    marginTop: "35px",
    background: "rgba(255,255,255,0.08)",
    padding: "35px",
    borderRadius: "25px",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 8px 30px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
};

export default Dashboard;