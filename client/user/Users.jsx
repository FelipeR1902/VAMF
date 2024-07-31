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
                <ListItem>
                  <ListItemAvatar>
                    <AvatarStyled src={`/api/users/photo/${user._id}`} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />
                  <ListItemSecondaryAction>
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

export default Users;
