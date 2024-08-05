import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import CreateShop from './components/CreateShop';
import ViewShops from './components/ViewShops';
import Home from './components/Home';
import Profile from './components/Profile';
import MyShops from './components/MyShops';
import ShopDetail from './components/ShopDetail';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import EditShop from './components/EditShop';
import Layout from './components/Layout';
import UsersList from './components/UsersList';
import theme from './theme';
import './index.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const PrivateRoute = ({ children }) => {
  const [user] = useAuthState(auth);
  return user ? children : <Navigate to="/signin" />;
};

const LoggedInHome = () => {
  const [user] = useAuthState(auth);
  return user ? <Navigate to="/view-shops" /> : <Home />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LoggedInHome />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/create-shop" element={<PrivateRoute><CreateShop /></PrivateRoute>} />
            <Route path="/view-shops" element={<PrivateRoute><ViewShops /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/my-shops" element={<PrivateRoute><MyShops /></PrivateRoute>} />
            <Route path="/shop/:id" element={<PrivateRoute><ShopDetail /></PrivateRoute>} />
            <Route path="/shop/:id/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
            <Route path="/shop/:id/edit-product/:productId" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
            <Route path="/shop/:id/edit-shop" element={<PrivateRoute><EditShop /></PrivateRoute>} />
            <Route path="/users" element={<UsersList />} /> {/* Accessible to everyone */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
