// **************************		
// modifica del 11-02-15
$(function() {
	$("#lblData").html("Dalla data:");
	if ( document.gestione_agenda.da_data.value==""){
		String.prototype.getTodayDateFormat = function()
		{
			var dataOggi ;
		
		
			dataOggi=new Date();
			var dataOggiGiorno=dataOggi.getDate();
			if (parseInt(dataOggiGiorno)<10){dataOggiGiorno = "0" + dataOggiGiorno.toString();}
			var dataOggiMese=dataOggi.getMonth()+1;
			if (parseInt(dataOggiMese)<10){dataOggiMese = "0" + dataOggiMese.toString(); }
			var dataOggiAnno=dataOggi.getFullYear();
			var dataOggiStringa= dataOggiGiorno + "/" + dataOggiMese + "/" + dataOggiAnno;
			return dataOggiStringa;
		};
		
		var oggi = new String("");
		document.gestione_agenda.da_data.value = oggi.getTodayDateFormat();
	}
});	

// **************************

function cambia_cdc(valore)
{
	//if(valore != null && valore != '')
	//{
		document.gestione_agenda.hCDC.value = valore;
		document.gestione_agenda.action = 'agendaInizio';
		document.gestione_agenda.submit();
	//}
}

function genera()
{
	var ng 		= document.gestione_agenda.ngiorni.value;
	var tutti 	= tutti_selezionati();
	var gp 		= '30';
	var sql		= '';
	var data;
	
	if(isNaN(ng) || ng == "")
	{
		alert('Inserire il numero dei giorni corretto!');
		document.gestione_agenda.ngiorni.focus();
	}
	else
	{
		// **************************		
		// modifica del 11-02-15	
		// perche' viene differenziato se ha selezionato tutti o meno??
		for (var k=0;k<a_id.length;k++){
			a_id[k] = parseInt(a_id[k]);
		}
		// **************************

		
		//document.gestione_agenda.hIdenArea.value = document.gestione_agenda.selArea.options[document.gestione_agenda.selArea.selectedIndex].value;
		document.gestione_agenda.hIdenArea.value = stringa_codici(a_id);
		if(document.gestione_agenda.hIdenArea.value == '' && !tutti)
		{
			alert('Prego selezionare almeno un\'area!');
		}
		else
		{
			if(typeof baseGlobal != 'undefined' && typeof baseGlobal.GGPRIMA != 'undefined')
				gp = baseGlobal.GGPRIMA;
			
			if(document.gestione_agenda.da_data.value != '')
			{
				var m =  document.gestione_agenda.da_data.value.split('/');
				data = m[2] + m[1] + m[0];
			}
			if (typeof(data)=="undefined" || data =="undefined"){
				data = "";
			}			
			
			/*if(tutti)
			{
				document.gestione_agenda.hIdenArea.value = '';
				sql = 'SP_GENERAAGENDA@INumber#INumber#IString@' + gp + '#' + ng + '#' + data;
			}
			else
				sql = 'SP_GENERAAGENDA_AREA_MULTI@INumber#INumber#IString#IString@' + gp + '#' + ng + '#' + document.gestione_agenda.hIdenArea.value + '#' + data;*/
			
			// **************************		
			// modifica del 11-02-15
			
			/*
			if(tutti)
			{
				document.gestione_agenda.hIdenArea.value = '';
				sql = "{call SP_GENERAAGENDA(" + gp + "," + ng + ",'" + data + "')}";
			}
			else
				sql = "{call SP_GENERAAGENDA_AREA_MULTI(" + gp + "," + ng + ",'" + document.gestione_agenda.hIdenArea.value + "','" + data + "')}";
				*/
			sql = "{call SP_GENERAAGENDA_AREA_MULTI(" + gp + "," + ng + ",'" + document.gestione_agenda.hIdenArea.value + "','" + data + "')}";				
			// **************************						
			
			//document.gestione_agenda.action = 'agendaRegistra';
			//document.gestione_agenda.submit();
//			alert(sql);return;	
			document.gestione_agenda.innerHTML = '<CENTER><H1>Attendere prego...<H1></CENTER>';
			
			//dwr.engine.setAsync(false);
			
			//functionDwr.launch_sp(sql, risp_genera_agenda);
			
			//dwr.engine.setAsync(true);
			dwr.engine.setAsync(false);
			
			toolKitDB.executeQueryData(sql, risp_genera_agenda);
			
			dwr.engine.setAsync(true);
		}
	}
}

function risp_genera_agenda(risp)
{
	if(risp.indexOf('ERROR') >= 0)
		alert('Errore durante la generazione:\n' + risp.split('*')[1]);
	else
		alert('Generazione completata con successo!');
	
	document.location.replace('agendaInizio');
}

function seleziona_tutto()
{
	var i;
	
	for(i=0; i<a_id.length; i++)
	{
		if(!hasClass(document.all.oTable.rows(i), 'sel'))//document.all.oTable.rows(i).style.backgroundColor != sel)
		{
			//illumina_multiplo(i, a_id)
			illumina_multiplo_generica(i);
		}
	}
	
	/*top.resizeTo(screen.availWidth, screen.availHeight)
	top.moveTo(0,0)*/
}

function deseleziona_tutto()
{
	var i;
	
	for(i=0; i<a_id.length; i++)
	{
		if(hasClass(document.all.oTable.rows(i), 'sel'))//document.all.oTable.rows(i).style.backgroundColor == sel)
		{
			//illumina_multiplo(i, a_id)
			illumina_multiplo_generica(i);
		}
	}
	
	/*top.resizeTo(screen.availWidth, screen.availHeight)
	top.moveTo(0,0)*/
}

function tutti_selezionati()
{
	for(var i=0, ret = true; i<a_id.length && ret; ret=(hasClass(document.all.oTable.rows(i++), 'sel')));//(document.all.oTable.rows(i++).style.backgroundColor == sel));
	
	return ret;
}