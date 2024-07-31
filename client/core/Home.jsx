import React from 'react';
import { makeStyles } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import logo from './../assets/images/logo.jpg';

const useStyles = makeStyles(theme => ({
 card: {
 maxWidth: 600,
 margin: 'auto',
 marginTop: theme.spacing(5),
 },
 title: {
 padding: theme.spacing(3, 2.5, 2),
 color: theme.palette.openTitle,
 },
 media: {
 minHeight: 400,
 },
}));
export default function Home(){ 
const classes = useStyles()
return (
<Card className={classes.card}>

 <Typography variant="h6" className={classes.title}>Home Page</Typography>
<CardMedia className={classes.media}
image={logo} title="Logo"/>
<CardContent>
<Typography variant="body2" component="p"> 
Welcome to the GAME OVER home page.
</Typography> 
</CardContent>
</Card> 
)
}

