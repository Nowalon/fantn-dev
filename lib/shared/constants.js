var i18 = require('./i18');

var constants = {
    subscriptions : {
        MONTH : {label : 'month', price : 1700},
        TWELVE : {label: '12', price : 13000},
        TWENTYFOUR : {label : '24', price : 23000},
        THIRTYSIX : {label : '36', price : 30000}
    },

    getSubscriptionPriceByLabel : function (label) {
        var subs = constants.subscriptions;
        var price;
        Object.keys(subs).forEach(function (s) {
            if (subs[s].label === label) {
                price = subs[s].price;
            }
        });

        if (price) {return price;}
        else {
            throw new Error('Label does not exist: ' + label);
        }
    },

    getPrintableLabel : function (label) {
        switch (label) {

            case constants.subscriptions.MONTH.label :
                return i18.monthly.nor;

            case constants.subscriptions.TWELVE.label:
                return i18.twelve.nor;

            case constants.subscriptions.TWENTYFOUR.label :
                return i18.twentyFour.nor;

            case constants.subscriptions.THIRTYSIX.label :
                return i18.thirtySix.nor;

            default :
                return '';
        }
    },

    paymentTypes : {
        PAYPAL : 'paypal',
        STRIPE : 'stripe',
        MOBILE : 'mobile'
    },

    qrCodes : {
        AVAILABLE : 'Tilgjengelig',
        FOUND : 'Funnet',
        LOST : 'Mistet'
    }
};


module.exports = constants;
