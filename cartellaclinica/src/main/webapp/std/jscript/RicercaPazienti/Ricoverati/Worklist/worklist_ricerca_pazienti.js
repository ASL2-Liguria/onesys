var height = screen.availHeight;
var width = screen.availWidth;
var winReparti = null;
var objRepartiUtente = null;
var idenAnagPre=null;
var idenVisitaPre=null;


$(document).ready(function(){
	window.WindowHome = window;
	while((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome){	
		window.WindowHome = window.WindowHome.parent;
    }

	switch(WindowHome.name){
		case 'Home':
		    window.baseReparti 	= WindowHome.baseReparti;
		    window.baseGlobal 	= WindowHome.baseGlobal;
		    window.basePC 		= WindowHome.basePC;
		    window.baseUser 	= WindowHome.baseUser;
		    break;
		case 'schedaRicovero':
		    window.baseReparti 	= WindowHome.baseReparti;
		    window.baseGlobal 	= WindowHome.baseGlobal;
		    window.basePC 		= WindowHome.basePC;
		    window.baseUser 	= WindowHome.baseUser;
		    break;
		default:
		try{
		    window.baseReparti 	= opener.top.baseReparti;
	    	window.baseGlobal 	= opener.top.baseGlobal;
	    	window.basePC 		= opener.top.basePC;
	    	window.baseUser 	= opener.top.baseUser;
			}catch(e){
		    window.baseReparti 	= top.baseReparti;
	    	window.baseGlobal 	= top.baseGlobal;
	    	window.basePC 		= top.basePC;
	    	window.baseUser 	= top.baseUser;				
			}			
	}
	
	
	if(window.baseReparti.getValue(array_codice_reparto[0],'GET_OMONIMI')=='S'){
		getOmonimi();
	}
	
	window.name = "WK_RICERCA_PAZIENTI_RICOVERATI_REMOTA";
 	
	if (baseUser.ATTIVA_NUOVA_WORKLIST == 'S'){
		$().callJSAfterInitWorklist('funzione()');
	}else{
		funzione();
	}
	
	NS_ALLETTAMENTO_RICOVERATO.init();
	
	parent.removeVeloNero('oIFWk');	
	controlloLimiteRecord();
	caricaAvvertenze();
	
});

function caricaAvvertenze(){
	
	
	var jsonRecord = [];
	var min=0;
	var max=array_id_remoto.length;

		for (min; min < max; ++min) {
			jsonRecord.push({
				"ID_REMOTO": array_id_remoto[min].toString(),
				"IDEN_ANAG": array_iden_anag[min].toString(),
				"IDEN_VISITA": array_iden_visita[min].toString(),
				"IDEN_RICOVERO": array_iden_ricovero[min].toString(),
				"REPARTO": array_codice_reparto[min],
				"NUM_NOSOLOGICO": array_num_nosologico[min],
				"COD_TIPO_RICOVERO": array_cod_tipo_ricovero[min]
			});

		}
		var jsonObject = {"TIPO_UTE":baseUser.TIPO,"IDEN_PER":baseUser.IDEN_PER,"records": jsonRecord};
	//	alert(JSON.stringify(jsonObject));

		dwrAvvertenze.getHtml(JSON.stringify(jsonObject),'campoAvvertenze',callBack);

	function callBack(resp){
		for (var i = 0; i < resp.length; i++) {
			$('table#oTable tr:eq('+(i)+')').find('td:eq(0)').html(resp[i]);
		}
	}	

}

function controlloLimiteRecord(){
	if(array_id_remoto.length>(document.form.num_rec_per_pag.value-1)){
		alert('Attenzione, è stato raggiunto il limite massimo di pazienti visualizzabili; eseguire una ricerca più selettiva per ottenere un elenco completo');
	}
}

function funzione(){

	try{
		top.home.chiudi_attesa();
	}catch(e){}
	
	try{
		connectDragDropToObjectById();
		// definisco la funzione di callback
		// che DOVRA' accettare in ingresso 2 parametri (nomeCampo, variazioneRelativa
		setCallBackAfterDragDrop("callBackFunctionAfterColResizing");
	}catch(e){}
	
	var happlicativo = document.createElement("input");
	happlicativo.type = 'hidden';
	happlicativo.name = 'applicativo';
	happlicativo.value = 'WHALE';
	document.form.appendChild(happlicativo);
	righe = document.all.oTable.rows;
	
	for(var i=0;i<righe.length;i++){
		righe[i].ondblclick=function(){
			rigaSelezionataDalContextMenu=this.sectionRowIndex;
			var reparto = array_codice_reparto[rigaSelezionataDalContextMenu];
			if(reparto == ''){ reparto=baseGlobal.SITO; }
			//prelevo la funzione js da baseGlobal, configurata su db in CC_CONFIGURA_REPARTO
			var funzione =  window.baseReparti.getValue(reparto,'FUNZIONE_APERTURA_CARTELLA');
			//alert('funzione: '+funzione + '\ncontrollo: '+(funzione!='' && funzione!=null));
			
			//controllo il caso nel quale non ci sia la configurazione su CC_CONFIGURA_REPARTO, per evitare aperture scorrette della cartella
			if(funzione!='' && funzione!=null){
				apriSchedaRicovero(eval("'" +funzione+"'" ));
			}else{
				apriSchedaRicovero('apriVuota();');
			}
		};
	}
	if (baseUser.ABILITA_CONTEXT_MENU=='N')
		document.body.onselectstart= function(){return false;};
}

/**
*/
function apri_worklist()
{
	parent.document.location.replace("worklistInizio");//?topSource=SL_RicercaRichieste&dimFrameWk=140,0,*,0");
}

/**
*/
function avanti(numero_pagina)
{
	var doc = document.form;
	doc.action = 'SL_RicPazRicoverati';
	doc.target = 'RicPazWorklistFrame';//'RicPazRecordFrame';
	
	doc.hidOrder.value = "order by cogn, nome, dataorder";
	
	doc.pagina_da_vis.value = numero_pagina;
	getCampiRicerca();
	doc.submit();
}


/**
*/
function indietro(numero_pagina)
{
	var doc = document.form;
	doc.action = 'SL_RicPazRicoverati';
	doc.target = 'RicPazWorklistFrame';//'RicPazRecordFrame';
	
	doc.hidOrder.value = "order by cogn, nome, dataorder";	
	
	doc.pagina_da_vis.value = numero_pagina;
	getCampiRicerca();
	doc.submit();
}


/**
*/
function getCampiRicerca()
{
	document.form.hidWhere.value = parent.RicPazRicercaFrame.document.form_pag_ric.hidWhere.value;	
}


/**
*/
function conta_record_trovati()
{
	var risultato_ricerca = document.all.oTable.rows.length;	
	var parametro1 = parent.RicPazRicercaFrame.document.getElementById("idcampo0").value;
	
	//alert('Risultato Ricerca: ' + risultato_ricerca);

	try{
		if(risultato_ricerca == 0 && parametro1 != '')
		{	
		document.write('<html><head></head><body><table id="ricPazTable" class="classDataTable"><tr><td class="bianco"><div class="classRicVuota">Nessun Paziente trovato con i criteri impostati</div></td></tr></table></body></html>');
		}
	}
	catch(e){
		alert('funzione conta_record_trovati(): ' + e.message);
	}
}

function setRiga(obj){ 
	if(event == null || typeof event.srcElement =='undefined' || event.srcElement.nodeName.toUpperCase()!='DIV')return;
	if(typeof obj =='undefined') obj = event.srcElement;

	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	rigaSelezionataDalContextMenu = obj.sectionRowIndex;
}

function apriSchedaRicovero(pFunzione)
{
	try{
		setRiga();
		
		if(baseUser.MODALITA_ACCESSO=='METAL'){			
		top.NS_CARTELLA_PAZIENTE.apri({
				  index:rigaSelezionataDalContextMenu,
				  iden_evento:array_iden_visita,
		          funzione            : "apriVuota();",
		          ModalitaAccesso     : "METAL",
		          window:window
		      });
		}
		else{
		top.NS_CARTELLA_PAZIENTE.apri({
			index:rigaSelezionataDalContextMenu,
			iden_evento:array_iden_visita,
			funzione:pFunzione,
			window:window
		});
		}
		
	}catch(e){
		alert(e.message);
	}
}
function apriDocumentiPaziente(){
	setRiga();
	var finestra = window.open("header?idPatient="+array_id_remoto[rigaSelezionataDalContextMenu]+"&reparto="+array_reparto_di_ricovero[rigaSelezionataDalContextMenu]+'&nosologico='+array_num_nosologico[rigaSelezionataDalContextMenu],'','fullscreen=yes');
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}
}
function apriWizard(){
	
//	alert (stringa_codici(array_codice_reparto));
	
	if (rigaSelezionataDalContextMenu==-1)
	{
		var iden_anag=stringa_codici(array_iden_anag);
		//var cod_dec_Reparto = stringa_codici(array_reparto_di_ricovero);
		//var idRemoto=stringa_codici(array_id_remoto);
		var reparto=stringa_codici(array_codice_reparto);
		//var ricovero=stringa_codici(array_num_nosologico);
		var iden_visita=stringa_codici(array_iden_visita);
		//var iden_pro=stringa_codici(array_iden_pro);
	}else
	{
		var iden_anag=array_iden_anag[rigaSelezionataDalContextMenu];
		//var cod_dec_Reparto = array_reparto_di_ricovero[rigaSelezionataDalContextMenu];
		//var idRemoto=array_id_remoto[rigaSelezionataDalContextMenu];
		var reparto=array_codice_reparto[rigaSelezionataDalContextMenu];
		//var ricovero=array_num_nosologico[rigaSelezionataDalContextMenu];
		var iden_visita=array_iden_visita[rigaSelezionataDalContextMenu];
		//var iden_pro=array_iden_pro[rigaSelezionataDalContextMenu];
	}	
	
	var finestra='';
	if (baseUser.TIPO == 'M')
	{	
		finestra = window.open('servletGenerator?KEY_LEGAME=WIZARD_RICOVERO&iden_visita='+iden_visita+'&PAGINA=1&iden_anag='+iden_anag+'&CODICE_REPARTO='+reparto,"","status=yes fullscreen=yes scrollbars=yes");
	}
	else
	{
		finestra = window.open('servletGenerator?KEY_LEGAME=WIZARD_RICOVERO&iden_visita='+stringa_codici(array_iden_visita)+'&PAGINA=1&iden_anag='+stringa_codici(array_iden_anag)+'&CODICE_REPARTO='+stringa_codici(array_codice_reparto),"","status=yes fullscreen=yes scrollbars=yes");
	}
	
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}	
}

/**
Funzione richiamata dal metodo per l'allargamento delle colonne
*/
function aggiorna(){	
parent.setVeloNero('oIFWk');
	
	var doc = document.frmAggiorna;
	
	doc.action = 'SL_RicPazRicoverati';
	//doc.target = 'RicPazWorklistFrame';
//	doc.method = 'POST';

	doc.tipo_wk.value = document.form.tipo_wk.value;
	doc.nome_vista.value = document.form.nome_vista.value;	
	doc.provenienza.value = document.form.provenienza.value;
	doc.hidWhere.value = document.form.hidWhere.value;
	doc.hidOrder.value = document.form.hidOrder.value;	
	
	doc.submit();
}

function visualizza_referto()
{
	var id_remoto = null;	
	id_remoto = stringa_codici(array_id_remoto);		
	var finestra = window.open("header?idPatient="+id_remoto,'','fullscreen=yes');
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}	
}
function setInvisibile(){
	
	if(!confirm('Procedendo il paziente non risulterï¿½ piï¿½ visibile, continuare?'))return;
	
	param = "2@UPDATE radsql.NOSOLOGICI_PAZIENTE SET VISUALIZZA_IN_WORKLIST = 'N' where iden=" + array_iden_visita[rigaSelezionataDalContextMenu];
		
//	alert(param);
	CJsUpdate.insert_update(param, aggiorna);	
}

function apriAllettamento(tipo,reparto,idenStanza){
  
  var url ="allettamento?tipoVista=";
  
  switch (tipo){
    case 'REPARTO': url += "STANZE&reparto="+reparto+"&idenStanza=";
      break;
    case 'STANZA' :  url += "LETTI&reparto="+reparto+"&idenStanza="+idenStanza;
      break;
    case 'LETTO'  : url += "LETTI&reparto="+reparto+"&idenStanza="+idenStanza;
      break;             
  }
  
  parent.parent.document.location.replace(url);
}

/**
 * Modifiche 04/07/2014 marcoulr
 * 1) Aggiungere il seguente blocco prima della cancellazione di un pre ricovero:
 *      - se esistono richieste in stato I bloccare;
 *      - se esistono richieste di radiologia in stato P o A bloccare (testata_richieste.tipologia_richiesta in ('1', '2')).
 *      NB: Fare attenzione alle prenotazioni dirette: se esiste una prenotazione diretta, questa si puï¿½ annullare 
 *      (testata_richieste.prenotazione_diretta='S' and stato_richiesta='P')
 *      - se esistono richieste di cardiologia in stato A bloccare (questo controllo attualmente potrebbe essere troppo restrittivo, 
 *      in quanto non ï¿½ ancora permessa la cancellazione: quindi svilupparlo ma commentarlo) testata_richieste.tipologia_richiesta = '4'
 * 2) Far comparire il seguente alert: Attenzione: prima di procedere alla cancellazione del Pre ricovero, annullare le richieste in sospeso.
 * @returns {undefined}
 */
function chiudiPrericovero() {
	
 /*   function isRemovable() {
        var rs = WindowHome.executeQuery('worklistRicercaPazienti.xml','getRichieste',stringa_codici(array_iden_visita));
        
        while (rs.next()) {
            if (rs.getString('STATO_RICHIESTA') == 'I') return false;
            if (rs.getString('STATO_RICHIESTA') == 'P' && (rs.getString('TIPOLOGIA_RICHIESTA') == '1' || rs.getString('TIPOLOGIA_RICHIESTA') == '2') && rs.getString('PRENOTAZIONE_DIRETTA') != 'S') return false;
            if (rs.getString('STATO_RICHIESTA') == 'A' && (rs.getString('TIPOLOGIA_RICHIESTA') == '1' || rs.getString('TIPOLOGIA_RICHIESTA') == '2')) return false;
            //if (rs.getString('STATO_RICHIESTA') == 'A' && rs.getString('TIPOLOGIA_RICHIESTA') == '4') return false;
        }
        
        return true;
    }
    


    if (!isRemovable()) return alert('Attenzione: prima di procedere alla cancellazione del Pre ricovero, annullare le richieste in sospeso.');
    else return alert('Rimozione OK');
    */

    window.showModalDialog("servletGenerator?KEY_LEGAME=CHIUDI_RICOVERO&MODALITA=1,2,3" +
                    "&IDEN="+idenVisitaPre+

                    "&SITO=PRE",
                    window,"dialogWidth: 800px; dialogHeight: 300px; scroll: no ; status:no ");
    nsMenu.removeMenu();


}

function modificaPrericovero(){
	
	var url = "servletGenerator?KEY_LEGAME=INSERIMENTO_ACCESSO&IDEN_ANAG="+idenAnagPre+"&IDEN_VISITA="+idenVisitaPre;
	url +="&TIPO=MODIFICA";
	  parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 570,
		'href'		: url,
		'type'		: 'iframe',
		'onClosed' : aggiorna
	});
	  nsMenu.removeMenu();
	
}

function gestPrericovero(){
	 setRiga();
	 idenAnagPre=array_iden_anag[rigaSelezionataDalContextMenu];
	 idenVisitaPre=array_iden_visita[rigaSelezionataDalContextMenu];
	
		nsMenu.createMenu(
			"menuPrericovero",
			event.clientX,
			event.clientY+document.body.scrollTop
		);	
	
}

function visualizzaGermi(){
             
	 				$('#divInfo').remove();
	 				
	 				setRiga();
	 			     var dataPos;
	 			     var dataNeg;
	 			     var esame;
	 				vObjDiv = $("<div id=divInfo style='background:#E6F4FF; width:280px; border:#dddddd 1px solid;font-family:Arial;font-size:12px;'></div>");
	 				
	 				var rs = WindowHome.executeQuery('worklistRicercaRicoverati.xml','getPositivitaGermi',[array_id_remoto[rigaSelezionataDalContextMenu]]);
	 				while(rs.next()){
	 					if (rs.getString('POSITIVITA')=='S' || rs.getString('POSITIVITA_PREGRESSA')=='S'){
	 						if(rs.getString('IDANALISI')=='9902') esame='KPC'; else esame='C. difficile';
	 						if (rs.getString('POSITIVITA')=='S'){
	 							dataPos= rs.getString('DATA_POSITIVITA'); 
	 							dataNeg='';
	 						}
	 						else{
	 							dataPos= rs.getString('DATA_P_PREGRESSA');   
	 							dataNeg= rs.getString('DATA_POSITIVITA'); 
	 						}
	 						
	 					/*	alert(esame);
	 						alert(dataPos);
	 						alert(dataNeg);*/
	 						vObjHeader = $("<div id=divHeader style='background:#B1DDFC;height: 15px;margin:5px; text-align:center;'>"+esame+"</div>");
	 						$(vObjDiv).append($(vObjHeader));
	 						vObj = $("<table id=tableInfo style='font-family:Arial;font-size:12px;'></table>");
	 						if(dataNeg!=''){
	 							$(vObj).append(
	 									$('<tr></tr>')
	 									.append($('<td></td>').text('Rilevata negatività il:'))
	 									.append($('<td></td>').text(dataNeg))
	 							)}	                    
	 						$(vObj).append(
	 								$('<tr></tr>')
	 								.append($('<td></td>').text('Rilevata positività il:'))
	 								.append($('<td></td>').text(dataPos))
	 						)
	 						$(vObjDiv).append($(vObj));

	 					}

	 				}
             
                 vObjDiv.css({"position": "absolute","top":event.clientY+document.body.scrollTop+'px',"left":event.clientX+'px'}); 
                 vObjDiv.appendTo('body');
                 
                 $('#divInfo').bind('click',function(){$(this).remove();});

}




/*function apriListaLavoroReparto(){
    NS_FUNZIONI_WK_RICOVERATI.stampaWk('WK_RICOVERATI',true,true);
	var funzione 	= 'WK_RICOVERATI';
	var sf		 	= '';
	var reparto		= '';
	if (array_iden_visita.length<1)
	{
		alert('Attenzione, non ci sono pazienti nella worklist');
		return;
	}
	else
	{
		sf= "{VIEW_WK_RICOVERATI.IDEN_VISITA}  in [" + array_iden_visita + "]";
		top.confStampaReparto(funzione,sf,'S',reparto,null);
	}
}*/

function stampaEtiPaziente(){
	
	var iden_anag 	= stringa_codici(array_iden_anag);
	var anteprima	= '';
	
	if(iden_anag.length < 1){
		alert('Attenzione, Selezionare un Paziente');
		return;
	}

	if(basePC.PRINTERNAME_ETI_CLIENT=='')
		anteprima	= 'S';
	else
		anteprima	= 'N';
	
	if (array_iden_visita.length<1){
		alert('Attenzione, non ci sono pazienti nella worklist');
		return;
	}else{
		var sf	= "{ANAG.IDEN}  in [" + iden_anag + "]";
		top.stampa('ETICHETTA_PAZIENTE',sf,anteprima,basePC.DIRECTORY_REPORT,basePC.PRINTERNAME_ETI_CLIENT);
	}
}

/*function apriListaLavoroRepartoConsegna(tipo){

	if (array_iden_visita.length<1)
	{
		alert('Attenzione, non ci sono pazienti nella worklist');
		return;
	}
	else
	{
		if (tipo=='D')
		{
			NS_FUNZIONI_WK_RICOVERATI.stampaWk('WK_RICOVERATI_CONSEGNA_DIETA',false,true);		
		}	
		else if (tipo=='M')
		{	
			NS_FUNZIONI_WK_RICOVERATI.stampaWk('WK_RICOVERATI_CONSEGNA_MEDICO',true,false);
		}		
		else
		{	
			NS_FUNZIONI_WK_RICOVERATI.stampaWk('WK_RICOVERATI_CONSEGNA',false,true);
		}

	}
}*/

function associaGruppiStudio() {
    var pBinds = new Array();
    setRiga();
 
    
    if(WindowHome.home.checkPrivacy('GRUPPI_STUDIO')){
	    pBinds.push(array_iden_anag[rigaSelezionataDalContextMenu]);
	    var  rs = top.executeQuery("consensi.xml", "getConsensoUnicoStudio", pBinds);
	    if (rs.next()) {
	        if (rs.getString("C1") != 1) {
	        	  alert("ATTENZIONE: Il paziente non ha dato il consenso");
	              return;
	        }
	    }
	    else{
	    	 alert("ATTENZIONE: Paziente non trovato");
	    	 return;
	    }
    }
            parent.config_gruppi = {
                "groupGruppi": "F",
                "idenGruppo": "",
                "action": "addThatMemberToTheseGroups",
                "idenMembro1": top.NS_CACHED_DATA["reparti"][array_codice_reparto[rigaSelezionataDalContextMenu]].IDEN,
                "tabellaMembro1": "CENTRI_DI_COSTO",
                "idenMembro2": array_iden_anag[rigaSelezionataDalContextMenu],
                "tabellaMembro2": "ANAG",
                "tipoGruppoList": "GRUPPO_STUDIO",
                "inner_config": {
                    "idenMembro1": top.NS_CACHED_DATA["reparti"][array_codice_reparto[rigaSelezionataDalContextMenu]].IDEN,
                    "tabellaMembro1": "CENTRI_DI_COSTO",
                    "tabellaMembro2": "GRUPPI",
                    "tipoGruppo": "GRUPPO_STUDIO",
                    "tipoGruppoList": "SPECIALITA"
                }
            };

            var url = 'servletGenerator?KEY_LEGAME=ASSOCIA_GRUPPI';

            parent.$.fancybox({
                'padding': 3,
                'width': 800,
                'height': 1000,
                'href': url,
                'type': 'iframe',
                'onClosed': aggiorna
            });
       
}

function getOmonimi (){
	for (var i = 0; i < array_cogn.length; i++) {
		for (var n = 0; n < array_cogn.length; n++) {		
			if(array_cogn[i]+array_nome[i]==array_cogn[n]+array_nome[n] && i!=n){
				$('table#oTable tr:eq('+(n)+') td:eq(2)').css('background-color','#FFA947');			
			}

		}

	}	
}

var INFOTRASFERIMENTO = {


		open:function(pNosologico){
		setRiga();

			var sql =" SELECT t.descr FROM nosologici_paziente n inner join tab_pro t on (n.iden_pro=t.iden) WHERE n.iden_precedente ='"+array_iden_visita[rigaSelezionataDalContextMenu]+"' AND n.deleted= 'N' ";
			
			dwr.engine.setAsync(false);	
			toolKitDB.getResultData(sql, callBack);
			dwr.engine.setAsync(true);

			function callBack(resp)
			{

					top.Popup.remove();
					
					var vObj = top.$('<table></table>')
								.css("font-size","13px")
								.append(
									top.$('<tr></tr>')
										.append(top.$('<td>Ricoverato in:</td>'))
										.append(top.$('<td></td>').text(resp[0]))									
								);
								
					top.Popup.append({
						obj:vObj,
						title:"TRASFERIMENTO",
						width:330,
						height:150,
						position:[event.clientX+10,event.clientY+150]
					});

			}


		}

	};



var NS_ALLETTAMENTO_RICOVERATO = {

 		init:function(){
 			$('.pulsWkRicoveratiAllettamentoLibero').click(function(){
 				setRiga()
				url = "servletGeneric?class=cartellaclinica.gestioneAllettamento.SrvAllettamento"
 				url += "&cogn="+array_cogn[rigaSelezionataDalContextMenu];
 				url += "&nome="+array_nome[rigaSelezionataDalContextMenu];
 				url += "&data="+array_data_nascita[rigaSelezionataDalContextMenu];
 				url += "&codfisc="+array_codice_fiscale[rigaSelezionataDalContextMenu];
				if (array_cdc_appoggio[rigaSelezionataDalContextMenu]==''){
					url += "&reparto="+array_codice_reparto[rigaSelezionataDalContextMenu];				
					url += "&repdegenza="+array_codice_reparto[rigaSelezionataDalContextMenu];
				}					
				else{
					url += "&reparto="+array_cdc_appoggio[rigaSelezionataDalContextMenu];				
					url += "&repdegenza="+array_cdc_appoggio[rigaSelezionataDalContextMenu];
				}					
 				url += "&apriDaWk=servletGenerator('"+parent._KEY_PAGINA+"')";		
 				WindowHome.apri(url)
 			});

		}
};

var NS_FUNZIONI_WK_RICOVERATI = {
    
    arrayIden:'',
    sf:{
        WK_RICOVERATI                   : '{VIEW_WK_RICOVERATI.IDEN_VISITA}  in ',
        WK_RICOVERATI_CONSEGNA_DIETA    : '{VIEW_LETTI_REPARTO_REP_DIETA.IDEN_VISITA}  in ',
        WK_RICOVERATI_CONSEGNA_MEDICO   : '{NOSOLOGICI_PAZIENTE.IDEN}  in ',
        WK_RICOVERATI_CONSEGNA          : '{VIEW_ULTIMO_DIARIO_INF.IDEN_VISITA}  in ',
        WK_RICOVERATI_LETTO          	: '',
        getSelectionFormula             : function(funzioneAttiva,array){
        	var retsf = '';
        	if (funzioneAttiva==='WK_RICOVERATI_LETTO'){
        		/*L'array non Ã¨ utile per questa tipologia di stampa*/
        		paramRet = NS_FUNZIONI_WK_RICOVERATI.retrieveCdcFiltriUtente()
        		if (paramRet.valore =='KO'){
        			retsf = '';
        			alert('Funzionalita\' non disponibile')
        		}else{
            		retsf 	= '&prompt<pStringListCodCdc>='+paramRet.valore;        			
        		}
        		
  		
        	}else{
        		retsf = NS_FUNZIONI_WK_RICOVERATI.sf[funzioneAttiva] + '[' + array + ']';
        	}
            return retsf;
        }
	},
	
    stampaWk:function(pFunzioneAttiva,pGiuridico,pUbicato){
        if (NS_FUNZIONI_WK_RICOVERATI.getRicoveratiArrayStampa(pGiuridico,pUbicato).length==0)
            return alert('Attenzione, non esistono elementi per produrre la stampa selezionata')
        var sf = NS_FUNZIONI_WK_RICOVERATI.sf.getSelectionFormula(pFunzioneAttiva,NS_FUNZIONI_WK_RICOVERATI.getRicoveratiArrayStampa(pGiuridico,pUbicato));
        if (sf == '')
        	{return;}
        else{
            top.confStampaReparto(pFunzioneAttiva,sf,'S','',null);        	
        }
    },
    
    getRicoveratiArrayStampa:function(giuridico,ubicato){
        var codTipoRicoveroToDelete     = ['PRE-DH', 'PRE', 'PRE-DS'];
        /*
         * array_iden_visita
         * array_cdc_appoggio
         * array_codice_reparto
         * array_dimesso
         * array_cod_tipo_ricovero

         **/
		var repartiSelezionatiTemp = parent.$('#hRepartiElenco').val().replace(/ /gi,'');
        var repartiSelezionati = repartiSelezionatiTemp.replace(/'/gi,'').split(',');
        var array_iden_visita_filtrati = $.grep(array_iden_visita, function(value, i) {
            var test;
            //alert(array_dimesso[i]+'\n'+$.inArray(array_cod_tipo_ricovero[i],codTipoRicoveroToDelete));
            //alert(array_cdc_appoggio[i]+'\n'+$.inArray(array_codice_reparto[i],repartiSelezionati)+'\n'+$.inArray(array_cdc_appoggio[i],repartiSelezionati));        
            if (array_dimesso[i]=='N' && $.inArray(array_cod_tipo_ricovero[i],codTipoRicoveroToDelete)<0){
/*				if (top.baseUser.LOGIN='lino'){
					
					alert('giuridico: '+array_codice_reparto[i]+'\n'+repartiSelezionati+'\n'+$.inArray(array_codice_reparto[i],repartiSelezionati)+'\n'+
					'ubicato: '+array_cdc_appoggio[i]+'\n'+repartiSelezionati+'\n'+$.inArray(array_cdc_appoggio[i],repartiSelezionati));					
					}*/
                if (
                        array_cdc_appoggio[i]=='' || 
                        (giuridico && $.inArray(array_codice_reparto[i],repartiSelezionati)>-1)||
                        (ubicato && $.inArray(array_cdc_appoggio[i],repartiSelezionati)>-1)
                    )
                {
                    test=true;
                }
            }
            else{
                test=false;
            }
            return test;
        });
        return array_iden_visita_filtrati;
    },
    
    retrieveCdcFiltriUtente:function(){
    	var rs = WindowHome.executeQuery('worklistRicercaRicoverati.xml','getFiltriRepartiUtenti',[WindowHome.baseUser.LOGIN]);
    	param ={
    		valore		: '',
    		messaggio 	: ''
    	};
    	while (rs.next()){
    		var listaCodCdc = rs.getString('VALORE');
//    		if ($.inArray('RRF_PL',listaCodCdc.split(','))>-1){
    			param.valore = listaCodCdc;
//    			param.valore = 'KO';
    			param.messaggio = 'Errore';
//    		}
    		return param;
    	}
    }
    
};

function stampaListaConsegnaCCE(){
    var arrayTipoRicoveroText = new Array('ODS','DS','ORD');
    var arrayTipoRicoveroVal = new Array('VPO_RIC_ODS','VPO_RIC_DS','VPO_RIC_ORD');
    /*var arrayDescrReparti = new Array();*/
    var paramReturn = getDaDataADataDiarioRicovero(
        WindowHome.clsDate.getData(WindowHome.clsDate.dateAdd(new Date(),'D','1'), 'DD/MM/YYYY'),
        WindowHome.clsDate.getData(WindowHome.clsDate.dateAdd(new Date(),'D','1'), 'DD/MM/YYYY'),
        arrayTipoRicoveroText,
        arrayTipoRicoveroVal
    );
    if (typeof paramReturn!='undefined'){   
        var sf = '&prompt<pDataIni>='+ paramReturn.dataIni+
                 '&prompt<pDataFine>='+ paramReturn.dataFine+
                 '&prompt<pTipoRicovero>='+paramReturn.tiporicovero;
        var pFunzioneAttiva = 'WK_RICOVERATI_CONSEGNA_CCE';
        WindowHome.confStampaReparto(pFunzioneAttiva,sf,'S','',null);
    }
}


function stampaListaRiepilogoPreOperatorio(){
/*    var arrayTipoFiltroText = new Array('VISITA ANESTESIOLOGICA','E.C.G.','RX TORACE','NOTE','RICOVERI','ECOCARDIO','DATI LABORATORIO');
    var arrayTipoFiltroVal = new Array('VIS_ANE','ECG','RX_TOR','NOTE','RIC','ECO_CAR','DATI_LAB');*/

    var arrayTipoFiltroText = new Array();
    var arrayTipoFiltroVal = new Array();

    var vRs = WindowHome.executeQuery('OE_Refertazione_Visita_Anestesiologica.xml','caricaCodiceVpo');
    while(vRs.next()){
        arrayTipoFiltroText.push(vRs.getString('descr'));
        arrayTipoFiltroVal.push(vRs.getString('cod_esa'));
    }
    
    var txtDefault = arrayTipoFiltroVal.join(",");
    
    var paramReturn = getDaDataADataFiltro(
        WindowHome.clsDate.getData(WindowHome.clsDate.dateAdd(new Date(),'D','1'), 'DD/MM/YYYY'),
        arrayTipoFiltroText,
        arrayTipoFiltroVal
    );
    if (typeof paramReturn!='undefined'){
        var sf = '&prompt<pDataIni>='+ paramReturn.dataIni;
        if (paramReturn.tipofiltro.length==0)
            sf += '&prompt<pTipologia>='+txtDefault;
        else
            sf += '&prompt<pTipologia>='+ paramReturn.tipofiltro;     
        var pFunzioneAttiva = 'WK_PREOPERATORIO_RIEPILOGATIVO';
        WindowHome.confStampaReparto(pFunzioneAttiva,sf,'S','',null);
    }
}


function stampaProgrammaRiabilitativo(tipo){
	var url;
	var pdfResult;
	url = getUrl();
	var cont=0;

	if(tipo=='SEL'){
		var iden_accesso = stringa_codici(array_iden_visita);
		var cod_rep = stringa_codici(array_codice_reparto);	
		if(cod_rep!='RRF_PL'){
		 return alert('Paziente non ricoverato in RRF Pietra Ligure');	
		}
		var rs = WindowHome.executeQuery('worklistRicercaRicoverati.xml','getIdenProgrammaRiabilitativoSel',[iden_accesso]);	
	}
	else{
		var rs = WindowHome.executeQuery('worklistRicercaRicoverati.xml','getIdenProgrammaRiabilitativo',null);
	}
	while(rs.next()){
		cont+=1;
		pdf=url+'ServletStampe?report=ASL2/PROGRAMMA_RIABILITATIVO/PROGR_RIAB.RPT&prompt<pIden>='+rs.getString('IDEN_MAX');
		initMainObject(pdf);
	}
	if (cont==0){
		return alert('Nessun programma lavoro corsia disponibile');
	}
	parent.parent.iframe_main.document.getElementById('lblAggiorna').click();
}

