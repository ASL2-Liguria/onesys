<input name="NOME" type="hidden" id="NOME" value=${(dati_salvati["NOME"].getValue())!""}>
<input name="COGNOME" type="hidden" id="COGNOME" value=${(dati_salvati["COGNOME"].getValue())!""}>
<input name="DATA_NASCITA" type="hidden" id="DATA_NASCITA" value=${(dati_salvati["DATA_NASCITA"].getValue())!""}>
<input name="CODICE_FISCALE" type="hidden" id="CODICE_FISCALE" value=${(dati_salvati["CODICE_FISCALE"].getValue())!""}>
<input name="ETA" type="hidden" id="ETA" value=${(dati_salvati["ETA"].getValue())!""}>
<input name="TELEFONO" type="hidden" id="TELEFONO" value=${(dati_salvati["TELEFONO"].getValue())!""}>

<input name="IDEN_PROVENIENZA" type="hidden" id="IDEN_PROVENIENZA" value=${(dati_salvati["PROVENIENZA"].getValue())!""}>
<input name="STATO" type="hidden" id="STATO" value=${(dati_salvati["STATO"].getValue())!""}>
<input name="ID_LISTA" type="hidden" id="ID_LISTA" value=${(dati_salvati["ID_LISTA"].getValue())!""}>
<input name="IDEN_CONTATTO" type="hidden" id="IDEN_CONTATTO" value=${(dati_salvati["IDEN_CONTATTO"].getValue())!""}>
<input name="IDEN_ANAGRAFICA" type="hidden" id="IDEN_ANAGRAFICA" value=${(dati_salvati["IDEN_ANAGRAFICA"].getValue())!""}>
<input name="IDEN_PER" type="hidden" id="IDEN_ANAGRAFICA" value=${(dati_salvati["IDEN_PER"].getValue())!""}>


<fieldset class="fldCampi" id="IdLivelloUrgenza">
    <legend>Livello Priorit�</legend>
    <@lib.divCheckColor idCheck="cmbUrgenza" option=dati_salvati.cmbUrgenza.getMatrixData()></@lib.divCheckColor>
</fieldset>