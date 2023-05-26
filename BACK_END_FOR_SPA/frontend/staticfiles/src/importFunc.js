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

export function getCookie(cname) {
    let name = cname + '=';
    let splittedCookies = document.cookie.split(';')
    console.log(splittedCookies)
    for (let i = 0; i < splittedCookies.length; i++) {
        let c = splittedCookies[i].split('=');
        let name = c[0].trim();
        let value = c[1].trim();
        if (name === 'ADMIN-TOKEN') {
            return value;
        }
    }
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

export function clearHomePage() {
    document.querySelectorAll('#homeView article.home__card').forEach((el) => el.remove());
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
            let checkInDate = new Date(checkInField.value);
            let checkOutDate = new Date(checkOutField.value);
            if (checkInDate >= checkOutDate) {
                pElement.textContent = 'Check in date must be before check out date!'
                btn.textContent = 'Check Dates';
                btn.classList.add('disableClick');
                btn.classList.add('gray');
                btn.classList.remove('orange');
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