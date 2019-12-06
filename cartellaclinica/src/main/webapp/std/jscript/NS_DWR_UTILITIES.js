

var Statements = {
	
	logger : {},
	
	retArrayForStatement:function(pBinds){
		var retArray = new Array();
		switch (typeof pBinds){
		case 'object': 
			retArray = pBinds;
			break;
		case 'undefined':
			break;
		default:     
			retArray.push(pBinds); 
		break;
		}
		return retArray;  
	},
	
	execute:function(pFileName , pStatementName , pBinds , pOutsNumber){
		
		var vResponse;
		var vBinds=$.extend(true,[],Statements.retArrayForStatement(pBinds));
		
		dwr.engine.setAsync(false);
		dwrUtility.executeStatement(pFileName,pStatementName,vBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
		dwr.engine.setAsync(true);
		// Statements.logger.info("'" + pFileName + "' - " + "'" + pStatementName + "' - [" + pBinds + "] [" + vResponse + "]");
		
		return vResponse;
	
		function callBack(resp){
			vResponse = resp;
		}
	},
	
	executeBatch:function(pFileName , pStatementName , pBinds , pOutsNumber){	
		
		var vResponse;
		var vBinds=$.extend(true,[],Statements.retArrayForStatement(pBinds));
		
		dwr.engine.setAsync(false);
		dwrUtility.executeBatchStatement(pFileName,pStatementName,vBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
		dwr.engine.setAsync(true);
		// Statements.logger.info("'" + pFileName + "' - " + "'" + pStatementName + "' - [" + vBinds + "] [" + vResponse + "]");
		
		return vResponse;
	
		function callBack(resp){
			vResponse = resp;
		}
	},
	
	query:function(pFileName , pStatementName , pBinds, pCallBack){

		var vRs;
		var vResponse;
		var async = (typeof pCallBack == 'function');
		
		//serve per le pagine aperte con window.open
		var vBinds=$.extend(true,[],Statements.retArrayForStatement(pBinds));
		
		dwr.engine.setAsync(async);
		
		if(async){
			dwrUtility.executeQuery(pFileName,pStatementName,vBinds,function(resp){
				vRs = getResultset(resp);
				pCallBack(vRs);
			});
		
		}else{
			dwrUtility.executeQuery(pFileName,pStatementName,vBinds,callBack);
			return vRs;
		}
		
		function callBack(resp){
			vRs = getResultset(resp);
		}
		
		function getResultset(resp){
			var valid=true;
			var error='';
			var ArColumns,ArData;
			
			if(resp[0][0]=='KO'){
				isValid = false;
				error = resp[0][1];
				ArColumns =  ArData =  new Array();
			}else{
				ArColumns = resp[1];
				ArData = resp.splice(2,resp.length-1);
			}
			return {
				isValid:valid,
				getError:function(){return error;},
				columns:ArColumns,
				data:ArData,
				size:ArData.length,
				current:null,
				next:function(){
					if(this.current==null && this.size>0){
						this.current = 0;
						return true;
					}else{
						return ++this.current < this.size;
					}
				},
				getString:function(pColumnName){
					return this.data[this.current][this.getColumnIndex(pColumnName)];
				},
				getInt:function(pColumnName){
					return parseInt(this.getString(pColumnName),10);
				},
				getColumnIndex:function(pColumnName){
					pColumnName = pColumnName.toUpperCase();
					for (var i = 0; i< this.columns.length;i++){
						if(this.columns[i] == pColumnName){
							return i;
						}
					}
				}
			}
			
		}
	}
};

var Actions = {
	
	execute:function(scope,key,parameters,pCallBack){
		
		pCallBack = typeof pCallBack ==  "function" ? pCallBack : callBack;
		
		dwr.engine.setAsync(false);		
		dwrUtility.executeAction(
			scope,
			key,
			(typeof parameters == 'object' ? JSON.stringify(parameters) : parameters),
			pCallBack
		);
		dwr.engine.setAsync(true);
		
		function callBack(response){
			if(response.success == false){
				alert(response.message);
			}
		}
	}
};

var NS_CONSOLEJS = {

	loggers:{},

	init:function(){
		
		NS_CONSOLEJS.createObject();
		
		NS_CONSOLEJS.setEvents();
		
	},
	
	setEvents:function(){
		$(document).bind('keydown', 'alt+h', function(){$("#consolejs").toggle();});
		
		$("#svuotaConsole").click(function(){log.clean();});
		$("#chiudiConsole").click(function(){$("#consolejs").hide();});
		$("#chiudiConsole").click(NS_CONSOLEJS.filtra);
		
		$("#filtriConsole input").live("click",function(){
			$("#taConsoleJs li").hide();			
			$("#filtriConsole input:checked").each(function(){
				var cl = $(this).attr("id");cl = cl.substr(3);
				$("#taConsoleJs li."+cl).show();
			});
		});		
		
	},
	
	addLogger:function(pParam){
		NS_CONSOLEJS.loggers[pParam.name] = new Logger(pParam);
	},
	
	createObject:function(){
		$(body).append(
			$('<div id="consolejs"></div>')
				.append(
					$('<div id="filtriConsole"></div>')
				)
				.append(
					$('<img id="moveConsole" src="img/move.png" alt="" />')
				)
				.append(
					$('<a id="chiudiConsole" class="pulsConsole" href="javascript:void(0);">Chiudi</a>')						
				)
				.append(
					$('<a id="svuotaConsole" class="pulsConsole" href="javascript:void(0);">Svuota</a>')
				)
				.append(
					$('<a id="filtraConsole" class="pulsConsole" href="javascript:void(0);">Filtri</a>')
				)
				.append(
					$('<div id="cConsole"></div>')
						.append($('<ul id="taConsoleJs"></ul>')
				)
			).hide()
		);
	},
	
	filtra:function(){
		if($(this).html() == "Filtri"){
			
			$("#filtriConsole").html("").show();
			var arClasses = [];
			
			$("#taConsoleJs li").each(function(index){
				var thisClass = $(this).attr("class");
				if($.inArray(thisClass,arClasses) < 0) arClasses.push(thisClass);
			});
			
			$.each(arClasses,function(index, value){
				$("#filtriConsole")
					.append($('<input type="checkbox" id="fc_'+value+'" value="'+value+'" />'))
					.append($('<label for="fc_'+value+'">'+value+'</label>'))
					.append(
						$('<select></select>')
							.append($('<option></option>').val("3").text("ERROR"))
							.append($('<option></option>').val("2").text("WARNING"))
							.append($('<option></option>').val("1").text("INFO"))
							.append($('<option></option>').val("0").text("DEBUG"))																					
					)
					.append($('<br/>'))					
					;
			});
			
			
			$("#filtriConsole").css("top",(0-$("#filtriConsole").outerHeight()));
			
			$(this).html("Chiudi filtri");
		}
		else
		{
			$(this).html("Filtri");
			$("#filtriConsole").hide();
		}
	}

};

window.executeStatement 		= Statements.execute;
window.executeBatchStatement 	= Statements.executeBatch;
window.executeQuery 			= Statements.query;

window.executeAction			= Actions.execute;

window.NS_APPLICATIONS			= top.NS_APPLICATIONS;

try{
	window.home = opener.top.home;
}
catch(e){
	window.home=null;		 		
}