export function changeInputFields(event) {
    let allInputFields = Array.from(event.target.parentElement.parentElement.querySelectorAll('input'));
    if (event.target.type === 'checkbox') {
        allInputFields = Array.from(event.target.parentElement.parentElement.parentElement.querySelectorAll('input'));
    }
    let otherInputFields = allInputFields.filter((input) => input.type !== 'checkbox');
    if (event.target.tagName === 'INPUT' && event.target.type !== 'checkbox') {
        event.target.parentElement.classList.add('active_input');
        event.target.parentElement.querySelector('.input-layer').classList.add('active_input-layer');
        event.target.parentElement.querySelector('i').classList.add('active_form-icon');
    }
    normalizeInputFields(event, otherInputFields);
}

export function normalizeInputFields(event, otherInputFields) {
    let notRemovableField = null;
    if (event === null) {
        notRemovableField = null;
    } else if (event) {
        notRemovableField = event.target;
    }
    otherInputFields.forEach((input) => cleanFields(input, notRemovableField));
}

export function cleanFields(inputField, notRemovableField) {
    if (inputField !== notRemovableField) {
        // if (inputField.type === 'checkbox') {
        //     return;
        // }
        let parent = inputField.parentElement;
        parent.classList.remove('active_input');
        parent.querySelector('.input-layer').classList.remove('active_input-layer');
        parent.querySelector('i').classList.remove('active_form-icon');
        return inputField;
    }
}

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function rememberMe() {
    const rmCheck = document.getElementById("rememberMe"),
        username = document.querySelector('#loginView .login__form input[name="username"]');
    let pass = document.querySelector('#loginView .login__form input[name="password"]');

    if (localStorage.checkbox && localStorage.checkbox !== "") {
        rmCheck.setAttribute("checked", "checked");
        username.value = localStorage.username;
    } else {
        rmCheck.removeAttribute("checked");
        username.value = "";
        pass.value = "";
    }
}

export function lsRememberMe() {
    let rmCheck = document.getElementById("rememberMe");
    let username = document.querySelector('#loginView .login__form input[name="username"]');
    if (rmCheck.checked && username.value !== "") {
        localStorage.username = username.value;
        localStorage.checkbox = rmCheck.value;
    } else {
        localStorage.username = "";
        localStorage.checkbox = "";
    }
}

export function getRestDaysAsNumber(checkIn, checkOut) {
    if (checkIn !== '' && checkOut !== '') {
        let checkInDate = new Date(checkIn);
        let checkOutDate = new Date(checkOut);
        let difference = checkOutDate.getTime() - checkInDate.getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return totalDays;
    } else {
        return 1;
    }

}

export function clearPage(section) {
    section.querySelectorAll('article.home__card').forEach((el) => el.remove());
    console.log(section)
}

export function setDatesSessionStorage(checkIn, checkOut) {
    sessionStorage.setItem('checkIn', checkIn);
    sessionStorage.setItem('checkOut', checkOut);
}

export function calculateRoomPrice(roomData, cardEl) {
    let checkIn = cardEl.querySelector('.info-wrapper input[name="checkInR"]');
    let checkOut = cardEl.querySelector('.info-wrapper input[name="checkOutR"]');
    let days = getRestDaysAsNumber(checkIn.value, checkOut.value);
    let newPrice = roomData.price * days;
    let cardPriceField = cardEl.querySelector('.card__price');
    cardPriceField.textContent = `BGN ${newPrice}`;
}

export function changeFacilityNames(name) {
    let changedName = name[0].toUpperCase() + name.slice(1);
    changedName = changedName.split('_').join(' ');
    return changedName;
}

export function checkDates(event) {
    if (event.target.value !== '') {
        let reservationInputs = document.querySelectorAll('.info-wrapper input.reservation__inputs');
        let otherInput = '';
        for (const inputEl of reservationInputs) {
            if (inputEl !== event.target) {
                otherInput = inputEl
            }
        }
        if (otherInput.value !== '') {
            let parentContainer = event.target.parentElement.parentElement.parentElement
            let btn = parentContainer.querySelector('.reservation__btn');
            let pElement = parentContainer.querySelector('p');
            let checkInField = parentContainer.querySelector('.info-wrapper input[name="checkInR"]');
            let checkOutField = parentContainer.querySelector('.info-wrapper input[name="checkOutR"]');
            let today = new Date()
            let checkInDate = new Date(checkInField.value);
            let checkOutDate = new Date(checkOutField.value);
            if (checkInDate < today || checkOutDate <= today) {
                pElement.textContent = 'Please enter valid date for your stay.'
                disableReservationBtn(btn)
                return
            } else if (checkInDate >= checkOutDate) {
                pElement.textContent = 'Check in date must be before check out date!'
                btn.textContent = 'Check Dates';
                disableReservationBtn(btn);
                return
            } else {
                pElement.textContent = 'Please enter check in\\check out date for your stay.'
                btn.textContent = 'Check Dates'
                btn.removeAttribute('disabled');
                btn.classList.remove('gray');
                btn.classList.remove('disableClick');
                btn.classList.add('orange');
            }
        }
    }
}

function disableReservationBtn(btn) {
    btn.classList.add('disableClick');
    btn.classList.add('gray');
    btn.classList.remove('orange');
}

export function getDomainName() {
    // return 'https://bookingmanager.westeurope.cloudapp.azure.com';
    return 'http://127.0.0.1:8000';
    // return 'http://localhost:81';
}