import {templates, select, settings, classNames} from "../settings.js";
import { utils } from "../utils.js";
import AmountWidget from "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";

class Booking {
    constructor(element) {
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();
        thisBooking.initChoosingTable();
        thisBooking.initBooking();
    }

    initBooking() {
        const thisBooking = this;

        thisBooking.dom.orderButton.addEventListener('click', function(event) {
            event.preventDefault();
            const bookData = thisBooking.collectBookData();
            thisBooking.sendBooking(bookData);
        });
    }

    sendBooking(bookData) {
        const thisBooking = this;

        const url = settings.db.url + '/' + settings.db.bookings;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        };

        fetch(url, options)
            .then(function (response) {
                if (response.ok) {
                    thisBooking.makeBooked(bookData.date, bookData.hour, bookData.duration, bookData.table);
                    thisBooking.updateDOM();
                    thisBooking.resetTableChoice();
                    return response.json();
                }
                throw new Error('Something went wrong');
            }).then(function (parsedResponse) {
            console.log('parsedResponse', parsedResponse);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    collectBookData() {
        const thisBooking = this;

        const collectBookData = {};

        collectBookData.date = thisBooking.datePicker.value;
        collectBookData.hour = thisBooking.hourPicker.value;

        const chosenTableDOM = thisBooking.dom.chosenTable;
        if (chosenTableDOM) {
            collectBookData.table = parseInt(chosenTableDOM.getAttribute(settings.booking.tableIdAttribute));
        } else {
            collectBookData.table = null;
        }

        collectBookData.duration = thisBooking.hoursAmount.value;
        collectBookData.ppl = thisBooking.peopleAmount.value;

        collectBookData.starters = [];
        for(let checkboxId in thisBooking.dom.bookCheckboxes) {
            const checkbox = thisBooking.dom.bookCheckboxes[checkboxId];
            if (checkbox.checked) {
                collectBookData.starters.push(checkbox.value);
            }
        }

        collectBookData.phone = thisBooking.dom.telephoneInput.value;
        collectBookData.address = thisBooking.dom.addressInput.value;

        return collectBookData;
    }

    initChoosingTable() {
        const thisBooking = this;

        thisBooking.dom.chosenTable;

        for (let table of thisBooking.dom.tables) {
            table.addEventListener('click', function (){
                if (thisBooking.dom.chosenTable === table) {
                    thisBooking.resetTableChoice();
                } else {
                    thisBooking.checkAndChooseTable(table);
                }
            });
        }

        thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.resetTableChoice();
        })
    }

    resetTableChoice() {
        const thisBooking = this;

        if (thisBooking.dom.chosenTable) {
            thisBooking.dom.chosenTable.classList.remove(classNames.booking.tableChosen);
            thisBooking.dom.chosenTable = undefined;
        }
    }

    checkAndChooseTable(table) {
        const thisBooking = this;

        const date = thisBooking.datePicker.value;
        const hour = thisBooking.hourPicker.value;
        const parsedHour = utils.hourToNumber(hour);
        const tableNumber = table.getAttribute(settings.booking.tableIdAttribute);
        const parsedTableNumber = parseInt(tableNumber);

        if (!thisBooking.isTableBooked(date, parsedHour, parsedTableNumber)) {
            if (thisBooking.dom.chosenTable) {
                thisBooking.dom.chosenTable.classList.remove(classNames.booking.tableChosen);
            }
            table.classList.add(classNames.booking.tableChosen);
            thisBooking.dom.chosenTable = table;
        }
    }

    getData() {
        const thisBooking = this;

        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

        const params = {
            booking: [
                startDateParam,
                endDateParam,
            ],
            eventsCurrent: [
                settings.db.notRepeatParam,
                startDateParam,
                endDateParam,
            ],
            eventsRepeat: [
                settings.db.repeatParam,
                endDateParam,
            ],
        };

        const urls = {
            booking:       settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.events + '?' + params.eventsCurrent.join('&'),
            eventsRepeat:  settings.db.url + '/' + settings.db.events + '?' + params.eventsRepeat.join('&'),
        };

        Promise.all([
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])
            .then(function(allResponses){
                const bookingResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all([
                    bookingResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json(),
                ]);
            })
            .then(function([bookings, eventsCurrent, eventsRepeat]){
                // console.log(bookings);
                // console.log(eventsCurrent);
                // console.log(eventsRepeat);

                thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            })
    }

    parseData(bookings, evetsCurrent, eventsRepeat) {
        const thisBooking = this;

        thisBooking.booked = {};

        for (let item of bookings) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        for (let item of evetsCurrent) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;

        for (let item of eventsRepeat) {
            if (item.repeat == 'daily') {
                for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }
        }

        console.log('thisBooking.booked', thisBooking.booked);
        thisBooking.updateDOM();
    }

    makeBooked(date, hour, duration, table) {
        const thisBooking = this;

        if (typeof thisBooking.booked[date] == 'undefined') {
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);

        for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
            if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
                thisBooking.booked[date][hourBlock] = [];
            }

            thisBooking.booked[date][hourBlock].push(table);
        }
    }

    isTableBooked(date, hour, tableNumber) {
        const thisBooking = this;

        if (typeof thisBooking.booked[date] == 'undefined') {
            return false;
        } else if (typeof thisBooking.booked[date][hour] == 'undefined') {
            return false;
        }

        return thisBooking.booked[date][hour].includes(tableNumber);
    }

    updateDOM() {
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false;

        if(
            typeof thisBooking.booked[thisBooking.date] == 'undefined'
            ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ) {
            allAvailable = true;
        }

        for (let table of thisBooking.dom.tables) {
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if(!isNaN(tableId)){
                tableId = parseInt(tableId);
            }

            if (
                !allAvailable
                &&
                thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ) {
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }

    render(element) {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();

        thisBooking.dom = {}
        thisBooking.dom.wrapper = element;

        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

        thisBooking.dom.orderButton = thisBooking.dom.wrapper.querySelector(select.booking.submitButton);
        thisBooking.dom.bookCheckboxes = thisBooking.dom.wrapper.querySelectorAll(select.booking.startersCheckboxes);
        thisBooking.dom.telephoneInput = thisBooking.dom.wrapper.querySelector(select.booking.telephone);
        thisBooking.dom.addressInput = thisBooking.dom.wrapper.querySelector(select.booking.address);
    }

    initWidgets() {
        const thisBooking = this;

        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

        thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.updateDOM();
        })
    }
}

export default Booking;