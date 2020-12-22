import { showError, showSuccess } from '../js/notificator.js';
import { getAll, getItemById, createItem, editItem, deleteItem, likeItem, checkResult, setCategoryRelation } from '../js/requests.js';

export default async function home() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs'),
        catalog: await this.load('../templates/catalog/catalog.hbs'),
        recipe: await this.load('../templates/catalog/recipe.hbs'),
    };

    const context = Object.assign({}, this.app.userData);
    
    const category = this.params.search;
    
    try {
        if (this.app.userData.username) {
            
            let items = await getAll();
            checkResult(items)

            if (category) {
               items = items.filter(i => i.meal.toLowerCase() == category.toLowerCase())
            }
        console.log(items);
        context.items = items;
    }

   } catch (error) {
       showError(error.message);
    console.log(error);
    }
    
    this.partial('../templates/catalog/home.hbs', context);
}

export async function createPage() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs')
    };

    this.partial('../templates/catalog/create.hbs', this.app.userData);
}

export async function createPost(newMeal) {

    try {

        const newMeal = {
            meal: this.params.meal,
            ingredients: this.params.ingredients.split(',').map(i =>i.trim()),
            prepMethod: this.params.prepMethod,
            description: this.params.description,
            foodImageUrl: this.params.foodImageURL,
            likes: 0,
        };


        validateInputs(newMeal);

        const result = await createItem(newMeal);
        checkResult(result);

        const relationResult = await setCategoryRelation(result.objectId, this.params.category);
        checkResult(relationResult);


        showSuccess('Recipe shared successfully!');

        this.redirect('/')

    } catch (error) {
        showError(error.message);
        console.log(error);
    }
}

export async function detailsPage() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs')
    };
    
    const id = this.params.id;
    const recipe = await getItemById(id);
    checkResult(recipe);

    const context = Object.assign({ recipe }, this.app.userData);
    if (this.app.userData.userId == recipe.ownerId) {
        recipe.isAuthor = true;
    }

    await this.partial('../templates/catalog/details.hbs', context);

    if ( !recipe.isAuthor) {
        const likeBtn = document.querySelector('#likeBtn');
    likeBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const result = await likeRecipe(id);
            checkResult(result);
            const likes = result.likes;
            likeBtn.textContent = `${likes} Likes`;
            
        } catch (error) {
            showError(error.message);
        }
    });
    }
}

export async function editPage() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs')
    };
    
    const id = this.params.id;
    const recipe = await getItemById(id);
    checkResult(recipe);
    recipe.ingredients = recipe.ingredients.join(', ');
    console.log(recipe);
    const context = Object.assign({recipe}, this.app.userData);
    if (this.app.userData.userId == recipe.ownerId) {
        recipe.isAuthor = true;
    }

    await this.partial('../templates/catalog/edit.hbs', context)

    document.querySelectorAll('select[name=category]>option').forEach(o => {
        if (o.textContent == recipe.category.name) {
            o.selected = true;   
        }
    })
}

export async function editPost() {
    const id = this.params.id;
    
    const recipe = await getItemById(id);
    checkResult(recipe);
    console.log(recipe);
    
    recipe.meal = this.params.meal;
    recipe.ingredients = this.params.ingredients.split(',').map(i => i.trim());
    recipe.description = this.params.description;
    recipe.prepMethod = this.params.prepMethod;
    recipe.foodImageUrl = this.params.foodImageURL;
    
    try {
        validateInputs(recipe);

        if (this.params.category !== recipe.category.name) {
            const relationResult = await setCategoryRelation(recipe.objectId, this.params.category);
            checkResult(relationResult);
        }
  
    const result = await editItem(id, recipe);
    checkResult(result);

    showSuccess('Recipe edited successfuly.');
    this.redirect(`#/details/${id}`);
       
   } catch (error) {
        showError(error.message);
        console.log(error);
   }
}

function validateInputs(recipe) {
    if (recipe.meal.length < 4) {
        throw new Error('Meal should be at least 4 characters long.');
    }

    if (recipe.ingredients.length < 2) {
        throw new Error('The ingredients ("array") should have at least 2 elements.');
    }

    if (recipe.prepMethod.length < 10) {
        throw new Error('Preparation method should be at least 10 characters long.');
    }

    if (recipe.description.length < 10) {
        throw new Error('Description should be at least 10 characters long.');
    }

    if (!recipe.foodImageUrl.startsWith('http://') && !recipe.foodImageUrl.startsWith('https://')) {
        throw new Error('The foodImageURL should start with "http://" or "https://".');
    }

    if (recipe.category == 'Select category...') {
        throw new Error('Please select a category from the list.');
    }
}

export async function archiveRecipe() {
    const id = this.params.id;

   if (confirm('The recipe will be archived?')) {
    try {
     const result = await deleteItem(id);
     checkResult(result);

     showSuccess('This recipe was archived.');
     this.redirect('#/home');  

    } catch (error) {
        showError(error.message);
    } 
   }
}

export async function likeRecipe(id) {

    try {
        const result = await likeItem(id);
        checkResult(result);

        showSuccess('You liked that recipe.');
        return result;

    } catch (error) {
        showError(error.message);
    }
}