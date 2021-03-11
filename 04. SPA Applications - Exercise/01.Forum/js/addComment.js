import { showComments } from './comments.js';

let main;
let addCommentSection;

export function setupAddComment(mainElementTarget, addCommentSectionTarget) {
    main = mainElementTarget;
    addCommentSection = addCommentSectionTarget;

    addCommentSection.querySelector('form')
        .addEventListener('submit', addComment);
}

export async function showAddCommentForm(topicId) {
    const commentSection = main.querySelector('#AddComment');
    if (commentSection !== null) {
        commentSection.remove();
    }
    
    addCommentSection.topicId = topicId;
    main.appendChild(addCommentSection);
}

async function addComment(event) {
    event.preventDefault();

    const topicId = event.target.parentNode.parentNode.parentNode.topicId;

    const formData = new FormData(event.target);
    let isAnyInputEmpty = [...formData].some(x => x[1] === '');
    if (isAnyInputEmpty) {
        alert('All field are required and cannot be empty!');
        return false;
    }

    let commentText = formData.get('postText');
    let username = formData.get('username');

    try {
        const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commentText,
                username,
                topicId,
                date: new Date()
            })
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        event.target.reset();
        showComments(topicId);

    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}
