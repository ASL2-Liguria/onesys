$(document).ready(function(){
	
	window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    
	WK_TERAPIE_MODELLI.init();	
});

var WK_TERAPIE_MODELLI = {
		
		
init : function () {
	
var iden_terapia;	
var rs;
var time=1;
var indexColFarmaci=$('#idHeaderTableWk tr>th>div:contains("Farmaci")').closest('th').index();
	
     $("#oTable tr td:nth-child("+(indexColFarmaci+1)+")").each(function () {
    	 var that=this;
		window.setTimeout(function(){
			iden_terapia = array_iden[$(that).closest('tr').index()];
			rs=WindowCartella.executeQuery("ricercaFarmaci.xml","getDisponibilita",[iden_terapia]);

			while(rs.next()){
				$(that).html(rs.getString("FARMACO"));
			}
			if ($(that).html().indexOf('attesaTdWk')!=-1){
				$(that).html('');
			}
			
		}
		,time);
	time+=5;
	});	
		
}		
		
}