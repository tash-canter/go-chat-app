import React from "react";
import styled from "styled-components";
import { Message as MessageInterface } from "../../api";

interface MessageProps {
    message: MessageInterface
}

export const Message = ({message}: MessageProps) => {
    const json = JSON.parse(message.body)
    console.log("HERE", json)
    return <StyledMessage className="Message">{json.body}</StyledMessage>;
}

const StyledMessage = styled('div')`
  display: block;
  background-color: white;
  margin: 10px auto;
  box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  border-radius: 5px;
  clear: both;

  &.me {
    color: white;
    float: right;
    background-color: #328ec4;
  }
  text-align: left
`;