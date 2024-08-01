import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { read, update } from './api-user.js';
import styled from '@emotion/styled';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';

const Root = styled.div`
  padding: 16px;
`;

const AvatarStyled = styled(Avatar)`
  width: 100px;
  height: 100px;
  margin: auto;
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
  margin: auto;
`;

const EditProfile = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    redirectToProfile: false,
    error: '',
  });
  const { userId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const jwt = auth.isAuthenticated();
    if (!jwt) {
      setValues({ ...values, redirectToProfile: true });
      return;
    }

    read({ userId }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  const clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };

    update({ userId }, { t: jwt.token }, user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirectToProfile: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  if (values.redirectToProfile) {
    return <Navigate to={`/user/${userId}`} />;
  }

  return (
    <Root>
      <CardStyled>
        <CardContent>
          <Title>Edit Profile</Title>
          <AvatarStyled src={`/api/users/photo/${userId}`} />
          <TextFieldStyled
            id="name"
            label="Name"
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <br />
          <TextFieldStyled
            id="email"
            type="email"
            label="Email"
            value={values.email}
            onChange={handleChange('email')}
            margin="normal"
          />
          <br />
          <TextFieldStyled
            id="password"
            type="password"
            label="Password"
            value={values.password}
            onChange={handleChange('password')}
            margin="normal"
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
          <ButtonStyled color="primary" variant="contained" onClick={clickSubmit}>
            Submit
          </ButtonStyled>
        </CardActions>
      </CardStyled>
    </Root>
  );
};

export default EditProfile;
