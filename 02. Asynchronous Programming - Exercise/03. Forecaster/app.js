function attachEvents() {
    let locationInput = document.querySelector('#location');
    let submitInput = document.querySelector('#submit');
    submitInput.addEventListener('click', async function () {
        let divMainForecast = document.querySelector('#forecast');

        try {
            let locations = await getLocations();
            let location = locations.find(l => l.name.toLowerCase() === locationInput.value.toLowerCase());
            if (location !== undefined) {
                divMainForecast.style.display = 'block';

                let divError = divMainForecast.querySelector('#error');
                if (divError !== null) {
                    divMainForecast.removeChild(divError);
                }

                await displayTodayConditions(location.code);
                await displayUpcomingConditions(location.code);
            } else {
                throw new Error('Error');
            }
        } catch (error) {
            divMainForecast.style.display = 'block';

            let divError = document.createElement('div');
            divError.textContent = error.message;
            divError.style.fontSize = '50px';
            divError.style.color = 'red';
            divError.style.textAlign = 'center';
            divError.setAttribute('id', 'error');

            divMainForecast.appendChild(divError);
        }
    })

    locationInput.value = '';

    async function getLocations() {
        let url = 'http://localhost:3030/jsonstore/forecaster/locations';

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();
        return data;
    }

    async function getTodayConditions(code) {
        let url = `http://localhost:3030/jsonstore/forecaster/today/${code}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();
        return data;
    }

    async function getUpcomingConditions(code) {
        let url = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();
        return data;
    }

    function getHtmlEntity(weatherCondition) {
        let htmlEntity = '';
        switch (weatherCondition.toLowerCase()) {
            case 'sunny':
                htmlEntity = '&#x2600;';
                break;
            case 'partly sunny':
                htmlEntity = '&#x26C5;';
                break;
            case 'overcast':
                htmlEntity = '&#x2601;';
                break;
            case 'rain':
                htmlEntity = '&#x2614;';
                break;
            case 'degrees':
                htmlEntity = '&#176;';
                break;
            default:
                break;
        }

        return htmlEntity;
    }

    async function displayTodayConditions(locationCode) {
        let todayConditions = await getTodayConditions(locationCode);

        let spanConditionSymbol = document.createElement('span');
        spanConditionSymbol.classList.add('condition', 'symbol');
        spanConditionSymbol.innerHTML = getHtmlEntity(todayConditions.forecast.condition);

        let spanForecastDataLocation = document.createElement('span');
        spanForecastDataLocation.classList.add('forecast-data');
        spanForecastDataLocation.textContent = todayConditions.name;

        let spanForecastDataTemperature = document.createElement('span');
        spanForecastDataTemperature.classList.add('forecast-data');
        spanForecastDataTemperature.innerHTML = `${todayConditions.forecast.high}${getHtmlEntity('degrees')}/${todayConditions.forecast.low}${getHtmlEntity('degrees')}`;

        let spanForecastDataCondition = document.createElement('span');
        spanForecastDataCondition.classList.add('forecast-data');
        spanForecastDataCondition.textContent = todayConditions.condition;

        let spanCondition = document.createElement('span');
        spanCondition.classList.add('condition');
        spanCondition.appendChild(spanForecastDataLocation);
        spanCondition.appendChild(spanForecastDataTemperature);
        spanCondition.appendChild(spanForecastDataCondition);

        let divForecasts = document.createElement('div');
        divForecasts.classList.add('forecasts');
        divForecasts.appendChild(spanConditionSymbol);
        divForecasts.appendChild(spanCondition);

        let divCurrent = document.querySelector('#current');
        divCurrent.appendChild(divForecasts);
    }

    async function displayUpcomingConditions(locationCode) {
        let upcomingConditions = await getUpcomingConditions(locationCode);

        let divForecastInfo = document.createElement('forecast-info');

        for (let i = 0; i < upcomingConditions.forecast.length; i++) {
            const upcomingCondition = upcomingConditions.forecast[i];

            let spanSymbol = document.createElement('span');
            spanSymbol.classList.add('symbol');
            spanSymbol.innerHTML = getHtmlEntity(upcomingCondition.condition);

            let spanForecastDataTemperature = document.createElement('span');
            spanForecastDataTemperature.classList.add('forecast-data');
            spanForecastDataTemperature.innerHTML = `${upcomingCondition.high}${getHtmlEntity('degrees')}/${upcomingCondition.low}${getHtmlEntity('degrees')}`;

            let spanForecastDataCondition = document.createElement('span');
            spanForecastDataCondition.classList.add('forecast-data');
            spanForecastDataCondition.textContent = upcomingCondition.condition;

            let spanUpcoming = document.createElement('span');
            spanUpcoming.classList.add('upcoming');
            spanUpcoming.appendChild(spanSymbol);
            spanUpcoming.appendChild(spanForecastDataTemperature);
            spanUpcoming.appendChild(spanForecastDataCondition);

            divForecastInfo.appendChild(spanUpcoming);
        }

        let divUpcoming = document.querySelector('#upcoming');
        divUpcoming.appendChild(divForecastInfo);
    }
}

attachEvents();