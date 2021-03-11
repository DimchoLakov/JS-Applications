import { e } from './dom.js';
import { getTopicById } from './topics.js';
import { showAddCommentForm } from './addComment.js';

let main;
let commentsSection;

export function setupComments(mainElementTarget, commentsSectionTarget) {
    main = mainElementTarget;
    commentsSection = commentsSectionTarget;
}

export async function showComments(topicId) {
    const topic = await getTopicById(topicId);

    const currentTopic = e('div', { className: 'topic-container' },
        e('div', { className: 'topic-name-wrapper' },
            e('div', { className: 'topic-name' },
                e('a', { href: '#', className: 'normal' },
                    e('h2', {}, topic.topicName)),
                e('div', { className: 'columns' },
                    e('div', {},
                        e('p', {}, 'Date: ',
                            e('time', {}, topic.date)),
                        e('div', { className: 'nick-name' },
                            e('p', {}, 'Username: ',
                                e('span', {}, topic.username))))))));

    main.innerHTML = '';
    commentsSection.innerHTML = '';
    commentsSection.appendChild(currentTopic);

    const comments = await getComments(topicId);
    comments.forEach(c => {
        commentsSection.appendChild(c);
    });

    main.appendChild(commentsSection);
    showAddCommentForm(topicId);
}

async function getComments(topicId) {
    try {
        const response = await fetch(`http://localhost:3030/jsonstore/collections/myboard/comments`);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();

        const comments = Object.values(data)
            .filter(c => c.topicId === topicId)
            .map(c => {
                return e('div', { className: 'comment' },
                    e('header', { className: 'header' },
                        e('p', {},
                            e('span', {}, `${c.username}`),
                                ' posted on ',
                                e('time', {}, `${c.date}`))),
                    e('div', { className: 'comment-main' },
                        e('div', { className: 'userdetails' },
                            e('img', { src: './static/profile.png', alt: 'avatar' })
                        ),
                        e('div', { className: 'post-content' },
                            e('p', {}, `${c.commentText}`)
                        )
                    )
                );
            });

        return comments;

    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}