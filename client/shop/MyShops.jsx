import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Edit from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import auth from '../lib/auth-helper';
import { listByOwner } from './api-shop';
import { useNavigate, Link } from 'react-router-dom';
import DeleteShop from './DeleteShop';

const Root = styled(Paper)`
  max-width: 600px;
  margin: auto;
  padding: 16px;
  margin-top: 40px;
`;

const Title = styled(Typography)`
  margin: 24px 0 24px 8px;
  color: ${props => props.theme.palette.protectedTitle};
  font-size: 1.2em;
`;

const AddButton = styled(Button)`
  float: right;
`;

const LeftIcon = styled(Icon)`
  margin-right: 8px;
`;

const StyleLink = styled(Link)`
  font-size: '1.2em';
  text-decoration: none;
`;

export default function MyShops() {
  const navigate=useNavigate();
  const [shops, setShops] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByOwner(
      { userId: jwt.user._id },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        setShops(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [jwt.user._id, jwt.token]);

  const removeShop = (shop) => {
    const updatedShops = [...shops];
    const index = updatedShops.indexOf(shop);
    updatedShops.splice(index, 1);
    setShops(updatedShops);
  };

  if (redirectToSignin) {
    return <Navigate to="/signin" />;
  }

  

  return (
    <div>
      <Root elevation={4}>
        <Title variant="h6">
          Your Shops
          <span>
            <Link to="/seller/shop/new">
              <AddButton color="primary" variant="contained">
                <LeftIcon>add_box</LeftIcon>
                New Shop
              </AddButton>
            </Link>
          </span>
        </Title>
        <List dense>
          {shops.map((shop, i) => (
            <span key={i}>
              <StyleLink to={"/seller/"+shop._id}>
                <ListItemAvatar>
                  <Avatar src={'/api/shops/logo/' + shop._id + '?' + new Date().getTime()} />
                </ListItemAvatar>
                <ListItemText primary={shop.name} secondary={shop.description} />
                {auth.isAuthenticated().user && auth.isAuthenticated().user._id === shop.owner._id && (
                  <ListItemSecondaryAction>
                    <Link to={"/seller/shop/edit/" + shop._id}>
                      <IconButton aria-label="Edit" color="primary">
                        <Edit />
                      </IconButton>
                    </Link>
                    <DeleteShop shop={shop} onRemove={removeShop} />
                  </ListItemSecondaryAction>
                )}
              </StyleLink>
              <Divider />
            </span>
          ))}
        </List>
      </Root>
    </div>
  );
}
