var CONTROLLER_PS = {

    AdmitVisit : function(json){

        $.ajax({
            type: 'POST',
            url: 'ps/AdmitVisit/json/',
            data: JSON.stringify(json.jsonContatto),
            dataType: 'json',
            async: false,
            error: function (xhr, ajaxOptions, thrownError) {
                home.NOTIFICA.error({message: "Impossibile inserire il contatto, Paziente gia presente", title: "Error"});
                logger.error("inserisciContatto : admitVisit:\nxhr: " + JSON.stringify(xhr) + "\najaxOptions: " +
                    JSON.stringify(ajaxOptions) + "\nthrownError: " + JSON.stringify(thrownError));
            },
            success: function (data) {
                if (data.success) {
                    logger.info("Inserito contatto: " + JSON.stringify(data.contatto.id));
                    json.callback(data.contatto.id);
                } else {
                    home.NOTIFICA.error({message: "Impossibile inserire il contatto, Paziente gia presente", title: "Error"});
                    logger.error("inserisciContatto Errore : " + JSON.stringify(data));
                }
            }
        });
    },
    /**
     * Update del parametro tipo in tab contatti
     * @param json
     * @returns {boolean}
     */
    UpdatePatientInformation : function(json){

        $.ajax({
            type: "POST",
            url: 'ps/UpdatePatientInformation/json/',
            data: JSON.stringify(json.jsonContatto),
            dataType: 'json',
            async : false,
            error: function( data ) {
                home.NOTIFICA.error({message: "Errore UpdatePatientInformation", title: "Error"});
                logger.error("Errore durante la chiamata a ps/UpdatePatientInformation/json/ per il contatto "+json.id+
                    "\n messaggio completo : \n"+JSON.stringify(data));
            },
            success:function(data,status){
                if (data.success){
                    home.NOTIFICA.success({message: "Update successo " , timeout: 3, title: 'Success'});
                    logger.info("UpdatePatientInformation effettuato Correttamente per iden contatto : " + data.contatto.id);
                    json.callback(data);
                }else{
                    logger.error("updateTipoContatto "+ JSON.stringify(status) + "\n" + JSON.stringify(data));
                }
            }
        });
    },
    TransferPatientAssistenziale : function(json){
        $.ajax({
            type: 'POST',
            url: 'ps/TransferPatientAssistenziale/json/',
            data:  JSON.stringify(json.jsonContatto),
            dataType: 'json',
            async: false,
            error: function (xhr, ajaxOptions, thrownError) {
                home.NOTIFICA.error({message: "Richiesta di trasferimento non inviata", title: "Error"});
                logger.error("NS_FENIX_PS.presaInCaricoMedico \nxhr: " + JSON.stringify(xhr) + "\najaxOptions: " +
                    JSON.stringify(ajaxOptions) + "\nthrownError " + JSON.stringify(thrownError));
            },
            success: function (data, status) {
                if (data.success) {
                    //home.NOTIFICA.success({message: "Paziente preso in carico", timeout: 5, title: 'Success'});
                    logger.info("TransferAssistenziale eseguito con successo per contatto: " + data.contatto.id);
                    json.callback(data);
                } else {
                    home.NOTIFICA.error({message: "Il Trasferimento assistenziale e andato in errore", title: "Error"});
                    logger.error("NS_FENIX_PS.presaInCaricoMedico\ndata: " + JSON.stringify(data) + "\nstatus: " + JSON.stringify(status));
                }
            }
        });
    },

    TransferGiuridico : function(json){
        $.ajax({
            type: 'POST',
            data: JSON.stringify(json.jsonContatto),
            url: 'ps/TransferPatientGiuridico/json/',
            dataType: 'json',
            async: false,
            error: function (xhr, ajaxOptions, thrownError) {
                home.NOTIFICA.error({message: "Richiesta di trasferimento non inviata", title: "Error"});
                logger.error("transferGiuridicoAss: "+JSON.stringify(thrownError)+"\nxhr: "+
                    JSON.stringify(xhr)+"\najaxOptions: "+ JSON.stringify(ajaxOptions));
            },
            success:function(data,status){
                if(data.success){
                    home.NOTIFICA.success({message: "Trasferimento eseguito con successo", timeout: 5, title: 'Success'});
                    logger.info("transferGiuridicoAss: "+JSON.stringify(status) + " per contatto : " + data.contatto.id);
                    json.callback(data);
                }else{
                    home.NOTIFICA.error({message: "Trasferimento non eseguito correttamente", title: "Error"});
                    logger.error("transferGiuridicoAss: "+JSON.stringify(data)+"\n"+ JSON.stringify(data));
                }
            }
        });
    },

    DischargeVisit : function(json){
        $.ajax({
            type: "POST",
            url : 'ps/DischargeVisit/json/',
            data: JSON.stringify(json.jsonContatto),
            dataType : 'json',
            async : false,
            error : function(data) {
                home.NOTIFICA.error({message : "Attenzione errore nella dimissione", title : "Error"});
                logger.error(JSON.stringify(data));
            },
            success : function(data) {
               //alert(data.contatto.codice);
                if (data.success) {
                   // NS_VERBALE.jsonDatiAgg = data.contatto.codice;
                   // NS_VERBALE.contattoDataFine = data.contatto.dataFine.replace(':','');
                   // NS_VERBALE.contattoDataInizio = data.contatto.dataInizio.replace(':','');
                    home.NOTIFICA.success({message : "Dimissione effettuata correttamente per iden contatto" + data.contatto.id, timeout : 2, title : 'Success'});
                    logger.info("DischargeVisit success per iden_contatto=" + data.contatto.id);
                    json.callback(data);
                } else {
                    home.NOTIFICA.error({message : "Attenzione errore nella dimissione", timeout : 2, title : "Error"});
                    logger.error(JSON.stringify(data));
                }
            }
        });
    },

    /**
     * cancella la dimissione di un contatto, riportandolo allo stato admitted
     */
    CancelDischarge : function(json){
        $.ajax({
            type: "POST",
            url:"ps/CancelDischarge/json/",
            data:  JSON.stringify(json.jsonContatto),
            dataType: 'json',
            async : false,
            error: function(data) {
                home.NOTIFICA.error({message: "Errore durante la chiamata al Cancella dimissione", title: "Error"});
                logger.error(JSON.stringify(data));
            },
            success:function(data){
                if(data.success){
                    home.NOTIFICA.success({message: "Annullamento Dimissione Effettuato Correttamente per il contatto " + data.contatto.id, title: 'Success'});
                    logger.info("CancelDischarge per id contatto : " + data.contatto.id);
                    json.callback(data);
                }else{
                    home.NOTIFICA.error({message: "Errore Durante Cancella Dimissione " + data.message, title: "Error"});
                    logger.error(JSON.stringify(data));
                }
            }
        });
    },

    CancelAdmission : function(json){

        $.ajax({
            type: "POST",
            url:"ps/CancelAdmission/json/",
            data: JSON.stringify(json.jsonContatto),
            dataType: 'json',
            async : false,
            error: function(data) {
                //home.NOTIFICA.error({message: "Attenzione errore durante A11", title: "Error"});
                logger.error("ADT CancelAdmission"+JSON.stringify(data));
            },
            success:function(data){
                if(data.success){
                    home.NOTIFICA.success({message: "Cancellazione Effettuata Correttamente", timeout: 2, title: "Success"});
                    logger.info("CancelAdmission per id contatto : " + data.contatto.id);
                    json.callback(data);
                }else{
                    //home.NOTIFICA.error({message: "Attenzione Errore Durante Annullamento Dimissione " + data.message, title: "Error"});
                    logger.error("cancellaRicovero "+JSON.stringify(data));
                }
            }
        });
    },
    CancelTransferPatientGiuridico : function (json){
        $.ajax({
            type: "POST",
            url : 'ps/CancelTransferPatientGiuridico/json/',
            data: JSON.stringify(json.jsonContatto),
            dataType : 'json',
            async : false,
            error : function(data) {
                home.NOTIFICA.error({message : "Attenzione errore nella cancellazione", title : "Error"});
                logger.error(JSON.stringify(data));
            },
            success : function(data) {
                if (data.success) {
                    home.NOTIFICA.success({message : "Cancellazione effettuata correttamente per iden contatto" + data.contatto.id, timeout : 2, title : 'Success'});
                    logger.info("CancelTransferPatientGiuridico success per iden_contatto" + data.contatto.id);
                    json.callback(data);
                } else {
                    home.NOTIFICA.error({message : "Attenzione errore nella cancellazione", timeout : 2, title : "Error"});
                    logger.error(JSON.stringify(data));
                }
            }
        });
    },
    MoveVisit : function(json){

        json.notifica = typeof json.notifica !== 'undefined'? json.notifica : 'S' ;
        $.ajax({
            type: "POST",
            url: "ps/MoveVisit/json/" + JSON.stringify(json.jsonAnag),
            dataType: "json",
            data: JSON.stringify(json.jsonContatto),
            error: function (data) {
                logger.error("Errore moveVisit : " + JSON.stringify(data));
            },
            success: function (data, status) {
                if (data.success) {
                    logger.info("MoveVisit effettuato con successo : " + JSON.stringify(data) + "\n" + JSON.stringify(status));

                    if(json.notifica == 'S'){
                        home.NOTIFICA.success({title: "Attenzione", message: "Accesso spostato correttamente", timeout: 5});
                    }

                    json.callback(data);

                }else{
                    home.NOTIFICA.error({message: "Associa Paziente sconosciuto e andato in errore", title: "Error"});
                    logger.error("MoveVisit effettuato\ndata: " + JSON.stringify(data) + "\nstatus: " + JSON.stringify(status));
                }
            }
        });
    }
};

var CONTROLLER_ADT = {

    AdmitVisit : function(json){

        //Aggiorno il json per inserire valori che prima non era possibile reperire
        json.jsonContatto.mapMetadatiString['DEA_STR'] = json.codice.struttura;
        json.jsonContatto.mapMetadatiString['DEA_ANNO'] = json.codice.anno;
        json.jsonContatto.mapMetadatiString['DEA_NUMR'] = json.codice.cartella;
        json.jsonContatto.mapMetadatiString['DEA_DATA_CHIUSURA'] = json.data_fine;
        json.jsonContatto.mapMetadatiString['DEA_DATA_INGRESSO'] = json.data_inizio;


        $.ajax({
            type: "POST",
            data: JSON.stringify(json.jsonContatto),
            url: 'adt/AdmitVisit/json/',
            dataType: 'json',
            async : false,
            error: function(data) {
                home.NOTIFICA.error({message: "Attenzione errore nel salvataggio ", timeout: 5, title: "Error"});
                logger.error(JSON.stringify(data));
            },
            success:function(data){
                if(data.success){
                    home.NOTIFICA.success({message : "Salvataggio effettuato correttamente per iden_contatto : " + data.contatto.id, timeout : 2, title : 'Success'});
                    logger.info("AdmitVisit per iden_contatto : "+data.contatto.id);
                    json.callback(data);
                }else{
                    home.NOTIFICA.error({message: "Attenzione errore nel salvataggio " + data.message, timeout: 5, title: "Error"});
                    logger.error(JSON.stringify(data));
                }
            }
        });
    },
    UpdatePatientInformation : function(json){

        $.ajax({
            type: 'POST',
            url: 'adt/UpdatePatientInformation/json/',
            data: JSON.stringify(json.jsonContatto),
            dataType: 'json',
            async: false,
            error: function (data) {
                home.NOTIFICA.error({message: "Errore nella chiamata UpdatePatientInformation", title: "Error"});
                logger.error("Presa in carico UpdatePatientInformation" + JSON.stringify(data));
            },
            success: function (data) {
                if (data.success) {
                    logger.info(" UpdatePatientInformation per iden contatto " +data.contatto.id );
                    json.callback(data);

                } else {
                    home.NOTIFICA.error({message: "UpdatePatientInformation in errore", title: "Error"});
                    logger.error("presa in carico, UpdatePatientInformation : " + JSON.stringify(resp));
                }
            }
        });
    },
    MoveVisit : function(json){

        $.ajax({
            type: "POST",
            url: "adt/MoveVisit/json/" + JSON.stringify(json.jsonAnag),
            dataType: "json",
            data: JSON.stringify(json.jsonContatto),
            error: function (data) {
                logger.error("Errore moveVisit : " + JSON.stringify(data));
            },
            success: function (data, status) {
                if (data.success) {
                    home.NOTIFICA.success({title: "Attenzione", message: "Accesso spostato correttamente", timeout: 5});
                    logger.info("MoveVisit effettuato con successo : " + JSON.stringify(data) + "\n" + JSON.stringify(status));
                    json.callback(data);

                }else{
                    home.NOTIFICA.error({message: "Associa Paziente sconosciuto e andato in errore", title: "Error"});
                    logger.error("MoveVisit effettuato\ndata: " + JSON.stringify(data) + "\nstatus: " + JSON.stringify(status));
                }
            }
        });
    },
    /**
     * cancella il ricovero di un contatto
     */
    CancelAdmission : function(json){

        $.ajax({
            type: "POST",
            url:"adt/CancelAdmission/json/",
            data: JSON.stringify(json.jsonContatto),
            dataType: 'json',
            async : false,
            error: function(data) {
                //home.NOTIFICA.error({message: "Attenzione errore durante A11", title: "Error"});
                logger.error("ADT CancelAdmission"+JSON.stringify(data));
            },
            success:function(data){
                if(data.success){
                    home.NOTIFICA.success({message: 'Annullamento Dimissione Effettuato Correttamente', timeout: 2, title: 'Success'});
                    logger.info("CancelAdmission per id contatto : " + data.contatto.id);
                    json.callback(data);
                }else{
                    //home.NOTIFICA.error({message: "Attenzione Errore Durante Annullamento Dimissione " + data.message, title: "Error"});
                    logger.error("cancellaRicovero "+JSON.stringify(data));
                }
            }
        });
    }

};
