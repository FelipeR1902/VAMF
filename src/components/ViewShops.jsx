import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ViewShops = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'shops'));
        setShops(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        All Shops
      </Typography>
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

export default ViewShops;
