import * as DishbraryServerRestClient from "./utils/DishbraryServerRestClient";

const createRecipePath = "recipe/create";
const getMyRecipesPath = "recipe/my-recipes"

class RecipeService {

    saveRecipe = (recipe) => {
        return DishbraryServerRestClient.put(createRecipePath, recipe);
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
            fetchUrl += "?" + pageNumber;
        }

        return DishbraryServerRestClient.get(fetchUrl);
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