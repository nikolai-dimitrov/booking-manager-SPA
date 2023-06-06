import {changeNavForGuests, navActiveClassControl} from './nav-controls.js';
import {getCookie, getRestDaysAsNumber, clearPage, setDatesSessionStorage, getDomainName} from './utils.js';
import {createHotelCard} from './create-html-elements.js';

let section = document.getElementById('homeView');


async function searchHotels(event) {
    let city = document.querySelector('#homeView .hotels__form input[name="destination"]');
    let checkIn = document.querySelector('#homeView .hotels__form input[name="checkInDate"]');
    let checkOut = document.querySelector('#homeView .hotels__form input[name="checkOutDate"]');
    let roomType = document.querySelector('#homeView .hotels__form select');

    let specifyingDates = false;
    let domainName = getDomainName();
    let url = '';
    if (event) {
        if (event.target.tagName === 'BUTTON') {
            event.preventDefault();
            let checkInAsNumber = new Date(checkIn.value);
            let checkOutAsNumber = new Date(checkOut.value);
            let today = new Date();

            today.setHours(0, 0, 0, 0);
            checkInAsNumber.setHours(0, 0, 0, 0);
            checkOutAsNumber.setHours(0, 0, 0, 0);
            if (checkIn.value === "" && checkOut.value !== "") {
                alert('Please enter check in date.');
                return
            } else if (checkIn.value !== "" && checkOut.value === "") {
                alert('Please enter check out date.');
                return
            } else if (checkInAsNumber >= checkOutAsNumber) {
                alert('Check in date must be before check out date.');
                return
            } else if ((checkInAsNumber < today) || (checkOutAsNumber <= today)) {
                alert('Please enter valid dates for your stay.');
                return
            }
            let filtersArr = [city, checkIn, checkOut, roomType];
            let urlExtension = '';
            for (let el of filtersArr) {
                if (el.value !== "") {
                    urlExtension += `&${el.name}=${el.value}`;
                }
            }
            specifyingDates = true;
            url = `${domainName}/api/hotels/?${urlExtension}`;
        }
    } else {
        url = `${domainName}/api/hotels`;
        city.textContent = '';
        checkIn.value = '';
        checkOut.value = '';
        roomType.value = 'Single Room';
    }
    try {
        let token = sessionStorage.getItem('token')

        let response = await fetch(url);
        if (!response.ok) {
            let err = await response.json();
            throw new Error(err);
        }
        let responseData = await response.json();
        let daysToRest = getRestDaysAsNumber(checkIn.value, checkOut.value);
        clearPage(section);
        displayHotels(responseData, roomType.value, daysToRest, specifyingDates);
        setDatesSessionStorage(checkIn.value, checkOut.value);
    } catch (error) {
        alert(error.message);
    }
}


export function homeView(event) {
    let element = document.querySelector('#homeBtn');
    changeNavForGuests();
    navActiveClassControl(element);
    document.querySelector('main').replaceChildren(section);

    searchHotels(event);
    setDatesSessionStorage('', '');

    document.querySelector('#homeView .hotels__form button').addEventListener('click', searchHotels);
    let authToken = getCookie('ADMIN-TOKEN');
    if (authToken === '""') {
        return
    } else {
        sessionStorage.setItem('token', authToken);
    }
}


export function displayHotels(hotelsList, searched_room, daysToRest, specifyingDates) {
    for (const hotelData of hotelsList) {
        createHotelCard(hotelData, section, searched_room, daysToRest, specifyingDates, null);
    }
}
