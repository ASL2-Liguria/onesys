<#import "../LibHtml.ftl" as lib>

<table class="campi">
    <tbody>
        <tr>
            <@lib.tdLbl class="tdLbl" id="lblProva" value="${traduzione.lblProva}"></@lib.tdLbl>
            <@lib.tdText class="tdText" id="txtAttivitaTot" value="${dati.TEMPLATE.getValue()}"></@lib.tdText>
        </tr>
    </tbody>
</table>




<!--            <td class="tdRadio">
                <div class="RadioBox" id="radMDC">
                    <input name="radMDC" type="hidden" value="S" data-col-save="AUTORIZZA_MDC" id="h-radMDC">
                    <div data-value="S" class=" RBpuls" title="Sì" id="radMDC_S"><i></i><span>${traduzione.lblSi}</span></div>
                    <div data-value="N" class=" RBpuls  RBpulsSel" title="No" id="radMDC_N"><i></i><span>${traduzione.lblNo}</span></div>
                    <script>
                        var radMDC;
                        SCRIPT_PLUGIN.push("radMDC = $('#radMDC').RadioBox({width:'none'});");
                        SCRIPT_PLUGIN.push("$('#radMDC').DisableSelection();");
                    </script>
                </div>
            </td>-->