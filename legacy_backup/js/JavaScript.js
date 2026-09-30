/**
 * BSL Nidhi Limited - General Site Scripts
 * Provides utility helpers, smooth scrolling, and UI enhancements
 */
(function ($) {
	'use strict';

	$(function () {
		// Back to Top button
		var $backToTop = $('#back-to-top');
		if ($backToTop.length) {
			$(window).on('scroll', function () {
				if ($(this).scrollTop() > 300) {
					$backToTop.fadeIn('slow');
				} else {
					$backToTop.fadeOut('slow');
				}
			});

			$backToTop.find('button').on('click', function () {
				$('html, body').animate({ scrollTop: 0 }, 600);
				return false;
			});
		}

		// Auto-populate copyright year if not already set
		var currentYear = new Date().getFullYear();
		$('#currentYear').text(currentYear);
	});
})(jQuery);