/**
 * Created by matteo.pipitone on 25/01/2016.
 */

var NS_AUTOCOMPLETE  =  {
    checkComuneResidenza : function (data){

        if(typeof NS_ANAGRAFICA.schedaAnagrafica != 'undefined'){
            NS_ANAGRAFICA.valorizeCapRegioneProvinciaResidenza(data,'RESIDENZA');
        }else{
            NS_ACC_RICOVERO_ANAGRAFICA.valorizeCapRegioneProvinciaResidenza(data,true);

            var cmbOnere = $("#cmbOnere");
            var codiceOnereSelezionato = cmbOnere.find("option:selected").data("codice");
            codiceOnereSelezionato = typeof codiceOnereSelezionato == 'undefined'? _JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_ONERE'].codice : codiceOnereSelezionato;

            //se è un paese estero e onere è 1 (SSN) svuoto combo onere
            if (!NS_ACC_RICOVERO.checkOnere({codice : codiceOnereSelezionato,  codiceRegioneRes : data.CODICE_REGIONE})){
                cmbOnere.val("")
            }

        }
        $('#acASLResidenza').data('acList').changeBindValue({"reg_codice": data.CODICE_REGIONE});

    }
}