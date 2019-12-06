$(document).ready(function()
{

	UTILITA.init();
	UTILITA.setEvents();
	
});

var UTILITA = {

		objWkNoteCUF: null,
		
		init: function()
		{
			$("#li-tabCalcolatori").hide();
			UTILITA.setLabelLink();
		},
		
		setEvents: function()
		{
			$("#li-tabNoteCUF").on("click", function(){
				
				UTILITA.iniWkNote();
			});
			
			$("#butCercaNota").on("click", function(){UTILITA.refreshWkNote();});
			
			$("body").on("keyup",function(e) {
			    if(e.keyCode == 13) {
			    	UTILITA.refreshWkNote();
			    }
			});
			
		},
		
		apri:function(pCase){
			
			switch(pCase){
			
				case 'MANUALE_RAO':
					window.open(home.NS_FENIX_TOP.getAbsolutePathServer() + encodeURI("MMG/ManualeRAO.pdf"))
					break;
					
				case 'ELENCO':
					window.open(home.NS_FENIX_TOP.getAbsolutePathServer() + encodeURI("MMG/ElencoTelefonicoASL2.pdf"))
					break;
			}
		},
		
		apriNota: function(riga){
			
			var percorso = typeof riga.PERCORSO != 'undefined' ? riga.PERCORSO : riga[0].PERCORSO;
			
			var urlNoteCUF = home.baseGlobal.URL_NOTE_CUF;
			if(urlNoteCUF == ""){
				alert(traduzione.lblImpossibileNoteCuf + '\n\n' + traduazione.lblErroreNoteCuf);
				return; 
			}
			
			urlNoteCUF += percorso;
			window.open( urlNoteCUF );
		},
		
		iniWkNote: function(){
			
			if (this.objWkNoteCUF == null) 
			{
				var h = $('.contentTabs').innerHeight() - $('#wkNote_CUF').outerHeight(true) - 100;
				$("#wkNote_CUF").height( h );
				this.objWkNoteCUF = new WK({
					"id"        : 	'WK_NOTE_CUF',
					"aBind"     :	["nota"],
					"aVal"      :	["%25" + $("#txtNota").val().toUpperCase() + "%25"],
					"container" : 	'wkNote_CUF'
				});
				this.objWkNoteCUF.loadWk();
			}
		},
		
		refreshWkNote:function(){
			UTILITA.objWkNoteCUF.filter({
				"aBind"     :	["nota"],
				"aVal"      :	["%25" + $("#txtNota").val().toUpperCase() + "%25"]
			});
		},
		
		setLabelLink: function(){
			
			/************************assegno ad ogni label un link**********************/

			v_jSon= JSON.parse(home.baseGlobal.URL_LINK_ESTERNI);
			
			for (var i in v_jSon) {
				
				var obj = v_jSon[i];
				var link = obj.link != '#' ? obj.link : 'link diretto al documento';
				
				var button = '<table><tr><td class="tdLblLink"><a href="'+obj.link+'"';
				
				if(obj.js != ''){					
					button += 'onclick="javascript:'+obj.js+'" ';
				}
				
				button += 'title="'+obj.label+'" ';
				button += 'id="'+obj.id+'">';
				button += obj.label+'</a></td></tr>';
				button += '<tr><td class="linkUnveiled">'+link+'</td></tr>';
				button += '</table>';
				
				$("#tabLink .campi").append(button);
			}
		}
};
