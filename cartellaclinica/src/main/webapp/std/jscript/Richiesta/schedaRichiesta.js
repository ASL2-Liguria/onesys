var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
	try {
		while((window.WindowCartella.name != 'Home' || window.WindowCartella.name != 'schedaRicovero') && window.WindowCartella.parent != window.WindowCartella){
			var name = window.WindowCartella.parent.name; // SecurityError Test
			window.WindowCartella = window.WindowCartella.parent;
		}
	} catch(e) {}

    jQuery(document).find("legend").click(function(){

        var obj = jQuery(this);
        addEventFieldset(obj);

    });

    jQuery("input[type=text]").addClass("text_class");

    controllaLunghezze();

    $('#txtPeso,#txtAltezza,#txtDiuresi_L,#txtGravidanza_L').blur(checkInputVal);
});

function aux_preSalvataggio(){

    document.EXTERN.STAMPA.value = "S";
    preSalvataggio();
}


function addEventFieldset(obj){

    if(obj.hasClass("closed")){
        obj.removeClass("closed");
    }else{
        obj.addClass("closed");
    };

    obj.next().toggle(150);

}

function apriControindicazioni(){

    var doc = document.dati;
    var controind = '';
    var idenAnag = '';

    doc.Hiden_controindicazioni.value = genera_stringa_codici(doc.cmbControindicazioni, ",");
    controind = doc.Hiden_controindicazioni.value;
    idenAnag = document.EXTERN.Hiden_anag.value;

    if(controind == ''){
        controind = '-1';
    }

    where_condition_sx = " iden_anag="+idenAnag+" and iden not in ("+ controind +") and superato = 'N' and descrizione is not null and visualizza_in_altri_ricoveri = 'S' and deleted = 'N' ";
    where_condition_dx = " iden in ("+ controind +") and superato = 'N' and descrizione is not null and visualizza_in_altri_ricoveri = 'S' and deleted = 'N' ";

    //where_condition_sx = " iden_anag="+idenAnag+" and iden not in ("+ controind +") and superato_lineare = 'N' and descrizione_lineare is not null ";
    //where_condition_dx = " iden in ("+ controind +") and superato_lineare = 'N' and descrizione_lineare is not null ";

    var servlet = 'SL_Scelta?where_condition_sx='+where_condition_sx+'&where_condition_dx='+where_condition_dx;
    servlet += '&table=radsql.VIEW_CC_ALLERTE_RICOVERO&ltitle=lblCntInd&campo_descr=cmbControindicazioni&campo_iden=Hcontroindicazioni';
    servlet += '&elencoCampiSelect=iden@descrizione&IDEN_ANAG='+idenAnag;

    var finestra = window.open(servlet,'','fullscreen=yes, resizable = yes, status=yes');
    try{
    	WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
    }catch(e){
    	
    }
}



//funzione che cambia l'html del pulsante all'apertua della pagina di richiesta
function cambiaPulsante(){

    if (document.EXTERN.LETTURA.value == 'S'){
        //label = 'Stampa'
        document.getElementById('lblStampa').parentElement.innerHTML='<A id=lblStampa href=javascript:stampa_scheda_richiesta();>Stampa</A>';
    }else{
        //label = 'Registra/Stampa'
    	document.getElementById('lblStampa').parentElement.innerHTML='<A id=lblStampa href=javascript:aux_preSalvataggio();>Registra/Stampa</A>';
    }
}


//funzione che carica data e ora se sono presenti nella cartella nei campi voluti
function caricaDataOraInput(idParamData, idParamOra, idCampoData, idCampoOra){

    //nome del parametro data per andare a prendersi il valore corretto
    var paramData = typeof idParamData == 'undefined' ? 'DataAppuntamento' : idParamData;
    //nome del parametro ora per andare a prendersi il valore corretto
    var paramOra = typeof idParamOra == 'undefined' ? 'OraAppuntamento' : idParamOra;

    //id del campo data da valorizzare
    var campoData = typeof idCampoData == 'undefined' ? 'txtDataProposta' : idCampoData;
    //id del campo ora da valorizzare
    var campoOra = typeof idCampoOra == 'undefined' ? 'txtOraProposta' : idCampoOra;


    try{

        data=WindowCartella.DatiInterfunzione.get(paramData);

        if(data != ''){
            document.getElementById(campoData).value = isoToDate(data);
            //rimuovo la data dal top dopo che l'ho utilizzata
            //WindowCartella.DatiInterfunzione.remove(paramData);
        }

    }catch(e){
        alert(e.description);
    }

    try{

        ora=WindowCartella.DatiInterfunzione.get(paramOra);

        if(ora != ''){
            document.getElementById(campoOra).value = ora;
            //rimuovo l'ora dal top dopo che l'ho utilizzata
            //WindowCartella.DatiInterfunzione.remove(paramOra);
        }

    }catch(e){
        alert(e.description);
    }

    var msgDebug="DEBUG funzione caricaDataOraInput:\n\n ";
    msgDebug += "\n  Parametro della data: "	+paramData;
    msgDebug += "\n  Parametro dell'ora: "		+paramOra;
    msgDebug += "\n  ID del campo Data: "		+campoData;
    msgDebug += "\n  ID del campo Ora: "		+campoOra;
    msgDebug += "\n  Data: "					+isoToDate(data);
    msgDebug += "\n  Ora: "						+ora;

    //alert(msgDebug);
}


//funzione associata al pulsante chiudi della scheda richiesta
function chiudi(){

    //alert(parent.name);
    if (parent.name == 'WHALE_winVisRich' ){
        try{WindowCartella.opener.aggiorna();}catch(e){}
        WindowCartella.close();

    }else{

        if (parent.name != ''){
        	WindowCartella.apriWorkListRichieste();
        }else{
        	WindowCartella.opener.aggiorna();
        	WindowCartella.close();

        }
    }
}


//funzione che controlla la posizione della scheda e chiude in maniera corretta. 
//Nel caso la scheda sia in modifica fa il refresh della wk delle richieste. Il parametro di getAfterSave viene gestito
//dalle modalità di cartella in IMAGOWEB.CONFIG_MENU_REPARTO
function chiudiScheda(){

    var afterSave='';

    try{
        afterSave = WindowCartella.ModalitaCartella.getAfterSave(document);

    }catch(e){
        //alert(e.description);
    }

    if (baseUser.LOGIN=='matteopi'){
        /*alert(afterSave);*/
    }

    switch (afterSave) {

        case 'checkAssociaPrestazioneCheckAppuntamentiReloadWk':

            gestionePrestazioneAssociata();


        case 'checkAppuntamentiReloadWk':

        	WindowCartella.PostInserimento.CheckAppuntamento();


        case 'reloadWk':

			if (typeof(WindowCartella.document.EXTERN.ARRIVATO_DA)!='undefined' && typeof(WindowCartella.document.EXTERN.ARRIVATO_DA.value)!='undefined' && (WindowCartella.document.EXTERN.ARRIVATO_DA.value=='PS')){
				setTimeout(function(){ WindowCartella.close(); }, 3000);
			}else{
				WindowCartella.apriWorkListRichieste();				
			}			

            break;

        case 'checkAssociaPrestazioneCheckAppuntamentiShowRiepilogo':

            gestionePrestazioneAssociata();


        case 'checkAppuntamentiShowRiepilogo':

        	WindowCartella.PostInserimento.CheckAppuntamento();

        // per esempio DH
        case 'ShowRiepilogo':

        	WindowCartella.apriRiepilogo();
            break;
        //MODALITA' INS_RICH_PREN //////////
        case 'chiudiCartella':
        	
        	WindowCartella.close();

            break;

        //RICHIESTA DA RICERCA PAZIENTE //////////
        case '':
        default:

        	WindowCartella.apriWorkListRichieste();
            //WindowCartella.close();

            break;
    }
}

function gestionePrestazioneAssociata(){

    switch (_STATO_PAGINA){
        case 'E' : modificaPrestazioneAssociata();
            break;
        case 'I' : associaPrestazione();
            break
        default : alert('stato pagina non riconosciuto ' + _STATO_PAGINA);
    }
}

    function modificaPrestazioneAssociata(){
        var vId = $('#KEY_ID').val();
        var vData = clsDate.str2str($('#txtDataProposta').val(),'DD/MM/YYYY','YYYYMMDD');
        var vOra = $('#txtOraProposta').val();
        var vDati = WindowCartella.getForm(document);
        
        if(typeof OE_RICHIESTA == 'undefined'){
	//		WindowCartella.FunzioniCartella.warn("OE modificaPrestazioneAssociata() - Funzione interrotta forzatamente causa l'assenza dell'oggetto 'OE_RICHIESTA'");
			return;
		}


        OE_RICHIESTA.callBackModifiche(
            vId,
            {
                data : vData,
                ora : vOra,
                iden_anag: vDati.iden_anag,
                cod_pro: vDati.cod_dec_Reparto,
                reparto_sorgente:   vDati.reparto,
                reparto_destinatario:   document.EXTERN.DESTINATARIO.value
        });
    }

    function associaPrestazione(){


        //if (_STATO_PAGINA == 'I'){

        if (document.EXTERN.CODICI_ESTERNI && document.EXTERN.CODICI_ESTERNI.value != null){
            //richiesta associata ad eseme già inserito
            return;
        }

        var vDati = WindowCartella.getForm(document);

        var conf = WindowCartella.baseReparti.getValue(vDati.reparto,'OE_ASSOCIA_PRESTAZIONE');
        /*
         si aspetta un oggetto con la seguente struttura:
         {
         <CDC DESTINATARIO>:{"COD_AREA":<tab_are.cod_dec>,"COD_PREST":<tab_esa.cod_dec>}}
         }

         */
        if(conf == null || conf == ""){
            return;
        }

        eval("var conf = " + conf + ";");

        var destinatario = document.EXTERN.DESTINATARIO.value;

        if(typeof conf[destinatario] == 'undefined'){
            return;
        }

        WindowCartella.executeAction(
            "Richieste",
            "associaPrestazioni",
            {
                iden_anag:		WindowCartella.getPaziente("IDEN"),
                iden_ricovero:	WindowCartella.getRicovero("IDEN"),
                iden_visita:	WindowCartella.getAccesso("IDEN"),
                COD_PROV:		WindowCartella.getReparto("COD_DEC"),
                COD_PREST:		conf[destinatario].COD_PREST,
                COD_AREA:		conf[destinatario].COD_AREA
            },
            function(response){

                if(!response.success){
                    alert("Sono stati riscontrati problemi durante l'inserimento di una o più prestazioni:\n\n"+response.message);
                }

            }
        );
        /*}else{

         var vDati = WindowCartella.getForm(document);

         var conf = WindowCartella.baseReparti.getValue(vDati.reparto,'OE_ASSOCIA_PRESTAZIONE');

         if(conf == null || conf == ""){
         return;
         }

         eval("var conf = " + conf + ";");

         var destinatario = document.EXTERN.DESTINATARIO.value;

         if(typeof conf[destinatario] == 'undefined'){
         return;
         }

         alert('associato ad un altra richiesta');

         }  */

    }

    function controllaCampiNumerici(campo, label) {

        var descrizione = label.innerText;
        var contenutoDopoReplace = campo.value.replace (',','.');

        campo.value = contenutoDopoReplace;

        if (baseUser.LOGIN == 'lucas'){
            // alert ('contenuto dopo replace: '+campo.value);
            // alert ('campo: '+campo);
            // alert ('label: '+label);
            // alert ('contenuto: '+contenutoDopoReplace);
            // alert ('descrizione: '+descrizione);
        }

        if (isNaN(campo.value)){
            alert ('il valore immesso in '+' " ' +descrizione+' " '+' non è un numero. Il campo richiede un valore numerico');
            campo.value= '';
            campo.focus();
            return;
        }
    }


// funzione che controlla la correttezza della data proposta inserita
    function controllaDataProposta(numeroRiga,range){

        var rangeGG = '';
        var obj = '';

        if (typeof numeroRiga == 'undefined'){
            obj = document.getElementById('txtDataProposta');
        }else{
            obj = document.getElementById('txtDataProposta'+numeroRiga);
        }

        if (typeof range != 'undefined'){
            rangeGG = range;
        }else{
            rangeGG = 30000; //10000 per ogni anno futuro che voglio prendere in considerazione). Non possono inserire per più di tre anni in futuro
        }

        var dataProposta= obj.value;

        //alert('dataProposta: '+dataProposta+'\nRANGE: '+rangeGG);

        if (dataProposta!=''){

            if (dataProposta.length<10){

                alert('Inserire la data in un formato corretto (dd/MM/yyyy)');

                obj.value='';
                obj.focus();
            }

            if(controllo_data(dataProposta).previous){

                alert('Attenzione! La data programmata per il prelievo è precedente alla data odierna');

                obj.value='';
                obj.focus();
            }

            if(controllo_data(dataProposta, rangeGG).nextRange){

                //alert('Attenzione! La data programmata per il prelievo supera di troppi giorni la data odierna.\n\nInserire una data distante nel tempo max '+range+' giorni da oggi');

                if(!confirm('Attenzione! La data programmata per il prelievo supera di troppi giorni la data odierna.\n\nContinuare con la data inserita?\n\n\n\n\nNOTA INFORMATIVA:\nE\' consigliabile inserire una data proposta che non superi di oltre '+rangeGG+' giorni la data odierna')){
                    obj.value='';
                    obj.focus();
                }
            }
        }
    }



//funzione che controlla la lunghezza del campo ora. Nel caso sia minore del dovuto cancella il campo e sposta il focus sul campo stesso. Da mettere sull'evento onblur
    function controllaOraProposta(){

        var oggetto = document.all['txtOraProposta'];

        if (oggetto.value != ''){

            if (oggetto.value.toString().length < 4) {

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


//function che controlla le lunghezze di campi sensibili
    function controllaLunghezze(){


        var msgQuadro='Attenzione: il quadro clinico contiene %s caratteri mentre la lunghezza massima consentita è di 1000 caratteri.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
        var msgQuesito='Attenzione: il quesito contiene %s caratteri mentre la lunghezza massima consentita è di 2000 caratteri.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
        var msgNote='Attenzione: le note contengono %s caratteri mentre la lunghezza massima consentita è di 4000.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
		
        try{
            jQuery("#txtQuadroClinico").keyup(function(){maxlength(this, 1000, msgQuadro.replace("%s", $(this)[0].value.length))});
        }catch(e){}

        try{
            jQuery("#txtQuadroClinico_L").keyup(function(){maxlength(this, 1000, msgQuadro.replace("%s", $(this)[0].value.length))});
        }catch(e){}

        try{
            jQuery("#txtQuesito").keyup(function(){maxlength(this, 2000, msgQuesito.replace("%s", $(this)[0].value.length))});
        }catch(e){}

        try{
            jQuery("#txtQuesito_L").keyup(function(){maxlength(this, 2000, msgQuesito.replace("%s", $(this)[0].value.length))});
        }catch(e){}

        try{
            jQuery("#txtNote").keyup(function(){maxlength(this, 4000, msgNote.replace("%s", $(this)[0].value.length))});
        }catch(e){}

        try{
            jQuery("#txtNote_L").keyup(function(){maxlength(this, 4000, msgNote.replace("%s", $(this)[0].value.length))});
        }catch(e){}

    }


//function da richiamare in questa maniera: if(controllo_data('20101216').metodo); restituisce true o false per ogni metodo
//range è il numero di giorni di range futuri da non considerare nel controllo
//
    function controllo_data(data, range, retroattivo){

        /***** DESCRIZIONE DEI METODI DELLA FUNZIONE ******************************************************************************************************************

         .previous			TRUE  -->  se la data è PRECEDENTE rispetto a quella odierna
         .next				TRUE  -->  se la data è POSTERIORE rispetto a quella odierna
         .equal				TRUE  -->  se la data è quella odierna
         .nextRange			TRUE  -->  se la data è MAGGIORE rispetto ad oggi del nr di giorni passati
         .previousRange		TRUE  -->  se la data e MINORE rispetto ad oggi di almeno il nr di giorni passati

         data 		: data da controllare (si può passare la data nel formato yyyyMMdd o nel formato dd/MM/yyyy
         range 		: è il numero di giorni di range futuri da considerare nel controllo, può essere undefined
         retroattivo : S-N-undefined ; se S il range vale anche per il passato, se N (default) solo per il futuro, se non viene passato metto N

         *************************************************************************************************************************************************************/

        //range di giorni che passo alla funzione... è facoltativo!
        var rangeGG=1000;
        var abilitaRetroattivita = (typeof retroattivo == 'undefined' ? 'N' : 'S') ;

        if (typeof range !='undefined'){ rangeGG = range; }

        var str =data.toString();
        var data= new Date();
        var giorno= data.getDate() ;
        var mese=data.getMonth() +1;
        var anno=data.getYear();

        function cls(){
            this.previous = false;
            this.next = false;
            this.equal = false;
            this.nextRange = false;
            this.previousRange = false;
        }

        if (giorno.toString().length <2){
            //alert ('giorno prima della modifica: '+giorno);
            giorno = '0'+giorno;
        }

        if (mese.toString().length <2){
            //alert ('mese prima della modifica: '+mese);
            mese = '0'+mese;
        }

        var oggi=anno.toString()+mese.toString()+giorno.toString(); //creo una variabile con la data odierna in formato yyyyMMdd
        var dataControl ='';

        var myClass = new cls();

        if (str.length>8){
            //controllo se la lunghezza è maggiore di 8(yyyyMMdd) vuol dire che la data è in formato dd/MM/yyyy. Faccio una substring in modo da trasformarla...
            dataControl=str.substr(6,4)+str.substr(3,2)+str.substr(0,2);
            //alert('data da controllare:'+dataControl+'e oggi: '+oggi);

        }else{
            dataControl=str;
            //alert('dataControl: '+dataControl);
        }

        //alert('data da controllare:'+dataControl+'e oggi: '+oggi);

        if(dataControl>oggi){
            //alert('next');
            myClass.previous = false;
            myClass.next=true;
            myClass.equal = false;
            myClass.nextRange = false;
            myClass.previousRange = false;
        }

        if(dataControl==oggi){
            //alert('equal');
            myClass.previous = false;
            myClass.next=false;
            myClass.equal = true;
            myClass.nextRange = false;
            myClass.previousRange = false;
        }

        if(dataControl<oggi){
            //alert('previous');
            myClass.previous = true;
            myClass.next=false;
            myClass.equal = false;
            myClass.nextRange = false;
            myClass.previousRange = false;
        }

        if((dataControl - oggi) > rangeGG){

            //alert('nextRange');
            myClass.previous = false;
            myClass.next=false;
            myClass.equal = false;
            myClass.nextRange = true;
            myClass.previousRange = false;
        }

        if(abilitaRetroattivita == 'S'){
            if((oggi - dataControl) > rangeGG){

                //alert('previousRange');
                myClass.previous = false;
                myClass.next=false;
                myClass.equal = false;
                myClass.nextRange = false;
                myClass.previousRange = true;
            }
        }

        return myClass;
    }


    function genera_stringa_codici(sel, carattere){

        //alert(sel + '\n ' + carattere);

        var idx;
        var ret = '';

        for(idx = 0; idx < sel.length; idx++){

            if(ret != '')
                ret += carattere; //'*';

            ret += sel[idx].value;
        }
        return ret;
    }


//prende parametri dal top
    function  gup( name ){

        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var tmpURL = WindowCartella.location.href;
        var results = regex.exec( tmpURL );

        if( results == null ){
            return "";
        }else{
            return results[1];
        }
    }

//funzione che viene lanciata al caricamento delle pagine di richiesta se inserita nel js specifico
    function isoToDate(dataIso){

        //popolo la data proposta se ho il parametro
        try{
            if(typeof dataIso != 'undefined'){

                //alert(dataWork);
                var data = dataIso.substring(6,8) + '/' + dataIso.substring(4,6) + '/' + dataIso.substring(0,4);
                //alert(data);

                return data;
            }
        }catch(e){
            //alert(e.description);
        }

    }

//funzione che rende lo stato campo obbligatorio
    function obbligaCampo(campoDestinazione, labelDestinazione){

        //alert ('entro nella funzione');

        campoDestinazione.STATO_CAMPO = 'O';
        labelDestinazione.STATO_CAMPO = 'O';
        campoDestinazione.STATO_CAMPO_LABEL = labelDestinazione.name;

        // alert('className PRIMA: '+labelDestinazione.parentElement.className);
        // alert('className.length PRIMA: '+labelDestinazione.parentElement.className.length);

        if (labelDestinazione.parentElement.className.substring(labelDestinazione.parentElement.className.length-2,labelDestinazione.parentElement.className.length) != '_O'){
            if (labelDestinazione.parentElement.className=='classTdLabelLink' || labelDestinazione.parentElement.className=='classTdLabel' ){
                labelDestinazione.parentElement.className = labelDestinazione.parentElement.className + "_O";
            }
        }
        // alert('className DOPO: '+labelDestinazione.parentElement.className);
    }


//funzione che preleva l'iden di testata_richieste prima di effettuare la registrazione in modo da stamapre il report
    function prelevaIdRichiesta(){

        dwr.engine.setAsync(false);
        toolKitDB.getResultData('select VALORE1 from TAB_WORK where WEBUSER = \'' + baseUser.LOGIN + '\' and TIPO = \'RICHIESTA_INSERITA\'', resp_check);
        dwr.engine.setAsync(true);
    }


//funzione che preleva l'iden di testata_richieste prima di effettuare la registrazione in modo da stamapre il report
    function prelevaIdConsulenza(){

        dwr.engine.setAsync(false);
        toolKitDB.getResultData('select VALORE1 from TAB_WORK where WEBUSER = \'' + baseUser.LOGIN + '\' and TIPO = \'CONSULENZA_INSERITA\'', resp_check);
        dwr.engine.setAsync(true);
    }


//funzione che impedisce il salvataggio in modalità visualizzazione
    function registraScheda(){

        //alert (document.EXTERN.LETTURA.value);
        if (document.EXTERN.LETTURA.value == 'S'){

            alert ('Impossibile salvare in modalità VISUALIZZAZIONE');
            return;

        }else{
            registra();
        }
    }


//callback delle precedenti funzioni
    function resp_check(resp){

        //alert('Iden della richiesta: '+resp);

        document.EXTERN.ID_STAMPA.value  = resp;

        if (document.EXTERN.STAMPA.value == 'S'){
            stampa_scheda_richiesta();
        }
    }



//funzione generica di stampa per tutte le schede richiesta
function stampa_scheda_richiesta(){

	var idRichiesta	='';
	var stampante 	= null;

	var keyLegame   = $('INPUT#KEY_LEGAME').val();
	var reparto 	= $('INPUT#DESTINATARIO').val();

	if ($('INPUT#LETTURA').val() == 'N'){
		
		idRichiesta = $('INPUT#ID_STAMPA').val()          

		if (idRichiesta == ""){
			alert ('Salvataggio non effettuato');
			return;
		}
	}

	if ($('INPUT#LETTURA').val() == 'S')            
		idRichiesta = $('#KEY_ID').val();       

	var funzione = reparto + '_' + keyLegame;
	var anteprima= basePC.PRINTERNAME_REF_CLIENT == '' ? 'S' : 'N';

	
	if (baseUser.LOGIN == 'arry' ){
		alert('ALERT SOLO PER ADMIN' +
			  '\n Funzione : ' + funzione +
			  '\n Reparto : ' + reparto +
			  '\n Id Richiesta: ' + idRichiesta +
			  '\n Lettura: ' + $('INPUT#LETTURA').val() +
			  '\n Printer: ' + basePC.PRINTERNAME_REF_CLIENT
		)
		anteprima	= 'S';
	}
	var sf = '&prompt<pIdenTestata>=' + idRichiesta;
	WindowCartella.stampa(funzione,sf,'S',reparto,null);
			
	chiudiScheda();
}



//funzione che svuota completamente il listbox
    function svuotaListBox(elemento){

        var object;
        var indice;

        if (typeof elemento == 'String'){
            object = document.getElementById(elemento);
        }else{
            object = elemento;
        }

        if (object){

            indice = parseInt(object.length);

            while (indice>-1){
                object.options.remove(indice);
                indice--;
            }
        }
    }

//funzione che effettua il controllo degli input valorizzati (peso, altezza,diuresi)
function checkInputVal(){
    //questo xk viene richiamata 2 volte al blur
        var valore_inserito = $(this).val();
        if(valore_inserito == ''){
           return;
        }
        if(isNaN(valore_inserito)){
            $(this).val('');
            return alert("Attenzione inserire un valore numerico");
        }
        var cod_cdc = $('#HrepartoRicovero').val();
        var id = $.trim($(this).attr('id'));
        var isGravidanza = false;

        var cod_parametro = null;
        switch(id){
            case 'txtPeso':cod_parametro = 'PESO';
                break;
            case 'txtAltezza':cod_parametro = 'ALTEZZA';
                break;
            case 'txtDiuresi_L':cod_parametro = 'DIURESI';
                break;
            case 'txtGravidanza_L':
                if(parseInt(valore_inserito) > 49){alert('Attenzione il valore inserito è superiore al valore massimo previsto')};
                return;
                break;
            default: cod_parametro = ''; return alert('cod_parametro non riconosciuto');
        }


            var  response =  WindowCartella.NS_PARAMETRI.checkRange(valore_inserito,cod_cdc,{cod_parametro:cod_parametro});


        if(response.lower){
            alert("Attenzione il valore inserito è inferiore al valore minimo previsto ");
            $(this).val('');
        }

        if(response.higher){
            alert("Attenzione il valore inserito è Superiore al valore massimo previsto ");
            $(this).val('');
        }

}



var NS_JSON_HL7 = {
    json_hl7_pid_3 : function(idNumber, identifierTypeCode) {
        return {
            "ID_Number"                         : idNumber,             // ID Number
            "Assigning_Authority"               : "",                   // Assigning Authority
            "Identifier_Type_Code"              : identifierTypeCode,   // Identifier Type Code
            "Expiration_Date"                   : "",                   // Expiration Date
            "Assigning_Juris_Diction"           : "",                   // Assigning Juris-Diction
            "Assigning_Agency_Of_Department"    : ""                    // Assigning Agency Of Department            
        };
    },
    json_hl7_pid : function(idPatient) {
        var pid = null;
        var rs = WindowCartella.executeQuery("cartellaPaziente.xml", "getPaziente", idPatient);
        
        if (rs.next()) {
            var _3 = [];
            _3.push(NS_JSON_HL7.json_hl7_pid_3(rs.getString("IDEN"), "PK"));
            _3.push(NS_JSON_HL7.json_hl7_pid_3(rs.getString("TESSERA_SANITARIA"), "SSN"));
            _3.push(NS_JSON_HL7.json_hl7_pid_3(rs.getString("COD_FISC"), "CF"));
            
            pid = {
                "_3": _3,
                "_5": 
                {
                    "NAME"      : rs.getString("NOME"), // Name
                    "SURNAME"   : rs.getString("COGN")  // Surname
                },
                "_7": rs.getString("DATA"),     // Date/Time of Birth
                "_8": rs.getString("SESSO"),    // Administrative Sex
                "_11": 
                {
                    "Street_Address"        : "",   // Street Address
                    "City"                  : "",   // City
                    "Zip_Or_Postal_Code"    : "",   // Zip Or Postal Code
                    "Address_Type"          : "",   // Address Type
                    "Country_Parish_Code"   : ""    // Country Parish Code
                }         
            };
        } else return alert("Paziente sconosciuto");
        
        return pid;
    },
    json_hl7_pv1 : function() {
        var pv1 = {
            "_2": "", // Patient Class
            "_3":
            {
                "Point_Of_Care"         : "",   // Point Of Care
                "Location_Description"  : ""    // Location Description
            }            
        };
        
        return pv1;
    },
    json_hl7_patient_visit : function() {
        return {"_PV1": NS_JSON_HL7.json_hl7_pv1()};
    },
    json_hl7_patient : function(idPatient) {
        return {
            "_PID"              : NS_JSON_HL7.json_hl7_pid(idPatient),
            "_PATIENT_VISIT"    : NS_JSON_HL7.json_hl7_patient_visit()
        };
    },
    json_hl7_orc : function(idDoctor, dateExams) {
        var rs = WindowCartella.executeQuery("personaleMedico.xml", "getPersonaleMedico", idDoctor);
        var orc = null;
        
        if (rs.next()) {
            orc = {
                "_1": "NW",         // Order Control
                "_2": "",           // Placer Orden Number
                "_4": "",           // Placer Group Number
                "_7": "",           // Quantity Timing
                "_9": dateExams,    // Date/Time of Transition
                "_12":
                {
                    "ID_Number"                 : rs.getString("IDEN"),     // ID Number
                    "Family_Name"               : rs.getString("COGNOME"),  // Family Name
                    "Given_Name"                : rs.getString("NOME"),     // Given Name
                    "Name_Representation_Code"  : rs.getString("COD_FISC")  // Name Representaion Code
                },
                "_21":
                {
                    "Organization_Name"         : "",   // Organization Name
                    "Identifier_Type_Code"      : "",   // Identifier Type Code
                    "Organization_Identifier"   : ""    // Organization Identifier
                },
                "_29":
                {
                    "Identifier": "" // Identifier
                }
            };
        } else return alert("Personale medico sconosciuto");

        return orc;
    },
    json_hl7_tq1 : function() {
        var tq1 = {
            "_1": "",   // Set ID - TQ1
            "_7": "",   // Start date/time
            "_9": ""    // Priority           
        };
        
        return tq1;
    },
    json_hl7_timing : function() {
        return {"_TQ1": NS_JSON_HL7.json_hl7_tq1()};
    },
    json_hl7_obr : function(idExam, descExam, dateExams) {
        var obr = {
            "_4":
            {
                "Identifier"                        : idExam,   // Identifier
                "Text"                              : descExam, // Text
                "Name_Of_Coding_System"             : "",   // Name_Of_Coding_System
                "Alternate_Identifier"              : "",   // Alternate_Identifier
                "Name_Of_Alternate_Coding_System"   : ""    // Name_Of_Alternate_Coding_System
            },
            "_7": dateExams // Requested Date/Time
        };

        return obr;
    },
    json_hl7_obx : function() {
        var obx = {
            "_3"    : "",   // Observation Identifier
            "_11"   : ""    // Observation Result Status            
        };
        
        return obx;
    },
    json_hl7_observation : function() {
        return {"_OBX": NS_JSON_HL7.json_hl7_obx()};
    },
    json_hl7_spm : function() {
        var spm = {
            "_4": "" // Specimen Type   
        };
        
        return spm;
    },
    json_hl7_specimen : function() {
        return {"_SPM": NS_JSON_HL7.json_hl7_spm()};
    },
    json_hl7_observation_request : function(idExam, descExam, dateExams) {
        var observation = [];
        observation.push(NS_JSON_HL7.json_hl7_observation());
        
        return {
            "_OBR"          : NS_JSON_HL7.json_hl7_obr(idExam, descExam, dateExams),
            "_OBSERVATION"  : observation,
            "_SPECIMEN"     : NS_JSON_HL7.json_hl7_specimen()
        };
    },
    json_hl7_order : function(idDoctor, idExam, descExam, dateExams) {
        return {
            "_ORC"                  : NS_JSON_HL7.json_hl7_orc(idDoctor, dateExams),
            "_TIMING"               : NS_JSON_HL7.json_hl7_timing(),
            "_OBSERVATION_REQUEST"  : NS_JSON_HL7.json_hl7_observation_request(idExam, descExam, dateExams)
        };
    },
    json_hl7 : function(idPatient, idDoctor, idExams, descExams, dateExams) {        
        var patient = NS_JSON_HL7.json_hl7_patient(idPatient);
        var order = [];
        
        for (i = 0; i < idExams.length; i++)
            order.push(NS_JSON_HL7.json_hl7_order(idDoctor, idExams[i], descExams[i], dateExams));
        
        var json = {
            "PAZIENTE": 
            {
                "ID": idPatient
            },
            "_PATIENT"  : patient,
            "_ORDER"    : order
        };
        
        return json;
    }
};

