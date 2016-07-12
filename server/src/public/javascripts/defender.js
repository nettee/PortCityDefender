var defender = {};

defender.users = {
    create: function() {
        window.location = '/dashboard/users/_new';
    },

    view: function() {
        window.location = '/dashboard/users';
    }
};

defender.user = function(id) {

    var baseurl = '/dashboard/users';

    function urlformat(action) {
        if (action) {
            return baseurl + '/' + id + '?do=' + action + '#alert';
        } else {
            return baseurl + '/' + id;
        }
    }

    return {
        edit: function() {
            window.location = urlformat('edit');
        },

        remove: function() {
            window.location = urlformat('remove');
        },

        removed: function() {
            window.location = urlformat('removed')
        },

        view: function() {
            window.location = urlformat();
        }
    }
};

defender.informations = {
    create: function() {
        window.location = '/dashboard/informations/_new';
    },

    view: function() {
        window.location = '/dashboard/informations';
    },
};


defender.information = function(id) {

    var baseurl = '/dashboard/informations';

    function urlformat(action) {
        if (action) {
            return baseurl + '/' + id + '?do=' + action + '#alert';
        } else {
            return baseurl + '/' + id;
        }
    }

    return {
        remove: function() {
            window.location = urlformat('remove');
        },

        removed: function() {
            window.location = urlformat('removed')
        },

        view: function() {
            window.location = urlformat();
        }
    }
};

