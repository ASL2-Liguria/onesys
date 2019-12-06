<#import "../LibHtml.ftl" as lib>

<#include "HEADER/LISTA_HEADER_PRIORITA_MOTIVO.ftl">

<input name="TEMPLATE" type="HIDDEN" value=${dati.TEMPLATE.getValue()} id="TEMPLATE"/>
<input name="JSON_METADATI" type="HIDDEN" value='${dati.JSON_METADATI.getValue()}' id="JSON_METADATI"/>

<script type="text/javascript">

	_METDATI_TEMPLATE = 
	[
		{"KEY" : "txtDiagnosi", "TYPE" : "TEXT", "HIDDEN_FIELD" : "", "LABEL" : "Diagnosi Testuale"},
		{"KEY" : "txtNumeroTelefono", "TYPE" : "TEXT", "HIDDEN_FIELD" : "", "LABEL" : "Numero di Telefono"},
		{"KEY" : "txtMotivoPriorita", "TYPE" : "TEXT", "HIDDEN_FIELD" : "", "LABEL" : "Motivo Priorit&agrave;"},
		{"KEY" : "txtDaDataPrevisione", "TYPE" : "DATE", "HIDDEN_FIELD" : "h-txtDaDataPrevisione", "LABEL" : "Data Previsione Inizio"},
		{"KEY" : "txtADataPrevisione", "TYPE" : "DATE", "HIDDEN_FIELD" : "h-txtADataPrevisione", "LABEL" : "Data Previsione Fine"},
		{"KEY" : "cmbModalitaAccesso", "TYPE" : "SELECT", "HIDDEN_FIELD" : "", "LABEL" : "Modalit&agrave; Accesso"},
		{"KEY" : "cmbRegimeRicovero", "TYPE" : "SELECT", "HIDDEN_FIELD" : "", "LABEL" : "Regime Ricovero"},
		{"KEY" : "txtDiagnosiICD", "TYPE" : "AUTOCOMPLETE", "HIDDEN_FIELD" : "h-txtDiagnosiICD", "LABEL" : "Diagnosi ICD9"},
		{"KEY" : "txtRepartoDegenza", "TYPE" : "AUTOCOMPLETE", "HIDDEN_FIELD" : "h-txtRepartoDegenza", "LABEL" : "Reparto Degenza"},
		{"KEY" : "txtMedicoProponente", "TYPE" : "AUTOCOMPLETE", "HIDDEN_FIELD" : "h-txtMedicoProponente", "LABEL" : "Medico Proponente"},
		{"KEY" : "chkRXAllergico", "TYPE" : "CHECK", "HIDDEN_FIELD" : "h-chkRXAllergico", "LABEL" : "Check RX Consegnante e Allergico"},
		{"KEY" : "chkSolvente", "TYPE" : "CHECK", "HIDDEN_FIELD" : "h-chkSolvente", "LABEL" : "Check Solvente"},
		{"KEY" : "radTipoMedicoProponente", "TYPE" : "RADIO", "HIDDEN_FIELD" : "h-radTipoMedicoProponente", "LABEL" : "Provenienza Medico Proponente"},
		{"KEY" : "radLiberaProfessione", "TYPE" : "RADIO", "HIDDEN_FIELD" : "h-radLiberaProfessione", "LABEL" : "Libera Professione"},
		{"KEY" : "radPrevisioneRicovero", "TYPE" : "RADIO", "HIDDEN_FIELD" : "h-radPrevisioneRicovero", "LABEL" : "Previsione Ricovero"},
		{"KEY" : "radPZOncologico", "TYPE" : "RADIO", "HIDDEN_FIELD" : "h-radPZOncologico", "LABEL" : "Previsione Ricovero"}
	];

</script>

<fieldset class="fldCampi" id="fldDatiTec">
    <legend>Dati Sanitari</legend>
    <table class="campi">
        <tbody>
			<tr>
				<#include "FIELDS/FLD_DATA_PRENOTAZIONE.ftl">
				<#include "FIELDS/FLD_TELEFONO.ftl">
			</tr>
        </tbody>
    </table>
    <table class="campi">
        <tbody>
			<#include "BODY/LISTA_BODY_STANDARD.ftl">
			<tr>
				<@lib.tdLbl class="tdLbl" id="lblNote" value="${traduzione.lblNote}"></@lib.tdLbl>
				<@lib.tdTextarea id="txtNote" colspan="2"></@lib.tdTextarea>
				<@lib.tdLbl class="tdLbl" id="lblNoteModifica" value="${traduzione.lblNoteModifica}" ></@lib.tdLbl>
				<@lib.tdTextarea id="txtNoteModifica" colspan="2"></@lib.tdTextarea>
			</tr>
        </tbody>
    </table>
    
    <table class="campi" id="tblDataPrevisione">
        <tbody>
    		<tr><#include "FIELDS/FLD_DATA_PREVISTA.ftl"></tr>
        </tbody>
    </table>
</fieldset>