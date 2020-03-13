$(document).ready(function ()
{
    POOL.init();
    POOL.setEvents();
});

var POOL =
{
    init: function()
    {},

    setEvents: function()
    {
        $('#tabPool-butAggiorna').on('click', POOL.aggiorna);
        $('#tabPool-butPurge').on('click', POOL.purge);

        $('div.divtab').each(function()
                            {
                                var id_pool = $(this).data('id-pool');

                                $('#li-tab' + id_pool).on("click", function(){POOL.do(id_pool)});
                            });

        POOL.do($('div.divtab').first().data('id-pool'));
    },

    do: function(id_pool)
    {
    	$('div.divtab').hide();
    	$('.ulTabs li').removeClass("tabActive");
    	$('#li-tab' + id_pool).addClass("tabActive");
    	$('#tab' + id_pool).show();
        $('#i' + id_pool).width($(".contentTabs",".tabs").width()).height(LIB.getHeight() - 45);
        $('#i' + id_pool).attr('src', 'PoolStatistic.jsp?ID_POOL=' + id_pool);
    },

    aggiorna: function()
    {
        var attivo = $('li.tabActive', '#tabPool');

        attivo.trigger('click');
    },

    purge: function()
    {
        MANAGER.purgesingle($('li.tabActive', '#tabPool').html(), POOL.aggiorna);
    }
}
