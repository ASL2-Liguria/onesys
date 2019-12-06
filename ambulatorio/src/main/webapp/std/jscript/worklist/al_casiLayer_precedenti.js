// JavaScript Document
document.write('	<DIV id="idFiltriCasi" class="classFiltriCasi">');
document.write('	 <SPAN class="spanCasiLabelRicerca" >Filtro attivo: <label id="lblTitleRicercaCasi"></label></SPAN>');
document.write('	 <DIV id="accordion" >');
document.write('		<h3><a href="#">Patologie</a></h3>');
document.write('		<DIV>');
document.write('			<table  border="0" cellspacing="1" cellpadding="1" width="100%"><tr>     <td><select size="7" class="cssSelect" multiple="multiple" formato="S" id ="IN_IDEN_PATOLOGIE" ondblclick="javascript:add_selected_elements(\'IN_IDEN_PATOLOGIE\', \'OUT_IDEN_PATOLOGIE\', true);" >        </select></td>      <td><SPAN class="pulsanteInclusione"><a href="javascript:add_selected_elements(\'IN_IDEN_PATOLOGIE\', \'OUT_IDEN_PATOLOGIE\', true);" >Includi&gt;&gt;</a></SPAN><BR/>        <SPAN  class="pulsanteInclusione"><a href="javascript:add_selected_elements(\'OUT_IDEN_PATOLOGIE\', \'IN_IDEN_PATOLOGIE\', true);" >&lt;&lt;Escludi</a></SPAN></td>      <td><select size="7" multiple="multiple" id="OUT_IDEN_PATOLOGIE" formato="S" ondblclick="javascript:add_selected_elements(\'OUT_IDEN_PATOLOGIE\', \'IN_IDEN_PATOLOGIE\', true);">        </select></td>    </tr>    </table>');
document.write('		</DIV>');
document.write('		<h3><a href="#">Tag</a></h3>');
document.write('		<DIV>');
document.write('			<table  border="0" cellspacing="1" cellpadding="1" width="100%"><tr>     <td><select size="7" multiple="multiple" formato="S" id ="IN_IDEN_TAG" ondblclick="javascript:add_selected_elements(\'IN_IDEN_TAG\', \'OUT_IDEN_TAG\', true);">        </select></td>      <td><SPAN class="pulsanteInclusione"><a href="javascript:add_selected_elements(\'IN_IDEN_TAG\', \'OUT_IDEN_TAG\', true);" >Includi&gt;&gt;</a></SPAN><BR/>        <SPAN  class="pulsanteInclusione"><a href="javascript:add_selected_elements(\'OUT_IDEN_TAG\', \'IN_IDEN_TAG\', true);" >&lt;&lt;Escludi</a></SPAN></td>      <td><select size="7" multiple="multiple" id="OUT_IDEN_TAG" formato="S" ondblclick="javascript:add_selected_elements(\'OUT_IDEN_TAG\', \'IN_IDEN_TAG\', true);" >        </select></td>    </tr>    </table>');
document.write('		</DIV>');

//document.write('			<span class="spanCasiTitle"><label for="casiTag">Parole chiave</label></span>');
document.write('		<h3><a href="#">Segnalati da:</a></h3>');
document.write('		<DIV>');
document.write('			<div id="radioUtente" style="width:100%;">');
document.write('				<input type="radio" id="radioUtente1" name="radioUtente" value="PERSONAL"/><label for="radioUtente1">Personali</label>');
document.write('				<input type="radio" id="radioUtente2" name="radioUtente" checked="checked" value="ALL"/><label for="radioUtente2">Tutti</label>');
document.write('			</div>');
document.write('		</DIV>');
document.write('	 </DIV>');
document.write('	<SPAN  class="pulsanteInclusione"><a href="javascript:ricercaCasi();" >Ricerca</a></SPAN>');
document.write('	</DIV>');

