/*
 *  author : Graziav
 *  date : 20150518
 *  gestione tabella contestazioni per flusso Controdeduzioni
 */

$(document).ready(function () {
	$("#txtAnno").val(moment().add(-1,'y').format('YYYY'));
	NS_CONTRODEDUZIONI.init();
	NS_CONTRODEDUZIONI.setEvents();
	
});

var NS_CONTRODEDUZIONI={
		wkControdeduzioni:null,
		init:function(){
			 $("#divWk").css({'height':document.body.offsetHeight  - $("#filtri").height() - 15 });	
			 
			 NS_CONTRODEDUZIONI.tab_sel = "filtroControdeduzioni";
			 NS_CONTRODEDUZIONI.caricaWk();
		},
		setEvents:function(){
		},
		caricaWk:function(){
			 var anno =   $('#txtAnno').val();
			 NS_CONTRODEDUZIONI.wkControdeduzioni= new WK({
		            id : "WK_CONTRODEDUZIONI",
		            container : "divWk",
		            aBind : ['ANNO','username'],
		            aVal : [anno,home.baseUser.USERNAME],
		            loadData : true
		        });

			 NS_CONTRODEDUZIONI.wkControdeduzioni.loadWk();
		},
		setBackGround_ErrAnag: function(data,td){
			if (data.ERRORI_ANAGRAFICI>0) {
	            td.css({'background-color':'#FF0000'});
	        }
			return data.ERRORI_ANAGRAFICI;
		},
		setBackGround_ErrRes: function(data,td){
			if (data.ERRORI_RESIDENZA>0) {
	            td.css({'background-color':'#FF0000'});
	        }
			return data.ERRORI_RESIDENZA;
		},
		setBackGround_ErrPrest: function(data,td){
			if (data.ERRORI_PRESTAZIONE>0) {
	            td.css({'background-color':'#FF0000'});
	        }
			return data.ERRORI_PRESTAZIONE;
		},
		setBackGround_ErrRico: function(data,td){
			if (data.ERRORI_RICOVERO>0) {
	            td.css({'background-color':'#FF0000'});
	        }
			return data.ERRORI_RICOVERO;
		},
		setBackGround_ErrChiaveRec: function(data,td){
			if (data.ERRORI_CHIAVE_RECORD>0) {
	            td.css({'background-color':'#FF0000'});
	        }
			return data.ERRORI_CHIAVE_RECORD;
		},
		setBackGround_ErrImporto: function(data,td){
			if (data.ERRORI_IMPORTO>0) {
	            td.css({'background-color':'#FF0000'});
	        }
			return data.ERRORI_IMPORTO;
		},
		setBackGround_ErrDataPrest: function(data,td){
			if (data.ERRORI_DATA_PRESTAZIONE>0) {
	            td.css({'background-color':'#FF0000'});
	        }
			return data.ERRORI_DATA_PRESTAZIONE;
		},
		setBackGround_ErrOnere: function(data,td){
			if (data.ERRORI_ONERE>0) {
	            td.css({'background-color':'#FF0000'});
	        }
			return data.ERRORI_ONERE;
		}
		
		
};
