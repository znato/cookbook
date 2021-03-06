import * as DishbraryServerRestClient from "./utils/DishbraryServerRestClient";

const createRecipePath = "recipe/create";
const getMyRecipesPath = "recipe/my-recipes";
const getRandomRecipesPath = "recipe/recipes/random";
const getFavouriteRecipesPath = "recipe/favourites";

class RecipeService {

    saveRecipe = (recipe) => {
        return DishbraryServerRestClient.post(createRecipePath, recipe);
    }

    updateRecipe = (recipe) => {
        const updateRecipePath = "recipe/update/" + recipe.id;
        return DishbraryServerRestClient.put(updateRecipePath, recipe);
    }

    updateRecipeCoverImage = (recipeId, newCoverImageName) => {
        const updateRecipeCoverImagePath = "recipe/update/coverImage/" + recipeId;

        let recipeWrapper = {
            id: recipeId,
            coverImageFileName: newCoverImageName
        };

        return DishbraryServerRestClient.put(updateRecipeCoverImagePath, recipeWrapper);
    }

    deleteRecipe = (recipeId) => {
        const deleteRecipePath = `recipe/delete/${recipeId}`;
        return DishbraryServerRestClient.del(deleteRecipePath);
    }

    saveRecipeImages = (recipeId, formData) => {
        const uploadRecipeImagesPath = `resource/recipe/${recipeId}/image/upload`;
        return DishbraryServerRestClient.postFormData(uploadRecipeImagesPath, formData);
    }

    saveRecipeVideo = (recipeId, formData) => {
        const uploadRecipeVideoPath = `resource/recipe/${recipeId}/video/upload`;
        return DishbraryServerRestClient.postFormData(uploadRecipeVideoPath, formData);
    }

    fetchRecipeById = (recipeId) => {
        const getRecipeByIdPath = `recipe/${recipeId}`;
        return DishbraryServerRestClient.get(getRecipeByIdPath);
    }

    fetchLoggedInUserPageableRecipes = (pageNumber) => {
        let fetchUrl = getMyRecipesPath;

        if (pageNumber) {
            fetchUrl += "?page=" + pageNumber;
        }

        return DishbraryServerRestClient.get(fetchUrl);
    }

    fetchLoggedInUserPageableFavouriteRecipes = (pageNumber) => {
        let fetchUrl = getFavouriteRecipesPath;

        if (pageNumber) {
            fetchUrl += "?page=" + pageNumber;
        }

        return DishbraryServerRestClient.get(fetchUrl);
    }

    addRecipeToFavourites = (recipeId) => {
        const addToFavouritePath = `recipe/favourites/add/${recipeId}`;

        return DishbraryServerRestClient.post(addToFavouritePath);
    }

    deleteRecipeFromFavourites = (recipeId) => {
        const deleteFromFavouritePath = `recipe/favourites/remove/${recipeId}`;

        return DishbraryServerRestClient.del(deleteFromFavouritePath);
    }

    fetchRandomRecipes = () => {
        return DishbraryServerRestClient.get(getRandomRecipesPath);
    }

    searchRecipes = (context, searchCriteria, page) => {
        let searchRecipesPath = `recipe/search/${context}`;

        if (page) {
            searchRecipesPath += `?page=${page}`;
        }

        return DishbraryServerRestClient.post(searchRecipesPath, searchCriteria);
    }

    deleteAllRecipeImages = (recipeId) => {
        const deleteRecipeImagesPath = `resource/recipe/${recipeId}/image/deleteAll`;
        return DishbraryServerRestClient.del(deleteRecipeImagesPath);
    }

    deleteRecipeVideo = (recipeId) => {
        const deleteRecipeVideoPath = `resource/recipe/${recipeId}/video`;
        return DishbraryServerRestClient.del(deleteRecipeVideoPath);
    }

    getRecipeImagePath = (recipeId, imageName) => {
        return `rest/resource/image/recipe/${recipeId}/${imageName}`;
    }

    getRecipeVideoPath = (recipeId, videoName) => {
        return `rest/resource/video/recipe/${recipeId}/${videoName}`;
    }
}

export default new RecipeService();