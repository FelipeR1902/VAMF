import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Snackbar, Alert, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const EditShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('');
  const [shopImage, setShopImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const docRef = doc(db, 'shops', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setShopName(data.name);
          setShopImage(data.image);
        } else {
          setAlertMessage('No such shop!');
          setAlertSeverity('error');
          setOpen(true);
        }
      } catch (error) {
        console.error('Error fetching shop:', error);
        setAlertMessage('Error fetching shop');
        setAlertSeverity('error');
        setOpen(true);
      }
    };

    fetchShop();
  }, [id]);

  const onDrop = (acceptedFiles) => {
    setShopImage(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleUpdateShop = async () => {
    if (!auth.currentUser) {
      setAlertMessage('No user is signed in');
      setAlertSeverity('error');
      setOpen(true);
      return;
    }

    let shopImageURL = shopImage;
    if (shopImage && typeof shopImage !== 'string') {
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
      await updateDoc(doc(db, 'shops', id), {
        name: shopName,
        image: shopImageURL
      });
      setAlertMessage('Shop updated successfully');
      setAlertSeverity('success');
      setOpen(true);
      setTimeout(() => {
        navigate(`/shop/${id}`);
      }, 2000); // Redirect to the shop detail page after 2 seconds
    } catch (error) {
      console.error('Error updating shop:', error);
      setAlertMessage('Error updating shop');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4">Edit Shop</Typography>
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
        <Button variant="contained" color="primary" onClick={handleUpdateShop}>
          Update Shop
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

export default EditShop;
