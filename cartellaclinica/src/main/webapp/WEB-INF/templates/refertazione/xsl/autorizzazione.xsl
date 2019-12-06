<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="SezioneLabel"/>
    <xsl:param name="NameObjectXml"/>
    <xsl:template match="/">
       	<fieldset class="fieldsetDurata">
			<xsl:attribute name="name">
				<xsl:value-of select="$NameObjectXml"/>
			</xsl:attribute>
			<LEGEND>Esito</LEGEND>
			<div id="autorizzazione" class="divDurataTrattamento" rows="0">
			<xsl:attribute name="SezioneLabel">
			<xsl:value-of select="$SezioneLabel"/>
			</xsl:attribute>	
            <xsl:for-each select="PAGINA/CAMPI/CAMPO">			
                    <xsl:if test="@TYPE='input' and @TYPEINPUT='radio'">
                        <xsl:for-each select="OPTIONVAL">
                            <input>
                                <xsl:attribute name="name">
                                    <xsl:value-of select="../@KEY_CAMPO" />
                                </xsl:attribute>
                                <xsl:attribute name="type">
                                    <xsl:value-of select="../@TYPEINPUT" />
                                </xsl:attribute>
                                <xsl:attribute name="value">
                                    <xsl:value-of select="@VALUE" />
                                </xsl:attribute>
                                <xsl:if test="@CHECKED='true'">
                                    <xsl:attribute name="checked">true</xsl:attribute>
                                </xsl:if>
                                <xsl:attribute name="text">
                                    <xsl:value-of select="@TEXT" />
                                </xsl:attribute>
                                <xsl:value-of select="@TEXT"/> 
                            </input>
                        </xsl:for-each>
                    </xsl:if>
            </xsl:for-each>
        </div>
	 </fieldset>
    </xsl:template>
</xsl:stylesheet>
