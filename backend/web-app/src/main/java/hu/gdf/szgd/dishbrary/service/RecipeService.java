package hu.gdf.szgd.dishbrary.service;

import hu.gdf.szgd.dishbrary.RecipeSearchContextType;
import hu.gdf.szgd.dishbrary.db.criteria.RecipeSearchCriteria;
import hu.gdf.szgd.dishbrary.db.entity.Ingredient;
import hu.gdf.szgd.dishbrary.db.entity.Recipe;
import hu.gdf.szgd.dishbrary.db.entity.RecipeIngredient;
import hu.gdf.szgd.dishbrary.db.repository.FavouriteRecipeRepository;
import hu.gdf.szgd.dishbrary.db.repository.IngredientRepository;
import hu.gdf.szgd.dishbrary.db.repository.RecipeRepository;
import hu.gdf.szgd.dishbrary.security.SecurityUtils;
import hu.gdf.szgd.dishbrary.service.exception.DishbraryValidationException;
import hu.gdf.szgd.dishbrary.service.validation.RecipeValidatorUtil;
import hu.gdf.szgd.dishbrary.transformer.RecipeSearchCriteriaTransformer;
import hu.gdf.szgd.dishbrary.transformer.RecipeTransformer;
import hu.gdf.szgd.dishbrary.transformer.TransformerConfig;
import hu.gdf.szgd.dishbrary.web.model.PageableRestModel;
import hu.gdf.szgd.dishbrary.web.model.RecipeIngredientRestModel;
import hu.gdf.szgd.dishbrary.web.model.RecipeRestModel;
import hu.gdf.szgd.dishbrary.web.model.request.RecipeSearchCriteriaRestModel;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.File;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@Log4j2
public class RecipeService {

	private static final int MAX_RANDOM_RECIPES_SIZE = 10;
	private static final BigDecimal HUNDRED = new BigDecimal(100);

	private static final TransformerConfig TRANSFORMER_CONFIG_FOR_RECIPE_PREVIEW =
			TransformerConfig.includeOnlyFields("id", "name", "creationDate", "owner", "coverImageFileName", "calorieInfo", "editable", "likeable", "favourite");

	@Autowired
	private RecipeRepository recipeRepository;
	@Autowired
	private IngredientRepository ingredientRepository;
	@Autowired
	private FavouriteRecipeRepository favouriteRecipeRepository;
	@Autowired
	private RecipeTransformer recipeTransformer;
	@Autowired
	private ResourcePathService resourcePathService;
	@Autowired
	private RecipeSearchCriteriaTransformer criteriaTransformer;

	public PageableRestModel<RecipeRestModel> findRecipeByContextAndCriteria(RecipeSearchContextType context, RecipeSearchCriteriaRestModel searchCriteria, int pageNumber) {
		Long userId = SecurityUtils.getDishbraryUserFromContext().getId();

		Page<Recipe> pageableSearchResult = null;

		Pageable pageInfo = PageRequest.of(pageNumber, RecipeRepository.DEFAULT_PAGE_SIZE, Sort.by(Sort.Direction.DESC, "modificationDate"));

		RecipeSearchCriteria criteria = criteriaTransformer.transform(searchCriteria);

		switch (context) {
			case ALL_RECIPE:
				pageableSearchResult = recipeRepository.findBySearchCriteria(criteria, pageInfo);
				break;
			case USER_OWN_RECIPE:
				pageableSearchResult = recipeRepository.findByOwnerIdAndSearchCriteria(userId, criteria, pageInfo);
				break;
			case USER_FAVOURITE_RECIPES:
				pageableSearchResult = favouriteRecipeRepository.findFavouriteRecipesForUserBySearchCriteria(userId, criteria, pageInfo);
				break;
		}

		List<RecipeRestModel> restModels = recipeTransformer.transformAll(pageableSearchResult, TRANSFORMER_CONFIG_FOR_RECIPE_PREVIEW);

		return new PageableRestModel<>(restModels, pageableSearchResult.getTotalElements(), pageableSearchResult.getTotalPages());
	}

	@Transactional
	public RecipeRestModel findRecipeById(Long recipeId) {
		Optional<Recipe> recipe = recipeRepository.findByIdAndFetchIngredients(recipeId);

		if (!recipe.isPresent()) {
			throw new DishbraryValidationException("Nem létezik recept a következő azonosíto alatt: " + recipeId + "!");
		}

		RecipeRestModel recipeRestModel = recipeTransformer.transform(recipe.get());

		//in case recipe would be likeable check if user already liked it or not
		if (recipeRestModel.isLikeable()) {
			Set<Long> recipeIsSet = new HashSet<>();
			recipeIsSet.add(recipeId);

			Set<Long> favouriteRecipeIdSet = favouriteRecipeRepository.findFavouriteRecipeIdsByUserIdAndRecipeIds(
					SecurityUtils.getDishbraryUserFromContext().getId(),
					recipeIsSet
			);

			if (!favouriteRecipeIdSet.isEmpty()) {
				recipeRestModel.setLikeable(false);
				recipeRestModel.setFavourite(true);
			}
		}

		return recipeRestModel;
	}

	public PageableRestModel<RecipeRestModel> findRandomRecipes() {
		Long minRecipeId = recipeRepository.findMinId();
		Long maxRecipeId = recipeRepository.findMaxId();

		int resultSize = maxRecipeId < MAX_RANDOM_RECIPES_SIZE ? (int) (long) maxRecipeId : MAX_RANDOM_RECIPES_SIZE;

		Set<Long> randomIds = new HashSet<>(resultSize);

		while (randomIds.size() < resultSize) {
			Long randomId = (long) (Math.random() * maxRecipeId) + minRecipeId;

			randomIds.add(randomId);
		}

		List<RecipeRestModel> recipeRestModelList = new ArrayList<>();

		Set<Long> favouriteRecipeIdSet = favouriteRecipeRepository.findFavouriteRecipeIdsByUserIdAndRecipeIds(
				SecurityUtils.getDishbraryUserFromContext().getId(),
				randomIds
		);

		recipeRepository.findAllById(randomIds).forEach(recipe -> {
			RecipeRestModel model = recipeTransformer.transform(recipe, TRANSFORMER_CONFIG_FOR_RECIPE_PREVIEW);
			if (favouriteRecipeIdSet.contains(model.getId())) {
				model.setLikeable(false);
				model.setFavourite(true);
			}

			recipeRestModelList.add(model);
		});

		return new PageableRestModel<>(recipeRestModelList, recipeRestModelList.size(), 1);
	}

	public PageableRestModel<RecipeRestModel> findPageableRecipesByUserId(Long userId, int pageNumber) {
		Page<Recipe> userRecipesPage = recipeRepository.findByOwnerId(
				userId,
				PageRequest.of(pageNumber, RecipeRepository.DEFAULT_PAGE_SIZE, Sort.by(Sort.Direction.DESC, "modificationDate")));

		List<RecipeRestModel> restModels = recipeTransformer.transformAll(userRecipesPage, TRANSFORMER_CONFIG_FOR_RECIPE_PREVIEW);

		return new PageableRestModel<>(restModels, userRecipesPage.getTotalElements(), userRecipesPage.getTotalPages());
	}

	@Transactional
	public RecipeRestModel saveRecipe(RecipeRestModel recipeRestModel) {
		if (recipeRestModel.getId() != null) {
			recipeRestModel.setId(null);
		}

		RecipeValidatorUtil.validateRecipeForCreation(recipeRestModel);

		Recipe recipeToSave = recipeTransformer.transform(recipeRestModel);
		recipeToSave.setAdditionalInfo(createAdditionalInfo(recipeRestModel));

		return recipeTransformer.transform(recipeRepository.save(recipeToSave));
	}

	@Transactional
	public RecipeRestModel updateRecipe(RecipeRestModel recipeRestModel) {
		Objects.requireNonNull(recipeRestModel.getId(), "A receptet nem sikerült azonosítani mert hiányzik az id mező!");

		RecipeValidatorUtil.validateRecipeForCreation(recipeRestModel);

		Optional<Recipe> recipeToUpdateHolder = recipeRepository.findById(recipeRestModel.getId());
		if (!recipeToUpdateHolder.isPresent()) {
			throw new DishbraryValidationException("Nem létezik recept a következő azonosíto alatt: " + recipeRestModel.getId() + "!");
		}

		Recipe recipeToUpdate = recipeToUpdateHolder.get();

		recipeToUpdate = recipeTransformer.transformForUpdate(recipeToUpdate, recipeRestModel);
		recipeToUpdate.setAdditionalInfo(createAdditionalInfo(recipeRestModel));

		return recipeTransformer.transform(recipeRepository.save(recipeToUpdate));
	}

	@Transactional
	public void deleteRecipeById(Long recipeId) {
		try {
			recipeRepository.deleteById(recipeId);

			//after delete recipe from database also remove the resource directory
			String recipeResourceDirectoryRoot = resourcePathService.getFullResourceDirectoryRootPathForRecipe(SecurityUtils.getDishbraryUserFromContext().getId(), recipeId);

			File recipeRootDir = new File(recipeResourceDirectoryRoot);

			FileUtils.deleteDirectory(recipeRootDir);
		} catch (Throwable t) {
			log.error("Recipe with id[{}] could not be deleted!", recipeId, t);
			throw new RuntimeException("A recept torlése sikertelen!");
		}
	}

	private Recipe.AdditionalInfo createAdditionalInfo(RecipeRestModel recipeRestModel) {
		BigDecimal energyKcalSum = new BigDecimal(0);
		BigDecimal proteinSum = new BigDecimal(0);
		BigDecimal fatSum = new BigDecimal(0);
		BigDecimal carbohydrateSum = new BigDecimal(0);

		for (RecipeIngredientRestModel ingredientData : recipeRestModel.getIngredients()) {
			Optional<Ingredient> foundIngredient = ingredientRepository.findById(ingredientData.getIngredient().getId());
			if (!foundIngredient.isPresent()) {
				throw new DishbraryValidationException("Nem létezik hozzavaló a következő azonosíto alatt: " + ingredientData.getIngredient().getId() + "!");
			}

			Ingredient ingredient = foundIngredient.get();

			BigDecimal actualQuantityMultiplier = new BigDecimal(ingredientData.getQuantity())
					.multiply(ingredientData.getSelectedUnit().getMultiplierBigDecimalValue());

			//calorie related data stored for 100 g/ml if unit is not measured in pieces
			if (!RecipeIngredient.SelectableUnit.db.equals(ingredientData.getSelectedUnit())) {
				actualQuantityMultiplier = actualQuantityMultiplier.divide(HUNDRED);
			}

			energyKcalSum = energyKcalSum.add(new BigDecimal(ingredient.getEnergyKcal()).multiply(actualQuantityMultiplier));
			proteinSum = proteinSum.add(ingredient.getProtein().multiply(actualQuantityMultiplier));
			fatSum = fatSum.add(ingredient.getFat().multiply(actualQuantityMultiplier));
			carbohydrateSum = carbohydrateSum.add(ingredient.getCarbohydrate().multiply(actualQuantityMultiplier));
		}

		BigDecimal portion = new BigDecimal(recipeRestModel.getPortion());
		energyKcalSum = energyKcalSum.divide(portion, RoundingMode.HALF_UP);
		proteinSum = proteinSum.divide(portion, RoundingMode.HALF_UP);
		fatSum = fatSum.divide(portion, RoundingMode.HALF_UP);
		carbohydrateSum.divide(portion, RoundingMode.HALF_UP);

		return new Recipe.AdditionalInfo(energyKcalSum.toString(), proteinSum.toString(), fatSum.toString(), carbohydrateSum.toString());
	}

	@Transactional
	public void saveVideoToRecipe(RecipeRestModel recipeRestModel) {
		Optional<Recipe> recipe = recipeRepository.findById(recipeRestModel.getId());

		if (!recipe.isPresent()) {
			throw new DishbraryValidationException("Nem létezik recept a következő azonosíto alatt: " + recipeRestModel.getId() + "!");
		}

		Recipe recipeEntity = recipe.get();

		recipeEntity.setVideoFileName(recipeRestModel.getVideoFileName());

		recipeRepository.save(recipeEntity);
	}

	@Transactional
	public void saveImagesToRecipe(RecipeRestModel recipeRestModel) {
		Optional<Recipe> recipe = recipeRepository.findById(recipeRestModel.getId());

		if (!recipe.isPresent()) {
			throw new DishbraryValidationException("Nem létezik recept a következő azonosíto alatt: " + recipeRestModel.getId() + "!");
		}

		Recipe recipeEntity = recipe.get();

		recipeEntity.setCoverImageFileName(recipeRestModel.getCoverImageFileName());

		recipeEntity.setAdditionalImagesFileNames(recipeRestModel.getAdditionalImagesFileNames());

		recipeRepository.save(recipeEntity);
	}
}
