import React from "react"
import ReactDOM from "react-dom"
import 'typeface-roboto';

import {HashRouter as Router, Route} from "react-router-dom";
import * as ApplicationRoutes from './config/ApplicationRoutes';

import DishbraryAppBar from './components/appbar/DishbraryAppBar';
import CalorieTableView from './components/view/CalorieTableView';
import MyRecipesView from './components/view/MyRecipesView';
import CreateRecipeView from './components/view/CreateRecipeView';
import RecipeView from './components/view/RecipeView';

function DishbraryApp() {
    return (
        <React.Fragment>
            <Router>
                <DishbraryAppBar/>

                <div id="dishbrary-page-content" style={{marginTop: "70px"}}>
                    <Route path={ApplicationRoutes.calorieTablePath} component={CalorieTableView} />

                    <Route path={ApplicationRoutes.userOwnRecipesPath} component={MyRecipesView}/>

                    <Route path={ApplicationRoutes.createRecipePath} component={CreateRecipeView}/>

                    <Route path={ApplicationRoutes.viewRecipePath + "/:recipeId"} component={RecipeView} />
                </div>
            </Router>
        </React.Fragment>
    );
}

ReactDOM.render(<DishbraryApp/>, document.getElementById("app-root"));