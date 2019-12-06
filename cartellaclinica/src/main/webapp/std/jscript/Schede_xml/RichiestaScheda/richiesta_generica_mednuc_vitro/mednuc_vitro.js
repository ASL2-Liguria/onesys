var _filtro_list = null;
var urgenzaGenerale = '';
var dataAppuntamento='';
var a=new Array();
var WindowCartella = null;

jQuery(document).ready(function(){


    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
    caricamento(_STATO_PAGINA);

    switch (_STATO_PAGINA){

        // 	INSERIMENTO ////////////////////////////////
        case 'I':

            //ONBLUR  txtOraProposta
            jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });

            //ONKEYUP  txtOraProposta
            jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });

            //ONBLUR  txtDataProposta
            jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });

            //ONBLUR  txtNumImp
            jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});

            //ONBLUR  txtAltezza
            jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });

            //ONBLUR  txtDiuresi_L
            jQuery("#txtDiuresi_L").blur(function(){
                controllaCampiNumerici(document.dati.txtDiuresi_L,document.all['lblDiuresi_L']);
                controllaDiuresi();
            });

            //ONBLUR  txtGravidanza_L
            jQuery("#txtGravidanza_L").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza_L,document.all['lblGravidanza_L']);});

            //ONBLUR  txtPeso
            jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });

            //ONLOAD  body
            valorizzaMed();
            document.all['lblStampa'].parentElement.style.display = 'none';
            nascondiCampi();
            cambiaPulsante();
            /*document.all.hUrgenza.value = '0';*/
            setUrgenza();
            if(typeof document.EXTERN.URGENZA != 'undefined'){
                setUrgenzaScheda();
            }
            document.getElementById('txtDiuresi_ore').value='24';
            document.getElementById('txtDiuresi_ore').style.visibility='hidden';

            break;

        // MODIFICA ////////////////////////////////
        case 'E':

            //ONBLUR  txtOraProposta
            jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });

            //ONKEYUP  txtOraProposta
            jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });

            //ONBLUR  txtDataProposta
            jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });

            //ONBLUR  txtNumImp
            jQuery("#txtNumImp").blur(function(){ controllaCampiNumerici(document.dati.txtNumImp,document.getElementById('lblNumImp'));});

            //ONBLUR  txtAltezza
            jQuery("#txtAltezza").blur(function(){ controllaCampiNumerici(document.dati.txtAltezza ,document.all['lblAltezza']); });

            //ONBLUR  txtDiuresi_L
            jQuery("#txtDiuresi_L").blur(function(){
                controllaCampiNumerici(document.dati.txtDiuresi_L,document.all['lblDiuresi_L']);
                controllaDiuresi();
            });

            //ONBLUR  txtGravidanza_L
            jQuery("#txtGravidanza_L").blur(function(){ controllaCampiNumerici(document.dati.txtGravidanza_L,document.all['lblGravidanza_L']);});

            //ONBLUR  txtPeso
            jQuery("#txtPeso").blur(function(){ controllaCampiNumerici(document.dati.txtPeso,document.all['lblPeso']); });

            //ONLOAD  body
            valorizzaMed();
            setUrgenzaScheda();
            nascondiCampi();
            cambiaPulsante();
            document.all['lblStampa'].parentElement.style.display = 'none';
            //if(document.EXTERN.MODIFICA.value== 'S'){HideLayer('groupUrgenzaLabo'); }
            //$(".datepick-trigger").hide();
            document.getElementById('txtDiuresi_ore').value='24';
            document.getElementById('txtDiuresi_ore').style.visibility='hidden';
            document.getElementById('lblDiuresi_ore').style.visibility='hidden';

            break;


        // LETTURA ////////////////////////////////
        case 'L':

            //ONLOAD  body
            valorizzaMed();
            setUrgenzaScheda();
            cambiaPulsante();
            document.all['lblStampa'].parentElement.style.display = 'none';
            document.all['lblRegistraLabo'].parentElement.parentElement.style.display = 'none';
            if(document.EXTERN.LETTURA.value== 'S'){
                //HideLayer('groupUrgenzaLabo');
                HideLayerFieldset('divGroupUrgenzaLabo');
            }

            break;
    }
});


function caricamento(statoPagina){

    try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}

    //funzione che carica la data proposta se arriva in input
    if(statoPagina == 'I'){
        caricaDataOraInput();
    }
    
    jQuery("#txtQuesito_L").parent().css({float:'left'}).append($('<div></div>').addClass('classDivEpi').attr("title","Recupera Epicrisi").click(function() {
		var rs = WindowCartella.executeQuery("diari.xml", "getEpicrisiRicovero", WindowCartella.getRicovero("NUM_NOSOLOGICO"));
        // Recupero valori epicrisi e carico in textarea
        while (rs.next()) {
            $("#txtQuesito_L").append(rs.getString("EPICRISI") + "<br/>");
        }
    }));    

    try {
        var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
        oDateMask.attach(document.dati.txtUltimeMestrua);
        oDateMask.attach(document.dati.txtDataProposta);
    }catch(e){
        //alert(e.description);
    }

    document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';
}


/**
 /*
 Funzione richiamata all'apertura della pagina, valorizza il campo nascosto del medico
 */
function valorizzaMed(){

    //alert (baseUser.TIPO);
    //alert (document.EXTERN.LETTURA.value);
    //if (document.EXTERN.LETTURA.value != 'S' || document.EXTERN.MODIFICA.value !='S')

    if (document.EXTERN.LETTURA.value != 'S') {

        if (baseUser.TIPO == 'M'){

            document.dati.Hiden_MedPrescr.value = baseUser.IDEN_PER;
            document.dati.txtMedPrescr.value = baseUser.DESCRIPTION;
            document.dati.Hiden_op_rich.value = baseUser.IDEN_PER;
            document.dati.txtOpeRich_L.value = baseUser.DESCRIPTION;
            jQuery('#txtMedPrescr').attr("readOnly",true);

        }else{

            document.dati.Hiden_op_rich.value = baseUser.IDEN_PER;
            document.dati.txtOpeRich_L.value = baseUser.DESCRIPTION;

        }
    }

    if (typeof document.EXTERN.Hiden_pro != 'undefined'){
        document.dati.Hiden_pro.value = document.EXTERN.Hiden_pro.value;
    }
}

//funzione che modifica la label del div a seconda del grado dell'urgenza
function setUrgenza(){

    if (urgenzaGenerale ==''){
        urgenzaGenerale=document.getElementById('hUrgenza').value;
    }


    var urgenza = document.all.hUrgenza.value;

    //controllo se la pagina è in modalità di inserimento
    if (_STATO_PAGINA == 'I' || _STATO_PAGINA == 'E'){

        /*if (document.all.lblTitleUrgenza_L.innerText == '    Grado Urgenza:  ' + ' URGENZA    '){*/
        if(urgenzaGenerale !=  urgenza){
            if (document.getElementById('cmbPrestRich_L').options.length>0){
                if (!confirm('Attenzione! In seguito al cambio di urgenza verranno cancellate le analisi già scelte. Procedere ugualmente?')){
                    return;
                }else{
                    document.dati.HelencoEsami.value = '';
                    svuotaListBox(document.dati.cmbPrestRich_L);
                }
            }else{
                document.dati.HelencoEsami.value = '';
                svuotaListBox(document.dati.cmbPrestRich_L);
            }
        }else{
            svuotaListBox(document.dati.cmbPrestRich_L);
        }

        switch(urgenza){
            // Non urgente
            case '0':

                urgenzaGenerale='0';

                document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' ROUTINE    ';
                document.all.lblTitleUrgenza_L.className = '';
                addClass(document.all.lblTitleUrgenza_L,'routine');
                apriContenitoreLabo();
                break;

            // Urgenza
            case '2':

                urgenzaGenerale='2';

                document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' URGENZA    ';
                document.all.lblTitleUrgenza_L.className = '';
                addClass(document.all.lblTitleUrgenza_L,'urgenza');
                apriContenitoreLabo();
                break;

            // Emergenza
            case '3':

                urgenzaGenerale='3';

                document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ' + ' EMERGENZA    ';
                document.all.lblTitleUrgenza_L.className = '';
                addClass(document.all.lblTitleUrgenza_L,'emergenza');
                apriContenitoreLabo();
                break;

        }
        return;

    }else{

        alert ('Impossibile modificare il grado di urgenza');
    }
}

//funziona che modifica la label in modalità visualizzazione/modifica
function setUrgenzaScheda(){


    if (urgenzaGenerale ==''){
        urgenzaGenerale=document.EXTERN.URGENZA.value;
    }

    var urgenza = document.EXTERN.URGENZA.value;
    document.all.lblTitleUrgenza_L.innerText = 'Grado Urgenza';

    document.all.hUrgenza.value = urgenza;

    switch(urgenza){
        // Non urgente
        case '0':

            urgenzaGenerale='0';

            document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  ROUTINE    ';
            document.all.lblTitleUrgenza_L.className = '';
            addClass(document.all.lblTitleUrgenza_L,'routine')
            break;

        // Urgenza
        case '2':

            urgenzaGenerale='2';

            document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  URGENZA    ';
            document.all.lblTitleUrgenza_L.className = '';
            addClass(document.all.lblTitleUrgenza_L,'urgenza');
            break;

        // Emergenza
        case '3':

            urgenzaGenerale='3';

            document.all.lblTitleUrgenza_L.innerText = '    Grado Urgenza:  EMERGENZA    ';
            document.all.lblTitleUrgenza_L.className = '';
            addClass(document.all.lblTitleUrgenza_L,'emergenza');
            break;

    }
}

/**
 */
function genera_stringa_codici(sel, carattere){

    //alert(sel + '\n ' + carattere);
    var idx;
    var ret = '';

    for(idx = 0; idx < sel.length; idx++){
        if(ret != ''){
            ret += carattere; //'*';
        }
        ret += sel[idx].value;
    }

    return ret;
}

/**
 */
//funzione che 'prepara' i dati e valorizza i campi nascosti per il salvataggio. Alla fine lancia registra()
function preSalvataggio(){

    //var controindicazioni = '';
    var esami = '';
    var metodiche = '';
    var esaMetodica = '';
    var doc = document.dati;
    var materiali = '';

    /*
     //	Valorizza Hiden_controindicazioni leggendo i valori della ListBox cmbControindicazioni
     for(i = 0; i < doc.cmbControindicazioni.length; i++){

     if(doc.cmbControindicazioni.length-1 == i){
     controindicazioni += doc.cmbControindicazioni[i].value;
     }else{
     controindicazioni += doc.cmbControindicazioni[i].value + ',';
     }
     }

     doc.Hiden_controindicazioni.value = controindicazioni;
     */

    //	Valorizza HelencoEsami, HelencoMetodiche, Hmateriali leggendo i valori della ListBox cmbPrestRich_L dopo averli splittati [@] e ciclati
    for(var i = 0; i < doc.cmbPrestRich_L.length; i++){

        esaMetodica = doc.cmbPrestRich_L[i].value.split('@');

        if(metodiche != ''){
            metodiche += '#';
        }
        metodiche += esaMetodica[1];

    }

    doc.HelencoMetodiche.value ='';
    doc.HelencoMetodiche.value = metodiche;

    //	Se in Inserimento o modifica, valorizza il cdc_destinatario
    if (document.EXTERN.LETTURA.value == 'N'){
        doc.HcmbRepDest.value = document.EXTERN.DESTINATARIO.value;
    }

    //	Obbliagatorietà di scelta di almeno una prestazione
    var al = '';

    if (al != ''){

        alert (al);
        return;
    }

    // controllo la lunghezza dell'ora e il formato
    // controllaOraProposta();

    if (baseUser.LOGIN == 'lucas'){

        var debug = 'IDEN: ' + doc.Hiden.value;
        debug += '\nIDEN_ANAG: ' + document.EXTERN.Hiden_anag.value;
        debug += '\nUTE_INS: ' + document.all.Hiden_op_rich.value;
        debug += '\nIDEN_VISITA: ' + document.EXTERN.Hiden_visita.value;
        debug += '\nIDEN_PRO: ' + doc.Hiden_pro.value;
        debug += '\nREPARTO DEST: ' + document.EXTERN.DESTINATARIO.value;
        /*debug += '\nCONTROINDICAZIONI: ' + doc.Hiden_controindicazioni.value;*/
        debug += '\nESAMI: ' + doc.HelencoEsami.value;
        debug += '\nMETODICHE: ' + doc.HelencoMetodiche.value;
        debug += '\nURGENZA: ' + doc.hUrgenza.value;
        debug += '\nNOTE: ' + doc.txtNote_L.value;
        debug += '\nMEDICO: ' + doc.Hiden_MedPrescr.value;
        debug += '\nQUESITO: ' + doc.txtQuesito_L.value;
        debug += '\nOPERATORE: ' + doc.Hiden_op_rich.value;
        debug += '\nMATERIALI: ' + doc.Hmateriali.value;
        debug += '\nNOTE: ' + doc.Hnote.value;

        // alert(debug);
    }
    registra();
}

/**
 */


function stampa_scheda_richiesta(){

    var sf= '{TESTATA_RICHIESTE.IDEN}='+document.EXTERN.KEY_ID.value;
    var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_LABO_SPZ_0&stampaReparto=RICHIESTA_GENERICA_LABO_SPZ&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

    if(finestra){
        finestra.focus();
    }else{
        finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_GENERICA_LABO_SPZ_0&stampaReparto=RICHIESTA_GENERICA_LABO_SPZ&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
    }
}

//funzione che nasconde determinati campi in modalità di inserimento
function nascondiCampi(){
    document.all['lblMotAnn_L'].parentElement.style.display = 'none';
    document.all['txtMotivoAnnullamento_L'].parentElement.style.display = 'none';
    document.all['lblControindicazioni_L'].parentElement.style.display = 'none';
    document.all['cmbControindicazioni'].parentElement.style.display = 'none';
    //document.all['txtDataRichiesta_L'].parentElement.style.display = 'none';
    //document.all['lblDataRichiesta_L'].parentElement.style.display = 'none';
    //document.all['txtOraRichiesta_L'].parentElement.style.display = 'none';
    //document.all['lblOraRichiesta_L'].parentElement.style.display = 'none';
    //HideLayer('groupOperatoriLabo');
    HideLayerFieldset('divGroupOperatoriLabo')
}

function controllaCampiNumerici(campo, label) {

    var descrizione = label.innerText;
    var contenutoDopoReplace = campo.value.replace (',','.');

    campo.value = contenutoDopoReplace;

//	alert ('contenuto dopo replace: '+campo.value);
//	alert ('campo: '+campo);
//	alert ('label: '+label);
//	alert ('contenuto: '+contenutoDopoReplace);
//	alert ('descrizione: '+descrizione);

    if (isNaN(campo.value)){
        alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
        campo.value= '';
        campo.focus();
        return;
    }
}

//funzione che apre la servlet contenitore che contiene le servlet di scelta esami
function apriContenitoreLabo(){

    var urgenza = $('#hUrgenza').val();
   
    if(document.EXTERN.LETTURA.value !="S"){

		var url = "sceltaEsamiMedNucLaboGeneric?KEY_LEGAME=RICHIESTA_GENERICA_MEDNUC_VITRO";
		url	+= "&num_col=6&funzione_profili=scegliProfilo";
		url	+= "&REPARTO_RICHIEDENTE=" + document.EXTERN.HrepartoRicovero.value;
		url	+= "&CDC_DESTINATARIO=" + $('#DESTINATARIO').val();
		url	+= "&URGENZA=" + urgenza;
		url	+= "&TIPO=R";
		url	+= "&METODICA=0";
		url += "&INFO_COLONNA=" + baseReparti.getValue(WindowCartella.getForm().reparto,'MEDUC_RIA_COLONNA_INFO');

        var finestra = window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
       		try{
			WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
		}catch(e){
			
		}

		
		try{
			WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
		}catch(e){
			
		}
        //alert (url);
    }
}

//funzione che serve a formattare l'ora in inserimento. PER ORA NON FUNZIONA CON I NUMERI INSERITI DA TASTIERINO NUMERICO!!!!!!!!!!!!!!!!!!
function verificaOra(obj){
    obj.disableb = true;
    if(event.keyCode==8){ //backspace
        if(obj.value.toString().length==2 || obj.value.toString().length==3){
            obj.value=obj.value.substring(0,1);
        }
        obj.disabled = false;
        return;
    }
    if(obj.value.toString().length==1){
        if(event.keyCode>50 || event.keyCode<48)
            obj.value='';
        obj.disabled = false;
        return;
    }
    if(obj.value.toString().length==2){
        if(parseInt(obj.value.substring(0,1),10)==2){
            if(event.keyCode>51 || event.keyCode<48)
                obj.value=obj.value.substring(0,1);
            else{
                obj.value=obj.value+':';}
        }else{
            if(event.keyCode>57 || event.keyCode<48)
                obj.value=obj.value.substring(0,1);
            else{
                obj.value=obj.value+':';}
        }
        obj.disabled = false;
        return;
    }
    if(obj.value.toString().length==4){
        if(event.keyCode>53 || event.keyCode<48){
            obj.value=obj.value.substring(0,3);
        }
        obj.disabled = false;
        return;
    }
    if(obj.value.toString().length==5){
        if(event.keyCode>57 || event.keyCode<48){
            obj.value=obj.value.substring(0,4);
        }
        obj.disabled = false;
        return;
    }
    if(obj.value.toString().length>5){
        obj.value=obj.value.substring(0,5);
        obj.disabled = false;
        return;
    }
}


//funzione che rende lo stato campo obbligatorio per l'ora proposta
function obbligaCampoProposta(campoCondizione, campoDestinazione, labelDestinazione){

    if (campoCondizione.value !=''){

        campoDestinazione.STATO_CAMPO = 'O';
        labelDestinazione.STATO_CAMPO = 'O';
        campoDestinazione.STATO_CAMPO_LABEL = labelDestinazione.name;

        //alert('className PRIMA: '+labelDestinazione.parentElement.className);

        if (labelDestinazione.parentElement.className != 'classTdLabel_O'){

            labelDestinazione.parentElement.className = labelDestinazione.parentElement.className + "_O";
            //alert('className DOPO: '+labelDestinazione.parentElement.className);
        }
    }
}

//funzione che controlla la lunghezza del campo ora. Nel caso sia minore del dovuto cancella il campo e sposta il focus sul campo stesso. Da mettere sull'evento onblur	
function controllaOraProposta(){

    var oggetto = document.all['txtOraProposta'];

    if (oggetto.value != ''){

        if (oggetto.value.toString().length < 5) {

            alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM');
            oggetto.value = '';
            oggetto.focus();
        }
    }
}

//funzione che controlla che il valore della diuresi sia maggiore uguale a 100
function controllaDiuresi(){

    var oggetto=document.getElementById('txtDiuresi_L');

    if(oggetto.value !='' && oggetto.value <100){

        alert('Attenzione! Il valore deve essere superiore a 100 ml');
        oggetto.value = '';
        oggetto.focus();
    }
}