var JQGridFormatter = {

    dateFromTimestamp : function(cellvalue, options, rowObject)
    {
        return cellvalue == null ? '' : moment(new Date(cellvalue)).format('DD/MM/YYYY');
    },

    dateFromISO : function(cellvalue, options, rowObject)
    {
        return cellvalue == null ? '' : moment(cellvalue, "YYYYMMDD").format('DD/MM/YYYY');
    },

    formatStandard : function(cellvalue, options, rowObject){

        if (cellvalue == null) {
            return "";
        } else {
            return cellvalue;
        }
    },

    sortDate : function(a,b,direction){
        alert("a -> " + a + "\nb -> " + JSON.stringify(b) + "\ndirection -> " + JSON.stringify(direction));
    },

    formatRegione : function (cellvalue, options, rowObject){

        switch (cellvalue){
            case "010" :
                return "Piemonte";
            case "020" :
                return "Val d'Aosta";
            case "030" :
                return "Lombardia";
            case "041" :
                return "Prov. Autonoma di Bolzano";
            case "042" :
                return "Prov. Autonoma di Trento";
            case "050" :
                return "Veneto";
            case "060" :
                return "Friuli Venezia Giulia";
            case "070" :
                return "Liguria";
            case "080" :
                return "Emilia Romagna";
            case "090" :
                return "Toscana";
            case "100" :
                return "Umbria";
            case "110" :
                return "Marche";
            case "120" :
                return "Lazio";
            case "130" :
                return "Abruzzo";
            case "140" :
                return "Molise";
            case "150" :
                return "Campania";
            case "160" :
                return "Puglia";
            case "170" :
                return "Basilicata";
            case "180" :
                return "Calabria";
            case "190" :
                return "Sicilia";
            case "200" :
                return "Sardegna";
            default :
                return "";
        }
    },

    formatSesso : function (cellvalue, options, rowObject){

        switch (cellvalue){
            case "M" :
                return "Maschio";
            case "F" :
                return "Femmina";
            case "X" :
                return "Sconosciuto";
        }
    }

};

var NS_GRIGLIA = {

    load : function(p){

        var nGrid = 0;
        var nGridVisible = 0;

        $("div[id^='gbox_colch_']:visible").each(function(){
            var idxGrid = $(this).attr("id").slice(-1);

            $("#gview_colch_" + idxGrid).find("span.ui-icon-circle-triangle-n").trigger("click");
            $(".contentTabs").animate({ scrollTop: $(document).height()}, 1000);

            nGrid = parseInt(idxGrid) + 1;
            nGridVisible++;
        });

        var tbl = $('<table></table>').attr('id','colch_'+ nGrid).addClass("tblGridStatistica");
        var div = $('<div></div>').attr('id','pcolch_' + nGrid);

        $('#tabStatistiche').append(tbl).append(div);

        /**
         * Calcolo altezza estrazione.
         * fieldset dei filtri + bordo padding e margine del fieldset + numero intestazioni estrazioni già effettuate + 50 sono gli header e i footer dell'estrazione + 10 px aggiunti per sicrezza per non mostrare la scroll
         */
        var hMin = parseInt($("#fldStatistiche").height()) + 47 + (21 * (parseInt(nGrid) + 1)) + 50 + 10;
        var h = $(".contentTabs").innerHeight();
        h -= hMin;

        logger.info("Caricamento estrazione - Altezza - H disponibile ->" + (h + hMin)+ ", H da rimuovere -> " + hMin);

        var gridProperties = {
            url : "query/json?page=1&sql=" + p.SQL + "&arguments=" + JSON.stringify(p.PARAMETERS) + "&connection=" + p.KEY_CONNECTION,
            loadonce : true,
            sortable : true,
            datatype : "json",
            colNames : NS_STATISTICA["config"]["GRID"]["COL_NAME"],
            colModel : NS_STATISTICA["config"]["GRID"]["COL_MODEL"],
            gridview : true,
            width : $('#fldStatistiche').innerWidth() - 10,
            height : h,
            rowNum : 15,
            rowList : [15],
            pager : '#pcolch_' + nGrid,
            sortname : NS_STATISTICA["config"]["GRID"]["SORT_NAME"],
            sortorder : NS_STATISTICA["config"]["GRID"]["SORT_ORDER"],
            shrinkToFit : false,
            viewrecords : true,
            caption: NS_STATISTICA["config"]["GRID"]["CAPTION"],
            loadComplete: function () { NS_LOADING.hideLoading(); NS_FILTRI_STATISTICHE.setEvents();  },
            loadError: function () { NS_LOADING.hideLoading(); NS_FILTRI_STATISTICHE.setEvents(); }
        };


        if (p["GROUP_FIELD"] != "" && p["GROUP_FIELD"] != null){
            gridProperties.grouping = true;
            gridProperties.groupingView = {
                groupField: [p["GROUP_FIELD"]],
                groupOrder: ['asc'],
                groupCollapse: true,
                groupText: ['<b>{0} - {1}</b>']
            }
            gridProperties.rowNum = 1000;
            gridProperties.rowList = [100,200,500];
        } else {
            var rowNum = Math.floor(h / 23);
            gridProperties.rowNum = rowNum;
            gridProperties.rowList = [rowNum,rowNum*2,rowNum*3];
        }

        if (p.hasOwnProperty("CAPTION")){
            gridProperties.caption = p.CAPTION;
        }

        for (var i = 0; i < gridProperties["colModel"].length; i++) {

            if (gridProperties["colModel"][i].hasOwnProperty("formatter")){
                gridProperties["colModel"][i].formatter = eval(gridProperties["colModel"][i].formatter);
            }

            if (typeof gridProperties["colModel"][i]["sorttype"] === "function"){
                gridProperties["colModel"][i].sorttype = eval(gridProperties["colModel"][i].sorttype);
            }

            if (gridProperties["colModel"][i].hasOwnProperty("searchoptions")){
                if (gridProperties["colModel"][i]["searchoptions"].hasOwnProperty("dataInit")){
                    gridProperties["colModel"][i]["searchoptions"].dataInit = eval(gridProperties["colModel"][i]["searchoptions"].dataInit);
                }
            }
        }

        /**Prendo il valore del combo raggruppamento e chiamo la funzione che mi toglie il campo dalla scelta delle
         colonne da mostrare e nascondere**/

        var groupBy = $("#cmbGroupBy").find("option:selected").attr("key-campo-group-order");
        NS_GRIGLIA.hideInDialog(groupBy,gridProperties["colModel"]);

        $('#colch_' + nGrid).jqGrid(gridProperties);

        jQuery('#colch_' + nGrid).jqGrid('navGrid','#pcolch_' + nGrid,{
            add : false,
            edit : false,
            del : false,
            search : false,
            refresh : false
        });

        // Add Button Bottom Bar
        jQuery('#colch_' + nGrid).jqGrid('navButtonAdd','#pcolch_' + nGrid,{
            caption: "Colonne",
            title: "Ordina Colonne",
            onClickButton : function (){$('#colch_' + nGrid).jqGrid('columnChooser');}
        });

        // Aggiungo button RIMOZIONE WK a mano perchè JqGrid non mi consente di personalizzare l'ultima barra in alto
        $a = $('#gview_colch_' + nGrid + ' > div:first-child a.HeaderButton').clone();
        $a.click(function(){$('#colch_' + nGrid).jqGrid('GridUnload');})
            .css({'right' : '20px'})
            .hover(function(){$(this).addClass('ui-state-hover');},function(){$(this).removeClass('ui-state-hover');});

        $('span', $a).removeClass('ui-icon-circle-triangle-n').removeClass('ui-jqgrid-titlebar-close').addClass('ui-icon-close');
        $('#gview_colch_' + nGrid + ' > div:first-child').append($a);


        // Aggiungo button ESPORTAZIONE WK a mano perchè JqGrid non mi consente di personalizzare l'ultima barra in alto
        $a2 = $a.clone();
        $a2.click(function(){NS_FILTRI_STATISTICHE.esporta(nGrid);})
            .css({'right' : '40px'})
            .hover(function(){$(this).addClass('ui-state-hover');},function(){$(this).removeClass('ui-state-hover');});

        $('span', $a2).removeClass('ui-icon-close').addClass('ui-icon-arrowthickstop-1-s');
        $('#gview_colch_' + nGrid + ' > div:first-child').append($a2);

        var groupBy = $("#cmbGroupBy").find("option:selected").attr("key-campo-group-order");
        $('#colch_' + nGrid).attr("groupFilter",groupBy);

        /** Chiamo la funzione che resetta la colonna per essere mostrata o nascosta attraverso il dialog per le
         * prossime estrazioni**/
        NS_GRIGLIA.showInDialog(groupBy,gridProperties["colModel"]);




    },

    hideInDialog : function(elem, colModel){

        if(elem !== "" && elem !== null && typeof elem !== "undefined"){
            var c = $.grep(colModel,function(n,i){return n.name == elem});
            c[0]["hidedlg"] = true;
            colModel = $.extend([],colModel,c);

        }
    },

    showInDialog : function(elem, colModel){

        if(elem !== "" && elem !== null && typeof elem !== "undefined"){
            var c = $.grep(colModel,function(n,i){return n.name == elem});
            c[0]["hidedlg"] = false;
            colModel = $.extend([],colModel,c);
        }
    },
}