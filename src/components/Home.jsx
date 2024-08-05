import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Welcome to VAMF Shop</Typography>
      <Typography variant="body1" paragraph>Sign up or sign in to create and manage your shops.</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Sign Up</Typography>
              <Typography variant="body2">Create a new account.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" component={Link} to="/signup">Sign Up</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Sign In</Typography>
              <Typography variant="body2">Access your account.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" component={Link} to="/signin">Sign In</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Create Shop</Typography>
              <Typography variant="body2">Start your own shop.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" component={Link} to="/create-shop">Create Shop</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">View Shops</Typography>
              <Typography variant="body2">Browse existing shops.</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" component={Link} to="/view-shops">View Shops</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
