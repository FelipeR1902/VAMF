import React, { useState } from "react";
import styled from "@emotion/styled";
import { create } from "./api-user.js";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon,
} from "@mui/material";

const Root = styled.div`
  padding: 16px;
  margin: 10px;
  

`;

const CardStyled = styled(Card)`
  max-width: 600px;
  margin: auto;
  text-align: center;
  margin-top: 24px;
  padding-bottom: 24px;
`;

const Title = styled(Typography)`
  margin-top: 16px;
  color: #2e7d32;
  font-size: 1.2em;
`;

const Error = styled(Typography)`
  color: red;
`;


const buttons = styled.div`
  text-align: center;

`;

const TextFieldStyled = styled(TextField)`
  margin-top: 10px;
  margin-left: 8px;
  margin-right: 8px;
  width: 300px;
`;

const ButtonStyled = styled(Button)`
  margin: 16px;
  
`;

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    open: false,
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };

    create(user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", open: true });
      }
    });
  };

  return (
    <Root>
      <CardStyled>
        <CardContent>
          <Title>Sign Up</Title>
          <TextFieldStyled
            id="name"
            label="Name"
            value={values.name}
            onChange={handleChange("name")}
          />
          <br />
          <TextFieldStyled
            id="email"
            type="email"
            label="Email"
            value={values.email}
            onChange={handleChange("email")}
          />
          <br />
          <TextFieldStyled
            id="password"
            type="password"
            label="Password"
            value={values.password}
            onChange={handleChange("password")}
          />
          <br />
          {values.error && (
            <Error component="p">
              <Icon color="error">error</Icon>
              {values.error}
            </Error>
          )}
        </CardContent>
        <buttons >
          <ButtonStyled
            color="primary"
            variant="contained"
            onClick={clickSubmit}
          >
            Sign Up
          </ButtonStyled>
        </buttons>
      </CardStyled>
      {values.open && (
        <Typography variant="h6" color="primary">
          New account successfully created.
        </Typography>
      )}
    </Root>
  );
};

export default Signup;
