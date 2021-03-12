import { getUserToken } from './login.js';
import { showHome } from './home.js';

export async function deleteMovieById(event) {
    event.preventDefault();

    let confirmed = confirm('Do you want to delete this movie?');
    if (confirmed) {
        let movieId = event.target.movieId;

        try {
            const response = await fetch(`http://localhost:3030/data/movies/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': getUserToken()
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            await showHome();

        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }
}