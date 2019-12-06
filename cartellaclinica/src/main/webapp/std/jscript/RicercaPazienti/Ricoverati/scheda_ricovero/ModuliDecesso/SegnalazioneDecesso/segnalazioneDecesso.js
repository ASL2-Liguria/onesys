/**
 * User: matteopi
 * Date: 05/07/13
 * Time: 17.24
 */
var WindowCartella = null;
jQuery(document).ready(function () {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    NS_SEGNALAZIONE_DECESSO.init();
    NS_SEGNALAZIONE_DECESSO.event();
});

var NS_SEGNALAZIONE_DECESSO = {
	
	firma:'',
	idenLettera:'',
	idenLetteraPrecedente:'',
	statoLetteraPrecedente:'',
		
    init : function () {
        try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
        
        if (_STATO_PAGINA == 'L') {
        	document.getElementById('lblFirma').parentElement.parentElement.style.display = 'none';
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
        }

        try {
            if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
                document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
            }
        } catch (e) {
        }
   
        NS_SEGNALAZIONE_DECESSO.event();
        NS_SEGNALAZIONE_DECESSO.caricaDatiAnagrafici();
        NS_SEGNALAZIONE_DECESSO.caricaDatiMedico();
        NS_SEGNALAZIONE_DECESSO.caricaStatoCivile();
        NS_SEGNALAZIONE_DECESSO.caricaDati();
        $('#txtRicoverato').val(WindowCartella.getRicovero("DATA_INIZIO").substring(6,8)+'/'+WindowCartella.getRicovero("DATA_INIZIO").substring(4,6)+'/'+WindowCartella.getRicovero("DATA_INIZIO").substring(0,4));
        $('#txtSottoscritto,#txtSegnalo,#txtPaziente,#txtNato,#dateIl,#txtResidente,#txtStatoCivile,#txtRicoverato').attr('disabled','disabled');
        $('#txtSegnalo').val(WindowCartella.getReparto("DESCR"));
        
        
    },
    event: function () {
    	try {
    		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
    		oDateMask.attach(document.dati.dateInDate);
    	}catch(e){}

    	if (_STATO_PAGINA != 'L') {
    		$('input[name=txtAlleOre]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtAlleOre'));});
    		$('input[name=txtAlleOre]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtAlleOre'));});
    		$('input[name=dateInDate]').bind('blur', function(){if($('input[name=dateInDate]').val().substr(5,1)!='/' || $('input[name=dateInDate]').val().length!=10 ) {alert('Inserire la data nel formato corretto'); $('input[name=dateInDate]').focus();}});
    	}
    },
    caricaDatiAnagrafici : function(){   
		var rs = WindowCartella.executeQuery("segnalazioneDecesso.xml","caricaDatiAnagrafici",[WindowCartella.getPaziente("IDEN")]);
		if(rs.next()){
			$('#txtPaziente').val(rs.getString("COGN")+' '+rs.getString("NOME"));
			$('#txtNato').val(rs.getString("COM_NASC"));
			$('#dateIl').val(rs.getString("DATA"));
			$('#txtResidente').val(rs.getString("COM_RES")+' - '+rs.getString("RES_INDIRIZZO"));
		}    	
    },
    caricaDatiMedico : function(){ 
    	var idenMed=baseUser.IDEN_PER;
    	//se è già stata salvata devo prendere i riferimenti del medico che ha registrato
    	if(WindowCartella.getPaziente().IDEN_PER_MORTE_CCE!='') {
    		idenMed=WindowCartella.getPaziente().IDEN_PER_MORTE_CCE;
    	}
    	//se entra un infermiere al primo inserimento il campo non deve essere popolato
    	if(WindowCartella.getPaziente().IDEN_PER_MORTE_CCE!='' || baseUser.TIPO=='M'){
			var rs = WindowCartella.executeQuery("segnalazioneDecesso.xml","caricaDatiMedico",[idenMed]);
			if(rs.next()){
				$('#txtSottoscritto').val(rs.getString("COGNOME")+'  '+rs.getString("NOME"));
			}    
    	}
    },
    caricaStatoCivile : function(){  
		var rs = WindowCartella.executeQuery("segnalazioneDecesso.xml","caricaStatoCivile",[document.EXTERN.IDEN_VISITA.value]);
		if(rs.next()){
			$('#txtStatoCivile').val(rs.getString("VALORE"));
		}    	
    },
    caricaDati : function(){  
		var rs = WindowCartella.executeQuery("segnalazioneDecesso.xml","caricaDati",[document.EXTERN.IDEN_VISITA.value]);
		if(rs.next()){
			$('[name=radioMedico][value='+rs.getString("vRadioMedico")+']').attr('checked','checked');
			$('#dateInDate').val(rs.getString("txtDataMorte"));
			$('#txtAlleOre').val(rs.getString("txtOraMorte"));
			if(rs.getString("vChkGiuntoCadavere")=='S'){$('#chkGiuntoCadavere').attr('checked','checked');}
			if(rs.getString("vChkPaceMaker")=='S'){$('#chkPaceMaker').attr('checked','checked');}
			if(rs.getString("vChkRiscontro")=='S'){$('#chkRiscontro').attr('checked','checked');}
			if(rs.getString("vChkADisposizione")=='S'){$('#chkADisposizione').attr('checked','checked');}
			if(rs.getString("vChkAffetto")=='S'){$('#chkAffetto').attr('checked','checked');}
			if(rs.getString("vChkMorteImprovvisa")=='S'){$('#chkMorteImprovvisa').attr('checked','checked');}
		}    	
    },
        
	registraFirmaSegnalazione : function(){
		NS_SEGNALAZIONE_DECESSO.firma='S';
		NS_SEGNALAZIONE_DECESSO.registraSegnalazione();

	},

	registraSegnalazione : function() {
		
		if($("INPUT[name='dateInDate']").val()!='' && $("INPUT[name='txtAlleOre']").val()!=''){
			var data = clsDate.str2date($("INPUT[name='dateInDate']").val(),'DD/MM/YYYY',$("INPUT[name='txtAlleOre']").val());
			 check = clsDate.dateCompare(new Date(),data);
			 if(clsDate.dateCompare(new Date(),data)==-1)
				return alert("Attenzione: rimpostare la data e/o l'ora in quanto risultano superiori a quelle attuali");
		}
		registra();
	},

	regOK : function(){
		
		WindowCartella.getPaziente().DATA_MORTE_CCE = $('#dateInDate').val();
		WindowCartella.getPaziente().ORA_MORTE_CCE = $('#txtAlleOre').val();
		WindowCartella.getPaziente().IDEN_PER_MORTE_CCE = baseUser.IDEN_PER;
		
		var rs = WindowCartella.executeQuery("segnalazioneDecesso.xml","retrieveIden",['SEGNALAZIONE_DECESSO',baseUser.LOGIN]);
		if(rs.next()){
			NS_SEGNALAZIONE_DECESSO.idenLettera = rs.getString("VALORE1");
		}
		if (NS_SEGNALAZIONE_DECESSO.firma=='S'){
			NS_SEGNALAZIONE_DECESSO.firmaSegnalazione();
		}
		else
			location.reload();
	},
	
	regKO : function(){
		alert('Errore nella registrazione della lettera di trasferimento');	
	},
	
	firmaSegnalazione: function(){

		var classFirma = 'firma.SrvFirmaPdf';
		if (WindowCartella.basePC.ABILITA_FIRMA_DIGITALE=='S'){
			classFirma = 'firma.SrvFirmaPdfMultipla';
		}
		var url = 	"servletGeneric?class="+classFirma+
					"&typeFirma=P7M"+//+LETTERA_TRASFERIMENTO.funzione+
					"&typeProcedure=SEGNALAZIONE_DECESSO"+						
					"&tabella=CC_LETTERA_VERSIONI"+
					"&idenLettera="+NS_SEGNALAZIONE_DECESSO.idenLettera+
					"&idenVersione="+NS_SEGNALAZIONE_DECESSO.idenLettera+
					"&idenVisita="+document.EXTERN.IDEN_VISITA.value+
					"&idenPer="+baseUser.IDEN_PER+
					"&reparto="+NS_SEGNALAZIONE_DECESSO.retrieveConfigurazioneReparto(WindowCartella.getAccesso("COD_CDC"));
		if (NS_SEGNALAZIONE_DECESSO.idenLetteraPrecedente!=null){
			url = url + 
					"&idenLetteraPrecedente="+NS_SEGNALAZIONE_DECESSO.idenLetteraPrecedente+
					"&statoLetteraPrecedente="+NS_SEGNALAZIONE_DECESSO.statoLetteraPrecedente;
			
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
	
	stampa: function()
	{	
		var vDati=WindowCartella.getForm(document);

		var funzione	= 'SEGNALAZIONE_DECESSO';
		var anteprima	= 'S';
		var reparto		= vDati.reparto;
		var sf			= '&prompt<pIdenVisita>='+document.EXTERN.IDEN_VISITA.value;
		WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);	
	}
    
    
    
    
}
function getToday(){
	var dd="";
	var mm="";
	var yyyy="";
	var DataOdierna = "";
	var d = new Date();                           //Crea oggetto Date.	
	
	dd = ("00" + d.getDate().toString());
	dd = dd.substr((-dd.length%2)+2,2);
	mm = ("00" + (parseInt(d.getMonth() +1)).toString());
	mm = mm.substr((-mm.length%2)+2,2);
	yyyy = d.getFullYear().toString();       
	DataOdierna = dd + "/"  + mm + "/" + yyyy;
	return 	DataOdierna ;
}

