/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    NS_MODAL_DATA_REPARTI_RICOVERO.init();
    NS_MODAL_DATA_REPARTI_RICOVERO.setEvents();
});

var NS_MODAL_DATA_REPARTI_RICOVERO = {
        init:function()
        {
            /*popolo i campi data con i valori della data che ci servono*/
            $('input#IdataIni').val(window.dialogArguments.dataIni); 
            $('input#IdataFine').val(window.dialogArguments.dataFine);

            var arTipoRicoveroTxt = window.dialogArguments.tiporicoveroTxt;
            var arTipoRicoveroVal = window.dialogArguments.tiporicoveroVal;  
            $selecttiporicovero = $('select#ItipoRicovero');
            $selecttiporicovero.append(function() {
                var output = '';
                $.each( arTipoRicoveroTxt, function(key, value) {
                    output += '<option value = '+arTipoRicoveroVal[key]+'>' + value + '</option>';
                });
                return output;
            });
        },

        setEvents:function(){
            NS_MODAL_DATA_REPARTI_RICOVERO.controlloData();
            $('#btnChiudi').click(function(){
                NS_MODAL_DATA_REPARTI_RICOVERO.closeEInvia();
            });
            $('#btnAnnulla').click(function(){
                NS_MODAL_DATA_REPARTI_RICOVERO.annulla();
            });
            
        },

        closeEInvia:function()
        {
            //var repartiSelezionati = new Array(); 
            var tipologiaRicovero = new Array();
            $('select#ItipoRicovero :selected').each(function(i, selected){ 
                tipologiaRicovero.push($(selected).val()); 
            });
            if (tipologiaRicovero.length<1)
                return alert('Selezionare almeno una tipologia di ricovero');
            
            var diff = clsDate.difference.day(clsDate.str2date($('input#IdataFine').val(),'DD/MM/YYYY'),clsDate.str2date($('input#IdataIni').val(),'DD/MM/YYYY'));
            
            if (diff<0){
                alert('Attenzione controllare le date inserite: la data di inizio è maggiore di quella di fine');
                return;
            }
                           
            window.returnValue = {
                dataIni : clsDate.str2str($('input#IdataIni').val(),'DD/MM/YYYY','YYYYMMDD'),
                dataFine : clsDate.str2str($('input#IdataFine').val(),'DD/MM/YYYY','YYYYMMDD'),
                tiporicovero :tipologiaRicovero.join(",")
            };

            self.close();
        },

        annulla:function ()
        {
            self.close();
        },
        
        controlloData:function(){
            try 
            {
                var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
                oDateMask.attach(document.getElementById("IdataIni"));
                oDateMask.attach(document.getElementById("IdataFine"));		
            }
            catch(e)
            {
                alert('Applicazione maschera data in errore: '+e.description);
            }
        }


};
