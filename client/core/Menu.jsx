import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import auth from "../lib/auth-helper";
import styled from "@emotion/styled";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../src/assets/vamf.svg";

const isActive = (location, path) => {  
  return location.pathname === path
    ? { color: "#FFBF46" }
    : { color: "#ffffff" };
};

const Logo = styled.img`
  width: 50px;
  height: 50px;
`;

const isPartActive = (location, path) => {
  if (location.pathname.includes(path)) return { color: "#bef67a" };
  else return { color: "#ffffff" };
};

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Logo src={logo}/>
        <Link to="/">
          <Button style={isActive(location, "/")}>Home</Button>
        </Link>
        <Link to="/users">
          <Button style={isActive(location, "/users")}>Users</Button>
        </Link>
        {!auth.isAuthenticated() && (
          <span>
            <Link to="/signup">
              <Button style={isActive(location, "/signup")}>Sign up</Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive(location, "/signin")}>Sign In</Button>
            </Link>
          </span>
        )}
        {auth.isAuthenticated() && (
          <span>
            {auth.isAuthenticated().user &&
              auth.isAuthenticated().user.seller && (
                <Link to="/seller/shops">
                  <Button style={isPartActive(location, "/seller/")}>
                    My Shops
                  </Button>
                </Link>
              )}
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
              <Button
                style={isActive(
                  location,
                  "/user/" + auth.isAuthenticated().user._id,
                )}
              >
                My Profile
              </Button>
            </Link>
            <Button
              color="inherit"
              onClick={() => {
                auth.clearJWT(() => navigate("/"));
              }}
            >
              Sign out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
}
