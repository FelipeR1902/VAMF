import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Box, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/vamf.svg'; // Replace with your image path


const Layout = ({ children }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setIsSeller(docSnap.data().isSeller);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box component={Link} to="/" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="VAMF Shop" style={{ height: '50px', marginRight: '10px' }} />
          </Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/users">Users</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              {isSeller && <Button color="inherit" component={Link} to="/my-shops">View My Shops</Button>}
              <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/users">Users</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
              <Button color="inherit" component={Link} to="/signin">Sign In</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '2rem' }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
