/*LINO - FUNZIONE GENERICA DI STAMPA*/
var repartoCdc = '';
/*function stampa(funzione,sf,anteprima,reparto,stampante)
{
	
	url =  'elabStampa?stampaUrl='+ getAbsolutePath();
	url += 'stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;

	var pBinds = new Array();
	
	if(reparto!=null && reparto!='')
	{
		pBinds.push('');
		pBinds.push('');
		pBinds.push(reparto);
		pBinds.push('STAMPA_'+funzione);

		top.dwr.engine.setAsync(false);
		top.dwrUtility.executeStatement('stampe.xml','RecuperoCDC.Stampa',pBinds,1,callBack);
		top.dwr.engine.setAsync(true);
		
		url += '&stampaReparto='+repartoCdc;
	}
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra)
	{	
		finestra.focus();
	}
    else
	{
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
}
*/
/* Stampa normali, non configurabili
 * Richiesta Radiologica
 * Etichette
 *  */
function stampaNoRepConfig(funzione,sf,anteprima,reparto,stampante)
{
	var url =  'elabStampa?stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;
	if(reparto!=null && reparto!='')		
		url += '&stampaReparto='+reparto;
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra)
	{	
		finestra.focus();
	}
    else
	{
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
	
    try{
        opener.top.closeWhale.pushFinestraInArray(finestra);
		}
    catch(e){}
}


function stampaConf ()
{
	url =  'elabStampa?stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;

	var key = 'STAMPA_'+funzione;
	if(reparto!=null && reparto!='')
	{
		url += '&stampaReparto='+baseReparti.getValue(reparto,key);
	}
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra)
	{	
		finestra.focus();
	}
    else
	{
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}

    try{
        opener.top.closeWhale.pushFinestraInArray(finestra);
		}
    catch(e){}	
}


function stampaFoglioDiPrenotazione(percorso,funzione,sf,anteprima,reparto,stampante)
{
	var url = url + percorso;
	if(reparto!=null && reparto!='')
		url += reparto+"/"+funzione;	
	if(sf!=null && sf!='')
		url += "&sf="+sf;	

	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

    try{
        opener.top.closeWhale.pushFinestraInArray(finestra);
		}
    catch(e){}	
}


function getAbsolutePath()
{
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

function callBack(reply)
{
	if (reply[0]=='KO')
	{
		alert('Errore sulla Configurazione del Reparto del Report\n'+reply[1]);
	}
	else
	{
		repartoCdc=reply[2];
	}
}