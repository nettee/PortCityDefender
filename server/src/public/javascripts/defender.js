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

        view: function() {
            window.location = urlformat();
        }
    };
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
            window.location = urlformat('removed');
        },

        view: function() {
            window.location = urlformat();
        }
    }
};

defender.documents = {
    create: function() {
        window.location = '/dashboard/documents/_new';
    },

    view: function() {
        window.location = '/dashboard/documents';
    },

    class: {
        '军事训练': [
            '通知计划',
            '训练法规',
            '资料查询',
            '训练考核'
        ],
        '教育管理': [
            '通知计划',
            '教育资料',
            '法规命令',
            '成果交流'
        ],
        '国防动员': [
            '组织机构',
            '法规政策',
            '兵员征集',
            '基本潜力'
        ]
    }
};


defender.document = function(id) {

    var baseurl = '/dashboard/documents';

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
    };
};

defender.feedback_icon = {
    error: $("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span>")
};

