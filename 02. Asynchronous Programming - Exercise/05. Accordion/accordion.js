function solution() {

    window.addEventListener('load', async function () {
        let mainSection = document.querySelector('#main');

        let articles = await getAllArticles();
        Object.entries(articles)
            .forEach(([key, value]) => {
                mainSection.appendChild(createArticle(value._id, value.title));
            });
    });

    function createArticle(id, title) {
        let article = e('div', { className: 'accordion' },
                          e('div', { className: 'head' },
                              e('span', {}, title),
                              e('button', { onClick: loadMore, className: 'button', id: id }, 'More')),
                          e('div', { className: 'extra' }));

        async function loadMore(event) {
            try {
                let divExtra = event.target.parentNode.parentNode.querySelector('div.extra');
                if (event.target.textContent.toLocaleLowerCase() === 'more') {
                    let divExtraHtml = divExtra.innerHTML;
                    if (divExtraHtml.trim() === '') {
                        let url = `http://localhost:3030/jsonstore/advanced/articles/details/${id}`;
                        const response = await fetch(url);
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }

                        const data = await response.json();

                        let p = e('p', {}, data.content);
                        divExtra.appendChild(p);                
                    }

                    divExtra.style.display = 'block';
                    event.target.textContent = 'less';
                } else {
                    event.target.textContent = 'more';
                    divExtra.style.display = 'none';
                }
                
            } catch (error) {
                alert(error.message);
            }
        }

        return article;
    }

    async function getAllArticles() {
        try {
            let url = 'http://localhost:3030/jsonstore/advanced/articles/list';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            alert(error.message);
        }
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

solution();