import { useEffect, useState } from "react";
import { useToast } from "./ToastContext";

function Reservation() {
  const [equipment, setEquipment] = useState([]);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");

  const { showToast } = useToast() || {};
  const token = localStorage.getItem("token");

  // 📦 FETCH équipements
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8001/api/equipment/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
        }
        return res.json();
      })
      .then((data) => {
        setEquipment(Array.isArray(data) ? data : []);
      })
      .catch(() => setEquipment([]));
  }, [token]);

  // 📅 RESERVER
  const handleReserve = () => {
    if (!selected || !date) {
      showToast?.("Remplis les champs ⚠️", "error");
      return;
    }

    fetch("http://localhost:8001/api/reservations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        equipment: parseInt(selected),
        date: new Date(date).toISOString(),
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
        }

        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        showToast?.("Réservation créée 📅", "success");

        // reset form
        setSelected("");
        setDate("");
      })
      .catch(() => {
        showToast?.("Erreur réservation ❌", "error");
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Réserver 📅</h2>

      <select
        style={styles.input}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Choisir équipement</option>
        {equipment.map((eq) => (
          <option key={eq.id} value={eq.id}>
            {eq.name}
          </option>
        ))}
      </select>

      <input
        style={styles.input}
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        style={styles.button}
        onClick={handleReserve}
        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        Réserver
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: "white",
    color: "#2f3640",
    padding: "20px",
    borderRadius: "12px",
    width: "260px",
    margin: "20px auto",
  },

  input: {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    color: "#2f3640",
  },

  title: {
    color: "#192a56",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.2s",
  },
};

export default Reservation;