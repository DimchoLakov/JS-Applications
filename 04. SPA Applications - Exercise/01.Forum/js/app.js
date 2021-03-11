import { setupCreateTopic, showCreateTopic } from './createTopic.js';
import { setupTopics, showTopics } from './topics.js';
import { setupComments, showComments } from './comments.js';
import { setupAddComment, showAddCommentForm } from './addComment.js';

let main = document.querySelector('main');

window.addEventListener('load', async () => {

    setupCreateTopic(main, document.querySelector('#NewTopic'));
    showCreateTopic();

    setupTopics(main, document.querySelector('#Topics'));
    await showTopics();

    setupComments(main, document.querySelector('#Comments'));

    setupAddComment(main, document.querySelector('#AddComment'))

    const homeLink = document.querySelector('#HomeLink');
    homeLink.addEventListener('click', async (event) => {
        event.preventDefault();

        showCreateTopic();
        await showTopics();
    });
});