<?xml version="1.0" encoding="ISO-8859-15"?>
<!--Generated using XML ELCOMapper--><!--elco@elco.it--><!--21/11/2012 11:51:54--><xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:var="urn:var"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:user="urn:user"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                exclude-result-prefixes="user xs fn xsi var"
                version="2.0">
   <xsl:template match="PID.11" mode="user:COMUNE_NASCITA">
      <xsl:variable name="var:New_Variable_1" select="XAD.7"/>
      <xsl:variable name="var:New_Variable_2" select="'L'"/>
      <xsl:variable name="var:ResultOfEquals_26823635"
                    select="$var:New_Variable_1 = $var:New_Variable_2"/>
      <xsl:variable name="var:copy_of_New_Variable_1" select="XAD.9/text()"/>
      <xsl:if test="$var:ResultOfEquals_26823635">
         <xsl:value-of select="$var:copy_of_New_Variable_1"/>
      </xsl:if>
   </xsl:template>
   <xsl:template match="PID.3[2]" mode="user:Expression2">
      <xsl:variable name="var:copy_of_New_Variable_1" select="CX.5"/>
      <xsl:variable name="var:New_Variable_3" select="'NNITA'"/>
      <xsl:variable name="var:ResultOfEquals_19302632"
                    select="$var:copy_of_New_Variable_1 = $var:New_Variable_3"/>
      <xsl:variable name="var:New_Variable_1" select="CX.1"/>
      <xsl:if test="$var:ResultOfEquals_19302632">
         <xsl:value-of select="$var:New_Variable_1"/>
      </xsl:if>
   </xsl:template>
   <xsl:template match="PID.11" mode="user:COMUNE_RESIDENZA">
      <xsl:variable name="var:New_Variable_1" select="XAD.7"/>
      <xsl:variable name="var:New_Variable_2" select="'N'"/>
      <xsl:variable name="var:ResultOfEquals_26823635"
                    select="$var:New_Variable_1 = $var:New_Variable_2"/>
      <xsl:variable name="var:copy_of_New_Variable_1" select="XAD.9/text()"/>
      <xsl:variable name="var:copy_of_copy_of_New_Variable_1" select="XAD.3"/>
      <xsl:if test="$var:ResultOfEquals_26823635">
         <INDIRIZZO>
            <xsl:value-of select="$var:copy_of_copy_of_New_Variable_1"/>
         </INDIRIZZO>
         <COMUNE>
            <xsl:value-of select="$var:copy_of_New_Variable_1"/>
         </COMUNE>
      </xsl:if>
   </xsl:template>
   <xsl:decimal-format decimal-separator="," grouping-separator="." name="euro"/>
   <xsl:output encoding="ISO-8859-15"
               indent="yes"
               media-type="text/xml"
               method="xml"/>
   <xsl:template match="/ADT_A05">
      <REQUEST>
         <METODO>AUTO</METODO>
         <MITTENTE>ADT</MITTENTE>
         <DATI_SENS>N</DATI_SENS>
         <PAZIENTE>
            <IDENTIFICATIVI_REMOTI>
               <ID>
                  <xsl:attribute name="position">1</xsl:attribute>
                  <xsl:attribute name="search_order">1</xsl:attribute>
                  <xsl:attribute name="update">true</xsl:attribute>*HL7000000099182</ID>
            </IDENTIFICATIVI_REMOTI>
            <ID_RIS/>
            <ID_PAZ_DICOM/>
            <COGNOME>
               <xsl:value-of select="/ADT_A05/PID/PID.5/XPN.1/FN.1/text()"/>
            </COGNOME>
            <NOME>
               <xsl:value-of select="/ADT_A05/PID/PID.5/XPN.2/text()"/>
            </NOME>
            <SESSO>
               <xsl:value-of select="/ADT_A05/PID/PID.8/text()"/>
            </SESSO>
            <DATA_NASCITA>
               <xsl:value-of select="/ADT_A05/PID/PID.7/TS.1/text()"/>
            </DATA_NASCITA>
            <COMUNE_NASCITA>
               <xsl:apply-templates mode="user:COMUNE_NASCITA" select="/ADT_A05/PID/PID.11"/>
            </COMUNE_NASCITA>
            <CODICE_FISCALE>
               <xsl:apply-templates mode="user:Expression2" select="/ADT_A05/PID/PID.3[2]"/>
            </CODICE_FISCALE>
            <RESIDENZA>
               <xsl:apply-templates mode="user:COMUNE_RESIDENZA" select="/ADT_A05/PID/PID.11"/>
            </RESIDENZA>
            <DOMICILIO/>
            <TESSERA_SANITARIA>
               <NUMERO/>
               <CODICE_REGIONE/>
               <SCADENZA/>
            </TESSERA_SANITARIA>
            <CODICE_REGIONALE/>
            <CUSL/>
            <CODICE_REGIONALE_DOM/>
            <CUSL_DOM/>
            <MEDICO_BASE/>
            <ANAMNESI/>
            <DATA_MORTE/>
            <CONSENSO/>
            <NAZIONE>773</NAZIONE>
            <CELLULARE/>
            <EMAIL/>
            <PESO/>
            <ALTEZZA/>
            <NOTE/>
         </PAZIENTE>
      </REQUEST>
   </xsl:template>
</xsl:stylesheet>
