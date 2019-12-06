function registra()
{
	var ok = true;
	var c = 0;
	var i;
	// modifica 14-6-16
	try{$("#lblRegistra").parent().parent().hide();	}catch(e){;}
	// *****
	try{
		
		for(i = 0; i<parent.frameElenco.document.all.oTable.rows.length; i++)
		{
			if(parent.frameElenco.document.all.oTable.rows(i).style.display != 'none')
			{
				c++;
			}
		}
		
		if(parent.parent.frameDirezione)
		{
			parent.parent.frameDirezione._num_esami_prenotati = a_indice_pren.length - 1;
		}
		
		if(c > 0)
		{
			alert('Attenzione! Mancano ancora ' + parent.frameElenco.getCountEsa(true) + ' esami da inserire!');
		}
		else
		{
			ricerca_paziente();
		}
		
	}catch(e){
		alert("registra - Error: " + e.description);
		// modifica 14-6-16
		try{$("#lblRegistra").parent().parent().show();	}catch(e){;}
		// ********
	}
}

function ricerca_paziente()
{
	try{
		// *********************
		// modifica 19-4-16				
		var objCaller =  window.parent.parent.objCaller;
		var caller;
		try{caller = objCaller.caller;}catch(e){caller="";}
		if ((caller=="undefined")||(typeof(caller)=="undefined")){
			caller = "";
		}	
		// ****************************	 

		if(parent.parent.frameDirezione)
		{
			try{parent.parent.frameDirezione.show_bt("btSceltaPaziente");}catch(e){;}
		}
		
		if(document.riepilogo.Hiden_anag.value == '' || document.riepilogo.Hiden_anag.value == '0')
		{
			parent.document.location.replace("SL_RicercaPazienteFrameset?rf1=141&rf2=*&rf3=0&provenienza=prenotazioneOrario&tipo_ricerca=0");//&servlet_call_after=prenotazioneRegistra
		}
		else
		{	
			var WindowCartella = null;
			var bolNotInWhale = false;
			try{
				WindowCartella = window;
				// con DEMA 
				// LOOP INFINITO !!!!!!
				var counter = 0;
				while (WindowCartella.name != 'schedaRicovero' && WindowCartella.parent){

					WindowCartella = WindowCartella.parent;
					//***************************
					//****** modifica DEMA ******
					//***************************	
					// mega tappullo
					counter++;
					if (counter == 10){bolNotInWhale = true;break;}
					// **************************
				}

				if (bolNotInWhale){
					parent.top.document.getElementById('iframe_main').src = getUrlRegistrazione();
					return;
				}
				else{
					var afterSave = WindowCartella.ModalitaCartella.getAfterSave(document);
					if ("prenotazionePazienteEsternoAMB" == afterSave){
						parent.top.document.getElementById('iframe_main').src = getUrlRegistrazione() + "&modalita=" + afterSave;
					} else {
						$.ajax({
							url: getUrlRegistrazione(),
							async:false,
							success:function(data){
								switch(WindowCartella.ModalitaCartella.getAfterSave(document)){
								case 'checkAppuntamentiReloadRiepilogo':   	WindowCartella.PostInserimento.CheckAppuntamento();
								case 'reloadRiepilogo':                    	WindowCartella.apriRiepilogo();
									break;
								case 'checkAppuntamentiReloadWk':          	WindowCartella.PostInserimento.CheckAppuntamento();
								case 'reloadWk':							WindowCartella.apriWorkListRichieste();
									break
								case 'reloadWkAMB':							WindowCartella.apriWorkListPrestazioni();
									break;
								default:									WindowCartella.refreshPage();
									break;								
								}
							},
							error:function(obj,message){
								alert('Error is:' + message);
							}
						});
					}
				}

			}catch(e){//contesto differente dalla cartella di ricovero
				parent.document.location.replace(getUrlRegistrazione());
			}finally{ 	// modifica 14-6-16
				try{$("#lblRegistra").parent().parent().show();	}catch(e){;}
			} // ******

			function getUrlRegistrazione(){
				return "prenotazioneRegistrazione?Hiden_anag=" + document.riepilogo.Hiden_anag.value;
			}

		}
	}catch(e){
		alert("ricerca_paziente - Error: " + e.description);
	}finally{ 	// modifica 14-6-16
		try{$("#lblRegistra").parent().parent().show();	}catch(e){;}
	} // ******
}

function annulla_prenotazione()
{
	var ind = stringa_codici(a_indice_pren);
	
	parent.frameElenco.ripristina_esame(parseInt(ind,10));
	document.location.reload();
}