import {select, settings} from "../settings.js";
import BaseWidget from "./BaseWidget.js";

class AmountWidget extends BaseWidget {

    constructor(element) {
        super(element, settings.amountWidget.defaultValue);
        const thisWidget = this;
        thisWidget.getElements(element);

        thisWidget.initActions();
    }

    getElements() {
        const thisWidget = this;

        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
        thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
        thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    isValid(value) {
        return !isNaN(value) &&
        value <= settings.amountWidget.defaultMax &&
        value > settings.amountWidget.defaultMin;
    }

    renderValue() {
        const thisWidget = this;

        thisWidget.dom.input.value = thisWidget.value;
    }

    initActions() {
        const thisWidget = this;

        thisWidget.dom.input.addEventListener('change',
            function () {
                thisWidget.value = thisWidget.dom.input.value;
                thisWidget.announce();
            }
        );
        thisWidget.dom.linkDecrease.addEventListener('click',
            function (event) {
                event.preventDefault();
                thisWidget.setValue(parseInt(thisWidget.dom.input.value) - 1);
                thisWidget.announce();
            }
        );
        thisWidget.dom.linkIncrease.addEventListener('click',
            function (event) {
                event.preventDefault();
                thisWidget.setValue(parseInt(thisWidget.dom.input.value) + 1);
                thisWidget.announce();
            }
        );
    }
}

export default AmountWidget;