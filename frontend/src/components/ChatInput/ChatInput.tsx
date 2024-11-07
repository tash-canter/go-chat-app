import React from "react";
import styled from "styled-components";

interface ChatInputProps {
  send: (event: any) => void;
}

export const ChatInput = ({ send }: ChatInputProps) => {
  return (
    <div style={styles.chatInput}>
      <input onKeyDown={send} style={styles.input} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatInput: {
    width: "95%",
    display: "block",
    margin: "auto",
  },
  input: {
    padding: "10px",
    margin: 0,
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    width: "98%",
    boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)",
  },
};
