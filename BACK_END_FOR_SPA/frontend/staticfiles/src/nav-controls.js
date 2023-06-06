export function changeNavForGuests(event) {
    let loginBtn = document.getElementById('loginBtn');
    let registerBtn = document.getElementById('registerBtn');
    let logoutBtn = document.getElementById('logoutBtn');
    let aboutBtn = document.getElementById('aboutBtn');
    let reservationBtn = document.getElementById('reservationBtn');
        if (sessionStorage.getItem('token') === null) {
        logoutBtn.parentElement.style.display = 'none';
        reservationBtn.parentElement.style.display = 'none';
        loginBtn.parentElement.style.display = '';
        registerBtn.parentElement.style.display = '';
    } else {
        logoutBtn.parentElement.style.display = '';
        reservationBtn.parentElement.style.display = '';
        loginBtn.parentElement.style.display = 'none';
        registerBtn.parentElement.style.display = 'none';
    }
}

export function navActiveClassControl(element) {
    let otherNavElements = document.querySelectorAll('nav li a');
    otherNavElements.forEach((el) => el.classList.remove('active'));
    element.classList.add('active');
}
