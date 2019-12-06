
/*Funzione che apre la finestra di scelta dei bidoni*/
function apri_lista_esami_cardio(target)
{

setRiga();	

var selezione;

selezione=array_iden[rigaSelezionataDalContextMenu];

if(selezione == ''){
		alert(ritornaJsMsg('selezionare'));//Prego, effettuare una selezione
		return;
	}
	
	var param = "select t.descr as descrizione,d.id_esame_dicom as iden from infoweb.dettaglio_richieste d, radsql.tab_esa t where d.iden_tab_esa=t.iden and iden_testata="+ selezione +" and id_esame_dicom is not null order by descr ";
	param += '@descrizione*iden';//il campo che voglio venga restituito nella finestra di scelta
	param += '@1*1';//il campo è di tipo stringa

	dwr.engine.setAsync(false);
	CJsUpdate.select(param, cbk_apri_lista_esami
);
	dwr.engine.setAsync(true);
}

/**/
function cbk_apri_lista_esami(elenco_esami)
{	
	
if (rigaSelezionataDalContextMenu==-1){
repartoDest = stringa_codici(array_cdc);

}
else
{
repartoDest=array_cdc[rigaSelezionataDalContextMenu];
}

	myObject = new Object();
	
	var appo = elenco_esami.split("$");
//	alert('elenco esami: '+ elenco_esami);
	
	 var app=appo[0].split("@");
	 var descr='';
	 var ides='';
	 for (indice in app) {
         if (IsNotUneven(indice)){
             ides=ides+'@'+app[indice];
      
         }
         else{
        	descr=descr+'@'+app[indice]; 
        
         }
 } 
	 
 
//	myObject.descr_bidoni = appo[0];
//	myObject.iden_bidoni  = appo[1];
		myObject.descr_bidoni = descr;
		myObject.iden_bidoni  = ides;


	//this.idEsameDicom=idEsame;
	myObject.cdcDest=repartoDest;
	
	//alert('BIDONI.DESCR: ' + myObject.descr_bidoni);
	//alert('BIDONI.IDEN: ' + myObject.iden_bidoni);

	win_bidoni = window.open('scelta_esami_cardio.html', 'win_bidoni','height=300px,width=900px,top=200px,left=80px,status=no');
}


function IsNotUneven(numero)
{
    if (isNaN(numero) == false)
    {
        return (numero %2 == 1 ?  true : false);
    }
    else
    {
        return null;
    }
}


function apriOcxCardio(idEsame){

var idEsame;
var repartoDest;




	function setParam(){
		this.idEsameDicom=idEsame;
		this.cdcDest=repartoDest;			
	}
	var param = new setParam();

	var resp = window.showModalDialog('modalUtility/paginaOcxCardio.html',param,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
	
		
}






