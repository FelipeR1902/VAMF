import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Snackbar, Alert, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const EditProduct = () => {
  const { id, productId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setQuantity(data.quantity);
          setCategory(data.category);
          setImageFile(data.image);
        } else {
          setAlertMessage('No such product!');
          setAlertSeverity('error');
          setOpen(true);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setAlertMessage('Error fetching product');
        setAlertSeverity('error');
        setOpen(true);
      }
    };

    fetchProduct();
  }, [productId]);

  const onDrop = (acceptedFiles) => {
    setImageFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/gif, image/bmp, image/webp'
  });

  const handleUpdateProduct = async () => {
    if (!auth.currentUser) {
      setAlertMessage('No user is signed in');
      setAlertSeverity('error');
      setOpen(true);
      return;
    }

    let imageURL = imageFile;
    if (imageFile && typeof imageFile !== 'string') {
      const imageRef = ref(storage, `products/${imageFile.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageURL = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Error uploading image:', error);
        setAlertMessage('Error uploading image');
        setAlertSeverity('error');
        setOpen(true);
        return;
      }
    }

    try {
      await updateDoc(doc(db, 'products', productId), {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
        image: imageURL,
        shopId: id,
        owner: auth.currentUser.uid,
      });
      setAlertMessage('Product updated successfully');
      setAlertSeverity('success');
      setOpen(true);
      setTimeout(() => {
        navigate(`/shop/${id}`);
      }, 2000); // Redirect to the shop detail page after 2 seconds
    } catch (error) {
      console.error('Error updating product:', error);
      setAlertMessage('Error updating product');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4">Edit Product</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box {...getRootProps()} sx={{ border: '2px dashed #ddd', padding: '20px', textAlign: 'center', marginTop: '1rem' }}>
        <input {...getInputProps()} />
        <Typography>Drag & drop a product image here, or click to select an image</Typography>
      </Box>
      {imageFile && <Typography variant="body2">{imageFile.name}</Typography>}
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleUpdateProduct}>
          Update Product
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

export default EditProduct;
