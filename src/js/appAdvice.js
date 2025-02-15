
export const appAdvice = {}; // eslint-disable-line no-unused-vars

appAdvice.configureNavLink = function (thisApp, link) {
    link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
    });
};