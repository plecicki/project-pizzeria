import { settings, select, classNames } from "./settings.js";
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from "./components/Booking.js";

const app = {
  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if(page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage: function (pageId) {
    const thisApp = this;

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
  initBooking: function () {
    const thisApp = this;

    thisApp.bookingContainer = document.querySelector(select.containerOf.booking);

    new Booking(thisApp.bookingContainer);
  },
  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },
  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        if (rawResponse.ok) {
          return rawResponse.json();
        }
        throw new Error('API didnt respond');
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);

        // Save parsedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;

        // Execute initMenu method
        thisApp.initMenu();
      })
      .catch((error) => {
        console.log(error)
      });
  },
  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    thisApp.initData();
    thisApp.initCart();
    thisApp.initPages();
    thisApp.initBooking();
  },
};

app.init();