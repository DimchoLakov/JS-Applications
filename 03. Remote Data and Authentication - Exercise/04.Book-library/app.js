window.addEventListener('load', async function () {
    let buttonLoadBooks = document.querySelector('#loadBooks');
    buttonLoadBooks.addEventListener('click', async function (event) {
        event.preventDefault();
        await loadAllBooks();
    });

    let form = document.querySelector('form');
    form.addEventListener('submit', createBook);

    async function loadAllBooks() {
        const response = await fetch('http://localhost:3030/jsonstore/collections/books');
        const data = await response.json();

        const tableTBody = document.querySelector('table tbody');
        tableTBody.innerHTML = '';

        let books = Object.entries(data);
        for (const bookEntry of books) {
            let tr = e('tr', {});
            let tdTitle = e('td', {}, bookEntry[1].title);
            let tdAuthor = e('td', {}, bookEntry[1].author);
            let tdButtons = e('td', {}, 
                                e('button', { onClick: addEditBookFormOnSubmit, bookId: bookEntry[0] }, 'Edit'),
                                e('button', { onClick: deleteBook, bookId: bookEntry[0] }, 'Delete'));

            tr.appendChild(tdTitle);
            tr.appendChild(tdAuthor);
            tr.appendChild(tdButtons);
            tableTBody.append(tr);
        }
    }

    async function createBook(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        let areAnyInputsEmpty = [...formData].some(x => x[1] === '');
        if (areAnyInputsEmpty) {
            alert('All field are required and cannot be empty!');
            return false;
        }

        let title = formData.get('title');
        let author = formData.get('author');

        const response = await fetch('http://localhost:3030/jsonstore/collections/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                author
            })
        });

        if (!response.ok) {
            alert(`Something went wrong - ${response.statusText}`);
        }

        event.target.reset();

        loadAllBooks();
    }

    async function addEditBookFormOnSubmit(event) {
        event.preventDefault();
        
        let editForm = document.querySelector('form');

        let title = event.target.parentNode.parentNode.querySelector('td:nth-child(1)').textContent;
        let author = event.target.parentNode.parentNode.querySelector('td:nth-child(2)').textContent;

        let inputTitle = editForm.querySelector('input[name="title"]');
        inputTitle.value = title;
        let inputAuthor = editForm.querySelector('input[name="author"]');
        inputAuthor.value = author;
        
        let h3FormTitle = editForm.querySelector('h3');
        h3FormTitle.textContent = 'Edit FORM';        

        let bookId = event.target.bookId;

        let editFormClone = editForm.cloneNode(true);
        editFormClone.addEventListener('submit', editBookOnFormSubmit);
        editFormClone.bookId = bookId;

        editForm.parentNode.replaceChild(editFormClone, editForm);
    }

    async function editBookOnFormSubmit(event) {
        event.preventDefault();
        let bookId = event.target.bookId;

        const formData = new FormData(event.target);
        let areAnyInputsEmpty = [...formData].some(x => x[1] === '');
        if (areAnyInputsEmpty) {
            alert('All field are required and cannot be empty!');
            return false;
        }

        let title = formData.get('title');
        let author = formData.get('author');
        
        const response = await fetch(`http://localhost:3030/jsonstore/collections/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                author
            })
        });

        if (!response.ok) {
            alert(`Something went wrong - ${response.statusText}`);
        }

        let formClone = event.target.cloneNode(true);
        formClone.reset();
        formClone.addEventListener('submit', createBook);
        let h3FormTitle = formClone.querySelector('h3');
        h3FormTitle.textContent = 'FORM';
        event.target.parentNode.replaceChild(formClone, event.target);

        loadAllBooks();
    }

    async function deleteBook(event) {
        event.preventDefault();

        let bookId = event.target.bookId;

        const response = await fetch(`http://localhost:3030/jsonstore/collections/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            event.target.parentNode.parentNode.remove();
        } else {
            alert(response.statusText);
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
});