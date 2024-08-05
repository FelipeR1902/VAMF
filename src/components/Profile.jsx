import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Avatar, Box, IconButton, Switch, FormControlLabel } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { auth, db, storage } from '../firebase';
import { updateProfile, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';

const Profile = () => {
  const user = auth.currentUser;
  const [name, setName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsSeller(docSnap.data().isSeller || false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const onDrop = (acceptedFiles) => {
    setAvatar(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, open: openDropzone } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/gif, image/bmp, image/webp',
    noClick: true,
    noKeyboard: true
  });

  const handleUpdateProfile = async () => {
    try {
      let avatarURL = user.photoURL;
      if (avatar) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        const snapshot = await uploadBytes(avatarRef, avatar);
        avatarURL = await getDownloadURL(snapshot.ref);
      }

      await updateProfile(user, {
        displayName: name,
        photoURL: avatarURL,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        displayName: name,
        photoURL: avatarURL,
        isSeller,
      });

      setAlertMessage('Profile updated successfully');
      setAlertSeverity('success');
      setOpen(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlertMessage('Error updating profile');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      setAlertMessage('Profile deleted successfully');
      setAlertSeverity('success');
      setOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error deleting profile:', error);
      setAlertMessage('Error deleting profile');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4">Profile</Typography>
      <Box position="relative" display="inline-block">
        <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 100, height: 100 }} />
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
          }}
          onClick={openDropzone}
        >
          <EditIcon />
        </IconButton>
      </Box>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        disabled
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Switch
            checked={isSeller}
            onChange={(e) => setIsSeller(e.target.checked)}
            color="primary"
          />
        }
        label="Set as Seller"
        sx={{ margin: '20px 0' }}
      />
      <Box {...getRootProps()} display="none">
        <input {...getInputProps()} />
      </Box>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
          Update Profile
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDeleteProfile}>
          Delete Profile
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

export default Profile;
