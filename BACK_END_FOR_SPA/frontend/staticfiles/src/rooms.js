import {loginView} from "./login.js";
import {reservationView, confirmDeleteReservation, reservationHandler} from "./reservation.js";
import {createRoomCard} from "./create-html-elements.js";
import {getDomainName} from "./utils.js";

export async function loadRoomHandler(event, clickedCard) {

    let roomType = clickedCard.querySelector('p.card__room-type').textContent;
    let hotelName = clickedCard.id;

    let checkIn = clickedCard.querySelector("input[name='checkInR']");
    let checkOut = clickedCard.querySelector("input[name='checkOutR']");

    let domainName = getDomainName();
    let url = `${domainName}/api/rooms/?&hotelName=${hotelName}&roomType=${roomType}`;
    let specifiedDates = false;
    if (checkIn !== null && checkOut !== null) {
        url = `${domainName}/api/rooms/?&hotelName=${hotelName}&roomType=${roomType}&checkIn=${checkIn.value}&checkOut=${checkOut.value}`;
        specifiedDates = true
    }
    try {
        let token = sessionStorage.getItem('token');
        let response = await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            }
        });
        if (response.ok === false) {
            let error = await response.json();
            let errorMessage = error.message;
            throw new Error(errorMessage);
        }
        let responseData = await response.json();
        if (specifiedDates) {
            return responseData
        } else {
            displayRoom(event, responseData, clickedCard)
        }
    } catch (error) {
        alert(error.message);
    }
}

export async function roomView(event) {
    event.preventDefault();
    if (sessionStorage.getItem('token') === '' || sessionStorage.getItem('token') === null) {
        alert('Please log in!')
        loginView();
    }
    let clickedCard = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    let hiddenEl = clickedCard.querySelector('.hide-element');
    if (event.target.textContent === 'More Information') {
        hiddenEl.style.display = 'block';
        event.target.textContent = 'Show less';
    } else {
        event.target.textContent = 'More Information';
        hiddenEl.style.display = 'none';

    }
    await loadRoomHandler(event, clickedCard);
}


export function displayRoom(event, roomData, clickedCard) {
    let room = roomData[0];
    createRoomCard(room, clickedCard);
    let anchorElement = clickedCard.querySelector('.reservation__btn');
    if (anchorElement.textContent === 'Cancel') {
        anchorElement.addEventListener('click', confirmDeleteReservation);
    } else {
        anchorElement.addEventListener('click', reservationHandler);
    }

}
