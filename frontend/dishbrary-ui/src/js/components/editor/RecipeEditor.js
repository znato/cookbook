import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl/index';
import Input from '@material-ui/core/Input/index';
import InputLabel from '@material-ui/core/InputLabel/index';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';

import RichTextEditor from 'react-rte/lib/RichTextEditor';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import SuggestionSelect from './SuggestionSelect';
import IngredientEditorDialog from './IngredientEditorDialog';

import categoryService from '../../services/CategoryService';
import cuisineService from '../../services/CuisineService';
import ingredientService from '../../services/IngredientService';

import {LoadingState, LoadingStateByIndex} from '../../services/constants/LoadingState';
import Typography from "@material-ui/core/es/Typography";
import Button from "@material-ui/core/Button";

const styles = theme => ({
    form: {
        width: "80%",
        margin: "0 10% 0 10%",
    },
    sectionTitle: {
        color: "rgba(0, 0, 0, 0.54)",
        padding: 0,
        fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
        lineHeight: 1
    },
    section: {
        textAlign: "left",
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    fab: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    }
});

const richTextEditorToolbarConfig = {
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'},
        {label: 'Heading Large', style: 'header-one'},
        {label: 'Heading Medium', style: 'header-two'},
        {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
    ]
};

class RecipeEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            recipeName: null,
            ingredientEditorOpened: false,
            instructionValue: RichTextEditor.createEmptyValue(),
            categoriesLoading: LoadingState.none,
            categories: [],
            selectedCategories: [],
            ingredientsLoading: LoadingState.none,
            ingredients: [],
            selectedIngredients: [],
            cuisinesLoading: LoadingState.none,
            cuisines: [],
            selectedCuisines: []
        }
    }

    componentDidMount() {
        this.fetchSuggestionData();
    }

    fetchSuggestionData = () => {
        this.setState({
            categoriesLoading: LoadingState.inProgress,
            ingredientsLoading: LoadingState.inProgress,
            cuisinesLoading: LoadingState.inProgress,
        });

        categoryService.getAllCategories()
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    this.setState({categoriesLoading: LoadingState.error});
                } else {
                    this.setState({
                        categoriesLoading: LoadingState.loaded,
                        categories: jsonResponse.content.map(category => ({
                            value: category.id,
                            label: category.name
                        }))
                    });
                }
            });

        ingredientService.getAllIngredient()
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    this.setState({ingredientsLoading: LoadingState.error});
                } else {
                    this.setState({
                        ingredientsLoading: LoadingState.loaded,
                        ingredients: jsonResponse.content.map(ingredient => ({
                            value: ingredient.id,
                            label: ingredient.name,
                            unit: ingredient.unit
                        }))
                    });
                }
            });

        cuisineService.getAllCuisines()
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    this.setState({cuisinesLoading: LoadingState.error});
                } else {
                    this.setState({
                        cuisinesLoading: LoadingState.loaded,
                        cuisines: jsonResponse.content.map(cuisine => ({
                            value: cuisine.id,
                            label: cuisine.name
                        }))
                    });
                }
            });
    }

    handleInputChange = name => value => {
        this.setState({
            [name]: value,
        });
    };

    onInstructionValueChange = (instructionValue) => {
        this.setState({instructionValue});
    }

    openIngredientEditorDialog = () => {
        this.setState({ingredientEditorOpened: true})
    }

    onIngredientChange = (ingredientData) => {
        this.setState({
            selectedIngredients: [...this.state.selectedIngredients, ingredientData]
        });
    }

    onIngredientDialogClose = () => {
        this.setState({ingredientEditorOpened: false});
    }

    deleteIngredient = ingredientData => () => {
        var ingredientArray = this.state.selectedIngredients;

        for (var i = 0; i < ingredientArray.length; i++) {
            if (ingredientArray[i] === ingredientData) {
                ingredientArray.splice(i, 1);
                break;
            }
        }

        this.setState({
            selectedIngredients: ingredientArray
        })
    }

    onRecipeNameChange = (event) => {
        this.setState({recipeName: event.target.value})
    }

    render() {
        const {
            recipeName,
            instructionValue, categoriesLoading,
            categories, ingredientsLoading,
            ingredients, cuisinesLoading, cuisines,
            ingredientEditorOpened, selectedIngredients
        } = this.state;

        const highestLoadingStateIndex = Math.max(categoriesLoading.index, ingredientsLoading.index, cuisinesLoading.index);
        const overallLoadingState = LoadingStateByIndex[highestLoadingStateIndex];

        const readyToSave = recipeName && selectedIngredients.length > 0 && instructionValue.getEditorState().getCurrentContent().hasText();

        const {classes} = this.props;

        return (
            overallLoadingState === LoadingState.inProgress
                ?
                <CircularProgress disableShrink={true} className={classes.progress}/>
                :
                overallLoadingState === LoadingState.none
                    ?
                    ""
                    :
                    overallLoadingState === LoadingState.error ?
                        <Typography>Az oldal jelenleg nem elérhető! Kérjük próbálja később!</Typography>
                        :
                        (
                            <form className={classes.form}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="recipeName">Recept neve:</InputLabel>
                                    <Input id="recipeName" name="recipeName" autoFocus onChange={this.onRecipeNameChange}/>
                                </FormControl>

                                <FormControl margin="normal" fullWidth>
                                    <InputLabel htmlFor="preparationTime">Előkészítési ido:</InputLabel>
                                    <Input id="preparationTime" name="preparationTime"/>
                                </FormControl>

                                <FormControl margin="normal" fullWidth>
                                    <InputLabel htmlFor="cookTime">Elkészítési ido:</InputLabel>
                                    <Input id="cookTime" name="cookTime"/>
                                </FormControl>

                                <SuggestionSelect label={"Kategóriák:"}
                                                  placeholder="Válassz kategóriákat"
                                                  suggestions={categories}
                                                  multiSelect
                                                  onValueChange={this.handleInputChange('selectedCategories')}/>

                                <div className={classes.section}>
                                    <Typography className={classes.sectionTitle}>Hozzávalók:*</Typography>
                                    <div>
                                        {
                                            selectedIngredients.map((ingredientData, index) => {
                                                const ingredient = ingredientData.ingredient;
                                                const chipLabel = ingredientData.quantity + " " + ingredientData.selectedUnit + " " + ingredient.name;

                                                return <Chip className={classes.chip}
                                                             key={ingredient.id}
                                                             label={chipLabel}
                                                             onDelete={this.deleteIngredient(ingredientData)}/>
                                            })
                                        }

                                        <Fab color="primary" className={classes.fab}
                                             size={"small"}
                                             onClick={this.openIngredientEditorDialog}>
                                            <AddIcon/>
                                        </Fab>
                                    </div>
                                    <hr/>
                                </div>

                                <IngredientEditorDialog dialogOpen={ingredientEditorOpened}
                                                        onDialogClose={this.onIngredientDialogClose}
                                                        ingredients={ingredients}
                                                        onIngredientChange={this.onIngredientChange}/>

                                <SuggestionSelect label={"Konyha nemzetisége:"}
                                                  placeholder="Válassz országot"
                                                  suggestions={cuisines}
                                                  multiSelect
                                                  onValueChange={this.handleInputChange('selectedCuisines')}/>

                                <FormControl margin="normal" required fullWidth className={classes.section}>
                                    <div id="recipeInstructionLabel"
                                         className={classes.sectionTitle}>
                                        Leírás:*
                                    </div>
                                    <RichTextEditor onChange={this.onInstructionValueChange} value={instructionValue}
                                                    toolbarConfig={richTextEditorToolbarConfig}/>
                                </FormControl>

                                <Button
                                    disabled={!readyToSave}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Mentés
                                </Button>
                            </form>
                        )
        );
    }
}

export default withStyles(styles, {withTheme: true})(RecipeEditor);