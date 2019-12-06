var generic = {
	
	setEvents:function(){
		try{
			msg='Campi None'; 				generic.setCampoNone();
			msg='Campi Number'; 			generic.setCampoNumber();
			msg='Campi Positive'; 			generic.setCampoPositive();
			msg='Campi NotNegative'; 		generic.setCampoNotNegative();
			msg='Campi Data'; 				generic.setCampoData();
			msg='Campi Ora'; 				generic.setCampoOra();
			msg='Campi Lunghezza'; 			generic.setCampoLunghezza();
			msg='Campi Between'; 			generic.setCampoBetween();
			msg='Campi Disable'; 			generic.setCampoDisable();	
			msg='Campi TextualNumber';		generic.setCampoTextualNumber();	
			msg='Campi TextualPositive';	generic.setCampoTextualPositive();	
			msg='Campi TextualNotNegative';	generic.setCampoTextualNotNegative();					
		}catch(e){
			alert(msg + '; ' + e.description);
		}
	},
	
	setCampoNumber:function(){
		var lst=  getElementsByAttributes({Number:true},document.body,'div');
		for (i=0;i<lst.length;i++){
			lst[i].lastChild.firstChild.attachEvent("onblur",checkDato.isNumber);
		}		
	},
	
	setCampoPositive:function(){
		$('div[cls="UserInput"][Positive="S"] input').live('blur',checkDato.isPositive);
	},	
	
	setCampoNotNegative:function(){
        $('div[cls="UserInput"][NotNegative="S"] input').live('blur',checkDato.isNotNegative);
	},	
	
	setCampoBetween:function(){
	    $('div[cls="UserInput"][Between] input').live('blur',checkDato.isBetween);	
	},
	
	setCampoLunghezza:function(){
		var lst=  getElementsByAttributes({len:true},document.body,'div');
		for (i=0;i<lst.length;i++){
			lst[i].lastChild.firstChild.attachEvent("onblur",checkDato.isLength);
		}		
	},	
	
	setCampoData:function(){
		

		$('div[Calendario] input').datepick(
				{
		
					onClose: function(){
							  
							  var attr = $(this).closest('div[Calendario="S"]').attr('CopyValueTo');
							  if (typeof attr !== 'undefined' && attr !== false) {	
								$('div[name="'+attr+'"] input').val(this.value);	
							  }
						
							validita.setDataOraFine();
							timelines.DataOraTrigger();
						},
					showOnFocus: false,  
					showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'
				}
			);	
	},
	
	setCampoOra:function(){
		$('div[cls="UserInput"][Orario="S"] input')
            .live('keyup',checkDato.isHour)
            .live('blur',checkDato.isHourValue);
	},
	
	setCampoDisable:function(){
		var lst = getElementsByAttributes({Disable:true},document.body,'div');
		//alert(lst.length);
		for (i=0;i<lst.length;i++){
			generic.enable(lst[i],false);
		}
	},	
	
	setCampoNone:function(){
		var lst = getElementsByAttributes({None:true},document.body,'div');
		//alert(lst.length);
		for (i=0;i<lst.length;i++){
			generic.show(lst[i],false);
		}
	},
	
	setCampoTextualNumber:function(){
		$('div[cls="UserInput"][TextualNumber="S"] input').live('blur',checkDato.isTextualNumber);
	},		
	
	setCampoTextualPositive:function(){
		$('div[cls="UserInput"][TextualPositive="S"] input').live('blur',checkDato.isTextualPositive);
	},		
	
	setCampoTextualNotNegative:function(){
		$('div[cls="UserInput"][TextualNotNegative="S"] input').live('blur',checkDato.isTextualNotNegative);
	},	
	
	empty:function(obj){
			switch (obj.lastChild.firstChild.type){
				case 'text':
					obj.lastChild.firstChild.value="";
					break;
				case 'radio':
					var lst= getElementsByAttributes({type:"radio"},obj,'input');
					for(var j=0;j<lst.length;j++){
						lst[j].checked = false;
						lst[j].removeAttribute("selected");
					}
					break;
				case 'textarea':
					obj.lastChild.firstChild.innerText = "";
					break;
			}		
	},
	
	enable:function(obj,bool){
		switch (obj.tipo){
			case 'text':
			case 'textarea':	
			case 'checkbox':			
				if(bool){
					obj.lastChild.firstChild.removeAttribute("disabled");
				}else{
					obj.lastChild.firstChild.setAttribute("disabled","disabled");
				}
				break;
			case 'radio':
				var lst= getElementsByAttributes({type:"radio"},obj,'input');
				for(var j=0;j<lst.length;j++){
					if(bool){
						lst[j].removeAttribute("disabled");
					}else{
						lst[j].setAttribute("disabled","true");
						lst[j].removeAttribute("selected");
					}
				}
				break;
			case 'select':							
				if(bool){
					obj.lastChild.firstChild.removeAttribute("disabled");
				}else{
					obj.lastChild.firstChild.setAttribute("disabled","disabled");
				}
				break;	
			case 'timeline':
					if(bool){
						getElementsByAttributes({editing:true},obj,'tbody')[0].setAttribute("editing","1");
					}else{
						getElementsByAttributes({editing:true},obj,'tbody')[0].setAttribute("editing","0");
					}
				break;
			default:
				break;							
		}
	},
	
	getValue:function(obj){
		switch (obj.tipo){
			case 'text': return obj.lastChild.firstChild.value;
				break;
		}
	},
	
	setValue:function(obj,pValue){
		switch (obj.tipo){
			case 'text': obj.lastChild.firstChild.value = pValue;
				break;
		}			
	},
		
	show:function(obj,bool){
		if(bool){
			generic.removeClass(obj,'None');
			//obj.removeAttribute("None");			
		}else{
			generic.addClass(obj,'None');			
			//obj.setAttribute("None");
		}				
				
	},
	
	obbliga:function(obj,bool){
		if(bool){
			obj.setAttribute("obligatory","S");	
		}else{
			obj.removeAttribute("obligatory");		
		}		
	},
	
	valid:function(obj,bool,msg){
		if(bool){
			obj.removeAttribute("error");
		}else{
			obj.setAttribute("error","S");		
			obj.focus();	
		}			
		
		if(typeof msg!='undefined'){
			alert(msg);
		}
	},
	
	roundTo:function(value, decimalpositions){
	    var i = value * Math.pow(10,decimalpositions);
    	i = Math.round(i);
	    return i / Math.pow(10,decimalpositions);
	},
	
	hasClass: function(ele,cls){return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));},
	addClass: function(ele,cls){if (!generic.hasClass(ele,cls)){ele.className += " "+cls;}},
	removeClass: function(ele,cls){if (generic.hasClass(ele,cls)){var reg=new RegExp('(\\s|^)'+cls+'(\\s|$)');ele.className=ele.className.replace(reg,' ');}}	 
	
}

var utility = {
	setEvents:function(){	
		var msg='';	
		try{	

			msg= "Applica hideSingleRadio"; 	utility.hideSingleRadio();
			msg= "Applica clickRadioSelected";	utility.clickRadioSelected();

		}catch(e){
			alert(msg + '; ' + e.description);
		}		
	},
	
	alterna:function(attributes,elm,tagName){
		
		if(typeof elm=='undefined')
			elm = document.body;
		
		if(typeof tagName=='undefined')
			tagName = '*';		
		
		var lst=  getElementsByAttributes(attributes,elm,tagName);
		//alert(lst.length);
		for (i=0;i<lst.length;i++){
			if(i%2==1){
				lst[i].removeAttribute("pari");
				lst[i].setAttribute("dispari");
			}else{
				lst[i].removeAttribute("dispari");
				lst[i].setAttribute("pari");
			}
		}			
	},
		
	hideSingleRadio:function(){
		var lst=  getElementsByAttributes({cls:'UserInput',tipo:'radio'});
		//alert(lst.length);
		for (i=0;i<lst.length;i++){
			var inputs = getElementsByAttributes(null,lst[i],'input');
			if(inputs.length==1){				
				inputs[0].click();
				generic.show(lst[i],false);
			}
		}
	},
	
	clickRadioSelected:function(){
		$('input[type="radio"]:checked').click();
	},
	
	getTxtValue:function(attributes,elm){
		
		return getElementsByAttributes(attributes,elm,'input')[0].value;
	},
	
	getCmbValue:function(attributes,elm){

		if(typeof elm=='undefined')
			elm = document.body;				
		
		var cmb = getElementsByAttributes(attributes,elm,'select')[0];
		return parseInt(cmb.options[cmb.selectedIndex].value,10);	
	},
	
	getRadioValue:function(attributes,elm){
	
		if(typeof elm=='undefined')
			elm = document.body;
			
		var lst = getElementsByAttributes(attributes,elm,'input');
		for(var i=0;i<lst.length;i++){
			if(lst[i].checked)
				return lst[i].value;
		}
		return '';		
	},
	
	setDipendentiShow:function(elm){
		
		if(event.srcElement.getAttribute("Show")==null)return;
				
		var lst = getElementsByAttributes({cls:"UserInput"},elm,'div');
		var inputs = event.srcElement.getAttribute("Show").split(',');
		var bool;
		
		for(var i=0;i<lst.length;i++){	
				
			nameUserInput = lst[i].getAttribute("name");
			
			bool = false;
			for(var j=0;j<inputs.length;j++){
			
				if(inputs[j]==nameUserInput){
					bool = true;					
					generic.show(lst[i],true);					
				}
				
			}
			
			if(!bool){
				generic.show(lst[i],false);
			}					
			
		}		
		
		
	},
	
	setDipendentiMantieniValore:function(elm){
		if(event.srcElement.getAttribute("MantieniValore")==null)return;
				
		var lst = getElementsByAttributes({cls:"UserInput"},elm,'div');
		var inputs = event.srcElement.getAttribute("MantieniValore").split(',');
		var bool;
		
		for(var i=0;i<lst.length;i++){	
				
			nameUserInput = lst[i].getAttribute("name");		
			
			bool = false;			
			for(var j=0;j<inputs.length;j++){
			
				if(inputs[j]==nameUserInput){
					bool = true;				
				}
				
			}
			
			if(!bool){
				generic.empty(lst[i]);
			}									
			
		}		
	},
	
	setDipendentiObbligatori:function(elm){
	
		if(event.srcElement.getAttribute("Obbliga")==null)return;
				
		var lst = getElementsByAttributes({cls:"UserInput"},elm,'div');		
		//var lst = $(elm).find("[cls='UserInput']");
		//alert(lst.length);		
		var inputs = event.srcElement.getAttribute("Obbliga").split(',');
		var bool;
		
		for(var i=0;i<lst.length;i++){	
				
			nameUserInput = lst[i].getAttribute("name");				
			
			bool = false;
			for(var j=0;j<inputs.length;j++){
			
				if(inputs[j]==nameUserInput){
					bool = true;
					generic.obbliga(lst[i],true);
				}
				
			}
			
			if(!bool){
				generic.obbliga(lst[i],false);
			}						
			
		}		
	},
	
	wrapperTextual:function(pFunction,pErrorMessage){
		
		var element = event.srcElement;
		
		if(element.value==''){			
			generic.valid(element,true);
			return;
		}
		
		var status = false;
		
		var TextualValue =element.value;
		
		//converto la string in number
		try{

			var NumberValue = utility.decodeTextualNumber(TextualValue);

			element.value = NumberValue;
			
			//verifico valore numerico
			status = pFunction();
					
			//rimetto il valore string
			element.value = TextualValue;
		
		}catch(e){
			status = false;
		}		
		
		if(status){
			generic.valid(event.srcElement,true);				
		}else{				
			generic.valid(event.srcElement,false,pErrorMessage);				
		}		
				
		return status;
		
	},
	
	decodeTextualNumber:function(pTextualValue){
		//promemoria : quando si aggiunge un decode value qui allineare anche RADSQL.CC_TERAPIA.decodeDoseFarmaco			
		return eval(
			pTextualValue
				.replace(',','.')
				/*.replace('un quarto', '1/4')
				.replace('quarto', '1/4')				
				.replace('un terzo', '1/3')
				.replace('terzo', '1/3')
				.replace('mezzo', '1/2')
				.replace('mezza', '1/2')
				.replace('intero','1')
				.replace('intera', '1')	*/
		);
	}
}

var checkDato = {
	
	isObligatory:function(obj){
		return (obj.parentNode.parentNode.getAttribute("obligatory")!=null);
	},
	
	isNumber:function(){
			event.srcElement.value = event.srcElement.value.replace(',','.');
			var sText = event.srcElement.value;

		   	var ValidChars = "0123456789.-";var IsNumber=true;var Char;
		   	for (i = 0; i < sText.length && IsNumber == true; i++){ 
				  Char = sText.charAt(i); 
			  	if (ValidChars.indexOf(Char) == -1){IsNumber = false;}
		   	}

		   	if(sText=='' || IsNumber ){
				generic.valid(event.srcElement,true);				
			}else{				
				generic.valid(event.srcElement,false,'Inserire un valore numerico');				
			}
				
			return IsNumber;		   
	},
	
	isPositive:function(){
		if(event.srcElement.value==''){			
			generic.valid(event.srcElement,true);
			return;
		}
		
		if(!checkDato.isNumber())return;
		
		if(event.srcElement.value>0){
			generic.valid(event.srcElement,true);
			return true;
		}else{
			generic.valid(event.srcElement,false,'Inserire un valore maggiore di 0');
			return false;			
		}
	},
	
	isNotNegative:function(){
		if(event.srcElement.value==''){			
			generic.valid(event.srcElement,true);
			return;
		}
		
		if(!checkDato.isNumber())return;
		
		if(event.srcElement.value>=0){
			generic.valid(event.srcElement,true);
			return true;
		}else{
			generic.valid(event.srcElement,false,'Inserire un valore non negativo');
			return false;
		}
	},	
	
	isBetween:function(){
		if(event.srcElement.value==''){			
			generic.valid(event.srcElement,true);
			return;
		}
		
		if(!checkDato.isNumber())return;
		
		var Min= parseInt(event.srcElement.parentNode.parentNode.getAttribute("Between").split('|')[0],10);
		var Max= parseInt(event.srcElement.parentNode.parentNode.getAttribute("Between").split('|')[1],10);
		
		var Value = parseInt(event.srcElement.getAttribute("value"),10);
		
		if(Value>=Min && Value<=Max){
			generic.valid(event.srcElement,true);
		}else{
			generic.valid(event.srcElement,false,'Inserire un valore compreso tra ' + Min + ' e ' + Max);
		}
	},	
	
	isLength:function(){
		
		if(event.srcElement.getAttribute("value")=='' ||  event.srcElement.getAttribute("value").length >= parseInt(event.srcElement.parentNode.parentNode.getAttribute("len"),10)){
			generic.valid(event.srcElement,true);
		}else{
			generic.valid(event.srcElement,false,'Inserire almeno ' + event.srcElement.parentNode.parentNode.getAttribute("len") + ' caratteri');							
		}
	},

    isHourValue:function(){
        var campo = event.srcElement;

        if(campo.value == '' || campo.value.match(/[0-9]{2}:[0-9]{2}/)){
            generic.valid(event.srcElement,true);
        }else{
            generic.valid(event.srcElement,false,'Valorizzare il campo nel formato HH:MM');
        }

    },

	isHour:function(){
		var campo = event.srcElement;
		var ora=campo.value;
		var oraReplace=ora.replace(/:/gi,"");
		
		if(event.keyCode==110 || event.keyCode==190 || event.keyCode==188 || event.keyCode==189 || event.keyCode==192){
			//controllo su '.'(da tastierino e non) , ',' , '-' , 'ò'
			campo.value='';
			campo.value=ora.substring(0,ora.length-1);
			return;			
		}
		
		if (ora.substring(3,5)>59 || ora.substring(3,5)<0){			
			campo.value=ora.substring(0,3);
			return;		
		}
	
		if (ora.length>2){		
			campo.value=oraReplace.substring(0,2)+':'+oraReplace.substring(2,4);
			return;		
		}
		
		
		if (ora.length>5)
			campo.value=campo.value.substring(0,5);		
		
		if (ora.substring(0,2)>23 || ora.substring(0,2)<0){
			
			if(ora.substring(0,1)<=2){
				campo.value=ora.substring(0,1);
				return;
			}else{				
				campo.value='';
				ora='0'+oraReplace.substring(0,oraReplace.substring(0,3));
				campo.value=ora.substring(0,2)+':'+ora.substring(2,4);
				return;
			}
		}
			
	},
	
	isTextualNumber:function(){
		
		return utility.wrapperTextual(
			checkDato.isNumber,
			'Inserire un valore numerico o riconducibile ad un numero'
		);				
		
	},
	
	isTextualPositive:function(){
		
		return utility.wrapperTextual(
			checkDato.isPositive,
			'Inserire un valore positivo o riconducibile ad un valore positivo'
		);			
		
	},
	
	isTextualNotNegative:function(){
		
		return utility.wrapperTextual(
			checkDato.isNotNegative,
			'Inserire un valore positivo o riconducibile ad un valore positivo'
		);			
		
	}	
}

var Default={
	/*francescog 27/03/2013 - aggiunto caso '' per svuotare il valore di un determinato campo*/
	setDefault:function(){
		var lst = getElementsByAttributes({cls:'UserInput',Default:true},document.body,'div');
		//alert(lst.length);
		for(var i=0;i<lst.length;i++){

			switch (lst[i].getAttribute("Default")){
				case 'TODAY': Default.setToday(lst[i]);
					break;
				case 'NOW'  : Default.setNow(lst[i]);
					break;
				case 'USERDESCR' : Default.setUserDescr(lst[i]);
					break;
				case '' :		generic.empty(lst[i]);
					break;
			}
		}
	},
	
	setToday:function(elm){
		var data = clsDate.getData(new Date(),'DD/MM/YYYY');
		elm.lastChild.firstChild.value = data;
	},
	
	setNow:function(elm){
		var ora = clsDate.getOra(new Date());
			elm.lastChild.firstChild.value = ora;
	},	

	setUserDescr:function(elm){
			elm.lastChild.firstChild.value = baseUser.DESCRIPTION ;
	}	
};

/*
	attribute: object dove vengono definite le coppie attributo-valore.
	es: {cls:"Farmaco",name:"mioNome",riga:true}
	
	con :"" confronta il valore, con :true controlla solo la presenza dell'attributo
*/
function getElementsByAttributes(attributes,elm,tagName){

	if(typeof elm=='undefined')
		elm = document.body;
	
	if(typeof tagName=='undefined')
		tagName = '*';


	var lst = new Array();
	var bool;
	var nodes = elm.getElementsByTagName(tagName);
	
	for (var i=0;i<nodes.length;i++){
	
		bool = true;
//		alert(nodes[i].tagName);
		for(var key in attributes){
			//alert(key + ' : ' + nodes[i].getAttribute(key));		

			if (
					(	
						attributes[key]!=true &&
						(
							nodes[i].getAttribute(key)==null || 
							nodes[i].getAttribute(key).match(new RegExp('(\\s|^)'+attributes[key]+'(\\s|$)'))==null
						)
					)
				||
					(	
						attributes[key]==true &&
						nodes[i].getAttribute(key)==null
					)					
				)
			{				
				bool=false;
			}

			
			//alert(bool);
		}
		
		if(bool)
			lst.push(nodes[i]);
	}
	
	return lst;
}

function MultiSubstring(pValue,pRanges){//[	[0,1,'/'] ] begin-end -delimiter
	var StringOut = '';
	for (var i = 0 ; i < pRanges.length ; i++){
		StringOut += pValue.substring(pRanges[i][0],pRanges[i][1]) + (typeof pRanges[i][2] != 'undefined' ? pRanges[i][2]: '')
	}
	return StringOut;
}

function getProperty(key){
	switch(key){
		case "ALTERNABILE":
			var value = $('input[name="TipoAltarnabilita"]:checked').val();
			return (value == null ? 'UNIQUE' : value);
		case "PRESCRIZIONE":
			return $('input[name="TipoPrescrizione"]:checked').val();
		case "DURATADETTAGLIO":
			return $('input[name="Durata"]').val();			
		case "TIMEREFERENCES":
			return {
				data_inizio : clsDate.str2str($('input[name="DataInizio"]').val(),'DD/MM/YYYY','YYYYMMDD'),
				ora_inizio : $('input[name="OraInizio"]').val(),
				data_fine : clsDate.str2str($('input[name="DataFine"]').val(),'DD/MM/YYYY','YYYYMMDD'),
				ora_fine : $('input[name="OraFine"]').val(),
				numero_giorni : $('input[name="NumeroGiorni"]').val()
			};
		case "TIMELINEPROPERTIES":
			return timeline.properties;
		default:
			return null;
	}
}

function isAlternabile(){
	var value = getProperty("ALTERNABILE");
	return (value == 'PRIMARY' || value == 'SECONDARY');
}

function getTimeReferences(){
	return getProperty("TIMEREFERENCES");
}

function getDurataDettaglio(){
	return getProperty("DURATADETTAGLIO");
}

function getTimelineProperties(){
	return getProperty("TIMELINEPROPERTIES");
}

function setTimeReferences(parameters){
	for(var key in parameters){
		var value = parameters[key];
		switch (key) {
			case 'data_inizio': $('input[name="DataInizio"]').val(clsDate.str2str(value,'YYYYMMDD','DD/MM/YYYY'));
				break;
			case 'ora_inizio':  $('input[name="OraInizio"]').val(value);
				break;
			case 'data_fine':   $('input[name="DataFine"]').val(clsDate.str2str(value,'YYYYMMDD','DD/MM/YYYY')); 
				break;
			case 'ora_fine':	$('input[name="OraFine"]').val(value);
				break;	
			case 'numero_giorni': $('input[name="NumeroGiorni"]').val(value);
				break;																
		}
	}
}


function checkValidita(PROCEDURA){
	
	var check = true;
	var msg = "";
	var lstXpath = new Array();
	var lstValue = new Array();	

	var lst = getElementsByAttributes({xpath:true},document.body,'div');

	try{
		var obligatoryAttr;
		switch(PROCEDURA) {
		case 'modello' : 
			obligatoryAttr='obligatory_modello';
			break;
		case 'anamnesi' : 
			obligatoryAttr='obligatory_anamnesi';
			break;
		default:
			obligatoryAttr='obligatory';
		} 
	
		$('div[cls="GruppoFarmaci"]['+obligatoryAttr+'=S]').each(function(){
			var GruppoFarmaci = $(this);
			var Minimo = parseInt(GruppoFarmaci.attr("minimo"),10);			
			if(GruppoFarmaci.find('div[cls="Farmaco"]').length < Minimo){
				check = false;
				msg += 'Il gruppo "' + GruppoFarmaci.prev().text() + "' deve contenere almeno " + Minimo + " " + (Minimo == 1 ? "elemento" : "elementi") + "\n\n";
			}
		});

		msg += 'Compilare i campi obbligatori:\n\n';

		for(var i=0;i<lst.length;i++){
			
			var Xpath = lst[i].getAttribute("xpath");
			var Value="";
			//alert(Xpath);
			
			//alert(lst[i].lastChild.firstChild.tagName);
			//alert(Xpath)
			switch (lst[i].getAttribute("tipo")){
				case 'hidden':
                    switch(lst[i].lastChild.firstChild.name){
                        case 'hGiorniCiclo':

                            var val=lst[i].lastChild.firstChild.value;
                            //controllo regexp per verificare formato (N | NN:NN | ...)
                            if(val.match(/[0-9]+\|[0-9]{2}:[0-9]{2}\|/)){
                               Value = val;
                            }else{
                                Value = "";
                            }

                            break;
                        default : Value=lst[i].lastChild.firstChild.value;
                            break;
                    }
                    break;
				case 'text': 
						Value=lst[i].lastChild.firstChild.value;
					break;
				case 'textarea': 
						Value=lst[i].lastChild.firstChild.innerText;
					break;	
				case 'radio':
						var radios = getElementsByAttributes({type:"radio"},lst[i],'input');
						for (var j in radios)
							if(radios[j].checked)
								Value=radios[j].value;
					break;	
				case 'checkbox':
							Value = (lst[i].lastChild.firstChild.checked) ? "S" : "";
	
					break;							
				case 'select':
						try{
							Value=lst[i].lastChild.firstChild.options[lst[i].lastChild.firstChild.selectedIndex].value;
						}catch(e){
							Value="";
						}
					break;
				case 'timeline':
						switch($('input[name="TipoPrescrizione"]:checked').val()){
							case '1':	prescrizione.oraria.timeline.dettagli2value();
								break;
							case '6':	prescrizione.coumadin.timeline.dettagli2value();
								break;
							default:break;
						}
						Value=lst[i].getAttribute("value");						
					break;
				case null:
						Value= lst[i].innerText;
					break;	
				default:
						alert('Tipo :"' +lst[i].getAttribute("tipo")+ '" non riconosciuto dalla funzione di salvataggio');
					break;					
			}
			//alert(Xpath + '\n' + Value);
			//alert(lst[i].getAttribute("tipo") + ' : ' + Value + ' :: ' + lst[i].getAttribute("obligatory"));		
			
			if(Value=="" && lst[i].getAttribute(obligatoryAttr)=="S"){
				//alert(lst[i].getAttribute("tipo") + ' : ' + Value + ' :: ' + lst[i].getAttribute("msg"));
				if(lst[i].getAttribute("msg")!=null)
					msg+=lst[i].getAttribute("msg")+"\n";
				check = false;	
			}
			
			lstXpath.push(Xpath);
			lstValue.push(Value);		
		}
	}catch(e){
		alert('Error Salvataggio: ' + e.description + '\n' + Xpath);
		return;
	}
	top.Terapie.logger.debug('check(' + check + ',' + msg + ')');	
	return {
		'check'		: check,
		'msg'		: msg,
		'lstXpath' 	: lstXpath,
		'lstValue' 	: lstValue		
	};
}

function salva(PROCEDURA,IDEN_SCHEDA,ID_SESSIONE,NUMERO_CICLO,callBackOk,callBackKo){
	esegui(
		{
			"PROCEDURA":PROCEDURA,
			"IDEN_SCHEDA":IDEN_SCHEDA,
			"ID_SESSIONE":ID_SESSIONE,
			"NUMERO_CICLO":NUMERO_CICLO,
			"IDEN_TERAPIA":null
		},
		callBackOk,
		callBackKo
	);
}

function esegui(paramters,callBackOk,callBackKo){
	top.Terapie.logger.debug('salva(' + paramters.PROCEDURA + ',' + paramters.IDEN_SCHEDA + ',' + paramters.ID_SESSIONE + ',' + paramters.NUMERO_CICLO +')');	
	var controllo = checkValidita(paramters.PROCEDURA);
	paramters = $.extend(
					{
						"PROCEDURA":null,
						"IDEN_VISITA":null,
						"IDEN_SCHEDA":null,
						"ID_SESSIONE":null,
						"NUMERO_CICLO":null,
						"IDEN_TERAPIA":null,
						"CODICE_REPARTO":null,
						"STATO_TERAPIA":null,
						"IDEN_CICLO":null,
						"IDEN_PARENT":null,
						"IDEN_TERAPIA":null
					},
					paramters				
	);

	//alert(PROCEDURA);
	if(controllo.check){	
		//alert(controllo.lstXpath);
		//alert(controllo.lstValue);
		dwr.engine.setAsync(false);
		Terapia.esegui(
				{
				"PROCEDURA":paramters.PROCEDURA,
				"IDEN_VISITA":parent.EXTERN.idenVisita.value,
				"IDEN_SCHEDA":paramters.IDEN_SCHEDA,
				"ID_SESSIONE":paramters.ID_SESSIONE,
				"NUMERO_CICLO":paramters.NUMERO_CICLO,
				"IDEN_TERAPIA":null,
				"CODICE_REPARTO":parent.EXTERN.reparto.value,
				"STATO_TERAPIA":parent.STATO_TERAPIA,
				"IDEN_CICLO":parent.IDEN_CICLO,
				"IDEN_PARENT":parent.IDEN_PARENT,
				"IDEN_TERAPIA":paramters.IDEN_TERAPIA
			},
			controllo.lstXpath, 
			controllo.lstValue, 									
			callBack
		);		
		dwr.engine.setAsync(true);
				
		function callBack(resp){
			top.Terapie.logger.debug("salva.callBack("+resp+")");
			if(resp.success =='OK'){	
				if(typeof callBackOk=='function' ){
					callBackOk(resp.iden_scheda,resp.iden_terapia,resp.iden_ciclo);
				}
				
			}else{	
				if (resp["message"]!=null) {
					alert(resp["message"].substring(resp["message"].indexOf(":")+2));
				}
				if(typeof callBackKo=='function'){
					callBackKo();
				}
				
			}			

		}
		
		
	}else{
		alert(controllo.msg);			
	}
	
}