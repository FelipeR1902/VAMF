import React, { useEffect, useState } from "react";
import auth from "../lib/auth-helper";
import { listByOwner } from "./api-shop.js";
import { Link, Navigate } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Icon,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const Root = styled.div`
  padding: 16px;
`;

const Title = styled(Typography)`
  margin-top: 16px;
  color: #2e7d32;
  font-size: 1.2em;
`;

const Error = styled(Typography)`
  color: red;
`;

const ButtonStyled = styled(Button)`
  margin: 16px;
`;

const AvatarStyled = styled(Avatar)`
  width: 60px;
  height: 60px;
  margin: auto;
`;

const MyShops = () => {
  const [shops, setShops] = useState([]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByOwner({ userId: auth.isAuthenticated().user._id }, signal).then(
      (data) => {
        if (data && data.error) {
          setRedirect(true);
        } else {
          setShops(data);
        }
      },
    );
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <Root>
      <Title>My Shops</Title>
      <Card>
        <CardContent>
          <List dense>
            {shops.map((shop, i) => (
              <span key={i}>
                <ListItem>
                  <ListItemAvatar>
                    <AvatarStyled src={`/api/shops/logo/${shop._id}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={shop.name}
                    secondary={shop.description}
                  />
                  <ListItemSecondaryAction>
                    <Link to={`/seller/shop/edit/${shop._id}`}>
                      <IconButton aria-label="Edit" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Link>
                    <Link to={`/seller/shop/delete/${shop._id}`}>
                      <IconButton aria-label="Delete" color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </span>
            ))}
          </List>
        </CardContent>
      </Card>
    </Root>
  );
};

export default MyShops;
