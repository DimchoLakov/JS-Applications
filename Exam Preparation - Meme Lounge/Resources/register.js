import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const registerTemplate = (onSubmit) => html`
    <section id="register">
        <form id="register-form" @submit=${onSubmit}>
            <div class="container">
                <h1>Register</h1>
                <label for="username">Username</label>
                <input id="username" type="text" placeholder="Enter Username" name="username">
                <label for="email">Email</label>
                <input id="email" type="text" placeholder="Enter Email" name="email">
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Enter Password" name="password">
                <label for="repeatPass">Repeat Password</label>
                <input id="repeatPass" type="password" placeholder="Repeat Password" name="repeatPass">
                <div class="gender">
                    <input type="radio" name="gender" id="female" value="female">
                    <label for="female">Female</label>
                    <input type="radio" name="gender" id="male" value="male" checked>
                    <label for="male">Male</label>
                </div>
                <input type="submit" class="registerbtn button" value="Register">
                <div class="container signin">
                    <p>Already have an account?<a href="/login">Sign in</a>.</p>
                </div>
            </div>
        </form>
    </section>
`;

export async function register(ctx) {
    ctx.render(registerTemplate(onSubmit));
    ctx.setNavigation();
    ctx.setActiveLink('RegisterLink');

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const repeatPass = formData.get('repeatPass');
        const gender = formData.get('gender');

        if (username === '' || email === '' || password === '' || repeatPass === '' || gender === null) {
            ctx.showNotifications('All fields are required!');

            return false;
        }

        if (password !== repeatPass) {
            ctx.showNotifications('Passwords do not match!');

            return false;
        }

        try {
            await api.register(username, email, password, gender);
        } catch (error) {
            ctx.showNotifications(error.message);
            return false;
        }

        ctx.page.redirect('/all');
    }
}