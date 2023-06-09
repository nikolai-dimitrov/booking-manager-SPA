import {homeView} from './home.js';
import {loginView} from './login.js';
import {registerView} from './register.js';
import {changeNavForGuests, navActiveClassControl} from './nav-controls.js';
import {aboutView} from './about.js';
import {reservationView} from './reservation.js';
import {getDomainName} from './utils.js'

document.getElementById('nav').addEventListener('click', navHandler);

async function logoutHandler() {
    let domainName = getDomainName();
    let url = `${domainName}/admin/logout`;
    if (sessionStorage.getItem('token') === null) {
        alert('You are not logged in!');
    } else {
        document.cookie = 'ADMIN-TOKEN=""';
        let response = await fetch(url);
        sessionStorage.removeItem('token');
        alert('You are logged out!');
        homeView();
    }
}


let sections = {
    'homeBtn': homeView,
    'loginBtn': loginView,
    'registerBtn': registerView,
    'logoutBtn': logoutHandler,
    'aboutBtn': aboutView,
    'reservationBtn': reservationView,
}

homeView();
changeNavForGuests()

function navHandler(event) {
    if (event.target.tagName === 'A') {
        let element = event.target
        navActiveClassControl(element);
        let view = sections[event.target.id];
        changeNavForGuests()
        if (typeof view === 'function') {
            event.preventDefault();
            view();
        }
    }
}

