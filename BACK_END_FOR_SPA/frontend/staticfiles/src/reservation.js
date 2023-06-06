import {navActiveClassControl} from "./nav-controls.js";
import {createRoomCard, createHotelCard} from "./create-html-elements.js";
import {calculateRoomPrice, clearPage, getDomainName, getRestDaysAsNumber} from "./utils.js";
import {loadRoomHandler} from "./rooms.js";

let section = document.getElementById('reservationView');
section.remove()

let domainName = getDomainName()

export async function reservationView() {
    let element = document.querySelector('#reservationBtn');
    navActiveClassControl(element)
    await loadReservationsHandler()
    document.querySelector('main').replaceChildren(section);
}

async function loadReservationsHandler(event) {
    let url = `${domainName}/api/user/reservations/`;
    let token = sessionStorage.getItem('token');
    clearPage(section)
    try {
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
        console.log(responseData)
        if (responseData.length > 0) {
            for (const el of responseData) {
                let daysToRest = getRestDaysAsNumber(el['check_in_data'], el['check_out_data']);
                let roomPrice = daysToRest * el['room']['price'];
                let dates = [el['check_in_data'], el['check_out_data']];
                let reservationId = el['id']
                let hotelData = el['room']['hotel']
                let roomType = el['room']['room_type']
                createHotelCard(hotelData, section, roomType, daysToRest, false, roomPrice, dates, reservationId);
            }
        }
    } catch (error) {
        alert(error.message);
    }
}

export function confirmDeleteReservation(event) {
    event.preventDefault();
    let divWrapperEl = event.target.parentElement.nextElementSibling;
    divWrapperEl.classList.add('show-popup');
    divWrapperEl.querySelectorAll('a')[0].addEventListener('click', deleteReservation);
    divWrapperEl.querySelectorAll('a')[1].addEventListener('click', function (event) {
        event.target.parentElement.classList.remove('show-popup')
    });
}

export async function deleteReservation(event) {
    let reservationId = event.target.parentElement.parentElement.querySelector('.reservation__btn').id;
    let cardEl = event.target.parentElement.parentElement.parentElement.parentElement
    let url = `${domainName}/api/user/reservation/delete/${reservationId}/`;
    try {
        let token = sessionStorage.getItem('token');
        let response = await fetch(url, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });
        cardEl.remove();
        showSuccessfullyDeletedEntityPopup(event)
    } catch (error) {
        alert(error.message);
    }
}

function showSuccessfullyDeletedEntityPopup(event) {
    let deletedEntityPopupEl = document.querySelector('.del__confirmation');
    deletedEntityPopupEl.classList.add('show-delete-confirmation');
    deletedEntityPopupEl.querySelector('i').addEventListener('click', function (event) {
        deletedEntityPopupEl.classList.remove('show-delete-confirmation');
    })
}

export async function reservationHandler(event) {
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
    let url = `${domainName}/api/reservation/create/`;
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