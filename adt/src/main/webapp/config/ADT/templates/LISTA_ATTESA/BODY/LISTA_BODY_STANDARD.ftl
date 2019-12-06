<!--tr >
	<#include "../FIELDS/FLD_SITUAZIONE.ftl">
</tr -->
<tr>
	<@lib.tdLbl class="tdLbl" id="lblListaAttesaDescrizione" value="${traduzione.lblListaAttesaDescrizione}"></@lib.tdLbl>
	<@lib.tdText class="" id="txtListaAttesaDescrizione" readOnly="S"></@lib.tdText>
</tr>
<tr>
	<@lib.tdLbl class="tdLbl" id="lblModAccesso" value="${traduzione.lblModAccesso}" ></@lib.tdLbl>
 	<@lib.tdComboMap id="cmbModalitaAccesso" option=dati_salvati.cmbModalitaAccesso.getMatrixData()></@lib.tdComboMap>
 	<@lib.tdLbl class="tdLbl" id="lblPZOncologico" value="${traduzione.lblPZOncologico}" ></@lib.tdLbl>
 	<@lib.tdRadioSiNo idRadio="radPZOncologico" ></@lib.tdRadioSiNo>
 	<@lib.tdCheck idCheck="chkRXAllergico" tdClass="chkRXAllergico" option=dati_salvati.chkRXAllergico.getMatrixData() configPlugin="{width:150,ctrl:false}" colspan="1"></@lib.tdCheck>
</tr>
<tr>
	<@lib.tdLbl class="tdLbl" id="lblRegimeRicovero" value="${traduzione.lblRegimeRico}" ></@lib.tdLbl>
 	<@lib.tdComboMap id="cmbRegimeRicovero" option=dati_salvati.cmbRegimeRicovero.getMatrixData()></@lib.tdComboMap>
 	<@lib.tdLbl class="tdLbl" id="lblLiberaProfessione" value="${traduzione.lblLiberaProfessione}" ></@lib.tdLbl>
 	<@lib.tdRadioSiNo idRadio="radLiberaProfessione" ></@lib.tdRadioSiNo>
 	<@lib.tdCheck idCheck="chkSolvente" tdClass="chkSolvente" option=dati_salvati.chkSolvente.getMatrixData() configPlugin="{width:150,ctrl:false}" colspan="1"></@lib.tdCheck>
</tr>
<tr>
	<@lib.tdAutoComplete idText="txtRepartoDegenza" idLbl="lblRepartoDegenza" tradLbl="Reparto Degenza" idAutoComplete="acRepartoDegenza" query="LISTA_ATTESA_FILTRI.Q_REPARTI_LISTA" idWk="WK_LISTA_ATTESA_AC_REPARTI" datasource="ADT" binds={"IDEN_LISTA" : "${dati_salvati['ID_LISTA'].getValue()}"} title="Reparto Degenza" colspan="1"></@lib.tdAutoComplete>
</tr>
<tr>
	<@lib.tdAutoComplete idText="txtMedicoProponente" idLbl="lblMedicoProponente" tradLbl="${traduzione.lblMedicoProponente}" idAutoComplete="acMedicoProponente" query="LISTA_ATTESA_PAGINA.Q_MEDICO_PROPONENTE" idWk="WK_LISTA_ATTESA_AC_MEDICO_PROPONENTE" datasource="ADT" binds={"IDEN_LISTA" : "${dati_salvati['ID_LISTA'].getValue()}"} title="Medico Proponente"></@lib.tdAutoComplete>
	<@lib.tdRadio idRadio="radTipoMedicoProponente" tdClass="radTipoMedicoProponente" option=dati_salvati.radTipoMedicoProponente.getMatrixData() configPlugin="{width:75,ctrl:false}" colspan="2"></@lib.tdRadio>
</tr>
<tr>
	<#include "../FIELDS/FLD_DIAGNOSI.ftl">
</tr>