jQuery.fn.extend(
{
    menu_richieste:
    {
        finestra:null,
        
        apri_finestra:function(url_send, size_w, size_h)
        {
            size_w = $().checkParam(size_w, "1000");
            size_h = $().checkParam(size_h, "1000");
            
            $().menu_richieste.finestra = window.open(url_send, 'winAccettazioneRichiesta', 'width=' + size_w + ', height=' + size_h + ', status=yes, top=0, left=0, scrollbars=yes')
            if($().menu_richieste.finestra)
                    $().menu_richieste.finestra.focus();
            else
                    $().menu_richieste.finestra = window.open(url_send, 'winAccettazioneRichiesta', 'width=1000, height=1000, status=yes, top=0, left=0, scrollbars=yes')
        },
        
        accetta: function()
        {
            var id = stringa_codici(a_iden);
            
            if(id != '')
            {
                var id_esa   = stringa_codici(a_iden_esa).replace(/\,/g, '*');
                var url_send = 'sceltaEsami?';
                
                url_send += "Hiden_infoweb_richiesta=" + id + "&";
                url_send += "Hiden_esa=" + id_esa + "&";
                url_send += "Ha_sel_iden=" + id_esa + "&";
                url_send += "tipo_registrazione=IR";
                
                $().menu_richieste.apri_finestra(url_send);
            }
            else
                alert('Selezionare almeno una richiesta!');
        },
        
        prenota: function()
        {
            var id = stringa_codici(a_iden);
            
            if(id != '')
            {
                var id_esa   = stringa_codici(a_iden_esa).replace(/\,/g, '*');
                var url_send = "prenotazioneFrame?servlet=sceltaEsami%3Ftipo_registrazione%3DP%26Hiden_infoweb_richiesta%3D" + id + "%26Ha_sel_iden%3D" + id_esa + "%26cmd_extra%3Dparent.parametri%253Dnew+Array('CHIUDI')%3B%26next_servlet%3Djavascript%3Acheck_richiesta_prenota()%3B%26Hclose_js%3Dchiudi_prenotazione()%3B&events=onunload&actions=libera('" + baseUser.IDEN_PER + "', '"+basePC.IP+"');&";
                
                $().menu_richieste.apri_finestra(url_send);
            }
            else
                alert('Selezionare almeno una richiesta!');
        },
        
        annulla: function()
        {
            var id = stringa_codici(a_iden);
            
            if(id != '')
            {
                if(stringa_codici(a_stato) == 'I')
                {
                    var url_send = "SL_MotivoAnnullamentoRichiesta?iden_richiesta=" + id;
                    
                    $().menu_richieste.apri_finestra(url_send, "700", "250");
                }
                else
                    alert('Attenzione: impossibile annullare, richiesta già evasa!');
            }
            else
                alert('Selezionare almeno una richiesta!');
        }
    },
    
    menu_consulenza:
    {
        finestra:null,
        
        apri_finestra:function(url_send, size_w, size_h, pos_top, pos_left)
        {
            size_w = $().checkParam(size_w, "1000");
            size_h = $().checkParam(size_h, "1000");
            pos_top = $().checkParam(pos_top, "0");
            pos_left = $().checkParam(pos_left, "0");
            
            $().menu_richieste.finestra = window.open(url_send, 'winAccettazioneRichiesta', 'width=' + size_w + ', height=' + size_h + ', status=yes, top=' + pos_top + ', left=' + pos_left + ', scrollbars=yes')
            if($().menu_richieste.finestra)
                    $().menu_richieste.finestra.focus();
            else
                    $().menu_richieste.finestra = window.open(url_send, 'winAccettazioneRichiesta', 'width=1000, height=1000, status=yes, top=0, left=0, scrollbars=yes')
        },
        
        accetta: function()
        {
            var id = stringa_codici(a_iden_esame);
            
            if(id != '')
            {
                var stato    = stringa_codici(a_iden_stato);
                if(stato.indexOf('A') < 0)
                {
                    $().menu_consulenza.apri_finestra('accettazioneEsame?Hiden_esame=' + id, '600', '150');
                }
                else
                    alert('Attenzione: esame già accettato!');
            }
            else
                alert('Selezionare almeno un esame!');
        },
        
        esegui: function()
        {
            alert('Da implementare, per il momento non si usa!');
        },
        
        annulla_esecuzione: function()
        {
            alert('Da implementare, per il momento non si usa!');
        },
        
        cancella_esame: function()
        {
            alert('Da implementare, per il momento non si usa!');
        },
        
        referta: function()
        {
            var id = stringa_codici(a_iden_esame);
            
            if(id != '')
            {
                var stato = stringa_codici(a_iden_stato);
                
                if((stato.indexOf('E') < 0 && baseUser.OB_ESECUZIONE != "S") || stato.indexOf('E') > 0)
                {
                    var url_send = 'srvRefConsulenze?';
                    url_send += 'paziente=' + $('TR.sel').find('.classNominativo').html();
                    url_send += '&reparto=' + stringa_codici(a_reparto_prov);
                    url_send += '&repartoDest=' + stringa_codici(a_reparto);
                    url_send += '&idenVisita=' + stringa_codici(a_iden_visita);
                    url_send += '&idenAnag=' + stringa_codici(a_iden_anag);
                    url_send += '&ricovero=' + stringa_codici(a_nosologico);
                    url_send += '&funzione=CONSULENZE_REFERTAZIONE';
                    url_send += '&idenEsame=' + id;
                    url_send += '&idenReferto=' + stringa_codici(a_iden_referto);
                    url_send += '&idenTes=' + stringa_codici(a_iden_richiesta);
                    
                    $().menu_consulenza.apri_finestra(url_send, '0', '0,fullscreen=yes');
                }
                else
                    alert('Attenzione: esame ancora da eseguire!');
            }
            else
                alert('Selezionare almeno un esame!');
        }
    },
    
    checkParam: function(value, def_value)
    {
        return typeof value != 'undefined' ? value:def_value;
    },
    
    filtri_save:
    {
        valore: "",

        get_object_save: function(tipo, valore)
        {
            var obj = new Object();

            obj.FILTRO_CAMPO_SAVE = tipo;
            obj.FILTRO_CAMPO_VALORE = valore;

            return obj;
        },

        attach_filtro: function(tipo, valore)
        {
            $().filtri_save.valore += generate_save_filtro($().filtri_save.get_object_save(tipo, valore));
        },

        save: function()
        {
            if(!_PRIMA_VOLTA)
                save_filtro($().filtri_save.valore);
            else
                _PRIMA_VOLTA = false;
        }
    },
    
    formattaData: function(data)
    {
        var ret = data;
        
        if(data.indexOf("/") > 0)
        {
            var a = data.split("/");
            ret = a[2] + a[1] + a[0];
        }
        
        return ret;
    },
    
    getHeightWindow: function()
    {
        var retHeight = 0;

        if(typeof(window.innerWidth) == 'number' )
            retHeight = window.innerHeight;
        else
            if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
                retHeight = document.documentElement.clientHeight;
            else
                if(document.body && (document.body.clientWidth || document.body.clientHeight))
                    retHeight = document.body.clientHeight;

        return retHeight;
    },
    
    resize_wk_in:function(idx)
    {
        var h_tot = $().getHeightWindow() - $('.classTabHeader:eq(1)').offset().top - 25;
        
        if(idx == 0)
        {
            h_tot -= 100;
            var h_1 = Math.round((100 / 60) * h_tot) - h_tot;
            var h_2 = h_tot - h_1;

            $('#groupWK0').show().height(h_1 + 'px');
            $('#groupWK1').show().height(h_2 + 'px');
            $('#divWK1').show();
            
            $('#oIFWK0').height((h_1 - 4) + 'px');
            $('#oIFWK1').show().height((h_2 - 4) + 'px');
        }
        else
        {
            h_tot -= 50;
            $('#groupWK0').show().height(h_tot + 'px');
            $('#oIFWK0').height((h_tot - 4) + 'px');
            $('#divWK1').hide();
        }
    },
    
    show_hide_filter: function()
    {
        $("#oTableFiltri").css("display") == "none" ? $("#oTableFiltri").show():$("#oTableFiltri").hide();
        $().resize_wk_in($('#oTableSwitch td.classTdSwitchSel').index());
    },
    
    genera_condizione_anag: function(nome_cogn, nome_nome, nome_data)
    {
        var where = ""
        
        nome_cogn = $().checkParam(nome_cogn, "COGNOME");
        nome_nome = $().checkParam(nome_nome, "NOME");
        nome_data = $().checkParam(nome_data, "DATA_NASC");
        
        if($("#txtCogn").val() != "")
            where = nome_cogn + " like '" + $("#txtCogn").val().replace(/\'/, "''").toUpperCase() + "%'";
        
        if($("#txtNome").val() != "")
            where += (where != "" ? " and ":"") + nome_nome + " like '" + $("#txtNome").val().replace(/\'/, "''").toUpperCase() + "%'";
        
        if($("#txtDataNasc").val() != "")
            where += (where != "" ? " and ":"") + nome_data + " = '" + $().formattaData($("#txtDataNasc").val()) + "'";
        
        return where == "" ? "":" and " + where;
    },
    
    genera_condizione_date: function(nome_data)
    {
        var where = "";
        
        nome_data = $().checkParam(nome_data, "DAT_ESA");
        
        $().filtri_save.attach_filtro('602', 'txtDaData');
        $().filtri_save.attach_filtro('603', 'txtAData');
        
        if($("#txtDaData").val() != "")
            where = nome_data + " >= '" + $().formattaData($("#txtDaData").val()) + "'";
        
        if($("#txtAData").val() != "")
            where += (where != "" ? " and ":"") + nome_data + " <= '" + $().formattaData($("#txtAData").val()) + "'";
        
        return where == "" ? "":" and " + where;
    },
    
    genera_condizione_cdc: function(nome_cdc)
    {
        nome_cdc = $().checkParam(nome_cdc, "CDC");
        
        $().filtri_save.attach_filtro('601', 'hRepartoDestinazione');
        
        return nome_cdc + " in (" + ($("#hRepartoDestinazione").val() == "" ? "' '":$("#hRepartoDestinazione").val()) + ")";
    },
    
    genera_condizione_provenienza: function(nome_prov)
    {
        nome_prov = $().checkParam(nome_prov, "TIPOLOGIA_PROVENIENZA");
        
        $().filtri_save.attach_filtro('604', 'cmbProvenienza');
        
        return " and " + nome_prov + " in ('" + ($("select[name=cmbProvenienza]").val() == "" ? " ":$("select[name=cmbProvenienza]").val()) + "')";
    },
    
    genera_where_esami_in: function()
    {
        var ret = 'WHERE ';
        
        $().filtri_save.valore = '';
        
        ret += $().genera_condizione_cdc("REPARTO");
        ret += $().genera_condizione_anag();
        ret += $().genera_condizione_date("DAT_ESA");
        ret += $().genera_condizione_provenienza();
        
        $().filtri_save.attach_filtro('605', 'cmbTipologia');
        $().filtri_save.attach_filtro('606', 'cmbStatoIN');
        
        $().filtri_save.save();
        
        if($("select[name=cmbTipologia]").val() != "")
            ret += " and TIPO = " + $("select[name=cmbTipologia]").val();

        if($("select[name=cmbStatoIN]").val() != "")
            ret += " and COD_STATO_CONSULENZA = " + $("select[name=cmbStatoIN]").val();
        
        return ret;
    },
    
    genera_where_esami_richieste_in: function(all_filter)
    {
        var ret = "WHERE ";
        
        $().filtri_save.valore = '';
        
        ret += "STATO_RICHIESTA = 'I' and ";
        ret += $().genera_condizione_cdc();
        
        if(all_filter)
        {
            ret += $().genera_condizione_anag();
            ret += $().genera_condizione_date("DATA_RICHIESTA");
            ret += $().genera_condizione_provenienza();
            
            $().filtri_save.save();
        }
        
        return ret;
    }
});

$(document).ready(function()
{
    $('#oTableSwitch,#oTableFiltri').addClass('classTableFullWidth');
    
    // Pulisco la pagina...
    $('#groupWK0').hide().find('table').remove();
    $('#groupWK1').hide().find('table').remove();
    
    // Nascondo i pezzi non utilizzati di pagina perchè al momento non vengono usati per la parte OUT!
    $('#lblIN,#lblOUT,#lblRepartoSorgente,#lblElencoRepartoSorgente').parent().hide();
    $('select[name=cmbStatoOUT]').hide().parent().attr('colspan', '9');
    
    // Allineo i td
    $('select[name=cmbUrgenza]').parent().attr('colspan', '9');
    $('select[name=cmbTipologia]').parent().attr('colspan', '14');
    
    $('#lblCerca').click(function()
    {
        if($("#hRepartoDestinazione").val() != '')
        {
            var url = '';

            if($('#oTableSwitch td.classTdSwitchSel').index() == 0)
            {
                // Caso ESAMI
                // Worklist delle consulenze (ESAMI)
            	
                url = 'servletGenerator?KEY_LEGAME=WK_ESA_CONSULENZE&WHERE_WK=' + escape($().genera_where_esami_in());

                $('#oIFWK0').attr('src', url);

                // Worklist delle richieste solo inviate!!!
                url = 'servletGenerator?KEY_LEGAME=WK_RICH_CONSULENZE&WHERE_WK=' + escape($().genera_where_esami_richieste_in(false));
          
                $('#oIFWK1').attr('src', url);
                
                alert('case Esami: '+url)
            }
            else
            {
                // Caso RICHIESTE
            	alert('case Richieste: '+url);
                url = 'servletGenerator?KEY_LEGAME=WK_RICH_CONSULENZE&WHERE_WK=' + escape($().genera_where_esami_richieste_in(true));

                $('#oIFWK0').attr('src', url);
            }
        }
    });
    
    $('.classTdSwitch').click(function()
        {
            if($('#oTableSwitch td.classTdSwitchSel').index() == $(this).index())
                return; // Non ho cambiato tipo di ricerca
            
            $('#oTableSwitch td.classTdSwitchSel').removeClass('classTdSwitchSel');
            
            $(this).addClass('classTdSwitchSel');
            
            if($(this).index() == 0)
            {
                $('select[name=cmbStatoIN]').show();
                $('select[name=cmbStatoINRich]').hide();
                $('#lblTipologia,select[name=cmbTipologia]').parent().show();
                $('#lblUrgenza,select[name=cmbUrgenza]').parent().hide(); //#lblProvenienza,select[name=cmbProvenienza],
            }
            else
            {
                $('select[name=cmbStatoIN]').hide();
                $('select[name=cmbStatoINRich]').show();
                $('#lblTipologia,select[name=cmbTipologia]').parent().hide();
                $('#lblUrgenza,select[name=cmbUrgenza]').parent().show(); //#lblProvenienza,select[name=cmbProvenienza],
            }
            
            $().resize_wk_in($(this).index());
            
            $('#lblCerca').click();
        });
    
    // Per ora lancio sempre quella degli esami!
    $('.classTdSwitch:eq(0)').click();
});

function aggiorna()
{
    // TODO
}