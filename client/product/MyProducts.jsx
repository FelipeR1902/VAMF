import React, { useEffect, useState } from "react";
import auth from "../lib/auth-helper";
import { listByShop } from "./api-product.js";
import { Link, Navigate, useParams } from "react-router-dom";
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

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const { shopId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByShop({ shopId }, signal).then((data) => {
      if (data && data.error) {
        setRedirect(true);
      } else {
        setProducts(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [shopId]);

  if (redirect) {
    return <Navigate to={"/seller/shops"} />;
  }

  return (
    <Root>
      <Title>My Products</Title>
      <Card>
        <CardContent>
          <List dense>
            {products.map((product, i) => (
              <span key={i}>
                <ListItem>
                  <ListItemAvatar>
                    <AvatarStyled src={`/api/product/image/${product._id}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={product.name}
                    secondary={`$ ${product.price}`}
                  />
                  <ListItemSecondaryAction>
                    <Link to={`/seller/product/edit/${product._id}`}>
                      <IconButton aria-label="Edit" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Link>
                    <Link to={`/seller/product/delete/${product._id}`}>
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

export default MyProducts;
