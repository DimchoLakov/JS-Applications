function solve() {
    let departInput = document.querySelector('#depart');
    let arriveInput = document.querySelector('#arrive');
    let spanInfo = document.querySelector('span.info');

    let initialStopId = 1567;
    let isInitialStop = true;

    let nextStop = {};
    async function depart() {
        if (isInitialStop) {
            nextStop = await getNextBusStop(initialStopId);
            isInitialStop = false;
        } else {
            nextStop = await getNextBusStop(nextStop.next);
        }

        spanInfo.textContent = nextStop.name;

        departInput.disabled = true;
        arriveInput.disabled = false;
    }

    async function arrive() {
        nextStop = await getNextBusStop(nextStop.next);
        spanInfo.textContent = nextStop.name;

        arriveInput.disabled = true;
        departInput.disabled = false;
    }

    async function getNextBusStop(stopId) {
        try {
            let url = `http://localhost:3030/jsonstore/bus/schedule/${stopId}`;
            const response = await fetch(url);
            const data = await response.json();

            return data;
        } catch (error) {
            spanInfo.textContent = 'Error';
            departInput.disabled = true;
            arriveInput.disabled = true;
        }
    }

    return {
        depart,
        arrive
    };
}

let result = solve();