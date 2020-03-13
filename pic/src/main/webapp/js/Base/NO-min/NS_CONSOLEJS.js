var NS_CONSOLEJS = {

	loggers:{},

	init:function(){

		NS_CONSOLEJS.createObject();
		NS_CONSOLEJS.setEvents();
		
	},
	
	setEvents:function(){
		
		Mousetrap.bind('ctrl+shift+h',NS_CONSOLEJS.toggleConsole);
		
		$("#svuotaConsole").click(function(){
			for(var i in NS_CONSOLEJS.loggers)
				NS_CONSOLEJS.loggers[i].clean();
		});
		$("#chiudiConsole").click(function(){$("#consolejs").hide();});
		$("#filtraConsole").click(NS_CONSOLEJS.filtra);
		
		$("#filtriConsole input").live("click",function(){
			$("#taConsoleJs li").hide();			
			$("#filtriConsole input:checked").each(function(){
				var cl = $(this).attr("id");cl = cl.substr(3);
				$("#taConsoleJs li."+cl).show();
			});
		});		
		$("#consolejs").draggable({containment:"window",handle:"#moveConsole",zIndex:999});
	},
	
	addLogger:function(pParam){
		NS_CONSOLEJS.loggers[pParam.name] = new NS_CONSOLEJS.Logger(pParam);
	},
	
	toggleConsole:function()
	{
		$("#consolejs").toggle();
	},
	
	createObject:function(){

		$('body')
			.append(
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
							.append(
								$('<ul id="taConsoleJs"></ul>')
							)
					)
					.hide()
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
				$("#filtriConsole").append('<input type="checkbox" id="fc_'+value+'" value="'+value+'" /><label for="fc_'+value+'">'+value+'</label><br />');
			});
			
			
			$("#filtriConsole").css("top",(0-$("#filtriConsole").outerHeight()));
			
			$(this).html("Chiudi filtri");
		}
		else
		{
			$(this).html("Filtri");
			$("#filtriConsole").hide();
		}
	},
	
	Logger:function(pParam){
		/*{
			[name]		Nome del logger
			[,level] 	Livello di log per write
			[,db]		Livello di log su db
			[,alert]	Livello di log su alert
			[,console] 	Livello di log su console
			[,maxsize]	Numero massimo di righe di log
		}*/

		if(typeof pParam == 'string')
			pParam = {name:pParam};
		
		function checkParameter(pValue,pDefault){return typeof pValue =='undefined' ? pDefault : pValue;}
		function checkLevel(pParameter,pLevel){return pParameter != null && pParameter <= pLevel;};
		
		this.name 	= checkParameter(pParam.name	 	, 'NS_CONSOLEJS.Logger.js');
		this.level 	= checkParameter(pParam.level	 	, 3);
		this.db 	= checkParameter(pParam.db		 	, null);
		this.alert  = checkParameter(pParam.alert	 	, null);
		this.console  = checkParameter(pParam.console	, null);	
		this.maxsize  = checkParameter(pParam.maxsize	, 100);	

		this.levels = {DEBUG:0,INFO:1,WARN:2,ERROR:3};
		this.msg = new Array();		
		
		this.clean = function(){
			this.msg = new Array();
			
			if(this.console != null)
				$('#taConsoleJs').text("");				
		};
		
		this.write = function(pText,pLevel){

			var vLevel = typeof pLevel == 'undefined' ? 'ERROR' : pLevel;
			
			if(checkLevel(this.level,this.levels[pLevel])){			
				this.msg.push({text:pText,level:vLevel,time:new Date()});
			}

			if(checkLevel(this.alert,this.levels[pLevel])){
				alert(pText);
			}

			if(checkLevel(this.db,this.levels[pLevel])){
                home.executeStatement("Logger.xml","GEST_LOGS.LOG",[this.name,pText,vLevel]);
			}
			
			if(checkLevel(this.console,this.levels[pLevel])){
				var currentTime = new Date();
				var hours = currentTime.getHours();
				var minutes = currentTime.getMinutes();
				if (minutes < 10){minutes = "0" + minutes;}
				
				$('#taConsoleJs').append(
					$("<li class='"+this.name+"'></li>")
						.append(
							$("<strong></strong>").addClass(pLevel).text(pLevel)
						)
						.append(
							$("<strong></strong>").text(" - "+hours+":"+minutes+" - "+this.name)
						)					
						.append(": " + pText)
				);
			}		

			if(this.msg.length > this.maxsize)
			{
				this.msg = this.msg.splice(0,10);
			}
			
			if($('#taConsoleJs li').length > this.maxsize)
			{
				$('#taConsoleJs li:lt(10)').remove();
			}
		};

		this.debug = function(pText){this.write(pText,'DEBUG');};
		this.info = function(pText){this.write(pText,'INFO');};
		this.warn = function(pText){this.write(pText,'WARN');};
		this.error = function(pText){this.write(pText,'ERROR');};
		
		this.view = function(pLevel){

			var out = this.name + '\n';

			for(var i=0;i< this.msg.length;i++){
				if(this.levels[this.msg[i].level] >= checkParameter(pLevel,0))
					out += "\n" + this.msg[i].level + "	-	" +  this.msg[i].text;
			}
			
			alert(out);
		};
		
		this.setLogOnDb		= function(pLevel){this.db 		= pLevel;}		
		this.setLogOnAlert 	= function(pLevel){this.alert 	= pLevel;}
		this.setLogOnConsole= function(pLevel){this.console	= pLevel;}
		
		
	}	

};