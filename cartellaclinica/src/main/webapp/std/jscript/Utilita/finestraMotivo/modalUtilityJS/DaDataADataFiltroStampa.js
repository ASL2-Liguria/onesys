/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    NS_MODAL_DATA_FILTRO.init();
    NS_MODAL_DATA_FILTRO.setEvents();
});

var NS_MODAL_DATA_FILTRO = {
        param:'',
        
        init:function()
        {
            NS_MODAL_DATA_FILTRO.param = parent.callParameterForFancybox();
            NS_MODAL_DATA_FILTRO.loadCampi();
        },

        setEvents:function(){
            NS_MODAL_DATA_FILTRO.controlloData();
            $('#btnChiudi').click(function(){
                NS_MODAL_DATA_FILTRO.closeEInvia();
            });
            $('#btnChiudi').css('cursor','pointer');
            $('#btnAnnulla').css('cursor','pointer');
            $('#btnChiudi').hover(function(){
                $('#btnChiudi').removeClass('pulsante').addClass('pulsanteSelezionato');
                },function(){
                $('#btnChiudi').removeClass('pulsanteSelezionato').addClass('pulsante');;
            });
            $('#btnAnnulla').click(function(){
                NS_MODAL_DATA_FILTRO.annulla();
            });
            $('#btnAnnulla').hover(function(){
                $('#btnAnnulla').removeClass('pulsante').addClass('pulsanteSelezionato');
                },function(){
                $('#btnAnnulla').removeClass('pulsanteSelezionato').addClass('pulsante');;
            });
            
        },
        
        loadCampi:function(){
            $('input#IdataIni').val(NS_MODAL_DATA_FILTRO.param.dataIni);
            $('input#IdataFine').val(NS_MODAL_DATA_FILTRO.param.dataIni);
            /*popolo i campi con una input di tipo select*/
            $selecttipofiltro = $('select#ItipoFiltroStampa');
            $selecttipofiltro.append(function() {
                var output = '';
                var countOutput=1;
                $.each( NS_MODAL_DATA_FILTRO.param.tipofiltroTxt, function(key, value) {
                    output += '<option value = '+NS_MODAL_DATA_FILTRO.param.tipofiltroVal[key]+'>' + value + '</option>';
                    countOutput += 1;
                });
                $selecttipofiltro.attr("size",countOutput);
                return output;
            });
            
            $selectreparti = $('select#Ireparti');
            $selectreparti.append(function() {
                var output = '';
                var countOutput=1;
                $.each( NS_MODAL_DATA_FILTRO.param.arrayDescrRep, function(key, value) {
                    output += '<option value = '+NS_MODAL_DATA_FILTRO.param.arrayIdenProRep[key]+'>' + value + '</option>';
                    countOutput += 1;
                });
                $selectreparti.attr("size",countOutput);
                return output;
            });
        },

        closeEInvia:function()
        {
            if ($("select#ItipoFiltroStampa :selected").index() < 0)
                return alert('Selezionare almeno una tipologia di visita');

            if ($("select#Ireparti :selected").index() < 0)
                return alert('Selezionare almeno un reparto');            
            
            var tipologiaEsameSelezionato = new Array();

            $('select#ItipoFiltroStampa :selected').each(function(i, selected){ 
                tipologiaEsameSelezionato.push($(selected).val()); 
            });

            var repartiSelezionati = new Array();

            $('select#Ireparti :selected').each(function(i, selected){ 
                repartiSelezionati.push($(selected).val()); 
            });

            var paramReturnValue = {
                dataIni : clsDate.str2str($('input#IdataIni').val(),'DD/MM/YYYY','YYYYMMDD'),
                dataFine : clsDate.str2str($('input#IdataFine').val(),'DD/MM/YYYY','YYYYMMDD'),
                esameSelezionati :tipologiaEsameSelezionato.join(","),
                esamiDefault : NS_MODAL_DATA_FILTRO.param.tipofiltroVal.join(","),
                repartiSelezionati :repartiSelezionati.join(","),
                repartiDefault : NS_MODAL_DATA_FILTRO.param.arrayIdenProRep.join(",")                
            };
            parent.callbackStampa(paramReturnValue)
        },

        annulla:function ()
        {
            parent.$.fancybox.close();
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
