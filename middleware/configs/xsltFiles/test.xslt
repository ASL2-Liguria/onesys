<?xml version="1.0" encoding="ISO-8859-15"?>
<!--Generated using XML ELCOMapper--><!--elco@elco.it--><!--19/09/2012 11:24:18--><xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:var="urn:var"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:user="urn:user"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                exclude-result-prefixes="user xs fn xsi var"
                version="2.0">
   <xsl:variable name="var:copy_of_New_Variable_5" select="'T02'"/>
   <xsl:variable name="var:copy_of_copy_of_New_Variable_5" select="'T10'"/>
   <xsl:variable name="var:ResultOfNormalizeSpace_12698664"
                 select="normalize-space(/RESULT/REPORT_RESULT/REFERTO_ID_DOC_PADRE/text())"/>
   <xsl:variable name="var:ResultOfIsEmpty_11305824"
                 select="$var:ResultOfNormalizeSpace_12698664 = ''"/>
   <xsl:variable name="var:ResultOfUniqueID_22073172"
                 select="format-dateTime(current-dateTime(), &#34;[Y0001][M01][D01][H01][m01][s01][f001]&#34;)"/>
   <xsl:decimal-format decimal-separator="," grouping-separator="." name="euro"/>
   <xsl:output encoding="ISO-8859-15"
               indent="yes"
               media-type="text/xml"
               method="xml"/>
   <xsl:template match="/RESULT">
      <MDM_T02>
         <MSH>
            <MSH.1>|</MSH.1>
            <MSH.2>^~\&amp;</MSH.2>
            <MSH.3>
               <HD.1>
                  <xsl:variable name="var:MSH.3_SendingFacility" select="'ELCO'"/>
                  <xsl:value-of select="$var:MSH.3_SendingFacility"/>
               </HD.1>
            </MSH.3>
            <MSH.4>
               <HD.1>
                  <xsl:variable name="var:MSH.4_SendinApplication" select="'TEST'"/>
                  <xsl:value-of select="$var:MSH.4_SendinApplication"/>
               </HD.1>
            </MSH.4>
            <MSH.5>
               <HD.1>
                  <xsl:variable name="var:MSH.5_ReceivingFacility" select="'OUT'"/>
                  <xsl:value-of select="$var:MSH.5_ReceivingFacility"/>
               </HD.1>
            </MSH.5>
            <MSH.6>
               <HD.1>
                  <xsl:variable name="var:MSH.6_ReceivingApplication" select="'WORLD'"/>
                  <xsl:value-of select="$var:MSH.6_ReceivingApplication"/>
               </HD.1>
            </MSH.6>
            <MSH.7>
               <TS.1>
                  <xsl:value-of select="$var:ResultOfUniqueID_22073172"/>
               </TS.1>
            </MSH.7>
            <MSH.9>
               <MSG.1>
                  <xsl:variable name="var:New_Variable_5" select="'MDM'"/>
                  <xsl:value-of select="$var:New_Variable_5"/>
               </MSG.1>
               <MSG.2>
                  <xsl:choose>
                     <xsl:when test="$var:ResultOfIsEmpty_11305824">
                        <xsl:value-of select="$var:copy_of_New_Variable_5"/>
                     </xsl:when>
                     <xsl:otherwise>
                        <xsl:value-of select="$var:copy_of_copy_of_New_Variable_5"/>
                     </xsl:otherwise>
                  </xsl:choose>
               </MSG.2>
            </MSH.9>
            <MSH.10>
               <xsl:value-of select="$var:ResultOfUniqueID_22073172"/>
            </MSH.10>
            <MSH.11>
               <PT.1>P</PT.1>
               <PT.2>not present</PT.2>
            </MSH.11>
            <MSH.12>
               <VID.1>2.5</VID.1>
            </MSH.12>
         </MSH>
         <EVN>
            <EVN.1>
               <xsl:choose>
                  <xsl:when test="$var:ResultOfIsEmpty_11305824">
                     <xsl:value-of select="$var:copy_of_New_Variable_5"/>
                  </xsl:when>
                  <xsl:otherwise>
                     <xsl:value-of select="$var:copy_of_copy_of_New_Variable_5"/>
                  </xsl:otherwise>
               </xsl:choose>
            </EVN.1>
            <EVN.2>
               <TS.1>
                  <xsl:value-of select="$var:ResultOfUniqueID_22073172"/>
               </TS.1>
            </EVN.2>
         </EVN>
         <PID>
            <PID.3>
               <CX.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_PL/text()"/>
               </CX.1>
               <CX.4>
                  <HD.1>POLARIS</HD.1>
               </CX.4>
            </PID.3>
            <PID.3>
               <CX.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_COD_FISC/text()"/>
               </CX.1>
               <CX.4>
                  <HD.1>CF</HD.1>
               </CX.4>
            </PID.3>
            <PID.3>
               <CX.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_PATIENT_ID/text()"/>
               </CX.1>
               <CX.4>
                  <HD.1>
                     <xsl:variable name="var:New_Variable_8" select="'PACS'"/>
                     <xsl:value-of select="$var:New_Variable_8"/>
                  </HD.1>
               </CX.4>
            </PID.3>
            <PID.5>
               <XPN.1>
                  <FN.1>
                     <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_COGNOME/text()"/>
                  </FN.1>
               </XPN.1>
               <XPN.2>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_NOME/text()"/>
               </XPN.2>
            </PID.5>
            <PID.7>
               <TS.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_DATA_NASCITA/text()"/>
               </TS.1>
            </PID.7>
            <PID.8>
               <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_SESSO/text()"/>
            </PID.8>
            <PID.11>
               <XAD.1>
                  <SAD.1>
                     <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_RES_INDIR/text()"/>
                  </SAD.1>
               </XAD.1>
               <XAD.3>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_RES_COM/text()"/>
               </XAD.3>
               <XAD.5>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_RES_CAP/text()"/>
               </XAD.5>
            </PID.11>
            <PID.18>
               <CX.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_COD_FISC/text()"/>
               </CX.1>
            </PID.18>
            <PID.23>
               <xsl:value-of select="/RESULT/REPORT_RESULT/PAZ_NASC_COM/text()"/>
            </PID.23>
         </PID>
         <PV1>
            <PV1.2>
               <xsl:value-of select="/RESULT/REPORT_RESULT/ESAMI/ESAMI_ROW/ESAME_PATIENT_CLASS/text()"/>
            </PV1.2>
            <PV1.19>
               <CX.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/ESAMI/ESAMI_ROW/ESAME_VISIT_NUMBER/text()"/>
               </CX.1>
               <CX.4>
                  <HD.1>POLARIS</HD.1>
               </CX.4>
            </PV1.19>
         </PV1>
         <xsl:for-each select="/RESULT/REPORT_RESULT/ESAMI/ESAMI_ROW">
            <MDM_T02.COMMON_ORDER>
               <ORC>
                  <ORC.3>
                     <EI.1>
                        <xsl:value-of select="ESAME_ID/text()"/>
                     </EI.1>
                  </ORC.3>
                  <ORC.4>
                     <EI.1>
                        <xsl:value-of select="ESAME_NUM_PRE/text()"/>
                     </EI.1>
                  </ORC.4>
               </ORC>
               <OBR>
                  <OBR.4>
                     <CE.1>
                        <xsl:value-of select="COD_PRESTAZIONE/text()"/>
                     </CE.1>
                     <CE.2>
                        <xsl:value-of select="DESCR_PRESTAZIONE/text()"/>
                     </CE.2>
                  </OBR.4>
               </OBR>
            </MDM_T02.COMMON_ORDER>
         </xsl:for-each>
         <TXA>
            <TXA.2>
               <xsl:variable name="var:New_Variable_9" select="'REFERTO_TEST'"/>
               <xsl:value-of select="$var:New_Variable_9"/>
            </TXA.2>
            <TXA.3>PDF</TXA.3>
            <TXA.4>
               <TS.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/REFERTO_DATA/text()"/>
               </TS.1>
            </TXA.4>
            <TXA.6>
               <TS.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/REFERTO_DATA/text()"/>
               </TS.1>
            </TXA.6>
            <TXA.9>
               <XCN.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/MEDR_COD_DEC/text()"/>
               </XCN.1>
               <XCN.2>
                  <FN.1>
                     <xsl:value-of select="/RESULT/REPORT_RESULT/MEDR_COGNOME/text()"/>
                  </FN.1>
               </XCN.2>
               <XCN.3>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/MEDR_NOME/text()"/>
               </XCN.3>
               <XCN.9>
                  <HD.1>CF</HD.1>
               </XCN.9>
            </TXA.9>
            <TXA.12>
               <EI.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/REFERTO_ID_DOC/text()"/>
               </EI.1>
            </TXA.12>
            <TXA.13>
               <EI.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/REFERTO_ID_DOC_PADRE/text()"/>
               </EI.1>
            </TXA.13>
            <TXA.14>
               <xsl:value-of select="/RESULT/REPORT_RESULT/ESAMI/ESAMI_ROW/ESAME_NUM_PRE"/>
               <EI.1/>
            </TXA.14>
            <TXA.15>
               <EI.1>C3072</EI.1>
            </TXA.15>
            <TXA.17>AU</TXA.17>
            <TXA.19>AV</TXA.19>
            <TXA.22>
               <PPN.1>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/MEDR_COD_DEC/text()"/>
               </PPN.1>
               <PPN.2>
                  <FN.1>
                     <xsl:value-of select="/RESULT/REPORT_RESULT/MEDR_COGNOME/text()"/>
                  </FN.1>
               </PPN.2>
               <PPN.3>
                  <xsl:value-of select="/RESULT/REPORT_RESULT/MEDR_NOME/text()"/>
               </PPN.3>
               <PPN.9>
                  <HD.1>CF</HD.1>
               </PPN.9>
               <PPN.15>
                  <TS.1>
                     <xsl:value-of select="/RESULT/REPORT_RESULT/REFERTO_DATA/text()"/>
                  </TS.1>
               </PPN.15>
            </TXA.22>
         </TXA>
         <MDM_T02.OBXNTE>
            <OBX>
               <OBX.2>ED</OBX.2>
               <OBX.3>
                  <CE.1>DOCUMENTO</CE.1>
               </OBX.3>
               <OBX.5>
                  <ED.2>multipart</ED.2>
                  <ED.3>Octet-stream</ED.3>
                  <ED.4>Base64</ED.4>
                  <ED.5>
                     <xsl:value-of select="/RESULT/REPORT_RESULT/REFERTO_PDF/text()"/>
                  </ED.5>
               </OBX.5>
            </OBX>
         </MDM_T02.OBXNTE>
      </MDM_T02>
   </xsl:template>
</xsl:stylesheet>
