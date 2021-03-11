import { e } from './dom.js';
import { showComments } from './comments.js';

let main;
let topicsSection;

export function setupTopics(mainElementTarget, topicsSectionTarget) {
    main = mainElementTarget;
    topicsSection = topicsSectionTarget;
}

export async function showTopics() {
    try {
        const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts');

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const topics = main.querySelector('#Topics');
        if (topics !== null) {
            topics.remove();
        }

        topicsSection.innerHTML = '';

        const data = await response.json();

        Object.values(data)
            .forEach(x => {
                const currentTopic = e('div', { className: 'topic-container', onClick: () => { showComments(x._id); } },
                    e('div', { className: 'topic-name-wrapper' },
                        e('div', { className: 'topic-name' },
                            e('a', { href: '#', className: 'normal' },
                                e('h2', {}, x.topicName)),
                            e('div', { className: 'columns' },
                                e('div', {},
                                    e('p', {}, 'Date: ',
                                        e('time', {}, x.date)),
                                    e('div', { className: 'nick-name' },
                                        e('p', {}, 'Username: ',
                                            e('span', {}, x.username))))))));

                topicsSection.appendChild(currentTopic);
            });

        main.appendChild(topicsSection);

    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}

export async function getTopicById(topicId) {
    try {
        const response = await fetch(`http://localhost:3030/jsonstore/collections/myboard/posts/${topicId}`);

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();

        return data;

    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}