var pin                 = "";
var tip_referti         = "";
var tip_reparto         = "";
var already_do          = "";
var ok                  = true;
var referti             = "";
var currentIdenRef      = "";
var currentReparto      = "";
var currentProgressivo  = "";
var currentIdenVr       = "";
var lungh;
var now_cont;
var wndAttesa;
var array_firmati_SN;
var fileDao             = "NO";
var Stampa              = "SI";

function anteprima_referto() {
    
    var doc         = document.form_stampa;
    var referto     = stringa_codici(array_iden_ref);

    if(referto == '')
    {
        alert('Prego, effettuare una selezione');
        return;
    }
    
    try {
        
        if(referto.split('*').length > 1) {
            
            alert('Prego, effettuare una sola selezione');
            return;
            
        }
        
    } catch(e) {
    ;
    }

    doc.action                      = 'elabStampa';
    doc.target                      = 'wndPreviewPrint';
    doc.method                      = 'POST';

    doc.stampaSorgente.value        = 'firma_digitale_multipla';
    doc.stampaFunzioneStampa.value  = 'REFERTO_STD';
    doc.stampaIdenRef.value         = referto;

    doc.stampaAnteprima.value       = "S";

    var wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");

    if (wndPreviewPrint) {
        
        wndPreviewPrint.focus();
        
    } else {
        
        wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
        
    }

    doc.submit();
    
}

function firma_multipla() {
    
    var controllo;
    var prova               = '';
    var refertiControllo    = '';
    referti                 = stringa_codici(array_iden_ref);
    tip_referti             = stringa_codici(array_tipo_referto);
    tip_reparto             = stringa_codici(array_reparto);
    var lungh_array         = array_iden_ref.length;

	try{
		if (referti.split("*").length < 1 ) {
			alert('Selezionare almeno un referto per poter utilizzare la firma multipla.')
			return;
		}
		/*Controllo di non rifirmare Referti già firmati*/
		refertiControllo        = referti;
		ArrControllo            = refertiControllo.split("*")
		lunghControllo          = ArrControllo.length;
		ret_n_tip               = n_tipi(tip_referti);
		arr_ret_n               = ret_n_tip.split("*");
		var richiesta           = false;
	
		if (arr_ret_n[1] > 0 || arr_ret_n[0] > 0) {
			
			if (! confirm(' Ci sono ' + arr_ret_n[1] + ' referti non modificati dall utente \n Ci sono ' + arr_ret_n[0] + ' referti non pronti per firma dall utente \n') ) {
				return;
			}
		}
		/*
		if( confirm(' Si desidera Stampare i referti dopo averli selezionati?') ) {
			try {
				
				ocxf_multipla.setStampaAutomatica();
				ocxf_multipla.setStampaStampanteDefault(basePC.PRINTERNAME_REF_CLIENT);
				Stampa = 'SI';
				
			} catch(e) {
			;
			}
		} else {
			Stampa = 'NO';
		}
		*/
		Stampa = 'NO';
		array_firmati_SN        = new Array();
		for (t = 0; t  < lungh_array; t++) {
			array_firmati_SN.push( 0 );
		}
		firma();
	}
	catch(e){
		alert("firma_multipla - Error: " + e.description);
	}
}

function aggiorna(){ }

function n_tipi(arr_nec)
{
    var f   = 0;
    var s   = 0;
    var n   = 0;

    ArrS    = arr_nec.split("*");

    for (i = 0; i <= ArrS.length; i++)
    {

        if (ArrS[i]=='1') {
            
            f++;
            
        }
        
        if (ArrS[i]=='0') {
            
            s++;
            
        }
        
        if (ArrS[i]=='2') {
            
            n++;
            
        }

    }

    return f + '*' + n +'*'+ s;
    
}

function firma_ricor() {
    
    now_cont --;
    
	try{
		write_log("firma_ricor Called");
		try{		top.home.apri_attesa();		}catch(e){;}
		if( parseInt( now_cont )  >= 0 ) {
			write_log("Count: " + now_cont); 
			$('DIV.clsWorklist TABLE TR:nth-child(' + parseInt(vettore_indici_sel[now_cont] + 1)+ ') TD:nth-child(1)').css('background', 'orange');
			currentIdenRef      = ArrIdenRef[now_cont];
			currentReparto      = ArrReparto[now_cont];
			currentProgressivo  = "0";
			write_log("Inizio Firma " + currentIdenRef);
			if (basePC.ABILITA_FIRMA_DIGITALE == 'D') {
				write_log("call GetDaoMultiplo");				
				dwrDAO.GetDaoMultiplo(currentIdenRef,dwrEnd)
			} else {
				write_log("call CallAggVerRefMultiplo");								
				Update_Firmato.CallAggVerRefMultiplo(document.form_firma.iden_per.value+'*'+currentIdenRef,passo2);
			}
		}
		else {
			top.home.chiudi_attesa();			
			alert("Eseguita Firma Multipla");
			window.location.reload();
		}
	}
	catch(e){
		alert("firma_ricor - Error" + e.description);
	}
    
}

function firma() {

	try{
		write_log("Inserito Il pin");
		
		ArrReparto      = tip_reparto.split("*");
		ArrIdenRef      = referti.split("*");
		lungh           = ArrIdenRef.length;
		now_cont        = lungh;
		write_log("Numero Referti da Firmare: " + lungh);
		
		pin  = window.showModalDialog('pwd_rich.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
	
		firma_ricor();
	}
	catch(e){
		alert("firma - Error: " + e.description);
	}

}

function InitMainFirma(){
    
    try {
		if (basePC.ABILITA_FIRMA_DIGITALE != 'D') {
//			document.write('<OBJECT classid="clsid:C85A6712-F5AC-4C35-947A-34F8B0E4645C" id="ocxf_multipla">');
			document.write('<OBJECT classid="clsid:C85A6712-F5AC-4C35-947A-34F8B0E4645C" codebase ="cab/Firma_multipla/Firma_multipla.cab#version=1,0,0,0" id="ocxf_multipla">');
			document.write('<param name="percorso_http" value="'+percorso_http+'">');
			document.write('<param name="servlet" value="'+servlet+'">');
			document.write('<param name="stampante" value="">');
            document.write('<param name="webapp" value="">');			
			document.write('</object>');
			
		}
    } catch(e) {
		alert("InitMainFirma - Error:" + e.description);
    }
        
    write_log("Inizializzato ActiveX");
    
}

function passo2(ret){
    
    write_log("CallAggVerRef Return= (OK*idenRef*PROGR)" + ret);
    
    arrErr      = ret.split("*");
    
    if(arrErr[0] == 'KO') {
        
        write_log("Errore Referto("+ currentIdenRef +") CallAggVerRef:"+(arrErr[1]));
        
        ok      = false;
        // document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#FF0000';
//        addClass(document.all.oTable.rows(vettore_indici_sel[now_cont]), "red");
		$('DIV.clsWorklist TABLE TR:nth-child(' + parseInt(vettore_indici_sel[now_cont] + 1)+ ') TD').css('background', 'red');
        firma_ricor();
        
    } else {
        
        currentProgressivo  = arrErr[2];
        currentIdenVr       = arrErr[3];
		write_log("call Firma_documento, idenRef: " + currentIdenRef +", reparto: " + currentReparto + ", progr: " + currentProgressivo + ", pin: " + pin);
        file                = ocxf_multipla.Firma_documento(currentIdenRef,currentReparto,currentProgressivo,pin);
        write_log("Aggiunta la versione "+ arrErr[2] +" del referto " + arrErr[1]);
        
        passo3(file);
        
    }
    
}

function passo3(B64File){

    if (B64File=='') {
        
        write_log("File vuoto Consultare log ocx")
        
        alert('IMPOSSIBILE IMPORTARE IL FILE. Si prega di aggiornare la lista di lavoro prima di proseguire.');
        ok      = false;
        //document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#FF0000';
//        addClass(document.all.oTable.rows(vettore_indici_sel[now_cont]), "red");
		$('DIV.clsWorklist TABLE TR:nth-child(' + parseInt(vettore_indici_sel[now_cont] + 1)+ ') TD:nth-child(1)').css('background', 'red');
    } else {
        
        write_log("File Compilato Eseguo L'update su db");
         
        Update_Firmato.UpdateDBDAO(currentIdenRef+"*"+currentProgressivo+"*F*"+ currentIdenVr+ "*"+ B64File+"*"+fileDao,passo4);
        
    }
    
}
    
function passo4(ret){
    
    write_log("Tentativo Esucuzione Update Db Return:" + ret);
    
    nome_procedura  = 'SP_UPDATE_STAMPATO_REF';
    
    if (ret === '0') {        
        
        //  document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#00FF00';
        addClass(document.all.oTable.rows(vettore_indici_sel[now_cont]), "green");
        array_firmati_SN[vettore_indici_sel[now_cont]] = 1;
        
        if(Stampa == 'SI'){
            
            dwr.engine.setAsync(false);
            //CJsUpdate.call_stored_procedure (nome_procedura +'@'+currentIdenRef+'@FALSE,@ ');
            toolKitDB.executeQueryData("BEGIN SP_UPDATE_STAMPATO_REF("+currentIdenRef+"); END;", rsStampato);
            dwr.engine.setAsync(true);
            
        }	
        
        write_log("Firma Ok Per il Referto "+ currentIdenRef + " passo al prossimo");
        firma_ricor();
        
    } else {
        
        write_log("Errore Per il Referto "+ currentIdenRef + " Eseguo il Rollback!");
        
        document.all.oTable.rows(vettore_indici_sel[now_cont]).style.backgroundColor = '#FF0000';

    }
    
}

function afterRollback(valore) {
    
    firma_ricor();
    
}

function write_log(stringa) {
    
    var a               = null;
    var path            = ocxf_multipla.GetPathToLog()
    var ForAppending    = 8;
    var File_Log        = path + "log_firma_javascript.txt";
    var fs              = new ActiveXObject("Scripting.FileSystemObject");
    
    if (!fs.FileExists(File_Log)) {
        
        fs.CreateTextFile (File_Log)
        
    }
    
    a   = fs.OpenTextFile(File_Log, ForAppending, false);
    a.Write(stringa);
    a.WriteBlankLines(1);
    a.Close();
    
}

function dwrEnd(variabileRit){

    ArrS = variabileRit.split("*");
    
    if (ArrS[0] == '0') {
        
        if (ArrS[1] == 'OK') {
            
            if (ArrS[2] == 'NO') {
                
                fileDao     = ArrS[2];
                Update_Firmato.CallAggVerRefMultiplo(document.form_firma.iden_per.value+'*'+currentIdenRef,passo2);
                
            } else {
                
                fileDao     = ocxf_multipla.Firma_DAO(ArrS[2],pin);
                Update_Firmato.CallAggVerRefMultiplo(document.form_firma.iden_per.value+'*'+currentIdenRef,passo2);
                
            }
            
        }
        
    }
    
}

function seleziona_tutti()
{

    for(indice = 0; indice < array_iden_ref.length; indice ++) {
        
        addClass(document.all.oTable.rows(indice), "sel");
        //document.all.oTable.rows(indice).style.backgroundColor = sel;
        nuovo_indice_sel(indice);
        
    }
    
}






// JavaScript Document
var typeClose='S'
function initOBJfirmaSanter(){
    altezza = screen.height-60;
    largh = screen.width-25;
    document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=1,0,0,2"  id="pdfReader">');
    // id="pdfReader">');
    document.write('<param name="width" value="'+largh+'">');
    document.write('<param name="height" value="'+altezza+'">');
    document.write('<param name="top" value="0">');
    document.write('<param name="left" value="0">');
    document.write('<param name="preview" value="S">');
    document.write('<param name="PDFurl" value="'+pdfPosition+'">');
    document.write('<param name="OffTop" value="'+OffsTop+'">');
    document.write('<param name="OffLeft" value="'+OffsLeft+'">');
    document.write('<param name="Rotate" value="'+Rotation+'">');
    document.write('<param name="trace" value="S">');
    document.write('<param name="numCopy" value="'+n_copie+'">');
    document.write('<param name="zoomFactor" value="75">');
    document.write('<param name="zoomFit" value="">');
    document.write('<param name="printerName" value="'+selezionaStampante+'">');
    //alert(selezionaStampante);
    document.write('<param name="driverName" value="">');
    document.write('<param name="portName" value="">');
    document.write('</object>');
    //document.all.pdfReader.PrintVisible(false);
    //document.all.pdfReader.PrintOnVisible(false);
    document.all.pdfReader.PDFurl=pdfPosition;
    document.all.pdfReader.printAll();
    identificaOperatore()
}


function closeforzata (prova){

    if (document.id_chiusura.HinputFirmatoS_N.value=='N')
    {
        if (typeClose=='S')
        {

            //    Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);
            opener.closeforzata(ID_referto+'*'+progr);
            self.close();

        }
    }
    else
    {
        self.close();
    }

}

function closeCNS(prova){
    var conferma
    if (document.id_chiusura.HinputFirmatoS_N.value=='N')
    {

        conferma=confirm("Verranno Perse Tutte Le Modifiche continuare?")

        if (conferma)
        {
            //Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm);
            opener.chiudi();
            self.close();
        }


    }
    else
    {
        opener.chiudi();
        self.close();
    }
}
function closeOnlyFirma()
{

    typeClose='N'
    self.close();
//Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);

}

function salva_refertoFirmato(){

    if(document.id_aggiorna.HinputRefFirmato.value.length > 50 )

    {

        Update_Firmato.UpdateDBDAO(ID_referto+'*'+progr+'*'+document.id_aggiorna.HinputRefValidatoFirmato.value+'*'+document.id_aggiorna.HIden_vr.value+'*'+document.id_aggiorna.HinputRefFirmato.value+'*'+document.id_aggiorna.HinputDAO.value,aggiornaForm)

        try {
            opener.registrazioneAbilitata = false;
            // diabilito medico refertante
            opener.disableLinkMedRiferimento();
            // nascondo il pulsante di salvataggio
            opener.hideSaveButton();
        }
        catch(e){
        ;
        }
    }
    else
    {

    //Update_Firmato.RollBackDb(ID_referto+'*'+progr,aggiornaForm2);

    }


}


function aggiornaForm(ret){
    if (ret=="0")
    {
        document.id_chiusura.HinputFirmatoS_N.value='S'
    }
    else
    {
        alert("Errore Archiviazione Firma  " + ret)
        document.id_chiusura.HinputFirmatoS_N.value='N'
    }

}


function aggiornaForm2(ret){

    if (ret=="")
    {
        document.id_chiusura.HinputFirmatoS_N.value='S'
        self.close();
    }
    else
    {
        alert("Errore Archiviazione Firma  " + ret)
        document.id_chiusura.HinputFirmatoS_N.value='N'
        self.close();
    }

}
function firmaSanter(variabile){
    var myObj= new ActiveXObject("ActiveXSissWay.CallSissWayWin");


    //bb="<MIA.selPaz><appl>IMAGO</appl><omettiEsenzioni>S</omettiEsenzioni><cognomeCittadino></cognomeCittadino><nomeCittadino></nomeCittadino><dataNascitaCittadino></dataNascitaCittadino><sessoCittadino>M</sessoCittadino><codiceFiscaleCittadino></codiceFiscaleCittadino><codiceSanitarioCittadino></codiceSanitarioCittadino></MIA.selPaz>"
    var aa;
    //alert(myObj);

    var ToSend=document.id_aggiorna.HinputDAO.value.replace("<naturaReferto></naturaReferto>","<naturaReferto>01</naturaReferto>");
    aa=myObj.sendRequest(ToSend);
    //alert(aa);
    myObj.terminate();
    Update_Firmato.UpdateDBDAOSanter(ID_referto+'*'+progr+'*'+document.id_aggiorna.HIden_vr.value+'*'+aa,dwrEndUpdateSanter);
}



function dwrEndUpdateSanter(variabile){
//alert(variabile);


}
function identificaOperatore(){
    var myObjId= new ActiveXObject("ActiveXSissWay.CallSissWayWin");
    var Id;
    Id=myObjId.sendRequest('<MIA.operatore><appl>IMAGO</appl></MIA.operatore>');
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async="false";
    xmlDoc.loadXML(Id)
    var cfsc=xmlDoc.getElementsByTagName("codiceFiscale")[0].childNodes[0].nodeValue;
    xmlDoc1=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc1.async="false";
    xmlDoc1.loadXML(document.id_aggiorna.HinputDAO.value)
    var cfpolaris=xmlDoc1.getElementsByTagName("codiceFiscaleMedico")[0].childNodes[0].nodeValue;
    if (cfsc!=cfpolaris)
    {
        alert("Medico Refertante diverso dal medico della SmartCard")
        self.close();
    }

}

function firma_multiplaSanter()
{
    var controllo;
    var prova='';
    var refertiControllo='';
    referti = stringa_codici(array_iden_ref);
    tip_referti = stringa_codici(array_tipo_referto);
    tip_reparto =stringa_codici(array_reparto)
    var lungh_array = array_iden_ref.length;

    if (referti=='')
    {
        alert('Selezionare almeno un referto')
        return;
    }
    /*Controllo di non rifirmare Referti già firmati*/
    refertiControllo=referti+"*";
    ArrControllo=refertiControllo.split("*")
    lunghControllo = ArrControllo.length;

    /*
	for (controllo=0;controllo<lunghControllo;controllo++)
	{

		if (array_firmati_SN[vettore_indici_sel[controllo]]==1)
		{

			alert('Impossibile Firmare Referti già Firmati')
			return;

		}
	}
-----------------------------------*/

    ret_n_tip=n_tipi(tip_referti);

    arr_ret_n=ret_n_tip.split("*");
    var richiesta=false;


    if (arr_ret_n[1]>0 || arr_ret_n[0] >0)
    {
        richiesta=confirm(' Ci sono ' + arr_ret_n[1] + ' referti non modificati dall utente \n Ci sono ' + arr_ret_n[0] + ' referti non pronti per firma dall utente \n')
        if (!richiesta)
        {
            return;
        }
    }


    firmaSanterMulti();

}

var ArrrefSiss;
function firmaSanterMulti(){
    document.apriAttesaSalvataggio('firmaSanterMulti2()');
//firmaSanterMulti2()
}

function firmaSanterMulti2(){
    //y=document.all.idHeaderTableWk.rows(0).insertCell().innerHTML="Result"
    var refSiss=referti.toString().replace(/\*/g, "@");
    ArrrefSiss=refSiss.split("@");
    //alert('Inizio Firma Multipla');

    dwr.engine.setAsync(false);
    dwrDAO.GetXMLMultiplo("REF.FirmaMarcaArchiviaMultipla*"+refSiss+"*"+baseUser.IDEN_PER,AfterFirmaSanter);
    dwr.engine.setAsync(true);
    document.chiudiAttesaSalvataggio();

}

var array_Idenvr="";

function AfterFirmaSanter(VarRetSanterProc){

    VarRetSanter=VarRetSanterProc.split("#")[0];
    Vararray_Idenvr=VarRetSanterProc.split("#")[1].substring(1);
    array_Idenvr=Vararray_Idenvr.split(",");
    var ToSign='<m:REF.firmaMarcaArchivia xmlns:m="http://santer.it/schemas/SISSWAY/2007-01/firmaMarcaArchivia/" dataSetVersion="1.0">';
    ToSign=ToSign+'<appl>RIS</appl>';
    ToSign=ToSign+'<mostraGui>N</mostraGui>';
    ToSign=ToSign+'<documenti>'+VarRetSanter+'</documenti>';
    ToSign=ToSign+'</m:REF.firmaMarcaArchivia>';
    //alert(ToSign);
    var myObj= new ActiveXObject("ActiveXSissWay.CallSissWayWin");
    var aa;
    aa=myObj.sendRequest(ToSign);

    myObj.terminate();
    xmlDoc1=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc1.async="false";
    xmlDoc1.loadXML(aa);

    try{
        var faultstring=xmlDoc1.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue;
        alert(faultstring);
    }
    catch(e){
        var esitoOperazione=xmlDoc1.getElementsByTagName("esito")[0].childNodes[0].nodeValue;
        

        if (esitoOperazione=="OK")
        {
            //errorObject = httpRequestObject.responseXML.getElementsByTagName("ERROR")[0];

            salvaReferti();
        }
    }
}

var contat=-1;

function salvaReferti(ritorno){

    var esito="";
    var identificativo;
    var contenuto;
    var uriReferto;
    var autorizzazioneFirmata;
    contat++;
    if (contat<ArrrefSiss.length)
    {
        esito=""
        codErrore=""
        nerrore=""
		
        document.all.oTable.rows(vettore_indici_sel[contat]).style.backgroundColor =  '#FF6600'
        try{
			 

            esito = xmlDoc1.getElementsByTagName("documenti/documento/esitoOperazione")[contat].text;
            try{
                codErrore=xmlDoc1.getElementsByTagName("documenti/documento/listaEccezioni/eccezione")[contat].text
			
                nerrore=codErrore.indexOf('link logico')
            }
            catch(e)
            {
            //alert("Err Codice" + e.message);
            }


            if (esito=="OK" || nerrore>5)
            {
         	 
                identificativo = xmlDoc1.getElementsByTagName("documenti/documento/identificativoDocumento")[contat].text;
	          
                contenuto = xmlDoc1.getElementsByTagName("documenti/documento/contenutoFirmato")[contat].text;
                uriReferto=""
                try{
                    uriReferto = xmlDoc1.getElementsByTagName("documenti/documento/uriReferto")[contat].text;
                }
                catch(e)
                {
                    uriReferto = codErrore.split(' ')[codErrore.split(' ').length-1]
                //alert("Err Uri " + e.message);
                }
				
                autorizzazioneFirmata = "X";
		  
                //  var nodes = xmlDoc1.getElementsByTagName("/documentidocumento/esitoOperazione")[i].text;
                currentIdenRef=identificativo.split("_")[0]
		  

                currentProgressivo=identificativo.split("_")[1]

                document.all.oTable.rows(vettore_indici_sel[contat]).style.backgroundColor = '#00FF00';
                document.all.oTable.rows(vettore_indici_sel[contat]).cells(1).innerHTML=uriReferto
                document.all.oTable.rows(vettore_indici_sel[contat]).cells(1).title=uriReferto
                Update_Firmato.UpdateDBDAO(currentIdenRef+"*"+currentProgressivo+"*F*"+array_Idenvr[contat]+ "*"+ contenuto+"*"+autorizzazioneFirmata,salvaReferti)
            }
            else
            {
                try{
                    document.all.oTable.rows(vettore_indici_sel[contat]).style.backgroundColor = '#FF0000';
                    document.all.oTable.rows(vettore_indici_sel[contat]).cells(1).innerHTML=xmlDoc1.getElementsByTagName("documenti/documento/codiceErrore")[contat].text
                    document.all.oTable.rows(vettore_indici_sel[contat]).cells(1).title=xmlDoc1.getElementsByTagName("documenti/documento/listaEccezioni/eccezione")[contat].text
                }
                catch(e)
                {
                    //alert("Err" + e.message);

                    document.all.oTable.rows(vettore_indici_sel[contat]).style.backgroundColor = '#FF0000';

                }

                salvaReferti();
            }
        }
        catch(e){
            alert("General" + e.message);
        }
    }
    else
    {
        alert('Eseguita Firma multipla')
    }

}


function anteprima_multipla(){
    var refertiToPrint  = stringa_codici(array_iden_ref);
    if (refertiToPrint=='')
    {
        alert('Selezionare almeno un referto');
        return;
    }
    refertiToPrint=refertiToPrint.toString().replace(/\*/g, ",");
    alert(refertiToPrint);

    var firstreferto=refertiToPrint.split(',')[0];
    alert(refertiToPrint);
    var doc = document.form_stampa;

    doc.action = 'elabStampa';
    doc.target = 'wndPreviewPrint';
    doc.method = 'POST';

    doc.stampaSorgente.value       = 'firma_digitale_multipla';
    doc.stampaFunzioneStampa.value = 'REFERTO_MULTIPLO_STD';
    doc.stampaIdenRef.value        = firstreferto;

    var campo_stampaSelection = document.createElement("input");
    campo_stampaSelection.type = 'hidden';
    campo_stampaSelection.name = 'stampaSelection';
    campo_stampaSelection.value = '{ESAMI.IDEN_REF} in [' +refertiToPrint+ ']';
    doc.appendChild(campo_stampaSelection);

    var campo_stampaReparto = document.createElement("input");
    campo_stampaReparto.type = 'hidden';
    campo_stampaReparto.name = 'stampaReparto';
    campo_stampaReparto.value = basePC.DIRECTORY_REPORT;
    doc.appendChild(campo_stampaReparto);

    doc.stampaAnteprima.value      = "S";

    var wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");

    if (wndPreviewPrint)
    {
        wndPreviewPrint.focus();
    }
    else
    {
        wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
    }

    doc.submit();
}


function rsStampato(response){ ;}