import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import {red} from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import {Link} from "react-router-dom";

import * as ApplicationRoutes from '../../config/ApplicationRoutes';

import recipeService from "../../services/RecipeService";
import DishbraryAlertDialog from "../general/DishbraryAlertDialog";

const styles = theme => ({
    card: {
        maxWidth: 345,
        display: "inline-block",
        margin: "0 5px 0 5px",
        textAlign: "center",
        '& a': {
            color: "white",
            textDecoration: "none",
        }
    },
    cardActionForOwnRecipes: {
        float: "right"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
        backgroundSize: 'contain'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});

class DishbraryRecipeCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            recipeAddedToFavourites: false,
            recipeRemovedFromFavourites: false,
            alertData: {
                openAlert: false,
                alertDialogTitle: "",
                alertDialogContent: ""
            }
        }
    }

    openAlertDialog = (title, message) => {
        this.setState(
            {
                alertData: {
                    openAlert: true,
                    alertDialogTitle: title,
                    alertDialogContent: message
                }
            })
    }

    closeAlertDialog = () => {
        this.setState(
            {
                alertData: {
                    openAlert: false,
                    alertDialogTitle: "",
                    alertDialogContent: ""
                }
            })
    }

    deleteRecipe = (recipeId) => () => {
        recipeService.deleteRecipe(recipeId)
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    this.openAlertDialog("Hiba történt!", jsonResponse.message);
                } else {
                    //call additional callback if present
                    if (typeof this.props.onDeleteSuccess === "function") {
                        this.props.onDeleteSuccess(recipeId);
                    }
                }
            });
    }

    addRecipeToFavourites = (recipeId) => () => {
        recipeService.addRecipeToFavourites(recipeId)
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    this.openAlertDialog("Hiba történt!", jsonResponse.message);
                } else {
                    this.setState({
                        recipeAddedToFavourites: true,
                        recipeRemovedFromFavourites: false
                    });
                }
            });
    }

    deleteRecipeFromFavourites = (recipeId) => () => {
        recipeService.deleteRecipeFromFavourites(recipeId)
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    this.openAlertDialog("Hiba történt!", jsonResponse.message);
                } else {
                    this.setState({
                        recipeAddedToFavourites: false,
                        recipeRemovedFromFavourites: true
                    });
                }
            });
    }

    render() {
        const {classes, recipeData} = this.props;
        const {alertData, recipeAddedToFavourites, recipeRemovedFromFavourites} = this.state;

        const isRecipeFavourite = (recipeData.favourite && !recipeRemovedFromFavourites) || recipeAddedToFavourites;

        const {energyKcal, protein, fat, carbohydrate} = recipeData.calorieInfo;

        let recipeName = recipeData.name;

        if (recipeName.length > 20) {
            recipeName = recipeName.substring(0, 20) + "...";
        }

        return (
            <Card className={classes.card}>
                <Link to={ApplicationRoutes.viewRecipePath + "/" + recipeData.id}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                {recipeData.owner.username.charAt(0)}
                            </Avatar>
                        }
                        title={recipeName}
                        subheader={recipeData.creationDate}
                    />
                    <CardMedia
                        className={classes.media}
                        image={recipeService.getRecipeImagePath(recipeData.id, recipeData.coverImageFileName)}
                    />
                    <CardContent>
                        <Typography variant="body1" color="textSecondary" component="p">
                            Tápértékek egy adagban
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            Kalória: {energyKcal} kcal
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Fehérje: {protein} g
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Zsír: {fat} g
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Szénhidrát: {carbohydrate} g
                        </Typography>
                    </CardContent>
                </Link>
                {
                    recipeData.editable ?
                        <CardActions className={classes.cardActionForOwnRecipes} disableActionSpacing>
                            <React.Fragment>
                                <Link to={ApplicationRoutes.editRecipePath + "/" + recipeData.id}>
                                    <Tooltip title="Recept szerkesztése" aria-label="edit-recipe">
                                        <IconButton aria-label="edit recipe">
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                                <Tooltip title="Recept törlése" aria-label="del-recipe">
                                    <IconButton aria-label="delete recipe"
                                                onClick={this.deleteRecipe(recipeData.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            </React.Fragment>
                        </CardActions>
                        : ""
                }
                {
                    (recipeData.likeable && !isRecipeFavourite) || recipeRemovedFromFavourites ?
                        <CardActions disableActionSpacing>
                            <Tooltip title="Kedvencekhez adás" aria-label="add-to-fav">
                                <IconButton aria-label="add to favorites" onClick={this.addRecipeToFavourites(recipeData.id)}>
                                    <FavoriteIcon/>
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                        : ""
                }
                {
                    isRecipeFavourite ?
                        <CardActions disableActionSpacing>
                            <Tooltip title="Eltávolítás a kedvencekhez közül" aria-label="remove-from-fav">
                                <IconButton aria-label="remove from favorites" onClick={this.deleteRecipeFromFavourites(recipeData.id)}>
                                    <FavoriteIcon color="secondary"/>
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                        : ""
                }

                <DishbraryAlertDialog open={alertData.openAlert}
                                      dialogTitle={alertData.alertDialogTitle}
                                      dialogContent={alertData.alertDialogContent}
                                      onAlertDialogClose={this.closeAlertDialog}/>
            </Card>
        );
    }
}

export default withStyles(styles)(DishbraryRecipeCard);