let section = document.getElementById('aboutUsView');
section.remove()

export function aboutView() {
    document.querySelector('main').replaceChildren(section);
}