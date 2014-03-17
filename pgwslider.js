/**
 * PgwSlider - Version 1.0
 *
 * Copyright 2014, Jonathan M. Piat
 * http://pgwjs.com - http://pagawa.com
 * 
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
;(function($){
    $.fn.pgwSlider = function(options) {

	var defaults = {
		containerHeight : 300,
		intervalDuration : 3000,
		transitionDuration : 400
	};

	if (this.length == 0) {
		return this;
	} else if(this.length > 1) {
		this.each(function() {
			$(this).pgwSlider(options);
		});
		return this;
	}

	var pgwSlider = {};
	pgwSlider.plugin = this;
	pgwSlider.data = [];
	pgwSlider.currentNumber = 0;
	pgwSlider.totalNumber = 0;
	pgwSlider.eventInterval = null;

	// Init function
	var init = function() {
		// Merge user options with defaults settings
		pgwSlider.settings = $.extend({}, defaults, options);

		// Setup
		setup();

		// Active interval
		activeInterval();
	};

	// Get element data fucntion
	var getElementData = function(obj) {
		var element = {};

		var elementLink = obj.find('a').attr('href');
		if ((typeof elementLink != 'undefined') && (elementLink != '')) {
			element.link = elementLink;
			var elementLinkTarget = obj.find('a').attr('target');
			if ((typeof elementLinkTarget != 'undefined') && (elementLinkTarget != '')) {
				element.linkTarget = elementLinkTarget;
			}
		}

		var elementThumbnail = obj.find('img').attr('src');
		if ((typeof elementThumbnail != 'undefined') && (elementThumbnail != '')) {
                        element.thumbnail = elementThumbnail;
                }

		var elementImage = obj.find('img').attr('data-large-url');
		if ((typeof elementImage != 'undefined') && (elementImage != '')) {
                        element.image = elementImage;
                }

		var elementSpan = obj.find('span').text();
		if ((typeof elementSpan != 'undefined') && (elementSpan != '')) {
			element.title = elementSpan;
		} else {
			var elementTitle = obj.find('img').attr('data-title');
        	        if ((typeof elementTitle != 'undefined') && (elementTitle != '')) {
                                element.title = elementTitle;
                       	}
		}

		var elementDescription = obj.find('img').attr('data-description');
                if ((typeof elementDescription != 'undefined') && (elementDescription != '')) {
                        element.description = elementDescription;
                }

		return element;
	};

	// Setup function
	var setup = function() {

		// Create slider div
		pgwSlider.plugin.prepend('<div class="current" style="height:' + pgwSlider.settings.containerHeight + 'px; max-height: ' + pgwSlider.settings.containerHeight + 'px"></div>');

		// Set the height and the width of element links
		pgwSlider.totalNumber = pgwSlider.plugin.find('ul li').length;

		var elementHeight = ((pgwSlider.settings.containerHeight - ((pgwSlider.totalNumber - 1) * 6)) / pgwSlider.totalNumber);
		pgwSlider.plugin.find('ul li').css('height', elementHeight + 'px');

		var elementWidth = (100 / pgwSlider.totalNumber);
		pgwSlider.plugin.find('ul li').css('width', elementWidth + '%');

		// Get and save each element data
		var elementId = 0;
		pgwSlider.plugin.find('ul li').each(function() {
			var element = getElementData($(this));
			element.id = elementId;
			pgwSlider.data.push(element);

			$(this).addClass('elt_' + element.id);

			if (typeof element.title != 'undefined') {
				if ($(this).find('span').length == 1) {
					if ($(this).find('span').text() == '') {
						$(this).find('span').text(element.title);
					}
				} else {
					$(this).find('img').after('<span>' + element.title + '</span>');
				}
			}

			$(this).css('cursor', 'pointer').click(function(event) {
	                        event.preventDefault();
        	                display(element.id);
                	});
			
			elementId++;
		});

		pgwSlider.plugin.on('mouseenter', function() {
			clearInterval(pgwSlider.eventInterval);
			pgwSlider.eventInterval = null;
		});
		pgwSlider.plugin.on('mouseleave', function() {
			activeInterval();
		});

		// Display first element
                display(0);

		// Display slider container
		pgwSlider.plugin.removeClass('init');
		pgwSlider.plugin.animate({
			opacity: 1
		}, 400);
	};

	// Display element
	var display = function(elementId) {

		pgwSlider.currentNumber = elementId;
		var element = pgwSlider.data[elementId];
		var elementContainer = pgwSlider.plugin.find('div');

		elementContainer.animate({
			opacity : 0,
		}, pgwSlider.settings.transitionDuration, function() {

			pgwSlider.plugin.find('ul li').css('opacity', '0.6');
			pgwSlider.plugin.find('ul li.elt_' + elementId).css('opacity', '1');

			var elementText = '';
			if (typeof element.title != 'undefined') {
				elementText += '<b>' + element.title + '</b>';
			}
			
			if (typeof element.image != 'undefined') {
				elementContainer.html('<img src="' + element.image + '" alt="'+elementText+'">');
			} else if (typeof element.thumbnail != 'undefined') {
				elementContainer.html('<img src="' + element.thumbnail + '" alt="'+elementText+'">');
			} else {
				elementContainer.html('');
			}

			if (typeof element.description != 'undefined') {
				if (elementText != '') elementText += '<br>';
				elementText += element.description;
			}

			if (elementText != '') {
				elementContainer.append('<span>' + elementText + '</span>');
			}

			if (typeof element.link != 'undefined') {
				var linkTarget = '';
				if (typeof element.linkTarget != 'undefined') {
					var linkTarget = ' target="' + element.linkTarget + '"';
				}
				elementContainer.html('<a href="' + element.link + '"' + linkTarget + '>' + elementContainer.html() + '</a>');
			}

			elementContainer.animate({
                        	opacity : 1,
	                }, pgwSlider.settings.transitionDuration);
		});
	};

	// Active interval function
	var activeInterval = function() {
		pgwSlider.eventInterval = setInterval(function() {
			var maxNumber = pgwSlider.totalNumber - 1;
        	        if (pgwSlider.currentNumber + 1 <= maxNumber) {
                	        var nextNumber = pgwSlider.currentNumber + 1;
	                } else {
        	                var nextNumber = 0;
                	}
			display(nextNumber);
		}, pgwSlider.settings.intervalDuration);
	};

	init();
	return this;
    }
})(jQuery);
