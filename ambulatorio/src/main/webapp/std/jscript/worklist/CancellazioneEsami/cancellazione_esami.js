var ges_satapp=false;
// *********************
// modifica Aldo
var bolDaConsPren = false;
// *****************
function inserisci_motivazione()
{
	var doc = document.form_ins_motivazione;
	var iden_esami = '';
	
	/*alert(opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB);
	alert(doc.iden_motivazione.value);
	alert(doc.motivo_cancellazione.value);
	*/
	
	if((opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB == '1' && doc.iden_motivazione.value == '') || (opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB == '3' && doc.motivo_cancellazione.value == ''))
	{
		alert(ritornaJsMsg('ins_mot_canc_esa'));//'Prego inserire la motivazione della cancellazione
		try{
			doc.motivo_cancellazione.focus();
		}
		catch(e){
		}
		return;
	}

	
	try{
		// modifica 27-10-16
		if (typeof(opener.array_iden_esame)!="undefined"){
			iden_esami = opener.stringa_codici(opener.array_iden_esame);
		}else{
			bolDaConsPren = true;
			iden_esami = opener.stringa_codici(opener.a_iden_esame); 
		}
		// **********
	}
	catch(e){
		//cancellazione di una prenotazione da 'Consulta Prenotazione'
		// *********************
		// modifica Aldo
		bolDaConsPren = true;	
		// *********************		
		iden_esami = opener.stringa_codici(opener.a_iden_esame); 
	}

	/*alert('MOTIVO CANCELLAZ OBBL: ' + opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB);
	alert('MOTIVO CANCELLAZIONE: ' + document.form_ins_motivazione.motivo_cancellazione.value);
	alert('IDEN_MOTIVAZIONE: ' + document.form_ins_motivazione.iden_motivazione.value);
	alert("ELENCO ESAMI DA CANC: " + iden_esami);*/

	doc.idenEsame.value = iden_esami;
	doc.sorgente.value = 'worklist';
	
	doc.action = 'SL_CancellazioneEsami';
	doc.target = 'winCancEsa';
        /*chiamo il satapp*/
        if(ges_satapp){
			var v_iden_anag = "";
			var v_num_pre = "";
			var v_reparto = "";
			var arr_num_pre = [];
			if(typeof opener.array_iden_anag !="undefined"){
				v_iden_anag = opener.stringa_codici(opener.array_iden_anag).split("*")[0];
				v_num_pre = opener.stringa_codici(opener.array_num_pre).split("*")[0];
				v_reparto = opener.stringa_codici(opener.array_reparto).split("*")[0];
				arr_num_pre= opener.stringa_codici(opener.array_num_pre).split("*");
			}else{
				dwr.engine.setAsync(false);
				var v_sql ="select num_pre,iden_anag,reparto from esami where iden = " + opener.stringa_codici(opener.a_iden_esame);
				toolKitDB.getResultData(v_sql,function(rs){
					v_num_pre = rs[0];
					v_iden_anag = rs[1];
					v_reparto = rs[2];
					arr_num_pre[rs[0]];
				});
				dwr.engine.setAsync(true);
			}
			var v_n = "";
			var flg_num_pre = true;
			if(arr_num_pre.length > 1){
					for (i=0;i < arr_num_pre.length;i++){
							if(i==0){
									v_n= arr_num_pre[i];
							}else{
									if(v_n!=arr_num_pre[i]){
											alert("Esami con numero ricetta differente");
											flg_num_pre = false;
									}
							}								
					}
			}
			if(!flg_num_pre){
					return;
			}
			if(typeof opener.array_iden_esame != "undefined"){

				var num_esami_sel = opener.stringa_codici(opener.array_iden_esame).split("*").length;
			}else{
				var num_esami_sel = opener.stringa_codici(opener.a_iden_esame).split("*").length;
			}
			
			try{
				// credo sia una parte di ferrara
				if(opener.NS_SATAPP.checkSatappCancellazione(v_num_pre,num_esami_sel)){
					var esito = opener.NS_SATAPP.init("C",v_iden_anag ,v_num_pre,"",v_reparto);
					if(esito =="KO"){
							return;
					}else{
						opener.NS_SATAPP.aggiornaRicetta("C",v_num_pre);
					}
				}
			}
			catch(e){

			}
        }
    
	
	// *********************
	// modifica Aldo
	//  salvo da parte le info dell'esame che sto per cancellare
	// salvo esami.iden cancellato o una dicitura da riportare 
	// in automatico ?
	if (bolDaConsPren){
		// provengo da consulta prenotazione
		var iden_esame = opener.stringa_codici(opener.a_iden_esame); 		
		var data = opener.document.dettaglio.Hdata.value;
		var ora	= opener.stringa_codici(opener.a_ora);
		var iden_are	= opener.stringa_codici(opener.a_iden_are);		
		var iden_anag	= opener.stringa_codici(opener.a_iden_anag);		
		var iden_esa = opener.stringa_codici(opener.a_iden_esa);
		// modifica 27-10-16
		var idenImpSale="";
		var v_sql = "select iden_imp_sale from VIEW_PRENOTAZIONE_ORARIO where iden_esame = " + iden_esame;
		toolKitDB.getResultData(v_sql,function(rs){
			idenImpSale = rs[0];
		});				
		// ************

		if (ora.substr(0,3).toLowerCase()=="<di"){
			ora = $(ora).text();
		}
		// per ora non lo uso
		var motivo_canc = $("#idTextMotivazione").html();
		// chiamare statement per l'insert
//		IDEN_ESAME, IDEN_ESA, IDEN_ANAG, IDEN_ARE, DATA, ORA, RIEPILOGO

//		alert(iden_esame +"#\n" + iden_esa +"#\n" +iden_anag +"#\n" +iden_are +"#\n" +data +"#\n" + ora +"#\n");
		try{
			var sql = "insert into PRENOTAZIONI_CANCELLATE (IDEN_ESAME, IDEN_ESA, IDEN_ANAG, IDEN_ARE, DATA, ORA, RIEPILOGO) values ("+iden_esame+","+iden_esa+"," + iden_anag + "," + iden_are +",'"+data+"','"+ ora +"',(SELECT cogn   || ' '  || nome  || ' '  || datetimeconverter(data, 'yyyymmdd', 'dd/mm/yyyy')  || ' - ' || tab_esa.descr RIEPILOGO FROM anag ,  esami ,  tab_esa WHERE esami.iden = "+ iden_esame +" and esami.iden_anag = anag.iden and esami.iden_esa = tab_esa.iden))"
			dwr.engine.setAsync(false);
			toolKitDB.executeQueryData(sql, function(message){	
				//alert(message);
			});
			dwr.engine.setAsync(true);
		}
		catch(e){;}
		
		// da togliere
//		return;
	}
	// *****************
	
	var canc_esami = window.open("","winCancEsa", "top=0,left=1000000000");
	if (canc_esami)
	{
		canc_esami.focus();
	}
	else
	{
		canc_esami = window.open("","winCancEsa", "top=0,left=1000000000");
	}
	
	doc.submit();
	
	// modifica 27-10-16
	setTimeout(function(){
		if (bolDaConsPren){
			opener.aggiorna(idenImpSale);
		}else{
			opener.aggiorna();
		}						
		canc_esami.close();
		self.close();
	},1000);
	// **************
}




// modifica 27-10-16
function chiudi()
{
	opener.aggiorna();
	self.close();
}
// **********

/*
	Funzione richiamata all'onLoad della pagina
	NB se metto il focus al campo non funziona correttamente la pageModal.js
*/
function onLoad()
{
	//alert('MOTIVO CANCELLAZ OBBL: ' + opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB);
	
	if(opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB == '1' || opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB == '2')
		document.all.idTextMotivazione.disabled = "disabled"; 
	else	
		if(opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB == '3' || opener.baseGlobal.MOTIVO_CANCELLAZIONE_OBB == '4')
			document.all.lmotivo.innerText = '';
		
		
	//document.form_ins_motivazione.motivo_cancellazione.focus();
}


function scegliMotivazione(){
	var win_scandb = null;
	var doc = document.formScanDb;
	
	win_scandb = window.open('','win_scandb', 'width=400, height=600, resizable = yes, status=yes, top=10,left=10');
	
	doc.myric.value = '';
	doc.myproc.value = 'TAB_MOTIVAZIONI';
	doc.mywhere.value = '';
	
	doc.submit();	
}
