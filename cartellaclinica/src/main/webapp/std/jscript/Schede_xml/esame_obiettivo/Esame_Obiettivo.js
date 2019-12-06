var apertura='';
var altezzaVar='';
var pesoVar='';



$(function(){

    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    baseReparti = WindowCartella.baseReparti;
    baseGlobal = WindowCartella.baseGlobal;
    basePC = WindowCartella.basePC;
    baseUser = WindowCartella.baseUser;
	
    t = $('#chkCicNon').parent();
    for ( var i = 0; i < 5; i++ ) {  
	    n = t.next();
	    t.html(t.html() + n.html());
	    n.remove();
    }
	    
    t = $('#chkSegniBlumberg').parent();
    for ( var i = 0; i < 3; i++ ) {  
	    n = t.next();
	    t.html(t.html() + n.html());
	    n.remove();
    }
    
    t = $('#chkRumNon').parent();
    for ( var i = 0; i < 7; i++ ) {  
	    n = t.next();
	    t.html(t.html() + n.html());
	    n.remove();
    }
    $("#txtRespPerc,#txtRespPalp,#txtRespAscRumor").parent().attr('colspan','2');
    $("#txtRespAscMurmur").parent().attr('colspan','1');
    $("SELECT[name='cmbRespIsp']").parent().attr('colspan','3');
    //$('textarea[name="txtRespiratorio"]').parent().attr('colspan','4');
    
    $("input[type='checkbox']").next().next().css('margin-right','20px');
		      
	
	ESAME_OBIETTIVO.init();
	ESAME_OBIETTIVO.setEvents();
	
	if(document.EXTERN.KEY_LEGAME.value=='EOS_OSTETRICIA'){
		 EOS_OSTETRICIA.init();
	     EOS_OSTETRICIA.setEvents();
	}
	switch (document.EXTERN.KEY_LEGAME.value) {
    case 'EOS_OSTETRICIA':
		 EOS_OSTETRICIA.init();
	     EOS_OSTETRICIA.setEvents();
	     break;
    case 'EOS_NEUROLOGIA':
		 EOS_NEUROLOGIA.init();
	     EOS_NEUROLOGIA.setEvents();
        break;
    case 'EOS_CARDIOLOGIA':
    	EOS_CARDIOLOGIA.init();
    	EOS_CARDIOLOGIA.setEvents();
       break;
    default:
        break;
}
	
	if (top.ModalitaCartella.isReadonly(document)){
		$('textarea, input[type="text"]').css("background-color","#CCC");
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
	}

	if(!top.ModalitaCartella.isStampabile(document)){
		document.getElementById('lblstampa').parentElement.parentElement.style.display = 'none';
	}

	try{
		eval(baseReparti.getValue(top.getForm(document).reparto,'ESAME_OBIETTIVO_NORMALE'));
	}catch(e){
		alert(e.description)
	}
	/*aggiungo icona testi standard a testarea*/			
	$("#txtGenerale").css({width:'95%',float:'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtGenerale');}));
	$("#txtRespiratorio").css({width:'95%',float:'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtRespiratorio');}));
	$("#txtCardio").css({width:'95%',float:'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtCardio');}));   
	$("#txtDigerente").css({width:'95%',float:'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtDigerente');}));
	$("#txtAltri ").css({width:'95%',float:'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtAltri');}));
	$("#txtNervoso").css({width:'95%',float:'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtNervoso');}));

	$("input[name=chkNormaleGenerale]").click(function() {
		//fatto per esame obiettivo di cardiologia..aveva già un campo txtCondGen che doveva trasformarsi in generalità..
		try{
			testoNormale(0,"txtGenerale");
		}
		catch(e){
			testoNormale(0,"txtCondGen");	
		}
	});
	$("input[name=chkNormaleRespiratorio]").click(function() {testoNormale(1,"txtRespiratorio");});
	$("input[name=chkNormaleCardio]").click(function() {testoNormale(2,"txtCardio");});
	$("input[name=chkNormaleDigerente]").click(function() {testoNormale(3,"txtDigerente");});
	$("input[name=chkNormaleAltri]").click(function() {testoNormale(4,"txtAltri");});
	$("input[name=chkNormaleNervoso]").click(function(){testoNormale(5,"txtNervoso");});

	setEventsRadCardAscRumor();
	try{
		top.utilMostraBoxAttesa(false);
	}catch(e) {/*catch nel caso non venga aperta dalla cartella*/}
	/*$('body').click(function(){
		parent.ESAME_OBIETTIVO.checkSalvataggio.check(_STATO_PAGINA == 'L')
	});*/
//	caricaParametri();
});

var ESAME_OBIETTIVO = {
	
	init:function(){},
	
	setEvents:function(){
		//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
		$('form[name="ESAME_OBIETTIVO"]').click(function(){
			$(this).attr("edited","edited");			
		});	
		$("#txtPeso").blur(function(){ 
			var peso=$("#txtPeso").val();
			$("#txtPeso").val(peso);
			var altezza=$("#txtAltezza").val();
			calcolaBMI(peso.replace(',','.'),altezza);
			});
		$("#txtAltezza").blur(function(){ 
			var peso=$("#txtPeso").val();
			var altezza=$("#txtAltezza").val();
			calcolaBMI(peso.replace(',','.'),altezza);
			});
		
		$('#txtPaceMaker').val('').attr('disabled','disabled');
		$("INPUT[name='radPaceMaker']").click(function(){
			if($(this).val()=="NO"){
				$('#txtPaceMaker').val('').attr('disabled','disabled');
			}
			else{
				$('#txtPaceMaker').removeAttr('disabled');
			}
		});
		
	},
	RegPesoAltezza:function(){
		var peso=$("#txtPeso").val();
		var altezza=$("#txtAltezza").val();
		if (peso!=0 || altezza!=0){
			var pBindMatrix =[];
			pBindMatrix.push([
				document.EXTERN.USER_ID.value,
				document.EXTERN.IDEN_VISITA.value,
				null,
				clsDate.getData(new Date(),'YYYYMMDD') ,
				clsDate.getOra(new Date()),
				altezza,
				peso,
				'E',
				'',
				'',
				'ESAME_OBIETTIVO'
			]);
			var resp = top.executeBatchStatement("parametri.xml","setPesoAltezza",pBindMatrix,0);
			//alert(resp);	
		}
	}		
};

var EOS_OSTETRICIA = {
	    init: function() {
	    	
	        var maxLength = 4000;
	        var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
	        $('#txtAltri,#txtGenerale,#txtCardio,#txtDigerente,#txtRespiratorio').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
	            maxlength(this, maxLength, msg);
	        });
	        $("textarea[class*=expand]").TextAreaExpander();
	    
	        var hPartePresentata = $('#txtPartePresentata').remove().val();
	        NS_FUNCTIONS.addInputText('groupGenerale', '&nbsp;&nbsp;&nbsp;<INPUT id="txtPartePresentata" name="txtPartePresentata" value="' + hPartePresentata + '" STATO_CAMPO="E"/>', '4|1|0', 'select');
	        NS_FUNCTIONS.enableDisable($('select[name="cmbMembrane"]'), [2], ['txtDataRotte', 'txtOraRotte']);
	        NS_FUNCTIONS.showHideCalendar('txtDataRotte', $('select[name="cmbMembrane"]').val() == '2' ? true : false);
	        //NS_FUNCTIONS.enableDisable($('select[name="cmbPartePresentata"]'), [3], ['txtPartePresentata']);
	        
	        NS_FUNCTIONS.controlloData('txtDataRotte');
			$("#txtOraRotte").blur(function(){ oraControl_onblur(document.getElementById('txtOraRotte')); });
			$("#txtOraRotte").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraRotte')); });
	        //tableFormatting('groupGenerale', ["1|3|2","3|2|1"]);
	        
	        //NS_FUNCTIONS.hideRecordsPrint('lblregistra', 'lblstampa');
	    },
	    setEvents: function() {
	        $('select[name="cmbMembrane"]').change(function() {
	            NS_FUNCTIONS.enableDisable($('select[name="cmbMembrane"]'), [2], ['txtDataRotte', 'txtOraRotte'], true);
	            NS_FUNCTIONS.showHideCalendar('txtDataRotte', $('select[name="cmbMembrane"]').val() == '2' ? true : false);
	        });
	        $('select[name="cmbPartePresentata"]').change(function() {
	            NS_FUNCTIONS.enableDisable($('select[name="cmbPartePresentata"]'), [3], ['txtPartePresentata'], true);
	        });
	    },
	    registraEsameObiettivoSpecialistico: function() {
	        //alert("registraEsameObiettivoSpecialistico");
	        NS_FUNCTIONS.records();
	    },
	    stampaEsameObiettivoSpecialistico: function() {
	    	stampaEsameObiettivo();
	    }           
	};

var EOS_NEUROLOGIA = {
		init: function() {


			$("input[name='chkNormale']").click(function() {
				if (window.event.srcElement.checked) {
			 for(var key in datiNormali){
		            $("#"+key).val(datiNormali[key]);
		        }
			 jQuery("textarea[class*=expand]").TextAreaExpander();
				}
			});

		},
		setEvents: function() {
			var maxLength = 4000;
			var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
			jQuery("#txtAltri,#txtArtInf,#txtArtSup,#txtCamVis,#txtCoo,#txtEquStaEreDea,#txtFun,#txtFunSim,#txtMovPat,#txtNerCra,#txtPup,#txtRifPro,#txtRifSup,#txtSegIrrMenRad,#txtSenOggPro,#txtSenOggSup,#txtSenSog,#txtSenSpe,#txtSfi,#txtStaCos,#txtGenerale,#txtCardio,#txtDigerente,#txtRespiratorio").addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
			    maxlength(this, maxLength, msg);
			});

			jQuery("textarea[class*=expand]").TextAreaExpander();
			if(_STATO_PAGINA != 'L'){
				$('#lblScalaMrs').click(EOS_NEUROLOGIA.apriMRS);
				$('#lblScalaNihss').click(EOS_NEUROLOGIA.apriNIHSS);
			}

		},

		registraEsameObiettivoSpecialistico: function() {
			//alert("registraEsameObiettivoSpecialistico");
			NS_FUNCTIONS.records();
		},
		stampaEsameObiettivoSpecialistico: function() {
			stampaEsameObiettivo();
		},

		apriMRS : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_RANKIN&FUNZIONE=SCALA_RANKIN&OPEN_FROM_OS=S&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		apriNIHSS : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_NIH_STROKE&FUNZIONE=SCALA_NIH_STROKE&OPEN_FROM_OS=S&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');

		}
						
};

var  datiNormali= {
		"txtStaCos":"Vigile, cosciente, collaborante, orientato nello spazio e nel tempo",
		"txtFunSim":"Nella norma",
		"txtFun":"Nella norma",
		"txtCamVis":"Non disturbi campimetrici al confronto",
		"txtNerCra":"Come di norma",
		"txtPup":"Isocoriche, isocicliche, reagenti al fotostimolo",
		"txtSenSpe":"Come di norma",
		"txtArtSup":"Mobilità attiva e passiva, globale, segmentaria e fine: come di norma. Tono e trofismo: come di norma. Forza muscolare: comedi norma. Prove antigravitarie: come di norma alla prova di Mingazzini",
		"txtArtInf":"Mobilità attiva e passiva, globale, segmentaria e fine: come di norma. Tono e trofismo: come di norma. Forza muscolare: comedi norma. Prove antigravitarie: come di norma alla prova di Mingazzini",
		"txtCoo":"Come di norma",
		"txtEquStaEreDea":"Come di norma la manovra di Romberg. Stazione eretta e deambulazione in ordine. Deambulazione sui talloni e sulle punte senza assimetrie",
		"txtSenSog":"Nulla da segnalare",
		"txtSenOggSup":"Nella norma",
		"txtSenOggPro":"Come di norma",
		"txtRifSup":"Corneali presenti bilateralmente. Hoffmann negativo. Addominali presenti normoevocabili. Cutaneo-plantare: in flessione bilateralmente",
		"txtRifPro":"Normoelicitabili e simmetrici",
		"txtMovPat":"Assenti",
		"txtSegIrrMenRad":"Assenti",
		"txtSfi":"continenti"
	};

var EOS_CARDIOLOGIA = {
	    init: function() {
	
			var fieldsetCollo=$('#groupCollo');
			var fieldsetCuore=$('#groupCardio');
			var groupCardio=$('#groupCardio2');
			var fieldsetArti=$('#groupArti');
			var fieldsetCardio="<DIV id='groupCardiovascolare'><FIELDSET id='fieldsetCardio'><LEGEND>APPARATO CARDIOVASCOLARE</LEGEND>"+groupCardio.html()+fieldsetCollo.html()+fieldsetCuore.html()+fieldsetArti.html()+"</FIELDSET></DIV>";
			groupCardio.remove();
			fieldsetCollo.remove();
			fieldsetCuore.remove();
			fieldsetArti.remove();
			$('#groupGenerale').append(fieldsetCardio);
	    },
	    setEvents: function() {
			// Controllo obbligatorietà valore numerico
		    $('input[name=txtPeso], input[name=txtAltezza]').keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);

			var maxLength = 4000;
			var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
			jQuery("#txtGenerale,#txtAltri,#txtDigerente,#txtRespiratorio,#txtCardio").addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
			    maxlength(this, maxLength, msg);
			});

			jQuery("textarea[class*=expand]").TextAreaExpander();
			// Campi non editabili (sola lettura)
		//	$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
		    

	    },
	    registraEsameObiettivoSpecialistico: function() {
	    	// Controllo che sia spuntata almeno una voce del campo 'Ispezione Addome'.
	    	var chkIspezioneAddome = $('input[name=chkPiano]:checked, input[name=chkGloboso]:checked, input[name=chkRetiVenose]:checked, input[name=chkAscite]:checked');
	    	$('input[name=chkPiano]').val(chkIspezioneAddome.length > 0 ? 'S' : '');
	    	NS_FUNCTIONS.setCampoStato('chkPiano','lblIspezioneAddome','O'); 
	        
	    	// Salvataggio dei campi
	    	NS_FUNCTIONS.records();
	        
	        // Ripristino il valore di default
	        $('input[name=chkPiano]').val('');
	    },
	    stampaEsameObiettivoSpecialistico: function() {
	    	stampaEsameObiettivo();
	    }						
	};




function setEventsRadCardAscRumor() {
	setVisibilitySoffio();
	setDisplayCmbDia();
	setDisplayCmbSis();
	$("input[name=radCardAscRumor]").parent().click(setVisibilitySoffio);
	$("input[name=radCardSoffioDia]").parent().click(setDisplayCmbDia);
	$("input[name=radCardSoffioSis]").parent().click(setDisplayCmbSis);
	
	function setVisibilitySoffio() {
		if ($('input[name="radCardAscRumor"][value="cardAscRumor-4"]').is(":checked")) { 
		$('label#lblCardSoffioDia').parent().css({visibility:"visible"});
		$('input[name="radCardSoffioDia"]').parent().css({visibility:"visible"});
		$('select[name="cmbCardSoffioDia"]').parent().css({visibility:"visible"});
		$('label#lblCardSoffioSis').parent().css({visibility:"visible"});
		$('input[name="radCardSoffioSis"]').parent().css({visibility:"visible"});
		$('select[name="cmbCardSoffioSis"]').parent().css({visibility:"visible"});
		$('input[name="txtCardAscSoffio"]').parent().css({visibility:"visible"});
		} else { 
		$('label#lblCardSoffioDia').parent().css({visibility:"hidden"});
		$('input[name="radCardSoffioDia"]').parent().css({visibility:"hidden"});
		$('select[name="cmbCardSoffioDia"]').parent().css({visibility:"hidden"});
		$('label#lblCardSoffioSis').parent().css({visibility:"hidden"});
		$('input[name="radCardSoffioSis"]').parent().css({visibility:"hidden"});
		$('select[name="cmbCardSoffioSis"]').parent().css({visibility:"hidden"});
		$('input[name="txtCardAscSoffio"]').parent().css({visibility:"hidden"});
		}
		setDisplayCmbDia();
		setDisplayCmbSis();
	}
	
	function setDisplayCmbDia() {
		if ($('input[name="radCardSoffioDia"][value="S"]').is(":checked")) { 
			$('select[name="cmbCardSoffioDia"]').parent().show();
		} else {
			$('select[name="cmbCardSoffioDia"]').parent().hide();
		}
	}
	
	function setDisplayCmbSis() {
		if ($('input[name="radCardSoffioSis"][value="S"]').is(":checked")) { 
			$('select[name="cmbCardSoffioSis"]').parent().show();
		} else {
			$('select[name="cmbCardSoffioSis"]').parent().hide();
		}
	}
}

function  apriTestiStandard(targetOut){

	if(_STATO_PAGINA == 'L'){return;}

	var url='servletGenerator?funzione=LETTERA_STANDARD&KEY_LEGAME=SCHEDA_TESTI_STD&TARGET='+targetOut+'&PROV='+document.EXTERN.FUNZIONE.value;
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});	
}



function controllaCampiNumerici(campo, label) {

	var descrizione = label.innerText;
	var contenutoDopoReplace = campo.value.replace (',','.');

	campo.value = contenutoDopoReplace;

	if (isNaN(campo.value)){
		alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
		campo.value= '';
		campo.focus();
		return;		
	}
}


function caricaParametri(){

	dwr.engine.setAsync(false);	
	toolKitDB.getResultData("SELECT iden from radsql.cc_schede_xml where key_legame='ESAME_OBIETTIVO_GENERALE' and iden_visita="+document.EXTERN.IDEN_VISITA.value, resp_caricaParam);
	dwr.engine.setAsync(true);	

}

function resp_caricaParam(resp){

	if (resp==null){
//		alert('carica parametri');	
		dwr.engine.setAsync(false);	
		toolKitDB.getResultData("select valore from view_cc_parametri_ultimo where  iden_parametro=(select iden from radsql.cc_parametri_type where cod_dec='PESO') and iden_anag="+ top.getForm(document).iden_anag, setPeso);
		dwr.engine.setAsync(true);	
		dwr.engine.setAsync(false);	
		toolKitDB.getResultData("select valore from view_cc_parametri_ultimo where  iden_parametro=(select iden from radsql.cc_parametri_type where cod_dec='ALTEZZA') and iden_anag="+top.getForm(document).iden_anag, setAltezza);
		dwr.engine.setAsync(true);	

	} else {
		apertura='M';
	}	
}

function setAltezza(resp){
//	alert('altezza'+ resp);
	if (resp!=null){
		document.all.txtAltezza.value=resp;
		altezzaVar=resp;
	}
}

function setPeso(resp){
//	alert('peso'+ resp);
	if (resp!=null){
		document.all.txtPeso.value=resp;
		pesoVar=resp;	
	}
}

function registraEsameObiettivo(){
/*	var peso=$("#txtPeso").val();
	var altezza=$("#txtAltezza").val();
	alert('aaa');
	if (peso!=''){
		if (!IsNumeric(peso)){
			alert('valore del PESO rilevato in formato non numerico!');
			return;
		}
	}
	if (altezza!=''){
		if (!IsNumeric(altezza)){
			alert('valore di ALTEZZA rilevato in formato non numerico!');
			return;
		}
	}*/
	registra();	
	//ESAME_OBIETTIVO.RegPesoAltezza();
}

function resp_check(resp){			

	if(document.all.txtPeso.value!=pesoVar){
//		alert('inserisci peso');
		sql=" declare paramOut varchar2(50); BEGIN RADSQL.CC_PARAMETRO_INSERT("+document.EXTERN.USER_ID.value+", "+document.EXTERN.IDEN_VISITA.value+","+resp[2]+", 0, '"+resp[0]+"', '"+resp[1]+"', '"+document.all.txtPeso.value+"',0,paramOut); END;";
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql);	
		dwr.engine.setAsync(true);
		pesoVar=document.all.txtPeso.value;
	}

	if(document.all.txtAltezza.value!=altezzaVar){
//		alert('inserisci altezza');
		sql=" declare paramOut varchar2(50); BEGIN RADSQL.CC_PARAMETRO_INSERT("+document.EXTERN.USER_ID.value+", "+document.EXTERN.IDEN_VISITA.value+","+resp[3]+", 0, '"+resp[0]+"', '"+resp[1]+"', '"+document.all.txtAltezza.value+"',0,paramOut); END;";
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql);	
		dwr.engine.setAsync(true);
		altezzaVar=document.all.txtAltezza.value;
	}
}

function stampaEsameObiettivo()
{
	var vDati=top.getForm(document);

	var funzione	= 'ESAME_OBIETTIVO_GENERALE';
	var anteprima	= 'S';
	var reparto		= vDati.reparto;
	var sf			= '&prompt<pVisita>='+document.EXTERN.IDEN_VISITA.value+'&prompt<pFunzione>='+document.EXTERN.FUNZIONE.value;

	top.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);	
}


function testoNormale(n, idTextArea) {
	if (window.event.srcElement.checked) {
		document.getElementById(idTextArea).value=normali[n];
	}
}

function calcolaBMI(peso,altezza){
		
	if (peso!=0 && altezza!=0){
		bmi = clsGrid.roundTo(peso/((altezza/100)*(altezza/100)),2);
		$("#txtBMI").val(bmi);
	}

}
