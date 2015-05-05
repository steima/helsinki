/**
 * This is the Helsinki JavaScript file that contains all our code
 * @author Matthias Steinbauer <matthias.steinbauer@jku.at>
 */
var HELSINKI = HELSINKI || {};

/**
 * This is called by the framework after widget was successfully loaded
 */ 
function helsinki_startup() {
	console.log('Helsinki started');
};

/**
 * This is called by the framework right before the widget will be unloaded from DOM
 */ 
function helsinki_teardown() {
	console.log('Helsinki teardown');
};

/**
 * Register device motion events for this widget
 */
HELSINKI.registerDeviceMotion = function() {
	if(window.DeviceMotionEvent) {
  		$.on('devicemotion', function(me) {
			var accel = me.acceleration;
			var accelGrav = me.accelerationIncludingGravity;
			var rotation = me.rotationRate;

			console.log('x accel: ' + accel.x);
			console.log('a rotation: ' + rotation.alpha);
		});
	}else{
		alert('Sorry your device does not support motion events');
	}
};




/**
 * The following will run the startup code in cases where we are not 
 * embedded in the framework
 */
$(document).ready(function() {
	helsinki_startup();
});
