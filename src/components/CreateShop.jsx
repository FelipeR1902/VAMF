import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const CreateShop = () => {
  const [shopName, setShopName] = useState('');
  const [shopImage, setShopImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const onDrop = (acceptedFiles) => {
    setShopImage(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleCreateShop = async () => {
    const user = auth.currentUser;
    if (!user) {
      setAlertMessage('No user is signed in');
      setAlertSeverity('error');
      setOpen(true);
      return;
    }

    let shopImageURL = '';
    if (shopImage) {
      const imageRef = ref(storage, `shops/${shopImage.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, shopImage);
        shopImageURL = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Error uploading image:', error);
        setAlertMessage('Error uploading image');
        setAlertSeverity('error');
        setOpen(true);
        return;
      }
    }

    try {
      await addDoc(collection(db, 'shops'), {
        name: shopName,
        image: shopImageURL,
        ownerId: user.uid
      });
      setAlertMessage('Shop created successfully');
      setAlertSeverity('success');
      setOpen(true);
      setShopName('');
      setShopImage(null);
    } catch (error) {
      console.error('Error creating shop:', error);
      setAlertMessage('Error creating shop');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4">Create Shop</Typography>
      <TextField
        label="Shop Name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box {...getRootProps()} sx={{ border: '2px dashed #ddd', padding: '20px', textAlign: 'center', marginTop: '1rem' }}>
        <input {...getInputProps()} />
        <Typography>Drag & drop a shop image here, or click to select an image</Typography>
      </Box>
      {shopImage && <Typography variant="body2">{shopImage.name}</Typography>}
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleCreateShop}>
          Create Shop
        </Button>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateShop;
