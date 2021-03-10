import { e } from './dom.js';

let main;
let catalogSection;
let setActiveNav;

export function setupCatalog(mainTargetElement, sectionTargetElement, onActiveNav) {
    main = mainTargetElement;
    catalogSection = sectionTargetElement;
    setActiveNav = onActiveNav;
}

export async function showCatalog() {
    setActiveNav('CatalogButton');
    catalogSection.innerHTML = '<p style="color: white">Loading...</p>';
    main.appendChild(catalogSection);

    const recipes = await getRecipes();
    const cards = recipes.map(createRecipePreview);

    main.innerHTML = '';
    catalogSection.innerHTML = '';

    cards.forEach(c => catalogSection.appendChild(c));

    main.appendChild(catalogSection);
}


async function getRecipes() {
    const response = await fetch('http://localhost:3030/data/recipes?select=' + encodeURIComponent('_id,name,img,_ownerId'));
    const recipes = await response.json();
    
    return Object.values(recipes);
}

async function getRecipeById(id) {
    const response = await fetch('http://localhost:3030/data/recipes/' + id);
    const recipe = await response.json();

    return recipe;
}

function createRecipePreview(recipe) {
    const result = e('article', { className: 'preview', ownerId: recipe._ownerId, onClick: toggleCard },
        e('div', { className: 'title' }, e('h2', {}, recipe.name)),
        e('div', { className: 'small' }, e('img', { src: recipe.img })),
    );

    return result;

    async function toggleCard() {
        const fullRecipe = await getRecipeById(recipe._id);

        result.replaceWith(createRecipeCard(fullRecipe));
    }
}

function createRecipeCard(recipe) {
    const result = e('article', {},
        e('h2', {}, recipe.name),
        e('div', { className: 'band' },
            e('div', { className: 'thumb' }, e('img', { src: recipe.img })),
            e('div', { className: 'ingredients' },
                e('h3', {}, 'Ingredients:'),
                e('ul', {}, recipe.ingredients.map(i => e('li', {}, i))),
            )
        ),
        e('div', { className: 'description' },
            e('h3', {}, 'Preparation:'),
            recipe.steps.map(s => e('p', {}, s))
        ),
    );

    return result;
}