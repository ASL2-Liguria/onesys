/**
 * User: matteopi
 * Date: 21/01/13
 * Time: 15.44
 */

$(document).ready(function() {
    $("select[name='cmbRepartoSorgente']").change(NS_AGGIORNAIFRAME.aggiorna);
    $("select[name='cmbRepartoDestinazione']").change(NS_AGGIORNAIFRAME.aggiorna);
    $("input[name='cmbtipologia']").filter('[value=R]').attr('checked', true);
});


// gestione checkbox

$("input[name='chkrepartodefault']").click(function(){
    if ($("input[name='chkrepartodefault']").is(":checked")){
        $("select[name='cmbRepartoSorgente']").attr("disabled","disabled");
        $("select[name='cmbRepartoSorgente'] option:selected").removeAttr("selected");
        var reparto_destinazione = $("select[name='cmbRepartoDestinazione'] option:selected").val();
        if (typeof reparto_destinazione != 'undefined'){
            var tipologia = ($("input[name='cmbtipologia']:checked").val());
            var url = "servletGenerator?KEY_LEGAME=SCELTA_ESAMI_TAB_ESA_REPARTO&REPARTO_SORGENTE=&REPARTO_DESTINAZIONE="+reparto_destinazione+"&TIPO="+tipologia;
//        alert (url); per controllare l'url che viene mandata all'iframe
            $('#frameElencoEsami').attr("src", url);
        }

    }else{
        $("select[name='cmbRepartoSorgente']").removeAttr("disabled");
    }
});

var NS_AGGIORNAIFRAME = {

    aggiorna:function(){
//alert("sono entrato nella funzione aggiorna"); controlla se entra nella funzione

        //controllo che tutti i parametri neccessari siano valorizzati
        if  ($("select[name='cmbRepartoSorgente'] option:selected").text().length > 0 && ($("select[name='cmbRepartoDestinazione'] option:selected").text().length >0)|| $("input[name='chkrepartodefault']").is(":checked")){
            var reparto_sorgente = $("select[name='cmbRepartoSorgente'] option:selected").val();
            var reparto_destinazione = $("select[name='cmbRepartoDestinazione'] option:selected").val();

//          controllo se il reparto sorgente è nullo(in caso sia checkato il chekbox viene valorizzato come nullo).
            if(typeof reparto_sorgente=="undefined"){
                reparto_sorgente = "";
            }
            var tipologia = ($("input[name='cmbtipologia']:checked").val());
            var url = "servletGenerator?KEY_LEGAME=SCELTA_ESAMI_TAB_ESA_REPARTO&REPARTO_SORGENTE="+reparto_sorgente+"&REPARTO_DESTINAZIONE="+reparto_destinazione +"&TIPO="+tipologia;
            $('#frameElencoEsami').attr("src", url);
        }

    }
}