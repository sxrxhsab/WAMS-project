import { useEffect, useState } from "react";
import { useToast } from "./ToastContext";

function Equipment({ searchTerm = "" }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { showToast } = useToast() || {};
  const token = localStorage.getItem("token");

  // 🔎 FILTRE GLOBAL
  const filteredItems = items.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📦 FETCH
  const fetchEquipment = () => {
    fetch("http://127.0.0.1:8000/api/equipment/", {
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

    fetch("http://127.0.0.1:8000/api/equipment/", {
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
    fetch(`http://127.0.0.1:8000/api/equipment/${id}/`, {
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
      <h2 style={styles.header}>Équipements 📦</h2>

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
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Ajouter
        </button>
      </div>

      {/* LIST */}
      {filteredItems.length === 0 ? (
        <p style={{ color: "#aaa" }}>Aucun résultat 🔍</p>
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
              <h3 style={styles.title}>{e.name}</h3>
              <p style={styles.desc}>{e.description}</p>

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
  container: { marginTop: "20px" },

  header: {
    fontSize: "22px",
    marginBottom: "10px",
  },

  form: { marginBottom: "15px" },

  input: {
    padding: "8px",
    margin: "5px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  add: {
    padding: "10px",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.2s",
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    color: "white",
    borderRadius: "15px",
    padding: "15px",
    width: "250px",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
    transition: "0.3s",
  },

  title: {
    fontWeight: "bold",
    marginBottom: "5px",
  },

  desc: {
    color: "#ddd",
  },

  delete: {
    marginTop: "10px",
    background: "#e84118",
    color: "white",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Equipment;