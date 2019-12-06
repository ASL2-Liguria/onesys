/**
 * User: matteopi
 * Date: 08/08/13
 * Time: 15.56
 */

function caricaWkFarmaci(){
    var url = 'servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_FARMACI_DISPONIBILI&ILLUMINA=javascript:illuminaSelDesel(this.sectionRowIndex);&WHERE_WK= where iden_magazzino=' + $('[name="cmbMagazzino"]').find('option:selected').val();
        $('#frameWk').attr('src',url);
}


