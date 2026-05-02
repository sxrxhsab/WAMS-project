import { useEffect, useState } from "react";

function ReservationsList({ searchTerm = "" }) {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  // 📦 FETCH
  const fetchReservations = () => {
    fetch("http://127.0.0.1:8000/api/reservations/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
        }
        return res.json();
      })
      .then((data) => {
        setReservations(Array.isArray(data) ? data : []);
      })
      .catch(() => setReservations([]));
  };

  useEffect(() => {
    if (token) fetchReservations();
  }, [token]);

  // 🔥 UPDATE STATUS (DEBUG + FIX)
  const updateStatus = (id, newStatus) => {
    console.log("CLICK:", id, newStatus);

    fetch(`http://127.0.0.1:8000/api/reservations/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        console.log("STATUS:", res.status);

        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
        }

        if (!res.ok) throw new Error("Erreur PATCH");

        return res.json();
      })
      .then((data) => {
        console.log("UPDATED:", data);
        fetchReservations();
      })
      .catch((err) => {
        console.error("ERROR:", err);
      });
  };

  // 🎨 STYLE STATUS
  const getStatusStyle = (status) => {
    if (status === "confirmed") return styles.confirmed;
    if (status === "cancelled") return styles.cancelled;
    return styles.pending;
  };

  // 🔎 FILTER
  const filtered = reservations
    .filter((r) => {
      const name = r.equipment_name?.toLowerCase() || "";
      return name.includes(searchTerm.toLowerCase());
    })
    .filter((r) => {
      if (filter === "all") return true;
      return r.status === filter;
    });

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Mes Réservations 📋</h2>

      {/* 🔘 FILTER */}
      <div style={styles.filters}>
        {[
          { key: "all", label: "Tous" },
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmé" },
          { key: "cancelled", label: "Annulé" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={filter === f.key ? styles.activeFilter : styles.filterBtn}
          >
            {f.label} (
            {reservations.filter((r) =>
              f.key === "all" ? true : r.status === f.key
            ).length}
            )
          </button>
        ))}
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <p style={styles.empty}>Aucune réservation 🔍</p>
      ) : (
        filtered.map((r) => (
          <div
            key={r.id}
            style={styles.card}
            onMouseEnter={(ev) =>
              (ev.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(ev) =>
              (ev.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3 style={styles.title}>
              {r.equipment_name || "Équipement"} 📦
            </h3>

            <p style={styles.text}>
              📅 {new Date(r.date).toLocaleString()}
            </p>

            <span style={{ ...styles.status, ...getStatusStyle(r.status) }}>
              {r.status}
            </span>

            {/* 🔥 BOUTONS */}
            <div style={{ marginTop: "10px" }}>
              {r.status === "pending" && (
                <>
                  <button
                    style={styles.confirm}
                    onClick={() => updateStatus(r.id, "confirmed")}
                  >
                    Confirmer
                  </button>

                  <button
                    style={styles.cancel}
                    onClick={() => updateStatus(r.id, "cancelled")}
                  >
                    Annuler
                  </button>
                </>
              )}

              {r.status === "confirmed" && (
                <button
                  style={styles.cancel}
                  onClick={() => updateStatus(r.id, "cancelled")}
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { marginTop: "20px" },
  header: { marginBottom: "10px" },
  empty: { color: "#aaa" },

  filters: {
    display: "flex",
    gap: "5px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },

  filterBtn: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
  },

  activeFilter: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    color: "white",
    cursor: "pointer",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    color: "white",
    borderRadius: "15px",
    padding: "15px",
    margin: "10px auto",
    width: "260px",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
    transition: "0.3s",
  },

  title: { fontWeight: "bold" },
  text: { color: "#ddd" },

  status: {
    display: "inline-block",
    marginTop: "8px",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  pending: { background: "#f1c40f", color: "#000" },
  confirmed: { background: "#2ecc71", color: "#fff" },
  cancelled: { background: "#e74c3c", color: "#fff" },

  confirm: {
    marginRight: "5px",
    padding: "6px",
    background: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cancel: {
    marginTop: "10px",
    padding: "6px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ReservationsList;