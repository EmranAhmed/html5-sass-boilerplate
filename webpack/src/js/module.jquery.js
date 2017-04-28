(function (factory) {

    if (typeof exports === 'object' && typeof require === 'function') {
        module.exports = factory(require("jquery"), window, document);
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(require("jquery"), window, document);
    }
    else {
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {

    $.fn.moduleJquery = function (options, args) {
        console.log('This Is MODULE JQUERY');
    }

}));