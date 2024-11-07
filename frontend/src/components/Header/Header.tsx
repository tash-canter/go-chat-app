import React from "react";

export const Header = () => (
  <div className="header" style={styles.header}>
    <h2 style={styles.h2}>Tash's Chat App {"<3"}</h2>
  </div>
);

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: "#15223b",
    width: "100%",
    margin: 0,
    padding: "10px",
    color: "white",
  },
  h2: {
    margin: 0,
    padding: 0,
  },
};
