/*var userName = $("#USERNAME").val();
 var basePCip =$("#").val();*/
//da mettere bene, perchè ora glieli braso dentro

var NS_APPLICATIONS={

    addApplication:function(pKey,pApplicationPath,pCampoSwitch,pCampoUser,pCampoIp){
        NS_APPLICATIONS.applications[pKey] = {
			path:'/'+pApplicationPath+'/',
            session_created:false,
            campo_switch:typeof pCampoSwitch != 'undefined' ? pCampoSwitch : 'KEY',
            campo_user:typeof pCampoUser != 'undefined' ? pCampoUser : 'USER',
            campo_ip:typeof pCampoIp != 'undefined' ? pCampoIp : 'IP'
        };
    },

    applications:{
        'WHALE':{path:'/whale/',session_created:false,campo_switch:'pagina',campo_user:'utente',servlet:'autoLogin', /*destinazione:'CARTELLA_AMBULATORIO',*/ campo_ip:'postazione'},
        'POLARIS':{path:null,session_created:false},
        'AMBULATORIO':{path:'/ambulatorio_non_strumentale/',session_created:false},
        'FENIX_MMG':{path:'/fenixMMG/',session_created:false,servlet:'Autologin',destinazione:'blank.htm',campo_switch:'url',campo_user:'username'},
        'MMG':{path:'/MMG/',session_created:true, servlet:'autoLogin',destinazione:'blank.htm',campo_switch:'url',campo_user:'username'}
    },

    // http://localhost:8080/fenixADT/
    getApplicationServlet:function(pApplication){
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.servlet != 'undefined' ? app.servlet :'autoLogin';
    },

    getApplicationDestinazione:function(pApplication){
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.destinazione != 'undefined' ? app.destinazione :'CHECK_LOGIN';
    },

    getApplicationCampoSwitch:function(pApplication){
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.campo_switch != 'undefined' ? app.campo_switch :'KEY';
    },

    getApplicationCampoUser:function(pApplication){
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.campo_user != 'undefined' ? app.campo_user :'USER';
    },

    getApplicationCampoIp:function(pApplication){
        var app = NS_APPLICATIONS.applications[pApplication];
        return typeof app.campo_ip != 'undefined' ? app.campo_ip :'IP';
    },

    getApplicationPath:function(pApplication){
        //alert(pApplication)
        return NS_APPLICATIONS.applications[pApplication].path;
    },

    performLogin:function(pApplication){
        var success = false;
        if(NS_APPLICATIONS.applications[pApplication].session_created){
            success = true;
        }else{
            // alert(home.baseUser.USERNAME + '\n' + home.basePC.IP)
            var url_autologin = NS_APPLICATIONS.getApplicationPath(pApplication)
                +	NS_APPLICATIONS.getApplicationServlet(pApplication)
                +	"?" + NS_APPLICATIONS.getApplicationCampoSwitch(pApplication) 	+ "=" + NS_APPLICATIONS.getApplicationDestinazione(pApplication)
                +	"&" + NS_APPLICATIONS.getApplicationCampoUser(pApplication) 	+ "=" + home.baseUser.USERNAME // "=arry" //userName da mettere
                +	"&" + NS_APPLICATIONS.getApplicationCampoIp(pApplication) 		+ "=" + home.basePC.IP // "=NB_BRACCOL-HP" ;//basePCip idem;
            //$.support.cors = true;
            //alert(url_autologin);
            $.ajax({
                url: url_autologin,
                async:false,
                success:function(data){
                    //$.support.cors = false;
                    NS_APPLICATIONS.applications[pApplication].session_created=true;
                    success = true;
                },
                error:function(obj,message){
                    //$.support.cors = false;
                    alert('Login application['+pApplication+'] error:' + message);
                }
            });

        }

        return success;

    },

	/**
	 * Sovrascrive i parametri di default dell'application in base al contenuto dell'oggetto che gli viene passato, lasciando gli altri parametri immutati.
	 * @param obj esempio: {"WHALE":{"path":"/whale2/"}}
	 * @param appobj Utilizzato nella ricorsione, se omesso inizializzato con NS_APPLICATIONS.applications
	 */
	setApplicationParams: function(obj, appobj) {
		if (typeof appobj == "undefined") {
			appobj = NS_APPLICATIONS.applications;
		}
		for (var s in obj) {
			if (typeof appobj[s] == "object") {
				NS_APPLICATIONS.setApplicationParams(obj[s], appobj[s]);
			} else {
				appobj[s]=obj[s];
			}
		};
	},
	
    switchTo:function(pApplication,pResource){
        if(NS_APPLICATIONS.performLogin(pApplication)){
            return NS_APPLICATIONS.getApplicationPath(pApplication) + pResource;
        }

    }

};
