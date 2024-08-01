import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { read, update, remove } from './api-user.js';
import styled from '@emotion/styled';
import {
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
  TextField,
  Typography,
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

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
  margin: auto;
`;

export default function EditProfile() {
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    seller: false,
    error: '',
    NavigateToProfile: false,
    redirectToHome: false,
  });
  const [open, setOpen] = useState(false); // State for dialog
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ userId: jwt.user._id }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data.name, email: data.email, seller: data.seller });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [jwt.user._id]);

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      seller: values.seller || false,
    };
    update({ userId: jwt.user._id }, { t: jwt.token }, user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.updateUser(data, () => {
          setValues({ ...values, userId: data._id, NavigateToProfile: true });
        });
      }
    });
  };

  const handleDelete = () => {
    setOpen(false); // Close the dialog immediately
    remove({ userId: jwt.user._id }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.signout(() => console.log('deleted'));
        setValues({ ...values, redirectToHome: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheck = (event, checked) => {
    setValues({ ...values, seller: checked });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (values.NavigateToProfile) {
    return <Navigate to={'/user/' + values.userId} />;
  }

  if (values.redirectToHome) {
    return <Navigate to="/" />;
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
          <Typography variant="subtitle1" style={{ marginTop: 16, color: '#2e7d32' }}>
            Seller Account
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={values.seller}
                onChange={handleCheck}
                name="seller"
                color="primary"
              />
            }
            label={values.seller ? 'Active' : 'Inactive'}
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
            Submit
          </ButtonStyled>
          <ButtonStyled
            color="secondary"
            variant="contained"
            onClick={handleClickOpen}
          >
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
}
