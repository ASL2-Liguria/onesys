<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="SezioneLabel"/>
	<xsl:param name="NameObjectXml"/>
	<xsl:template match="/">
		<fieldset class="fieldsetDurata">
			<xsl:attribute name="name">
				<xsl:value-of select="$NameObjectXml"/>
			</xsl:attribute>
			<LEGEND>Durata Del Trattamento </LEGEND>
			<div id="durataTrattamento" class="divDurataTrattamento" rows="0">
			<xsl:attribute name="SezioneLabel">
				<xsl:value-of select="$SezioneLabel"/>
			</xsl:attribute>				
				<xsl:for-each select="PAGINA/CAMPI/CAMPO">
					<span>
						<xsl:choose>
							<xsl:when test="@KEY_CAMPO = 'inizioTrattamento'">
								<span>Dal </span>
							</xsl:when>
							<xsl:when test="@KEY_CAMPO = 'fineTrattamento'">
								<span>Al </span>
							</xsl:when>
							<xsl:when test="@KEY_CAMPO = 'finoFineRicovero'">
								<span>Fino a fine Ricovero </span>
							</xsl:when>
							<xsl:otherwise>
								<span>Fino a raggiungimento obiettivi </span>
							</xsl:otherwise>
						</xsl:choose>
					</span>
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
						<xsl:if test=". = 'S' and @TYPEINPUT='checkbox'">
							<xsl:attribute name="checked">true</xsl:attribute>
						</xsl:if>
					</input>
				</xsl:for-each>
			</div>
		</fieldset>
	</xsl:template>
</xsl:stylesheet>
