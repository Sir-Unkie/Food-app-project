import { TIMEOUT_SEC } from './config.js';
import { async } from 'regenerator-runtime';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const getJSON = async function (URL) {
    try {
        console.log('URL2', URL);
        const res = await Promise.race([fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/?search=pizza&key=3372ab01-dff1-4333-8bdf-020c866cf664`), timeout(TIMEOUT_SEC)]);
        console.log('res', res);
        const data = await res.json();
        console.log('data: ', data);
        if (!res.ok) throw new Error(`${data.message}, status: ${res.status}`);
        return data;
    } catch (err) {
        throw err
    }
}

export const sendJSON = async function (URL, uploadData) {
    try {
        console.log('URL', URL);
        const res = await Promise.race([fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData),
        }), timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message}, status: ${res.status}`);
        return data;
    } catch (err) {
        throw err
    }
}