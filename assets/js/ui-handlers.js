document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-klaro-show]');
    if (target) {
        e.preventDefault();
        if (typeof klaro !== 'undefined') klaro.show();
    }
});
