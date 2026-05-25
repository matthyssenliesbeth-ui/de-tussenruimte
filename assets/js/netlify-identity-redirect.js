(function () {
    var hash = window.location.hash || '';
    if (hash.includes('invite_token') || hash.includes('confirmation_token') || hash.includes('recovery_token')) {
        var s = document.createElement('script');
        s.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
        s.onload = function () {
            window.netlifyIdentity.on('login', function () {
                document.location.href = '/admin/';
            });
        };
        document.head.appendChild(s);
    }
}());
