import {roomView} from './rooms.js';
import {changeFacilityNames, checkDates} from "./importFunc.js";

let cancellationMapper = {
    'true': {
        'text': 'FREE Cancellation',
        'className': 'green-cl',
    },
    'false': {
        'text': 'No FREE Cancellation',
        'className': 'red-cl',
    }
}
let prepaymentMapper = {
    'true': {
        'text': 'Prepayment Needed',
        'className': 'red-cl',
    },
    'false': {
        'text': 'No prepayment needed',
        'className': 'green-cl',
    }
}

export function createHotelCard(hotelData, homeView, searched_room, daysToRest,specifyingDates) {
    let rating = ratingMapper(hotelData.rating);
    let roomPrice = getRoomPrice(hotelData.room_set, searched_room, daysToRest);
    let cancellation = cancellationMapper[hotelData.free_cancellation];
    let prepayment = prepaymentMapper[hotelData.prepayment];

    let articleElement = customCreateElements('article', null, homeView, ['home__card'], hotelData.name);
    let divHotelInfo = customCreateElements('div', null, articleElement, ['hotel-info-wrapper']);
    let divImgWrapperElement = customCreateElements('div', null, divHotelInfo, ['card__img-wrapper']);
    let imgElement = customCreateElements('img', null, divImgWrapperElement, ['card__img-wrapper'], null, {'src': hotelData.image});
    let divCardBodyElement = customCreateElements('div', null, divHotelInfo, ['card__body']);
    if (specifyingDates === true) {
        divCardBodyElement.id = hotelData.free_room_id;
    }
    let divCardHeadingWrapperElement = customCreateElements('div', null, divCardBodyElement, ['card__heading-wrapper']);
    // Heading Left
    let divCardHeadingLeftElement = customCreateElements('div', null, divCardHeadingWrapperElement, ['heading__left-side']);
    let divCardHeadingLeftUpperElement = customCreateElements('div', null, divCardHeadingLeftElement, ['heading__left-upper']);
    let h3HeadingLeftUpper = customCreateElements('h3', hotelData.name, divCardHeadingLeftUpperElement, ['card__heading']);
    let spanHeadingStarsLeftUpper = customCreateElements('span', null, divCardHeadingLeftUpperElement, ['card__stars']);
    // let iHeadingStarsLeftUpper = customCreateElements('i', null, spanHeadingStarsLeftUpper, ['fa-solid', 'fa-star']);
    let divCardHeadingLeftLowerElement = customCreateElements('div', null, divCardHeadingLeftElement, ['heading__left-lower']);
    let pCardCityLeftLowerElement = customCreateElements('p', `${hotelData.city},`, divCardHeadingLeftLowerElement, ['card__city']);
    let pCardCountryLeftLowerElement = customCreateElements('p', `${hotelData.country}`, divCardHeadingLeftLowerElement, ['card__country']);
    let pCardDistanceLeftLowerElement = customCreateElements('p', `${hotelData.distance_to_center}km from centre`, divCardHeadingLeftLowerElement, ['card__distance-info']);
    // Heading Right
    let divCardHeadingRightElement = customCreateElements('div', null, divCardHeadingWrapperElement, ['heading__right-side']);
    let pCardRatingTextElement = customCreateElements('p', `${rating.ratingAsText}`, divCardHeadingRightElement, ['card__rating-text']);
    let pCardRatingNumElement = customCreateElements('p', `${rating.ratingAsNum}`, divCardHeadingRightElement, ['card__rating-num', `${rating.className}`]);
    // Description
    let divCardDescWrapperElement = customCreateElements('div', null, divCardBodyElement, ['card__desc-wrapper']);
    // Description Left
    let divCardDescLeftElement = customCreateElements('div', null, divCardDescWrapperElement, ['card__desc-left']);
    let pCardDescRoomElement = customCreateElements('p', `Standard ${searched_room}`, divCardDescLeftElement, ['room']);
    let pCardDescEatingElement = customCreateElements('p', 'Breakfast included', divCardDescLeftElement, ['eating']);
    let pCardDescCancellationElement = customCreateElements('p', `${cancellation.text}`, divCardDescLeftElement, ['cancellation', `${cancellation.className}`]);
    let pCardDescPrepaymentElement = customCreateElements('p', `${prepayment.text}`, divCardDescLeftElement, ['prepayment', `${prepayment.className}`]);
    // Description Right
    let divCardDescRightElement = customCreateElements('div', null, divCardDescWrapperElement, ['card__desc-right']);
    let pCardDescNightsElement = customCreateElements('p', `${daysToRest} night`, divCardDescRightElement, ['card__night']);
    let pCardDescRoomTypeElement = customCreateElements('p', `${searched_room}`, divCardDescRightElement, ['card__room-type']);
    let pCardDescPriceElement = customCreateElements('p', `BGN ${roomPrice}`, divCardDescRightElement, ['card__price']);
    let pCardDescPriceDescElement = customCreateElements('p', 'Includes taxes', divCardDescRightElement, ['card__price-desc']);
    let anchorCard = customCreateElements('a', 'More Information', divCardDescRightElement, ['card__btn'], null, {'href': '#/'});
    anchorCard.addEventListener('click', roomView);

    let divRoomInfo = customCreateElements('div', null, articleElement, ['hide-element', 'room__info-wrapper'])

    appendStars(hotelData.stars, spanHeadingStarsLeftUpper);
}

function getRoomPrice(roomSet, searched_room, daysToRest) {
    let room = roomSet.filter((room) => room.room_type === searched_room)[0];
    let roomPrice = room.price * daysToRest;
    return roomPrice;
}

function appendStars(stars_number, spanEl) {
    for (let i = 0; i < stars_number; i++) {
        let iHeadingStarsLeftUpper = customCreateElements('i', null, spanEl, ['fa-solid', 'fa-star', 'orange-cl']);
    }

}

function ratingMapper(rating) {
    let ratingObj = {
        'ratingAsText': null,
        'className': null,
        'ratingAsNum': rating,
    }
    if (Number.isInteger(rating)) {
        ratingObj.ratingAsNum = `${rating}.0`
    }
    if (rating >= 8.5) {
        ratingObj.ratingAsText = 'Super';
        ratingObj.className = 'green';
    } else if (rating < 8.5 && rating >= 5) {
        ratingObj.ratingAsText = 'Average';
        ratingObj.className = 'orange';
    } else if (rating < 5 && rating >= 0) {
        ratingObj.ratingAsText = 'Poor';
        ratingObj.className = 'red';
    }
    return ratingObj
}

export function createRoomCard(roomData, cardEl) {
    let roomInfoWrapper = cardEl.querySelector('div.room__info-wrapper');
    roomInfoWrapper.innerHTML = '';
    let checkInDate = document.querySelector('#homeView .hotels__form input[name="checkInDate"]');
    let checkOutDate = document.querySelector('#homeView .hotels__form input[name="checkOutDate"]');

    let h3HeadingRoomInfo = customCreateElements('h3', 'Our room features:', roomInfoWrapper);
    // First ul contain room features
    let ulRoomItemsElement = customCreateElements('ul', null, roomInfoWrapper, ['room__items'], null, {'role': 'list'});
    fillRoomUlElements(roomData, ulRoomItemsElement, false);
    let divDivider = customCreateElements('div', null, roomInfoWrapper, ['divider']);
    // Second ul contain room facilities
    let ulFacilityItemsElement = customCreateElements('ul', null, roomInfoWrapper, ['room__facilities'], null, {'role': 'list'});
    fillRoomUlElements(roomData, ulFacilityItemsElement, true);
    let divDividerSecond = customCreateElements('div', null, roomInfoWrapper, ['divider']);
    // Remove divider if room's facilities = 0
    if (roomData.roomfacilities_set[0] === undefined) {
        divDividerSecond.style.display = 'none';
    }

    let divFinishReservationElement = customCreateElements('div', null, roomInfoWrapper, ['continue__reserve-wrapper']);
    let divInfoWrapperElement = customCreateElements('div', null, divFinishReservationElement, ['info-wrapper']);
    let divAnchorWrapperElement = customCreateElements('div', null, divFinishReservationElement, ['button-wrapper']);
    let anchorReserveElement = customCreateElements('a', 'Reserve', divAnchorWrapperElement, ['reservation__btn',], null);

    if (sessionStorage.getItem('checkIn') !== "") {
        anchorReserveElement.classList.add('green');
        let cBody = cardEl.querySelector('.card__body')
        anchorReserveElement.id = cBody.id;
    } else {
        divInfoWrapperElement.classList.add('no-date-flex')
        let pReservationTextElement = customCreateElements('p', "Please enter check in\\check out date for your stay.", divInfoWrapperElement, ['bolded-el']);
        let labelCheckInElement = customCreateElements('label', 'Check In:', divInfoWrapperElement, null, null, {'for': 'checkInR'});
        let inputCheckInElement = customCreateElements('input', null, labelCheckInElement, ['reservation__inputs'], null, {
            'type': 'date',
            'name': 'checkInR'
        });
        let labelCheckOutElement = customCreateElements('label', 'Check Out:', divInfoWrapperElement, null, null, {'for': 'checkOutR'});
        let inputCheckOutElement = customCreateElements('input', null, labelCheckOutElement, ['reservation__inputs'], null, {
            'type': 'date',
            'name': 'checkOutR'
        });
        anchorReserveElement.classList.add('gray');
        anchorReserveElement.classList.add('disableClick');
        anchorReserveElement.textContent = 'Check Dates';
        divFinishReservationElement.classList.add('no-date-flex-end');

        inputCheckInElement.addEventListener('input', checkDates);
        inputCheckOutElement.addEventListener('input', checkDates);
    }
}


function Room(roomData) {
    this.roomData = roomData
    this.displayRoomData = {
        'air_conditioning': {
            'name': 'Air conditioning',
            'iconClass': ['fa-solid', 'fa-snowflake'],
        },
        'tv': {
            'name': 'TV',
            'iconClass': ['fa-solid', 'fa-tv'],
        },
        'balcony': {
            'name': 'Balcony',
            'iconClass': ['fa-solid', 'fa-umbrella-beach'],
        },
        'private_bath': {
            'name': 'Private bath',
            'iconClass': ['fa-solid', 'fa-shower'],
        },
        'view': {
            'name': this.roomData.view,
            'iconClass': ['fa-solid', 'fa-mountain-sun'],
        },
        'size': {
            'name': this.roomData.size,
            'iconClass': ['fa-solid', 'fa-door-open'],
        }
    }

}


function fillRoomUlElements(roomData, ulParent, facilities) {
    if (facilities === false) {
        let currentRoom = new Room(roomData)
        for (const key in roomData) {
            if (roomData[key] === true || key === 'view' || key === 'size') {
                let liEl = customCreateElements('li', null, ulParent, ['item']);
                let pEl = customCreateElements('p', `${currentRoom.displayRoomData[key].name}`, liEl);
                let iEl = customCreateElements('i', null, pEl, currentRoom.displayRoomData[key].iconClass);
            }
        }
    } else {
        let facilitiesList = roomData.roomfacilities_set[0];
        for (const facilityKey in facilitiesList) {
            if (facilitiesList[facilityKey] === true) {
                let changedFacilityName = changeFacilityNames(facilityKey)
                let liEl = customCreateElements('li', null, ulParent, ['item'])
                let pEl = customCreateElements('p', `${changedFacilityName}`, liEl)
                let iEl = customCreateElements('i', null, pEl, ['fa-solid', 'fa-check', 'green-cl']);
            }
        }
    }
}

function customCreateElements(type, content, parent, classes, id, attributes) {
    let element = document.createElement(type);
    if (content && type !== 'input') {
        element.textContent = content;
    }
    if (content && type === 'input') {
        element.value = content;
    }
    if (classes && classes.length > 0) {
        element.classList.add(...classes);
    }
    if (id) {
        element.id = id;
    }
    if (attributes) {
        for (const attrName in attributes) {
            element.setAttribute(attrName, attributes[attrName]);
        }
    }
    if (parent) {
        parent.appendChild(element);
    }
    return element;
}
