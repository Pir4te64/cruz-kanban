import React from "react";

const TestButton: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => alert("¡Botón de prueba clickeado!")}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.5rem",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        BOTÓN DE PRUEBA
      </button>
    </div>
  );
};

export default TestButton;
