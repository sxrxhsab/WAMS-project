import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("http://localhost:8001/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem("token", data.access);
          window.location.reload();
        } else {
          alert("Erreur login ❌");
        }
      });
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={styles.title}>WAMS 🔐</h2>
        <p style={styles.subtitle}>Gestion intelligente des équipements</p>

        <input
          style={styles.input}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleLogin}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background:
      "linear-gradient(135deg, #0f1221, #1a1f3a, #2c3e50)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at top, rgba(123,97,255,0.2), transparent)",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "300px",
    padding: "25px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 8px 30px rgba(0,0,0,0.5)",
    color: "white",
    textAlign: "center",
  },

  title: {
    marginBottom: "5px",
  },

  subtitle: {
    fontSize: "12px",
    color: "#aaa",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },
};

export default Login;