import {navActiveClassControl} from "./nav-controls.js";

let section = document.getElementById('reservationView');
section.remove()

export function reservationView() {
    let element = document.querySelector('#reservationBtn');
    navActiveClassControl(element)
    document.querySelector('main').replaceChildren(section);
}