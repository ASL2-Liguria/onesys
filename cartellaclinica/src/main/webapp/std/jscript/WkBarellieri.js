function trasportaPaziente()
{
	
    if (stringa_codici(array_ubicazione_paziente)=='1')
    {
        alert('Il paziente è già stato trasportato nel reparto di destinazione');
        return;
    }

    var idenRichiesta=stringa_codici(array_iden);
		
    dwr.engine.setAsync(false);
    /*  cancellato il dwr, se necessario reimplemetarlo in maniera più furba --> executeStatement
    dwrEseguiOperazione.init('T',null,idenRichiesta,null,null,post); */
 	
}
function prelevaPaziente()
{
	
    if (stringa_codici(array_stato)=='A' || stringa_codici(array_stato)=='P')
    {
        alert("L'indagine non è ancora conclusa");
        return;
    }	

    var idenRichiesta=stringa_codici(array_iden);
		
    dwr.engine.setAsync(false);
    /*  cancellato il dwr, se necessario reimplemetarlo in maniera più furba --> executeStatement              
    dwrEseguiOperazione.init('P',null,idenRichiesta,null,null,post); */
 		
}
function post(resp)
{

    if (resp!='OK')
    {
        alert(resp);
    }
    dwr.engine.setAsync(true);
    window.location.reload() ;
		
}