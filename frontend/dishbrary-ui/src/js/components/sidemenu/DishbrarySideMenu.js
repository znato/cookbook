import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText'

import {Link} from "react-router-dom";
import {
    homePath,
    calorieTablePath,
    whatIsInTheFridgePath,
    createRecipePath,
    userOwnRecipesPath,
    favouriteRecipesPath,
    editAccountPath
} from '../../config/ApplicationRoutes';

import {Home, Kitchen, Create, AccountBox, Favorite, AssignmentInd} from '@material-ui/icons';
import CalorieIcon from '../icons/CalorieIcon';

import AuthSection from '../general/AuthSection';

const styles = {
    link: {
        textDecoration: "none",
    }
}

const menuItems = [
    {
        title: 'Home',
        icon: Home,
        linkTo: homePath
    },
    {
        title: 'Kalóriatáblázat',
        icon: CalorieIcon,
        linkTo: calorieTablePath
    },
    {
        title: 'Mi van a hűtőben?',
        icon: Kitchen,
        linkTo: whatIsInTheFridgePath
    },
    {
        title: 'Saját receptek',
        icon: AccountBox,
        linkTo: userOwnRecipesPath,
        authRequired: true,
    },
    {
        title: 'Kedvenc receptek',
        icon: Favorite,
        linkTo: favouriteRecipesPath,
        authRequired: true,
    },
    {
        title: 'Új recept',
        icon: Create,
        linkTo: createRecipePath,
        authRequired: true,
    },
    {
        title: 'Fiók szerkesztése',
        icon: AssignmentInd,
        linkTo: editAccountPath,
        authRequired: true,
    }
]

class DishbrarySideMenu extends React.Component {

    constructor(props) {
        super(props);
    }

    onOpen = () => {

    }

    onClose = () => {
        //call additional callback if present
        if (typeof this.props.onMenuClose === "function") {
            this.props.onMenuClose();
        }
    }

    render() {
        const {open, classes} = this.props;

        return (
            <SwipeableDrawer onClose={this.onClose} onOpen={this.onOpen} open={open}>
                <List>
                    {
                        menuItems.map((menuItem, index) => {
                            const menuHtml =
                                <ListItem button key={menuItem.title} id={index} onClick={this.onClose}>
                                    <ListItemIcon>
                                        {
                                            typeof menuItem.color === 'undefined'
                                                ?
                                                <menuItem.icon/>
                                                :
                                                <menuItem.icon nativeColor={menuItem.color}/>
                                        }
                                    </ListItemIcon>
                                    <Link to={menuItem.linkTo} className={classes.link}>
                                        <ListItemText primary={menuItem.title}/>
                                    </Link>
                                </ListItem>

                            if (menuItem.authRequired) {
                                return (
                                    <AuthSection key={"auth-" + menuItem.title}>
                                        {menuHtml}
                                    </AuthSection>
                                )
                            } else {
                                return menuHtml;
                            }


                        })}
                </List>
            </SwipeableDrawer>
        );
    }
}

export default withStyles(styles)(DishbrarySideMenu);