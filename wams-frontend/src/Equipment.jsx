import { useEffect, useState } from "react";
import { useToast } from "./ToastContext";

function Equipment({ searchTerm = "" }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { showToast } = useToast() || {};
  const token = localStorage.getItem("token");

  // 🔎 FILTRE
  const filteredItems = items.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📦 FETCH
  const fetchEquipment = () => {
    fetch("http://localhost:8001/api/equipment/", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
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
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]));
  };

  useEffect(() => {
    if (token) fetchEquipment();
  }, [token]);

  // ➕ ADD
  const addEquipment = () => {
    if (!name || !description) {
      showToast?.("Remplis les champs ⚠️", "error");
      return;
    }

    fetch("http://localhost:8001/api/equipment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ name, description }),
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
        setName("");
        setDescription("");
        showToast?.("Équipement ajouté ✅", "success");
        fetchEquipment();
      })
      .catch(() => {
        showToast?.("Erreur ajout ❌", "error");
      });
  };

  // ❌ DELETE
  const deleteEquipment = (id) => {
    fetch(`http://localhost:8001/api/equipment/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
        }
        showToast?.("Supprimé ❌", "error");
        fetchEquipment();
      })
      .catch(() => showToast?.("Erreur suppression ❌", "error"));
  };

  return (
    <div style={styles.container}>

      <h2 style={styles.header}>
        Équipements 📦
      </h2>

      {/* FORM */}
      <div style={styles.form}>

        <input
          style={styles.input}
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          style={styles.add}
          onClick={addEquipment}
          onMouseEnter={(e) =>
            (e.target.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.target.style.transform = "scale(1)")
          }
        >
          Ajouter
        </button>

      </div>

      {/* LIST */}
      {filteredItems.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: "20px" }}>
          Aucun résultat 🔍
        </p>
      ) : (
        <div style={styles.grid}>

          {filteredItems.map((e) => (
            <div
              key={e.id}
              style={styles.card}
              onMouseEnter={(ev) =>
                (ev.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(ev) =>
                (ev.currentTarget.style.transform = "scale(1)")
              }
            >

              <h3 style={styles.title}>
                {e.name}
              </h3>

              <p style={styles.desc}>
                {e.description}
              </p>

              <button
                style={styles.delete}
                onClick={() => deleteEquipment(e.id)}
              >
                Supprimer
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "40px",
  },

  header: {
    fontSize: "55px",
    fontWeight: "900",
    marginBottom: "25px",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  form: {
    marginBottom: "30px",
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },

  input: {
    padding: "15px",
    borderRadius: "12px",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontSize: "16px",
    width: "250px",
    outline: "none",
  },

  add: {
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    border: "none",
    padding: "14px 24px",
    borderRadius: "14px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "17px",
    transition: "0.3s",
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
    width: "300px",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 8px 30px rgba(0,0,0,0.4)",
    transition: "0.3s",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  title: {
    fontWeight: "900",
    fontSize: "28px",
    marginBottom: "12px",
  },

  desc: {
    color: "#ddd",
    fontSize: "17px",
  },

  delete: {
    marginTop: "20px",
    background: "#ef4444",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
};

export default Equipment;