import {select, settings} from "../settings.js";

class AmountWidget {

    constructor(element) {
        const thisWidget = this;
        thisWidget.getElements(element);
        if (thisWidget.input.value) {
            thisWidget.setValue(thisWidget.input.value);
        } else {
            thisWidget.setValue(settings.amountWidget.defaultValue);
        }
        thisWidget.initActions();
    }

    getElements(element) {
        const thisWidget = this;

        thisWidget.element = element;
        thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
        thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
        thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
        const thisWidget = this;

        const newValue = parseInt(value);

        // TODO Add validation
        if (thisWidget.value !== newValue && !isNaN(newValue) &&
            newValue <= settings.amountWidget.defaultMax &&
            newValue > settings.amountWidget.defaultMin) {
            thisWidget.value = newValue;
        }
        thisWidget.input.value = thisWidget.value;
    }

    initActions() {
        const thisWidget = this;

        thisWidget.input.addEventListener('change',
            function () {
                thisWidget.setValue(thisWidget.input.value);
                thisWidget.announce();
            }
        );
        thisWidget.linkDecrease.addEventListener('click',
            function (event) {
                event.preventDefault();
                thisWidget.setValue(parseInt(thisWidget.input.value) - 1);
                thisWidget.announce();
            }
        );
        thisWidget.linkIncrease.addEventListener('click',
            function (event) {
                event.preventDefault();
                thisWidget.setValue(parseInt(thisWidget.input.value) + 1);
                thisWidget.announce();
            }
        );
    }

    announce() {
        const thisWidget = this;

        const event = new CustomEvent('updated', {
            bubbles: true
        });
        thisWidget.element.dispatchEvent(event);
    }
}

export default AmountWidget;