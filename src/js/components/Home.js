import {templates, select} from "../settings.js";
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
            select.home.orderButton
        )

        thisHome.renderHomeButton(
            home.images.path + home.images.titles[1],
            thisHome.dom.bookingButton,
            select.home.bookingButton
        )
    }

    renderHomeButton(photoPath, buttonDOMElement, buttonClass) {
        const thisHome = this;

        const orderButtonGenHTML = templates.homeButtonWidget(
            {photo: photoPath}
        );
        buttonDOMElement = thisHome.dom.wrapper.querySelector(
            buttonClass
        );
        buttonDOMElement.innerHTML = orderButtonGenHTML;
    }
}

export default Home;