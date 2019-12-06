// aggiunta del 14/5/2013
var last_calendario_pagina;
var last_calendario_target_num;
var timerTimeout;
var timeoutMs = 3000;



function aggiorna_apri_dettaglio(){
	try{
		// passaggio inutile di variabili
		var myPag;
		var myTgt;
		var toRun = document.getElementById("lblAggiorna").href.split(":")[1];
		//alert(toRun);
		eval(toRun);
		myPag = last_calendario_pagina;
		myTgt = last_calendario_target_num;
		toRun = "parent.frameCalendario.aggiorna(\"" + myPag +"\"," + myTgt +")";
		//alert("#" + toRun +"#");
		// modifica aldo, rivedere: perchè non funziona !?
		/*
		timerTimeout = setTimeout(function(){
			try{
				parent.frameCalendario.aggiorna(myPag,myTgt);
			}catch(e){alert(e.description);}
		},timeoutMs);*/
	}
	catch(e){
		alert("aggiorna_apri_dettaglio - Error: " + e.description);
	}
	
}


// ****************************


function y2k(number)
{
	return (number < 1000) ? number + 1900 : number;
}

function getWeek(year, month, day)
{
	var when    = new Date(year,month,day);
	var newYear = new Date(year,0,1);
	var modDay  = newYear.getDay();
	var daynum;
	var weeknum;
	var prevNewYear;
	var prevmodDay;
	
	if (modDay == 0) modDay=6; else modDay--;
	
	daynum = ((Date.UTC(y2k(year),when.getMonth(),when.getDate(),0,0,0) - Date.UTC(y2k(year),0,1,0,0,0)) /1000/60/60/24) + 1;
	
	if(modDay < 4 )
	{
		weeknum = Math.floor((daynum+modDay-1)/7)+1;
	}
	else
	{
		weeknum = Math.floor((daynum+modDay-1)/7);
		
		if(weeknum == 0)
		{
			year--;
			prevNewYear = new Date(year,0,1);
			prevmodDay = prevNewYear.getDay();
			
			if(prevmodDay == 0) prevmodDay = 6; else prevmodDay--;
			if(prevmodDay < 4) weeknum = 53; else weeknum = 52;
		}
	}
	
	return + weeknum;
}

function aggiorna(tipo)
{
	var par;
	var data = new Date();
	var dd = '00' + data.getDate();
	var mm = '00' + (data.getMonth() + 1);
	var yyyy = data.getYear();
	var a_data = document.opzioni.txtdata.value.split("/");
	var num_data = getWeek(parseInt(a_data[2], 10), parseInt(a_data[1], 10) - 1, parseInt(a_data[0], 10));
	var num_now; 
	
	document.opzioni.txtdata.onkeypress = function () {	 if (window.event.keyCode==13)
	 {
		 window.event.returnValue=false;
	 }}
	
	dd = dd.substr(dd.length-2, dd.length);
	mm = mm.substr(mm.length-2, mm.length);
	
	num_now = getWeek(yyyy, mm - 1, dd);
	num_data += (parseInt(a_data[2], 10) - yyyy) * 52;
	
	if(document.opzioni.prenota.value != 'S')
	{
		par = '';
	}
	else
	{
		par = parent.frameRiepilogo.getIdenEsa();
	}
	
	if(par != '-1')
	{
		par = '&filtro_esami=' + par;
		// modifica 28-5-15
		//par += '&Hoffset=' + ((num_data-num_now) - Math.abs((num_data-num_now) % 2))/2;
		par += '&Hdata=' + a_data[2] + a_data[1] + a_data[0];
		// *****************************
		
		parent.frameCalendario.location.replace('consultazioneCalendario?valore=' + document.opzioni.Hcdc.value + '&valore2=' + document.opzioni.Hiden_sal.value + par + '&tipo=CDC');
	}
	else
	{
		parent.frameCalendario.location.replace('blank');
	}
}

function apri_scelta(tipo, valore, valore_check, where)
{
	var wScelta;
	var sSql;
	
	initbaseUser();
	
	if(tipo == 'WEB')
	{
		sSql = 'select WEB_CDC.REPARTO, WEB_CDC.REPARTO from WEB_CDC ';
		sSql += 'where WEB_CDC.WEBUSER = \'' + baseUser.LOGIN + '\'';
		sSql += ' order by WEB_CDC.REPARTO asc';
	}
	else
	{
		sSql = 'select TAB_SAL.IDEN, TAB_SAL.DESCR from TAB_SAL';
		if(valore != '')
		{
			sSql += ' where TAB_SAL.ATTIVO = \'S\' and REPARTO in (' + document.opzioni.Hcdc.value + ')';
		}
		sSql += ' order by TAB_SAL.DESCR asc';
	}
	
	wScelta = window.open('consultazioneScelta?colonne=3&tipo=' + tipo + '&sql=' + sSql + '&valore_check=' + valore_check + '&where=' + where, '', 'top=0,left=0,scrollbars=yes,status=yes');
	if(wScelta)
	{
		wScelta.focus();
	}
	else
	{
		wScelta = window.open('consultazioneScelta?colonne=3&tipo=' + tipo + '&sql=' + sSql + '&valore_check=' + valore_check + '&where=' + where, '', 'top=0,left=0,scrollbars=yes');
	}

}

function set_view_cdc(cdc, descr_cdc)
{
	document.opzioni.Hcdc.value = cdc;
	cdc = cdc.replace(/'/g, "");
	document.all.lblElencoCDC.innerHTML = descr_cdc.substr(0, 30) + '...';
	document.all.lblElencoCDC.title = descr_cdc;
}

function set_view_sale(sale, descr)
{
	if(document.opzioni.prenota.value != 'S')
	{
		document.opzioni.Hiden_sal.value = sale;
		document.all.lblElencoSALE.innerHTML = descr.substr(0, 30) + '...';
		document.all.lblElencoSALE.title = descr;
	}
	else
	{
		document.all.tableOpt.rows(0).cells(2).style.display = 'none';
		document.all.tableOpt.rows(0).cells(3).style.display = 'none';
	}
}