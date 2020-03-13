var id_esame            = window.location.toString().split("=")[2];
var SCHEDA_GASTRO       = window.location.toString().split("=")[1];
var lista_esami         = id_esame.replace(/\*/g, ",");
var iden_colonscopia    = "";
var dettaglio =""

$(document).ready(function(){

    SCHEDA_GASTRO       = SCHEDA_GASTRO.split("&")[0];
    var SQLSelect   = "";
    //alert(lista_esami)
/*    if (opener.registrazioneAbilitata==false)
    {
        alert("Attenzione impossibile modificare l'esame!");
        self.close();
        return;
    }
*/
//**************************************************************************************************************************************************
    //var db = $.NS_DB.getTool({_logger: MY_NS.logger});
     var db = $.NS_DB.getTool({setup_ajax:{url: $().getAbsolutePathServer() + 'pageDB?t=' + new Date().getTime(), async: false}});

    db.select(
        {
            id: 'TREE.Q_LOAD_TAB',
            datasource: 'GASTRO',
            parameter:
            {tipo: SCHEDA_GASTRO},
            success: function(data){setTabs(data);}
        });
//**************************************************************************************************************************************************
    db.select(
        {
            id: 'TREE.Q_LOAD_TAB_DETT',
            datasource: 'GASTRO',
            parameter:
            {tipo: SCHEDA_GASTRO},
            success: function(data){setTabsDetails(data);}
        });

    setDimensions();
    setHandlers();
    clearTextareas();


    $("#butHelp").fancybox({
        'width': '90%','height': '90%','autoScale': false,'transitionIn': 'none','transitionOut': 'none','type': 'iframe','href': 'doc/colon_help.pdf'
    });

    /*$("#but_wk_precedenti").fancybox({
        'width': '50%','height': '95%','autoScale': false,'transitionIn': 'none','transitionOut': 'none','type': 'iframe','href': '../Gastro/GastroConsolePrecedenti.html?IDEN_ANAG=' + opener.globalIdenAnag
    });
    */

    $("#butPHelp").fancybox({
        'width': '80%','height': '95%','autoScale': false,'transitionIn': 'none','transitionOut': 'none','type': 'iframe','href': 'doc/help.pdf'
    });

    db.select(
        {
            id: 'TREE.Q_GET_IDEN',
            datasource: 'GASTRO',
            parameter:
            {iden_esame: lista_esami},
            success: function(data){getIdenColonscopia(data);}
        });


    if( iden_colonscopia != "" ) {
        $("#nav li a", "#container_sx").trigger("click");
        db.select(
            {
                id: 'TREE.Q_LOAD_TREE_BY_IDEN',
                datasource: 'GASTRO',
                parameter:
                {iden_colonscopia: iden_colonscopia},
                success: function(data){load(data);}
            });

    } else {
        $("#nav li a:first", "#container_sx").trigger("click");
    }

    $("#preload", "#main").hide();
});

function setTabsko(  ) {

$("<a>", { id : 1, text : 'aaa', "data-description" : 'aaa', "data-default" : '1,2' }).appendTo( $("<li>").appendTo( "#nav" ) );
$("<ul>").appendTo( $("<div>", { id : 1 + "_body", "class" : "corpotab" }).appendTo( "#container_sx" ) );

}

function setTabs( data ) {
    var tabs_array = data.result;
        for( var i = 0; i < tabs_array.length; i++) {
            //IDEN_TAB, DESCRIZIONE_TAB, DESCRIZIONE, LISTA_IDEN_DEFAULT
            $("<a>", { id : tabs_array[i].IDEN_TAB, text : tabs_array[i].DESCRIZIONE_TAB, "data-description" : tabs_array[i].DESCRIZIONE, "data-default" : tabs_array[i].LISTA_IDEN_DEFAULT }).appendTo( $("<li>").appendTo( "#nav" ) );
            $("<ul>").appendTo( $("<div>", { id : tabs_array[i].IDEN_TAB + "_body", "class" : "corpotab" }).appendTo( "#container_sx" ) );
        }
}

function login()
{
    showDialog( "prova login" );
    setDialogHandlers2( idDettaglio, idTab, testo );
}

function setTabsDetails( data ) {
    var testo_pulsante = "";

    var tabs_details_array = data.result;

    var idUltimoDettaglio   = 0;
    for( i = 0; i < tabs_details_array.length; i++ ) {

        //IDEN_DETTAGLIO, IDEN_TAB, TESTO, MULTISELEZIONE, FILTRA_DETTAGLIO, RICHIEDI_TESTO, TIPO_CAMPO, CLASSE

        if( tabs_details_array[i].TIPO_CAMPO == "P" ) {

            if (tabs_details_array[i].TESTO.length > 95)
                testo_pulsante = tabs_details_array[i].TESTO.substring(0,95) + "...";
            else
                testo_pulsante = tabs_details_array[i].TESTO;


            $("<a>", {
                id:                      tabs_details_array[i].IDEN_DETTAGLIO,
                "data-multi-selection":  tabs_details_array[i].MULTISELEZIONE,
                "data-filter-detail":    tabs_details_array[i].FILTRA_DETTAGLIO,
                "data-require-text":     tabs_details_array[i].RICHIEDI_TESTO,
                href:                    "javascript: void(0);",
                text:                    testo_pulsante,
                title:					tabs_details_array[i].TESTO,
                "class":                 tabs_details_array[i].CLASSE
            }).appendTo( $("<li>").appendTo( "#"+ tabs_details_array[i].IDEN_TAB +"_body ul" ) );

        } else if ( tabs_details_array[i].TIPO_CAMPO == "T" ) {

            $("<textarea>", {
                id:                      tabs_details_array[i].IDEN_DETTAGLIO,
                "data-multi-selection":  tabs_details_array[i].MULTISELEZIONE,
                "data-filter-detail":    tabs_details_array[i].FILTRA_DETTAGLIO,
                "data-require-text":     tabs_details_array[i].RICHIEDI_TESTO,
                "class":                 tabs_details_array[i].CLASSE
            }).appendTo( $("<li>").appendTo( "#"+ tabs_details_array[i].IDEN_TAB +"_body ul" ) );

        } else if ( tabs_details_array[i].TIPO_CAMPO == "L" ) {
            $("<span>", {
                id:                      tabs_details_array[i].IDEN_DETTAGLIO,
                //title:					"Dimensioni",
                //text:					"Dimensioni:",
                title:                    tabs_details_array[i].TESTO,
                text:                    tabs_details_array[i].TESTO,
                //"class":					"tit"
                "class":                 tabs_details_array[i].CLASSE
            }).appendTo( $("<li>").appendTo( "#"+ tabs_details_array[i].IDEN_TAB +"_body ul" ) );

        }
        if (tabs_details_array[i].CLASSE=="fine") var idUltimoDettaglio = tabs_details_array[i].IDEN_DETTAGLIO;
    }


    $("div.corpotab ul li a#"+ idUltimoDettaglio, "#container_sx").click(function()
    {
        $("#riassuntoButs").show();
        $("#container_sx").hide();
        $("#container_dx").width("100%");
    });

}

function setHandlers() {

    var tabs            = $("#nav li a", "#container_sx");
    var tabs_body       = $("div.corpotab ul li a", "#container_sx");

    tabs.on("click",function(event){
        event.preventDefault();

        var tab      = $(this);
        var idTab    = tab.attr("id");
        var corpoTab = $("#"+ idTab +"_body ul li", "#container_sx");

        activateTab( idTab );
        removeSummary( idTab  );
        deactivateTab( idTab );
        showDefault( $(this) );
        setSpanTitle( $("span.title", "#container_sx"), $(this).attr("data-description") );
    });

    tabs_body.click(function(event) {

        event.preventDefault();

        dettaglio            = $(this);
        var idDettaglio          = dettaglio.attr("id");
        var idCorpoTab           = dettaglio.parent().parent().parent().attr("id");
        var testo_dettaglio      = dettaglio.text();
        var data_require_text    = dettaglio.attr("data-require-text");
        var textarea             = $("#"+ idCorpoTab +" ul li textarea", "#container_sx");

        if( textarea.length > 0 && textarea.val() != "" ) setSummary( textarea.attr("id"), idCorpoTab, textarea.val() );

        if (idDettaglio == 198)
        {( data_require_text == "N" ) ? setSummary( idDettaglio, idCorpoTab, testo_dettaglio ) : requireText( idDettaglio, idCorpoTab, testo_dettaglio );}
        else
        {( data_require_text == "N" ) ? setSummary( idDettaglio, idCorpoTab, testo_dettaglio ) : requireText( idDettaglio, idCorpoTab, testo_dettaglio );
            multiSelection( dettaglio );}
    });

}

/************************************************************************
 * **********************************************************************
 * TABS
 * **********************************************************************
 ************************************************************************/
function activateTab( idTab ) {
    $("div.corpotab", "#container_sx").removeClass("active");
    $("#nav li:has(a#" + idTab +"), #"+ idTab +"_body", "#container_sx").addClass("active");

}

function deactivateTab( idTab ) {
    var index   = $("#nav li:has(a#" + idTab +")").index();
    if( index != -1 ) $("#nav li:gt("+ index +")", "#container_sx").removeClass("active");

}

function showDefault( obj ) {
    var filter_list = ( obj.attr("data-default") != "" ) ? "#"+ obj.attr("data-default").replace(new RegExp(",", "g"), ",#") : "";
    var idTab       = obj.attr("id");
    var corpo_tab   = $("#"+ idTab +"_body", "#container_sx");

    if( filter_list != "" ) hideDetail( corpo_tab.find("ul li") );
    showDetail( corpo_tab.find(filter_list).parent() );

}

/************************************************************************
 * **********************************************************************
 * DETAILS
 * **********************************************************************
 ************************************************************************/

function multiSelection( obj ) {

    filterDetail( obj );

    if( obj.attr("data-multi-selection") == "N" ) {

        var next_id = parseInt( obj.parent().parent().parent().attr("id") ) + 1;
        $("#nav li a#"+ next_id).trigger("click");

    }

}

function filterDetail( obj ) {

    var filter_list = "";
    var corpo_tab   = obj.parent().parent().parent();

    filter_list = ( obj.attr("data-filter-detail") != "" ) ? "#"+ obj.attr("data-filter-detail").replace(new RegExp(",", "g"), ",#") : "";

    if( filter_list != "" ) {

        if( corpo_tab.find(filter_list).length > 0 ){   // FILTRA SULLO STESSO CORPOTAB

            hideDetail( corpo_tab.find("ul li") );
            showDetail( corpo_tab.find(filter_list).parent() );

        } else { // FILTRA SU UN DIVERSO CORPOTAB

            var corpo_tab_all   = $("div.corpotab", "#container_sx");
            var corpo_tab_id    = corpo_tab_all.find(filter_list).parent().parent().parent().attr("id");

            $("#nav li a#"+ parseInt( corpo_tab_id ), "#container_sx").trigger("click");
            hideDetail( corpo_tab_all.find("ul li") );
            showDetail( corpo_tab_all.find(filter_list).parent() );

        }

    }

    hideDetail( obj.parent() );

}
function setSummaryHandler() {

    var riassunto       = $("#riassunto li a", "#container_dx_top").not("#riassunto li a.bold");

    riassunto.click(function(){

        $("#nav li a#"+ $(this).attr("data-parent"), "#container_sx").trigger("click");
        removeSummary( $(this).attr("id") );
        //$("#" + $(this).attr("id") ).remove();
    });

}


function setSummary( idDettaglio, idCorpoTab, testo ) {

    var idTab           = idCorpoTab.replace("_body", "");
    var objDettaglio    = $("a#"+ idDettaglio, "#"+ idCorpoTab);
    var summaryTitle    = $("#riassunto li a[data-parent=\""+ idTab +"\"]", "#container_dx_top");
    var hasClassLast    = objDettaglio.hasClass("last");
    var hasClassAvanti  = objDettaglio.hasClass("avanti");
    var hasClassPwd		= objDettaglio.hasClass("pwd");
    var hasClassFine	= objDettaglio.hasClass("fine");
    var requireText     = objDettaglio.attr("data-require-text");

    if( ( !hasClassPwd && !hasClassLast && !hasClassAvanti && !hasClassFine ) || ( ( hasClassPwd || hasClassLast || hasClassAvanti || hasClassFine) && requireText == "S" ) ) {

        if( summaryTitle.length == 0 )
        {
            var titolo  = $("#nav li a#"+ idTab, "#container_sx").attr("data-description");
            $("<a>", { "class" : "bold", "data-parent" : idTab, href : "javascript: void(0);", text : titolo }).appendTo( $("<li>").appendTo( "#riassunto" ) );
        }
//***************************************************************************************************************************************		
//tapullone TEMPORANEO da modificare****************
        if (requireText=="S")
        {
            var riassunto = $("#riassunto li", "#container_dx_top");
            if (riassunto.find("a#"+ idDettaglio +"_5_summary").length < 1) tmp = idDettaglio +"_5"
            if (riassunto.find("a#"+ idDettaglio +"_4_summary").length < 1) tmp = idDettaglio +"_4"
            if (riassunto.find("a#"+ idDettaglio +"_3_summary").length < 1) tmp = idDettaglio +"_3"
            if (riassunto.find("a#"+ idDettaglio +"_2_summary").length < 1) tmp = idDettaglio +"_2"
            if (riassunto.find("a#"+ idDettaglio +"_1_summary").length < 1) tmp = idDettaglio +"_1"
            if (riassunto.find("a#"+ idDettaglio +"_summary").length < 1) 	tmp = idDettaglio
            idDettaglio=tmp;
        }
//***************************************************************************************************************************************		
        $("<a>", { id : idDettaglio + "_summary", "data-parent" : idTab, href : "javascript: void(0);", text : testo }).appendTo( $("<li>").appendTo( "#riassunto" ) );
        setSummaryHandler();

    } else {

        return;

    }

}

function removeSummary( idTab ) {

    var index = $("#riassunto li:has(a[data-parent=\""+ idTab +"\"])", "#container_dx_top").index();

    if( index != -1 ) ( index > 0 ) ? $("#riassunto li:gt("+ (index - 1) +")", "#container_dx_top").remove() : $("#riassunto").find("li").remove();
    setSummaryHandler();
    clearTextareas();
}

function requireText( idDettaglio, idTab, testo ) {

    if (idDettaglio==198)
    {
        showDialogLogin(idDettaglio, idTab, testo);
        //setDialogHandlers( idDettaglio, idTab, testo );
    }
    else
    {
        showDialog( testo );
        setDialogHandlers( idDettaglio, idTab, testo );
    }

}

function hideDetail( obj ) {

    obj.addClass("hidden");

}

function showDetail( obj ) {

    obj.removeClass("hidden");

}

/************************************************************************
 * **********************************************************************
 * DIALOG
 * **********************************************************************
 ************************************************************************/

function setDialogHandlers( idDettaglio, idCorpoTab, testo ) {

    var textarea    = $("textarea#dialog_box", "#pdDialog");

    $("#dialog_chiudi", "#pdDialog").click(function() {

        showDetail ( $("#"+ idCorpoTab +" ul li a#"+ idDettaglio ) );
        hideDialog();
        clearTextareas();
    });

    $("#dialog_conferma", "#pdDialog").click(function()
    {
        setSummary( idDettaglio, idCorpoTab, testo +": "+ textarea.val() );
        hideDialog();
        clearTextareas();
    });

}

function showDialog( title ) {

    var main        = $("#main");
    var dialog      = $("#pdDialog", "#main");
    var span        = $("span.title", "#pdDialog");
    var textarea    = $("textarea#dialog_box", "#pdDialog");

    dialog.show(250, function(){
        setSpanTitle( span, initCap( title ) );
        textarea.focus();
    });
}

function showDialogLogin(idDettaglio, idTab, testo) {

    var main        = $("#main");
    var dialog      = $("#dialog_login", "#main");
    var span        = $("span.title", "#dialog_login");
    var iframe		= $("#frmLogin", "#dialog_login");

    document.all.frmLogin.src ="../../SL_GestioneUtentePwd?login=S&next_function=parent.valida_reperta('"+ idDettaglio +"','"+ idTab +"','"+ testo +"');"
    iframe.width(dialog.outerWidth(false)-4).height(dialog.outerHeight(false)-50);

    dialog.show(250, function(){
        setSpanTitle( span, initCap( "Utente e password" ) );
        $("#annulla").hide();
    });

    $("#dialog_chiudi_login", "#dialog_login").click(function(){
        dialog.hide(250);
    });
}

function valida_reperta(idDettaglio, idTab, testo)
{
    $("#dialog_login", "#main").hide(250);
    showDialog("Si Reperta");
    setDialogHandlers(idDettaglio, idTab, testo);
    multiSelection( dettaglio );
}

function hideDialog() {
    var main        = $("#main");
    var dialog      = $("#pdDialog", "#main");
    var textarea    = $("textarea#dialog_box", "#pdDialog");

    dialog.hide(250, function(){
        textarea.val("");
    });

    $("#dialog_chiudi, #dialog_conferma", "#pdDialog").unbind("click");
}

function setSpanTitle(span, title) {
    span.text(title);
}

function clearTextareas() {
    $("textarea", "#main").val('');
}

function initCap(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
}

function setDimensions() {
    var doc             = { width : $(document).width(), height : $(document).height() - 40 };
    var main            = { marginTop : $("#main").css("marginTop"), marginBottom : $("#main").css("marginBottom") };
    var mainHeight      = ( (doc.height - parseInt( main.marginTop ) - parseInt( main.marginBottom ) - 25 ) );
    var halfContainer   = ( mainHeight - 12 ) / 2 ;

    $("#main").height( mainHeight +"px" );
    $("#container_sx, #container_dx", "#main").height( mainHeight +"px" );
    $("#container_dx_bottom", "#container_dx").height( Math.floor(halfContainer) +"px" );
    $("#container_dx_top").height( Math.floor(halfContainer - 25) +"px" );

    $("div.corpotab", "#container_sx").height( ( mainHeight - 38 ) +"px" );
    $("ul", "#container_dx_top ").height( ( halfContainer - 48 ) +"px" );
    $("textarea", "#container_dx_bottom").height( Math.floor( halfContainer - 52 ) +"px" );

}

function getIdenColonscopia( val ) {
    iden_colonscopia = val.result[0].IDEN_GASTRO;

    //iden_colonscopia    = ( val != "" && val !== undefined && val !== null ) ? val : "";


}

function load( valore ) {

    var riassunto   = $("#riassunto", "#container_dx_top");
    var referto     = $("#referto", "#container_dx_bottom");
    var lastIdTab   = $("li", "#nav").length;
    var textarea    = $("textarea", "#container_sx div.active");
    var val=valore.result;
    //alert(val);
    riassunto.append( val[0].HTML.toString() );
    referto.val( decodeURIComponent( val[0].TESTO_REFERTO.toString() ) );

    if( textarea.length >= 1 )
        textarea.val( riassunto.find("a[data-parent=\""+ lastIdTab +"\"]").not("a.bold").text() );

    setSummaryHandler();

}
