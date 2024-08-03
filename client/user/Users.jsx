import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { list } from "./api-user.js";
import { Link } from "react-router-dom";

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
  padding: 16px 10px;
  margin: 10px 10px;
`;

const Title = styled(Typography)`
  margin-top: 16px;
  margin-bottom: 10px;
  color: #2e7d32;
  font-size: 1.3em;
  font-weight: bold;
  text-align: center;
`;

const Error = styled(Typography)`
  color: red;
`;

const ButtonStyled = styled(Button)`
  margin: 16px;
`;



const ListItemStyled = styled(ListItem)`
  margin: auto;
  padding: 10px;
`;



const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && data.error) {
        setUsers([]);
      } else {
        setUsers(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Root>
      <Title>All Users</Title>
      <Card>
        <CardContent>
          <List dense>
            {users.map((user, i) => (
              <span key={i}>
                <ListItemStyled >
                  <ListItemAvatar>
                    <Avatar src={`/api/users/photo/${user._id}`} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />
                  <ListItemSecondaryAction className="ItemText" >
                    <Link to={`/user/edit/${user._id}`}>
                      <IconButton aria-label="Edit" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Link>
                    <Link to={`/user/delete/${user._id}`}>
                      <IconButton aria-label="Delete" color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </Link>
                  </ListItemSecondaryAction>
                </ListItemStyled>
                <Divider />
              </span>
            ))}
          </List>
        </CardContent>
      </Card>
    </Root>
  );
};

export default Users;
