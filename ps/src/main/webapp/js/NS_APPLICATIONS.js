var NS_APPLICATIONS = {

    addApplication: function (pKey, pApplicationPath, pCampoSwitch, pCampoUser, pCampoIp) {
        NS_APPLICATIONS.applications[pKey] = {
            path: '/' + pContextPath + '/',
            // path:pContextPath,
            session_created: false,
            campo_switch: typeof pCampoSwitch != 'undefined' ? pCampoSwitch : 'KEY',
            campo_user: typeof pCampoUser != 'undefined' ? pCampoUser : 'USER',
            campo_ip: typeof pCampoIp != 'undefined' ? pCampoIp : 'IP'
        };
    },

    applications: {
        /* link a Savona produzione */
        //'WHALE': {path: '/whale_test/', session_created: false, campo_switch: 'pagina', campo_user: 'utente', servlet: 'autoLogin',  campo_ip: 'postazione'},
        'WHALE': {path: '/whale/', session_created: false, campo_switch: 'pagina', campo_user: 'utente', servlet: 'autoLogin',  campo_ip: 'postazione'},
        'POLARIS': {path: null, session_created: false},
        'AMBULATORIO': {path: '/ambulatorio_non_strumentale/', session_created: false},
        'FENIX_MMG': {path: '/fenixMMG/', session_created: false, servlet: 'Autologin', destinazione: 'blank.htm', campo_switch: 'url', campo_user: 'username'},
        'MMG': {path: '/MMG/', session_created: true, servlet: 'autoLogin', destinazione: 'blank.htm', campo_switch: 'url', campo_user: 'username'},
        'RR_PT':{path:'/RrPt/',session_created:false,last_call:null,campo_switch:'pagina',campo_user:'utente',campo_ip:'postazione'}
    },

    getApplicationServlet: function (pApplication) {
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.servlet != 'undefined' ? app.servlet : 'autoLogin';
    },

    getApplicationDestinazione: function (pApplication) {
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.destinazione != 'undefined' ? app.destinazione : 'CHECK_LOGIN';
    },

    getApplicationCampoSwitch: function (pApplication) {
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.campo_switch != 'undefined' ? app.campo_switch : 'KEY';
    },

    getApplicationCampoUser: function (pApplication) {
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.campo_user != 'undefined' ? app.campo_user : 'USER';
    },

    getApplicationCampoIp: function (pApplication) {
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.campo_ip != 'undefined' ? app.campo_ip : 'IP';
    },

    getApplicationPath: function (pApplication) {
        return NS_APPLICATIONS.applications[pApplication].path;
    },

    performLogin: function (pApplication) {
        home.NS_CONSOLEJS.addLogger({name: 'NS_APPLICATIONS', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_APPLICATIONS'];

        var success = false;

        if (NS_APPLICATIONS.applications[pApplication].session_created) {
            success = true;
        } else {
            var url_autologin = NS_APPLICATIONS.getApplicationPath(pApplication)
                + NS_APPLICATIONS.getApplicationServlet(pApplication)
                + "?" + NS_APPLICATIONS.getApplicationCampoSwitch(pApplication) + "=" + NS_APPLICATIONS.getApplicationDestinazione(pApplication)
                + "&" + NS_APPLICATIONS.getApplicationCampoUser(pApplication) + "=" + home.baseUser.USERNAME
                + "&" + NS_APPLICATIONS.getApplicationCampoIp(pApplication) + "=" + home.basePC.IP;
            //$.support.cors = true;
            $.ajax({
                url: url_autologin,
                async: false,
                success: function (data) {
                    //$.support.cors = false;
                    NS_APPLICATIONS.applications[pApplication].session_created = true;
                    success = true;
                    logger.info("performLogin : " + JSON.stringify(data));
                },
                error: function (obj, message) {
                    //$.support.cors = false;
                    //alert('Login application['+pApplication+'] error:' + message);
                    logger.error("Login application[" + pApplication + "] \nerror:" + JSON.stringify(message) + "\n" + JSON.stringify(obj));
                }
            });
        }
        return success;
    },

    switchTo: function (pApplication, pResource) {
        if (NS_APPLICATIONS.performLogin(pApplication)) {
            return NS_APPLICATIONS.getApplicationPath(pApplication) + pResource;
        }
    }

};