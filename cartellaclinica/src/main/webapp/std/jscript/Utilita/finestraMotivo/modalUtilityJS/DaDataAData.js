/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    NS_MODAL_DATA_A_DATA.init();
    NS_MODAL_DATA_A_DATA.setEvents();
});

var NS_MODAL_DATA_A_DATA = {
        init:function(){
            /*popolo i campi data con i valori della data che ci servono*/
            $('input#IdataIni').val(clsDate.str2str(window.dialogArguments.dataIni,'YYYYMMDD','DD/MM/YYYY')); 
            $('input#IdataFine').val(clsDate.str2str(window.dialogArguments.dataFine,'YYYYMMDD','DD/MM/YYYY'));
        },

        setEvents:function(){
            NS_MODAL_DATA_A_DATA.controlloData();
            $('#btnChiudi').click(function(){
                NS_MODAL_DATA_A_DATA.closeEInvia();
            });
            $('#btnAnnulla').click(function(){
                NS_MODAL_DATA_A_DATA.annulla();
            });
            
        },

        closeEInvia:function()
        {          
            window.returnValue = {
                dataIni : clsDate.str2str($('input#IdataIni').val(),'DD/MM/YYYY','YYYYMMDD'),
                dataFine : clsDate.str2str($('input#IdataFine').val(),'DD/MM/YYYY','YYYYMMDD')
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
