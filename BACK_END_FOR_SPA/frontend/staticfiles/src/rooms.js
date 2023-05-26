import {loginView} from "./login.js";
import {reservationView} from "./reservation.js";
import {createRoomCard} from "./create-html-elements.js";
import {getRestDaysAsNumber, calculateRoomPrice} from "./importFunc.js";

export async function loadRoomHandler(event, clickedCard) {

    let roomType = clickedCard.querySelector('p.card__room-type').textContent;
    let hotelName = clickedCard.id;

    let checkIn = clickedCard.querySelector("input[name='checkInR']");
    let checkOut = clickedCard.querySelector("input[name='checkOutR']");

    let url = `http://127.0.0.1:8000/api/rooms/?&hotelName=${hotelName}&roomType=${roomType}`;
    let specifiedDates = false;
    if (checkIn !== null && checkOut !== null) {
        url = `http://127.0.0.1:8000/api/rooms/?&hotelName=${hotelName}&roomType=${roomType}&checkIn=${checkIn.value}&checkOut=${checkOut.value}`;
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
        // alert(error.message);
        console.log('NOT AUTHENTICATED')
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
    clickedCard.querySelector('.reservation__btn').addEventListener('click', reservationHandler);

}

async function reservationHandler(event) {
    let cardEl = event.target.parentElement.parentElement.parentElement.parentElement
    if (event.target.textContent === 'Reserve') {
        createReservationHandler(event, cardEl);
    } else {
        let allAvailableRoomsData = await loadRoomHandler(event, cardEl);
        let inputsAndAnchorContainer = event.target.parentElement.parentElement;
        let pElement = inputsAndAnchorContainer.querySelector('p');
        if (allAvailableRoomsData.length > 0) {
            let roomData = allAvailableRoomsData[0];
            event.target.id = roomData.id;
            // console.log(roomData)
            event.target.textContent = 'Reserve';
            event.target.classList.remove('orange');
            event.target.classList.add('green');
            pElement.textContent = 'There are avaible rooms you can continue.';
            calculateRoomPrice(roomData, cardEl);
        } else {
            let checkInDate = inputsAndAnchorContainer.querySelector('input[name="checkInR"]');
            let checkOutDate = inputsAndAnchorContainer.querySelector('input[name="checkOutR"]');
            pElement.textContent = `There aren't avaible rooms for ${checkInDate.value} / ${checkOutDate.value}`;
        }
    }
}


async function createReservationHandler(event, cardEl) {
    let url = 'http://127.0.0.1:8000/api/reservation/create/';
    let checkInDate = '';
    let checkOutDate = '';
    if (sessionStorage.getItem('checkIn') !== '') {
        checkInDate = sessionStorage.getItem('checkIn');
        checkOutDate = sessionStorage.getItem('checkOut');
    } else {
        checkInDate = cardEl.querySelector('.info-wrapper input[name="checkInR"]').value;
        checkOutDate = cardEl.querySelector('.info-wrapper input[name="checkOutR"]').value;
    }
    try {
        let token = sessionStorage.getItem('token');
        let response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({
                'check_in_data': checkInDate,
                'check_out_data': checkOutDate,
                'room': event.target.id,
            })
        })
        if (response.ok === false) {
            let error = await response.json();
            throw new Error(error);
        }
        let responseData = await response.json()
        alert(responseData.message);
        reservationView();

    } catch (error) {
        alert(error.message)
    }
}
