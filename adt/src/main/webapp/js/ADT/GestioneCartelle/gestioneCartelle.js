var dialPD;
/**
 * User: graziav
 * Date: 19/03/2014
 * Time: 17:00
 */

//CODIFICHE STATI CARTELLA = CODICE_DECODIFICA di TIPI where TIPO='ADT_STATO_CARTELLA'
var cartellaIncompleta='00';
var cartellaCompleta='01';
var cartellaInviataInArchivio='02';
var cartellaRicevutaInArchivio='03';
var cartellaArchiviata='04';
var cartellaReinviataInReparto='05';
var cartellaPersa='06';
var cartellaSequestrata='07';

jQuery(document).ready(function () {
    window.NS_FENIX_TOP = window.parent.NS_FENIX_TOP;
    window.$.NS_DB = window.parent.$.NS_DB;
    NS_GESTIONE_CARTELLE.init();
    NS_GESTIONE_CARTELLE.events();
    /*$("#txtDataArchiviazione").val(moment().format('DD/MM/YYYY'));
     $("#h-txtDataArchiviazione").val(moment().format('YYYYMMDD'));*/
});

var _URL_GENERAZIONE_FLUSSI = home.baseGlobal['URL_GENERAZIONE_FLUSSI'];
var IDEN_ARCHIVIO;
var ARCHIVIO;
var NS_GESTIONE_CARTELLE={
    struttura:null,
    wkGrouper:null,
    wkCartelle:null,
    wkcaricaWkouper:null,
    wkRichCartelle: null,
    saveBeforeApplica:null,
    init:function(){
    	
        $("#txtAnno").val(moment().format('YYYY'));
        home.NS_CONSOLEJS.addLogger({name:'CalcolaDRG',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['CalcolaDRG'];
        NS_GESTIONE_CARTELLE.caricaWk();
        
        NS_GESTIONE_CARTELLE.initLogger();
        NS_GESTIONE_CARTELLE.initFiltroStruttura();
        NS_GESTIONE_CARTELLE.impostaArchivio();
        NS_GESTIONE_CARTELLE.tab_sel='filtroCartelle';
        // salvo beforeApplica
        NS_GESTIONE_CARTELLE.saveBeforeApplica= NS_FENIX_WK.beforeApplica;
        // sostituisco con quella di controllo filtri
        NS_FENIX_WK.beforeApplica = NS_GESTIONE_CARTELLE.beforeApplica;
        
    },
    
    beforeApplica : function(){
    	
        if (NS_GESTIONE_CARTELLE.tab_sel=='filtroGrouper')
        {
        	if( ($("#txtCognomeListaRichiesteGrouper").val() == '') && ($("#txtNCartellaGrouper").val()=='') && ($("#h-txtDaDataGrouper").val()=='') && ($("#h-txtADataGrouper").val()=='')) 
        	{
        		home.NOTIFICA.error({message: "Compilare almeno un campo tra cognome , n. cartella, da data , a data", title: "Error"});
        		return false;
        	}
        	else {
        		if (($("#h-txtDaDataGrouper").val()!='') && ($("#h-txtADataGrouper").val()!='')){
        			return true;
        		}
        		if ($("#txtCognomeListaRichiesteGrouper").val() != '' && $("#txtNomeListaRichiesteGrouper").val() != ''){
        			return true;
        		}
        		
        		if ($("#txtCognomeListaRichiesteGrouper").val() != '' && $("#txtNomeListaRichiesteGrouper").val() == ''){
        			home.NOTIFICA.error({message: "Compilare sia cognome che nome o parte di essi", title: "Error"});
        			return false;
        		}
        		if ((($("#h-txtDaDataGrouper").val()!='') && ($("#h-txtADataGrouper").val()=='')) || ($("#h-txtDaDataGrouper").val()=='') && ($("#h-txtADataGrouper").val()!='')){
        			home.NOTIFICA.error({message: "Compilare entrambe le date del periodo", title: "Error"});        			
        			return false;
        		}
        	return true;
        	}
        }        
        else if (NS_GESTIONE_CARTELLE.tab_sel=='filtroRichiesteCartelle')
    	{
        	var parameters = 
            {
            		"iden_richiesta" : $("#txtIdenRichiesta").val() == "" ? null  :  $("#txtIdenRichiesta").val(),
            		"cognome" : $("#txtCognomeRichieste").val() == "" ? null  : $("#txtCognomeRichieste").val(), "nome" : $("#txtNomeRichieste").val() == "" ? null : $("#txtNomeRichieste").val(), "data_nascita" : $("#DataNasc").val() == "" ? null : $("#h-DataNasc").val(),
            		"anno" : $("#txtAnno").val() == "" ? null :  $("#txtAnno").val(), "struttura" : $("#txtStruttura").val() == "" ? null  : $("#txtStruttura").val(), "cartella" : $("#txtNCartellaRich").val() == "" ? null  : $("#txtNCartellaRich").val(),
            		"da_data" : $("#h-txtDaDataA").val() == "" ? null :  $("#h-txtDaDataA").val(), "a_data" : $("#h-txtADataA").val() == "" ? null :  $("#h-txtADataA").val(),
            		"SUCCESS" : true,
            		"QUERY" : "query"
            };
            
            var obj = NS_GESTIONE_CARTELLE.definisciQueryWKRichiesteCartelle(parameters);
            
            logger.debug("Applica WK Gestione Richieste Cartella -> " + JSON.stringify(obj));
            
            if (obj.SUCCESS)
            {
            	$("#divWk").worklist().config.structure.id_query = obj.QUERY;

            	return true;
            }
            else
            {
            	return false;
            }
            
    	}
    },
    
    events:function(){
        
    	$('#tabs-Worklist').children().click(function(){
            NS_GESTIONE_CARTELLE.tab_sel = $(this).attr('data-tab');
           NS_GESTIONE_CARTELLE.caricaWk(); 

        });

        NS_GESTIONE_RICHIESTE_CARTELLE.events();
        
        $(window).on("beforeunload", function(){
        	// ripristino beforeApplica originaria
            NS_FENIX_WK.beforeApplica=NS_GESTIONE_CARTELLE.saveBeforeApplica;
        	logger.debug("ripristino beforeApplica originaria");
            return;
        });
        
        $("#lblResetCampi").click(function () { 

    		$("#h-txtDaDataA").val(""); 			 //reset date Hidden
    		$("#h-txtADataA").val("");   			 //reset date Hidden
    		$("#h-txtStatoCartellaRich").val("");    //reset filtro stato Hidden
    		
    		$("#filtri")[0].reset(); 				//reset all form txt
    		
    	 	$(".CBpulsSel").attr('class','CBpuls CBcolorDefault');
    	});
    },
    initLogger:function(){
        /**implementazione logger*/
        top.NS_CONSOLEJS.addLogger({name:'GESTIONE_CARTELLE',console:0});
        window.logger = top.NS_CONSOLEJS.loggers['GESTIONE_CARTELLE'];
//          logger.debug("quello che vuoi");
//          logger.error("quello che vuoi");
    },
    initFiltroStruttura:function(){
        var param={"webuser":$("#USERNAME").val()};
        dwr.engine.setAsync(false);
        toolKitDB.getResultDatasource("ADT.Q_STRUTTURA_UTENTE_ARCHIVIO","ADT",param,null,function(resp){
            $("#txtStruttura").val(resp[0].CODICE_STRUTTURA);
        });
        dwr.engine.setAsync(true);
    },
    
    setBackgroundMorte:function(data,td){

    	var Datamorte = data.DATA_MORTE;
    	if (Datamorte!=null){
            td.css({'background-color':'#7a7a7a'});
            data.ASSISTITO=data.ASSISTITO+" (Deceduto)";
        }
        return data.ASSISTITO;
    },
    
    caricaWk:function(){

        switch   (NS_GESTIONE_CARTELLE.tab_sel) 
        {
            case 'filtroGrouper' :
            	 if(NS_GESTIONE_CARTELLE.wkGrouper){
 	            	if( ($("#txtCognomeListaRichiesteGrouper").val() == '') && ($("#txtNCartellaGrouper").val()=='') && ($("#h-txtDaDataGrouper").val()=='') && ($("#h-txtADataGrouper").val()=='')) {
 	            		// se nessun filtro obbligatorio è valorizzato metto di default le date
 	            		home.NOTIFICA.error({message: "Compilare almeno un campo tra cognome , n. cartella, da data , a data", title: "Error"});
 	            		var daData = $("#txtDaDataGrouper").data('Zebra_DatePicker');
 	                    daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));
 	                    var aData = $("#txtADataGrouper" ).data('Zebra_DatePicker');
 	                    aData.setDataIso(moment().format('YYYYMMDD'));
 	                    // salvo i nuovi filtri
 	                    NS_FENIX_FILTRI.salvaFiltri( NS_FENIX_FILTRI.leggiFiltriDaSalvare());
 	            	}
             	 }
                 NS_GESTIONE_CARTELLE.caricaWkDRGTariffazione();
                break;
                
            case 'filtroRichiesteCartelle':
            	 
            	if(NS_GESTIONE_CARTELLE.wkRichCartelle)
            	{
            		// Selezione successiva del tabulatore
	            	if( ($("#txtCognomeRichieste").val() == '') && ($("#txtNCartellaRich").val()=='') && ($("#h-txtDaDataA").val()=='') && ($("#h-txtADataA").val()=='')) 
	            	{
	            		// se nessun filtro obbligatorio è valorizzato metto di default le date
	            		home.NOTIFICA.error({message: "Compilare almeno un campo tra cognome , n. cartella, da data , a data", title: "Error"});
	            		

	                    NS_FENIX_FILTRI.salvaFiltri( NS_FENIX_FILTRI.leggiFiltriDaSalvare());
	            	}
            	 }
     
                NS_GESTIONE_CARTELLE.caricaWkRichiesteCartelle();
                break;
                
            case 'filtroCartelle':
                 NS_GESTIONE_CARTELLE.caricaWkGestMovCartell();
                break;
                
            default:
                NS_GESTIONE_CARTELLE.caricaWkGestMovCartell();
                break;
        }
    },

    caricaWkDRGTariffazione : function(){

        if(!NS_GESTIONE_CARTELLE.wkGrouper){
            var daData = $("#txtDaDataGrouper").data('Zebra_DatePicker');
            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

            var aData = $("#txtADataGrouper").data('Zebra_DatePicker');
            aData.setDataIso(moment().format('YYYYMMDD'));
            
            NS_FENIX_FILTRI.salvaFiltri( NS_FENIX_FILTRI.leggiFiltriDaSalvare());
//            NS_FENIX_FILTRI.applicaFiltri(); 
        }
        else{
        	if( ($("#txtCognomeListaRichiesteGrouper").val() == '') && ($("#txtNCartellaGrouper").val()=='') && ($("#h-txtDaDataGrouper").val()=='') && ($("#h-txtADataGrouper").val()=='')) {
        		home.NOTIFICA.error({message: "Compilare almeno un campo tra cognome , n. cartella, da data , a data", title: "Error"});
        		NS_GESTIONE_CARTELLE.wkGrouper.refresh();
        	}
        	else{
        		if ($("#txtCognomeListaRichiesteGrouper").val() != '' && $("#txtNomeListaRichiesteGrouper").val() == ''){
        			home.NOTIFICA.error({message: "Compilare sia cognome che nome o parte di essi", title: "Error"});
            		NS_GESTIONE_CARTELLE.wkGrouper.refresh();
        		}        		
        	}
        }
        
        var nome = $("#txtNomeListaRichiesteGrouper").val() == '' ? '%25' : $("#txtNomeListaRichiesteGrouper").val();
        var cognome = $("#txtCognomeListaRichiesteGrouper").val() == '' ? '%25' :  $("#txtCognomeListaRichiesteGrouper").val();
        var cartella = $("#txtNCartellaGrouper").val() == '' ? '' :  $("#txtNCartellaGrouper").val();
        NS_GESTIONE_CARTELLE.wkGrouper=new WK({
            id:"ADT_WK_GESTIONE_CARTELLE_GROUPER",
            container:"divWk",
            aBind : ["username","c_cartella","cognome","nome"],
            aVal : [$('#USERNAME').val(),cartella,cognome, nome],
            load_callback: null,
            loadData:true
        });
        NS_GESTIONE_CARTELLE.wkGrouper.loadWk();
    },
    
    definisciQueryWKRichiesteCartelle : function(p){
    	
    	if (p.iden_richiesta != null ) 
    	{
    		p.QUERY = "WORKLIST.WK_GESTIONE_RICHIESTE_CARTELLE_BY_IDEN_RICHIESTA";
    	} 
    	else if (p.cartella != null)
    	{
    		p.QUERY = "WORKLIST.WK_GESTIONE_RICHIESTE_CARTELLE_BY_CARTELLA";
    	}
    	else if (p.cognome != null && p.cognome.length >= 3)
    	{
    		p.QUERY = "WORKLIST.WK_GESTIONE_RICHIESTE_CARTELLE_BY_DATI_ANAGRAFICI";
    	}
    	else if (p.da_data != null && p.a_data != null) 
    	{
    		p.QUERY = "WORKLIST.WK_GESTIONE_RICHIESTE_CARTELLE_BY_DATA_RANGE";
    	}
    	else
    	{
    		home.NOTIFICA.error({message: "Valorizzare almeno uno dei seguenti criteri: 1) iden richiesta 2) numero di cartella 3) 3 caratteri del cognome 4) range di Date", title: "Error"});
    		p.SUCCESS = false;
    	}
    	
    	return p;
    }, 
    
    caricaWkRichiesteCartelle : function () {
    	
    	var daData = $("#txtDaDataA").data('Zebra_DatePicker'); daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));
        var aData = $("#txtADataA" ).data('Zebra_DatePicker'); aData.setDataIso(moment().format('YYYYMMDD'));
        
        //alert($("#h-txtDaDataA").val());
        //alert($("#h-txtADataA").val())
        var parameters = 
        {
        		"iden_richiesta" : $("#txtIdenRichiesta").val() == "" ? null  :  $("#txtIdenRichiesta").val(),
        		"cognome" : $("#txtCognomeRichieste").val() == "" ? null  : $("#txtCognomeRichieste").val(), "nome" : $("#txtNomeRichieste").val() == "" ? null : $("#txtNomeRichieste").val(), "data_nascita" : $("#DataNasc").val() == "" ? null : $("#h-DataNasc").val(),
        		"anno" : $("#txtAnno").val() == "" ? null :  $("#txtAnno").val(), "struttura" : $("#txtStruttura").val() == "" ? null  : $("#txtStruttura").val(), "cartella" : $("#txtNCartellaRich").val() == "" ? null  : $("#txtNCartellaRich").val(),
        		"da_data" : $("#h-txtDaDataA").val() == "" ? null :  $("#h-txtDaDataA").val(), "a_data" : $("#h-txtADataA").val() == "" ? null :  $("#h-txtADataA").val(),
        		"SUCCESS" : true,
        		"QUERY" : ""
        };
        
        var obj = NS_GESTIONE_CARTELLE.definisciQueryWKRichiesteCartelle(parameters);
        
        logger.debug("Applica WK Gestione Richieste Cartella -> " + JSON.stringify(obj));
        
        if (obj.SUCCESS)
        {
	        NS_GESTIONE_CARTELLE.wkRichCartelle = new WK({
	        	id :"ADT_WK_GESTIONE_RICHIESTE_CARTELLE",
	            container :"divWk",
	            aBind : obj.BIND_NAME,
	            aVal : obj.BIND_VALUE,
	            load_callback : null,
	            loadData : false
	        });
        
	        NS_GESTIONE_CARTELLE.wkRichCartelle.loadWk();
        }
    },
    
    caricaWkGestMovCartell : function () {
        if(!NS_GESTIONE_CARTELLE.wkCartelle){
            var daData = $("#txtDaData" ).data('Zebra_DatePicker');
            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

            var aData = $("#txtAData" ).data('Zebra_DatePicker');
            aData.setDataIso(moment().format('YYYYMMDD'));
        }
        var cartella =($("#txtNCartella").val()=='') ? null  : 
        	$("#txtNCartella").val();       
        var nome =  ($('#txtNome').val()=='')?'%25':
            $('#txtNome').val();
        var cognome = ($('#txtCognome').val()=='')?'%25':
            $('#txtCognome').val();
        NS_GESTIONE_CARTELLE.wkCartelle=new WK({
            id:"ADT_WK_GESTIONE_CARTELLE",
            container:"divWk",
            aBind : ["username","c_cartella","cognome","nome"],
            aVal :
                [$('#USERNAME').val(),cartella,cognome,nome],
            load_callback: null,
            loadData:true
        });
        // NS_FENIX_FILTRI.applicaFiltri();
        NS_GESTIONE_CARTELLE.wkCartelle.loadWk();
    },
    
    RiceviInArchivio : function(rec){
    	
        var ta = $(	"<table>" +
        		"<tr><td><input id='txtArchivio' type=hidden value='" + IDEN_ARCHIVIO + "'></input>" + ARCHIVIO + "</td></tr>" + 
				"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
				"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataRicezioneCartella'/><input type='text' id='txtOraRicezioneCartella' class='tdObb' /></td></tr>" +
			"</table>");

        $.dialog(ta, {
					buttons : 	[
					          	 {label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
					          	 {label : "Prosegui", action : function(){ completaRicezioneCartella(); }}
					          	 ],
					          	 title : "Archiviazione Cartelle",
					          	 height:340,
					          	 width:250
        });
        
        var completaRicezioneCartella = function(){
        	
        	var _ora = $('#txtOraRicezioneCartella').val();
         	var _data = $('#h-txtDataRicezioneCartella').val();
         	var dataOra = _data + ' ' + _ora;
             
             if (_data == "" || _data == null){
             	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
             }
             
             if (_ora.length < 5) {
             	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
             }
             
             var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
             var aIdenContatti = new Array(rec.length);
             var aIdenCdc = new Array(rec.length);
             
             for (var i=0; i < rec.length; i++)
             {
                 aIdenContatti[i]=rec[i].IDEN_CONTATTO;
                 aIdenCdc[i]=IDEN_ARCHIVIO;
             }
             
             var parametri = {
                 pStato:{v:cartellaRicevutaInArchivio, t:'V'},
                 aIdenContatti:{v: aIdenContatti, t:'A'},
                 pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
                 aArchivi:{v:aIdenCdc, t:'A'},
                 pData:{v:dataOra,t:'V'},
                 p_result:{t:'V',d:'O'}
             };
             
             db.call_procedure(
             {
                 id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
                 parameter : parametri,
                 success: function(data){
                     home.NOTIFICA.success({message: 'Movimento cartelle eseguito correttamente', timeout: 2, title: 'Success'});
                 }
             });
             
             $.dialog.hide();
             NS_GESTIONE_CARTELLE.refreshWk();
             
        };
        
        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
        	$("#h-txtDataRicezioneCartella").val(data);
        }});
        
        $('#txtOraRicezioneCartella').live().setMask("29:59").keypress(function() {
            
         	var currentMask = $(this).data('mask').mask;
             var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
             
             if (newMask != currentMask) {
                 $(this).setMask(newMask);
             }
             
         }).val(moment().format('HH:mm'));

         
         $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
         $("#tdOraCartella").css({"padding-top":"5px"});
    },
    
    stampaStoricoRicoveriCartella : function(IDEN_ANAGRAFICA){
    	
     var _par = {};
     _par.PRINT_DIRECTORY = 'STORICO_RICOVERI';
     _par.PRINT_REPORT = 'STORICO_RICOVERI_PZ';
     _par.PRINT_PROMPT = "&promptIDEN_ANAGRAFICA=" + IDEN_ANAGRAFICA;
     
     home.NS_FENIX_PRINT.apri(_par);
    },
 
    stampaAccessiDH : function(idenContatto){
        var _par = {};
        _par.PRINT_DIRECTORY = 'DH';
        _par.PRINT_REPORT = 'ACCESSI_DH';
        _par.PRINT_PROMPT = "&promptpidenContatto=" + idenContatto;
        
        home.NS_FENIX_PRINT.apri(_par);
       },
       
    setStatoCartellaPersa:function(rec){
        
    	if (rec.length > 1) {
    		return home.NOTIFICA.error({message: "Selezionare una singola cartella", title: "Error"});            
        }
    	
    	var completaPerditaCartella = function(rec){
    		
    		var _ora = $('#txtOraPerditaCartella').val();
        	var _data = $('#h-txtDataPerditaCartella').val();
        	var dataOra = _data + ' ' + _ora;
        	
        	if (_data == "" || _data == null){
        		return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
        	}
              
            if (_ora.length < 5) {
            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
            }

    		NS_GESTIONE_CARTELLE.setMovimentoCartella(rec[0].IDEN_CONTATTO,cartellaPersa,IDEN_ARCHIVIO,dataOra,0);
            $.dialog.hide();
            
    	};

    	var ta = $("<table>" +
				"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
				"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataPerditaCartella'/><input type='text' id='txtOraPerditaCartella' class='tdObb' /></td></tr>" +
			"</table>");
        
    	$.dialog(ta, {
            buttons : 	[{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
                      	 {label : "Prosegui", action : function(){ completaPerditaCartella(rec); }}
            			],
            title : "Gestione Cartelle",
            height:340,
            width:250
        });
    	
    	ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, startWithToday: true, onSelect: function(data,dataIso) {
    		$("#h-txtDataPerditaCartella").val(data);
        }});
    	
    	$('#txtOraPerditaCartella').live().setMask("29:59").keypress(function() {
            
        	var currentMask = $(this).data('mask').mask;
            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
            
            if (newMask != currentMask) {
                $(this).setMask(newMask);
            }
            
        }).val(moment().format('HH:mm'));

        
        $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
        $("#tdOraCartella").css({"padding-top":"5px"});
        
    },
    
    riepiligoaccessidh:function(rec){
    	home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=RIEPILOGO_ACCESSI_DH&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&IDEN_CONTATTO='+rec[0].IDEN_CONTATTO+'&STATO_PAGINA=R',fullscreen:true});
    },
    
    
    /*
     var ta = $(	"<table>" +
        		"<tr><td><input id='txtArchivio' type=hidden value='" + IDEN_ARCHIVIO + "'></input>" + ARCHIVIO + "</td></tr>" + 
				"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
				"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataRicezioneCartella'/><input type='text' id='txtOraRicezioneCartella' class='tdObb' /></td></tr>" +
			"</table>");

        $.dialog(ta, {
					buttons : 	[
					          	 {label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
					          	 {label : "Prosegui", action : function(){ completaRicezioneCartella(); }}
					          	 ],
					          	 title : "Archiviazione Cartelle",
					          	 height:340,
					          	 width:250
        });
        
        var completaRicezioneCartella = function(){
        	
        	var _ora = $('#txtOraRicezioneCartella').val();
         	var _data = $('#h-txtDataRicezioneCartella').val();
         	var dataOra = _data + ' ' + _ora;
             
             if (_data == "" || _data == null){
             	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
             }
             
             if (_ora.length < 5) {
             	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
             }
             
             var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
             var aIdenContatti = new Array(rec.length);
             var aIdenCdc = new Array(rec.length);
             
             for (var i=0; i < rec.length; i++)
             {
                 aIdenContatti[i]=rec[i].IDEN_CONTATTO;
                 aIdenCdc[i]=IDEN_ARCHIVIO;
             }
             
             var parametri = {
                 pStato:{v:cartellaRicevutaInArchivio, t:'V'},
                 aIdenContatti:{v: aIdenContatti, t:'A'},
                 pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
                 aArchivi:{v:aIdenCdc, t:'A'},
                 pData:{v:dataOra,t:'V'},
                 p_result:{t:'V',d:'O'}
             };
             
             db.call_procedure(
             {
                 id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
                 parameter : parametri,
                 success: function(data){
                     home.NOTIFICA.success({message: 'Movimento cartelle eseguito correttamente', timeout: 2, title: 'Success'});
                 }
             });
             
             $.dialog.hide();
             NS_GESTIONE_CARTELLE.refreshWk();
             
        };
        
        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
        	$("#h-txtDataRicezioneCartella").val(data);
        }});
        
        $('#txtOraRicezioneCartella').live().setMask("29:59").keypress(function() {
            
         	var currentMask = $(this).data('mask').mask;
             var newMask = $(this).val().match(/^2.*//*) ? "23:59" : "29:59";
             
             if (newMask != currentMask) {
                 $(this).setMask(newMask);
             }
             
         }).val(moment().format('HH:mm'));

         
         $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
         $("#tdOraCartella").css({"padding-top":"5px"});
         */
    
    setStatoCartellaArchiviata:function(rec){
    	
    	var ta = $(	"<table>" +
        		"<tr><td><input id='txtArchivio' type=hidden value='" + IDEN_ARCHIVIO + "'></input>" + ARCHIVIO + "</td></tr>" + 
				"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
				"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataArchiviazioneCartella'/><input type='text' id='txtOraArchiviazioneCartella' class='tdObb' /></td></tr>" +
			"</table>");

        $.dialog(ta, {
					buttons : 	[
					          	 {label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
					          	 {label : "Prosegui", action : function(){ completaArchiviazioneCartella(); }}
					          	 ],
					          	 title : "Archiviazione Cartelle",
					          	 height:340,
					          	 width:250
        });
    	
        var completaArchiviazioneCartella = function(){
        	
        	var _ora = $('#txtOraArchiviazioneCartella').val();
         	var _data = $('#h-txtDataArchiviazioneCartella').val();
         	var dataOra = _data + ' ' + _ora;
             
             if (_data == "" || _data == null){
             	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
             }
             
             if (_ora.length < 5) {
             	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
             }
             
             var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
             var aIdenContatti = new Array(rec.length);
             var aIdenCdc = new Array(rec.length);
             
             for (var i=0; i<rec.length; i++)
             {
                 aIdenContatti[i]=rec[i].IDEN_CONTATTO;
                 aIdenCdc[i]=IDEN_ARCHIVIO;
             }
             
             var parametri = {
                 pStato:{v:cartellaArchiviata, t:'V'},
                 aIdenContatti:{v: aIdenContatti, t:'A'},
                 pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
                 aArchivi:{v:aIdenCdc, t:'A'},
                 pData:{v:dataOra,t:'V'},
                 p_result:{t:'V',d:'O'}
             };
             
             db.call_procedure(
             {
                 id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
                 parameter : parametri,
                 success: function(data){
                     home.NOTIFICA.success({message: 'Movimento cartelle eseguito correttamente', timeout: 2, title: 'Success'});
                 }
             });
             
             $.dialog.hide();
             NS_GESTIONE_CARTELLE.refreshWk();
        };
        
        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
        	$("#h-txtDataArchiviazioneCartella").val(data);
        }});
        
        $('#txtOraArchiviazioneCartella').live().setMask("29:59").keypress(function() {
            
        	var currentMask = $(this).data('mask').mask;
            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
             
            if (newMask != currentMask) {
            	$(this).setMask(newMask);
            }
             
         }).val(moment().format('HH:mm'));
         
         $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
         $("#tdOraCartella").css({"padding-top":"5px"});
    },
    
    setStatoCartellaSequestrata:function(rec){
    	
    	var cmbAutorita;
        
    	if (rec.length>1){
    		return home.NOTIFICA.error({message: "Selezionare una singola cartella", title: "Error"});
        }
        else if (rec[0].CODICE_STATO_CARTELLA==cartellaSequestrata)
        {
        	return home.NOTIFICA.error({message: "La cartella e' gia' in stato di SEQUESTRATA" , timeout: 5, title: "Error"});
        }
    	
    	var param={};
    	
        dwr.engine.setAsync(false);
        
        toolKitDB.getResultDatasource("ADT.Q_AUTORITA_CARTELLA_SEQ","ADT",param,null,function(resp)
        {
            if (resp.length>0)
            {
                cmbAutorita = "<table style='height:50px;'><tr><td class='tdLbl'>Autorita giudiziaria <select id='cmbAutorita'><option value='0'></option>";
                
                for (var i=0; i<resp.length; i++)
                {
                    cmbAutorita+="<option value='"+resp[i].VALUE+"'>"+resp[i].DESCR+"</option>";
                }
                
                cmbAutorita += "</select></td></tr><tr><td><div id='gestioneRichiesteCartelle'></div></td></tr><tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataSequestroCartella'/><input type='text' id='txtOraSequestroCartella' class='tdObb' /></td></tr></table>";
                cmbAutorita = $(cmbAutorita);
            }
        });
        dwr.engine.setAsync(true);
        
        var completaSequestroCartella = function(rec){
    		
    		var _ora = $('#txtOraSequestroCartella').val();
        	var _data = $('#h-txtDataSequestroCartella').val();
        	var dataOra = _data + ' ' + _ora;
        	
        	if (_data == "" || _data == null){
        		return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
        	}
              
            if (_ora.length < 5) {
            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
            }

            NS_GESTIONE_CARTELLE.setMovimentoCartella(rec[0].IDEN_CONTATTO,cartellaSequestrata,IDEN_ARCHIVIO,dataOra,$("#cmbAutorita option:selected").val());
            $.dialog.hide();
            
    	};
    	
        $.dialog(cmbAutorita, {
                buttons : [
                           { label: "Annulla", action: function (ctx){ $.dialog.hide(); }},
                           {label : "Prosegui", action : function(){ completaSequestroCartella(rec); }}
                          ],
                           
                title : "Gestione cartella Sequestrata",
                height:350,
                width:250
            });
        
        cmbAutorita.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
        	$("#h-txtDataSequestroCartella").val(data);
        }}); 
        
        $('#txtOraSequestroCartella').live().setMask("29:59").keypress(function() {
            
         	var currentMask = $(this).data('mask').mask;
             var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
             
             if (newMask != currentMask) {
                 $(this).setMask(newMask);
             }
             
         }).val(moment().format('HH:mm'));

         
         $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
         $("#tdOraCartella, #gestioneRichiesteCartelle").css({"padding-top":"5px"});
            
    },
    
    setStatoCartellaReinviata:function(rec){

    	if (rec.length>1){
    		return home.NOTIFICA.error({message: "Selezionare una singola cartella", title: "Error"});
        }

    	var ta = $(	"<table>" +
					"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
					"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataReinvioCartella'/><input type='text' id='txtOraReinvioCartella' class='tdObb' /></td></tr>" +
				"</table>");
 
    	$.dialog(ta, {
    		buttons : 	[{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
               	 {label : "Prosegui", action : function(){ completaReinvioCartella(rec); }}
     			],
     			title : "Reinvio Cartella",
     			height:340,
     			width:250
    	});
	
    	var completaReinvioCartella = function(rec){
    		
    		var _ora = $('#txtOraReinvioCartella').val();
         	var _data = $('#h-txtDataReinvioCartella').val();
         	var dataOra = _data + ' ' + _ora;
         	
         	if (_data == "" || _data == null){
             	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
            }
             
            if (_ora.length < 5) {
            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
            }
             
    		NS_GESTIONE_CARTELLE.setMovimentoCartella(rec[0].IDEN_CONTATTO,cartellaReinviataInReparto,IDEN_ARCHIVIO,dataOra,0);
            $.dialog.hide();
    	};
    	
        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
        	$("#h-txtDataReinvioCartella").val(data);
        }});
        
        $('#txtOraReinvioCartella').live().setMask("29:59").keypress(function() {
            
         	var currentMask = $(this).data('mask').mask;
             var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
             
             if (newMask != currentMask) {
                 $(this).setMask(newMask);
             }
             
         }).val(moment().format('HH:mm'));

         
         $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
         $("#tdOraCartella").css({"padding-top":"5px"});
    },
    
    resetStatoCartella: function(rec){
       /* dwr.engine.setAsync(false);
        var parameters =
        {
            'pIdenContatto':rec[0].IDEN_CONTATTO,
            'pIdenPer': home.baseUser.IDEN_PER
        };
        //alert(JSON.stringify(parameters));
        toolKitDB.executeProcedureDatasource('ADT_MOVIMENTI_CARTELLA.annulla_movimento_cartella',"ADT",parameters,function(resp){
            var response = resp['p_result'];
            //alert(response);
            if(response == 'OK'){
                home.NOTIFICA.success({message: 'Operazione eseguita', timeout: 3, title: 'Success'});

            }else{
                logger.error('Risposta ADT_MOVIMENTI_CARTELLA.annulla_movimento_cartella = ' + response[1]);
                home.NOTIFICA.error({message: "Attenzione errore nella modifica di stato cartella", title: "Error"});
            }
        });
        dwr.engine.setAsync(true);
        NS_GESTIONE_CARTELLE.wkCartelle.refresh();*/
    	if (rec.length>1){
            home.NOTIFICA.error({message: "Selezionare una singola cartella", title: "Error"});
            return;
        }
    	home.DIALOG.si_no({
             title: "Conferma annullamento stato attuale cartella",
             cbkSi:function(){
            	 var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
            	 var parametri={
            			 pIdenContatto:{v:rec[0].IDEN_CONTATTO,t:'N'},
            	         pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
            	         p_result:{t:'V',d:'O'}
            	 }
            	 db.call_procedure(
            	            {
            	                id: 'ADT_MOVIMENTI_CARTELLA.annulla_movimento_cartella',
            	                parameter : parametri,
            	                success: function(data){
            	                	home.NOTIFICA.success({message: 'Stato cartella annullato', timeout: 2, title: 'Success'});
            	                    NS_GESTIONE_CARTELLE.refreshWk();
            	                },
            	                error:function(data){
            	                	alert(data);
            	                }
            	            });
             }
         });

    },
    setMovimentoCartella: function(idenContatto,codStato,idenArchivio,dataEvento,idenAutoritaSeq){
       	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        // set stato cartella 
        var parametri = {
            pStato:{v:codStato,t:'V'},
            pIdenContatto:{v:idenContatto,t:'N'},
            pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
            pArchivio:{v:idenArchivio,t:'N'},
            pData:{v:dataEvento,t:'V'},
            pAutoritaSeq:{v:idenAutoritaSeq, t:'N'},
            p_result:{t:'V',d:'O'}
        };
        db.call_procedure(
            {
                id: 'ADT_MOVIMENTI_CARTELLA.insert_movimento_cartella',
                parameter : parametri,
                success: function(data){
                	home.NOTIFICA.success({message: 'Stato cartella aggiornato', timeout: 2, title: 'Success'});
                    NS_GESTIONE_CARTELLE.refreshWk();
                },
                error:function(data){
                	alert(data);
                }
            });
    },
    richiediAnalisiGrouper:function(rec){
        /*per ogni riga dovr� inserire un record sulla tabella analisi_grouper
         * nome della function = richiedi_analisi_grouper
         */
        for (var i=0; i<rec.length; i++){
            dwr.engine.setAsync(false);
            var parameters =
            {
                "pIdenContatto" :  rec[i].IDEN_CONTATTO,
                "pIdenPer" : home.baseUser.IDEN_PER
            };
            toolKitDB.executeProcedureDatasource('ADT_GROUPER.RICHIEDI_ANALISI_GROUPER',"ADT",parameters,function(resp){

                var message = resp.p_result.split('|');
                if(message[0]=='OK'){
                    home.NOTIFICA.success({ message : message[1] , timeout:3, title : 'Richiesta Andata a buon fine' });
                }else if(message[0]=='KO'){
                    home.NOTIFICA.error({message:  message[1],timeout: 5,  title: "Error"});
                }

            });
            dwr.engine.setAsync(true);

        }
        NS_GESTIONE_CARTELLE.wkCartelle.refresh();
    },
    setTariffa: function(rec){
        var aIdenContatti=new Array(rec.length);
        for (var i=0; i<rec.length; i++){
            aIdenContatti[i]=rec[i].IDEN_CONTATTO;
        }
        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        var parametri = {
            aIdenContatti:{v: aIdenContatti, t:'A'},
            pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
            p_result:{t:'V',d:'O'}
        };
        db.call_procedure(
            {
                id: 'ADT_GROUPER.TariffaDrgContatti',
                parameter : parametri,
                success: function(data){
                    var aRisultati=new Array();
                    var strRisultati;
                    var flgOk=true;
                    strRisultati=data.p_result;
                    var aRisultati=(strRisultati.split('*'));
                    for (var i=0; i<aRisultati.length; i++){
                        if (aRisultati[i].substring(0,2)=='KO'){
                            home.NOTIFICA.error({message:aRisultati[i],timeout: 5, title: 'Errore'});
                            flgOk=false;
                        }
                    }
                    if (flgOk){
                        home.NOTIFICA.success({message: 'Tariffazione eseguita correttamente', timeout: 2, title: 'Success'});
                    }
                    NS_GESTIONE_CARTELLE.wkGrouper.refresh();
                }
            });
    },
    annullaDrg: function(rec){
        if (rec.length>1){
            home.NOTIFICA.error({message: "Selezionare una singola cartella" , timeout: 5, title: "Error"});
            return;
        }
        home.DIALOG.si_no({
            title: "Cancellazione codice DRG",
            msg:"Si conferma l'operazione per la cartella "+rec[0].CODICE,
            cbkSi:function(){
                dwr.engine.setAsync(false);
                var parameters =
                {
                    "pIdenContatto" :  rec[0].IDEN_CONTATTO,
                    "pIdenPer" : home.baseUser.IDEN_PER
                };
                toolKitDB.executeProcedureDatasource('ADT_GROUPER.annulla_drg',"ADT",parameters,function(resp){

                	var message = resp.p_result.split('|');
                	
                    if(message[0]=='OK'){
                        home.NOTIFICA.success({ message : message[1] , timeout:3, title : 'Operazione andata a buon fine' });
                        NS_GESTIONE_CARTELLE.wkGrouper.refresh();
                    }else if(message[0]=='KO'){
                        home.NOTIFICA.error({message:  message[1],timeout: 5,  title: "Error"});
                    }

                });
                dwr.engine.setAsync(true);

            }
        });
    },
    annullaTariffa: function(rec){
        if (rec.length>1){
        	home.NOTIFICA.error({message: "Selezionare una singola cartella" , timeout: 5, title: "Error"});

            return;
        }
        home.DIALOG.si_no({
            title: "Cancellazione tariffa DRG",
            msg : "Si conferma l'operazione per la cartella "+rec[0].CODICE,
            cbkSi:function(){
                dwr.engine.setAsync(false);
                var parameters =
                {
                    "pIdenContatto" :  rec[0].IDEN_CONTATTO,
                    "pIdenPer" : home.baseUser.IDEN_PER
                };
                toolKitDB.executeProcedureDatasource('ADT_GROUPER.annulla_tariffa',"ADT",parameters,function(resp){
                	
                    var message = resp.p_result.split('|');
                    if(message[0]=='OK'){
                        home.NOTIFICA.success({ message : message[1] , timeout:3, title : 'Operazione andata a buon fine' });
                        NS_GESTIONE_CARTELLE.wkGrouper.refresh();
                    }else if(message[0]=='KO'){
                        home.NOTIFICA.error({message:  message[1],timeout: 5,  title: "Error"});
                    }

                });
                dwr.engine.setAsync(true);
            }
        });

    },
    
    AnnullaDrg_e_Tariffa: function(rec){
    	NS_GESTIONE_CARTELLE.annullaTariffa(rec);
    	NS_GESTIONE_CARTELLE.annullaDrg(rec);  	
    },
    calcolaDRG: function(rec){

        NS_GESTIONE_CARTELLE.setProgressBarDialog();

        var urlToCall = _URL_GENERAZIONE_FLUSSI + 'DRG/calcola?' ;
        var nContatti = rec.length;
        var idenContatti = '';

        for(var i=0; i<rec.length; i++){
            if (i==0)
            {idenContatti=rec[i].IDEN_CONTATTO;}
            else
            {idenContatti+=','+rec[i].IDEN_CONTATTO;}
        }
        var dataToSend= '::nContatti='+ nContatti+'::idenContatti='+idenContatti+'::hostname='+home.basePC.IP;

        logger.debug('Function urlToCall -> ' + urlToCall);
        logger.debug('Function Callback dataToSend -> ' + dataToSend);
        
        alert('Inizio Procedura di Calcolo DRG');

        jQuery.support.cors = true;

        jQuery.ajax({
            url: "proxy",
            async:true,
            data:"CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET",
            cache: false,
            type: "POST",
            crossDomain: false,
            contentType:"application/x-www-form-urlencoded",
            success: function (resp)
            {
                if (resp==""){
                    home.NOTIFICA.error({message: "Error in ajax response", timeout: 5, title: "Error"});
                    return false;
                }
                eval('var json = ' + resp);

                if(json.success)
                {
                    home.NOTIFICA.success({message: "Calcolo DRG completato", timeout: 3, title: 'Success'});
                    // refresh worklist
                    //NS_GESTIONE_CARTELLE.wkGrouper.refresh();
//                   calcolo tariffa
                    NS_GESTIONE_CARTELLE.setTariffa(rec);
                }
                else
                {
                    home.NOTIFICA.error({message: "Errore nel calcolo DRG: " + json.message, timeout: 5, title: "Error"});
                }

            },
            error: function (resp)
            {
                home.NOTIFICA.error({message: "Errore nel calcolo DRG", timeout: 5, title: "Error"});
                dialPD.close();
            }
        });
        //dwr.engine.setAsync(true);



    },

    setProgressBarDialog : function(callBack)
    {

        var p = {'msg': "<div id='progressbar'><div id='progress-label' class='progress-label'></div></div>", 'title':'Avanzamento Calcolo DRG'};
        dialPD = $.dialog(p.msg,
            {
                title: p.title,
                showBtnClose: false,
                showMask:true,
                buttons: [],
                width: 450
            }
        );

        logger.debug('setProgressBarDialog -> 0')

        $('#progressbar').css({'height' : '25px'});
        var prgbar = $('#progressbar');
        var progressLabel = $('.progress-label'); progressLabel.text('0%');

        prgbar.progressbar({
            value: 0,
            change: function() {
                logger.debug('setProgressBarDialog Completato ');
                progressLabel.text( prgbar.progressbar("value") + '% (' + prgbar.progressbar('option','elaborati') +  ' di ' + prgbar.progressbar('option','record') + ')');
            },
            complete: function() {
                logger.debug('setProgressBarDialog Completato ');
                progressLabel.text("100%");
                dialPD.close();
                //NS_GESTIONE_CARTELLE.wkGrouper.refresh();
            }
        });

        // Definisco Una Funzione Chiamabile dal Top In cui viene lanciato il codice JS dall APPLET
        home.setPercentualeAvanzamento = function(p)
        {
            // L'oggetto passato ('{value : 95.0,record : 4075, elaborati : 3668}') dall'APPLET viene visto solo come STRINGA quindi lo trasformo
            logger.debug('setProgressBarDialog from APPLET -> p ' + JSON.stringify(p))
            eval('var params = ' + p);
            $("#progressbar").progressbar( "option", {record : params.record, elaborati : params.elaborati});
            $("#progressbar").progressbar({value : params.value});
        };

    },

    calcolaDRGMese: function(rec){

        // Inizializzo la Progress Bar
        NS_GESTIONE_CARTELLE.setProgressBarDialog();
        // setTimeout( function(){home.setPercentualeAvanzamento('{value : 41, record : 5478, elaborati : 863}');}, 1000);

        var urlToCall = _URL_GENERAZIONE_FLUSSI + 'DRG/elaboraMese?' ;
        var sData=$("#txtDaDataGrouper").val();
        var mese=sData.substring(3,5);
        var anno=sData.substring(6);
        switch (mese){
            case "01":
                sMese="GEN";
                break;
            case "02":
                sMese="FEB";
                break;
            case "03":
                sMese="MAR";
                break;
            case "04":
                sMese="APR";
                break;
            case "05":
                sMese="MAG";
                break;
            case "06":
                sMese="GIU";
                break;
            case "07":
                sMese="LUG";
                break;
            case "08":
                sMese="AGO";
                break;
            case "09":
                sMese="SET";
                break;
            case "10":
                sMese="OTT";
                break;
            case "11":
                sMese="NOV";
                break;
            case "12":
                sMese="DIC";
                break;
        }
        var dataToSend= '::periodo_ricerca='+ sMese+'-'+anno+'::hostname='+home.basePC.IP;
        jQuery.support.cors = true;
        // alert("CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET");
        //dwr.engine.setAsync(false);
        jQuery.ajax({
            url: "proxy",
            async:true,
            timeout:300000,
            data:"CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET",
            cache: false,
            type: "POST",
            crossDomain: false,
            contentType:"application/x-www-form-urlencoded",
            success: function (resp)
            {
                if (resp==""){
                    home.NOTIFICA.error({message: "Error in ajax response", timeout: 5, title: "Error"});
                    return false;
                }
                eval('var json = ' + resp);

                if(json.success)
                {
                    home.NOTIFICA.success({message: "Calcolo DRG completato", timeout: 3, title: 'Success'});
                    // refresh worklist
                    NS_GESTIONE_CARTELLE.wkGrouper.refresh();
                }
                else
                {
                    home.NOTIFICA.error({message: "Errore nel calcolo DRG: " + json.message, timeout: 5, title: "Error"});
                }

            },
            error: function (resp)
            {
                home.NOTIFICA.error({message: "Errore nel calcolo DRG", timeout: 5, title: "Error"});
            }
        });
        //dwr.engine.setAsync(true);
    },
    setBackgroundLEA: function(data,td){
        if(data.LEA=='S'){
            td.css({'background-color':'#87CEFA'});
        }
        if(data.DRG_ANOMALO=='S'){
            td.css({'text-decoration':'underline','color':'red'});
        }
        return data.CODICE_DRG;
    },
    
    setBackgroundStato_Cartella: function(data,td){
        if(data.CODICE_STATO_CARTELLA=='00'){
            td.css({'text-decoration':'underline','color':'red'});
           }
        return data.STATO_CARTELLA;
    },
    
    setBackgroundDRG_ANOMALO: function(data,td){
        if(data.DRG_ANOMALO=='N'){
            td.css({'text-decoration':'underline','color':'red'});
        }
        return data.DRG_ANOMALO;
    },
    
    setBackgroundRic:function(data,td){
        if (data.N_RICHIESTE>0){
            td.css({'background-color':'#00BFFF'});
            return data.N_RICHIESTE;
        }
        else{
            return null;
        }
    },
    impostaArchivio:function(){
        var param={"username":$("#USERNAME").val()};
        dwr.engine.setAsync(false);
        toolKitDB.getResultDatasource("ADT.Q_ARCHIVIO_REPARTI_FILTRO","ADT",param,null,function(resp){
            IDEN_ARCHIVIO= resp[0].IDEN;
            ARCHIVIO=resp[0].ARCHIVIO;
        });
        dwr.engine.setAsync(true);
    },
    refreshWk: function(){
    	 // poichè il metodo può essere richiamato da due tab diversi, si esegue il refresh della wk relativa
        if (NS_GESTIONE_CARTELLE.tab_sel=='filtroCartelle'){
            NS_GESTIONE_CARTELLE.wkCartelle.refresh();
        }
        else{
            NS_GESTIONE_CARTELLE.wkGrouper.refresh();
        }
    },
    processDatiAnag : function (IDEN_ANAG, ASSISTITO) {
        var $a =$(document.createElement('a')).text(ASSISTITO);
        $a.on('click',function(){
            top.NS_FENIX_TOP.apriPagina({'url':'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+ IDEN_ANAG,'id':'datiAnag','fullscreen':true});
        });
        return $a;
    }
}

// stato richiesta singola cartella
var COD_RIC_CART_EFFETTUATA='01';
var COD_RIC_CART_ARRIVATA='02';
// stato richiesta
var COD_RICH_EFFETTUATA='01';
var COD_RICH_NON_COMPLETA='02';
var COD_RICH_COMPLETA='03';
var COD_COPIA_FATTA_FIRMATA='04';
var COD_COPIA_CONSEGNATA='05';
var COD_COPIA_SPEDITA='06';
var COD_COPIA_SPEDITA_REPARTO='07';
var COD_COPIA_SPEDITA_ENTE='08';
var COD_RICH_SOSPESA='15';
var COD_RICH_ANNULLATA='16';

var NS_GESTIONE_RICHIESTE_CARTELLE={
    
		init:function(){

    },
    
    events:function(){
    	
    	// Allineo il comportamento del tasto invio su un filtro a quello del tasto applica
    	// Vedi NS_FENIX_WK.setInputEnterEvent e NS_FENIX_WK.setApplicaEvent
    	$("input", "div#filtroRichiesteCartelle").off("keypress").on("keypress", function (e)
		{
			if (e.keyCode == 13)
			{
				if(!NS_FENIX_WK.beforeApplica())
				{
					NS_FENIX_WK.setApplicaEvent();
					return false;
				}
				NS_FENIX_FILTRI.applicaFiltri(NS_FENIX_WK.params);
			}
		});
    },
    
    inserisciRichiesta: function(rec){
        // gestione inserimento richiesta cartella su pi� cartelle
        var flgRichiestaOk=true;
        var idenAnag=0;
        var idenContatti='';
        var nosologici='';
        // controllo che lo stato cartella sia <> persa o sequestrata
        // controllo che le cartelle appartengano allo stesso paziente
        for (var i=0; i<rec.length; i++){
            if ((rec[i].CODICE_STATO_CARTELLA==cartellaPersa) || (rec[i].CODICE_STATO_CARTELLA==cartellaSequestrata)){
                alert('La cartella '+rec[i].CODICE+ ' risulta ' +rec[i].STATO_CARTELLA+ '. Non e\' possibile fare richieste');
                flgRichiestaOk=false;
            }
            if (i==0) {
                idenAnag=rec[i].IDEN_ANAGRAFICA;
                idenContatti+=rec[i].IDEN_CONTATTO;
                nosologici+=rec[i].CARTELLA;
            }
            else{
                if (rec[i].IDEN_ANAGRAFICA==idenAnag){
                    idenContatti+=','+rec[i].IDEN_CONTATTO;
                    nosologici+=','+rec[i].CARTELLA;
                }
                else{
                	
                    alert('Le cartelle selezionate non appartengono allo stesso paziente! Non e\' possibile fare richieste');
                    flgRichiestaOk=false;
                    break;
                }

            }
        } // for

        if (flgRichiestaOk){
            // apre la pagina di inserimento richiesta
            top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=RICHIESTA_CARTELLA&IDEN_CONTATTI='+idenContatti+'&NOSOLOGICI='+nosologici+'&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&_STATO_PAGINA=I',id:'InsRichiestaCartella',fullscreen:true});
        }
    },
    modificaRichiesta: function(rec){
        var flgRichiestaOk=true;
        var idenAnag=0;
        var idenContatti='';
        var nosologici='';
        var idenRichiesta=0;
        // verifica che le cartelle selezionate appartengano alla stessa richiesta
        for (var i=0; i<rec.length; i++){
            if (i==0){
                idenAnag=rec[i].IDEN_ANAGRAFICA;
                idenContatti+=rec[i].IDEN_CONTATTO;
                nosologici+=rec[i].CARTELLA;
                idenRichiesta=rec[i].IDEN_RICHIESTA;
                if (idenRichiesta==null){
                    alert('Numero richiesta non presente. Impossibile modificare');
                    flgRichiestaOk=false;
                    break;
                }
            }
            else{
                if (idenRichiesta==null){
                    alert('Numero richiesta non presente per una o pi� cartelle. Impossibile modificare');
                    flgRichiestaOk=false;
                    break;
                }
                else if (idenRichiesta!=rec[i].IDEN_RICHIESTA){
                    alert('Le cartelle selezionate appartengono a richieste diverse. Impossibile modificare');
                    flgRichiestaOk=false;
                    break;
                }
                idenContatti+=','+rec[i].IDEN_CONTATTO;
                nosologici+=','+rec[i].CARTELLA;
            }
        }// for
        if (flgRichiestaOk){
            // apre la pagina di inserimento richiesta
            top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=RICHIESTA_CARTELLA&IDEN_CONTATTI='+idenContatti+'&NOSOLOGICI='+nosologici+'&IDEN_ANAG='+idenAnag+'&IDEN_RICHIESTA='+rec[0].IDEN_RICHIESTA+'&_STATO_PAGINA=E',id:'ModRichiestaCartella',fullscreen:true});
        }
    },
    setCartellaArrivata: function(rec){
    	
    	var ta = $(	"<table>" +
    					"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
    					"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataArrivoCartella'/><input type='text' id='txtOraArrivoCartella' class='tdObb' /></td></tr>" +
    				"</table>");
        
    	$.dialog(ta, {
            buttons : 	[{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
                      	 {label : "Prosegui", action : function(){ completaArrivoCartella(rec); }}
            			],
            title : "Gestione richieste cartelle",
            height:340,
            width:250
        });
        
    	var completaArrivoCartella = function(rec){

        	var _ora = $('#txtOraArrivoCartella').val();
        	var _data = $('#h-txtDataArrivoCartella').val();
        	var dataOra = _data + ' ' + _ora;
            var a_idenRichiesta = new Array();
            
            if (_data == "" || _data == null){
            	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
            }
            
            if (_ora.length < 5) {
            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
            }
            
            for (var i=0; i<rec.length; i++)
            {
            	if (rec[i].COD_RIC_CARTELLA==COD_RIC_CART_EFFETTUATA)
            	{
            		var param = {"pIdenContatto":rec[i].IDEN_CONTATTO, "pIdenRichiesta": rec[i].IDEN_RICHIESTA , "pIdenPer" :home.baseUser.IDEN_PER, pData:dataOra };

            		dwr.engine.setAsync(false);
            		toolKitDB.executeProcedureDatasource("ADT_MOVIMENTI_CARTELLA.setCartellaArrivata", "ADT", param, function(resp){
	                    
            			if(resp.p_result == 'KO'){
	                        home.NOTIFICA.error({message: "Attenzione errore nel salvataggio".errorSave, title: "Error"});
	                    }else if (resp.p_result == 'OK'){
	                        home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
	                    }else{
	                        alert(resp.p_result);
	                    }
            			
	                });
            		dwr.engine.setAsync(true);
            		
	                if ($.inArray(rec[i].IDEN_RICHIESTA,a_idenRichiesta) == -1)
	                {
	                    a_idenRichiesta.push(rec[i].IDEN_RICHIESTA);
	                }
	            }
            }
            
	        for (i=0; i<a_idenRichiesta.length; i++)
	        {
	            dwr.engine.setAsync(false);
	            var param = {"pIdenRichiesta": rec[i].IDEN_RICHIESTA , "pIdenPer" :home.baseUser.IDEN_PER, pData:dataOra };
	            toolKitDB.executeProcedureDatasource("ADT_MOVIMENTI_CARTELLA.setStatoRichiestaCompleta", "ADT", param, function(resp){
	
	                if(resp.p_result == 'KO'){
	                    home.NOTIFICA.error({message: "Attenzione errore nel salvataggio".errorSave, title: "Error"});
	                }else if (resp.p_result == 'OK'){
	                    home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
	                }else{
	                    alert(resp.p_result);
	                }
	            });
	            dwr.engine.setAsync(true);
	            NS_GESTIONE_CARTELLE.wkRichCartelle.refresh();
	        }
	        
	        $.dialog.hide();
    	};
    	
        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, startWithToday: true, onSelect: function(data,dataIso) {
        	$("#h-txtDataArrivoCartella").val(data);
        }});
        
        $('#txtOraArrivoCartella').live().setMask("29:59").keypress(function() {
            
        	var currentMask = $(this).data('mask').mask;
            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
            
            if (newMask != currentMask) {
                $(this).setMask(newMask);
            }
            
        }).val(moment().format('HH:mm'));

        
        $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
        $("#tdOraCartella").css({"padding-top":"5px"});
        
    },
    
    setStatoRichiestaCartella: function(rec,stato,statoDa){
    	
    	var ta = $(	"<table>" +
				"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
				"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataStatoCartella'/><input type='text' id='txtOraStatoCartella' class='tdObb' /></td></tr>" +
			"</table>");

		$.dialog(ta, {
		    buttons : 	[{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
		              	 {label : "Prosegui", action : function(){ completaStatoCartella(); }}
		    			],
		    title : "Gestione richieste cartelle",
		    height:340,
		    width:250
		});
        
		var completaStatoCartella = function(){
			
			var _ora = $('#txtOraStatoCartella').val();
        	var _data = $('#h-txtDataStatoCartella').val();
        	var dataOra = _data + ' ' + _ora;
        	
        	if (_data == "" || _data == null){
            	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
            }
            
            if (_ora.length < 5) {
            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
            }
            
            for (var i=0; i<rec.length;i++)
            {
            	if (rec[i].IDEN_RICHIESTA!=null) 
            	{
                    var param = {
                        "pIdenRichiesta": rec[i].IDEN_RICHIESTA ,
                        "pStato":stato,
                        "pIdenPer" :home.baseUser.IDEN_PER,
                        "pData":dataOra
                    };
                    
                    dwr.engine.setAsync(false);
                    
                    toolKitDB.executeProcedureDatasource("ADT_MOVIMENTI_CARTELLA.setStatoRichiesta", "ADT", param, function(resp){
                        
                    	if(resp.p_result == 'KO'){
                            home.NOTIFICA.error({message: "Attenzione errore in modifica stato".errorSave, title: "Error"});
                        }else if (resp.p_result == 'OK'){
                            home.NOTIFICA.success({message: 'Modifica stato eseguita correttamente', timeout: 2, title: 'Success'});
                        }else{
                            alert(resp.p_result);
                        }
                    });
                    
                    dwr.engine.setAsync(true);
                }
                else
                {
                    if (rec[i].IDEN_RICHIESTA==null){
                        //alert('Nessuna richiesta sulla cartella selezionata '+rec[i].CARTELLA);
                    	home.NOTIFICA.error({message:'Nessuna richiesta sulla cartella selezionata '+rec[i].CARTELLA,title:'Errore'});
                    } else {
                        //alert('La richiesta '+rec[i].IDEN_RICHIESTA+' non puo\' passare allo stato indicato!');
                    	home.NOTIFICA.error({message:'La richiesta '+rec[i].IDEN_RICHIESTA+' non puo\' passare allo stato indicato!',title:'Errore'});
                    }
                }
            }
            
            $.dialog.hide();
            NS_GESTIONE_CARTELLE.wkRichCartelle.refresh();
            
		};
		
        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
        	$("#h-txtDataStatoCartella").val(data);
        }});

        $('#txtOraStatoCartella').live().setMask("29:59").keypress(function() {
            
        	var currentMask = $(this).data('mask').mask;
            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
            
            if (newMask != currentMask) {
                $(this).setMask(newMask);
            }
            
        }).val(moment().format('HH:mm'));

        
        $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
        $("#tdOraCartella").css({"padding-top":"5px"});
    },
    
    
    
    setColorBackground: function(data,td){

        switch (data.COD_STATO_RICHIESTA){
            case COD_RICH_EFFETTUATA:
                //td.css({'background-color':'#FFFFFF'}); // white
                td.addClass('clsBckWhite');
                break;
            case COD_RICH_NON_COMPLETA:
                //td.css({'background-color':'#FFA500'}); // orange
                td.addClass('clsBckOrange');
                break;
            case  COD_RICH_COMPLETA:
                //td.css({'background-color':'#FFC0CB'}); // pink
                td.addClass('clsBckPink');
                break;
            case COD_COPIA_FATTA_FIRMATA:
                //td.css({'background-color':'#00FFFF'}); // cyan
                td.addClass('clsBckCyan');
                break;
            case COD_COPIA_CONSEGNATA:
                //td.css({'background-color':'#1E90FF'}); // dodgerblue
                td.addClass('clsBckBlue');
                break;
            case COD_COPIA_SPEDITA:
                //td.css({'background-color':'#7FFF00'}); // chartdeuse
                td.addClass('clsBckGreen');
                break;
            case COD_COPIA_SPEDITA_REPARTO:
                //td.css({'background-color':'#FFFF00'}); // yellow
                td.addClass('clsBckYellow');
                break;
            case COD_COPIA_SPEDITA_ENTE:
                //td.css({'background-color':'#FFFACD'}); // lemmonChiffon
                td.addClass('clsBckLemmon');
                break;
            case COD_RICH_SOSPESA:
                //td.css({'background-color':'#C0C0C0'}); // silver
                td.addClass('clsBckSilver');
                break;
            case COD_RICH_ANNULLATA:
                //td.css({'background-color':'#000000'}); // black
                //td.css({'color':'#FFFFFF'}); // testo white
                td.addClass('clsBckBlack');
                break;
        }
        return data.STATO_RICHIESTA;
    },
    AnnullaStatoRichiestaCartella:function(rec){
        //dwr.engine.setAsync(false);
        var param = {
            "pIdenRichiesta": rec[0].IDEN_RICHIESTA,
            "pIdenPer" :home.baseUser.IDEN_PER ,
            "pIdenStato":rec[0].IDEN_STATO
        };
        //alert(param);
        toolKitDB.executeProcedureDatasource("ADT_MOVIMENTI_CARTELLA.annulla_stato_richiesta", "ADT", param, function(resp){
            if(resp.p_result == 'KO'){
                home.NOTIFICA.error({message: "Attenzione errore in modifica stato".errorSave, title: "Error"});
            }else if (resp.p_result == 'OK'){
                home.NOTIFICA.success({message: 'Modifica stato eseguita correttamente', timeout: 2, title: 'Success'});
            }else{
                alert(resp.p_result);
            }
        });
        dwr.engine.setAsync(true);
    },
    
    sollecitaCartelle : function(rec){
    	
    	var completaSollecitoCartella = function(){
    		
    		var _ora = $('#txtOraSollecitoCartella').val();
        	var _data = $('#h-txtDataSollecitoCartella').val();
        	var dataOra = _data + ' ' + _ora;
        	
        	if (_data == "" || _data == null){
            	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
            }
            
            if (_ora.length < 5) {
            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
            }
            
    		for (var i = 0; i < rec.length; i++)
        	{
        		NS_CONTATTO_METHODS.getContattoById(rec[i].IDEN_CONTATTO, {
        				
        			cbkSuccess : function(){
        					
        					var _contatto = NS_CONTATTO_METHODS.contatto;
        					_contatto.mapMetadatiString["DATA_SOLLECITO"] =  dataOra;
        					_contatto.mapMetadatiString["UTENTE_SOLLECITO"] = home.baseUser.IDEN_PER;
        					
        					var pA08 = {"contatto" : _contatto, "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Sollecito Cartella " + rec[i].CARTELLA + " Avvenuto con Successo", "errorMessage" : "Errore Durante Sollecito Cartella " + rec[i].CARTELLA}, "cbkSuccess" : function(){}};
        					
        					// Dopo l'ultimo Update ricarico la WK
        					if (i === rec.length - 1)
        					{
        						pA08.cbkSuccess = function(){
        							$.dialog.hide();
        							NS_GESTIONE_CARTELLE.wkRichCartelle.refresh();
        						};
                    		}
        					
        					NS_CONTATTO_METHODS.updatePatientInformation(pA08);
        				}
        		});
        	}
    	};
    	
    	home.DIALOG.si_no({
           	title : "Sollecito Cartelle",
           	msg : "Si conferma l'operazione di SOLLECITO delle Cartelle selezionate?",
           	cbkNo : function(){
           		return;
           	},
           	cbkSi: function(){
           		
           		var ta = $(	"<table>" +
        				"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
        				"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataSollecitoCartella'/><input type='text' id='txtOraSollecitoCartella' class='tdObb' /></td></tr>" +
        			"</table>");
           		
                $.dialog(ta, {
                    buttons : [{ label: "Annulla", action: function (ctx){ $.dialog.hide(); }},
                               {label : "Prosegui", action : function(){ completaSollecitoCartella(); }}
                    ],
                    title : "Gestione richieste cartelle",
                    height:340,
                    width:250
                });
                
                ta.Zebra_DatePicker(
        		{
        			always_visible : $("#gestioneRichiesteCartelle"), 
        			direction : false, 
        			onSelect : function(data, dataIso) {
        				$("#h-txtDataSollecitoCartella").val(dataIso);
        			}
        		});
                
                $('#txtOraSollecitoCartella').live().setMask("29:59").keypress(function() {
                    
                	var currentMask = $(this).data('mask').mask;
                    var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
                    
                    if (newMask != currentMask) {
                        $(this).setMask(newMask);
                    }
                    
                }).val(moment().format('HH:mm'));

                
                $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
                $("#tdOraCartella").css({"padding-top":"5px"});
           	}
    	});   
    	
    },
    
    processDataSollecito : function(data, td){
    
    	if (data.DATA_SOLLECITO != null || data.DATA_SOLLECITO != "")
    	{
    		data.DATA_SOLLECITO = moment(data.DATA_SOLLECITO, "YYYYMMDDHH:mm").format("DD/MM/YYYY HH:mm");
    		td.attr("title", data.DATA_SOLLECITO);
    		td.css({"color" : "red"});
    	}
    	
    	return data.DATA_SOLLECITO;
    }

};