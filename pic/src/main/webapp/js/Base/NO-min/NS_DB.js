/*
    File: NS_DB.js
    Autore: jack
*/

$.NS_DB =
{
    /* Configurazioni default */
    setup_ajax:
    {
        url: 'pageDB?t=' + new Date().getTime(),
        send_data_form: true,
        timeout: 60000,
        async: true,
        type: 'POST',
        data: null,
        cache: false,
        dataType: 'json',
        jsonp: false
    },

    setup_default:
    {
        datasource: '',
        type_invoke: '',
        type_result: 'V',
        order: '',
        attributes: {v: '', t: 'V', d: 'I'}
    },

    select: function(params)
    {
        return this.check_and_call('SELECT', params);
    },

    call_procedure: function(params)
    {
        return this.check_and_call('PROCEDURE', params);
    },

    call_function: function(params)
    {
        return this.check_and_call('FUNCTION', params);
    },

    call_block_anonymous: function(params)
    {
        return this.check_and_call('BLOCK_ANONYMOUS', params);
    },

    getTool: function(cfg)
    {
        if (typeof cfg == 'undefined') cfg = {};

        LIB.checkParameter(cfg,'_logger',false);

        var _logger = cfg._logger;
        var _tool   = {};

        var _prepared_parameter = function (params)
        {
            var par = {};
            var url = '';

            $.each(params.parameter, function(id, value)
            {
                var data = $.extend({}, params.setup_default.attributes, (typeof value == 'string' ? {v: value} : value));

                if(data.t != 'A')
                    par['P' + data.d.toUpperCase() + '_' + data.t.toUpperCase() + '_' + id] = data.v;
                else
                {
                    var tmp = {};
                    tmp['P' + data.d.toUpperCase() + '_A_' + id] = data.v;

                    url += '&' + decodeURIComponent($.param(tmp, true));
                }
            });

            par[params.type_invoke] = params.id;

            if(params.type_result != '')
                par['FUNCTION_TYPE_RESULT'] = params.type_result;

            if(params.datasource != '')
                par['DATASOURCE'] = params.datasource;
            
            if(params.order != '')
            	par['ORDER'] = params.order;

            return {parameter: par, url_extra: url};
        };

        this.check_and_call = function(id, parameter)
        {
            var param = {};
            var xhr = {};

            if(LIB.isValid(parameter.id) && parameter.id != '')
            {
                $.extend(true, param, this);
                $.extend(true, param, this.setup_default);

                if(LIB.isValid(parameter.success))
                {
                    param.setup_ajax.success = parameter.success;
                    delete parameter.success;
                }

                if(LIB.isValid(parameter.error))
                {
                    param.setup_ajax.error = parameter.error;
                    delete parameter.error;
                }

                $.extend(true, param, parameter, {type_invoke: id});
                $.extend(true, param.setup_ajax, {_logger: _logger});

                if(id != 'FUNCTION')
                    param.type_result = '';

                var chk_par = _prepared_parameter(param);

                $.extend(true, param.setup_ajax, {data: chk_par.parameter});

                param.setup_ajax.url += chk_par.url_extra;

                /* Chiamata ajax */
                xhr = $.ajax(param.setup_ajax);

                xhr.done(function (data, textStatus, jqXHR)
                {
                });
                xhr.fail(function (jqXHR, textStatus, errorThrown) {
                    if (this._logger) {
                        this._logger.info("xhr.fail - jqXHR: " + JSON.stringify(jqXHR) + " - errorThrown:" + errorThrown);
                        if (textStatus === 'abort') {
                            this._logger.warn("AJAX request aborted");
                        }
                        else if (textStatus === 'timeout') {
                            this._logger.warn("AJAX request timeout");
                        } else{
                            this._logger.error("AJAX request error");
                            NOTIFICA.error(
                                {
                                    message: "Errore comunicazione db: " + jqXHR.responseText + " - " + textStatus,
                                    title: "Error",
                                    timeout: 5,
                                    width: 300
                                });
                        }
                    }
                });
                xhr.always(function (jqXHR, textStatus)
                {
                });
            }

            return xhr;
        };

        if(LIB.isValid(cfg))
            cfg = $.extend(true, $.NS_DB, cfg);
        else
            cfg = $.extend({}, $.NS_DB);

        $.extend(true, _tool, {_logger: _logger}, cfg);
        delete _tool.getTool;

        return _tool;
    }
};