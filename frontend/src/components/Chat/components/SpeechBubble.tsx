import styled from "styled-components";
import React from "react";
import { Message } from "../../../stores/ChatStore";

interface SpeechBubble {
  currUsername: string;
  timestamp: string;
  username: string;
  body: string;
}
export const SpeechBubble = ({
  username,
  body,
  currUsername,
  timestamp,
}: SpeechBubble) => {
  const isFromUser = currUsername === username;
  const styles = getStyles({ isFromUser });

  const formattedTimestamp = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={styles.messageWrapper}>
      <div style={styles.speechBubble}>
        <div style={styles.username}>{username}</div>
        <div style={styles.message}>{body}</div>
        <div style={styles.timestamp}>{formattedTimestamp}</div>
      </div>
    </div>
  );
};

type StyleProps = {
  isFromUser: boolean;
};

const getStyles = ({
  isFromUser,
}: StyleProps): { [key: string]: React.CSSProperties } => ({
  speechBubble: {
    position: "relative",
    backgroundColor: isFromUser ? "#007bff" : "#e0e0e0",
    borderRadius: "15px",
    color: isFromUser ? "white" : "black",
    padding: "10px 15px",
    margin: "10px 0",
    maxWidth: "400px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    alignSelf: isFromUser ? "flex-end" : "flex-start",
  },
  username: {
    fontWeight: "bold", // Corrected fontWeight syntax
    marginBottom: "5px", // Corrected margin syntax
    textAlign: "left", // Corrected text-align syntax
  },
  message: {
    fontSize: "14px", // Corrected font-size to fontSize
    textAlign: "left", // Corrected text-align syntax
  },
  timestamp: {
    fontSize: "12px",
    textAlign: "right",
    color: isFromUser ? "lightgrey" : "darkgrey",
    marginTop: "5px",
  },
  messageWrapper: {
    display: "flex", // Corrected display property
    justifyContent: isFromUser ? "flex-end" : "flex-start", // Corrected logic to use `isFromUser`
    margin: "10px 0",
  },
});
