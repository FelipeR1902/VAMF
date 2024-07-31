import React from "react";
import styled from '@emotion/styled';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import logo from "./../assets/images/logo.jpg";

const CardStyled = styled(Card)`
  max-width: 600px;
  margin: auto;
  margin-top: 24px; /* Replace theme.spacing(5) */
`;

const Title = styled(Typography)`
  padding: 24px 20px 16px; /* Replace theme.spacing(3, 2.5, 2) */
  color: #2e7d32; /* Replace theme.palette.openTitle */
`;

const Media = styled(CardMedia)`
  min-height: 400px;
`;

export default function Home() {
  return (
    <CardStyled>
      <Title variant="h6">
        Home Page
      </Title>
      <Media image={logo} title="Logo" />
      <CardContent>
        <Typography variant="body2" component="p">
          Welcome to the GAME OVER home page.
        </Typography>
      </CardContent>
    </CardStyled>
  );
}
