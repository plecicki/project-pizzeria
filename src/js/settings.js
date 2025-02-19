export const select = {
    templateOf: {
        menuProduct: "#template-menu-product",
        cartProduct: '#template-cart-product', // CODE ADDED
        bookingWidget: '#template-booking-widget',
        homeButtonWidget: '#template-button',
        homeInfoWidget: '#template-home-info',
        carouselWidget: '#template-carousel',
        galleryWidget: '#template-gallery',
    },
    containerOf: {
        menu: '#product-list',
        cart: '#cart',
        pages: '#pages',
        booking: '.booking-wrapper',
        home: '.home',
    },
    all: {
        menuProducts: '#product-list > .product',
        menuProductsActive: '#product-list > .product.active',
        formInputs: 'input, select',
    },
    menuProduct: {
        clickable: '.product__header',
        form: '.product__order',
        priceElem: '.product__total-price .price',
        imageWrapper: '.product__images',
        amountWidget: '.widget-amount',
        cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
        amount: {
            input: 'input.amount', // CODE CHANGED
            linkDecrease: 'a[href="#less"]',
            linkIncrease: 'a[href="#more"]',
        },
        datePicker: {
            wrapper: '.date-picker',
            input: `input[name="date"]`,
        },
        hourPicker: {
            wrapper: '.hour-picker',
            input: 'input[type="range"]',
            output: '.output',
        },
    },
    booking: {
        peopleAmount: '.people-amount',
        hoursAmount: '.hours-amount',
        tables: '.floor-plan .table',
        submitButton: '.order-confirmation .btn-secondary',
        startersCheckboxes: '.booking-options .starter',
        telephone: '.telephone',
        address: '.address'
    },
    nav: {
        links: '.main-nav a',
    },

    cart: {
        productList: '.cart__order-summary',
        toggleTrigger: '.cart__summary',
        totalNumber: `.cart__total-number`,
        totalPrice: '.cart__total-price strong',
        totalPrice2: '.cart__order-total .cart__order-price-sum strong',
        subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
        deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
        form: '.cart__order',
        formSubmit: '.cart__order [type="submit"]',
        phone: '[name="phone"]',
        address: '[name="address"]',
    },
    cartProduct: {
        amountWidget: '.widget-amount',
        price: '.cart__product-price',
        edit: '[href="#edit"]',
        remove: '[href="#remove"]',
    },

    home: {
        navButtons: '.nav-button',
        orderButton: '.home .order-button',
        bookingButton: '.home .booking-button',
        homeInfo: '.home .home-info',
        carousel: '.home .carousel',
        corouselItem: '.home .carousel-item',
        gallery: '.home .gallery',
    },
};

export const classNames = {
    home: {
        carouselItemActive: 'active'
    },
    menuProduct: {
        wrapperActive: 'active',
        imageVisible: 'active',
    },
    cart: {
        wrapperActive: 'active',
    },
    booking: {
        loading: 'loading',
        tableBooked: 'booked',
        tableChosen: 'table-chosen',
    },
    nav: {
        active: 'active',
    },
    pages: {
        active: 'active',
    }
};

export const settings = {
    amountWidget: {
        defaultValue: 1,
        defaultMin: 0,
        defaultMax: 10,
    },
    cart: {
        defaultDeliveryFee: 20,
    },
    hours: {
        open: 12,
        close: 24,
    },
    datePicker: {
        maxDaysInFuture: 14,
    },
    booking: {
        tableIdAttribute: 'data-table',
    },
    db: {
        url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
        products: 'products',
        orders: 'orders',
        bookings: 'bookings',
        events: 'events',
        dateStartParamKey: 'date_gte',
        dateEndParamKey: 'date_lte',
        notRepeatParam: 'repeat=false',
        repeatParam: 'repeat_ne=false',
    },
};

export const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
    homeButtonWidget: Handlebars.compile(document.querySelector(select.templateOf.homeButtonWidget).innerHTML),
    homeInfoWidget: Handlebars.compile(document.querySelector(select.templateOf.homeInfoWidget).innerHTML),
    carouselWidget: Handlebars.compile(document.querySelector(select.templateOf.carouselWidget).innerHTML),
    galleryWidget: Handlebars.compile(document.querySelector(select.templateOf.galleryWidget).innerHTML),
};
