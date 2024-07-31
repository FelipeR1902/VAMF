import React, { useState } from "react";
import auth from "../lib/auth-helper";
import { create } from "./api-shop.js";
import { Link, Navigate } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon,
  Avatar,
} from "@mui/material";
import FileUpload from "@mui/icons-material/AddPhotoAlternate";

const Root = styled.div`
  padding: 16px;
`;

const CardStyled = styled(Card)`
  max-width: 600px;
  margin: auto;
  text-align: center;
  margin-top: 24px;
  padding-bottom: 24px;
`;

const Title = styled(Typography)`
  margin-top: 16px;
  color: #2e7d32;
  font-size: 1.2em;
`;

const Error = styled(Typography)`
  color: red;
`;

const TextFieldStyled = styled(TextField)`
  margin-left: 8px;
  margin-right: 8px;
  width: 300px;
`;

const ButtonStyled = styled(Button)`
  margin: 16px;
`;

const AvatarStyled = styled(Avatar)`
  width: 60px;
  height: 60px;
  margin: auto;
`;

const NewShop = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    redirect: false,
    error: "",
  });

  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    const shopData = new FormData();
    values.name && shopData.append("name", values.name);
    values.description && shopData.append("description", values.description);
    values.image && shopData.append("image", values.image);

    create(
      {
        userId: auth.isAuthenticated().user._id,
      },
      {
        t: jwt.token,
      },
      shopData,
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Navigate to="/seller/shops" />;
  }

  return (
    <Root>
      <CardStyled>
        <CardContent>
          <Title>New Shop</Title>
          <AvatarStyled src={values.imageUrl} />
          <input
            accept="image/*"
            type="file"
            onChange={handleChange("image")}
          />
          <TextFieldStyled
            id="name"
            label="Name"
            value={values.name}
            onChange={handleChange("name")}
          />
          <br />
          <TextFieldStyled
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={values.description}
            onChange={handleChange("description")}
          />
          <br />
          {values.error && (
            <Error component="p">
              <Icon color="error">error</Icon>
              {values.error}
            </Error>
          )}
        </CardContent>
        <CardActions>
          <ButtonStyled
            color="primary"
            variant="contained"
            onClick={clickSubmit}
          >
            Create
          </ButtonStyled>
          <Link to="/seller/shops">
            <ButtonStyled variant="contained">Cancel</ButtonStyled>
          </Link>
        </CardActions>
      </CardStyled>
    </Root>
  );
};

export default NewShop;
