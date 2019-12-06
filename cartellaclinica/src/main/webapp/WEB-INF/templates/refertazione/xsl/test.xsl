<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<fieldset class="fieldsetDurata" name="divRefLetObject">
		<LEGEND>TEST </LEGEND>
			<div id="test" class="divDurataTrattamento" rows="0"
				sezioneLabel="Refertazione Consulenze Logopedica">
			<xsl:for-each select="PAGINA/CAMPI/CAMPO">
				<xsl:if test="@TYPE='input' and @TYPEINPUT='text'">
					<input>
						<xsl:attribute name="id">
							<xsl:value-of select="@KEY_CAMPO" />
						</xsl:attribute>
						<xsl:attribute name="type">
							<xsl:value-of select="@TYPEINPUT" />
						</xsl:attribute>
						<xsl:attribute name="value">
							<xsl:value-of select="." />
						</xsl:attribute>
					</input>
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
					</input>
				</xsl:if>
				
				<xsl:if test="@TYPE='input' and @TYPEINPUT='radio'">
					<xsl:for-each select="optionVal">
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
						</input>
					</xsl:for-each>
				</xsl:if>
				
				<xsl:if test="@TYPE='select'">
					<select>
						<xsl:attribute name="id">
							<xsl:value-of select="@KEY_CAMPO" />
						</xsl:attribute>
						<xsl:for-each select="optionVal">
							<option>
								<xsl:attribute name="value">
									<xsl:value-of select="@VALUE" />
								</xsl:attribute>
								<xsl:if test="@SELECTED='true'">
									<xsl:attribute name="selected">true</xsl:attribute>
								</xsl:if>
								<xsl:value-of select="." />							
							</option>
						</xsl:for-each>			
					</select>
				</xsl:if>
				</xsl:for-each>
			</div>
		</fieldset>	
	</xsl:template>
</xsl:stylesheet>
