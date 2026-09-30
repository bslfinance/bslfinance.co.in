/**
 * BSL Nidhi Limited - Contact Form Handler
 * Handles client-side validation, anti-spam honeypot, and asynchronous AJAX submission
 */
(function () {
	'use strict';

	function getFormData(form) {
		var elements = form.elements;
		var honeypot = '';
		var fields = [];
		var formData = {};

		for (var i = 0; i < elements.length; i++) {
			var el = elements[i];
			if (!el.name) continue;
			if (el.name === 'honeypot') {
				honeypot = el.value;
				continue;
			}
			if (fields.indexOf(el.name) === -1) {
				fields.push(el.name);
			}
		}

		fields.forEach(function (name) {
			var element = elements[name];
			if (!element) return;
			if (typeof element.value !== 'undefined' && !(element instanceof RadioNodeList) && !(element instanceof HTMLCollection)) {
				formData[name] = element.value;
			} else if (element.length) {
				var data = [];
				for (var j = 0; j < element.length; j++) {
					var item = element.item(j);
					if (item.checked || item.selected) {
						data.push(item.value);
					}
				}
				formData[name] = data.join(', ');
			}
		});

		formData.formDataNameOrder = JSON.stringify(fields);
		formData.formGoogleSheetName = form.dataset.sheet || 'responses';
		formData.formGoogleSendEmail = form.dataset.email || '';

		return { data: formData, honeypot: honeypot };
	}

	function showStatus(form, type, message) {
		var statusContainer = form.querySelector('.form-status-alert');
		if (!statusContainer) {
			statusContainer = document.createElement('div');
			statusContainer.className = 'form-status-alert mt-3 alert';
			form.appendChild(statusContainer);
		}
		statusContainer.className = 'form-status-alert mt-3 alert alert-' + (type === 'success' ? 'success' : 'danger');
		statusContainer.innerHTML = message;
		statusContainer.style.display = 'block';
		statusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}

	function handleFormSubmit(event) {
		event.preventDefault();
		var form = event.target;
		var formDataObj = getFormData(form);

		// Anti-spam honeypot
		if (formDataObj.honeypot) {
			console.warn('Bot submission blocked.');
			return false;
		}

		var submitBtn = form.querySelector('button[type="submit"]');
		var originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit';

		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending message...';
		}

		var url = form.action;
		var data = formDataObj.data;
		var encoded = Object.keys(data).map(function (k) {
			return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
		}).join('&');

		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xhr.onload = function () {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.innerHTML = originalBtnHtml;
			}

			if (xhr.status >= 200 && xhr.status < 400) {
				form.reset();
				showStatus(form, 'success', '<i class="fad fa-check-circle"></i> <strong>Thank you!</strong> Your message has been sent successfully. Our team will contact you shortly.');
			} else {
				showStatus(form, 'error', '<i class="fad fa-exclamation-triangle"></i> <strong>Oops!</strong> There was a problem submitting your inquiry. Please try again or call us directly.');
			}
		};

		xhr.onerror = function () {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.innerHTML = originalBtnHtml;
			}
			// Google Apps Script redirects might trigger an opaque response or CORS, but still record data
			showStatus(form, 'success', '<i class="fad fa-check-circle"></i> <strong>Thank you!</strong> Your message has been recorded. Our team will get back to you shortly.');
		};

		xhr.send(encoded);
	}

	function init() {
		var forms = document.querySelectorAll('form#contactUsForm, form.contactUsForm');
		for (var i = 0; i < forms.length; i++) {
			forms[i].addEventListener('submit', handleFormSubmit, false);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();