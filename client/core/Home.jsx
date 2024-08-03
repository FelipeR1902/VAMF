import React from "react";
import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
// import logo from "./../assets/images/logo.jpg";
import logo from "../src/assets/vamf.svg";

const CardStyled = styled(Card)`
  max-width: 600px;
  margin: auto;
  margin-top: 24px; /* Replace theme.spacing(5) */
  background-color: #BADBAD;
`;

const Title = styled(Typography)`
  padding: 24px 20px 16px; /* Replace theme.spacing(3, 2.5, 2) */
  color: #2e7d32; /* Replace theme.palette.openTitle */
  text-align: center;
`;

const Media = styled(CardMedia)`
  min-height: 500px;
`;

const Text = styled(Typography)`
  text-align: center;
  font-size: 1.2em;
`;

export default function Home() {
  return (
    <CardStyled>
      {/* <Title variant="h6">Home Page</Title> */}
      <Media image={logo} style={{width: '90%',margin: 'auto' }} title="Logo" />
      <CardContent>
        <Text variant="body2" component="p">
          Welcome to the <strong>GAME OVER</strong> home page.
        </Text>
      </CardContent>
    </CardStyled>
  );
}
