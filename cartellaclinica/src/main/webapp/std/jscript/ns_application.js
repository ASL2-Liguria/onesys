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
		'WHALE':{path:"/whale/",session_created:true,last_call:null,campo_switch:'pagina',campo_user:'utente',campo_ip:'postazione'},
		'POLARIS':{path:null,session_created:false,last_call:null},
		'AMBULATORIO':{path:"/ambulatorio_non_strumentale/",session_created:false,last_call:null},
		'REPOSITORY':{path:null,session_created:true,last_call:null},
		'RR_PT':{path:null,session_created:false,last_call:null,campo_switch:'pagina',campo_user:'utente',campo_ip:'postazione'}
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
		if(NS_APPLICATIONS.applications[pApplication].path == null){
			dwr.engine.setAsync(false);
			dwrUtility.getApplicationUrl(pApplication,function(resp){
				NS_APPLICATIONS.applications[pApplication].path = resp;
			});
			dwr.engine.setAsync(true);
		}
		//alert(NS_APPLICATIONS.applications[pApplication].path);
		return NS_APPLICATIONS.applications[pApplication].path;
	},
	
	performLogin:function(pApplication)
	{
		var success = false;
		var data = new Date().getTime() - 60000;
		if(NS_APPLICATIONS.applications[pApplication].session_created 
				&& NS_APPLICATIONS.applications[pApplication].last_call < data )
		{
			success = true;
		}
		else
		{
			var url_autologin = NS_APPLICATIONS.getApplicationPath(pApplication)			
			
			if (url_autologin != null)
			{
				url_autologin  +=	"autoLogin"
								+	"?" + NS_APPLICATIONS.getApplicationCampoSwitch(pApplication) + "=CHECK_LOGIN"
								+	"&" + NS_APPLICATIONS.getApplicationCampoUser(pApplication) + "=" +baseUser.LOGIN
								+	"&" + NS_APPLICATIONS.getApplicationCampoIp(pApplication) + "=" +basePC.IP;

				$.support.cors = true;

				$.ajax({
					crossDomain: true,
					url: url_autologin,
					async:false,
					success:function(data){
							NS_APPLICATIONS.applications[pApplication].session_created=true;
							success = true;
						},
					error:function(obj,message,errorThrown){
							alert('Login application['+pApplication+'] error:' + errorThrown);
						}
				});
			}
		}
		//alert(success);
		return success;
				
	},
	
	switchTo:function(pApplication,pResource)
	{
		if(NS_APPLICATIONS.performLogin(pApplication))
		{	
			NS_APPLICATIONS.applications[pApplication].last_call = new Date().getTime();
			//alert(NS_APPLICATIONS.getApplicationPath(pApplication) + pResuorce)
			return NS_APPLICATIONS.getApplicationPath(pApplication) + pResource;
		}
	}	
	
};
