window.addEventListener('load', loadRecipes);

async function loadRecipes(event) {
    let url = 'http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg';
    const response = await fetch(url);
    const data = await response.json();

    let main = document.querySelector('main');
    main.innerHTML = '';

    data.forEach(record => {
        let h2RecipeName = document.createElement('h2');
        h2RecipeName.textContent = record.name;

        let divTitle = document.createElement('div');
        divTitle.classList.add('title');
        divTitle.appendChild(h2RecipeName);

        let img = document.createElement('img');
        img.setAttribute('src', record.img);

        let divSmall = document.createElement('div');
        divSmall.classList.add('small');
        divSmall.appendChild(img);

        let article = document.createElement('article');
        article.classList.add('preview');
        article.appendChild(divTitle);
        article.appendChild(divSmall);
        article.recipeId = record._id;
        article.addEventListener('click', loadRecipe);

        main.appendChild(article);
    })
}

async function loadRecipe(event) {
    event.preventDefault();

    let recipeId = event.target.recipeId;

    let url = `http://localhost:3030/data/recipes/${recipeId}`

    const response = await fetch(url);
    const data = await response.json();

    let h2RecipeName = document.createElement('h2');
    h2RecipeName.textContent = data.name;

    let img = document.createElement('img');
    img.setAttribute('src', data.img);

    let divThumb = document.createElement('div');
    divThumb.classList.add('thumb');
    divThumb.appendChild(img);

    let h3Ingredients = document.createElement('h3');
    h3Ingredients.textContent = 'Ingredients:';

    let ulIngredients = document.createElement('ul');

    data.ingredients.forEach(ingredient => {
        let li = document.createElement('li');
        li.textContent = ingredient;

        ulIngredients.appendChild(li);
    });

    let divIngredients = document.createElement('div');
    divIngredients.classList.add('ingredients');
    divIngredients.appendChild(h3Ingredients);
    divIngredients.appendChild(ulIngredients);

    let divBand = document.createElement('div');
    divBand.classList.add('band');
    divBand.appendChild(divThumb);
    divBand.appendChild(divIngredients);

    let h3Preparation = document.createElement('h3');
    h3Preparation.textContent = 'Preparation:';

    let divDescription = document.createElement('div');
    divDescription.classList.add('description');
    divDescription.appendChild(h3Preparation);

    data.steps.forEach(step => {
        let pStep = document.createElement('p');
        pStep.textContent = step;

        divDescription.appendChild(pStep);
    })

    let articleWithDetails = document.createElement('article');
    articleWithDetails.appendChild(h2RecipeName);
    articleWithDetails.appendChild(divBand);
    articleWithDetails.appendChild(divDescription)

    event.target.parentNode.replaceChild(articleWithDetails, event.target)

    // <article>
    //         <h2>Title</h2>
    //         <div class="band">
    //             <div class="thumb">
    //                 <img src="assets/lasagna.jpg">
    //             </div>
    //             <div class="ingredients">
    //                 <h3>Ingredients:</h3>
    //                 <ul>
    //                     <li>Ingredient 1</li>
    //                     <li>Ingredient 2</li>
    //                     <li>Ingredient 3</li>
    //                     <li>Ingredient 4</li>
    //                 </ul>
    //             </div>
    //         </div>
    //         <div class="description">
    //             <h3>Preparation:</h3>
    //             <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, quaerat.</p>
    //             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur officia ipsam nulla vitae nobis
    //                 reprehenderit pariatur aut dolor exercitationem impedit.</p>
    //             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus dolorem odit officiis numquam
    //                 corrupti? Quam.</p>
    //         </div>
    //     </article>

}