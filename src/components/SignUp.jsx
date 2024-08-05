import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Snackbar, Alert, Box, Avatar, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setAvatar(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, open: openDropzone } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/gif, image/bmp, image/webp',
    noClick: true,
    noKeyboard: true
  });

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let avatarURL = '';
      if (avatar) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        const snapshot = await uploadBytes(avatarRef, avatar);
        avatarURL = await getDownloadURL(snapshot.ref);
      }

      await updateProfile(user, {
        displayName: name,
        photoURL: avatarURL,
      });

      await setDoc(doc(db, 'users', user.uid), {
        displayName: name,
        email: user.email,
        photoURL: avatarURL,
      });

      setAlertMessage('Sign-up successful!');
      setAlertSeverity('success');
      setOpen(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error signing up:', error);
      setAlertMessage('Error signing up');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4">Sign Up</Typography>
      <Box position="relative" display="inline-block" sx={{ margin: '20px 0' }}>
        <Avatar src={avatar ? URL.createObjectURL(avatar) : ''} alt="Avatar" sx={{ width: 100, height: 100 }} />
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
      <Box {...getRootProps()} display="none">
        <input {...getInputProps()} />
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
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleSignUp}>
          Sign Up
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

export default SignUp;
