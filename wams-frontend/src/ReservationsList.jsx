import { useEffect, useState } from "react";

function ReservationsList({ searchTerm = "" }) {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  // 📦 FETCH
  const fetchReservations = () => {
    fetch("http://localhost:8001/api/reservations/", {
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

  // 🔥 UPDATE STATUS
  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:8001/api/reservations/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
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
        fetchReservations();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 🎨 STATUS STYLE
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

      <h2 style={styles.header}>
        Mes Réservations 📋
      </h2>

      {/* FILTERS */}
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
            style={
              filter === f.key
                ? styles.activeFilter
                : styles.filterBtn
            }
          >
            {f.label} (
            {
              reservations.filter((r) =>
                f.key === "all"
                  ? true
                  : r.status === f.key
              ).length
            }
            )
          </button>
        ))}

      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <p style={styles.empty}>
          Aucune réservation 🔍
        </p>
      ) : (
        <div style={styles.grid}>

          {filtered.map((r) => (
            <div
              key={r.id}
              style={styles.card}
              onMouseEnter={(ev) =>
                (ev.currentTarget.style.transform =
                  "scale(1.05)")
              }
              onMouseLeave={(ev) =>
                (ev.currentTarget.style.transform =
                  "scale(1)")
              }
            >

              <h3 style={styles.title}>
                {r.equipment_name || "Équipement"} 📦
              </h3>

              <p style={styles.text}>
                📅 {new Date(r.date).toLocaleString()}
              </p>

              <span
                style={{
                  ...styles.status,
                  ...getStatusStyle(r.status),
                }}
              >
                {r.status}
              </span>

              <div style={styles.buttons}>

                {r.status === "pending" && (
                  <>
                    <button
                      style={styles.confirm}
                      onClick={() =>
                        updateStatus(r.id, "confirmed")
                      }
                    >
                      Confirmer
                    </button>

                    <button
                      style={styles.cancel}
                      onClick={() =>
                        updateStatus(r.id, "cancelled")
                      }
                    >
                      Annuler
                    </button>
                  </>
                )}

                {r.status === "confirmed" && (
                  <button
                    style={styles.cancel}
                    onClick={() =>
                      updateStatus(r.id, "cancelled")
                    }
                  >
                    Annuler
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "50px",
  },

  header: {
    fontSize: "55px",
    fontWeight: "900",
    marginBottom: "25px",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  empty: {
    color: "#aaa",
    fontSize: "20px",
  },

  filters: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  filterBtn: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },

  activeFilter: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "25px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    color: "white",
    borderRadius: "25px",
    padding: "25px",
    width: "320px",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 8px 30px rgba(0,0,0,0.4)",
    transition: "0.3s",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  title: {
    fontWeight: "900",
    fontSize: "28px",
    marginBottom: "15px",
  },

  text: {
    color: "#ddd",
    fontSize: "17px",
  },

  status: {
    display: "inline-block",
    marginTop: "15px",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
  },

  pending: {
    background: "#facc15",
    color: "#000",
  },

  confirmed: {
    background: "#22c55e",
    color: "#fff",
  },

  cancelled: {
    background: "#ef4444",
    color: "#fff",
  },

  buttons: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  confirm: {
    background: "#22c55e",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cancel: {
    background: "#ef4444",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ReservationsList;