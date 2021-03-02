async function getInfo() {
    let stopIdInput = document.querySelector('#stopId');
    let url = `http://localhost:3030/jsonstore/bus/businfo/${stopIdInput.value}`;
    stopIdInput.value = '';

    let stopNameDiv = document.querySelector('#stopName');
    let busesUl = document.querySelector('#buses');
    busesUl.innerHTML = '';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();

        stopNameDiv.textContent = data.name;
        Object.keys(data.buses)
            .forEach(bus => {
                let li = document.createElement('li');
                li.textContent = `Bus ${bus} arrives in ${data.buses[bus]} minutes`;
                busesUl.appendChild(li);
            });

    } catch (error) {
        stopNameDiv.textContent = 'Error';
    }
}