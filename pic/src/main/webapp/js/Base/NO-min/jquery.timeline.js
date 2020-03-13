(function ($) {
    function Timeline(element, options, onReady) {
        this.element = $(element),
            this.options = options,
            this.elements = new Object();

        this.init();
    }

    $.fn.Timeline = function (options, onReady) {
        var options;
        var plugin;
        var defaults =
        {
            'width': 'auto',
            'startDate': '',
            'endDate': '',
            'defaultSelected': {
                month: '',
                week: new Array(),
                day_name: new Array(),
                day: new Array()
            },
            'monthClick': function ($this) {
                return $this.attr('data-month');
            },
            'weekClick': function ($this) {
                return $this.attr('data-week');
            },
            'dayNameClick': function ($this) {
                return $this.attr('data-day-position');
            },
            'dayClick': function ($this) {
                return $this.attr('data-day');
            }
        };

        options = $.extend(defaults, options);
        plugin = new Timeline(this.get(0), options, onReady);
        plugin.element.data('Timeline', plugin);

        if (typeof onReady === 'function')  onReady.call({ obj: this });

        return plugin;
    };

    Timeline.prototype = {
        dateDiff: null,
        lastDaySelected: null,
        CTRLPressed: false,
        SHIFTPressed: false,

        classes: {
            timeline_buttons_container: 'timeline-buttons-container',
            timeline_data_container: 'timeline-data-container',
            month_buttons: 'month-buttons',
            week_buttons: 'week-buttons',
            day_name_buttons: 'day-name-buttons',
            day_buttons: 'day-buttons',
            month_container: 'month-container row',
            week_container: 'week-container row',
            day_name_container: 'day-name-container row',
            day_container: 'day-container row',
            left_arrow: 'icon-left-dir',
            right_arrow: 'icon-right-dir',
            month: 'month col',
            week: 'week col',
            day_name: 'day-name col',
            day: 'day col'
        },

        init: function () {


            this.dateDiff = moment(this.options.endDate, 'YYYYMMDD').diff(moment(this.options.startDate, 'YYYYMMDD'), 'days');
            this.createTimeline();
            this.select(this.options.defaultSelected);
            this.setEvents();
            this.resize();
        },

        createTimeline: function () {
            this.elements.timeline = $('<div>', { 'id': 'timeline' }).appendTo(this.element);
            this.createButtonsContainer();
            this.createDataContainer();
        },

        createButtonsContainer: function () {
            this.elements.timeline_buttons_container = $('<div>', { 'class': this.classes.timeline_buttons_container }).appendTo(this.elements.timeline);
            this.elements.month_buttons = $('<div>', { 'class': this.classes.month_buttons, 'text': 'Mese' }).appendTo(this.elements.timeline_buttons_container);
            this.elements.week_buttons = $('<div>', { 'class': this.classes.week_buttons, 'text': 'Settimana' }).appendTo(this.elements.timeline_buttons_container);
            this.elements.day_name_buttons = $('<div>', { 'class': this.classes.day_name_buttons }).appendTo(this.elements.timeline_buttons_container);
            this.elements.day_buttons = $('<div>', { 'class': this.classes.day_buttons, 'text': 'Giorno' }).appendTo(this.elements.timeline_buttons_container);
            this.populateMonthButtons();
            this.populateWeekButtons();
            this.populateDayButtons();
        },

        populateMonthButtons: function () {
            this.elements.previousMonth = $('<i>', { 'id': 'previousMonth', 'class': this.classes.left_arrow, 'title': traduzione.previousMonth }).appendTo(this.elements.month_buttons);
            this.elements.nextMonth = $('<i>', { 'id': 'nextMonth', 'class': this.classes.right_arrow, 'title': traduzione.nextMonth }).appendTo(this.elements.month_buttons);
        },

        populateWeekButtons: function () {
            this.elements.previousWeek = $('<i>', { 'id': 'previousWeek', 'class': this.classes.left_arrow, 'title': traduzione.previousWeek }).appendTo(this.elements.week_buttons);
            this.elements.nextWeek = $('<i>', { 'id': 'nextWeek', 'class': this.classes.right_arrow, 'title': traduzione.nextWeek }).appendTo(this.elements.week_buttons);
        },

        populateDayButtons: function () {
            var short_day_names = new Array('L', 'M', 'M', 'G', 'V', 'S', 'D');
            var day_names = new Array('Lunedi\'', 'Martedi\'', 'Mercoledi\'', 'Giovedi\'', 'Venerdi\'', 'Sabato', 'Domenica');

            for (var i = 0; i < short_day_names.length; i++)
                $('<div>', { 'title': day_names[i], 'text': short_day_names[i], 'data-day-positional': i + 1  }).appendTo(this.elements.day_name_buttons);

            this.elements.previousDay = $('<i>', { 'id': 'previousDay', 'class': this.classes.left_arrow, 'title': traduzione.previousDay }).appendTo(this.elements.day_buttons);
            this.elements.nextDay = $('<i>', { 'id': 'nextDay', 'class': this.classes.right_arrow, 'title': traduzione.nextDay }).appendTo(this.elements.day_buttons);
        },

        createDataContainer: function () {
            this.elements.timeline_data_container = $('<div>', { 'class': this.classes.timeline_data_container }).appendTo(this.elements.timeline);
            this.createMonthContainer();
            this.createWeekContainer();
            this.createDayContainer();
        },

        createMonthContainer: function () {
            this.elements.month_container = $('<div>', { 'class': this.classes.month_container }).appendTo(this.elements.timeline_data_container);
            this.populateMonth();
        },

        createWeekContainer: function () {
            this.elements.week_container = $('<div>', { 'class': this.classes.week_container }).appendTo(this.elements.timeline_data_container);
            this.populateWeek();
        },

        createDayContainer: function () {
            this.elements.day_name_container = $('<div>', { 'class': this.classes.day_name_container }).appendTo(this.elements.timeline_data_container);
            this.elements.day_container = $('<div>', { 'class': this.classes.day_container }).appendTo(this.elements.timeline_data_container);
            this.populateDay();
        },

        populateMonth: function () {
            var month, oldMonth, currentDay, currentMoment, count = 1;

            for (var i = 0; i < this.dateDiff; i++) {
                currentDay = moment(this.options.startDate, 'YYYYMMDD').add('days', i);
                currentMoment = moment(currentDay, 'YYYYMMDD');
                month = currentMoment.format('MMMM').toUpperCase();

                if (month != oldMonth) {
                    this.elements.month =
                        $('<div>',
                            {
                                'class': this.classes.month + ' span_1',
                                'text': eval('traduzione.' + month) + ' ' + currentMoment.format('YYYY'),
                                'data-month': currentMoment.format('YYYYMM'),
                                'data-day-start': currentMoment.format('YYYYMMDD')
                            }
                        ).appendTo(this.elements.month_container);

                    oldMonth = month;
                    count = 1;
                }
				else
				{
					this.elements.month
						.removeClass( 'span_'+ count )
						.addClass( 'span_' + ( count + 1 ) )
						.attr( 'data-day-end', currentMoment.format('YYYYMMDD') );
					count ++;
				}
			}
		},

        populateWeek: function () {
            var week, oldWeek, currentDay, currentMoment, count = 1;

            for (var i = 0; i < this.dateDiff; i++) {
                currentDay = moment(this.options.startDate, 'YYYYMMDD').add('days', i);
                currentMoment = moment(currentDay, 'YYYYMMDD');
                week = currentMoment.isoWeek();

                if (week != oldWeek) {
                    this.elements.week =
                        $('<div>',
                            {
                                'class': this.classes.week + ' span_1',
                                'text': week,
                                'data-month': currentMoment.format('YYYYMM'),
                                'data-week': currentMoment.week(),
                                'data-day-start': currentMoment.format('YYYYMMDD'),
                                'data-day-end': currentMoment.format('YYYYMMDD')
                            }
                        ).appendTo(this.elements.week_container);

                    oldWeek = week;
                    count = 1;
                }
                else {
                    this.elements.week
                        .removeClass('span_' + count)
                        .addClass('span_' + ( count + 1 ))
                        .attr('data-day-end', currentMoment.format('YYYYMMDD'));
                    count++;
                }
            }
        },

		populateDay: function()
		{

			var day, day_name, currentDay, currentMoment = '';

			for( var i = 0; i < this.dateDiff; i++ )
			{

				currentDay		= moment( this.options.startDate, 'YYYYMMDD' ).add( 'days', i );
				currentMoment	= moment( currentDay, 'YYYYMMDD' );
				day_name		= currentMoment.format( 'ddd').toUpperCase();
				day				= currentMoment.format( 'DD' );

				$('<div>',
					{
						'class':				this.classes.day_name + ' span_1' ,
						'text':					eval(  'traduzione.'+ day_name ),
						'data-month':			currentMoment.format('YYYYMM'),
						'data-week':    		currentMoment.week(),
						'data-day-positional':	( currentMoment.format( 'd' ) == '0' ) ? '7' : currentMoment.format( 'd' ),
						'data-day':				currentMoment.format( 'YYYYMMDD' )
					}
				).appendTo( this.elements.day_name_container );

				$('<div>',
					{
						'class':				this.classes.day + ' span_1' ,
						'text':					day,
						'data-month':			currentMoment.format('YYYYMM'),
						'data-week':    		currentMoment.week(),
						'data-day':				currentMoment.format( 'YYYYMMDD' )
					}
				).appendTo( this.elements.day_container );
			}
		},

		setEvents: function()
		{
			var $this = this;

			$(document)
				.on( 'keydown', function( event )
				{

					if ( event.keyCode == 17 )
						$this.CTRLPressed = true;

					if ( event.keyCode == 16 )
						$this.SHIFTPressed = true;

				})
				.on( 'keyup', function( event )
				{

					if( event.keyCode == 17)
						$this.CTRLPressed = false;

					if ( event.keyCode == 16 )
						$this.SHIFTPressed = false;

				});


			$this.elements.month_container.on('click', '.month', function()
			{
				$this.toggleSelect( $(this) );
				$( '.selected', $this.elements.timeline ).not( $(this) ).removeClass('selected');
				$this.options.monthClick( $(this) );
			});

			$this.elements.week_container.on('click', '.week', function()
			{
                $this.toggleSelect( $(this) );
                if(! $this.CTRLPressed ){
                    $( '.selected', $this.elements.timeline ).not( $(this) ).removeClass('selected');
                }
                var $week = $(this);
                var nweek = $week.data('week');
                var year = ('' + $(this).data('month')).substr(0,4);
                var mo = moment().year(year);
                $this.options.startDate	= mo.startOf('week').week(nweek - 1).add(1, 'day').format('YYYYMMDD');
                $this.options.endDate	= mo.startOf('week').week(nweek - 1).add(31, 'day').format('YYYYMMDD');
                $this.options.defaultSelected = {
                    'week': [nweek]
                }

                $this.refresh();

                $this.options.weekClick( $(this) );
			});

			$this.elements.day_name_container.on('click', '.day-name', function()
			{
				$this.toggleSelect( $(this) );
				if(! $this.CTRLPressed )
					$( '.selected', $this.elements.timeline ).not( $(this) ).removeClass('selected');
				$this.options.dayNameClick( $(this) );
			});

			$this.elements.day_container.on('click', '.day', function()
			{

				$this.toggleSelect( $(this) );

				if( $this.SHIFTPressed )
				{

					var first = $('.day.selected', $this.elements.day_container).first();
					var last  = $('.day.selected', $this.elements.day_container).last();

					for( var i = first.index(); i < last.index(); i++ )
					{

						$('.day', $this.elements.day_container).eq(i).addClass('selected');

					}

				}
				else
				{

					$('.selected', $this.elements.timeline).not( $(this) ).removeClass('selected');

				}

				$this.options.dayClick( $(this) );

			});

			$this.elements.day_name_buttons.on('click', 'div', function()
			{

				var positional	= $(this).attr('data-day-positional');
				var day_names	= $this.elements.day_name_container.find('[data-day-positional=\''+ positional +'\']');

				if( day_names.hasClass('selected') )
					day_names.removeClass('selected');
				else
					day_names.addClass('selected');

			});

			$this.elements.previousMonth.on('click', function() { $this.subtractMonth(); } );
			$this.elements.previousWeek.on('click', function() { $this.subtractWeek(); } );
			$this.elements.previousDay.on('click', function() { $this.subtractDay(); } );
			$this.elements.nextMonth.on('click', function() { $this.addMonth(); } );
			$this.elements.nextWeek.on('click', function() { $this.addWeek(); } );
			$this.elements.nextDay.on('click', function() { $this.addDay(); } );

		},

		toggleSelect: function( $obj )
		{

			( $obj.hasClass('selected') ) ? $obj.removeClass('selected') : $obj.addClass('selected');

		},

		addMonth: function()
		{
			var $this				= this;
			var ultimoMese			= $this.elements.month_container.find('.month').last().attr('data-month');
			$this.options.startDate	= moment(ultimoMese +'01', 'YYYYMMDD').add(1, 'months').format('YYYYMMDD');
			$this.options.endDate	= moment(ultimoMese +'01', 'YYYYMMDD').add(2, 'months').subtract(1, 'days').format('YYYYMMDD');
			$this.refresh();
		},

		subtractMonth: function()
		{
			var $this				= this;
			var primoMese			= $this.elements.month_container.find('.month').first().attr('data-month');
			$this.options.startDate	= moment(primoMese +'01', 'YYYYMMDD').subtract(1, 'months').format('YYYYMMDD');
			$this.options.endDate	= moment(primoMese +'01', 'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD');
			$this.refresh();
		},

		addWeek: function()
		{
            var $this = this;
            var primaSettimana = $this.elements.week_container.find('.week').first().attr('data-day-end');
            var ultimaSettimana = $this.elements.week_container.find('.week').last().attr('data-day-end');
            $this.options.startDate = moment(primaSettimana, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD');
            $this.options.endDate = moment(ultimaSettimana, 'YYYYMMDD').add(1, 'weeks').add(1, 'days').format('YYYYMMDD');
            $this.refresh();
		},

		subtractWeek: function()
		{
			var $this				= this;
			var primaSettimana		= $this.elements.week_container.find('.week').first().attr('data-day-end');
			var ultimaSettimana		= $this.elements.week_container.find('.week').last().attr('data-day-start');
			$this.options.startDate	= moment(primaSettimana, 'YYYYMMDD').subtract(2, 'weeks').add(1,'days').format('YYYYMMDD');
			$this.options.endDate	= moment(ultimaSettimana, 'YYYYMMDD').subtract(1, 'weeks').subtract(1,'days').format('YYYYMMDD');
			$this.refresh();
		},

		addDay: function()
		{
			var $this				= this;
			var primoGiorno			= $this.elements.day_container.find('.day').first().attr('data-day');
			var ultimoGiorno		= $this.elements.day_container.find('.day').last().attr('data-day');
			$this.options.startDate	= moment(primoGiorno, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD');
			$this.options.endDate	= moment(ultimoGiorno, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD');
			$this.refresh();
		},

		subtractDay: function()
		{
			var $this				= this;
			var primoGiorno			= $this.elements.day_container.find('.day').first().attr('data-day');
			var ultimoGiorno		= $this.elements.day_container.find('.day').last().attr('data-day');
			$this.options.startDate	= moment(primoGiorno, 'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD');
			$this.options.endDate	= moment(ultimoGiorno, 'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD');
			$this.refresh();
		},

		cleanTimeline: function()
		{
			var $this = this;

			$this.elements.month_container.empty();
			$this.elements.week_container.empty();
			$this.elements.day_name_container.empty();
			$this.elements.day_container.empty();
		},

		refresh: function()
		{
			this.cleanTimeline();
			this.populateMonth();
			this.populateWeek();
			this.populateDay();
            this.select( this.options.defaultSelected );
		},

        resize: function () {
            var containerWidth = ( this.options.width != 'auto' ) ? this.options.width : this.element.innerWidth() - 2;

            this.elements.timeline_data_container.width(containerWidth - this.elements.timeline_buttons_container.outerWidth(true) - 1);
        },

        select: function (toSelect) {
            if (toSelect.month != '') {
                $('[data-month=\'' + toSelect.month + '\']', this.elements.month_container).addClass('selected');
            }
            if ($.isArray(toSelect.week) && toSelect.week.length > 0) {
                for (var i = 0; i < toSelect.week.length; i++)
                    $('[data-week=\'' + toSelect.week[i] + '\']', this.elements.week_container).addClass('selected');
            }
            if ($.isArray(toSelect.day_name) && toSelect.day_name.length > 0) {
                for (var i = 0; i < toSelect.day_name.length; i++)
                    $('[data-day-positional=\'' + toSelect.day_name[i] + '\']', this.elements.day_name_container).addClass('selected');
            }
            if ($.isArray(toSelect.day) && toSelect.day.length > 0) {
                for (var i = 0; i < toSelect.day.length; i++)
                    $('[data-day=\'' + toSelect.day[i] + '\']', this.elements.day_container).addClass('selected');
            }
        },

        remove: function () {
            this.elements.timeline.remove();
        }
    }
})(jQuery);