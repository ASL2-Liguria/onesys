var esami="";
function AccTutti(){

esami = array_iden_esame;
//alert(esami);
esami=esami.toString().replace(/\,/g, "*");

//alert(esami);
AccMul(esami);
}

function AccSelez(){


esami = stringa_codici(array_iden_esame);
AccMul(esami);



}

function AccMul(prova){



var finestra = window.open("accettazioneEsame?Hiden_esame="+prova,"wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("accettazioneEsame?Hiden_esame="+prova,"wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}



}

function aggiorna (){
//alert(esami);

var richiesta=false;
richiesta=confirm('Si vogliono stampare le etichette per gli esami associati?')
initbasePC();
//alert(esami);
var esami2=esami.replace("[*]",",");
//alert(esami2);
if (richiesta)
{
		var finestra  = window.open('elabStampa?stampaFunzioneStampa=STAMPA_MULTIETI_STD&stampaIdenEsame=' + esami2 + '&stampaAnteprima=S&stampaReparto='+basePC.DIRECTORY_REPORT+"","","top=0,left=0");

		if(finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra  =window.open('elabStampa?stampaFunzioneStampa=STAMPA_MULTIETI_STD&stampaIdenEsame=' + esami2 + '&stampaAnteprima=S&stampaReparto='+basePC.DIRECTORY_REPORT+"","","top=0,left=0");
		}
	}
else
{
//	alert(parent.Worklist.name);
	parent.Filtri.creaAnteprima();
}

}
