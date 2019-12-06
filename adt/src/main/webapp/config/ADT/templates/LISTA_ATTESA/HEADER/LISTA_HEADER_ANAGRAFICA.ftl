<#import "../../LibHtml.ftl" as lib>
<fieldset class="fldCampi" id="IdDatiAnagrafici">
    <legend>Dati anagrafici</legend>
    <table class="campi">
        <tbody>
            <tr>
                <@lib.tdLbl class="tdLbl" id="lblNome" value="${traduzione.lblNome}"></@lib.tdLbl>
                <@lib.tdText class="tdText" id="NOME"></@lib.tdText>
                <@lib.tdLbl class="tdLbl" id="lblCognome" value="${traduzione.lblCognome}"></@lib.tdLbl>
                <@lib.tdText class="tdText" id="COGNOME"></@lib.tdText>
                <@lib.tdLbl class="tdLbl" id="lblDataNasc" value="${traduzione.lblDataNascita}"></@lib.tdLbl>
                <@lib.tdText class="tdText" id="DATA_NASCITA"></@lib.tdText>
                <@lib.tdLbl class="tdLbl" id="lblSesso" value="${traduzione.lblSesso}"></@lib.tdLbl>
                <@lib.tdText class="tdText" id="SESSO"></@lib.tdText>
                <@lib.tdLbl class="tdLbl" id="lblVuota" value=""></@lib.tdLbl>
            </tr>
        </tbody>
    </table>
</fieldset>
