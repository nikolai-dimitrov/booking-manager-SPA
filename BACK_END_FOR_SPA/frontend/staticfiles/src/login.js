import {homeView} from "./home.js";
import {registerView} from "./register.js";
import {normalizeInputFields, changeInputFields, rememberMe, lsRememberMe, getDomainName} from "./utils.js";
import {navActiveClassControl} from "./nav-controls.js";

document.querySelector('.login__form button').addEventListener('click', lsRememberMe);
document.querySelector('.login__form .form_bottom-container a').addEventListener('click', redirectRegister);
document.querySelector('#loginView .login__form').addEventListener('click', changeInputFields);

let otherInputFields = Array.from(document.querySelectorAll('#loginView .login__form input')).filter((input) => input.type !== 'checkbox');


let navElement = document.getElementById('loginBtn');
let section = document.getElementById('loginView');
section.remove();


export function loginView() {
    document.querySelector('main').replaceChildren(section);
    let formBtn = document.querySelector('#loginView form button');
    navActiveClassControl(navElement);
    formBtn.addEventListener('click', loginHandler);
    normalizeInputFields(null, otherInputFields);
    rememberMe();
}

export async function loginHandler(event) {
    event.preventDefault();
    if (sessionStorage.getItem('token') !== '' && sessionStorage.getItem('token') !== null) {
        alert('Already logged in!');
        return
    }
    let form = document.querySelector('#loginView form');

    let formInputs = new FormData(form);

    let username = formInputs.get('username');
    let password = formInputs.get('password');

    let domainName = getDomainName();
    let url = `${domainName}/api/login/`;
    try {
        let response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            })
        })
        if (response.ok === false) {
            let error = await response.json();
            let errorMessage = error.message;
            throw new Error(errorMessage);
        }
        let responseData = await response.json();
        sessionStorage.setItem('token', responseData.token);
        alert(responseData.message);
        document.querySelector('#loginView .login__form input[name="password"]').value = '';
        homeView();
    } catch (error) {
        alert(error.message);
        document.querySelector('#loginView .login__form input[name="password"]').value = '';
    }
}

function redirectRegister(event) {
    event.preventDefault();
    registerView();
}
