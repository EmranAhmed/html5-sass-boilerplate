"use strict";

import $ from 'jquery';
import bootstrap from 'bootstrap-sass';
import owlCarousel from 'owl.carousel';

import './normal.jquery';
import moduleJquery from './module.jquery';

$(document).ready(() => {
    $('.owl-carousel').owlCarousel();
    $().normalJQuery();
    $().moduleJquery()
});
