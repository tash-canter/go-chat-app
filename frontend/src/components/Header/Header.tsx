import React from "react";
import styled from "styled-components";

export const Header = () => (
  <StyledHeader className="header">
    <h2>Tash's Chat App {"<3"}</h2>
  </StyledHeader>
);

const StyledHeader = styled("div")`
  background-color: #15223b;
  width: 100%;
  margin: 0;
  padding: 10px;
  color: white;

  h2 {
    margin: 0;
    padding: 0;
  }
`;
