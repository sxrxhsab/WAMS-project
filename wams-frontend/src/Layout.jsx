import { useState } from "react";

function Layout({ children, onLogout, searchTerm, setSearchTerm }) {
  const [active, setActive] = useState("dashboard");

  const handleNav = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🚀 WAMS</h2>

        <div style={styles.menu}>
          {[
            { id: "dashboard", label: "📊 Dashboard" },
            { id: "equipment", label: "📦 Équipements" },
            { id: "reservation", label: "📅 Réserver" },
            { id: "reservations", label: "📋 Mes Réservations" },
          ].map((item) => (
            <div
              key={item.id}
              style={active === item.id ? styles.active : styles.item}
              onClick={() => handleNav(item.id)}
              onMouseEnter={(e) => {
                if (active !== item.id)
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                if (active !== item.id)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <button
            style={styles.logout}
            onClick={onLogout}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Logout 🚪
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {/* 🔎 SEARCH GLOBAL */}
        <div style={styles.topbar}>
          <input
            placeholder="🔎 Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.search}
          />
        </div>

        {children}
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f1221, #1a1f3a)",
    color: "white",
  },

  sidebar: {
    width: "260px",
    padding: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    marginBottom: "20px",
    fontWeight: "bold",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  item: {
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#aaa",
    transition: "0.2s",
  },

  active: {
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(45deg,#7b61ff,#6ae3ff)",
    fontWeight: "bold",
    cursor: "pointer",
  },

  footer: {
    marginTop: "auto",
  },

  logout: {
    width: "100%",
    padding: "10px",
    background: "#e84118",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    transition: "0.2s",
  },

  main: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },

  topbar: {
    marginBottom: "20px",
  },

  search: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontSize: "14px",
  },
};

export default Layout;