var WindowCartella = null;

$(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    NS_VISUALIZZA_TERAPIE.init();
});

var NS_VISUALIZZA_TERAPIE = {
    
	pStatementFile: 'visualizzaTerapie.xml',
	
	init: function() {

		$("#aData,#daData").val(WindowCartella.clsDate.getData(new Date(),'DD/MM/YYYY'));

		NS_VISUALIZZA_TERAPIE.creaStrutturaFieldset();
        NS_VISUALIZZA_TERAPIE.setEvents();
	},

	setEvents: function() {
		try {
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.dati.daData);
			oDateMask.attach(document.dati.aData);
		}catch(e){alert(e.message);}
		
        $("#butAggiorna").on("click", NS_VISUALIZZA_TERAPIE.creaStrutturaFieldset);
        
        $("#aData,#daData").datepick({
			showOnFocus: false,
            minDate : function() {
                switch (WindowCartella.FiltroCartella.getLivelloValue()) {
                    case "IDEN_ANAG":
                    case "ANAG_REPARTO":
                        return WindowCartella.clsDate.setData(WindowCartella.getPaziente("DATA"),"00:00");
                    case "NUM_NOSOLOGICO":
                        return WindowCartella.clsDate.setData(WindowCartella.getRicovero("DATA_INIZIO"),"00:00");
                    case "IDEN_VISITA":
                        return WindowCartella.clsDate.setData(WindowCartella.getAccesso("DATA_INIZIO"),"00:00");
                }
            },
        	maxDate: function(){					
        			var d = new Date();
        			if(WindowCartella.getRicovero("DATA_FINE")!=""){
        				return	WindowCartella.clsDate.setData(WindowCartella.getRicovero("DATA_FINE").substring(0,8),"00:00");
        			}
        			return d;
        	},
			showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
		});
        
        $("#chkEpisodio").on("click", function() {
        	if($(this).is(":checked"))
        		$("#aData,#daData").attr('disabled',true);
        	else
        		$("#aData,#daData").attr('disabled',false);
        });
    },
    
/*
 *Creo n° fieldset = n° numero di tipologie di terapie configurate per il reparto
 */    
    creaStrutturaFieldset:function(){    	
        WindowCartella.utilMostraBoxAttesa(true);
        $('#container table').remove();
        
   	 	var dataDa,dataA,chkEpisodio,chkNotChiuse;
    	if($("#chkEpisodio").is(":checked")) {
    		dataDa = '19700101';
    		dataA = '29991231';
    		chkEpisodio=1;
    	} else {
    		dataDa = WindowCartella.clsDate.str2str($("#daData").val(), 'DD/MM/YYYY','YYYYMMDD');
    		dataA = WindowCartella.clsDate.str2str($("#aData").val(), 'DD/MM/YYYY','YYYYMMDD');
    		chkEpisodio=0;
    	}
    	chkNotChiuse = $("#chkChiuse").is(":checked") ? 1 : 0;
    	
    	var vDati = top.getForm(document);
        var rs = WindowCartella.executeQuery(
        		NS_VISUALIZZA_TERAPIE.pStatementFile, 
        		"getTerapieReparto", 
        		[vDati.iden_ricovero, vDati.iden_ricovero, dataA, dataDa, chkEpisodio, chkNotChiuse, vDati.reparto]);
        
        while (rs.next()) {
            // Se non l'ho già fatto, creo n° fieldset = n° numero di tipologie di terapie configurate per il reparto
            if (typeof $('#container').find('ul').find('#' + rs.getString("cod_terapia")).attr('id') === 'undefined') {
        		var div = $('<fieldset/>', { 'id' : rs.getString("cod_terapia") });
            	$('#container ul').append($('<li></li>').append(div));
            }
        	
            var vDatiTerapie = {
                iden_terapia: rs.getString("iden_terapia"),
                iden_scheda: rs.getString("iden_scheda"),
                stato_terapia: rs.getString("stato_terapia"),
                tipo_terapia: rs.getString("tipo_terapia"),
                cod_terapia: rs.getString("cod_terapia"),
                descr_terapia: rs.getString("descr_terapia"),
                farmaci: rs.getString("farmaci"),
                dosaggio: rs.getString("dosaggio"),
                durata: rs.getString("durata"),                
                tipologia: rs.getString("tipologia"),
                velocita:rs.getString("velocita"),
    			impostazioni:rs.getString("impostazioni"),
    			posologia:rs.getString("posologia")
            };
            
        	NS_VISUALIZZA_TERAPIE.creaTableFieldset(vDatiTerapie);
        }

        $('#container table tr:odd').addClass('odd');
        $('#container table tr:even').addClass('even');
        $('#container table tr[stato="C"]').attr('Title', 'Terapia chiusa');
        setTimeout(function(){WindowCartella.utilMostraBoxAttesa(false);},200);
    },

/*
 * Funzione per il recupero dei dati e la creazione delle tabelle con cui popolare i fieldset
 */
    creaTableFieldset:function(vDatiTerapie){
        var table = null;
    	
        // Per ogni fieldset che non contiene ancora la propria tabella, la creo...
        if (typeof $('#container').find('ul').find('#' + vDatiTerapie.cod_terapia).find('table tr').attr('id') === 'undefined') {
        	table = $('<table></table>')
			.append(
				$("<caption/>")
				.append(
					$("<p/>", {'class' : 'legendTesto'}).html(vDatiTerapie.descr_terapia)
				).append(
					$("<div/>", {
						'class' : 'legendImage',
						'title' : "Inserisci Terapia '"+$("<div/>").html(vDatiTerapie.descr_terapia).text()+"'",
						'tipo_terapia' : vDatiTerapie.tipo_terapia,
						'click': function(){
							var terapia = $(this).attr('tipo_terapia');
					        NS_VISUALIZZA_TERAPIE.loadPlgTerapia(terapia);
					    }
					})
				)
			);

    		table.append(NS_VISUALIZZA_TERAPIE.creaTableIntestazione(vDatiTerapie));
            $('#container').find('#' + vDatiTerapie.cod_terapia).append(table);
        } else {
        	//... altrimenti la seleziono
    		table = $('#container').find('#' + vDatiTerapie.cod_terapia).find('table');
        }
        
        if(!$("#chkChiuse").is(":checked") && vDatiTerapie.stato_terapia=='C')
        	return;
        
		//... e poi inserisco la terapia nella tabella
        table.append(NS_VISUALIZZA_TERAPIE.createTableRiga(vDatiTerapie));
    },            

    /*
     * @param {type} cod_terapia: a seconda del tipo ti terapia, ritorna l'intestazione adeguata
     * @returns {html tr} : ritorna dei tag tr
     * TERORA = terapie orali
     * TERSOT = terapie sottocutanee
     * TEREND = terapie endovenose
     * TERINT = terapie intramuscolari
     * TERINF = terapie infusionali
     * TERALT = terapie altro(cerotti,ossigenoterapie)
     * TERCHE = terapie chemioterpiche
     * TERRET = terapie rettali
     * TERNUTRI = terapie nutrizionali
     */             
    creaTableIntestazione: function(vDatiTer) {
    	if (vDatiTer.iden_terapia == '') return;
    	
        var tr = $('<tr id="intestazione"></tr>');
        switch (vDatiTer.cod_terapia) {
            case 'TERORA':
                var thIntestazione = $('<th>Farmaco</th><th>Dose</th><th>Durata</th><th>Posologia</th>');
                return tr.append(thIntestazione);
                break;
            
			case 'TERNUTRI':
                var thIntestazione = $('<th>Farmaco</th><th>Dose</th><th>Durata</th><th>Tipologia</th>');
                return tr.append(thIntestazione);
                break;
				
            case 'TERINF':
                var thIntestazione = $('<th>Farmaco</th><th>Dose</th><th>Durata</th><th>Velocit&agrave;</th><th>Tipologia</th>');
                return tr.append(thIntestazione);
                break;
            
			case 'TERSOT':
          
            case 'TEREND':
            
            case 'TERINT': 
                var thIntestazione = $('<th>Farmaco</th><th>Dose</th><th>Durata</th><th>Tipologia</th><th>Posologia</th>');
                return tr.append(thIntestazione);
                break;

            case 'TERALT':
                var thIntestazione = $('<th>Farmaco</th><th>Dose</th><th>Durata</th><th>Tipologia</th><th>Impostazioni</th>');
                return tr.append(thIntestazione);
                break;
                break;

            case 'TERCHE':
                null;

                break;

            case 'TERRET':

                break;
                       
            default:
        }
    },
            
    /*
     * @param {type} vDatiTer: namespace con tutti 
     * @returns {html: tr + td, ritorno dei dati} 
     */             
    createTableRiga: function(vDatiTer) {
    	if (vDatiTer.iden_terapia == '') return;
    	
        var tr = $('<tr/>', { 'id':'tr_' + vDatiTer.iden_scheda, 'iden_terapia':'tr_' + vDatiTer.iden_terapia, 'iden_scheda':'tr_' + vDatiTer.iden_scheda, 'stato': vDatiTer.stato_terapia});

        switch (vDatiTer.cod_terapia) {
            case 'TERORA':
                var td = $('<td>' + vDatiTer.farmaci + '</td><td>' + vDatiTer.dosaggio + '</td><td>' + vDatiTer.durata + '</td><td>' + vDatiTer.posologia + '</td>');
                return tr.append(td);

                break;
			
			case 'TERNUTRI':
                var td = $('<td>' + vDatiTer.farmaci + '</td><td>' + vDatiTer.dosaggio + '</td><td>' + vDatiTer.durata + '</td><td>' + vDatiTer.tipologia + '</td>');
                return tr.append(td);

                break;
				
            case 'TERINF':
                var td = $('<td>' + vDatiTer.farmaci + '</td><td>' + vDatiTer.dosaggio + '</td><td>' + vDatiTer.durata + '</td><td>' + vDatiTer.velocita + '</td><td>' + vDatiTer.tipologia + '</td>');
                return tr.append(td);

                break;

            case 'TERSOT':
            
            case 'TEREND':
            
            case 'TERINT': 
                var td = $('<td>' + vDatiTer.farmaci + '</td><td>' + vDatiTer.dosaggio + '</td><td>' + vDatiTer.durata + '</td><td>' + vDatiTer.tipologia + '</td><td>' + vDatiTer.posologia + '</td>');
                return tr.append(td);

                break;

            case 'TERALT':
            	var td;
				if (vDatiTer.tipologia == 'Ossigenoterapia')
				{
					td = $('<td> --- </td><td> --- </td><td>' + vDatiTer.durata + '</td><td>' + vDatiTer.tipologia + '</td><td>' + vDatiTer.impostazioni + '</td>');					
				}
				else
				{
					td = $('<td>' + vDatiTer.farmaci + '</td><td>' + vDatiTer.dosaggio + '</td><td>' + vDatiTer.durata + '</td><td>' + vDatiTer.tipologia + '</td><td> --- </td>');
				}
                
				return tr.append(td);
                break;

            case 'TERCHE':

                break;

            case 'TERRET':

                break;

            default:
        }

    },

/*
 * Funzione che richiama il fancybox per il caricamento delle terapie
 */            
    loadPlgTerapia: function (terapia){
    	if(WindowCartella.ModalitaCartella.isReadonly()) 
    		return alert("Impossibile procedere, cartella in sola lettura");
    	
        var vDati = top.getForm(document);
		var url	= "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
		url		+= "&modality=I&layout=O&reparto=" + vDati.reparto;
		url		+= "&idenAnag=" + vDati.iden_anag;
		url		+= "&idenVisita=" + vDati.iden_visita;
		url		+= "&statoTerapia=I";
		url		+= "&btnGenerali=";	
		url		+= "Conferma::registra('conferma');";
        url		+= "&PROCEDURA=INSERIMENTO";
		url		+= "&TIPO_TERAPIA="+terapia;
		
		$.fancybox({
			'padding'	: 3,
			'width'		: screen.availWidth,
			'height'	: 800,
			'href'		: url,
			'type'		: 'iframe',
            'onClosed'	: function() {  WindowCartella.apriVisualizzaTerapie();}
        });
    }
};


