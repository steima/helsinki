/**
 * This is the Helsinki JavaScript file that contains all our code
 * @author Matthias Steinbauer <matthias.steinbauer@jku.at>
 */
var HELSINKI = HELSINKI || {};

/**
 * This is called by the framework after widget was successfully loaded
 */ 
function helsinki_startup() {
	HELSINKI.registerDeviceMotion();
	console.log('Helsinki started');
};

/**
 * This is called by the framework right before the widget will be unloaded from DOM
 */ 
function helsinki_teardown() {
	console.log('Helsinki teardown');
};

/**
 * Class that handles deviceorientation events
 */
var OrientationHandler = function() {
	this.tilt = -1;
	this.orientation = 0;

	/** update the data and fire events if necessary */
	this.update = function(tilt, orientation) {
		tilt = HELSINKI.round(tilt);
		this.orientation = 360 - HELSINKI.round(orientation);
		var tBool = tilt >= 45;
		if(this.tilt != tBool) {
			this.tilt = tBool;
			this.updateUi();
			console.log('change view');
		}
		if(this.tilt > 0) {
			var scrollContentWidth = $('#scrollContent').width();
			var factor = scrollContentWidth / 360;
			var pos = Math.round(this.orientation * factor);
			console.log('pos ' + pos);
			$('#scrollPane').scrollLeft(pos);
		}
	};

	/** switch the UI according to current tilt */
	this.updateUi = function() {
		if(this.tilt > 0) {
			$('#treeSixtyDegree').show();
			$('#mapView').hide();
		}else{
			$('#treeSixtyDegree').hide();
			$('#mapView').show();
		}
	};
};

/**
 * Register device motion events for this widget
 */
HELSINKI.registerDeviceMotion = function() {
	if(window.DeviceMotionEvent) {
		HELSINKI.oHandler = new OrientationHandler();
		console.log('device supports device motion event');
		$('#alpha').html('test');
		window.addEventListener('deviceorientation', function(oe) {
			$('#alpha').html('a ' + HELSINKI.round(oe.alpha));
			$('#gamma').html('c ' + HELSINKI.round(oe.gamma));
			HELSINKI.oHandler.update(oe.gamma, oe.alpha);
		}, false);

	}else{
		alert('Sorry your device does not support motion events');
	}
};

/**
 * Helper for rounding numbers
 */
HELSINKI.round = function (val) {
	var amt = 10;
	return Math.round(val * amt) /  amt;
}

/**
 * The following will run the startup code in cases where we are not 
 * embedded in the framework
 */
$(document).ready(function() {
	helsinki_startup();
});
