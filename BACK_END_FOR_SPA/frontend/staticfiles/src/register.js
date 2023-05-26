import {loginView} from "./login.js";
import {homeView} from "./home.js";
import {normalizeInputFields, changeInputFields} from "./importFunc.js";
import {navActiveClassControl} from "./nav-controls.js";

let section = document.getElementById('registerView');
let navElement = document.getElementById('registerBtn');

document.querySelector('#registerView .login__form').addEventListener('click', changeInputFields);
let otherInputFields = document.querySelectorAll('#registerView .login__form input');
// TODO: REGISTER I LOGIN HANDLER KATO SE REGNESH DA TE PRASHTA V LOGIN I OT LOGIN V HOME
section.remove();
let form = section.querySelector('form');

export function registerView() {
    document.querySelector('main').replaceChildren(section);
    let formBtn = document.querySelector('#registerView form button');
    navActiveClassControl(navElement);
    formBtn.addEventListener('click', registerHandler);
    normalizeInputFields(null, otherInputFields);

}


async function registerHandler(event) {
    event.preventDefault();

    let formInputs = new FormData(form);

    let email = formInputs.get('email');
    let username = formInputs.get('username');
    let password = formInputs.get('password');
    let rePassword = formInputs.get('repass');

    let url = 'http://127.0.0.1:8000/api/signup/';
    try {
        if (email === '' || password === '') {
            throw new Error('All fields are required!');
        }
        if (password !== rePassword) {
            throw new Error('Password must be equal!');
        }
        let response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                username,
                password,
            })
        })
        if (response.ok === false) {
            let error = await response.json();
            let [key, value] = Object.entries(error);
            let errorMessage = key[1].join('');
            throw new Error(errorMessage);
        }
        let responseData = await response.json()
        sessionStorage.setItem('data', JSON.stringify(responseData));
        alert(responseData.message);
        loginView();
    } catch (error) {
        alert(error.message);
        document.querySelector('#registerView .login__form input[name="password"]').value = '';
        document.querySelector('#registerView .login__form input[name="repass"]').value = '';
    }
}