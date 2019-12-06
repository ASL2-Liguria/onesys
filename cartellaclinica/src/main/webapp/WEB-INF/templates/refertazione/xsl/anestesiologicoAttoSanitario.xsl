<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="SezioneLabel"/>
    <xsl:param name="NameObjectXml"/>
    <xsl:param name="ordinamento"/>
    <xsl:template match="/">
        <div rows="0" >
            <xsl:attribute name="class">
                <xsl:value-of select="$NameObjectXml" />
            </xsl:attribute>
            <xsl:attribute name="SezioneLabel">
				<xsl:value-of select="$SezioneLabel"/>
			</xsl:attribute> 
            <xsl:attribute name="ordinamento">
				<xsl:value-of select="$ordinamento" />
			</xsl:attribute>          
            <xsl:for-each select="PAGINA/CAMPI/CAMPO">
                <div class="anestesiologicoAttoSanitario">                          
                    <xsl:if test="@TYPE='label'">
                        <label>
                            <xsl:attribute name="class">
                                <xsl:value-of select="@CLASS" />
                            </xsl:attribute>
                            <xsl:attribute name="id">
                                <xsl:value-of select="@KEY_CAMPO" />
                            </xsl:attribute>
                            <xsl:value-of select="@TEXT"/>
                        </label>
                    </xsl:if>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>
