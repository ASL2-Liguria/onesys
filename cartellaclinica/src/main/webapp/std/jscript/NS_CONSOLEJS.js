/*	HOTKEYS	*/
;(function(jQuery){jQuery.hotkeys={version:"0.8",specialKeys:{8:"backspace",9:"tab",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",191:"/",224:"meta"},shiftNums:{"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":": ","'":"\"",",":"<",".":">","/":"?","\\":"|"}};function keyHandler(handleObj){if(typeof handleObj.data!=="string"){return}var origHandler=handleObj.handler,keys=handleObj.data.toLowerCase().split(" ");handleObj.handler=function(event){if(this!==event.target&&(/textarea|select/i.test(event.target.nodeName)||event.target.type==="text")){return}var special=event.type!=="keypress"&&jQuery.hotkeys.specialKeys[event.which],character=String.fromCharCode(event.which).toLowerCase(),key,modif="",possible={};if(event.altKey&&special!=="alt"){modif+="alt+"}if(event.ctrlKey&&special!=="ctrl"){modif+="ctrl+"}if(event.metaKey&&!event.ctrlKey&&special!=="meta"){modif+="meta+"}if(event.shiftKey&&special!=="shift"){modif+="shift+"}if(special){possible[modif+special]=true}else{possible[modif+character]=true;possible[modif+jQuery.hotkeys.shiftNums[character]]=true;if(modif==="shift+"){possible[jQuery.hotkeys.shiftNums[character]]=true}}for(var i=0,l=keys.length;i<l;i++){if(possible[keys[i]]){return origHandler.apply(this,arguments)}}}}jQuery.each(["keydown","keyup","keypress"],function(){jQuery.event.special[this]={add:keyHandler}})})(jQuery);


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

function Logger(pParam){
		/*{
			[name]		Nome del logger
			[,level] 	Livello di log per write
			[,db]		Livello di log su db
			[,alert]	Livello di log su alert
			[,console] 	Livello di log su console
			[,cosoleId] ID dell'elemento console a cui appendere i messaggi
		}*/

		if(typeof pParam == 'string')
			pParam = {name:pParam};
		
		function checkParameter(pValue,pDefault){return typeof pValue =='undefined' ? pDefault : pValue;}
		function checkLevel(pParameter,pLevel){return pParameter != null && pParameter <= pLevel;};
		
		this.name 	= checkParameter(pParam.name	 	, 'Elements.Logger.js');
		this.level 	= checkParameter(pParam.level	 	, 3);
		this.db 	= checkParameter(pParam.db		 	, null);
		this.alert  = checkParameter(pParam.alert	 	, null);
		this.console  = checkParameter(pParam.console	, null);
		this.consoleId  = checkParameter(pParam.consoleId	, null);		

		this.levels = {DEBUG:0,INFO:1,WARN:2,ERROR:3};
		this.msg = new Array();		
		
		this.clean = function(){
			this.msg = new Array();
			
			if(this.consoleId != null)
				$('#' + this.consoleId).text("");				
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
				top.executeStatement("Logger.xml","GEST_LOGS.LOG",[this.name,pText,vLevel]);
			}
			
			if(checkLevel(this.console,this.levels[pLevel])){
				var currentTime = new Date();
				var hours = currentTime.getHours();
				var minutes = currentTime.getMinutes();
				if (minutes < 10){minutes = "0" + minutes;}
				
				$('#' + this.consoleId).append("<li class='"+this.name+"'><strong>"+hours+":"+minutes+" - "+this.name+"</strong>: "+pText+"</li>");
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
		
		
};