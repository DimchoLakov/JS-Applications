import { html } from '../node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const loginTemplate = (onSubmit) => html`
    <section id="login-page" class="content auth">
        <h1>Login</h1>
        <form id="login" action="#" method="" @submit=${onSubmit}>
            <fieldset>
                <blockquote>Knowledge is like money: to be of value it must circulate, and in circulating it can
                    increase in quantity and, hopefully, in value</blockquote>
                <p class="field email">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="maria@email.com">
                </p>
                <p class="field password">
                    <label for="login-pass">Password:</label>
                    <input type="password" id="login-pass" name="password">
                </p>
                <p class="field submit">
                    <input class="btn submit" type="submit" value="Log in">
                </p>
                <p class="field">
                    <span>If you don't have profile click <a href="/register">here</a></span>
                </p>
            </fieldset>
        </form>
    </section>
`;

export async function login(ctx) {
    ctx.render(loginTemplate(onSubmit));
    ctx.setNavigation();

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        if (email === '' || password === '') {
            alert('All fields are required!');

            return false;
        }

        try {
            await api.login(email, password);
        } catch (error) {
            alert(error.message);
            console.log(error.message);
            return false;
        }

        ctx.page.redirect('/');
    }
}