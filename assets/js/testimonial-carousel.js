(function () {
    document.querySelectorAll('.testimonial-carousel').forEach(function (carousel) {
        var track   = carousel.querySelector('.testimonial-carousel__track');
        var cards   = carousel.querySelectorAll('.testimonial-carousel__track > *');
        var dots    = carousel.querySelectorAll('.testimonial-carousel__dot');
        var btnPrev = carousel.querySelector('[data-dir="-1"]');
        var btnNext = carousel.querySelector('[data-dir="1"]');
        var current = 0;

        function goTo(n) {
            current = ((n % cards.length) + cards.length) % cards.length;
            track.style.transform = 'translateX(-' + current * 100 + '%)';
            dots.forEach(function (d, i) {
                d.classList.toggle('testimonial-carousel__dot--active', i === current);
            });
        }

        if (btnPrev) btnPrev.addEventListener('click', function () { goTo(current - 1); });
        if (btnNext) btnNext.addEventListener('click', function () { goTo(current + 1); });
        dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });
    });
}());
