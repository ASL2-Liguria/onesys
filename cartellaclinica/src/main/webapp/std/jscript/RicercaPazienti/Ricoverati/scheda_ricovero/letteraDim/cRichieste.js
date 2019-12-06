var WindowCartella = null;
jQuery(document).ready(function()
{
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	NS_CRICHIESTE.init();
});

var NS_CRICHIESTE = {
		
	init:function(){
		$('#divRichiesteLabo').hide();
		$('#infoRicLabo').live('click',function(){
			NS_CRICHIESTE.visualizzaRichiesteLabo($(this).attr('idenRic'),$(this).parent().parent().find('td:eq(1)').html());
		});
	},
	filtraRichieste : function(tipo) {
		
		if(tipo=='STR'){
			$('#divRichiesteStr').show();
			$('#divRichiesteLabo').hide();
		}	
		else if (tipo=='LABO'){
			$('#divRichiesteLabo').show();
			$('#divRichiesteStr').hide();
		}
		
	},
	visualizzaRichiesteLabo: function (idenRichiesta,vTitle){

	var rs=WindowCartella.executeQuery("letteraSezioniInfo.xml","getInfoRichiesteLabo",[idenRichiesta]);

	var vObj = $('<table></table>');
			while(rs.next()){
			
			vObj.append(
				top.$('<tr></tr>')
				.append(top.$('<td></td>').text(rs.getString("ESAME")))									
			);								
		}
	top.Popup.append({
		title:"Esami richiesti ("+vTitle+")",
		obj:vObj,
		width:250,
		height:300,
		position:[event.clientX+10,event.clientY+70]
	});

	}
};		