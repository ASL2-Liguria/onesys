var WindowCartella = null;
var convalida=false;

jQuery(document).ready(function(){
	window.WindowCartella = window;
	while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
		window.WindowCartella = window.WindowCartella.parent;
	}

	NS_PROGR_RIAB.init();

	if(typeof(document.EXTERN.DATA_CONVALIDA)=='undefined'){
		var frm = parent.document.getElementById("framePrimario").contentWindow;


		setInterval(
				function() 
				{				  
					if(typeof(frm.onscroll)=='function'){};  
				},2000);
		frm.onscroll = function(){
			parent.$('#divStorico iframe').contents().scrollTop(parent.$('#framePrimario').contents().scrollTop());
		}
	}

});


var NS_PROGR_RIAB = {
		
		oldArea:'',

		init : function(){


			$('input[name="radCV"],input[name="txtTrasferimenti"]').parent().css('width','20%');	    
			$('#lblAlimentazione,#lblIgiene,#lblAbbigliamento,#lblBagno,#lblContUri,#lblContInt,#lblGabinetto').parent().css('width','40%');

			$('#groupStabilita').prepend('<DIV id="divStabilita" class="divIntestazione">Area della stabilità internistica<DIV>'); 
			$('#groupAreaFunzioni').prepend('<DIV id="divFunzioni" class="divIntestazione">Area delle funzioni vitali di base<DIV>');
			$('#groupCutanea').prepend('<DIV class="divIntestazione">Area della integrità cutanea<DIV>');
			$('#groupSensoMotorie').prepend('<DIV class="divIntestazione">Area delle funzioni senso-motorie<DIV>');
			$('#groupAutonomia').prepend('<DIV class="divIntestazione">Area dell\'autonomia nella cura della persona<DIV>');
			$('#groupMobilita').prepend('<DIV class="divIntestazione">Area mobilità e trasferimenti<DIV>');
			$('#groupComRel').prepend('<DIV class="divIntestazione">Area delle competenze comunicativo-relazionali<DIV>');
			$('#groupFunzioniCogn').prepend('<DIV class="divIntestazione">Area delle competenze cognitive-comportamentali<DIV>');
			$('#groupMenomazioni').prepend('<DIV class="divIntestazione">Menomazioni<DIV>');
			$('#groupCapacita').prepend('<DIV class="divIntestazione">Capacità di comunicazione con gli altri<DIV>');
			$('#groupLinguaggio').prepend('<DIV class="divIntestazione">Linguaggio<DIV>');
			$('#groupRiadattamento').prepend('<DIV class="divIntestazione">Area del riadattamento e reinserimento sociale-lavorativo<DIV>');

			if(typeof(document.EXTERN.DATA_CONVALIDA)!='undefined'){
				NS_PROGR_RIAB.setStorico();
			}
			else{
				NS_PROGR_RIAB.setCorrente();
			}
		},


		setCorrente : function(){

			//siamo nel caso in cui ho convalidato una scheda e devo visualizzare nella scheda di valutazione corrente i dati di quella appena convalidata.
			// quindi metto il key_id a 0 perchè al salvataggio deve essere generata una nuova scheda con CONVALIDATO=N
			if(document.EXTERN.DATI_POST_CONVALIDA.value=='S'){
				document.EXTERN.KEY_ID.value='0';
				$('#hSezAreaFunzioni,#hSezAutonomia,#hSezComRel,#hSezCutanea,#hSezFunzioniCogn,#hSezMobilita,#hSezRiadattamento,#hSezSensoMotorie,#hSezStabilita').val('');
			}

			$(window).load(function() {
				var altezzaScale=$('#lblLinkAltreScale').parent().height();
				parent.$('#divStorico iframe').contents().find("#lblLinkAltreScale").each(function(){
					if($(this).parent().height()>altezzaScale){altezzaScale=$(this).parent().height()}
				})
				parent.$('#divStorico iframe').contents().find("#lblLinkAltreScale").each(function(){
					$(this).parent().css('height',altezzaScale+"px");
				})
				$('#lblLinkAltreScale').parent().height(altezzaScale);
			})

			if(baseUser.TIPO!='M' || document.EXTERN.KEY_ID.value==0){
				$("#lblConvalida").parent().parent().hide();
			}

			/*	if (baseUser.TIPO!='M'){
    	  $("#txtObStabilita,#txtObAreaFunz,#txtObCutanea,#txtObAutonomia,#txtObMenomazioni,#txtObMobilita,#txtObCapacita,#txtObLinguaggio,#txtObRiadattamento,#txtObFunCogn").attr('readonly','readonly');
    	}*/

			var maxLength = 4000;
			var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
			jQuery('#txtObRiadattamento,#txtSitatRiadattamento,#txtMetodRiadattamento,#txtOpeRiadattamento,#txtSitatSensoMotorie,#txtObSensoMotorie,#txtMetodSensoMotorie,#txtOpeSensoMotorie,#txtObStabilita,#txtSitAtStabilita,#txtOpeStabilita,#txtMetodStabilita,#txtNoteAbbigliamento,#txtOpeAreaFunz,#txtObAreaFunz,#txtCV,#txtMetodAreaFunz,#txtSitatAreaFunz,#txtMetodAutonomia,#txtOpeAutonomia,#txtSitatAutonomia,#txtObAutonomia,#txtNoteAlimentazione,#txtNoteBagno,#txtNoteContInt,#txtNoteContUri,#txtNoteGabinetto,#txtNoteIgiene,#txtSitatComRel,#txtObComRel,#txtOpeComRel,#txtMetodComRel,#txtMetodCutanea,#txtObCutanea,#txtSitatCutanea,#txtOpeCutanea,#txtObFunCogn,#txtOpeFunCogn,#txtMetodFunCogn,#txtSitatFunCogn,#txtObMobilita,#txtOpeMobilita,#txtMetodMobilita,#txtNoteDeambu,#txtNoteCarrozzina,#txtNoteScale,#txtNoteTrasferimenti,#txtSitatMobilita').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
				maxlength(this, maxLength, msg);
			});
			jQuery("textarea[class*=expand]").TextAreaExpander();

			$('#divFunzioni').prepend('<DIV class="divPagina">Valutazione corrente del programma riabilitativo<DIV>');
			$(".divIntestazione").css({'background-color':'blue','margin-top':'10px','text-align':'center','color':'white'});	
			$(".divPagina").css({'background-color':'#EBBB38','margin-bottom':'3px','text-align':'center','color':'white','height':'5px','font-size':'15px'});	   

			$('#lblAlimentazione, #lblIgiene, #lblAbbigliamento, #lblBagno, #lblContUri, #lblContInt, #lblGabinetto, #lblTrasferimenti, #lblDeambulazione, #lblScale, #lblCarrozzina,#lblDeambu').addClass('labelClass').parent().append($('<div></div>').addClass('Link'));
			infoBarthel.init();

			NS_PROGR_RIAB.caricaDati();

			NS_PROGR_RIAB.controllaDifferenze();  

		    oldArea='';
			var oldDescr='';

			if(typeof(document.EXTERN.READONLY)!='undefined' && document.EXTERN.READONLY.value=='true'){
				$(".divIntestazione").css({'background-color':'gray','margin-top':'10px','text-align':'center','color':'white'});
				$(".divPagina").css({'background-color':'#EBBB38','margin-bottom':'3px','text-align':'center','color':'white','height':'5px','font-size':'15px'});
				$("#lblRegistra,#lblConvalida,#lblRegistraFunzioni,#lblRegistraComRel,#lblRegistraCutanea,#lblRegistraFunzioniCogn,#lblRegistraMobilita,#lblRegistraRiadattamento,#lblRegistraSensoMotorie,#lblRegistraStab,#lblBarthel,#lblRegistraAutonomia").parent().parent().hide();
				return;
			}

			$('TEXTAREA').focus(function(e) {

				if(oldArea=='groupAreaFunzioni') {oldDescr='Funzioni vitali di base'}
				else if(oldArea=='groupStabilita') {oldDescr='Stabilità internistica'}
				else if(oldArea=='groupCutanea') {oldDescr='Integrità cutanea'}
				else if(oldArea=='groupSensoMotorie') {oldDescr='Funzioni senso-motorie'}
				else if(oldArea=='groupMobilita') {oldDescr='Mobilità e trasferimenti'}
				else if(oldArea=='groupComRel') {oldDescr='Competenze comunicativo-relazionali'}
				else if(oldArea=='groupFunzioniCogn') {oldDescr='Competenze cognitive-comportamentali'}
				else if(oldArea=='groupAutonomia') {oldDescr='Autonomia nella cura della persona'}
				else if(oldArea=='groupRiadattamento') {oldDescr='Riadattamento e reinserimento sociale-lavorativo'}

				newArea=$(this).parent().parent().parent().parent().parent().attr('id');
				$('#hSezSalvata').val(newArea);

				if(!parent.gestBloccoAree.lock(newArea)){
					$(this).blur();
					return;
				}

				if(oldArea!='' && oldArea!=newArea){
					if (confirm('Attenzione, si desiderano salvare le modifiche all\'area \"'+oldDescr+'\"? Premendo \"Ok\" verranno memorizzate le modifiche, premendo \"Annulla\" andranno perse.')){
						$('#hSezSalvata').val(oldArea);
						NS_PROGR_RIAB.registraSezione(oldArea.substring(5,oldArea.length));
					}
					else{
						NS_PROGR_RIAB.ricaricaArea(oldArea);
						NS_PROGR_RIAB.checkModArea(newArea);
						oldArea=$(this).parent().parent().parent().parent().parent().attr('id');
						oldCampo=$(this).attr('id');							
					}
				}
				else{
					//al primo focus su una delle sezioni
					if(oldArea==''){
						NS_PROGR_RIAB.checkModArea(newArea);
					}					
					oldArea=$(this).parent().parent().parent().parent().parent().attr('id');
					oldCampo=$(this).attr('id');
				}

			});

		},

		controllaDifferenze : function(){

			if (parent.$('#divStorico iframe:first-child').length){
				$("TEXTAREA,INPUT[type='text']").each(function(){
					if($("#"+$(this).attr('id')).val()!=parent.$('#divStorico iframe:first-child').contents().find("#"+$(this).attr('id')).val()){
						$("#"+$(this).attr('id')).css('background-color','#FF9966');
					}
				});

				$("INPUT[type='radio']:checked").each(function(){
					if($(this).val()!=parent.$('#divStorico iframe:first-child').contents().find("INPUT[type='radio'][name='"+$(this).attr('name')+"']:checked").val()){
						$("INPUT[type='radio'][name='"+$(this).attr('name')+"']").parent().css('background-color','#FC6063');
					}
				});
			}

		},

		setStorico : function(){
			var maxLength = 4000;
			var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
			jQuery('#txtObRiadattamento,#txtSitatRiadattamento,#txtMetodRiadattamento,#txtOpeRiadattamento,#txtSitatSensoMotorie,#txtObSensoMotorie,#txtMetodSensoMotorie,#txtOpeSensoMotorie,#txtObStabilita,#txtSitAtStabilita,#txtOpeStabilita,#txtMetodStabilita,#txtNoteAbbigliamento,#txtOpeAreaFunz,#txtObAreaFunz,#txtCV,#txtMetodAreaFunz,#txtSitatAreaFunz,#txtMetodAutonomia,#txtOpeAutonomia,#txtSitatAutonomia,#txtObAutonomia,#txtNoteAlimentazione,#txtNoteBagno,#txtNoteContInt,#txtNoteContUri,#txtNoteGabinetto,#txtNoteIgiene,#txtSitatComRel,#txtObComRel,#txtOpeComRel,#txtMetodComRel,#txtMetodCutanea,#txtObCutanea,#txtSitatCutanea,#txtOpeCutanea,#txtObFunCogn,#txtOpeFunCogn,#txtMetodFunCogn,#txtSitatFunCogn,#txtObMobilita,#txtOpeMobilita,#txtMetodMobilita,#txtNoteDeambu,#txtNoteCarrozzina,#txtNoteScale,#txtNoteTrasferimenti,#txtSitatMobilita').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
				maxlength(this, maxLength, msg);
			});
			//    jQuery("textarea[class*=expand]").TextAreaExpander();

			$('#divFunzioni').prepend('<DIV class="divPagina">Riunione di programma in data '+document.EXTERN.DATA_CONVALIDA.value+'<DIV>'); 
			$(".divIntestazione").css({'background-color':'gray','margin-top':'10px','text-align':'center','color':'white'});
			$(".divPagina").css({'background-color':'#EBBB38','margin-bottom':'3px','text-align':'center','color':'white','height':'5px','font-size':'15px'});
			$("#lblRegistra,#lblConvalida,#lblRegistraFunzioni,#lblRegistraComRel,#lblRegistraCutanea,#lblRegistraFunzioniCogn,#lblRegistraMobilita,#lblRegistraRiadattamento,#lblRegistraSensoMotorie,#lblRegistraStab,#lblBarthel,#lblRegistraAutonomia").parent().parent().hide();

		},


		caricaDati : function(){
			NS_PROGR_RIAB.caricaPresidi();
			NS_PROGR_RIAB.caricaDatiBarthel();    	
		},


		caricaPresidi : function(){
			var rs = WindowCartella.executeQuery('programmaRiabilitativo.xml', 'caricaPresidiMedicazioni',[document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value]);
			if (rs.next()) {
				if(rs.getInt("CV")>0){$('INPUT[name="radCV"][value="SI"]').attr('checked', 'checked');}else{$('INPUT[name="radCV"][value="NO"]').attr('checked', 'checked');}
			}     	
		},
		caricaMedicazioni : function(){
			var rs = WindowCartella.executeQuery('programmaRiabilitativo.xml', 'caricaMedicazioni',[document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value]);
			if (rs.next()) {
				if(rs.getInt("MEDICAZIONI")>0){$('INPUT[name="radMedicazioni"][value="SI"]').attr('checked', 'checked');}else{$('INPUT[name="radMedicazioni"][value="NO"]').attr('checked', 'checked');}
			}     	
		},

		caricaDatiBarthel : function(){
			var rs = WindowCartella.executeQuery('programmaRiabilitativo.xml', 'caricaDatiBarthel',[document.EXTERN.IDEN_VISITA.value]);
			while (rs.next()) {
				$('#txtAlimentazione').val(rs.getString("ALIMENTAZIONE"));
				$('#txtIgiene').val(rs.getString("IGIENE_PERSONALE"));
				$('#txtAbbigliamento').val(rs.getString("ABBIGLIAMENTO"));
				$('#txtBagno').val(rs.getString("BAGNO_DOCCIA"));
				$('#txtContUri').val(rs.getString("CONTINENZA_URINARIA"));
				$('#txtContInt').val(rs.getString("CONTINENZA_INTESTINALE"));
				$('#txtGabinetto').val(rs.getString("USO_GABINETTO"));
				$('#txtTrasferimenti').val(rs.getString("TRASFERIMENTI"));
				$('#txtDeambu').val(rs.getString("DEAMBULAZIONE"));
				$('#txtCarrozzina').val(rs.getString("USO_CARROZZINA"));
				$('#txtScale').val(rs.getString("SCALE"));
			} 
		},

		ricaricaArea : function(pArea){

			if(document.EXTERN.KEY_ID.value!=0){
				var rs = WindowCartella.executeQuery('programmaRiabilitativo.xml', 'ricaricaArea',[document.EXTERN.KEY_ID.value]);
				if (rs.next()) {
					if(pArea=='groupAreaFunzioni'){
						$('#txtSitatAreaFunz').val(rs.getString('txtSitatAreaFunz')); 
						$('#txtMetodAreaFunz').val(rs.getString('txtMetodAreaFunz')); 
						$('#txtObAreaFunz').val(rs.getString('txtObAreaFunz')); 
						$('#txtOpeAreaFunz').val(rs.getString('txtOpeAreaFunz')); 
					}
					else if(pArea=='groupStabilita'){
						$('#txtSitAtStabilita').val(rs.getString('txtSitAtStabilita')); 
						$('#txtMetodStabilita').val(rs.getString('txtMetodStabilita')); 
						$('#txtObStabilita').val(rs.getString('txtObStabilita')); 
						$('#txtOpeStabilita').val(rs.getString('txtOpeStabilita'));        		  
					}
					else if(pArea=='groupCutanea'){
						$('#txtSitatCutanea').val(rs.getString('txtSitatCutanea')); 
						$('#txtMetodCutanea').val(rs.getString('txtMetodCutanea')); 
						$('#txtObCutanea').val(rs.getString('txtObCutanea')); 
						$('#txtOpeCutanea').val(rs.getString('txtOpeCutanea'));              		  
					}
					else if(pArea=='groupSensoMotorie'){
						$('#txtSitatSensoMotorie').val(rs.getString('txtSitatSensoMotorie')); 
						$('#txtMetodSensoMotorie').val(rs.getString('txtMetodSensoMotorie')); 
						$('#txtObSensoMotorie').val(rs.getString('txtObSensoMotorie')); 
						$('#txtOpeSensoMotorie').val(rs.getString('txtOpeSensoMotorie'));              		  
					}
					else if(pArea=='groupMobilita'){
						$('#txtSitatMobilita').val(rs.getString('txtSitatMobilita')); 
						$('#txtMetodMobilita').val(rs.getString('txtMetodMobilita')); 
						$('#txtObMobilita').val(rs.getString('txtObMobilita')); 
						$('#txtOpeMobilita').val(rs.getString('txtOpeMobilita'));        		   
					}
					else if(pArea=='groupComRel'){
						$('#txtSitatComRel').val(rs.getString('txtSitatComRel')); 
						$('#txtMetodComRel').val(rs.getString('txtMetodComRel')); 
						$('#txtObComRel').val(rs.getString('txtObComRel')); 
						$('#txtOpeComRel').val(rs.getString('txtOpeComRel'));        		  
					}
					else if(pArea=='groupFunzioniCogn'){
						$('#txtSitatFunCogn').val(rs.getString('txtSitatFunCogn')); 
						$('#txtMetodFunCogn').val(rs.getString('txtMetodFunCogn')); 
						$('#txtObFunCogn').val(rs.getString('txtObFunCogn')); 
						$('#txtOpeFunCogn').val(rs.getString('txtOpeFunCogn'));        		  
					}
					else if(pArea=='groupAutonomia'){
						$('#txtSitatAutonomia').val(rs.getString('txtSitatAutonomia')); 
						$('#txtMetodAutonomia').val(rs.getString('txtMetodAutonomia')); 
						$('#txtObAutonomia').val(rs.getString('txtObAutonomia')); 
						$('#txtOpeAutonomia').val(rs.getString('txtOpeAutonomia')); 
						$('#txtNoteAbbigliamento').val(rs.getString('txtNoteAbbigliamento')); 
						$('#txtNoteAlimentazione').val(rs.getString('txtNoteAlimentazione')); 
						$('#txtNoteBagno').val(rs.getString('txtNoteBagno')); 
						$('#txtNoteContInt').val(rs.getString('txtNoteContInt')); 
						$('#txtNoteContUri').val(rs.getString('txtNoteContUri')); 
						$('#txtNoteGabinetto').val(rs.getString('txtNoteGabinetto')); 
						$('#txtNoteIgiene').val(rs.getString('txtNoteIgiene')); 
						$('#txtNoteTrasferimenti').val(rs.getString('txtNoteTrasferimenti'));
						$('#txtNoteDeambu').val(rs.getString('txtNoteDeambu'));
						$('#txtNoteCarrozzina').val(rs.getString('txtNoteCarrozzina'));
						$('#txtNoteScale').val(rs.getString('txtNoteScale'));

					}
					else if(pArea=='groupRiadattamento'){
						$('#txtSitatRiadattamento').val(rs.getString('txtSitatRiadattamento')); 
						$('#txtMetodRiadattamento').val(rs.getString('txtMetodRiadattamento')); 
						$('#txtObRiadattamento').val(rs.getString('txtObRiadattamento')); 
						$('#txtOpeRiadattamento').val(rs.getString('txtOpeRiadattamento'));        		  
					}        
				}
			}
			else{
				if(pArea=='groupAreaFunzioni'){
					$('#txtSitatAreaFunz,#txtMetodAreaFunz,#txtObAreaFunz,#txtOpeAreaFunz').val(''); 
				}
				else if(pArea=='groupStabilita'){
					$('#txtSitAtStabilita,#txtMetodStabilita,#txtObStabilita,#txtOpeStabilita').val('');         		  
				}
				else if(pArea=='groupCutanea'){
					$('#txtSitatCutanea,#txtMetodCutanea,#txtObCutanea,#txtOpeCutanea').val('');             		  
				}
				else if(pArea=='groupSensoMotorie'){
					$('#txtSitatSensoMotorie,#txtMetodSensoMotorie,#txtObSensoMotorie,#txtOpeSensoMotorie').val(''); 
				}
				else if(pArea=='groupMobilita'){
					$('#txtSitatMobilita,#txtMetodMobilita,#txtObMobilita,#txtOpeMobilita').val('');     		   
				}
				else if(pArea=='groupComRel'){
					$('#txtSitatComRel,#txtMetodComRel,#txtObComRel,#txtOpeComRel').val(''); 
				}
				else if(pArea=='groupFunzioniCogn'){
					$('#txtSitatFunCogn,#txtMetodFunCogn,#txtObFunCogn,#txtOpeFunCogn').val('');       		  
				}
				else if(pArea=='groupAutonomia'){
					$('#txtSitatAutonomia,#txtMetodAutonomia,#txtObAutonomia,#txtOpeAutonomia,#txtNoteAbbigliamento,#txtNoteAlimentazione,#txtNoteBagno,#txtNoteContInt,#txtNoteContUri,#txtNoteGabinetto,#txtNoteIgiene').val(''); 
				}
				else if(pArea=='groupRiadattamento'){
					$('#txtSitatRiadattamento,#txtMetodRiadattamento,#txtObRiadattamento,#txtOpeRiadattamento').val('');      		  
				}
			}

		},

		checkModArea : function(pArea){
			//verifico se nel frattempo un altro utente ha registrato la scheda
		//	if(document.EXTERN.KEY_ID.value==0){
			 var rs = WindowCartella.executeQuery('programmaRiabilitativo.xml', 'checkRegistrazione',[document.EXTERN.IDEN_VISITA.value]);
			 if (rs.next()) {
				 document.EXTERN.KEY_ID.value=rs.getString('IDEN'); 
			 }
		//	}	
			var rs = WindowCartella.executeQuery('programmaRiabilitativo.xml', 'ricaricaArea',[document.EXTERN.KEY_ID.value]);
			if (rs.next()) {
				if(pArea=='groupAreaFunzioni'){
					if($('#txtSitatAreaFunz').val()!=rs.getString('txtSitatAreaFunz') ||
							$('#txtMetodAreaFunz').val()!=rs.getString('txtMetodAreaFunz') ||
							$('#txtObAreaFunz').val()!=rs.getString('txtObAreaFunz') ||
							$('#txtOpeAreaFunz').val()!=rs.getString('txtOpeAreaFunz')) {
						
						alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');
							
						$('#txtSitatAreaFunz').val(rs.getString('txtSitatAreaFunz')); 
						$('#txtMetodAreaFunz').val(rs.getString('txtMetodAreaFunz')); 
						$('#txtObAreaFunz').val(rs.getString('txtObAreaFunz')); 
						$('#txtOpeAreaFunz').val(rs.getString('txtOpeAreaFunz')); 
					}
				}
				else if(pArea=='groupStabilita'){
					if($('#txtSitAtStabilita').val()!=rs.getString('txtSitAtStabilita') ||
							$('#txtMetodStabilita').val()!=rs.getString('txtMetodStabilita') ||
							$('#txtObStabilita').val()!=rs.getString('txtObStabilita') ||
							$('#txtOpeStabilita').val()!=rs.getString('txtOpeStabilita')) {
						
						alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');

						$('#txtSitAtStabilita').val(rs.getString('txtSitAtStabilita')); 
						$('#txtMetodStabilita').val(rs.getString('txtMetodStabilita')); 
						$('#txtObStabilita').val(rs.getString('txtObStabilita')); 
						$('#txtOpeStabilita').val(rs.getString('txtOpeStabilita'));   
					}
				}
				else if(pArea=='groupCutanea'){

					if($('#txtSitatCutanea').val()!=rs.getString('txtSitatCutanea') ||
							$('#txtMetodCutanea').val()!=rs.getString('txtMetodCutanea') ||
							$('#txtObCutanea').val()!=rs.getString('txtObCutanea') ||
							$('#txtOpeCutanea').val()!=rs.getString('txtOpeCutanea')) {
						
						alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');

						$('#txtSitatCutanea').val(rs.getString('txtSitatCutanea')); 
						$('#txtMetodCutanea').val(rs.getString('txtMetodCutanea')); 
						$('#txtObCutanea').val(rs.getString('txtObCutanea')); 
						$('#txtOpeCutanea').val(rs.getString('txtOpeCutanea'));   
					}
				}
				else if(pArea=='groupSensoMotorie'){

					if($('#txtSitatSensoMotorie').val()!=rs.getString('txtSitatSensoMotorie') ||
							$('#txtMetodSensoMotorie').val()!=rs.getString('txtMetodSensoMotorie') ||
							$('#txtObSensoMotorie').val()!=rs.getString('txtObSensoMotorie') ||
							$('#txtOpeSensoMotorie').val()!=rs.getString('txtOpeSensoMotorie')) {
						
						alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');

						$('#txtSitatSensoMotorie').val(rs.getString('txtSitatSensoMotorie')); 
						$('#txtMetodSensoMotorie').val(rs.getString('txtMetodSensoMotorie')); 
						$('#txtObSensoMotorie').val(rs.getString('txtObSensoMotorie')); 
						$('#txtOpeSensoMotorie').val(rs.getString('txtOpeSensoMotorie'));              		  
					}
				}
					else if(pArea=='groupMobilita'){
						if($('#txtSitatMobilita').val()!=rs.getString('txtSitatMobilita') ||
								$('#txtMetodMobilita').val()!=rs.getString('txtMetodMobilita') ||
								$('#txtObMobilita').val()!=rs.getString('txtObMobilita') ||
								$('#txtOpeMobilita').val()!=rs.getString('txtOpeMobilita')) { 
							
							alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');

							$('#txtSitatMobilita').val(rs.getString('txtSitatMobilita')); 
							$('#txtMetodMobilita').val(rs.getString('txtMetodMobilita')); 
							$('#txtObMobilita').val(rs.getString('txtObMobilita')); 
							$('#txtOpeMobilita').val(rs.getString('txtOpeMobilita'));
						}
					}
					else if(pArea=='groupComRel'){
						if($('#txtSitatComRel').val()!=rs.getString('txtSitatComRel') ||
								$('#txtMetodComRel').val()!=rs.getString('txtMetodComRel') ||
								$('#txtObComRel').val()!=rs.getString('txtObComRel') ||
								$('#txtOpeComRel').val()!=rs.getString('txtOpeComRel')) {  
							
							alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');

							$('#txtSitatComRel').val(rs.getString('txtSitatComRel')); 
							$('#txtMetodComRel').val(rs.getString('txtMetodComRel')); 
							$('#txtObComRel').val(rs.getString('txtObComRel')); 
							$('#txtOpeComRel').val(rs.getString('txtOpeComRel')); 
						}
					}
            		else if(pArea=='groupFunzioniCogn'){
						       if($('#txtSitatFunCogn').val()!=rs.getString('txtSitatFunCogn') ||
								$('#txtMetodFunCogn').val()!=rs.getString('txtMetodFunCogn') ||
								$('#txtObFunCogn').val()!=rs.getString('txtObFunCogn') ||
								$('#txtOpeFunCogn').val()!=rs.getString('txtOpeFunCogn')) {  
							
							alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');

							$('#txtSitatFunCogn').val(rs.getString('txtSitatFunCogn')); 
							$('#txtMetodFunCogn').val(rs.getString('txtMetodFunCogn')); 
							$('#txtObFunCogn').val(rs.getString('txtObFunCogn')); 
							$('#txtOpeFunCogn').val(rs.getString('txtOpeFunCogn'));  
						}
					}
					else if(pArea=='groupAutonomia'){
						if($('#txtSitatAutonomia').val()!=rs.getString('txtSitatAutonomia') ||
								$('#txtMetodAutonomia').val()!=rs.getString('txtMetodAutonomia') ||
								$('#txtObAutonomia').val()!=rs.getString('txtObAutonomia') ||
								$('#txtOpeAutonomia').val()!=rs.getString('txtOpeAutonomia') ||
								$('#txtNoteAbbigliamento').val()!=rs.getString('txtNoteAbbigliamento') ||
								$('#txtNoteAlimentazione').val()!=rs.getString('txtNoteAlimentazione') ||
								$('#txtNoteBagno').val()!=rs.getString('txtNoteBagno') ||
								$('#txtNoteContInt').val()!=rs.getString('txtNoteContInt') ||
								$('#txtNoteContUri').val()!=rs.getString('txtNoteContUri') ||
								$('#txtNoteGabinetto').val()!=rs.getString('txtNoteGabinetto')||
								$('#txtNoteIgiene').val()!=rs.getString('txtNoteIgiene') ||
								$('#txtNoteTrasferimenti').val()!=rs.getString('txtNoteTrasferimenti') ||
								$('#txtNoteDeambu').val()!=rs.getString('txtNoteDeambu')||
								$('#txtNoteCarrozzina').val()!=rs.getString('txtNoteCarrozzina') ||
								$('#txtNoteScale').val()!=rs.getString('txtNoteScale') ||
								$('#txtAlimentazione').val()!=rs.getString('txtAlimentazione') ||
								$('#txtIgiene').val()!=rs.getString('txtIgiene') ||
								$('#txtAbbigliamento').val()!=rs.getString('txtAbbigliamento') ||
								$('#txtBagno').val()!=rs.getString('txtBagno') ||
								$('#txtContUri').val()!=rs.getString('txtContUri') ||
								$('#txtContInt').val()!=rs.getString('txtContInt') ||
								$('#txtGabinetto').val()!=rs.getString('txtGabinetto') ||
								$('#txtTrasferimenti').val()!=rs.getString('txtTrasferimenti') ||
								$('#txtDeambu').val()!=rs.getString('txtDeambu') || 
								$('#txtCarrozzina').val()!=rs.getString('txtCarrozzina') || 
								$('#txtScale').val()!=rs.getString('txtScale') ||
								$('input[name="radCV"]:checked').val()!=rs.getString('radCV'))

						{    
							alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');

							$('#txtSitatAutonomia').val(rs.getString('txtSitatAutonomia')); 
							$('#txtMetodAutonomia').val(rs.getString('txtMetodAutonomia')); 
							$('#txtObAutonomia').val(rs.getString('txtObAutonomia')); 
							$('#txtOpeAutonomia').val(rs.getString('txtOpeAutonomia')); 
							$('#txtNoteAbbigliamento').val(rs.getString('txtNoteAbbigliamento')); 
							$('#txtNoteAlimentazione').val(rs.getString('txtNoteAlimentazione')); 
							$('#txtNoteBagno').val(rs.getString('txtNoteBagno')); 
							$('#txtNoteContInt').val(rs.getString('txtNoteContInt')); 
							$('#txtNoteContUri').val(rs.getString('txtNoteContUri')); 
							$('#txtNoteGabinetto').val(rs.getString('txtNoteGabinetto')); 
							$('#txtNoteIgiene').val(rs.getString('txtNoteIgiene')); 
							$('#txtNoteTrasferimenti').val(rs.getString('txtNoteTrasferimenti'));
							$('#txtNoteDeambu').val(rs.getString('txtNoteDeambu'));
							$('#txtNoteCarrozzina').val(rs.getString('txtNoteCarrozzina'));
							$('#txtNoteScale').val(rs.getString('txtNoteScale'));							
							$('#txtAlimentazione').val(rs.getString('txtAlimentazione'));
							$('#txtIgiene').val(rs.getString('txtIgiene'));
							$('#txtAbbigliamento').val(rs.getString('txtAbbigliamento'));
							$('#txtBagno').val(rs.getString('txtBagno'));
							$('#txtContUri').val(rs.getString('txtContUri'));
							$('#txtContInt').val(rs.getString('txtContInt'));
							$('#txtGabinetto').val(rs.getString('txtGabinetto'));
							$('#txtTrasferimenti').val(rs.getString('txtTrasferimenti'));
							$('#txtDeambu').val(rs.getString('txtDeambu'));
							$('#txtCarrozzina').val(rs.getString('txtCarrozzina'));
							$('#txtScale').val(rs.getString('txtScale'));
							$('input[name="radCV"][value="'+rs.getString('radCV')+'"]').attr('checked',true);
						}

					}
					else if(pArea=='groupRiadattamento'){

						if($('#txtSitatRiadattamento').val()!=rs.getString('txtSitatRiadattamento') ||
								$('#txtMetodRiadattamento').val()!=rs.getString('txtMetodRiadattamento') ||
								$('#txtObRiadattamento').val()!=rs.getString('txtObRiadattamento') ||
								$('#txtOpeRiadattamento').val()!=rs.getString('txtOpeRiadattamento')) {   
							
							alert('La sezione è stata modificata da un altro utente. I dati verranno aggiornati.');

							$('#txtSitatRiadattamento').val(rs.getString('txtSitatRiadattamento')); 
							$('#txtMetodRiadattamento').val(rs.getString('txtMetodRiadattamento')); 
							$('#txtObRiadattamento').val(rs.getString('txtObRiadattamento')); 
							$('#txtOpeRiadattamento').val(rs.getString('txtOpeRiadattamento')); 
						}
					}        
			  }
			},


			convalida : function(){	
				convalida=true;
				
				var rs = WindowCartella.executeQuery('programmaRiabilitativo.xml', 'checkConvalida',[document.EXTERN.KEY_ID.value]);
				 if (rs.next()) {
					 alert('Attenzione, la scheda è già stata convalidata; non sono più possibili registrazioni'); 
					 parent.location.reload();
					 return;
				 }
				
				$('#hSezSalvata').val('');
				if(confirm('La valutazione corrente verrà storicizzata e non sarà più possibile modificarla; le eventuali modifiche effettuate senza registrazione verranno perse, continuare?')){
					registra();		
				}
			}, 	

			registra : function(){	

				registra();		
			}, 	 

			registraSezione : function(pSezione){	
				var arSez=['hSezAreaFunzioni','hSezAutonomia','hSezComRel','hSezCutanea','hSezFunzioniCogn','hSezMobilita','hSezRiadattamento','hSezSensoMotorie','hSezStabilita'];
				var index;
				
				if(oldArea!='' && oldArea!='group'+pSezione) {
					return alert('Attenzione, premere il pulsante \'Registra\' relativo alla sezione che si sta compilando.');
				}
				
				
				if(!parent.gestBloccoAree.lock('group'+pSezione)){
					return;
				}

				
				//verifico se nel frattempo un altro utente ha convalidato la scheda
				if(document.EXTERN.KEY_ID.value!=0){
				 var rs = WindowCartella.executeQuery('programmaRiabilitativo.xml', 'checkConvalida',[document.EXTERN.KEY_ID.value]);
				 if (rs.next()) {
					 alert('Attenzione, la scheda è già stata convalidata; non sono più possibili registrazioni'); 
					 parent.location.reload();
					 return;
				 }
				}	
				
				for	(index = 0; index < arSez.length; index++) {
					if (arSez[index]=='hSez'+pSezione){	
						$('#'+arSez[index]).val($('#'+arSez[index]).val()+'*');
					}
					else{
						$('#'+arSez[index]).val($('#'+arSez[index]).val()+'|');
					}
				}
				document.EXTERN.SITO.value='ALL';
				registra();		
			}, 

			okRegistra : function(){

				if(convalida==true){
					var resp= WindowCartella.executeStatement("programmaRiabilitativo.xml","convalida",[document.EXTERN.KEY_ID.value],0);
					if (resp[0]=="KO"){
						alert(resp[1]);
					}

				}
				parent.location.reload();
			},

			apriScala : function(scala,hIden,val){
				var url = "servletGenerator?KEY_LEGAME="+scala;
				var valHIden=0;
				if (typeof(val)=='undefined'){
					if ($('#'+hIden).val()!=''){valHIden=$('#'+hIden).val()}
				}
				else{
					valHIden=val;
				}
				url += "&KEY_ID="+valHIden+"&IDEN_VISITA="+document.EXTERN.IDEN_VISITA.value+"&FUNZIONE="+scala;
				url += "&BISOGNO=S&READONLY=true&SITO=BCK";  
				parent.parent.$.fancybox({
					'padding': 3,
					'width': 1024,
					'height': 580,
					'href': url,
					'type': 'iframe'
				});
			},

			apriBarthel : function(){
				var url = "servletGenerator?KEY_LEGAME=SCALA_BARTHEL";
				url += "&IDEN_VISITA="+document.EXTERN.IDEN_VISITA.value+"&IDEN_VISITA_REGISTRAZIONE="+WindowCartella.getAccesso("IDEN")+"&FUNZIONE=SCALA_BARTHEL";
				url += "&BISOGNO=N&READONLY=false";  
				parent.parent.$.fancybox({
					'padding': 3,
					'width': 1024,
					'height': 580,
					'href': url,
					'onClosed'	: function() {
						NS_PROGR_RIAB.caricaDatiBarthel();
					},
					'type': 'iframe'
				});
			},

			apriStoricoBck : function(campi,sezione){

				var resp= WindowCartella.executeStatement("programmaRiabilitativo.xml","getIdenBck",[document.EXTERN.KEY_ID.value,sezione],1);
				if (resp[0]=="KO"){
					alert(resp[1]);
				}
				else{	
					if(campi=='radCV@txtCV'){
						apriBck(campi,'programma_riabilitativo',null,'RADIO@TEXT','CODICE',resp[2]);  
					}
					else{
						apriBck(campi,'programma_riabilitativo',null,null,null,resp[2]);
					}
				}
			},

			stampa: function(){
				var sf			= '&prompt<pIden>='+document.EXTERN.KEY_ID.value;

				if(document.EXTERN.KEY_ID.value==0){
					return alert('Attenzione, programma riabilitativo non ancora salvato');
				}
				WindowCartella.confStampaReparto('PROGRAMMA_RIABILITATIVO',sf,'S',WindowCartella.getAccesso("COD_CDC"),basePC.PRINTERNAME_REF_CLIENT);
			}

		};

		var infoBarthel = {
				init: function() {
					$('.Link').live('click', function() {
						infoBarthel.open($(this).parent().find('label').attr('id'));
					});
				},
				open: function(id) {
					popupRiab.remove();

					var paramObj = {
							obj: null,
							title: null,
							width: 900,
							height: 270
					};

					paramObj.vObj = $('<table id=tableInfoBarthel></table>')
					;
					switch (id) {
					case 'lblAlimentazione':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(10) DA SOLO'))
								.append($('<td style="width: 20%;"></td>').text('(8) INDIPENDENTE'))
								.append($('<td style="width: 20%;"></td>').text('(5) SUPERVISIONE'))
								.append($('<td style="width: 20%;"></td>').text('(2) ASSISTITO'))
								.append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Capace di alimentarsi da solo quando i cibi sono preparati su di un vassoio o tavolo raggiungibili. Se usa un ausilio deve essere capace di utilizzarlo, tagliare la carne, e, se lo desidera, usare sale e pepe, spalmare il burro ecc.'))
								.append($('<td style="vertical-align: top;"></td>').text('Indipendente nell\'alimentarsi con cibi preparati su di un vassoio, ad eccezione di tagliare la carne, aprire il contenitore del latte, girare il coperchio di un vasetto etc. Non è necessaria la presenza di un\'altra persona.'))
								.append($('<td style="vertical-align: top;"></td>').text('Capace di alimentarsi da solo, con supervisione. Richiede assistenza nelle attività associate come versare latte nel the, usare sale e pepe, spalmare il burro, girare un piatto di portata o altro.'))
								.append($('<td style="vertical-align: top;"></td>').text('Capace di utilizzare una posata, in genere un cucchiaio, ma qualcuno deve assistere attivamente durante il pasto.'))
								.append($('<td style="vertical-align: top;"></td>').text('Dipendente per tutti gli aspetti. Deve essere imboccato.'))
						);
						paramObj.title = "ALIMENTAZIONE";
						break;
					case 'lblIgiene':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(5) DA SOLO'))
								.append($('<td style="width: 20%;"></td>').text('(4) AIUTO MINIMO'))
								.append($('<td style="width: 20%;"></td>').text('(3) AIUTO PER QUALCHE OPERAZIONE'))
								.append($('<td style="width: 20%;"></td>').text('(1) AIUTO PER TUTTE LE OPERAZIONI'))
								.append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Capace di lavarsi mani e faccia, pettinarsi, lavarsi i denti e radersi. Un uomo deve essere capace di usare senza aiuto, qualsiasi tipo di rasoio, comprese tutte le manipolazioni necessarie. Una donna deve essere capace di truccarsi, se abituata. (Non sono da considerare le attività relative all\'acconciatura dei capelli).'))
								.append($('<td style="vertical-align: top;"></td>').text('In grado di attendere all\'igiene personale, ma necessita di aiuto minimo prima e/o dopo le operazioni.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per una o più operazioni dell\'igiene personale.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per tutte le operazioni.'))
								.append($('<td style="vertical-align: top;"></td>').text('Incapace di attendere all\'igiene personale, dipendente sotto tutti gli aspetti.'))
						);
						paramObj.title = "IGIENE PERSONALE (LAVARSI)";
						break;
					case 'lblAbbigliamento':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(10) DA SOLO'))
								.append($('<td style="width: 20%;"></td>').text('(8) AIUTO MINIMO'))
								.append($('<td style="width: 20%;"></td>').text('(5) AIUTO PER QUALSIASI INDUMENTO'))
								.append($('<td style="width: 20%;"></td>').text('(2) DIPENDENTE E COLLABORA'))
								.append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE E NON COLLABORA'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Capace di indossare, togliere e chiudere correttamente gli indumenti, allacciarsi le scarpe e toglierle, applicare oppure togliere un corsetto od una protesi.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita solo di minimo aiuto per alcuni aspetti, come bottoni, cerniere, reggiseno, lacci di scarpe.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per mettere o togliere qualsiasi indumento.'))
								.append($('<td style="vertical-align: top;"></td>').text('Capace di collaborare in qualche modo, ma dipendente sotto tutti gli aspetti'))
								.append($('<td style="vertical-align: top;"></td>').text('Dipendente sotto tutti gli aspetti e non collabora.'))
						);
						paramObj.title = "ABBIGLIAMENTO (VESTIRSI)";
						break;
					case 'lblBagno':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(5) AUTONOMO'))
								.append($('<td style="width: 20%;"></td>').text('(4) SUPERVISIONE'))
								.append($('<td style="width: 20%;"></td>').text('(3) AIUTO PER TRASF./LAVARSI/ASCIUGARSI'))
								.append($('<td style="width: 20%;"></td>').text('(1) AIUTO PER TUTTE LE OPERAZIONI'))
								.append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Capace di fare il bagno in vasca, la doccia, o una spugnatura completa. Autonomo in tutte le operazioni, senza la presenza di un\'altra persona, quale che sia il metodo usato.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di supervisione per sicurezza (trasferimenti, T° dell\'acqua, ecc.).'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per il trasferimento nella doccia/bagno oppure nel lavarsi o asciugarsi.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per tutte le operazioni.'))
								.append($('<td style="vertical-align: top;"></td>').text('Totale dipendenza nel lavarsi.'))
						);
						paramObj.title = "BAGNO/DOCCIA";
						break;
					case 'lblContUri':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(10) INDIPENDENTE'))
								.append($('<td style="width: 20%;"></td>').text('(8) AIUTO MINIMO'))
								.append($('<td style="width: 20%;"></td>').text('(5) AIUTO PARZIALE'))
								.append($('<td style="width: 20%;"></td>').text('(2) INCONTINENTE'))
								.append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Controllo completo durante il giorno e la notte e/o indipendente con i dispositivi esterni o interni.'))
								.append($('<td style="vertical-align: top;"></td>').text('Generalmente asciutto durante il giorno e la notte, ha occasionalmente qualche perdita o necessita di minimo aiuto per l\'uso dei dispositivi esterni o interni.'))
								.append($('<td style="vertical-align: top;"></td>').text('In genere asciutto durante il giorno ma non di notte, necessario aiuto parziale nell\'uso dei dispositivi.'))
								.append($('<td style="vertical-align: top;"></td>').text('Incontinente ma in grado di cooperare all\'applicazione di un dispositivo esterno o interno.'))
								.append($('<td style="vertical-align: top;"></td>').text('Incontinente o catetere a dimora. Dipendente per l\'applicazione di dispositivi interni o esterni.'))
						);
						paramObj.title = "CONTINENZA URINARIA";
						break;
					case 'lblContInt':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(10) INDIPENDENTE'))
								.append($('<td style="width: 20%;"></td>').text('(8) SUPERVISIONE'))
								.append($('<td style="width: 20%;"></td>').text('(5) AIUTO MANOVRE/DISPOSITIVI'))
								.append($('<td style="width: 20%;"></td>').text('(2) AIUTO POSIZIONE/MANOVRE'))
								.append($('<td style="width: 20%;"></td>').text('(0) INCONTINENTE'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Controllo intestinale completo e nessuna perdita, capace di mettersi supposte o praticarsi un enteroclisma se necessario.'))
								.append($('<td style="vertical-align: top;"></td>').text('Può necessitare di supervisione per l\'uso di supposte o enteroclisma, occasionali perdite.'))
								.append($('<td style="vertical-align: top;"></td>').text('Capace di assumere una posizione appropriata, ma non può eseguire manovre facilitatorie, o pulirsi da solo senza assistenza, ed ha perdite frequenti. Necessita di aiuto nell\'uso di sispositivi come pannoloni ecc.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto nell\'assumere una posizione appropriata e necessita di manovre facilitatorie.'))
								.append($('<td style="vertical-align: top;"></td>').text('Incontinente.'))
						);
						paramObj.title = "CONTINENZA INTESTINALE";
						break;
					case 'lblGabinetto':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(10) DA SOLO'))
								.append($('<td style="width: 20%;"></td>').text('(8) SUPERVISIONE'))
								.append($('<td style="width: 20%;"></td>').text('(5) AIUTO TRASF./ECC'))
								.append($('<td style="width: 20%;"></td>').text('(2) AIUTO PER TUTTO'))
								.append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Capace di trasferirsi sul e dal gabinetto, gestire i vestiti senza sporcarsi, usare la carta igenica senza aiuto. Se necessario, può usare la comoda o la padella, o il pappagallo, ma deve essere in grado di svuotarli e pulirli.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di supervisione per sicurezza con l\'uso del normale gabinetto. Usa i sostituti del gabinetto (comoda, padella, pappagallo) indipendentemente tranne che per svuotarli e pulirli.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per svestirsi/vestirsi, per i trasferimenti e per lavare le mani.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per tutti gli aspetti.'))
								.append($('<td style="vertical-align: top;"></td>').text('Completamente dipendente.'))
						);
						paramObj.title = "USO DEL GABINETTO";
						break;
					case 'lblScale':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(10) DA SOLO'))
								.append($('<td style="width: 20%;"></td>').text('(8) SUPERVISIONE'))
								.append($('<td style="width: 20%;"></td>').text('(5) AIUTO PER USO AUSILI'))
								.append($('<td style="width: 20%;"></td>').text('(2) AIUTO PER SALIRE/SCENDERE'))
								.append($('<td style="width: 20%;"></td>').text('(0) INCAPACE'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('In grado di salire e scendere una rampa di scale con sicurezza, senza aiuto o supervisione. In grado di usare i corrimano, bastone o stampelle se necessario, ed è in grado di portarli con sé durante la salita o discesa.'))
								.append($('<td style="vertical-align: top;"></td>').text('In genere non richiede assistenza. Occasionalmente necessita di supervisone, per sicurezza (es. a causa di rigidità mattutina, dispnea, ecc.).'))
								.append($('<td style="vertical-align: top;"></td>').text('Capace di salire/scendere le scale, ma non in grado di gestire gli ausili e necessita di supervisione ed assistenza.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per salire e scendere le scale (compreso eventuale uso di ausili).'))
								.append($('<td style="vertical-align: top;"></td>').text('Incapace di salire e scendere le scale.'))
						);
						paramObj.title = "SCALE";
						break;
					case 'lblTrasferimenti':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(15) INDIPENDENTE'))
								.append($('<td style="width: 20%;"></td>').text('(12) SUPERVISIONE'))
								.append($('<td style="width: 20%;"></td>').text('(8) AIUTO MINIMO TRASF.'))
								.append($('<td style="width: 20%;"></td>').text('(3) AIUTO E COLLABORA'))
								.append($('<td style="width: 20%;"></td>').text('(0) AIUTO E NON COLLABORA'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Capace di avvicinarsi con sicurezza al letto, bloccare i freni, sollevare le pedane, trasferirsi con sicurezza sul letto, sdraiarsi, rimettersi seduto sul bordo, cambiare la posizione della carrozzina, trasferirvisi con sicurezza. E\' indipendente durante tutte le fasi.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessaria la presenza di una persona per maggior fiducia o per supervisione a scopo di sicurezza.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessario minimo aiuto da parte di una persona per uno o più aspetti del trasferimento.'))
								.append($('<td style="vertical-align: top;"></td>').text('Collabora ma richiede massimo aiuto da parte di una persona durante tutti i movimenti del trasferimento.'))
								.append($('<td style="vertical-align: top;"></td>').text('Non collabora al trasferimento. Necessarie due persone per trasferire il Pz. con o senza un sollevatore.'))
						);
						paramObj.title = "TRASFERIMENTI LETTO <-> CARROZZINA";
						break;
					case 'lblDeambu':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(15) DA SOLO'))
								.append($('<td style="width: 20%;"></td>').text('(12) SUPERVISIONE'))
								.append($('<td style="width: 20%;"></td>').text('(8) PERSONA PER USO AUSILI'))
								.append($('<td style="width: 20%;"></td>').text('(3) PERSONA/E PER DEAMBULARE'))
								.append($('<td style="width: 20%;"></td>').text('(0) NON DEAMBULA'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Capace di portare una protesi se necessario, bloccarla, sbloccarla, assumere la stazione eretta, sedersi e piazzare gli ausili a portata di mano. In grado di usare stampelle, bastoni, walker, e deambulare per almeno 50 mt senza aiuto o supervisione.'))
								.append($('<td style="vertical-align: top;"></td>').text('Indipendente nella deambulazione ma con autonomia <50 mt. Necessita di supervisione per maggior fiducia o sicurezza in situazioni pericolose.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessita di assistenza di 1 persona per raggiungere gli ausili e/o per la loro manipolazione.'))
								.append($('<td style="vertical-align: top;"></td>').text('Neccesita della presenza costante di uno o più assistenti durante la deambulazione.'))
								.append($('<td style="vertical-align: top;"></td>').text('Non in grado di deambulare.'))
						);
						paramObj.title = "DEAMBULAZIONE";
						break;
					case 'lblCarrozzina':
						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('(5) DA SOLO'))
								.append($('<td style="width: 20%;"></td>').text('(4) SUPERVISIONE'))
								.append($('<td style="width: 20%;"></td>').text('(3) AIUTO PER AVVICINAMENTI'))
								.append($('<td style="width: 20%;"></td>').text('(1) AIUTO PER TUTTE LE MANOVRE'))
								.append($('<td style="width: 20%;"></td>').text('(0) DIPENDENTE'))
						)
						.append(
								$('<tr></tr>')
								.append($('<td style="vertical-align: top;"></td>').text('Capace di compiere autonomamente tutti gli spostamenti (girare attorno agli angoli, rigirarsi, avvicinarsi al tavolo, letto, wc, ecc.). L\'autonomia deve essere >=50 mt.'))
								.append($('<td style="vertical-align: top;"></td>').text('Capace di spostarsi autonomamente, per periodi ragionevolmente lunghi, su terreni e superficie regolare. Può essere necessaria assistenza per fare curve strette.'))
								.append($('<td style="vertical-align: top;"></td>').text('Necessaria la presenza e l\'assistenza costante di una persona per avvicinare la carrozzina al tavolo, al letto, ecc.'))
								.append($('<td style="vertical-align: top;"></td>').text('Capace di spostarsi solo per brevi tratti e su superfici piane, necessaria assistenza per tutte le manovre.'))
								.append($('<td style="vertical-align: top;"></td>').text('Dipendente negli spostamenti con la carrozzina.'))
						);
						paramObj.title = "USO DELLA CARROZZINA";
						break;
					}

					popupRiab.append({
						obj: paramObj.vObj,
						title: paramObj.title,
						width: paramObj.width,
						height: paramObj.height
					});
				},
				show: function() {
					$('#lblFunzione').addClass('Link');
				},
				hide: function() {
					$('#lblFunzione').removeClass('Link');
				}
		};

		var infoStoricoSez = {

				open: function(id) {
					popupRiab.remove();

					var paramObj = {
							obj: null,
							title: null,
							width: 300,
							height: 270
					};

					paramObj.vObj = $('<table id=tableInfo></table>')
					;
					var resp= WindowCartella.executeStatement("programmaRiabilitativo.xml","getStoricoSezione",[document.EXTERN.KEY_ID.value,'Stabilita'],1);
					if (resp[0]=="KO"){
						alert(resp[1]);
					}
					else{

						$(paramObj.vObj).append(
								$('<tr></tr>')
								.append($('<td style="width: 20%;"></td>').text('UTENTE'))
								.append($('<td style="width: 20%;"></td>').text('DATA'))
						);  

						var arrRecord = resp[2].split("*");		    		
						for(var i=0;i<arrRecord.length;i++){
							var arrVal=arrRecord[i].split("|");
							$(paramObj.vObj).append(
									$('<tr></tr>')
									.append($('<td style="vertical-align: top;"></td>').text(arrVal[0]))
									.append($('<td style="vertical-align: top;"></td>').text(arrVal[1]))
							);

						}

						paramObj.title = "Storico";

						popupRiab.append({
							obj: paramObj.vObj,
							title: paramObj.title,
							width: paramObj.width,
							height: paramObj.height
						});

					}




				},
				show: function() {
					$('#lblFunzione').addClass('Link');
				},
				hide: function() {
					$('#lblFunzione').removeClass('Link');
				}
		};

		var popupRiab = {
				append: function(pParam) {
					popupRiab.remove();

					pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
					pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
					pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
					pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
					pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

					parent.$('body').append(
							$('<div id="divPopUpInfoRiab"></div>')
							.css("font-size", "12px")
							.append(pParam.header)
							.append(pParam.obj)
							.append(pParam.footer)
							.attr("title", pParam.title)
					);
					parent. $('#divPopUpInfoRiab').dialog({
						position: [event.clientX, event.clientY],
						width: pParam.width,
						height: pParam.height
					});

					popupRiab.setRemoveEvents();

				},
				remove: function() {
					parent.$('#divPopUpInfoRiab').remove();
				},
				setRemoveEvents: function() {
					parent.$("body").click(popupRiab.remove);
				}
		};


//		textarea expander modificato per l'occasione

		(function($) {
			// jQuery plugin definition
			$.fn.TextAreaExpander = function(minHeight, maxHeight) {

				var hCheck = !($.browser.msie || $.browser.opera);

				// resize a textarea
				function ResizeTextarea(e) {
					// event or initialize element?
					e = e.target || e;
					// find content length and box width
					var vlen = e.value.length, ewidth = e.offsetWidth;
					if (vlen != e.valLength || ewidth != e.boxWidth) {

						if (hCheck && (vlen < e.valLength || ewidth != e.boxWidth)) e.style.height = "0px";
						var h = Math.max(e.expandMin, Math.min(e.scrollHeight, e.expandMax));

						e.style.overflow = (e.scrollHeight > h ? "auto" : "hidden");
						e.valLength = vlen;
						e.boxWidth = ewidth;

						var maxH=h;
						parent.$('#divStorico iframe').contents().find("#"+e.id).each(function(){
							if($(this).height()>maxH){maxH=$(this).height()}
						})
						parent.$('#divStorico iframe').contents().find("#"+e.id).each(function(){
							$(this).css('height',maxH+8+"px");
						})
						e.style.height = maxH+8 + "px";
					}

					return true;
				};

				// initialize
				this.each(function() {

					// is a textarea?
					if (this.nodeName.toLowerCase() != "textarea") return;

					// set height restrictions
					var p = this.className.match(/expand(\d+)\-*(\d+)*/i);
					this.expandMin = minHeight || (p ? parseInt('0'+p[1], 10) : 0);
					this.expandMax = maxHeight || (p ? parseInt('0'+p[2], 10) : 99999);

					// initial resize
					ResizeTextarea(this);

					// zero vertical padding and add events
					if (!this.Initialized) {
						this.Initialized = true;
						$(this).css("padding-top", 0).css("padding-bottom", 0);
						$(this).bind("keyup", ResizeTextarea).bind("focus", ResizeTextarea);

						$(this).bind("paste",function() {
							var a=$(this);
							setTimeout(function() {
								a.focus();
							}, 100);
						});				
					}
				});

				return this;
			};

		})(jQuery);

