<#import "../LibHtml.ftl" as lib>

<table class="campi">
<tbody>
<tr>
<@lib.tdLbl class="tdLbl sx" id="lblVuoto" value=""></@lib.tdLbl>
<@lib.tdLbl class="tdLbl sx bGray" id="lblValoriAttesi" value="${traduzione.lblValoriAttesi}"></@lib.tdLbl>
<@lib.tdLbl class="tdLbl sx bGray" id="lblValoriOttenuti" value="${traduzione.lblValoriOttenuti}"></@lib.tdLbl>
</tr>

<tr>
<@lib.tdLbl class="tdLbl sx bGray" id="lblControlloVisivo" value="${traduzione.lblControlloVisivo}"></@lib.tdLbl>
<@lib.tdLbl class="tdLbl sx" id="lblCV" value="${traduzione.lblCV}"></@lib.tdLbl>
<@lib.tdRadioSiNo idRadio="radControlloVisivo"></@lib.tdRadioSiNo>
</tr>

<tr>
<@lib.tdLbl class="tdLbl sx bGray" id="lblAttNom" value="${traduzione.lblAttNom}"></@lib.tdLbl>
<@lib.tdLbl class="tdLbl sx" id="lblAttNomVuoto" value=""></@lib.tdLbl>
<@lib.tdText class="tdText" id="TXTATTNOM"></@lib.tdText>
</tr>

<tr>
<@lib.tdLbl class="tdLbl sx bGray" id="lblAttTc" value="${traduzione.lblAttTc}"></@lib.tdLbl>
<@lib.tdLbl class="tdLbl sx" id="lblAttTc" value=""></@lib.tdLbl>
<@lib.tdText class="tdText" id="TXTATTTC"></@lib.tdText>
</tr>

<tr>
<@lib.tdLbl class="tdLbl sx bGray clickable" id="lblResa" value="${traduzione.lblResa}"></@lib.tdLbl>
<@lib.tdLbl class="tdLbl sx" id="lblResaAttesa" value="${traduzione.lblResaAttesa}"></@lib.tdLbl>
<@lib.tdText class="tdText" id="TXTRESA"></@lib.tdText>
</tr>

</tbody>
</table>

<@lib.tdTextHidden id="DATA_TARATURA"></@lib.tdTextHidden>
<@lib.tdTextHidden id="ORA_TARATURA"></@lib.tdTextHidden>
<@lib.tdTextHidden id="DATA_INSERIMENTO"></@lib.tdTextHidden>
<@lib.tdTextHidden id="ORA_INSERIMENTO"></@lib.tdTextHidden>


        <script type="text/javascript">
            function initTemplate()
            {
                $('#lblResa').on('click',calcolaResa);
            }

            function calcolaResa()
            {
                var attivitaNominale=parseFloat($("#TXTATTNOM").val().replace(",","."));
                var attivitaMisurata=parseFloat($("#TXTATTTC").val().replace(",","."));
                var attivitaAttesa=Math.round(parseFloat(attivitaNominale*(Math.exp((-(Math.log(2))*(-143.667))/66.02))*0.876)*1000)/1000;
                var resa=Math.round(((attivitaMisurata/attivitaAttesa)*100)*100)/100;


                //$("#txtAttivitaAttesa").val(attivitaAttesa);
                $("#TXTRESA").val(resa+"%");
                //esitoControllo();

            }
        </script>