import styled from "styled-components";
import React from "react";
import { Message } from "../../api";

interface SpeechBubble extends Message {
  currUsername: string;
}
export const SpeechBubble = ({
  username,
  body,
  currUsername,
}: SpeechBubble) => {
  const isFromUser = currUsername === username;
  return (
    <MessageWrapper isFromUser={isFromUser}>
      <StyledSpeechBubble isFromUser={isFromUser}>
        <StyledUsername>{username}</StyledUsername>
        <StyledMessage>{body}</StyledMessage>
      </StyledSpeechBubble>
    </MessageWrapper>
  );
};

const StyledSpeechBubble = styled("div")`
  position: relative;
  background-color: ${(props) => (props.isFromUser ? "#007bff" : "#e0e0e0")};
  border-radius: 15px;
  color: ${(props) => (props.isFromUser ? "white" : "black")};
  padding: 10px 15px;
  margin: 10px 0;
  max-width: 400px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  align-self: ${(props) => (props.isFromUser ? "flex-end" : "flex-start")};
`;

const StyledUsername = styled("div")`
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
`;

const StyledMessage = styled("div")`
  font-size: 14px;
  text-align: left;
`;

const MessageWrapper = styled("div")`
  display: flex;
  justify-content: ${(props) =>
    props.isFromUser ? "flex-end" : "flex-start"}; /* Align based on user */
  margin: 10px 0;
`;
