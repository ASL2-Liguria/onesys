// modifica 18-4-16
// salvo info per chiamate da esterno
var objCaller = {};
// **********************


function libera(utente, ip_local)
{
	try
	{
		dwr.engine.setAsync(false);
		
		prenDWRClient.libera_tutto('S*' + utente + '*' + ip_local);//, check_msg);
		
		dwr.engine.setAsync(true);
	}
	catch(ex)
	{
	}
}

function libera_all(utente, ip_local)
{
	try
	{
		dwr.engine.setAsync(false);
		prenDWRClient.libera_tutto('N*' + utente + '*' + ip_local);//, check_msg);
		dwr.engine.setAsync(true);
	}
	catch(ex)
	{
	}
}

function check_msg(msg)
{
	try
	{
		if(msg != null && msg != '')
		{
			//alert(msg);
		}
	}
	catch(ex)
	{
	}
}

function set_eventi()
{
	/*top.onBeforeUnload = 
		function() 
		{
			if(top.mainFrame.workFrame.frameMaster)
			{
				top.mainFrame.workFrame.frameMaster.onunload = function () {return false;};
			}
		}*/
}

function ritorna_prenotazione()
{
	
	var aPar = parent.parametri;
	libera('', '');
	ripristina_bt();

	// **************
	// modifica 29-1-16	
	try{
		// tappullo funzioanante SOLO se si annulla
		// da scelta esami!!
		if (parent.parametri.toString()=="RICHIESTE"){
			top.document.getElementById('iframe_main').src = top.home.v_load_on_startup;
			return;
		}
	}catch(e){;}
	//***** 	
	
	switch (aPar.ORIGINE)
	{
		case "PRENOTAZIONE":
			// ambulatorio
			document.location.replace('sceltaEsami?visualizza_metodica=N&tipo_registrazione=P&next_servlet=javascript:next_prenotazione();&cmd_extra=hideMan();parent.parametri%3D{"ORIGINE":%20"PRENOTAZIONE"}%3B');
			break;
		case "CONSULTAZIONE":
			if(aPar.OPZIONI_PRENOTA == 'S')
			{
				document.location.replace('GestRichiesteFrameSet');
			}
			else
			{
//				document.location.replace('consultazioneInizio?sala=' + aPar.VALORE + '&data=' + aPar.DATA + '&aree=' + aPar.AREE + '&area=' +  + aPar.ID_AREA + '&tipo=' + aPar.TIPO + '&js_click=javascript%3A&js_indietro=javascript%3Aritorna_consulta(%22' + aPar.TIPO + '%22%2C%22' + aPar.VALORE + '%22%2C%22' + aPar.VALORE2 + '%22%2C%22' + aPar.FILTRO_ESAMI + '%22%2C%22' + aPar.OFFSET + '%22)%3B');
				document.location.replace('consultazioneInizio?tipo=' + aPar.TIPO);
			}
			break;
		default:
			document.location.replace('blank');
	}
}

function next_prenotazione()
{
	document.forms[0].onSubmit = false;
	//return alert('funzioni.js : '+document.forms[0].name);
	switch(document.forms[0].name)
	{
		case 'scelta_esame':
			/*francescog 28/11/2012 skip di scheda esame in prenotazione*/
			/*if(document.forms[0].apri_scheda_esame && document.forms[0].apri_scheda_esame.value == 'N'){
				document.forms[0].action = 'prenotazioneInizio';
				document.forms[0].js_after_load.value = 'parent.frameDirezione.show_bt("btDataOra");';
			}else{	*/	
				document.forms[0].action = 'schedaEsame';
				document.forms[0].js_after_load.value = 'try{show_bt("btSchedaEsami");}catch(e){;}';
			//}
			/*
			document.forms[0].action = 'schedaEsame';
			document.forms[0].js_after_load.value = 'show_bt("btSchedaEsami");';			
			*/
			document.forms[0].submit();
			
			break;
		case 'gestione_esame':

			document.forms[0].action = 'prenotazioneInizio';
			document.forms[0].js_after_load.value = 'try{parent.frameDirezione.show_bt("btDataOra");}catch(e){;}';
			
			document.forms[0].submit();
			
			break;
	}
}

function show_bt(nome)
{
	show_hide_bt(nome, 'visible');
}

function hide_bt(nome)
{
	show_hide_bt(nome, 'hidden');
}

function show_hide_bt(nome, tipo)
{
	if(nome != null && nome != '' && parent.frameDirezione)
	{
		if(parent.frameDirezione.document.all[nome].style.visibility != tipo)
		{
			parent.frameDirezione.document.all[nome].style.visibility = tipo;
			
			colora_sel_desel(nome);
		}
	}
	else
	{
		if(document.all[nome])
		{
			if(document.all[nome].style.visibility != tipo)
			{
				document.all[nome].style.visibility = tipo;
				
				colora_sel_desel(nome);
			}
		}
	}
}

function ripristina_bt()
{
	hide_bt('btSchedaEsami');
	hide_bt('btDataOra');
	hide_bt('btSceltaPaziente');
	colora_sel_desel('btSceltaEsami')
	
	if(parent.frameDirezione)
	{
		parent.document.all.frameMainPrenotazione.rows = "29,*";
	}
}

function colora_sel_desel(nome)
{
	var bt_1 = '';
	var bt_2 = '';
	var bt_3 = '';
	
	if(nome != null && nome != '' && parent.frameDirezione)
	{
		parent.frameDirezione.document.all[nome].className = 'pulsanteleft_sel';
		
		switch(nome)
		{
			case('btSceltaEsami'):
				parent.frameDirezione.document.all['btSchedaEsami'].className = 'pulsanteleft';
				parent.frameDirezione.document.all['btDataOra'].className = 'pulsanteleft';
				parent.frameDirezione.document.all['btSceltaPaziente'].className = 'pulsanteleft';
				
				break;
			case('btSchedaEsami'):
				parent.frameDirezione.document.all['btSceltaEsami'].className = 'pulsanteleft';
				parent.frameDirezione.document.all['btDataOra'].className = 'pulsanteleft';
				parent.frameDirezione.document.all['btSceltaPaziente'].className = 'pulsanteleft';
				
				break;
			case('btDataOra'):
				parent.frameDirezione.document.all['btSceltaEsami'].className = 'pulsanteleft';
				parent.frameDirezione.document.all['btSchedaEsami'].className = 'pulsanteleft';
				parent.frameDirezione.document.all['btSceltaPaziente'].className = 'pulsanteleft';
				
				break;
			case('btSceltaPaziente'):
				parent.frameDirezione.document.all['btSceltaEsami'].className = 'pulsanteleft';
				parent.frameDirezione.document.all['btSchedaEsami'].className = 'pulsanteleft';
				parent.frameDirezione.document.all['btDataOra'].className = 'pulsanteleft';
				
				break;
		}
	}
	else
	{
		if(document.all[nome])
		{
			document.all[nome].className = 'pulsanteleft_sel';
			
			switch(nome)
			{
				case('btSceltaEsami'):
					document.all['btSchedaEsami'].className = 'pulsanteleft';
					document.all['btDataOra'].className = 'pulsanteleft';
					document.all['btSceltaPaziente'].className = 'pulsanteleft';
					
					break;
				case('btSchedaEsami'):
					document.all['btSceltaEsami'].className = 'pulsanteleft';
					document.all['btDataOra'].className = 'pulsanteleft';
					document.all['btSceltaPaziente'].className = 'pulsanteleft';
					
					break;
				case('btDataOra'):
					document.all['btSceltaEsami'].className = 'pulsanteleft';
					document.all['btSchedaEsami'].className = 'pulsanteleft';
					document.all['btSceltaPaziente'].className = 'pulsanteleft';
					
					break;
				case('btSceltaPaziente'):
					document.all['btSceltaEsami'].className = 'pulsanteleft';
					document.all['btSchedaEsami'].className = 'pulsanteleft';
					document.all['btDataOra'].className = 'pulsanteleft';
					
					break;
			}
		}
	}
}

function exit_ris()
{
	alert('aa');
	top.close();
}