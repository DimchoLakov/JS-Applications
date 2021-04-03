export const settings = {
    host: ''
};

async function request(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        try {
            const data = await response.json();
            return data;
        } catch (error) {
            return response;
        }
    } catch (error) {
        console.log(error.message);
        throw new Error(error);
    }
}

function getOptions(method = 'GET', data) {
    const options = {
        method,
        headers: {}
    };

    const authToken = sessionStorage.getItem('authToken');
    if (authToken !== null) {
        options.headers['X-Authorization'] = authToken;
    }

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    return options;
}

export async function get(url) {
    return await request(url, getOptions());
}

export async function post(url, data) {
    return await request(url, getOptions('POST', data));
}

export async function put(url, data) {
    return await request(url, getOptions('PUT', data));
}

export async function del(url, data) {
    return await request(url, getOptions('DELETE', data));
}

export async function login(email, password) {
    const result = await post(settings.host + '/users/login', { email, password });

    sessionStorage.setItem('username', result.username);
    sessionStorage.setItem('email', result.email);
    sessionStorage.setItem('authToken', result.accessToken);
    sessionStorage.setItem('userId', result._id);

    return result;
}

export async function register(username, email, password, gender) {
    const result = await post(settings.host + '/users/register', { username, email, password, gender });

    sessionStorage.setItem('username', result.username);
    sessionStorage.setItem('email', result.email);
    sessionStorage.setItem('authToken', result.accessToken);
    sessionStorage.setItem('userId', result._id);

    return result;
}

export async function logout() {
    const result = await get(settings.host + '/users/logout');

    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');

    return result;
}