(function ($) {
    $.fn.numericInput = function (options) {
        var numericInput = [];
        for (var i = 0; i < this.length; i++) {

            if (typeof($(this.get(i)).data('numericInput')) != 'undefined') {
                numericInput.push($(this.get(i)).data('numericInput'));
            } else {
                numericInput.push(new NumericInput(this.get(i), options));
                $(this.get(i)).data('numericInput', numericInput);
            }
        }
        return numericInput;

    };

    function NumericInput(obj, options) {
        this.obj = $(obj);
        //this.isNumber = new RegExp("[0-9]");
        this.isNumber = new RegExp(/^\d+$/);
        this.el = {
            input: null,
            plus: null,
            minus: null
        }
        this.options = {
            minVal: 0,
            maxVal: 10,
            step: 1,
            beforeChange: null,
            afterChange: null
        };
        this.extendOptions(options);
        this.initialize();
        this.setEvents();

        return this;
    }

    NumericInput.prototype =
    {
        initialize: function () {
            this.el.input = this.obj.find("input:text");
            this.el.minus = this.obj.find("i.icon-minus");
            this.el.plus = this.obj.find("i.icon-plus");
            if (this.el.input.val() == ""){
                this.setValue(this.options.minVal);
            }
        },
        setEvents: function () {
            var $this = this;
            this.el.input.on("click", function (e) {
                e.preventDefault;
                e.stopPropagation();
            })
            this.el.input.on("keydown", function (e) {
                if (e.which == 38)$this.increment();
                if (e.which == 40)$this.decrement();
            })
            this.el.input.on("change", function (e) {
                $this.checkNumeric(this.value)
            })
            this.el.minus.on("click", function (e) {
                e.preventDefault;
                e.stopPropagation();
                $this.decrement();
            })
            this.el.plus.on("click", function (e) {
                e.preventDefault;
                e.stopPropagation();
                $this.increment();
            })
        },
        extendOptions: function (options) {
            $.extend(this.options, options);
        },
        getValue: function () {
            return parseInt(this.el.input.val());

        },
        setValue: function (val) {
            if (!this.beforeChange())return false;
            if (this.checkNumeric(val) && (this.options.minVal < parseInt(val) < this.options.maxVal)) {
                this.el.input.val(val);
                this.afterChange();
            }

        },
        increment: function () {
            if (this.getValue() + this.options.step > this.options.maxVal)return false;
            this.setValue(this.getValue() + this.options.step);

        },
        decrement: function () {
            if (this.getValue() - this.options.step < this.options.minVal)return false;
            this.setValue(this.getValue() - this.options.step);

        },
        checkNumeric: function (val) {
            if (!this.isNumber.test(val) || (this.options.minVal > parseInt(val, 10)) || (parseInt(val, 10) > this.options.maxVal)) {
                if (this.options.minVal > parseInt(val, 10)) {
                    this.el.input.val(this.options.minVal);
                }
                else if (parseInt(val, 10) > this.options.maxVal) {
                    this.el.input.val(this.options.maxVal);
                } else {
                    this.el.input.val(this.options.minVal);
                }

                return false;
            }
            return true;
        },
        beforeChange: function () {
            var $this = this;
            if ($.isFunction(this.options.beforeChange)){
                return this.options.beforeChange(this.el.input);
            }
            return true;
        },
        afterChange: function () {
            var $this = this;
            if ($.isFunction(this.options.afterChange)){
                this.options.afterChange(this.el.input);
            }
        },
        getObject: function () {
            return this.obj;
        }


    };
})(jQuery);