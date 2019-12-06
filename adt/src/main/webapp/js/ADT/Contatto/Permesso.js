var NS_PERMESSO =
{
		permesso : null,
		
		executeAJAX : function(params)
		{
			NS_PERMESSO.initLogger();
			
			params.notifica.width = typeof params.notifica.width == "undefined" ? 400 : params.notifica.width;
			
			loggerPermessoMethods.debug(params.hl7Event + " - Init " + params.servlet + " - params -> " + JSON.stringify(params));
			
			var startTime = new Date().getTime();
			
			var url = "adt/";
			url += params.servlet + "/json/"; 
			url += typeof params.query == "undefined" ? "" : params.query;
			
			loggerPermessoMethods.debug(params.hl7Event + " - Url " + params.servlet + " -> " + url);
			
			$.ajax({
		        url : url,
		        dataType : "json",
		        type : "POST",
		        data : JSON.stringify(NS_PERMESSO.permesso),
		        error: function(data) 
		        {
		        	loggerPermessoMethods.error(params.hl7Event + " - " + params.servlet + " - AJAX Error -> " + JSON.stringify(data));
		        	home.NOTIFICA.error({message: params.notifica.errorMessage, timeout: 0, width : params.notifica.width, title: "Error"});
		        	
		        	if (typeof params.cbkError == "function")
	            	{
	            		loggerPermessoMethods.error(params.hl7Event + " - " + params.servlet + " - Eseguo ERROR Callback -> " + params.cbkError);
	            		params.cbkError();
	            	}
		        },
		        success : function(data, status) 
		        {
		            if (data.success)
		            {
		            	NS_PERMESSO.permesso = typeof data.permesso !== "undefined" ? data.permesso : NS_PERMESSO.permesso;
		            	
		            	loggerPermessoMethods.info(params.hl7Event + " - " + params.servlet + " - Manipolazione permesso + {id : " + NS_PERMESSO.permesso.id + "} Avvenuta con Successo - Tempo Impiegato " + (new Date().getTime() - startTime) + " ms");
		            	
		            	if (params.notifica.show === "S") 
			        	{
			        		home.NOTIFICA.success({message: params.notifica.message, timeout: params.notifica.timeout, width : params.notifica.width, title: "Success"});
			        	}
		            	
		            	if (typeof params.cbkSuccess == "function")
		            	{
		            		loggerPermessoMethods.info(params.hl7Event + " - " + params.servlet + " - Eseguo SUCCESS Callback -> " + params.cbkSuccess);
		            		params.cbkSuccess();
		            	}
		            }
		            else
		            {
		            	loggerPermessoMethods.error(params.hl7Event + " - Errore Durante Manipolazione permesso -> " + JSON.stringify(data));
			        	home.NOTIFICA.error({message: params.notifica.errorMessage, timeout: 0, width : params.notifica.width, title: "Error"});
		            	
		            	if (typeof params.cbkError == "function")
		            	{
		            		loggerPermessoMethods.error(params.hl7Event + " - Eseguo Error Callback -> " + params.cbkError);
		            		params.cbkError();
		            	}
		            }
		        }
		    });
		},
		
		inserisciPermesso : function(params)
		{
			params.servlet = "PatientGoesOnALeaveOfAbsence";
			
			NS_PERMESSO.permesso = params.permesso;
			NS_PERMESSO.executeAJAX(params);
		},
		
		terminaPermesso : function(params)
		{
			params.servlet = "PatientReturnsFromALeaveOfAbsence";
			
			NS_PERMESSO.permesso = params.permesso;
			NS_PERMESSO.executeAJAX(params);
		},
		
		cancellaInserimentoPermesso : function(params)
		{
			params.servlet = "PatientGoesOnALeaveOfAbsence";
			
			NS_PERMESSO.permesso = params.permesso;
			NS_PERMESSO.executeAJAX(params);
		},
		
		cancellaTerminaPermesso : function(params)
		{
			params.servlet = "CancelPatientReturnsFromALeaveOfAbsence";
			
			NS_PERMESSO.permesso = params.permesso;
			NS_PERMESSO.executeAJAX(params);
		},
		
		getPermessoStruttura : function(p)
		{
			var parameters = typeof p == "undefined" ? {"cbkSuccess": null, "cbkError" : null} : p;
			
			NS_PERMESSO.initLogger();
			
			$.ajax({
				url : 'adt/GetPermessoStruttura/string/' + "?ts=" + new Date().getTime(),
				type : "POST",
				dataType : "json",
				async : false,
				cache : false,
		        data : parameters.body,
				error : function(jqXHR, textStatus, errorThrown)
				{
					home.NOTIFICA.error({message : "Errore Durante Get Permesso Struttura \n jqXHR: " + jqXHR + "\n textStatus: " + textStatus + "\n errorThrown: " + errorThrown, title : "Error", timeout : 0});
					loggerPermessoMethods.error("Get Permesso Struttura - Error - parameters " + JSON.stringify(parameters) + " jqXHR: " + jqXHR + " - textStatus: " + textStatus + " - errorThrown: " + errorThrown);
					
					if (typeof parameters.cbkError == "function")
					{
						parameters.cbkError();
					}
				},
				success : function(data)
				{
					NS_PERMESSO.permesso =  data.permesso;
					
					if (typeof parameters.cbkSuccess == "function")
					{
						loggerPermessoMethods.debug("Get permesso - Invocazione cbkSuccess");
						parameters.cbkSuccess();
					}
				}
			});
			
			return NS_PERMESSO.permesso;
		},
		
		initLogger : function() 
		{
			home.NS_CONSOLEJS.addLogger({name:'NS_PERMESSO', console:0});
	        window.loggerPermessoMethods = home.NS_CONSOLEJS.loggers['NS_PERMESSO'];
		}
};