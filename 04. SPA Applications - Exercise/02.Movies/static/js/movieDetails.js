import { e } from './dom.js';
import { getUserId } from './login.js';
import { getLikesCountByMovieId, getUsersLikesByMovieId, likeMovie } from './likes.js';
import { deleteMovieById } from './deleteMovie.js';
import { showEditMovie } from './editMovie.js';

let main;

export async function setupMovieDetails(mainTargetElement) {
    main = mainTargetElement;
}

export async function showMovieDetails(id) {
    main.innerHTML = '';

    let movieDetails = await getMovieDetails(id);

    let likesCount = await getLikesCountByMovieId(id);

    let movieDetailsSection = e('section', { id: 'movie-example' },
        e('div', { className: 'container' },
            e('div', { className: 'row bg-light text-dark' },
                e('h1', {}, `Movie title: ${movieDetails.title}`),
                e('div', { className: 'col-md-8' },
                    e('img', { className: 'img-thumbnail', src: movieDetails.img, alt: 'Movie' })),
                e('div', { className: 'col-md-4 text-center' },
                    e('h3', { className: 'my-3' }, 'Movie Description'),
                    e('p', {}, movieDetails.description),
                    e('a', { id: 'DetailsDeleteButton', className: 'btn btn-danger', href: '#' }, 'Delete'),
                    e('a', { id: 'DetailsEditButton', className: 'btn btn-warning', href: '#' }, 'Edit'),
                    e('a', { id: 'DetailsLikeButton', className: 'btn btn-primary', href: '#' }, 'Like'),
                    e('span', { id: 'DetailsLikesSpan', className: 'enrolled-span' }, `Liked ${likesCount}`)))));

    let detailsLikeButton = movieDetailsSection.querySelector('#DetailsLikeButton');
    detailsLikeButton.movieId = id;
    detailsLikeButton.addEventListener('click', likeMovie);

    let detailsDeleteButton = movieDetailsSection.querySelector('#DetailsDeleteButton');
    detailsDeleteButton.movieId = id;
    detailsDeleteButton.addEventListener('click', deleteMovieById);

    let detailsEditButton = movieDetailsSection.querySelector('#DetailsEditButton');
    detailsEditButton.movieId = id;
    detailsEditButton.addEventListener('click', showEditMovie);

    let userId = getUserId();
    let isUserCreator = userId === movieDetails._ownerId;

    // if current user is not the creator of the movie, hide Delete and Edit buttons
    if (!isUserCreator) {
        detailsDeleteButton.style.display = 'none';
        detailsEditButton.style.display = 'none';

        let usersLikedCurrentMovie = await getUsersLikesByMovieId(id);

        let hasUserLikedTheMovie = usersLikedCurrentMovie.find(x => x._ownerId === userId);
        // If current user has already liked the movie, hide Like button, else hide Likes Span
        if (hasUserLikedTheMovie) {
            detailsLikeButton.style.display = 'none';
        }

        // if current user is the creator of the movie, hide Like button
    } else {
        detailsLikeButton.style.display = 'none';
    }

    main.appendChild(movieDetailsSection);
}

export async function getMovieDetails(id) {
    try {
        const response = await fetch(`http://localhost:3030/data/movies`);
        const data = await response.json();

        return data.find(m => m._id === id);
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}