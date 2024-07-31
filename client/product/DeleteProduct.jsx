import React, { useEffect, useState } from "react";
import auth from "../lib/auth-helper";
import styled from "@emotion/styled";
import { read, remove } from "./api-product.js";
import { Redirect, useParams } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const Root = styled.div`
  margin: 24px;
`;

const CardStyled = styled(Card)`
  max-width: 600px;
  margin: "auto";
  text-align: "center";
  margin-top: 24px;
  padding-bottom: 24px;
`;

const Title = styled(Typography)`
  margin: 16px 0;
  color: #2e7d32;
  font-size: 1.2em;
`;

const Error = styled(Typography)`
  color: red;
`;

const DeleteProduct = () => {
  const [values, setValues] = useState({
    product: {},
    redirect: false,
    error: "",
  });
  const { productId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ productId: productId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, product: data });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [productId]);

  const clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    remove(
      {
        productId: values.product._id,
      },
      { t: jwt.token },
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to="/seller/shops" />;
  }

  return (
    <Root>
      <CardStyled>
        <CardContent>
          <Title>Delete Product</Title>
          <Typography>Are you sure you want to delete this product?</Typography>
          {values.error && <Error>{values.error}</Error>}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit}>
            Confirm
          </Button>
          <Link to={"/seller/shops"}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </CardStyled>
    </Root>
  );
};

export default DeleteProduct;
