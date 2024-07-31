import React, { useEffect, useState } from "react";
import auth from "../lib/auth-helper";
import styled from "@emotion/styled";
import { read } from "./api-user.js";
import { Navigate, useParams } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Button,
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

const AvatarStyled = styled(Avatar)`
  width: 100px;
  height: 100px;
  margin: auto;
`;

const Profile = () => {
  const [values, setValues] = useState({
    user: {},
    redirectToSignin: false,
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
        setValues({ ...values, user: data });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  if (values.redirectToSignin) {
    return <Navigate to="/signin" />;
  }

  return (
    <Root>
      <CardStyled>
        <CardContent>
          <Title>Profile</Title>
          <AvatarStyled src={`/api/users/photo/${values.user._id}`} />
          <Typography variant="h6">{values.user.name}</Typography>
          <Typography variant="body1">{values.user.email}</Typography>
          <Typography variant="body1">
            Joined {new Date(values.user.created).toDateString()}
          </Typography>
          {values.error && <Error>{values.error}</Error>}
        </CardContent>
        <CardActions>
          <Link to={`/user/edit/${values.user._id}`}>
            <Button color="primary" variant="contained">
              Edit Profile
            </Button>
          </Link>
        </CardActions>
      </CardStyled>
    </Root>
  );
};

export default Profile;
