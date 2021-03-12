import { getUserId, getUserToken } from './login.js';

export async function getLikesCountByMovieId(id) {
    try {
        const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`);
        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}

export async function getUsersLikesByMovieId(id) {
    try {
        const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22%20and%20_ownerId%3D%22${getUserId()}%22`);
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}

export async function likeMovie(event) {
    event.preventDefault();

    let movieId = event.target.movieId;

    try {
        const response = await fetch('http://localhost:3030/data/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': getUserToken()
            },
            body: JSON.stringify({
                movieId
            })
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();

        let spanWithLike = event.target.parentNode.querySelector('#DetailsLikesSpan');
        spanWithLike.style.display = 'block';
        spanWithLike.textContent = `Liked ${await getLikesCountByMovieId(movieId)}`;

        event.target.style.display = 'none';
        
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}