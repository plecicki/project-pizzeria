import {templates, select} from "../settings.js";
import AmountWidget from "./AmountWidget.js";

class Booking {
    constructor(element) {
        const thisBooking = this;

        console.log('element', element);

        thisBooking.render(element);
        thisBooking.initWidgets();
    }

    render(element) {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();

        thisBooking.dom = {}
        thisBooking.dom.wrapper = element;

        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        console.log('thisBooking.dom.peopleAmount', thisBooking.dom.peopleAmount);
        console.log('thisBooking.dom.hoursAmount', thisBooking.dom.hoursAmount);

        new AmountWidget(thisBooking.dom.peopleAmount);
        new AmountWidget(thisBooking.dom.hoursAmount);

        thisBooking.dom.peopleAmount.addEventListener('updated', function () {

        });
        thisBooking.dom.hoursAmount.addEventListener('updated', function () {
            
        });
    }

    initWidgets() {
        const thisBooking = this;
    }
}

export default Booking;