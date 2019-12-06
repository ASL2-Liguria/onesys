<?xml version="1.0"?>
<PAGINA>
    <INFO>
        <IDENTIFICATIVO></IDENTIFICATIVO>
        <PAGINA></PAGINA>
    </INFO>
    <CAMPI>
        <CAMPO KEY_CAMPO="HL7">TRUE</CAMPO>
        <CAMPO KEY_CAMPO="DESTINATARIO">${json.getString("DESTINATARIO")}</CAMPO>
        <CAMPO KEY_CAMPO="HcmbRepDest">${json.getString("repartoDestinatario")}</CAMPO>
        <CAMPO KEY_CAMPO="HelencoEsami">${json.getString("elencoIdenEsami")}</CAMPO>
        <CAMPO KEY_CAMPO="HelencoMetodiche">${json.getString("elencoMetodicheEsami")}</CAMPO>
        <CAMPO KEY_CAMPO="Hiden_MedPrescr">${json.getString("idenMedicoOrdinante")}</CAMPO>
        <CAMPO KEY_CAMPO="Hiden_anag">${json.getString("idenAnag")}</CAMPO>
        <CAMPO KEY_CAMPO="Hiden_op_rich">${json.getString("idenMedicoOrdinante")}</CAMPO>
        <CAMPO KEY_CAMPO="Hiden_pro">${json.getString("idenPosizionePaziente")}</CAMPO>
        <CAMPO KEY_CAMPO="Hiden_visita">${json.getString("idenNosologico")}</CAMPO>
        <CAMPO KEY_CAMPO="HrepartoRicovero">${json.getString("cdcPosizionePaziente")}</CAMPO>
        <CAMPO KEY_CAMPO="hUrgenza">${json.getString("urgenza")}</CAMPO>
        <CAMPO KEY_CAMPO="LETTURA">N</CAMPO>
        <CAMPO KEY_CAMPO="STAMPA">N</CAMPO>
        <CAMPO KEY_CAMPO="OPERAZIONE">SAVE</CAMPO>
        <CAMPO KEY_CAMPO="USER_ID">${json.getString("idenMedicoOrdinante")}</CAMPO>
        <CAMPO KEY_CAMPO="USER_LOGIN">${json.getString("USER_LOGIN")}</CAMPO>
        <CAMPO KEY_CAMPO="TIPOLOGIA_RICHIESTA">${json.getString("tipologiaEsami")}</CAMPO>
        <CAMPO KEY_CAMPO="txtMedPrescr"><#if json.getString("descrizioneMedicoOrdinante") != "null">${json.getString("descrizioneMedicoOrdinante")}</#if></CAMPO>
        <CAMPO KEY_CAMPO="txtOpRich"><#if json.getString("descrizioneMedicoOrdinante") != "null">${json.getString("descrizioneMedicoOrdinante")}</#if></CAMPO>
        <CAMPO KEY_CAMPO="elencoNumeriImpegnative"><#if json.getString("elencoNumeriImpegnative") != "null">${json.getString("elencoNumeriImpegnative")}</#if></CAMPO>
        <CAMPO KEY_CAMPO="elencoDateImpegnative"><#if json.getString("elencoDateImpegnative") != "null">${json.getString("elencoDateImpegnative")}</#if></CAMPO>
        <CAMPO KEY_CAMPO="elencoTipiImpegnative"><#if json.getString("elencoTipiImpegnative") != "null">${json.getString("elencoTipiImpegnative")}</#if></CAMPO>
        <CAMPO KEY_CAMPO="elencoUrgenzeImpegnative"><#if json.getString("elencoUrgenzeImpegnative") != "null">${json.getString("elencoUrgenzeImpegnative")}</#if></CAMPO>
        <CAMPO KEY_CAMPO="txtCodEsenzione"><#if json.getString("codiceEsenzione") != "null">${json.getString("codiceEsenzione")}</#if></CAMPO>
        <CAMPO KEY_CAMPO="txtQuadroClinico"><#if json.getString("quadroClinico") != "null">${json.getString("quadroClinico")}</#if></CAMPO>          
        <CAMPO KEY_CAMPO="txtQuesito"><#if json.getString("quesito") != "null">${json.getString("quesito")}</#if></CAMPO>
        <CAMPO KEY_CAMPO="txtDataRichiesta">${json.getString("dataRichiestaEsami")}</CAMPO>
        <CAMPO KEY_CAMPO="txtOraRichiesta">${json.getString("oraRichiestaEsami")}</CAMPO>
        <CAMPO KEY_CAMPO="txtDataProposta">${json.getString("dataPropostaEsami")}</CAMPO>
        <CAMPO KEY_CAMPO="txtOraProposta">${json.getString("oraPropostaEsami")}</CAMPO>
    </CAMPI>
</PAGINA>
