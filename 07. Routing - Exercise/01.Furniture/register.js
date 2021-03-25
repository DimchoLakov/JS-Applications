import { html } from './node_modules/lit-html/lit-html.js';
import { classMap } from './node_modules/lit-html/directives/class-map.js';
import * as api from './data.js';

const registerTemplate = (onSubmit, errorMessage, isEmailInvalid, isPasswordInvalid, isConfirmPasswordInvalid) => html`
    <div class="row space-top">
        <div class="col-md-12">
            <h1>Register New User</h1>
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
                    <label class="form-control-label" for="email">Email</label>
                    <input class=${classMap(getValidationClasses(isEmailInvalid))} id="email" type="text" name="email">
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="password">Password</label>
                    <input class=${classMap(getValidationClasses(isPasswordInvalid))} id="password" type="password"
                        name="password">
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="rePass">Repeat</label>
                    <input class=${classMap(getValidationClasses(isConfirmPasswordInvalid))} id="rePass" type="password"
                        name="rePass">
                </div>
                <input type="submit" class="btn btn-primary" value="Register" />
            </div>
        </div>
    </form>
`;


export function registerPage(ctx) {
    ctx.render(registerTemplate(onSubmit));
    ctx.setActiveLink('registerLink');

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('rePass');

        if (email === '' || password === '' || confirmPassword === '') {
            ctx.render(registerTemplate(onSubmit, 'All fields are required!', email === '', password === '', confirmPassword === ''));
            return false;
        }

        if (password !== confirmPassword) {
            ctx.render(registerTemplate(onSubmit, 'Passwords do not match!', false, true, true));
            return false;
        }

        await api.register(email, password);

        ctx.setNavigation();        
        ctx.page.redirect('/');
    }
}

function getValidationClasses(isInputInvalid) {
    return isInputInvalid ? { 'form-control': true, 'is-invalid': true } : { 'form-control': true };
}