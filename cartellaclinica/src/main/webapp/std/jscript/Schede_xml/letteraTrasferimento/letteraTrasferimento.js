$(document).ready(function()
{
	window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti 	= WindowCartella.baseReparti;
    window.baseGlobal 	= WindowCartella.baseGlobal;
    window.basePC 		= WindowCartella.basePC;
    window.baseUser 	= WindowCartella.baseUser;  
	
	try{
		WindowCartella.utilMostraBoxAttesa(false);
	}catch(e)
	{/*catch nel caso non venga aperta dalla cartella*/}
	
	 window.WindowCartella = window;
	    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
	        window.WindowCartella = window.WindowCartella.parent;
	    }
	    
	LETTERA_TRASFERIMENTO.init();
	LETTERA_TRASFERIMENTO.setEvents();
	
	var maxLength = 4000;
	var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
	$('#txtMotivo,#txtDiagnosi,#txtDiagnosiPrimoRic').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
		maxlength(this, maxLength, msg);
	});
	
	$("textarea[class*=expand]").TextAreaExpander();
});

var LETTERA_TRASFERIMENTO ={
		
		idenVisita : '',
		numNosologico:'',
		funzione:'',
		reparto:'',
		idenLettera:'',
		idenLetteraPrecedente:'',
		statoLetteraPrecedente:'',
		firma:'',
		tabella:'',
		
		init:function(){
			LETTERA_TRASFERIMENTO.idenVisita 	= document.EXTERN.IDEN_VISITA.value;
			LETTERA_TRASFERIMENTO.numNosologico = document.EXTERN.ricovero.value;
			LETTERA_TRASFERIMENTO.funzione	 	= document.EXTERN.funzione.value;
			LETTERA_TRASFERIMENTO.reparto		= document.EXTERN.reparto.value; 
			LETTERA_TRASFERIMENTO.tabella		= 'CC_LETTERA_VERSIONI';
			LETTERA_TRASFERIMENTO.caricaDati();
			//se la lettera non è mai stata salvata mi carico i dati con le query altrimenti sono già stati caricati dall'xml 
			if($("#txtMotivo").val()==''){
			LETTERA_TRASFERIMENTO.creaTabellaEsami();
			LETTERA_TRASFERIMENTO.creaTabellaTerapie();
			document.dati.txtDataTrasf.value = WindowCartella.clsDate.getData(new Date(),'DD/MM/YYYY');
			document.dati.txtOraTrasf.value = WindowCartella.clsDate.getOra(new Date());
			}
			NS_LETTERA_CONSENSO.init();
			try {
				var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
				oDateMask.attach(document.dati.txtDataTrasf);
				document.dati.txtDataTrasf.value = getData(new Date(),'DD/MM/YYYY');
			}catch(e){ /*alert(e.description);*/ }

			switch(baseUser.TIPO){
			case 'I':
				$("#lblRegistra").parent().parent().hide();
				$("#lblFirma").parent().parent().hide();
				break;
			default:	
			}

			$("#txtDataRicovero").attr('disabled', 'disabled');
			$("#txtRepartoPrimoRic").attr('disabled', 'disabled');

			$("#lblRepartoDest").parent().css('background','#00d235');
			$("#lblDataTrasf").parent().css('background','#00d235');
			$("#lblMotivo").parent().css('background','#00d235');
			

			$('body').css('overflow', 'hidden');
			$('#groupLettera').height(document.body.offsetHeight - $('#groupLettera').position().top - 30).css('overflow-y','scroll');
				
			if(WindowCartella.ModalitaCartella.isReadonly(document)){
				$("#lblRegistra").parent().parent().hide();
				$("#lblFirma").parent().parent().hide();
				$("#lblStampa").parent().parent().hide();
			}
		},

		setEvents: function() {

			$("#txtOraTrasf").blur(function(){ oraControl_onblur(document.getElementById('txtOraTrasf')); });
			$("#txtOraTrasf").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraTrasf')); });
			if (LETTERA_TRASFERIMENTO.statoLetteraPrecedente=='F'){
				$('#lblRegistra').parent().hide();
			}
			if (!NS_LETTERA_CONSENSO.consensoAttivo){
				$('#lblRegistraConsenso').parent().hide();
			}
		},

		caricaDati: function(){

			var pBinds = new Array();
			pBinds.push(LETTERA_TRASFERIMENTO.idenVisita);
			WindowCartella.dwr.engine.setAsync(false);
			WindowCartella.dwrUtility.executeStatement("letteraTrasferimento.xml","caricaDati",pBinds,13,callBack);
			WindowCartella.dwr.engine.setAsync(true);


			function callBack(resp)
			{
				if(resp[0]=='KO')
				{
					alert(resp[1]);
				}
				else
				{
					$("#txtDataTrasf").val(LETTERA_TRASFERIMENTO.checkNull(resp[2]));
					$("#txtOraTrasf").val(LETTERA_TRASFERIMENTO.checkNull(resp[3]));
					$("#txtRepartoDest").val(LETTERA_TRASFERIMENTO.checkNull(resp[4]));
					$("#hRepartoDest").val(LETTERA_TRASFERIMENTO.checkNull(resp[5]));
					$("#txtMotivo").val(LETTERA_TRASFERIMENTO.checkNull(resp[6]));
					$("#txtDiagnosi").val(LETTERA_TRASFERIMENTO.checkNull(resp[7]));
					$("#txtDiagnosiPrimoRic").val(LETTERA_TRASFERIMENTO.checkNull(resp[8]));
					LETTERA_TRASFERIMENTO.updateIdenStato(resp[9],resp[10]);

					//se è salvato l'html della tabella (vecchia gestione)
					if(LETTERA_TRASFERIMENTO.checkNull(resp[11])!=''){
						$("#divEsami").html(resp[11]);
					}
					//se sono salvati gli iden degli esami (nuova gestione)
					else if (LETTERA_TRASFERIMENTO.checkNull(resp[13])!=''){
						LETTERA_TRASFERIMENTO.creaTabellaEsami(resp[13]);
					}
					//se è salvato l'html della tabella (vecchia gestione)
					if(LETTERA_TRASFERIMENTO.checkNull(resp[12])!=''){
						$("#divTerapie").html(resp[12]);
					}
					//se sono salvati gli iden delle terapie (nuova gestione)
					else if (LETTERA_TRASFERIMENTO.checkNull(resp[14])!=''){
						LETTERA_TRASFERIMENTO.creaTabellaTerapie(resp[14]);
					}
					
				}

			}
			
			pBinds = new Array();
			pBinds.push(LETTERA_TRASFERIMENTO.numNosologico);
			var rs = WindowCartella.executeQuery("letteraTrasferimento.xml","getDatiRicovero",pBinds);
			if(rs.next()){
				$("#txtDataRicovero").val(rs.getString("DATA_RICOVERO"));
				$("#txtRepartoPrimoRic").val(rs.getString("REPARTO"));
			}

		},

		checkNull: function(input){
			var output;	  
			if(input==null){ output='';}		 
			else 	{output=input;} 
			return output;  
		},

		creaTabellaEsami: function(inEsami){

			var pBinds = new Array();
			var vIdenEsami='';
			var vStatement;

			pBinds.push(LETTERA_TRASFERIMENTO.idenVisita);
			
			if(typeof inEsami!='undefined'){
				pBinds.push(inEsami);
				vStatement='getDatiEsamiIden';				
				}
			else
				{
				vStatement='getDatiEsami';
				}

			var rs = WindowCartella.executeQuery("letteraTrasferimento.xml",vStatement,pBinds);
			var tbl = $('<table>').attr('id', 'tabellaEsami').attr('class','classTable').attr('width','100%');

			tbl.append(
					$('<tr>')
					.append($('<th>').text("DATA ORA").attr('width','10%'),
							$('<th>').text("STATO").attr('width','10%'),
							$('<th>').text("DESTINATARIO").attr('width','30%'),
							$('<th>').text("DESCRIZIONE ESAME").attr('width','40%'),
							$('<th>').text("TIPOLOGIA").attr('width','10%'))
			);
			
			while(rs.next()){
					tbl.append(
							$('<tr>')
							.append($('<td ALIGN="center">').text(rs.getString("DATA_ORA")),
									$('<td ALIGN="center">').text(rs.getString("STATO")),
									$('<td ALIGN="center">').text(rs.getString("DESTINATARIO")),
									$('<td ALIGN="center">').text(rs.getString("DESCR_ESAME")),
									$('<td ALIGN="center">').text(rs.getString("TIPOLOGIA")))
					);
					
				if(vIdenEsami==''){
					vIdenEsami=rs.getString("IDEN_DETTAGLIO");
				}
				else{
					vIdenEsami+=','+rs.getString("IDEN_DETTAGLIO");
					}
				}
			$('#divEsami').append(tbl);
			$('#hIdenEsami').val(vIdenEsami);
		},

		creaTabellaTerapie: function(inTerapie){
		
			var pBinds = new Array();
			var vIdenTerapie='';
			var vStatement;
			
			pBinds.push(LETTERA_TRASFERIMENTO.idenVisita);
			if(typeof inTerapie !='undefined'){
				pBinds.push(inTerapie);
				vStatement='getDatiTerapieIden';
				}
			else
				{
				vStatement='getDatiTerapie';
				}
			
			var rs = WindowCartella.executeQuery("letteraTrasferimento.xml",vStatement,pBinds);
			var tbl = $('<table>').attr('id', 'tabellaTerapie').attr('class','classTable').attr('width','100%');

			tbl.append(
					$('<tr>')
					.append($('<th>').text("FARMACI"),
							$('<th>').text("POSOLOGIA"),
							$('<th>').text("DURATA RESIDUA"))
			);
			
			while(rs.next()){
				tbl.append(
						$('<tr>')
						.append($('<td ALIGN="center">').text(rs.getString("FARMACI")),
								$('<td ALIGN="center">').text(rs.getString("POSOLOGIA")),
								$('<td ALIGN="center">').text(rs.getString("DURATA_RESIDUA")))
				);
				if(vIdenTerapie==''){
					vIdenTerapie=rs.getString("IDEN_TERAPIA");
				}
				else{
					vIdenTerapie+=','+rs.getString("IDEN_TERAPIA");
					}
				}
			$('#divTerapie').append(tbl);
			$('#hIdenTerapie').val(vIdenTerapie);
		},

		registraFirmaLetteraTrasf : function(){
			LETTERA_TRASFERIMENTO.firma='S';
            /*var consenso = checkConsensoDocumento(LETTERA_TRASFERIMENTO.idenVisita,LETTERA_TRASFERIMENTO.funzione);
            if (firma=='S' && !consenso){
                registraConsensoDocumento();        
            }else{*/
                LETTERA_TRASFERIMENTO.registraLetteraTrasferimento();
            //}
		},

		registraLetteraTrasferimento : function() {
			if($('#txtRepartoDest').val()==''){
				alert('Inserire il reparto di destinazione');
				return;
			}
			if($('#txtDataTrasf').val()==''){
				alert('Inserire la data di trasferimento');
				return;
			}
			if($('#txtMotivo').val()==''){
				alert('Inserire il motivo del trasferimento');
				return;
			}
			
			if (NS_LETTERA_CONSENSO.consensoAttivo){
				 var respCheck=NS_LETTERA_CONSENSO.checkConsenso();
					if (respCheck!=''){
						return alert(respCheck);
					}else{	
					var retFromSave = NS_LETTERA_CONSENSO.saveConsenso();
					if (!retFromSave.esito){
						return alert(retFromSave.motivo)
					}
				}
			}
			
			
		//	$('#hEsami').val($('#divEsami').html());
		//	$('#hTerapie').val($('#divTerapie').html());
			registra();
		},

		regOK : function(){
			var rs = WindowCartella.executeQuery("letteraTrasferimento.xml","retrieveIden",[LETTERA_TRASFERIMENTO.tabella,baseUser.LOGIN]);
			if(rs.next()){
				LETTERA_TRASFERIMENTO.idenLettera = rs.getString("VALORE1");
			}
			if (LETTERA_TRASFERIMENTO.firma=='S')
				LETTERA_TRASFERIMENTO.firmaLetteraTrasf();
			else
				location.reload();
		},
		
		regKO : function(){
			alert('Errore nella registrazione della lettera di trasferimento');	
		},
		
		firmaLetteraTrasf: function(){
			//alert('IDENLETTERA: '+LETTERA_TRASFERIMENTO.idenLettera+'\nIDENLETTERAPREC: '+LETTERA_TRASFERIMENTO.idenLetteraPrecedente);
			//var url = 	"SrvFirmaPdfGenerica?"+
			var classFirma = 'firma.SrvFirmaPdf';
			if (WindowCartella.basePC.ABILITA_FIRMA_DIGITALE=='S'){
				classFirma = 'firma.SrvFirmaPdfMultipla';
			}

			var url = 	"servletGeneric?class="+classFirma+
						"&typeFirma=P7M"+//+LETTERA_TRASFERIMENTO.funzione+
						"&typeProcedure="+LETTERA_TRASFERIMENTO.funzione+						
						"&tabella="+LETTERA_TRASFERIMENTO.tabella+
						"&idenLettera="+LETTERA_TRASFERIMENTO.idenLettera+
						"&idenVersione="+LETTERA_TRASFERIMENTO.idenLettera+
						"&idenVisita="+LETTERA_TRASFERIMENTO.idenVisita+
						"&idenPer="+baseUser.IDEN_PER+
						"&reparto="+LETTERA_TRASFERIMENTO.retrieveConfigurazioneReparto(LETTERA_TRASFERIMENTO.reparto);
			if (LETTERA_TRASFERIMENTO.idenLetteraPrecedente!=null){
				url = url + 
						"&idenLetteraPrecedente="+LETTERA_TRASFERIMENTO.idenLetteraPrecedente+
						"&statoLetteraPrecedente="+LETTERA_TRASFERIMENTO.statoLetteraPrecedente;
				
			}else{
				url = url + 
				"&idenLetteraPrecedente="+
				"&statoLetteraPrecedente=";
			}
			var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
			window.WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
		},
		
		retrieveConfigurazioneReparto: function(reparto){
			var key 	= 'reportFirma';
			var rep = WindowCartella.baseReparti.getValue(reparto,key);
			return rep;
		},
		
		updateIdenStato: function(iden,stato){
				$('[name="EXTERN"]').append('<input type="hidden" name="idenLettera" value="'+iden+'" ></input>');
				$('[name="EXTERN"]').append('<input type="hidden" name="stato" value="'+stato+'" ></input>');
				LETTERA_TRASFERIMENTO.idenLetteraPrecedente = iden;
				LETTERA_TRASFERIMENTO.statoLetteraPrecedente = stato;
		},
		
		stampaLetteraTrasf: function(){
			if (LETTERA_TRASFERIMENTO.statoLetteraPrecedente=='R' ||LETTERA_TRASFERIMENTO.statoLetteraPrecedente==null){
				alert('Impossibile stampare una lettera di trasferimento non firmata digitalmente');
				return;
			}
			var url 	 = "ApriPDFfromDB?AbsolutePath="+WindowCartella.getAbsolutePath()+"&idenVersione="+LETTERA_TRASFERIMENTO.idenLetteraPrecedente;
			var finestra = window.open(url,'','scrollbars=yes,fullscreen=yes');
			window.WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
		},
        
        registraLetteraTrasferimentoConsenso: function(){
            var urlParameters   =  'tabella=RADSQL.NOSOLOGICI_PAZIENTE';
            urlParameters       += '&statement_to_load=loadConsensoEspressoDocumento'; 
            urlParameters       += '&iden='+LETTERA_TRASFERIMENTO.idenVisita;
            urlParameters       += '&tipologia_documento='+LETTERA_TRASFERIMENTO.funzione;
    
            WindowCartella.$.fancybox({
                'padding'	: 3,
                'width'		: 570,
                'height'	: 150,
                'href'		: 'consenso.html?'+urlParameters,
                'type'		: 'iframe',
                'showCloseButton'	: false
            });
        },
        
        checkConsensoDocumento:function(iden,funzione){
            var pStatementFile = 'consensi.xml';
            var pStatementStatement = 'loadConsensoEspressoDocumento';
            var pBinds = new Array();
            pBinds.push(iden);
            pBinds.push(funzione);
            var vResp = WindowCartella.executeStatement(pStatementFile,pStatementStatement,pBinds,3);
            if (vResp[0]=='OK'){
                if (vResp[2]==null)
                    return false;
                else
                    return true;
            }else{
                return false;
            }
        }
};

var NS_LETTERA_CONSENSO = {
		windowConsenso:'',
		consensoAttivo:true,
		init:function(){
			this.consensoAttivo=WindowCartella.CartellaPaziente.checkPrivacy(LETTERA_TRASFERIMENTO.funzione);
			if(this.consensoAttivo)
				{
				var src = "consenso.html?";
				src += "tabella=RADSQL.NOSOLOGICI_PAZIENTE";
				src += "&statement_to_load=loadConsensoEspressoDocumento";
				src += "&iden="+LETTERA_TRASFERIMENTO.idenVisita;
				src += "&tipologia_documento="+LETTERA_TRASFERIMENTO.funzione;
				$('#groupLettera').append('<IFRAME id=idFrameConsenso width=100% height=120px src="' + src + '"></IFRAME>');
									
				var wnd = $('iframe#idFrameConsenso')[0];
				wnd = wnd.contentWindow || wnd.contentDocument;
				this.windowConsenso = wnd;	
				}
		
		},
		
		checkConsenso:function(){
			var msg='';
			//Se è scelta una voce tra oscurato e oscuramento dell'oscuramento,   la scelta di almeno uno dei due checkbox è obbligatoria ai fini del salvataggio
				if((this.windowConsenso.$('input:radio[@name="rdOscuramento"]:checked').val()=='V'||this.windowConsenso.$('input:radio[@name="rdOscuramento"]:checked').val()=='R') && !this.windowConsenso.$('#idVolereCittadino').is(':checked') && !this.windowConsenso.$('#idPerLegge').is(':checked')){
					msg='Prego selezionare almeno una voce tra "Volontà del cittadino" e "per Legge"'; 
				 }
				 else{
					 //Per effettuare il salvataggio o la firma, se l'utente spunta il check 'per legge', la scelta di una voce della combo deve essere obbligatoria
					 if(this.windowConsenso.$('#idPerLegge').is(':checked') && this.windowConsenso.$('#cmbOscuramentoPerLegge').val()==''){
						msg='Prego inserire una motivazione relativa all\'oscuramento "per Legge" '; 
					 }
				 }
			return msg;
		},
		
		saveConsenso:function(){
			return this.windowConsenso.NS_GESTIONE_CONSENSO.save();
		}
		
}