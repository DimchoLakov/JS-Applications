window.addEventListener('load', async function (event) {
    await loadStudents(event);

    const formCreateStudent = document.querySelector('#CreateStudentForm');
    formCreateStudent.addEventListener('submit', createStudent);
});

async function loadStudents(event) {
    event.preventDefault();

    const response = await fetch('http://localhost:3030/jsonstore/collections/students');
    const data = await response.json();
    console.log(data);

    const tableResults = document.querySelector('#results tbody');
    let students = Object.values(data);
    for (const student of students) {
        let tr = e('tr', {});
        let tdFirstName = e('td', {}, student.firstName);
        let tdLastName = e('td', {}, student.lastName);
        let tdFacultyNumber = e('td', {}, student.facultyNumber);
        let tdGrade = e('td', {}, student.grade);

        tr.appendChild(tdFirstName);
        tr.appendChild(tdLastName);
        tr.appendChild(tdFacultyNumber);
        tr.appendChild(tdGrade);
        tableResults.append(tr);
    }

}

async function createStudent(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    let firstName = formData.get('firstName');
    let lastName = formData.get('lastName');
    let facultyNumber = formData.get('facultyNumber');
    let grade = formData.get('grade');

    let divError = document.querySelector('#error');

    let areAnyInputsEmpty = [...formData].some(x => x[1] === '');
    if (areAnyInputsEmpty) {
        divError.textContent = 'All field are required!';

        return false;
    } else {
        divError.textContent = '';

        const response = await fetch('http://localhost:3030/jsonstore/collections/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                facultyNumber,
                grade
            })
        });

        console.log(await response.text())
        
        event.target.reset();
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
