import { html } from './node_modules/lit-html/lit-html.js';
import { classMap } from './node_modules/lit-html/directives/class-map.js';
import * as api from './data.js';

const editTemplate = (furniture,
    onSubmit,
    errorMessage,
    isMakeInvalid,
    isModelInvalid,
    isYearInvalid,
    isDescriptionInvalid,
    isPriceInvalid,
    isImgInvalid) => html`
    <div class="row space-top">
        <div class="col-md-12">
            <h1>Edit Furniture</h1>
            <p>Please fill all fields.</p>
        </div>
    </div>
    <form @submit=${onSubmit}>
        <div class="row space-top">
            <div class="col-md-4">
                ${errorMessage ? html`
                <div class="form-group">
                    <p class="text-danger">${errorMessage}</p>
                </div>` : ''}
                <div class="form-group">
                    <label class="form-control-label" for="new-make">Make</label>
                    <input class=${classMap(getValidationClasses(isMakeInvalid))} id="new-make" type="text" name="make"
                        .value=${furniture.make}>
                </div>
                <div class="form-group has-success">
                    <label class="form-control-label" for="new-model">Model</label>
                    <input class=${classMap(getValidationClasses(isModelInvalid))} id="new-model" type="text" name="model"
                        .value=${furniture.model}>
                </div>
                <div class="form-group has-danger">
                    <label class="form-control-label" for="new-year">Year</label>
                    <input class=${classMap(getValidationClasses(isYearInvalid))} id="new-year" type="number" name="year"
                        .value=${furniture.year}>
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="new-description">Description</label>
                    <input class=${classMap(getValidationClasses(isDescriptionInvalid))} id="new-description" type="text"
                        name="description" .value=${furniture.description}>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-control-label" for="new-price">Price</label>
                    <input class=${classMap(getValidationClasses(isPriceInvalid))} id="new-price" type="number" name="price"
                        .value=${furniture.price}>
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="new-image">Image</label>
                    <input class=${classMap(getValidationClasses(isImgInvalid))} id="new-image" type="text" name="img"
                        .value=${furniture.img}>
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="new-material">Material (optional)</label>
                    <input class="form-control" id="new-material" type="text" name="material" .value=${furniture.material}>
                </div>
                <input type="submit" class="btn btn-info" value="Edit" />
            </div>
        </div>
    </form>
`;

export async function editPage(ctx) {
    const furnitureId = ctx.params.id;
    const furniture = await api.getFurnitureById(furnitureId);

    const ownerId = furniture._ownerId;
    const userId = sessionStorage.getItem('userId');

    if (userId === null || userId === undefined) {
        alert('Please login!');

        ctx.page.redirect(`/login`);

        return false;
    }

    if (ownerId !== userId) {
        alert('You must be the owner of the furniture in order to Edit it!');

        ctx.page.redirect(`/details/${furnitureId}`);

        return false;
    }

    ctx.render(editTemplate(furniture, onSubmit));

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const make = formData.get('make');
        const model = formData.get('model');
        const year = formData.get('year');
        const description = formData.get('description');
        const price = formData.get('price');
        const img = formData.get('img');
        const material = formData.get('material');

        if (make.length < 4 || model.length < 4) {
            ctx.render(editTemplate(
                furniture,
                onSubmit,
                'Make and Model must be at least 4 characters long!',
                make.length < 4,
                model.length < 4));

            return false;
        }

        if (Number(year) < 1950 || Number(year) > 2050) {
            ctx.render(editTemplate(
                furniture,
                onSubmit,
                'Year must be between 1950 and 2050!',
                false,
                false,
                Number(year) < 1950 || Number(year) > 2050));

            return false;
        }

        if (description.length < 10) {
            ctx.render(editTemplate(
                furniture,
                onSubmit,
                'Description must be at least 10 characters long!',
                false,
                false,
                false,
                description.length < 10));

            return false;
        }

        if (Number(price) < 0 || price === '') {
            ctx.render(editTemplate(
                furniture,
                onSubmit,
                'Price cannot be empty or negative number!',
                false,
                false,
                false,
                false,
                Number(price) < 0) || price === '');

            return false;
        }

        if (img === '') {
            ctx.render(editTemplate(
                furniture,
                onSubmit,
                'Image field cannot be empty!',
                false,
                false,
                false,
                false,
                false,
                img === ''));

            return false;
        }

        const editFurniture = {
            make,
            model,
            year,
            description,
            price,
            img,
            material
        };

        await api.editFurniture(furnitureId, editFurniture);

        ctx.page.redirect(`/details/${furnitureId}`);
    }
}

function fixLocalPath(imgSrc) {
    if (imgSrc.includes('./images')) {
        return `.${imgSrc}`;
    }

    return imgSrc;
}

function getValidationClasses(isInputInvalid) {
    return isInputInvalid ? { 'form-control': true, 'is-invalid': true } : { 'form-control': true };
}