<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="SezioneLabel"/>
    <xsl:param name="ordinamento"/>
    <xsl:param name="NameObjectXml"/>
    <xsl:template match="/">
        <div rows="0">
            <xsl:attribute name="class">
                <xsl:value-of select="$NameObjectXml" />
            </xsl:attribute>
            <xsl:attribute name="SezioneLabel">
				<xsl:value-of select="$SezioneLabel"/>
			</xsl:attribute> 
            <xsl:attribute name="ordinamento">
				<xsl:value-of select="$ordinamento"/>
			</xsl:attribute> 
            <xsl:for-each select="PAGINA/CAMPI/CAMPO">			
                <div class="anestesiologicoASA">
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
                    <xsl:if test="@TYPE='input' and @TYPEINPUT='radio'">
                        <xsl:for-each select="OPTIONVAL">
                            <input>
                                <xsl:attribute name="id">
                                    <xsl:value-of select="../@KEY_CAMPO" />
                                </xsl:attribute>
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
                    <xsl:if test="@TYPE='input' and @TYPEINPUT='checkbox'">
                        <input>
                            <xsl:attribute name="id">
                                <xsl:value-of select="@KEY_CAMPO" />
                            </xsl:attribute>
                            <xsl:attribute name="type">
                                <xsl:value-of select="@TYPEINPUT" />
                            </xsl:attribute>
                            <xsl:if test=". = 'S' and @TYPEINPUT='checkbox'">
                                <xsl:attribute name="checked">true</xsl:attribute>
                            </xsl:if>
                            <xsl:attribute name="text">
                                <xsl:value-of select="@TEXT" />
                            </xsl:attribute>
                            <xsl:value-of select="@TEXT"/> 
                        </input>
                    </xsl:if>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>
