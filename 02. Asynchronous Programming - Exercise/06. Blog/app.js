function attachEvents() {
    let loadPostsButton = document.querySelector('#btnLoadPosts');
    loadPostsButton.addEventListener('click', async function () {
        let postsSelect = document.querySelector('#posts');
        let posts = await getPosts();

        Object.entries(posts)
            .forEach(([key, value]) => {
                let option = new Option(value.title, value.id);
                postsSelect.appendChild(option);
            });

        let buttonViewPost = document.querySelector('#btnViewPost');
        buttonViewPost.addEventListener('click', async function () {
            let selectedOption = postsSelect.options[postsSelect.selectedIndex];
            let postId = selectedOption.value;
            let comments = await getCommentsByPostId(postId);
            
            let divPostComments = document.querySelector('#post-comments');
            divPostComments.innerHTML = '';

            let postTitle = selectedOption.text;            
            let postContent = Object.entries(posts)
                                    .find(p => p[0] === postId)[1]
                                    .body;
                                    
            let h1PostTitle = e('h1', { id: 'post-title' }, postTitle);
            let paragraphPostBody = e('p', { id: 'post-body' },  postContent, 
                                        e('h2', {}, 'Comments'),
                                        e('ul', { id: 'post-comments' }, 
                                            comments.map(c => e('li', { id: c.id }, c.text))));

            divPostComments.appendChild(h1PostTitle);
            divPostComments.appendChild(paragraphPostBody);
        })
    });

    async function getCommentsByPostId(postId) {
        const response = await fetch(`http://localhost:3030/jsonstore/blog/comments`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        let allComments = await response.json();
        let comments = Object.values(allComments).filter(c => c.postId === postId);

        return comments;
    }

    async function getPosts() {
        const response = await fetch('http://localhost:3030/jsonstore/blog/posts');
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    }

    function e(type, attributes, ...content) {
        const result = document.createElement(type);

        for (let [attr, value] of Object.entries(attributes || {})) {
            if (attr.substring(0, 2) == 'on') {
                result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
            } else {
                result[attr] = value;
            }
        }

        content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

        content.forEach(e => {
            if (typeof e == 'string' || typeof e == 'number') {
                const node = document.createTextNode(e);
                result.appendChild(node);
            } else {
                result.appendChild(e);
            }
        });

        return result;
    }
}

attachEvents();