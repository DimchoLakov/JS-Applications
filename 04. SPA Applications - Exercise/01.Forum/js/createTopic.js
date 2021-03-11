import { showTopics } from './topics.js';

let main;
let createTopicSection;

export function setupCreateTopic(mainElementTarget, createTopicSectionTarget) {
    main = mainElementTarget;
    createTopicSection = createTopicSectionTarget;

    const form = createTopicSection.querySelector('form');
    form.addEventListener('submit', createTopic);

    const cancelButton = form.querySelector('.cancel');
    cancelButton.addEventListener('click', resetForm);
}

export function showCreateTopic() {
    main.innerHTML = '';
    main.appendChild(createTopicSection);
}

async function createTopic(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    let isAnyInputEmpty = [...formData].some(x => x[1] === '');
    if (isAnyInputEmpty) {
        alert('All field are required and cannot be empty!');
        return false;
    }

    let topicName = formData.get('topicName');
    let username = formData.get('username');
    let postText = formData.get('postText');

    try {
        const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topicName,
                username,
                postText,
                date: new Date()
            })
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        event.target.reset();
        showTopics();

    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}

function resetForm(event) {
    event.preventDefault();

    const form = event.target.parentNode.parentNode;
    form.reset();
}