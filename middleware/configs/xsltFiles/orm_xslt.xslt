<?xml version="1.0" encoding="ISO-8859-15"?>
<!--Generated using XML ELCOMapper--><!--elco@elco.it--><!--24/09/2012 15:21:13--><xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:var="urn:var"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:user="urn:user"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                exclude-result-prefixes="user xs fn xsi var"
                version="2.0">
   <xsl:decimal-format decimal-separator="," grouping-separator="." name="euro"/>
   <xsl:output encoding="ISO-8859-15"
               indent="yes"
               media-type="text/xml"
               method="xml"
               standalone="no"/>
   <xsl:template match="/ESAMI">
      <ORM_O01>
         <MSH>
            <MSH.1>|</MSH.1>
            <MSH.2>^~\&amp;</MSH.2>
            <MSH.3>
               <HD.1>SmartjLink</HD.1>
            </MSH.3>
            <MSH.4>
               <HD.1>POLARIS</HD.1>
            </MSH.4>
            <MSH.5>
               <HD.1>PACS</HD.1>
            </MSH.5>
            <MSH.6>
               <HD.1>PACS</HD.1>
            </MSH.6>
            <MSH.7>
               <TS.1>
                  <xsl:value-of select="/ESAMI/ESAMI_RESULT/MSH_7/text()"/>
               </TS.1>
            </MSH.7>
            <MSH.9>
               <MSG.1>ORM</MSG.1>
               <MSG.2>O01</MSG.2>
            </MSH.9>
            <MSH.10>
               <xsl:value-of select="/ESAMI/ESAMI_RESULT/MSH_10/text()"/>
            </MSH.10>
            <MSH.11>
               <PT.1>P</PT.1>
            </MSH.11>
            <MSH.12>
               <VID.1>2.3.1</VID.1>
            </MSH.12>
            <MSH.18>8859/1</MSH.18>
         </MSH>
         <ORM_O01.PIDPD1NTEPV1PV2IN1IN2IN3GT1AL1>
            <PID>
               <PID.3>
                  <CX.1>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_ID_PAZ_DICOM/text()"/>
                  </CX.1>
               </PID.3>
               <PID.5>
                  <XPN.1>
                     <FN.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_COGNOME/text()"/>
                     </FN.1>
                  </XPN.1>
                  <XPN.2>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_NOME/text()"/>
                  </XPN.2>
               </PID.5>
               <PID.7>
                  <TS.1>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_DATA_NASCITA/text()"/>
                  </TS.1>
               </PID.7>
               <PID.8>
                  <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_SESSO/text()"/>
               </PID.8>
               <PID.11>
                  <XAD.1>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_RES_INDIR/text()"/>
                  </XAD.1>
                  <XAD.3>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/DESCR_COMUNE_RES/text()"/>
                  </XAD.3>
                  <XAD.4>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_RES_PROV/text()"/>
                  </XAD.4>
                  <XAD.5>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_RES_CAP/text()"/>
                  </XAD.5>
                  <XAD.7>H</XAD.7>
               </PID.11>
               <PID.13>
                  <XTN.1>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_TEL/text()"/>
                  </XTN.1>
               </PID.13>
               <PID.18>
                  <CX.1>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ANAG_COD_FISC/text()"/>
                  </CX.1>
               </PID.18>
               <PID.23>
                  <xsl:value-of select="/ESAMI/ESAMI_RESULT/DESCR_COMUNE_NASC/text()"/>
               </PID.23>
            </PID>
            <ORM_O01.PV1PV2>
               <PV1>
                  <PV1.2>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/PV1_3_1/text()"/>
                  </PV1.2>
                  <PV1.3>
                     <PL.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/PV1_2/text()"/>
                     </PL.1>
                  </PV1.3>
                  <PV1.7>
                     <XCN.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDI_COD/text()"/>
                     </XCN.1>
                     <XCN.2>
                        <FN.1>
                           <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDI_COGNOME/text()"/>
                        </FN.1>
                     </XCN.2>
                     <XCN.3>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDI_NOME/text()"/>
                     </XCN.3>
                  </PV1.7>
                  <PV1.8>
                     <XCN.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDP_COD/text()"/>
                     </XCN.1>
                     <XCN.2>
                        <FN.1>
                           <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDP_COGNOME/text()"/>
                        </FN.1>
                     </XCN.2>
                     <XCN.3>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDP_NOME/text()"/>
                     </XCN.3>
                  </PV1.8>
                  <PV1.9>
                     <XCN.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDR_COD/text()"/>
                     </XCN.1>
                     <XCN.2>
                        <FN.1>
                           <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDR_COGNOME/text()"/>
                        </FN.1>
                     </XCN.2>
                     <XCN.3>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDR_NOME/text()"/>
                     </XCN.3>
                  </PV1.9>
                  <PV1.19>
                     <CX.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/PV1_19/text()"/>
                     </CX.1>
                  </PV1.19>
                  <PV1.44>
                     <TS.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/DAT_ACC/text()"/>
                     </TS.1>
                  </PV1.44>
                  <PV1.45>
                     <TS.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/DAT_ESA/text()"/>
                     </TS.1>
                  </PV1.45>
                  <PV1.51>V</PV1.51>
               </PV1>
            </ORM_O01.PV1PV2>
         </ORM_O01.PIDPD1NTEPV1PV2IN1IN2IN3GT1AL1>
         <ORM_O01.ORCOBRRQDRQ1ODSODTRXONTEDG1RXRRXCNTEOBXNTECTIBLG>
            <ORC>
               <ORC.1>NW</ORC.1>
               <ORC.3>
                  <EI.1>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ESAMI_ID_ESAME_DICOM/text()"/>
                  </EI.1>
               </ORC.3>
               <ORC.5>SC</ORC.5>
               <ORC.7>
                  <TQ.1>
                     <CQ.1>1</CQ.1>
                  </TQ.1>
                  <TQ.4>
                     <TS.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/DATA_ORA_ESA/text()"/>
                     </TS.1>
                  </TQ.4>
                  <TQ.6>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/URGENZA/text()"/>
                  </TQ.6>
               </ORC.7>
               <ORC.11>
                  <XCN.1>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/SOTTO_INDAGINE/text()"/>
                  </XCN.1>
               </ORC.11>
               <ORC.15>
                  <TS.1>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/DATA_ORA_ESA/text()"/>
                  </TS.1>
               </ORC.15>
            </ORC>
            <ORM_O01.OBRRQDRQ1ODSODTRXONTEDG1RXRRXCNTEOBXNTE>
               <OBR>
                  <OBR.3>
                     <EI.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/ESAMI_ID_ESAME_DICOM/text()"/>
                     </EI.1>
                  </OBR.3>
                  <OBR.4>
                     <CE.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/ESA_COD_ESA/text()"/>
                     </CE.1>
                     <CE.2>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/ESA_DESCR/text()"/>
                     </CE.2>
                     <CE.4>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/PV1_3_1/text()"/>
                     </CE.4>
                  </OBR.4>
                  <OBR.13>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/ESAMI_REPARTO/text()"/>
                  </OBR.13>
                  <OBR.16>
                     <XCN.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDP_COD/text()"/>
                     </XCN.1>
                     <XCN.2>
                        <FN.1>
                           <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDP_COGNOME/text()"/>
                        </FN.1>
                     </XCN.2>
                     <XCN.3>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDP_NOME/text()"/>
                     </XCN.3>
                  </OBR.16>
                  <OBR.24>
                     <xsl:value-of select="/ESAMI/ESAMI_RESULT/TAB_SAL_DESCR/text()"/>
                  </OBR.24>
                  <OBR.27>
                     <TQ.1>
                        <CQ.1>1</CQ.1>
                     </TQ.1>
                     <TQ.4>
                        <TS.1>
                           <xsl:value-of select="/ESAMI/ESAMI_RESULT/DATA_ORA_ESA/text()"/>
                        </TS.1>
                     </TQ.4>
                     <TQ.6>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/URGENZA/text()"/>
                     </TQ.6>
                  </OBR.27>
                  <OBR.31>
                     <CE.2>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/ESAMI_QUESITO/text()"/>
                     </CE.2>
                  </OBR.31>
                  <OBR.32>
                     <NDL.1>
                        <CN.1>
                           <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDR_COD/text()"/>
                        </CN.1>
                     </NDL.1>
                     <NDL.2>
                        <TS.1>
                           <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDR_COGNOME/text()"/>
                        </TS.1>
                     </NDL.2>
                     <NDL.3>
                        <TS.1>
                           <xsl:value-of select="/ESAMI/ESAMI_RESULT/MEDR_NOME/text()"/>
                        </TS.1>
                     </NDL.3>
                  </OBR.32>
                  <OBR.36>
                     <TS.1>
                        <xsl:value-of select="/ESAMI/ESAMI_RESULT/DATA_ORA_ESA/text()"/>
                     </TS.1>
                  </OBR.36>
               </OBR>
            </ORM_O01.OBRRQDRQ1ODSODTRXONTEDG1RXRRXCNTEOBXNTE>
         </ORM_O01.ORCOBRRQDRQ1ODSODTRXONTEDG1RXRRXCNTEOBXNTECTIBLG>
      </ORM_O01>
   </xsl:template>
</xsl:stylesheet>
