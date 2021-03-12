import { e } from './dom.js';
import { isUserLoggedIn } from './login.js';
import { showAddMovie } from './addMovie.js';
import { showMovieDetails } from './movieDetails.js';

let main;
let homeSection;
let divAddMovie;

export async function setupHome(mainTargetElement, homeSectionTarget) {
    main = mainTargetElement;
    homeSection = homeSectionTarget;

    divAddMovie = homeSection.querySelector('#add-movie-button');
    divAddMovie.querySelector('a')
        .addEventListener('click', showAddMovie);
}

export async function showHome() {
    main.innerHTML = '';
    main.appendChild(homeSection);

    if (isUserLoggedIn()) {
        divAddMovie.style.display = 'block';
    } else {
        divAddMovie.style.display = 'none';
    }

    let movies = await getMovies();
    let movieDivs = movies.map(m =>
        e('div', { className: 'card mb-4' },
            e('img', { className: 'card-img-top', src: m.img, alt: 'Card image cap', width: '400' }),
            e('div', { className: 'card-body' },
                e('h4', { className: 'card-title' }, m.title)),
            e('div', { className: 'card-footer' },
                e('a', { href: `#/details/${m._id}` },
                    e('button', { type: 'button', className: 'btn btn-info', onClick: async (event) => { event.preventDefault(); await showMovieDetails(m._id); } }, 'Details'))))
    );

    const moviesList = homeSection.querySelector('#MoviesList');
    moviesList.innerHTML = '';
    movieDivs.forEach(m => moviesList.appendChild(m));
}

async function getMovies() {
    try {
        const response = await fetch('http://localhost:3030/data/movies');
        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}