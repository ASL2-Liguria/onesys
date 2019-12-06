/*
 *  author : Graziav
 *  date : 20150529
 *  gestione tabella contestazioni per flusso Controdeduzioni
 */

$(document).ready(function () {
	NS_CONTRODEDUZIONI_SCHEDA.init();
	NS_CONTRODEDUZIONI_SCHEDA.setEvents();
	
});

var PRESIDIO_PONENTE='211';
var STR_PONENTE='9';
var PRESIDIO_LEVANTE='212';
var STR_LEVANTE='8';
var IDEN_CONTATTO;
var IDEN_ANAGRAFICA;

var NS_CONTRODEDUZIONI_SCHEDA={
		init:function(){
			NS_CONTRODEDUZIONI_SCHEDA.setIdenContatto_Anagrafica();
			NS_CONTRODEDUZIONI_SCHEDA.hideDiaVuote();
			NS_CONTRODEDUZIONI_SCHEDA.hideIntVuoti();
			NS_CONTRODEDUZIONI_SCHEDA.setBackGroundErrori();
		},
		setEvents:function(){
			$(".butApriSdo").click(function(){
				if (IDEN_CONTATTO!=null && IDEN_ANAGRAFICA!=null){
					top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=ACC_RICOVERO&IDEN_ANAG='+IDEN_ANAGRAFICA+'&IDEN_CONTATTO='+IDEN_CONTATTO+'&STATO_PAGINA=E&SDO=S',id:'ApriRicovero',fullscreen:true});	
				}
				else{
					home.NOTIFICA.error({message: "Nessun contatto presente per la scheda " +$("#txtNumeroScheda").val(),title: "Error"});
				}
			});
		},
		setIdenContatto_Anagrafica:function(){
			// dal numero scheda e dal presidio ricavo il nosologico
			var numScheda=$("#txtNumeroScheda").val();
			var presidio=$("#txtCodiceIstituto").val();
			var anno='20'+ numScheda.substring(0,2);
			var struttura;
			if (presidio.substring(3,6)==PRESIDIO_LEVANTE){
				struttura=STR_LEVANTE;
			}
			else if (presidio.substring(3,6)==PRESIDIO_PONENTE){
				struttura=STR_PONENTE;
			}
			else {
				struttura='x';
			}
			var cartella=parseInt(numScheda.substring(2),10);
			var codice=struttura+'-'+anno+'-'+cartella.toString();
			var params={
					datasource:'ADT',
					query:'ADT.Q_IDEN_CONTATTO_BYCODICE',
					params_where: {
			               "codice": {"v":codice, t:'V'}
			            },
			}
			var db = $.NS_DB.getTool({setup_default: {datasource: params.datasource, async: false}});
            var xhr = db.select({
                id       : params.query,
                parameter: params.params_where
            });
            xhr.done(function (data, textStatus, jqXHR) {
            	//alert(data);
            	if (data.result.length>0){
            		IDEN_CONTATTO=data.result[0].IDEN;
            		IDEN_ANAGRAFICA=data.result[0].IDEN_ANAGRAFICA;
            		//alert('IDEN_CONTATTO='+IDEN_CONTATTO+' IDEN_ANAGRAFICA='+IDEN_ANAGRAFICA);
            	}
            	else{
            		home.NOTIFICA.error({message: "Nessun contatto presente per il nosologico "+codice,title: "Error"});
            	}
            });
            xhr.fail(function (jqXHR, textStatus, errorThrown) {
                logger.error("Q_IDEN_CONTATTO_BYCODICE jqXHR -> " + JSON.stringify(jqXHR));
                home.NOTIFICA.error({message: "Errore nella query di ricerca contatto",title: "Error"});
            });
		},
		hideDiaVuote:function(){
			for (var i=0; i<=5; i++){
				if ($("#h-txtDiagnosi"+i).val()==''){
					$("#txtDiagnosi"+i).hide();
					$("#lblDiagnosi"+i).hide();
					$("#h-txtDiagnosi"+i).closest('tr').hide();
				}
			}
		},
		hideIntVuoti:function(){
			for (var i=0; i<=5; i++){
				if ($("#h-txtIntervento"+i).val()==''){
					$("#txtIntervento"+i).hide();
					$("#lblIntervento"+i).hide();
					$("#h-txtIntervento"+i).closest('tr').hide();
				}
			}
		},
		setBackGroundErrori:function(){
			if (parseInt($("#txtErroriAnag").val())>0){
				$("#txtErroriAnag").css({'background-color':'#FF0000'});
			}
			if (parseInt($("#txtErroriRes").val())>0){
				$("#txtErroriRes").css({'background-color':'#FF0000'});
			}
			if (parseInt($("#txtErroriPrest").val())>0){
				$("#txtErroriPrest").css({'background-color':'#FF0000'});
			}
			if (parseInt($("#txtErroriRico").val())>0){
				$("#txtErroriRico").css({'background-color':'#FF0000'});
			}
			if (parseInt($("#txtErroriChiaveRec").val())>0){
				$("#txtErroriChiaveRec").css({'background-color':'#FF0000'});
			}
			if (parseInt($("#txtErroriImporto").val())>0){
				$("#txtErroriImporto").css({'background-color':'#FF0000'});
			}
			if (parseInt($("#txtErroriDataPrest").val())>0){
				$("#txtErroriDataPrest").css({'background-color':'#FF0000'});
			}
			if (parseInt($("#txtErroriOnere").val())>0){
				$("#txtErroriOnere").css({'background-color':'#FF0000'});
			}
		}
}