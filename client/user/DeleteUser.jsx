import React, { useEffect, useState } from "react";
import auth from "../lib/auth-helper";
import styled from "@emotion/styled";
import { read, remove } from "./api-user.js";
import { Redirect, useParams } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const Root = styled.div`
  margin: 24px;
`;

const CardStyled = styled(Card)`
  max-width: 600px;
  margin: "auto";
  text-align: "center";
  margin-top: 24px;
  padding-bottom: 24px;
`;

const Title = styled(Typography)`
  margin: 16px 0;
  color: #2e7d32;
  font-size: 1.2em;
`;

const Error = styled(Typography)`
  color: red;
`;

const DeleteUser = () => {
  const [values, setValues] = useState({
    user: {},
    redirect: false,
    error: "",
  });
  const { userId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ userId: userId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, user: data });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  const clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    remove(
      {
        userId: values.user._id,
      },
      { t: jwt.token },
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // auth.signout(() => console.log("deleted"));
        setValues({ ...values, redirect: true });
        auth.clearJWT(() => navigate("/"));
      }
    });
  };

  if (values.redirect) {
    return <Redirect to="/" />;
  }

  return (
    <Root>
      <CardStyled>
        <CardContent>
          <Title>Delete Account</Title>
          <Typography>Are you sure you want to delete this account?</Typography>
          {values.error && <Error>{values.error}</Error>}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit}>
            Confirm
          </Button>
          <Link to={"/"}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </CardStyled>
    </Root>
  );
};

export default DeleteUser;
