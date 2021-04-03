import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const loginTemplate = (onSubmit) => html`
    <section id="login">
        <form id="login-form" @submit=${onSubmit}>
            <div class="container">
                <h1>Login</h1>
                <label for="email">Email</label>
                <input id="email" placeholder="Enter Email" name="email" type="text">
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Enter Password" name="password">
                <input type="submit" class="registerbtn button" value="Login">
                <div class="container signin">
                    <p>Dont have an account?<a href="/register">Sign up</a>.</p>
                </div>
            </div>
        </form>
    </section>
`;

export async function login(ctx) {
    ctx.render(loginTemplate(onSubmit));
    ctx.setNavigation();
    ctx.setActiveLink('LoginLink');

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        if (email === '' || password === '') {
            ctx.showNotifications('All fields are required!');

            return false;
        }

        try {
            await api.login(email, password);
        } catch (error) {
            ctx.showNotifications(error.message);
            return false;
        }

        ctx.page.redirect('/all');
    }
}