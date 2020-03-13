

$(document).ready(function(){});

var RICERCA_MMG = {

		init:function(){},

		setEvents:function(){}
};

var WK_RICERCA_MMG = {

		tipoCaricamento: null,

	//Filtri menu
        recSingoloSelezionato: function (rec) {
			return (LIB.isValid(rec) && rec.length);
        },
		recSelConDoc: function (rec) {
			return (WK_RICERCA_MMG.recSingoloSelezionato(rec) && rec.length===1);
        },

    /**
     * Apre dialog per salvare un documento al medico selezionato
     * @param rec - record selezionato dalla worklist dei medici MMG
     */
		aggiungiDocumento : function (rec) {
		    if ($("iframe#multipartbin").length === 0) {
                var ifr = $("<iframe>");
                ifr.attr({
                    "id": "multipartbin",
                    "name": "multipartbin",
                    "src": "blank.htm"
                });
                $("body").append(ifr);
            }
            var appName = window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/'));
            var $fr = $("<form>").attr({
                "id":"AllegaDOC",
                "action":appName+"/dispatcher/utente/documento",
                "enctype":"multipart/form-data",
                "accept-charset":"UTF-8",
                "method":"POST",
                "target": "multipartbin"
            });
            $.NS_DB.getTool({_logger: home.logger}).select({
                id: 'SDJ.Q_TIPI_PIC',
                datasource: 'PORTALE_PIC',
                parameter:
                    {
                        tipo: {v: "TIPOLOGIA_ALLEGATO", t: 'V'}
                    }
            }).done(function(resp) {
                $fr.append(
                    $(document.createElement('p')).append(
                        $(document.createElement('label')).attr({ "id": "lblMedico"}).text("Medico"),
                        $("<p>"+rec.DESCR+"</p>"),
                        $(document.createElement('input')).attr({ "id": "idMedico", "type": "hidden", value: rec.IDEN_PER, "name":"idenPer"}),
                        $(document.createElement('input')).attr({ "id": "idUteIns", "type": "hidden", value: home.baseUser.IDEN_PER, "name":"uteIns"})
                    ),
                    $(document.createElement('p')).append(
                        $("<input name='file' type='file' class='' id='AllegaFile'>")),
                    $(document.createElement('p')).append(
                        $(document.createElement('label')).attr({ "id": "lblCmbCategoria"}).text("Categoria "),
                        $("<select id='cmbCategoria' name='codCat'>")),
                    $(document.createElement('p')).append(
                        $(document.createElement('label')).attr({ "id": "lbltxtNomeAllegato"}).text("Nome allegato"),
                        $("<input name='name' type='text' class='' id='NomeAllegato' required>")
                    ),
                    $(document.createElement('p')).append(
                        $(document.createElement('label')).attr({ "id": "lbltxtNote"}).text("Note"),
                        $(document.createElement('textarea')).attr({"id": "txtNote", "name": "note", 'maxLength' : 1000}).css({ 'width' : '100%', 'height': 50 })
                    )
                );
                $.dialog($fr,{"width":"400px",
                    "title":'Allega documento al Medico',
                    "showBtnClose" : false,
                    "modal" : true,
                    "buttons": [
                        {"label": "Annulla", "action": function (){
                            $.dialog.hide();
                        }
                        },
                        {"label": "Salva", "action": function (){
                            if (($('#AllegaFile').val()!=='') && ($('#NomeAllegato').val()!=='')) {
                                $('#AllegaDOC').submit();
                                $.dialog.hide();
                            } else {
                                home.NOTIFICA.warning({
                                    'title'		: "Attenzione",
                                    'message'	: "Scegliere un file da allegare e compilare il nome allegato",
                                    'timeout'	: 10
                                });
                            }

                        }
                        }
                    ]
                });
                $.each(resp.result,function(index){
                    $("#cmbCategoria").append("<option value='"+resp.result[index].COD_DEC+"'>"+resp.result[index].DESCR+"</option>");
                });
            });
        },
    /**
     * Apre una dialog con l'elenco dei documenti allegati al medico
     * @param rec - record selezionato dalla worklist dei medici MMG
     */
    apriGestisciDocumenti : function(rec) {
        var $fr = $("<div>").attr({"id":"gestisciDocMMG"});
        $fr.append(
            $("<p><label id='lblMedico'>Medico </label>"+rec.DESCR+"</p>"),
            $(document.createElement('label')).attr({ "id": "lblDocumenti"}).text("Documenti associati"),
            $(document.createElement('div')).attr({"id":"divContainer"}));
        $.dialog($fr,{"width":"800px",
            "title":'Gestisci documenti allegati al Medico',
            "showBtnClose" : true,
            "modal": true,
            "buttons": [
                {"label":"Chiudi", "action": function (){
                    $.dialog.hide();
                }
                }]
        });

        home.$.NS_DB.getTool({_logger: home.logger}).select({
            id: 'SDJ.Q_LIST_DOC_MMG',
            datasource: 'PORTALE_PIC',
            parameter:
                {
                    medico: {v: rec.IDEN_PER, t: 'V'}
                }
        }).done(function(resp) {
            var data = resp.result;
            if (data.length>0) {
                $("#divContainer").attr({"style":"height:200px"}).append(
                    $(document.createElement('table')).attr({"id":"tblDocumentsMMG","class":"table"})
                );
                $("#tblDocumentsMMG").append(
                    $("<thead>").append(
                        $("<tr>").append(
                            $("<th id='thNome'>").text("Nome documento"),
                            $("<th id='thCategoria'>").text("Categoria"),
                            $("<th id='thDate'>").text("Data inserimento"),
                            $("<th id='thIcons'>")
                        )
                    )
                );
                $("#tblDocumentsMMG").append(
                    $("<tbody>").attr({"style":"overflow-y: auto;"}));
                $.each(data,function(index){
                    var dataReformat = (data[index].DATA_INS).substr(0,16);
                    var dataUrl = (data[index].PATH).split("/");
                    var nameFile = dataUrl[dataUrl.length-1];
                    var urlFile = dataUrl.slice(0,dataUrl.length-1).join("/");
                    $("#tblDocumentsMMG").append(
                        $("<tr>").append(
                            $("<td>").text(data[index].NOME_ALLEGATO),
                            $("<td>").text(data[index].DESCRIZIONE),
                            $("<td>").text((data[index].DATA_INS).substr(0,16)),
                            $("<td>").append(
                                $("<i title='Visualizza note' class='icon-info-circled informazioni tasto btnNoteAllegato'>").attr({"h-nota":data[index].NOTE_ALLEGATO, "h-nome":data[index].NOME_ALLEGATO}),
                                $("<i title='Visualizza documento' class='icon-search visualizza tasto btnVisualizzaDocMMG'>").attr({"h-id":data[index].ID_DOC, "h-path":data[index].PATH, "h-path-url": urlFile, "h-filename":nameFile}),
                                $("<i title='Elimina documento' class='icon-trash elimina tasto btnEliminaDocMMG'>").attr({"h-id":data[index].ID_DOC, "h-path":data[index].PATH, "h-path-url": urlFile, "h-filename":nameFile})
                            )
                        )
                    )
                });

                $('.btnNoteAllegato').on('click',function () {
                    home.NOTIFICA.info(
                        {
                            "title": "NOTA di "+$(this).attr('h-nome'),
                            "message": $(this).attr('h-nota'),
                            "timeout": 0
                        }
                    );
                });

                $('.btnVisualizzaDocMMG').on('click',function () {
                    var id = $(this).attr('h-id');
                    var remotePath = $(this).attr('h-path-url');
                    var filename=$(this).attr('h-filename');
                    var localPath=window.location.protocol+'//'+window.location.host+'/'+window.location.pathname.split('/')[1]+'/';
                    var urlGet = "dispatcher/utente/documento/"+ id +"?url="+remotePath+'&filename='+filename;

                    urlGet=localPath+urlGet;
                    home.NS_FENIX_PRINT.caricaDocumento({
                        "URL":urlGet,
                        "okCaricaDocumento":function(){
                            home.NS_FENIX_PRINT.apri({"beforeApri": home.NS_FENIX_PRINT.initStampa});
                        }
                    });
                });

                $('.btnEliminaDocMMG').on('click',function () {
                    var url="dispatcher/utente/documento/"+$(this).attr('h-id')+"?url="+$(this).attr('h-path-url')+'&filename='+$(this).attr('h-filename');
                    var param = {
                        "title":"Attenzione",
                        "msg":"Procedere con l'eliminazione del documento?",
                        "cbkSi": function(){WK_RICERCA_MMG.eliminaDocMMG(url);}
                    };

                    home.DIALOG.si_no(param);
                });
            } else {
                $('#divContainer').append(
                    $('p').text('Non sono presenti documenti associati al medico')
                );
            }

        });

    },

    eliminaDocMMG: function (url) {
        $.ajax({
            url:url,
            method:'DELETE',
            success: function () {
                $.dialog.hide();
            }
        }).fail( function (jqXHR, textStatus) {
            // alert( "Request failed: " + textStatus );
            $.dialog.hide();
        });
    },

    salvaDocumento : function (rec) {
        if($('#AllegaFile').val()!=='') {
            var data = {
                file : $('#AllegaFile').get(0).files[0],
                name : ($('#NomeAllegato').val()!=='') ? $('#NomeAllegato').val() : 'nome_predefinito',
                codCat : $('#cmbCategoria').find('option:selected').val(),
                note : $('#txtNote').val(),
                idenPer : rec.IDEN_PER
            };
            WK_RICERCA_MMG.allegaDocumento(data);
        } else {
            home.NOTIFICA.warning({
                'title'		: "Attenzione",
                'message'	: "Scegliere un file da allegare",
                'timeout'	: 10
            });
        }

    },

    allegaDocumento : function (data) {
        $('#AllegaDOC').submit();

    },


    processClassAllega: function(data,wk) {
        var div=$('<div>').append('<i class="icon-attach">');
        div.on("click",function () {
            WK_RICERCA_MMG.aggiungiDocumento(data);
        });
        return div;
    },

    processClassGestisci: function(data,wk) {
        var div=$('<div>').append('<i class="icon-docs">');
        div.on("click",function () {
            WK_RICERCA_MMG.apriGestisciDocumenti(data);
        });
        return div;
    }

};

