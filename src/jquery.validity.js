/*
	V A L I D I T Y

	Validity is a jQuery validation plugin. It lets you set two methods, markOK and markError, and lets you call three methods in your $() (document.ready). These methods are automatically applied to all fields/forms with class "validate":

		1) $.validate.onKeyUp();
			For each key stroke, if the field has already been marked, it revalidates the contents and marks the field accordingly. If it hasn't been marked yet, it waits until its contents pass validation before marking it. (It waits until the user does it right before criticizing it.)
			
		2) $.validate.onBlur();
			When the field loses focus, either mark it as OK or an error.
		
		3) $.validate.onSubmit();
			When submit is clicked, every field is checked and marked for validity; if any fail, the form does not submit.

	To specify what you want to validate for a given field, simply add a class to that field and a corresponding function to the validation_functions object. For instance, if you wanted to specify that a field should have a valid e-mail address, you could add a class "email" (along with the class "validate") to that form field, and add "email: function(field) { ... }" to validationunctions. (Or simply uncomment the one provided.)
	
	To set up validity, just run
	
	$.validity({
		markOK: function(field) { ... },
		markError: function(field, error) { ... },
		validationFunctions: {
			minLength: function(field) { ... },
			...
		}
	})
		
*/

jQuery.validate = {
	onKeyUp: function() {
		jQuery('input.validate').keyup(function(){
			jQuery.validate.approveThenValidate(jQuery(this));
		})		
	},
	onBlur: function() {
		jQuery('input.validate').blur(function(){
			jQuery.validate.validate(jQuery(this));
		})
	},
	onSubmit: function() {
		$('form.validate').submit(function() {
			var field_array = new Array();
			$('input.validate', $(this)).each(function() {
				if ($(this).hasClass('inactive')) {
					$(this).val('');
				}
				var error = jQuery.validate.hasError($(this), 'synchronous')
				if (error) {
					field_array.push(error);
					jQuery.validate.markError($(this), error);
				};
			});
			if (field_array.length == 0) {
				return true;
			} else {
				$('input.validate', $(this)).each(function() {
					if ($(this).hasClass('inactive')) {
						$(this).val($(this).attr('title'));		
					}
				});
				return false;
			}
		});
	},
	approveThenValidate: function(field) {
		if (jQuery.validate.neverBeenValidated(field)) {
			if (jQuery.validate.isOK(field)) {
				field.addClass('validated');
				jQuery.validate.markOK(field);
			}
		} else {
			jQuery.validate.validate(field);
		}
	},
	neverBeenValidated: function(field) {
		return !field.hasClass('validated');
	},
	validate: function(field) {
		var error = jQuery.validate.hasError(field)
		if (error) {
			if (error != 'asynchronous') {
				jQuery.validate.markError(field, error) 
			}
		} else {
			jQuery.validate.markOK(field);
		}
		field.addClass('validated');
	},
	// Returns true if this input field passes its validation, false if it doesn't
	isOK: function(field) {
		return !jQuery.validate.hasError(field);
	},
	// If the input has a validation error, it returns the string to be displayed for that error. If there is no error, then it returns false
	hasError: function(field) {
		var classArray = field.attr('className').split(' ');
		for (var classIndex in classArray) {
			var className = classArray[classIndex];
			var validationFunction = jQuery.validate.validationFunctions[className];
			if (validationFunction) {
				var error = validationFunction(field)
				if (error) {
					return error;
				}
			}
		}
		return null;
	},
	// A JS object with functions in it that take an input field as argument will return a string containing a human readable error if that input field has the error being described.
	validationFunctions: {
		// required: function(input_field) {
		// 	if (!input_field.val()) {
		// 			return 'This field is required.';
		// 		}
		// 	}
		// 	return null;
		// },
		// minLength: function(input_field) {
		// 	if (input_field.attr('name').match(/password/)) {
		// 		if ((input_field.val().length < 6) && (input_field.val().length > 0)) {
		// 			return "Your password must be at least 6 characters.";
		// 		} else {
		// 			return null;
		// 		}
		// 	}
		// },
		// email: function(input_field) {
		// 	// snagged this regex from the plugin we were using originally (http://docs.jquery.com/Plugins/Validation)
		// 	if (input_field.val().match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i)) {
		// 		return null;
		// 	} else {
		// 		return "A valid email address is required.";
		// 	}
		// },
		// confirm: function(input_field) {
		// 	var name = input_field.attr('name');
		// 	if ($('input[name=' + name.replace('_confirmation', '') + ']', input_field.closest('form')).val() == input_field.val()) {
		// 		return null;
		// 	} else {
		// 		return 'The passwords must match!'
		// 	};
		// },
		// positiveNumber: function(input_field) {
		// 	if (input_field.val().match(/^\d*\.?\d*$/)) {
		// 		return null;
		// 	} else {
		// 		return 'You must input a number';
		// 	}
		// },
		// positiveInteger: function(input_field) {
		// 	if (input_field.val().match(/^[1-9][0-9]*$/)) {
		// 		return null;
		// 	} else {
		// 		return 'You must input a number';
		// 	}
		// }
	}
}
jQuery.validity = function(options) {
	jQuery.extend(jQuery.validate.validationFunctions, options.validationFunctions)
	delete options.validationFunctions;
	jQuery.extend(jQuery.validate, options);
};