import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Snackbar, Alert, IconButton } from '@mui/material';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const user = auth.currentUser;

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const docRef = doc(db, 'shops', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setShop(docSnap.data());
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

    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), where('shopId', '==', id));
      try {
        const querySnapshot = await getDocs(q);
        setProducts(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error('Error fetching products:', error);
        setAlertMessage('Error fetching products');
        setAlertSeverity('error');
        setOpen(true);
      }
    };

    fetchShop();
    fetchProducts();
  }, [id]);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setAlertMessage('Product deleted successfully');
      setAlertSeverity('success');
      setOpen(true);
      // Fetch the updated products list
      const q = query(collection(db, 'products'), where('shopId', '==', id));
      const querySnapshot = await getDocs(q);
      setProducts(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlertMessage('Error deleting product');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleDeleteShop = async () => {
    try {
      await deleteDoc(doc(db, 'shops', id));
      setAlertMessage('Shop deleted successfully');
      setAlertSeverity('success');
      setOpen(true);
      setTimeout(() => {
        navigate('/view-shops');
      }, 2000);
    } catch (error) {
      console.error('Error deleting shop:', error);
      setAlertMessage('Error deleting shop');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!shop) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">{shop.name}</Typography>
      {user.uid === shop.ownerId && (
        <div>
          <Button variant="contained" color="primary" component={Link} to={`/shop/${id}/add-product`} style={{ marginTop: '1rem' }}>
            Add Product
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDeleteShop} style={{ marginTop: '1rem', marginLeft: '1rem' }}>
            Delete Shop
          </Button>
        </div>
      )}
      <Grid container spacing={3} style={{ marginTop: '1rem' }}>
        {products.map(product => (
          <Grid item key={product.id} xs={12} md={6} lg={4}>
            <Card>
              {product.image && (
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="140"
                  image={product.image}
                  title={product.name}
                />
              )}
              <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography variant="body1">Description: {product.description}</Typography>
                <Typography variant="body1">Price: ${product.price}</Typography>
                <Typography variant="body1">Quantity: {product.quantity}</Typography>
                <Typography variant="body1">Category: {product.category}</Typography>
                {user.uid === shop.ownerId && (
                  <>
                    <IconButton component={Link} to={`/shop/${id}/edit-product/${product.id}`}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDeleteProduct(product.id)}><DeleteIcon /></IconButton>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShopDetail;
