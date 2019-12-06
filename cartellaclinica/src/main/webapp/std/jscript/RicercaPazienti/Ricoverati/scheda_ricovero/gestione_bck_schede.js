/**
 * Apre un popup che visualizza lo storico dei salvataggi della scheda.
 *
 * @author           gianlucab
 * @version          1.1
 * @param key_campi  id dell'elemento HTML o sequenza di id correlati logicamente separati da @
 * @param from_in    (opzionale) stringa di valore 'cc_bisogni_ricovero_bck' (default), 'cc_scale_bck' o 'cc_schede_xml_bck'
 * @param key_in     (opzionale) specifica il KeyLegame, ovvero il nome della tabella SQL
 * @param tipo_in    (opzionale) specifica se l'elemento è di tipo TEXT, TEXTAREA, CHECK, SELECT, RADIO, ...
 * @param tipo_cod   (opzionale) stringa di valore 'IDEN' (default) o 'CODICE'
 * @param iden_bck   (opzionale) gli iden della tabella di bck (per PROGRAMMA_RIABILITATIVO)
 * @since            2014-03-21
 */
function apriBck(key_campi,from_in,key_in,tipo_in,tipo_cod,iden_tab){
	from_in = (typeof from_in === 'string') ? from_in.toLowerCase() : '';
	key_in = (typeof key_in === 'string') ? key_in : null;
	tipo_in = (typeof tipo_in === 'string') ? tipo_in : null;
	tipo_cod = (typeof tipo_cod === 'string') ? tipo_cod.toUpperCase() : 'IDEN';
	
    if(document.location.href.indexOf("servletSynthesis?") == -1){
        //if(document.forms.length<=2){
        keyLegame = document.EXTERN.KEY_LEGAME.value;
    }else{
        var obj = event.srcElement;
        while(obj.nodeName.toUpperCase() !='FORM'){
            obj = obj.parentNode;
        }
        keyLegame = obj.name;
    }

    idenVisita= document.EXTERN.IDEN_VISITA.value;
    switch(from_in){
		case 'cc_bisogni_ricovero_bck': case '':
    		myFromWhere=" FROM CC_BISOGNI_RICOVERO XML JOIN CC_BISOGNI_RICOVERO_BCK CC on CC.iden_originale = XML.iden where XML.FUNZIONE=''"+keyLegame+"'' and XML.iden_visita= "+idenVisita+" order by XML.iden";
    		break;
        case 'cc_scale_bck':
            myFromWhere=" from CC_SCALE XML JOIN CC_SCALE_BCK CC on CC.iden_originale = XML.iden where XML.FUNZIONE=''"+keyLegame+"'' and XML.iden_visita= "+idenVisita+" order by CC.iden";
            break;
        case 'cc_schede_xml_bck':
            myFromWhere=" from CC_SCHEDE_XML XML JOIN CC_SCHEDE_XML_BCK CC on CC.iden_originale = XML.iden where XML.FUNZIONE=''"+keyLegame+"'' and XML.iden_visita= "+idenVisita+" order by CC.iden";
            break;
        case 'programma_riabilitativo':
            myFromWhere=" from RADSQL_BCK.PROGRAMMA_RIABILITATIVO cc where IDEN in ("+iden_tab+") order by data_ultima_modifica DESC";
            break;
        default:
     }

    if (key_in != null)
        keyLegame=key_in;
    myUteData = ","+getUteIns()+","+getStrData();
    query="";

    var campi = key_campi.split("@");
    var title=new Array();

    query="SELECT CC.iden ";

    // se i campi appartengono alla pagina aperta
    if (key_in == null && tipo_in==null){
        for (indice in campi) {
            if (typeof document.all[campi[indice]] !== 'undefined')
            {

                switch (document.all[campi[indice]].nodeName)
                {
                    case "SELECT":
                        query+= "," +getTabCodifiche(campi[indice],tipo_cod=='CODICE'?keyLegame:null) + " as SELECT"+indice;
                        title[indice]='';

                        continue;

                    case "INPUT":

                        query+= ","+	extract(campi[indice]) + " as SELECT"+indice;
                        if (document.all[campi[indice]].getAttribute('type')=='checkbox')
                            title[indice]=document.all[campi[indice]].parentNode.getElementsByTagName('label')[0].innerText;
                        else
                            title[indice]='';

                        continue;

                    //attenzione... i campi di testo INPUT li vede anche come TEXTAREA se non ci fosse il continue
                    case "TEXTAREA":

                        query+= ","+	extract(campi[indice])  + " as SELECT"+indice;
                        title[indice]='';

                        continue;

                }
                //alert(document.all[key_campo][0].nodeName);
                try{

                    switch (document.all[campi[indice]][0].nodeName)
                    {
                        case "INPUT":
                            query+= "," +getTabCodifiche(campi[indice],tipo_cod=='CODICE'?keyLegame:null) + " as SELECT"+indice;
                            title[indice]='';

                    }
                }
                catch(e){
                }
            }
        }
    }
    //se devo aprire dei campi di una pagina diversa devo essere passati in input anche il tipo dei campi
    else if (tipo_in!=null) {
        var tipo_campi = tipo_in.split("@");
        for (indice in campi) {

            if (tipo_campi[indice]=='TEXT' || tipo_campi[indice]=='TEXTAREA' || tipo_campi[indice]=='CHECK')
            {
                query+= ","+	extract(campi[indice]) + " as SELECT"+indice;
                title[indice]='';
            }
            else if (tipo_campi[indice]=='SELECT' || tipo_campi[indice]=='RADIO'){
                query+= "," +getTabCodifiche(campi[indice],tipo_cod=='CODICE'?keyLegame:null) + " as SELECT"+indice;
                title[indice]='';
            }
            else{
                query+= ","+	extract(campi[indice]) + " as SELECT"+indice;
                title[indice]='';
            }
        }

    }

    query+=myUteData+myFromWhere;
  //  alert(query);
    openPage(query,title);


}

    function openPage(sql,titleCampi){
    window.showModalDialog("bckValues?Query="+sql+"&title="+titleCampi,null,"dialogHeight:200px;dialogWidth:700px;scroll:yes");
}

function extract(key){
    return 	"extractValue(CC.contenuto,''/PAGINA/CAMPI/CAMPO[@KEY_CAMPO=\""+key+"\"]'' )";
}
function extractNumber(key){
    return 	"to_number("+extract(key)+")";
}
function getUteIns(){
    return "(select descr from radsql.tab_per where iden ="+extractNumber("USER_ID")+") as USER_ID ";
}
/**
 * Restituisce la query SQL che estrae da un XML di backup il valore del campo selezionato.
 *
 * @author            gianlucab
 * @version           1.1
 * @param  key        l'id dell'elemento della tabella HTML
 * @param  keyLegame  (opzionale) il nome della tabella SQL (se non è null utilizza CODICE al posto di IDEN)
 * @return            la stringa che definisce la query SQL
 * @since             2014-03-21
 */
function getTabCodifiche(key,keyLegame){
	if (typeof keyLegame === 'undefined' || keyLegame == null)
		return "(select descrizione from TAB_CODIFICHE where IDEN="+extractNumber(key)+")";
	else
		return "(select descrizione from TAB_CODIFICHE where CODICE="+extract(key)+" and TIPO_DATO=''"+key+"'' and TIPO_SCHEDA=''"+keyLegame+"'')";
}
function getStrData(){
    return "to_char(CC.data_ultima_modifica,''dd/MM/yyyy hh24:mi'') AS DATA ";
}