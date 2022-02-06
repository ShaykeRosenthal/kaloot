const BASE_URL = process.env.NODE_ENV !== 'development' ? '/api/' : "http://localhost:3030/api/"

async function bringMeStuff(endpoint = '', method = 'GET', data = {}) {
    var isDataValid = (Object.keys(data).length === 0
        && Object.getPrototypeOf(data) === Object.prototype && typeof (data) === 'object') ? false : true;

    if (method !== 'GET' && !isDataValid) {
        console.log(`failed to access server with method:${method} at address ${BASE_URL + endpoint} with isDataValid ${isDataValid}`);
        return;
    }
    var options = isDataValid ? {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    } : false
    try {
        console.log('options:', options)
        var response = options ? await fetch(BASE_URL + endpoint, options) : await fetch(BASE_URL + endpoint)
        var result = await response.json()
        return result;

    } catch (err) {
        console.error('couldnt bring you the stuff,sorry...', err);
    }

}
export default bringMeStuff