import {getCookie, getDomainName} from './utils.js';

let section = document.getElementById('aboutUsView');
section.remove()

export function aboutView() {
    document.querySelector('main').replaceChildren(section);
    let formButton = document.querySelector('.about__form button');
    formButton.addEventListener('click', sendEmail);
}

async function sendEmail(event) {
    event.preventDefault();
    const csrftoken = getCookie('csrftoken');
    let form = document.querySelector('.about__form');
    let firstName = form.querySelector('.layout1');
    let lastName = form.querySelector('.layout2');
    let phoneNumber = form.querySelector('.layout3');
    let userEmail = form.querySelector('.layout4');
    let userMessage = form.querySelector('.layout5');

    let emptyFields = checkAboutFormFieldsEmpty([firstName, lastName, phoneNumber, userEmail, userMessage]);
    if (emptyFields === true) {
        alert('All fields are required.');
        aboutView();
        return
    }
    let domainName = getDomainName();
    let url = `${domainName}/api/email/`;
    let token = sessionStorage.getItem('token');
    try {
        let response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                'firstName': firstName.value,
                'lastName': lastName.value,
                'phoneNumber': phoneNumber.value,
                'userEmail': userEmail.value,
                'userMessage': userMessage.value,
            })
        });
        document.querySelector('.successfully_message').classList.add('about_popup');
        let formEl = event.target.parentElement;
        clearAboutForm(formEl);
        setTimeout(removeAboutPopup, 3000);

    } catch (error) {

    }
}

function removeAboutPopup() {
    let element = document.querySelector('.successfully_message');
    element.classList.remove('about_popup');
}

function clearAboutForm(form) {
    let inputs = form.querySelectorAll('input');
    let textArea = form.querySelector('textarea');
    inputs.forEach((el) => el.value = '');
    textArea.value = '';
}

function checkAboutFormFieldsEmpty(fields) {
    console.log(fields)
    for (let el of fields) {
        if (el.value === '') {
            return true
        }
    }
}
