function attachEvents() {
    let submitInput = document.querySelector('#submit');
    submitInput.addEventListener('click', sendMessage);

    let refreshInput = document.querySelector('#refresh');
    refreshInput.addEventListener('click', getAllMessages);

    async function getAllMessages(event) {
        event.preventDefault();

        const response = await fetch('http://localhost:3030/jsonstore/messenger');
        const data = await response.json();

        let messages = Object.values(data)
            .filter(x => x !== undefined)
            .map(x => `${x.author}: ${x.content}`)
            .join('\n');

        let messagesTextArea = document.querySelector('#messages');
        messagesTextArea.textContent = messages;
    }

    async function sendMessage(event) {
        event.preventDefault();

        let authorInput = document.querySelector('#controls input[name="author"]');
        let contentInput = document.querySelector('#controls input[name="content"]');

        const response = await fetch('http://localhost:3030/jsonstore/messenger', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: authorInput.value,
                content: contentInput.value
            })
        });
        
        authorInput.value = '';
        contentInput.value = '';
    }
}

attachEvents();