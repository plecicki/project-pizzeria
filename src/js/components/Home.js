import {templates, select, settings} from "../settings.js";
import {home} from "../../db/homeData.js"

class Home {

    constructor(element) {
        const thisHome = this;

        thisHome.render(element);
    }

    render(element) {
        const thisHome = this;

        thisHome.dom = {}
        thisHome.dom.wrapper = element;

        thisHome.renderHomeButton(
            home.images.path + home.images.titles[0],
            thisHome.dom.orderButton,
            select.home.orderButton,
            home.texts.orderButton
        )

        thisHome.renderHomeButton(
            home.images.path + home.images.titles[1],
            thisHome.dom.bookingButton,
            select.home.bookingButton,
            home.texts.bookingButton
        )

        const infoText = home.texts.openingLabel.subtitlePart1 +
            settings.hours.open +
            home.texts.openingLabel.subtitlePart2 +
            settings.hours.close +
            home.texts.openingLabel.subtitlePart3;

        const infoLabelGenHTML = templates.homeInfoWidget(
            {
                header: home.texts.openingLabel.title,
                text: infoText,
            }
        )
        thisHome.dom.infoLabel = thisHome.dom.wrapper.querySelector(
            select.home.homeInfo
        );
        thisHome.dom.infoLabel.innerHTML = infoLabelGenHTML;
    }

    renderHomeButton(photoPath, buttonDOMElement, buttonClass, buttonText) {
        const thisHome = this;

        const orderButtonGenHTML = templates.homeButtonWidget(
            {photo: photoPath, buttonText: buttonText}
        );
        buttonDOMElement = thisHome.dom.wrapper.querySelector(
            buttonClass
        );
        buttonDOMElement.innerHTML = orderButtonGenHTML;
    }
}

export default Home;