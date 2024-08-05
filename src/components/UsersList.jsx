import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUsers(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>
      <Grid container spacing={3}>
        {users.map(user => (
          <Grid item key={user.id} xs={12} md={6} lg={4}>
            <Card>
              {user.photoURL && (
                <CardMedia
                  component="img"
                  alt={user.displayName}
                  height="140"
                  image={user.photoURL}
                  title={user.displayName}
                />
              )}
              <CardContent>
                <Typography variant="h5">{user.displayName}</Typography>
                <Typography variant="body1">Email: {user.email}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UsersList;
