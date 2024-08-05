import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

const MyShops = () => {
  const [shops, setShops] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const q = query(collection(db, 'shops'), where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        setShops(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, [user.uid]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Shops
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/create-shop" style={{ marginBottom: '1rem' }}>
        Add Shop
      </Button>
      <Grid container spacing={3}>
        {shops.map(shop => (
          <Grid item key={shop.id} xs={12} md={6} lg={4}>
            <Card>
              {shop.image && (
                <CardMedia
                  component="img"
                  alt={shop.name}
                  height="140"
                  image={shop.image}
                  title={shop.name}
                />
              )}
              <CardContent>
                <Typography variant="h5">{shop.name}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/shop/${shop.id}`}>
                  View Shop
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyShops;
