<#import "../LibHtml.ftl" as lib>

<#include "HEADER/LISTA_HEADER_PRIORITA_MOTIVO.ftl">

<input name="TEMPLATE" type="HIDDEN" value=${dati.TEMPLATE.getValue()} id="TEMPLATE"/>
<input name="JSON_METADATI" type="HIDDEN" value='${dati.JSON_METADATI.getValue()}' id="JSON_METADATI"/>

<script type="text/javascript">

	_METDATI_TEMPLATE = 
	[
		{"KEY" : "txtDiagnosi", "TYPE" : "TEXT", "HIDDEN_FIELD" : "", "LABEL" : "Diagnosi Testuale"},
		{"KEY" : "txtMateriale", "TYPE" : "TEXT", "HIDDEN_FIELD" : "", "LABEL" : "Materiale"},
		{"KEY" : "txtTipoIntervento", "TYPE" : "TEXT", "HIDDEN_FIELD" : "", "LABEL" : "Tipo Intervento"},
		{"KEY" : "txtMotivoPriorita", "TYPE" : "TEXT", "HIDDEN_FIELD" : "", "LABEL" : "Motivo Priorita"},
		{"KEY" : "txtDaDataPrevisione", "TYPE" : "DATE", "HIDDEN_FIELD" : "h-txtDaDataPrevisione", "LABEL" : "Data Previsione Inizio"},
		{"KEY" : "txtADataPrevisione", "TYPE" : "DATE", "HIDDEN_FIELD" : "h-txtADataPrevisione", "LABEL" : "Data Previsione Fine"},
		{"KEY" : "cmbTipoAnestesia", "TYPE" : "SELECT", "HIDDEN_FIELD" : "", "LABEL" : "Tipo Anestesia"},
		{"KEY" : "cmbSituazione", "TYPE" : "SELECT", "HIDDEN_FIELD" : "", "LABEL" : "Situazione"},
		{"KEY" : "cmbModalitaAccesso", "TYPE" : "SELECT", "HIDDEN_FIELD" : "", "LABEL" : "Modalità Accesso"},
		{"KEY" : "cmbRegimeRicovero", "TYPE" : "SELECT", "HIDDEN_FIELD" : "", "LABEL" : "Regime Ricovero"},
		{"KEY" : "txtInterventoICD", "TYPE" : "AUTOCOMPLETE", "HIDDEN_FIELD" : "h-txtInterventoICD", "LABEL" : "Intervento ICD9"},
		{"KEY" : "txtDiagnosiICD", "TYPE" : "AUTOCOMPLETE", "HIDDEN_FIELD" : "h-txtDiagnosiICD", "LABEL" : "Diagnosi ICD9"},
		{"KEY" : "txtRepartoDegenza", "TYPE" : "AUTOCOMPLETE", "HIDDEN_FIELD" : "h-txtRepartoDegenza", "LABEL" : "Reparto Degenza"},
		{"KEY" : "txtMedicoPrimoChirurgo", "TYPE" : "AUTOCOMPLETE", "HIDDEN_FIELD" : "h-txtMedicoPrimoChirurgo", "LABEL" : "Primo Chirurgo"},
		{"KEY" : "txtMedicoProponente", "TYPE" : "AUTOCOMPLETE", "HIDDEN_FIELD" : "h-txtMedicoProponente", "LABEL" : "Medico Proponente"},
		{"KEY" : "chkRXAllergico", "TYPE" : "CHECK", "HIDDEN_FIELD" : "h-chkRXAllergico", "LABEL" : "Check RX Consegnante e Allergico"},
		{"KEY" : "chkSolvente", "TYPE" : "CHECK", "HIDDEN_FIELD" : "h-chkSolvente", "LABEL" : "Check Solvente"},
		{"KEY" : "radLateralita", "TYPE" : "RADIO", "HIDDEN_FIELD" : "h-radLateralita", "LABEL" : "Lateralita"},
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
			</tr>
        </tbody>
    </table>
    <table class="campi null">
        <tbody>
			<#include "BODY/LISTA_BODY_STANDARD.ftl">
			<tr><#include "FIELDS/FLD_INTERVENTI.ftl"></tr>
			<tr><#include "FIELDS/FLD_MATERIALE.ftl"></tr>
			<tr>
				<@lib.tdLbl class="tdLbl" id="lblNote" value="${traduzione.lblNote}"></@lib.tdLbl>
				<@lib.tdTextarea id="txtNote" colspan="2"></@lib.tdTextarea>
				<@lib.tdLbl class="tdLbl" id="lblNoteModifica" value="${traduzione.lblNoteModifica}" ></@lib.tdLbl>
				<@lib.tdTextarea id="txtNoteModifica" colspan="2"></@lib.tdTextarea>
			</tr>
			<tr><#include "FIELDS/FLD_TIPO_ANESTESIA.ftl"></tr>
			<tr>
				<@lib.tdAutoComplete idText="txtMedicoPrimoChirurgo" idLbl="lbMedicoPrimoChirurgo" tradLbl="${traduzione.lblMedicoPrimoChirurgo}" idAutoComplete="acMedicoPrimoChirurgo" query="LISTA_ATTESA_PAGINA.Q_MEDICO_PROPONENTE" idWk="WK_LISTA_ATTESA_AC_MEDICO_PROPONENTE" datasource="ADT" binds={"IDEN_LISTA" : "${dati_salvati['ID_LISTA'].getValue()}"} title="Medico Proponente"></@lib.tdAutoComplete>
				
			</tr>
			<tr>
				<#include "FIELDS/FLD_SITUAZIONE.ftl">
			</tr>
			<tr>
				<#include "FIELDS/FLD_LATERALITA.ftl">
			</tr>
        </tbody>
    </table>
    
    <table class="campi" id="tblDataPrevisione">
        <tbody>
    		<tr><#include "FIELDS/FLD_DATA_PREVISTA.ftl"></tr>
        </tbody>
    </table>
</fieldset>