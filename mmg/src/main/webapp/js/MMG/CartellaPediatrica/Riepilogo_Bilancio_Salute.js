$(document).ready(function()
{
	NS_RIEPILOGO_BILANCIO_SALUTE.init();
	NS_RIEPILOGO_BILANCIO_SALUTE.setEvents();
});

var NS_RIEPILOGO_BILANCIO_SALUTE = 
{
		objWk : null,
		init: function() {

			home.NS_RIEPILOGO_BILANCIO_SALUTE = this;
			NS_RIEPILOGO_BILANCIO_SALUTE.initWk();
			NS_RIEPILOGO_BILANCIO_SALUTE.setBilanciCompilatiColor();
		},
		
		setEvents:function(){
			
			$("#but_bs_1, #but_bs_2, #but_bs_3, #but_bs_4, #but_bs_5, #but_bs_6, #but_bs_7, #but_bs_8").on("click",function(){
				
				var idBilancio = $(this).attr('id').split("_")[2];
				var bilancio = "BILANCIO_SALUTE_"+idBilancio + "&IDEN=";
				home.NS_MMG.apri( bilancio );
				
			});
			
		},
		
		refreshWk:function(){
			NS_RIEPILOGO_BILANCIO_SALUTE.objWk.refresh();
		},
		
		initWk: function(){
			
			var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) - 20;
			$("#ElencoWork").height( h );
			
			this.objWk = new WK({
				"id"		: 'WK_BILANCI',
    			"aBind"		: ["iden_anag","iden_med"],
    			"aVal"		: [$("#IDEN_ANAG").val(),home.baseUser.IDEN_PER],
    			"container" : 'ElencoWork'
			});
			this.objWk.loadWk();
			
		},
		
		apriBilancio: function(rec){
			
			var pagina = rec[0].SCHEDA;
			pagina = pagina.replace("BILANCIO SALUTE ","BILANCIO_SALUTE_");
			
			var url = pagina + "&IDEN=" + rec[0].IDEN;
			home.NS_MMG.apri( url );
			
		},
		
		setBilanciCompilatiColor:function() {
			var bilanciCompilati = $("#hBilanciCompilati").val();
			for (var i=1; i<9;i++) {
				if (bilanciCompilati.indexOf(i)>-1) {
					$('<i>', { 'class' : 'icon-ok', 'title' : 'Compilato' }).appendTo( $("#but_bs_"+i));
//					$("#but_bs_"+i).css({"border":"3px solid green"}); 
				}
			}
		},
		
		stampaBilancio: function(rec){

			var prompts = {pIdModulo:rec[0].IDEN, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
			var pagina = rec[0].SCHEDA;
			pagina = pagina.replace("BILANCIO SALUTE ","BILANCIO_SALUTE_");
			
			var path_report = pagina + ".RPT" + "&t=" + new Date().getTime();
			
			home.NS_PRINT.print({
				path_report	: path_report,
				prompts		: prompts,
				show		: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output		: "pdf"
			});
		},
		
		aggiorna: function(idBilancio) {
			var btn = $("#but_bs_"+idBilancio);
			if (btn.find("i").length==0) {
				$('<i>', { 'class' : 'icon-ok', 'title' : 'Compilato' }).appendTo(btn);
			}
			this.objWk.refresh();
		}
};