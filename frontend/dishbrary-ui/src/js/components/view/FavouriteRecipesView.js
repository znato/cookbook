import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import DishbraryRecipeCard from "../recipe/DishbraryRecipeCard"
import recipeService from "../../services/RecipeService";
import {LoadingState} from "../../services/constants/LoadingState";

import * as ArrayUtils from '../../services/utils/ArrayUtils';
import DishbraryProgress from "../general/DishbraryProgress";
import Pagination from "../general/Pagination";

const styles = theme => ({
    root: {
        minHeight: '100vh',
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        textAlign: "center",
    },
    recipeCardContainer: {
        textAlign: "left",
    }
});

class FavouriteRecipesView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            actualPage: 0,
            loadingState: LoadingState.none,
            recipes: [],
            totalElement: null,
            totalPages: null,
            errorMessage: null
        }
    }

    componentDidMount() {
        this.fetchUserFavouriteRecipes();
    }

    fetchUserFavouriteRecipes = (pageNumber) => {
        this.setState({
            loadingState: LoadingState.inProgress,
        });

        recipeService.fetchLoggedInUserPageableFavouriteRecipes(pageNumber)
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    this.setState({
                        loadingState: LoadingState.error,
                        errorMessage: jsonResponse.message
                    });
                } else {
                    this.setState({
                        loadingState: LoadingState.loaded,
                        recipes: jsonResponse.content.elements,
                        totalElement: jsonResponse.content.totalElements,
                        totalPages: jsonResponse.content.totalPages
                    });
                }
            });
    };

    changePage = (pageNumber) => {
        this.setState({actualPage: pageNumber})
        this.fetchUserFavouriteRecipes(pageNumber);
    }

    render() {
        const {classes} = this.props;
        const {loadingState, recipes, totalPages, actualPage, errorMessage} = this.state;

        let recipeCards = [];

        if (ArrayUtils.isNotEmpty(recipes)) {
            //in case we are on the last page and there is only one element on it after deletion we need to fetch the actualPage - 1 page
            //actual page indexed from zero while totalPages is the number of the pages
            if (recipes.length == 1 && actualPage == totalPages - 1) {
                recipeCards.push(
                    <DishbraryRecipeCard key={recipes[0].id} recipeData={recipes[0]} onDeleteSuccess={() => this.changePage(actualPage - 1)}/>
                );
            } else {
                recipeCards = recipes.map(recipe => {
                    return (<DishbraryRecipeCard key={recipe.id} recipeData={recipe}
                                                 onDeleteSuccess={() => this.fetchUserFavouriteRecipes(actualPage)}/>)
                })
            }
        }

        return (
            <Paper className={classes.root}>
                <Typography component="h1" variant="h5">
                    Kedvenc receptek
                </Typography>

                {
                    loadingState === LoadingState.inProgress
                        ?
                        <DishbraryProgress/>
                        :
                        loadingState === LoadingState.none
                            ?
                            ""
                            :
                            loadingState === LoadingState.error
                                ?
                                <Typography>{errorMessage}</Typography>
                                :
                                (
                                    <div id="recipe-card-container" className={classes.recipeCardContainer}>
                                        <Pagination totalPages={totalPages} actualPage={actualPage} onPageChange={this.changePage}>
                                            {recipeCards}
                                        </Pagination>
                                    </div>
                                )
                }
            </Paper>
        )
    }
}

export default withStyles(styles)(FavouriteRecipesView);