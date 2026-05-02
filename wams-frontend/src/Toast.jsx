function Toast({ message, type }) {
  return (
    <div style={{ ...styles.toast, ...styles[type] }}>
      {message}
    </div>
  );
}

const styles = {
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    zIndex: 999,
    animation: "fadeIn 0.3s",
  },

  success: {
    background: "#2ecc71",
  },

  error: {
    background: "#e74c3c",
  },
};

export default Toast;