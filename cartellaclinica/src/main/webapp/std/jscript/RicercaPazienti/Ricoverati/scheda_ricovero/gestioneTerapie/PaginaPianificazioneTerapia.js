/**
 * User: matteopi
 * Date: 28/03/13
 * Time: 11.13
 */
var WindowCartella = null;

jQuery(document).ready(function () {

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

	window.clsDate = WindowCartella.clsDate;

    NS_SOMM_FERRO.init();
    NS_SOMM_FERRO.event();

});

var NS_SOMM_FERRO = {

	validita_inizio:null,
	validita_fine:null,	

    init : function () {
        // creazione della pagina html
        var vIdenScheda = parent.classMenu.idenScheda;
        var schema_creato = false;

        //query per il controllo del numero di somministrazioni per valorizzare il body della pagina
        var rs = WindowCartella.executeQuery('terapie.xml','dettagliSommTerapia',vIdenScheda);
        var i=1;
        var _table = $('#TableBody');

        _table.append(
            $('<TR>' +
                '<th label >Stato  </th>' +
                '<th label >Data  </th>' +
                '<th label >Ora  </th>' +
                '<th label >Note  </th>' +
                '</TR>')
        );
        while(rs.next()){

            var vNumeroSomministrazioni = rs.getInt('NUMEROSOMMINISTRAZIONI');
            //gestione creazione html

            if (!(schema_creato)){
                for (var s = 0; s<vNumeroSomministrazioni ; s++ ) {
                    _table.append(
                        $('<TR sizset="8" sizcache="5"tipo="text" name="Data" class = "New">' +
                            '<td name="stato">' +
                            '</td>' +
                            '<td sizset="8" >' +
                            '<INPUT class="Calendario" name="DataI"  value="" >' +
                            '</td>' +
                            '<td sizset="8" >' +
                            '<INPUT class="orario" name="OraI"  value="" >' +
                            '</td>' +
                            '<td sizset="8" >' +
                            '<INPUT class="hasDatepick" name="NoteI"  value="" >' +
                            '</td>' +
                            '</TR>'  )
                    );
                }
            }

            schema_creato = true;

            //vengono valorizzati tutti gli input
            var _tr = $('#TableBody tr:eq(' + i + ')');
            _tr.attr("data-iden", rs.getString('IDEN'));
            _tr.find('input[name="DataI"]').val(rs.getString("DATA"));
            _tr.find('input[name="OraI"]').val(rs.getString("ORA"));
            _tr.find('input[name="NoteI"]').val(rs.getString("NOTE"));


            //controllo se la riga è valorizzata o no.
            if(rs.getString("ORA")!= '' && rs.getString("DATA")!=''){
                _tr.removeClass("New");
            }
            //se esito è diverso da null la data dell'appuntamento non è + modificabile
            var esito =  rs.getString("ESITO");

            if(esito != null && esito != ""){
                _tr.find('input[name="DataI"]').attr("disabled","disable");
                _tr.find('input[name="OraI"]').attr("disabled","disable");
                _tr.find('input[name="NoteI"]').attr("disabled","disable");
            }
            var spanDaColorare = _tr.find('td[name="stato"]');
            if(rs.getString('IDEN')!=null && rs.getString('IDEN') != ''){
                switch (esito){
                    case 'I':
                        spanDaColorare.addClass('orange');
                        break;
                    case 'S':
                        spanDaColorare.addClass('green');
                        break;
                    case 'N':
                        spanDaColorare.addClass('red');
                        break;
                    default :
                        spanDaColorare.addClass('white');
                }
            };

           var datamini =  rs.getString('DATA_INI').substring(0,10);
           var datamax =  rs.getString('DATA_FINE').substring(0,10);
		   
		   NS_SOMM_FERRO.validita_inizio = clsDate.str2date(datamini,'DD/MM/YYYY',rs.getString('DATA_INI').substring(11,16))
		   NS_SOMM_FERRO.validita_fine = clsDate.str2date(datamax,'DD/MM/YYYY',rs.getString('DATA_FINE').substring(11,16))		   
		   
            ///////////// gestione calendario ///////////////////
           $('input.Calendario').focus(function(){$(this).blur()}).datepick({
                showOnFocus: false,
                showTrigger: '<img class=\"trigger\" src=\"../imagexPix/calendario/cal20x20.gif" class=\"trigger\"></img>',
                minDate:datamini,
                maxDate:datamax
           });
            /////////////////////////////////////////////////////

            i++;
        }

    },
    event: function () {
        //gestione registrazione
        $('#lblRegistra').click(NS_SOMM_FERRO.registra);

        //gestione della data
        $('.orario').live("keyup",function(){oraControl_onkeyup(this);});


        //gestione modifica dati
        $("input[type='text']").bind("propertychange input paste",function(){

            var name = $(this).attr("name");
            if (name != 'NoteI' && $(this).val() == ''){
                alert('Attenzione si prega di\nvalorizzare campo obligatorio');
            }
            if(!($(this).closest("tr").hasClass('New'))){
                $(this).closest("tr").addClass('Changed');
            }
        });

    },

    registra:function(){

        var vRespClean = WindowCartella.executeStatement("AccessiAppuntamenti.xml","Servizi.clean",[baseUser.LOGIN]);
        if(vRespClean == 'KO'){
            return alert(vRespClean[0] + vRespClean [1]);
        }
        var data;
        var ora;
        var note;
        var iden_per = baseUser.IDEN_PER;
        var vIdenScheda = parent.classMenu.idenScheda;

		//validazione
		var status = {
			success:true,
			message:null,
			invalidi:[],
			somministrazioni:[]
		}
		
        $.each($('tr.New'), function(){

            data = $(this).find('input[name="DataI"]').val();
            ora = $(this).find('input[name="OraI"]').val();


            if(data!='' && ora!=''){
				
				var new_date = clsDate.str2date(data,'DD/MM/YYYY',ora);

				var object = {
						data:data, 
						ora:ora, 
						note:$(this).find('input[name="NoteI"]').val()
					};

				if(new_date < NS_SOMM_FERRO.validita_inizio || new_date > NS_SOMM_FERRO.validita_fine){
					
					status.invalidi.push(object);					
					status.success = false;					
					
				}else{
					status.somministrazioni.push(object);					
				}
			}
			
		});
		
        $.each($('tr.Changed'), function(){

            /*var dataToConvert = $(this).find('input[name="DataI"]').val();
            var data = clsDate.str2str(dataToConvert,'DD/MM/YYYY','YYYYMMDD');*/
			var data = $(this).find('input[name="DataI"]').val();
            var ora = $(this).find('input[name="OraI"]').val();
			
            if (data!='' && ora!=''){
				
				var new_date = clsDate.str2date(data,'DD/MM/YYYY',ora);
				
				var object = {
						data:data, 
						ora:ora, 
						note:$(this).find('input[name="NoteI"]').val(), 
						iden:$(this).attr('data-iden') 
					};
				
				if(new_date < NS_SOMM_FERRO.validita_inizio || new_date > NS_SOMM_FERRO.validita_fine){

					status.invalidi.push(object);					
					status.success = false;					

				}else{
					status.somministrazioni.push(object);
				}
				
            }

        });		
		
		if(status.success == false){
			
			status.message = "I seguenti orari non rientrano nel range previsto per la terapia "
			+ clsDate.getData(NS_SOMM_FERRO.validita_inizio, 'DD/MM/YYYY') + ' ' + clsDate.getOra(NS_SOMM_FERRO.validita_inizio)
			+ ' --> '
			+ clsDate.getData(NS_SOMM_FERRO.validita_fine, 'DD/MM/YYYY') + ' ' + clsDate.getOra(NS_SOMM_FERRO.validita_fine)
			+ ':'
			
			for(var i=0; i< status.invalidi.length; i++){
				status.message += '\n' + status.invalidi[i].data + ' ' + status.invalidi[i].ora;
			}
			
			return alert(status.message);
		}
		

		for(var i =0; i< status.somministrazioni.length; i++){
			
			if(typeof status.somministrazioni[i].iden == 'undefined'){
			
				var vResp = WindowCartella.executeStatement("terapie.xml","somministraTerapia",[
					vIdenScheda,
					status.somministrazioni[i].data + status.somministrazioni[i].ora,
					iden_per,
					status.somministrazioni[i].note
				]);
				
                if(vResp[0]=='KO'){
                    return alert(vResp[0] +'\n'+ vResp[1]);
                }			
			
			}else{
			
				var vResp = WindowCartella.executeStatement("terapie.xml","Somministrazione.modifica",[
					status.somministrazioni[i].iden,
					clsDate.str2str(status.somministrazioni[i].data,'DD/MM/YYYY','YYYYMMDD'),
					status.somministrazioni[i].ora,
					status.somministrazioni[i].note
				]);

                if(vResp[0]=='KO'){
                    return alert(vResp[0] +'\n'+ vResp[1]);
                }			
			
			}
		}

        //inserimento sul db di nuovi dettagli
        /*$.each($('tr.New'), function(){

            data = $(this).find('input[name="DataI"]').val();
            ora = $(this).find('input[name="OraI"]').val();

            //controllo se tutti i parametri sono valorizzati
            if(data!='' && ora!=''){
				
				var data_ora = data+ora;
				var new_date = clsDate.str2date(data,'DD/MM/YYYY',ora)
				
				if(new_date < NS_SOMM_FERRO.validita_inizio || new_date > NS_SOMM_FERRO.validita_fine){
					alert('Somministrazione non inseribile!\n L\'orario ' + data + ' ' + ora + '  non è compreso tra ' + clsDate.getData(NS_SOMM_FERRO.validita_inizio, 'DD/MM/YYYY') + ' ' + clsDate.getOra(NS_SOMM_FERRO.validita_inizio))
				}
				
                note = $(this).find('input[name="NoteI"]').val();
                

                /////alert solo per matteopi per i dati
                if (baseUser.LOGIN=='matteopi'){
                    alert('alert solo per matteopi\n iden scheda ' + vIdenScheda +'\n'+ 'data ' + data_ora +'\n'+ 'iden_per ' + iden_per+'\n'+ 'note' + note);
                }
                /////

                var vResp = WindowCartella.executeStatement("terapie.xml","somministraTerapia",[vIdenScheda,data_ora,iden_per,note]);
                if(vResp[0]=='KO'){
                    return alert(vResp[0] +'\n'+ vResp[1]);
                }
            }
        });

        //modifica sul db dei dettagli
        $.each($('tr.Changed'), function(){
            //controllo che i dati obbligatori siano valorizzati
            var dataToConvert = $(this).find('input[name="DataI"]').val();
            var data = WindowCartella.clsDate.str2str(dataToConvert,'DD/MM/YYYY','YYYYMMDD');
            var ora = $(this).find('input[name="OraI"]').val();
            if (data!='' && ora!=''){
                var note = $(this).find('input[name="NoteI"]').val();
                var iden = $(this).attr('data-iden');

                var vResp = WindowCartella.executeStatement("terapie.xml","Somministrazione.modifica",[iden,data,ora,note]);

                if(vResp[0]=='KO'){
                    return alert(vResp[0] +'\n'+ vResp[1]);
                }
            }

        });*/

		//return;

        switch(WindowCartella.ModalitaCartella.getAfterSave(document)){

            case 'checkAppuntamentiReloadPiano'	:
                var resp = WindowCartella.executeStatement('AccessiAppuntamenti.xml','Servizi.set', [baseUser.LOGIN,'CC_TERAPIE_RICOVERO',parent.classMenu.idenTestata,'TERAPIA_INSERITA',null,null] );

                if(resp[0]=='KO'){
                    return alert(resp[0]+ resp[1]);
                }
                WindowCartella.PostInserimento.CheckAppuntamento();
            default:
                //parent.aggiornaPianoGiornaliero();
				parent.$.fancybox.close();

        }

    }

}


