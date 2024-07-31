import React, { useEffect, useState } from "react";
import auth from "../lib/auth-helper";
import styled from "@emotion/styled";
import { read, update } from "./api-user.js";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon,
  Avatar,
} from "@mui/material";

const Root = styled.div`
  padding: 16px;
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

const TextFieldStyled = styled(TextField)`
  margin-left: 8px;
  margin-right: 8px;
  width: 300px;
`;

const ButtonStyled = styled(Button)`
  margin: 16px;
`;

const AvatarStyled = styled(Avatar)`
  width: 60px;
  height: 60px;
  margin: auto;
`;

const EditProfile = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    redirectToProfile: false,
    error: "",
  });
  const { userId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ userId }, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          email: data.email,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };

    update(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      },
      user,
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirectToProfile: true });
      }
    });
  };

  if (values.redirectToProfile) {
    return <Navigate to={`/user/${userId}`} />;
  }

  return (
    <Root>
      <CardStyled>
        <CardContent>
          <Title>Edit Profile</Title>
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
        <CardActions>
          <ButtonStyled
            color="primary"
            variant="contained"
            onClick={clickSubmit}
          >
            Update
          </ButtonStyled>
          <Link to={`/user/${userId}`}>
            <ButtonStyled variant="contained">Cancel</ButtonStyled>
          </Link>
        </CardActions>
      </CardStyled>
    </Root>
  );
};

export default EditProfile;
