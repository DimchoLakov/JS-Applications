const allMonths = {
    'jan': 1,
    'feb': 2,
    'mar': 3,
    'apr': 4,
    'may': 5,
    'jun': 6,
    'jul': 7,
    'aug': 8,
    'sept': 9,
    'oct': 10,
    'nov': 11,
    'dec': 12
};

const years = [...document.querySelectorAll('.monthCalendar')]
    .reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
    }, {});

const months = [...document.querySelectorAll('.daysCalendar')]
    .reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
    }, {});

const yearSelect = document.querySelector('#years');

document.body.innerHTML = '';
document.body.appendChild(yearSelect);

[...yearSelect.querySelectorAll('.day')].forEach(x =>
    x.addEventListener('click', function (event) {
        let year = event.target.textContent.trim();
        let yearId = `year-${year}`;

        if (years.hasOwnProperty(yearId)) {
            const month = years[yearId];

            updateBody(month);

            month.querySelector('caption').addEventListener('click', function () {
                updateBody(yearSelect);
            });

            [...month.querySelectorAll('.day')].forEach(x =>
                x.addEventListener('click', function (event) {
                    let currentMonthName = event.target.textContent.trim().toLowerCase();
                    let monthNumber = allMonths[currentMonthName];
                    let currentMonthId = `month-${year}-${monthNumber}`;

                    if (months.hasOwnProperty(currentMonthId)) {
                        const daysOfMonth = months[currentMonthId];

                        updateBody(daysOfMonth);

                        daysOfMonth.querySelector('caption').addEventListener('click', function () {
                            updateBody(month);
                        });
                    }
                }));
        }
    }));

function updateBody(sectionToAppend) {
    document.body.innerHTML = '';
    document.body.appendChild(sectionToAppend);
}