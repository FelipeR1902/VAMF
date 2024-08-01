import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { read, update, remove } from './api-user.js';
import styled from '@emotion/styled';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Avatar,
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
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
    redirectToHome: false,
  });
  const [open, setOpen] = useState(false); // State for dialog
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

  const handleDelete = () => {
    const jwt = auth.isAuthenticated();
    setOpen(false); // Close the dialog immediately
    remove({ userId }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.clearJWT(() => console.log('User Deleted'));
        setValues({ ...values, redirectToHome: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (values.redirectToProfile) {
    return <Navigate to={`/user/${userId}`} />;
  }

  if (values.redirectToHome) {
    return <Navigate to="/" />;
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
          <ButtonStyled color="secondary" variant="contained" onClick={handleClickOpen}>
            Delete
          </ButtonStyled>
        </CardActions>
      </CardStyled>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default EditProfile;
