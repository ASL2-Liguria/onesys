$(document).ready(function() {
    var lista_iden  = "";
    $("#valida", "#container_dx_top").click(function() {
		//tapullone TEMPORANEO da modificare****************
		var elenco_id = collectIdenDettaglio();
		elenco_id = elenco_id.replace( /_1/g , '');
		elenco_id = elenco_id.replace( /_2/g , '');
		elenco_id = elenco_id.replace( /_3/g , '');
		elenco_id = elenco_id.replace( /_4/g , '');
		elenco_id = elenco_id.replace( /_5/g , '');												
		lista_iden = elenco_id.split(",")
		 //vecchia versione**********************************
		 //lista_iden = collectIdenDettaglio().split(",");        
        writeReport( lista_iden );
        save( lista_iden );
		$("#valida").addClass("buttonHidden");
		$("#riassunto","#container_dx_bottom").removeClass("buttonHidden");
    });
    $("#butRiassunto").click(function() {
            //opener.setReportControlRTFText(opener.array_descr_esame[0] + '\n' + $("#referto").text());
			//parent.setReportControlTXTText(opener.getReportControlTXT() + '<br>' + $("#referto").text());
			var a =  $("#referto").val()
			a= a.replace( /\n/g , '<br>');

        parent.NS_REFERTO.vocale.setReportControlHTMLText (a);
            parent.NOTIFICA.success({message: "Referto Importato Correttamente", title: "Success"});

    });
    $("#butChiudi").click(function() {
            self.close();
    });
    $("#riapri", "#container_dx_top").click(function() {
            $('#riassuntoButs').hide();
            $("#container_sx").show();
			$("#container_dx").width("49%");
    });		
});

function writeReport( array_dettaglio )
{
    var p=new Object();
    p.idIden="";
    for(i = 0; i < array_dettaglio.length; i++)
    {
       if(p.idIden!='')
            p.idIden= p.idIden+',' +array_dettaglio[i]
        else
           p.idIden=array_dettaglio[i];
    }
    var db = $.NS_DB.getTool({setup_ajax:{url: $().getAbsolutePathServer() + 'pageDB?t=' + new Date().getTime(), async: false}});
    db.select(
        {
            id: 'TREE.Q_WRITE_TREE',
            datasource: 'GASTRO',
            parameter:
            {idIden:  p.idIden},
            success: function(data){formatSummary(data);}
        });


}

function collectIdenDettaglio()
{
    var riassunto           = $("#riassunto li a", "#container_dx_top").not("a.bold");
    return riassunto.map(function(){ return $(this).attr("id").replace("_summary", ""); }).get().join(",").toString();
}

function formatSummary( referto ) {

    
    var idenDettaglio       = collectIdenDettaglio().split(",");
    var riassunto           = $("#riassunto li", "#container_dx_top");
    var testo_formattato    = "";
    var testata             = "";
    var idTab               = "";
     var referto_array=referto.result;

    for(i = 0; i < referto_array.length; i++) 
	{
        testata     = $("a.bold[data-parent=\""+ referto_array[i].IDEN_TAB +"\"]", "#container_dx_top");

        if( testata.length > 0 && idTab != referto_array[i].IDEN_TAB )
		{
            testo_formattato += "<br>" + testata.text() +": ";
            idTab = referto_array[i].IDEN_TAB
        }
        testo_formattato    += ( referto_array[i].TESTO_REFERTO != "" ) ? referto_array[i].TESTO_REFERTO : "";
		
		//if (opener.baseUser.LOGIN == 'alesiri') {}

        if( referto_array[i].TIPO_CAMPO == "P" && referto_array[i].RICHIEDI_TESTO == "S" )
		{
			testo_formattato    += riassunto.find("a#"+ idenDettaglio[i] +"_summary").eq(0).text().replace( referto_array[i].TESTO +": ", " " );
		}
		else if( referto_array[i].TIPO_CAMPO == "T" )
		{
			testo_formattato    += riassunto.find("a#"+ idenDettaglio[i] +"_summary").text();
		}
        testo_formattato    += ( referto_array[i].TESTO_REFERTO_CHIUSURA != "" ) ? referto_array[i].TESTO_REFERTO_CHIUSURA : "";
    }

    $("#referto", "#container_dx_bottom").val( beautifyReport( testo_formattato ) );
 
}

function beautifyReport( testo ) {
    
    var beautified  = testo;
    
	beautified      = beautified.replace( 'Istologico: <br>', 'Istologico: ');
	beautified      = beautified.replace( /<br><br>/g , '\n');
    beautified      = beautified.replace( /<br>/g , '\n');
    beautified      = beautified.replace( /&nbsp;/g , ' ');
    beautified      = beautified.replace( /,\n/g , '.\n');
	beautified      = beautified.replace( 'Premedicazioni:', '\nPremedicazioni:');
	beautified      = beautified.replace( 'Sede Raggiunta:', '\nSede Raggiunta:');
	beautified      = beautified.replace( 'Consigli:', '\nConsigli:');
    beautified      = beautified.replace( 'Patologie e Procedure: ', '');
    beautified      = beautified.replace( 'Complicanze Colonscopia:', '\nComplicanze Colonscopia:');
    beautified      = beautified.replace( 'Consigli:', 'Consigli:\n');
	
	beautified      = beautified.replace( 'Infermieri Endoscopia: ', 'Infermieri Endoscopia: ');
//	beautified      = beautified.replace( '<br>Infermiere NORA:', '\nInfermieri TEST: ');
	beautified      = beautified.replace( '\nInfermiere NORA:', ' Infermiere NORA: ');
	beautified      = beautified.replace( '\nAnestesisti:', ' Anestesisti: ');
//	if (opener.baseUser.LOGIN == 'alesiri') {alert(beautified)}
//	beautified      = beautified.replace( 'Anestesisti: ', '\nAnestesisti: ');
    return beautified;    
}

function save( lista_iden )
{
    var testo_html      = $("#riassunto", "#container_dx_top").html().replace(/\'/g, "''");
    var testo_referto   = encodeURIComponent( $("#referto", "#container_dx_bottom").val().replace(/\'/g, "''") );
    //SQL = "BEGIN GASTRO_SAVE('"+ iden_colonscopia +"',to_char(sysdate,'yyyymmdd'),'"+ top.home.baseUser.LOGIN +"','"+ testo_html +"','"+ testo_referto +"','"+id_esame +"','"+ lista_iden +"');END;";
    par = {
        pIden_GASTRO: { t: 'V', v: iden_colonscopia },
        vDataIns: { t: 'V', v: '' },
        vUteIns: { t: 'V', v: top.home.baseUser.LOGIN },
        vHtml: { t: 'C', v: testo_html },
        vTesto_Referto: { t: 'C', v:testo_referto }     ,
        pIDEN_ESAMI: { t: 'V', v: id_esame }     ,
        vElencoIdenGASTRODett: { t: 'V', v: lista_iden }
    };

	//alert(iden_colonscopia + "@" + opener.baseUser.LOGIN + "@testo_html@testo_referto@" + id_esame + "@" + lista_iden)
    var db = $.NS_DB.getTool({setup_ajax:{url: $().getAbsolutePathServer() + 'pageDB?t=' + new Date().getTime(), async: false}});
    db.call_procedure(
        {
            id: 'GASTRO_SAVE',
            datasource: 'GASTRO',
            parameter: par  ,
            success: function(){sqlSave(null);}
        });
}

function sqlSave(result){return;}