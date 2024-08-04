import React, { useState } from "react";
import styled from "@emotion/styled";
import {useNavigate} from 'react-router-dom'
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

import {Link} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


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


const ButtonS = styled.div`
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


const StyledDialog = styled(Dialog)`
  & .MuiPaper-root {
    background-color: white;
    padding: 30px;
  }
`;


const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    open: false,
  });
 
  const navigate=useNavigate();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClose = () => {
    navigate("/signin")

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
        <ButtonS >
          <ButtonStyled
            color="primary"
            variant="contained"
            onClick={clickSubmit}
          >
            Sign Up
          </ButtonStyled>
        </ButtonS>
      </CardStyled>

        <StyledDialog  open={values.open}>
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>New account successfully created.</DialogContentText>
                </DialogContent>
                <DialogActions>
                        <Button onClick={handleClose}>
                        Sign In
                        </Button>
                    
                </DialogActions>
             </StyledDialog>
             

    </Root>
  );
};

export default Signup;
