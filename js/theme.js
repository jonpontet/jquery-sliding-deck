document.addEventListener('DOMContentLoaded', function () {
    var list;
    list = document.querySelectorAll(".navbar-logo");
    for (var i = 0; i < list.length; ++i) {
        list[i].classList.add('rotate-in-2-fwd-cw');

    }
}, false);