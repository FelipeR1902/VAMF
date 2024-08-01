import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate instead of Redirect
import { remove } from './api-shop.js';
import auth from '../lib/auth-helper';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteShop = ({ shop, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const jwt = auth.isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const deleteShop = () => {
    remove(
      { shopId: shop._id },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setOpen(false);
        onRemove(shop);
        setRedirect(true);
      }
    });
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Navigate to="/shops" />;
  }

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{'Delete ' + shop.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your shop {shop.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteShop} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export default DeleteShop;
