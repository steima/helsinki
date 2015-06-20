/**
 * This is the Helsinki JavaScript file that contains all our code
 * @author Matthias Steinbauer <matthias.steinbauer@jku.at>
 */
var HELSINKI = HELSINKI || {};

/**
 * This is called by the framework after widget was successfully loaded
 */ 
function helsinki_startup() {
	HELSINKI.gallery = new Gallery('img/gallery/');
	HELSINKI.registerDeviceMotion();
	HELSINKI.registerClickEvents();
	console.log('Helsinki started');
};

/**
 * This is called by the framework right before the widget will be unloaded from DOM
 */ 
function helsinki_teardown() {
	console.log('Helsinki teardown');
};

/**
 * Helper class that provides gallery functions
 */
var Gallery = function(prefix) {
	this.prefix = prefix;

	this.pictures;
	this.preloadedImages;
	this.selectedPictureIndex;
	
	/** sets an array of pictures */
	this.setPictures = function(pictures) {
		this.pictures = pictures;
		this.preloadedImages = new Array();
		for(i=0;i<this.pictures.length;i++) {
			this.preloadedImages[i] = new Image();
			this.preloadedImages[i].src = this.prefix + this.pictures[i];
		}
		this.showImage(0);
	};

	/** use a div id to set pictures */
	this.setPicturesById = function(id) {
		if(id == 'elementHanasaarenkatu') {
			this.setPictures(['mahringer/1.jpg', 'mahringer/2.jpg', 'mahringer/3.jpg', 'mahringer/4.jpg', 'mahringer/5.jpg', 'mahringer/6.jpg', ]);
			return;
		}
		if(id == 'elementKeskus2') {
			this.setPictures(['rettenbacher/1.jpg', 'rettenbacher/2.jpg', 'rettenbacher/3.jpg', 'rettenbacher/4.jpg', 'rettenbacher/5.jpg', 'rettenbacher/6.jpg', ]);
			return;
		}
		if(id == 'elementSuomenlinna') {
			this.setPictures(['maierhofer/3.jpg', 'maierhofer/4.jpg', 'maierhofer/6.jpg']);
			return;
		}
		if(id == 'elementViro') {
			this.setPictures(['greusnig/1.jpg', 'greusnig/2.jpg']);
			return;
		}
		if(id == 'elementDocksgatan') {
			this.setPictures(['poschauko/1.jpg', 'poschauko/2.jpg']);
			return;
		}
		if(id == 'elementKeskus') {
			this.setPictures(['wasserbauer/1.jpg']);
			return;
		}
		if(id == 'elementHelsingin') {
			this.setPictures(['erber/1.jpg']);
			return;
		}
		if(id == 'elementPresidentti') {
			this.setPictures(['poschauko2/1.jpg', 'poschauko2/2.jpg', 'poschauko2/3.jpg', 'poschauko2/4.jpg', 'poschauko2/5.jpg', 'poschauko2/6.jpg']); 
			return;
		}
		if(id == 'elementToolonlahti') {
			this.setPictures(['maierhofer/8.jpg', 'maierhofer/9.jpg']);
			return;
		}
	};

	/** select an image from the gallery and display */
	this.showImage = function(index) {
		this.selectedPictureIndex = index;
		$('#galleryImage').attr('src', this.prefix + this.pictures[this.selectedPictureIndex]);
		this.updateInfo();
	};

	/** display the next picture in the queue */
	this.next = function() {
		console.log('next clicked');
		this.showImage((this.selectedPictureIndex+1) % this.pictures.length);
	};

	/** updates the info text */
	this.updateInfo = function() {
		var text = '' + (this.selectedPictureIndex+1) + '/' + this.pictures.length;
		$('#galleryInfo').html(text);
	};
};

/**
 * Class that handles deviceorientation events
 */
var OrientationHandler = function() {
	this.tilt = -1;
	this.orientation = 0;
	this.showFlash = false;
	this.alwaysRotate = true;
	this.active = true;
	this.debug = false;

	/** update the data and fire events if necessary */
	this.update = function(tilt, orientation) {
		tilt = HELSINKI.round(tilt);
		/* if the 360° view is not shown no need to compute it */
		if(!this.active) return;
		this.orientation = 360 - HELSINKI.round(orientation);
		var tBool = tilt >= 25;
		if(this.tilt != tBool) {
			this.tilt = tBool;
			this.updateUi();
			console.log('change view');
		}
		if(this.alwaysRotate || this.tilt > 0) {
			var scrollContentWidth = $('#scrollContentBackground').width();
			var factor = (scrollContentWidth-1024) / 360;
			var factorStars1 = factor / 1.75;
			var factorStars2 = factor / 1.25;
			var pos = Math.round(this.orientation * factor);
			var posStars1 = Math.round(this.orientation * factorStars1);
			var posStars2 = Math.round(this.orientation * factorStars2);
			var factorElements = ($('#elementsContent').width()-1024) / 360;
			var posElements = Math.round(this.orientation * factorElements);
			if(this.debug) console.log('orientation: ' + this.orientation + ' pos: ' + pos);
			$('#scrollPaneBackground').scrollLeft(pos);
			$('#scrollPaneFlash').scrollLeft(pos);
			$('#scrollPaneStars1').scrollLeft(posStars1);
			$('#scrollPaneStars1').scrollLeft(posStars2);
			$('#scrollPaneElements').scrollLeft(posElements);
			if(!this.showFlash) {
				if(pos >= 1500 && pos <= 2990 || pos >= 3700 && pos <= 5700) {
					// turn the flash effect on
					this.showFlash = true;
					$("#scrollPaneFlash").css({ opacity: 0 }); // init the fade effect
					$('#scrollPaneFlash').show();
					$('#scrollPaneFlash').fadeTo(3000, 1.0);
				}
			}
		}
	};

	/** switch the UI according to current tilt */
	this.updateUi = function() {
		if(this.tilt > 0) {
			$('#instructions').hide();
			$('.elementItem').show();
		}else{
			$('#instructions').show();
			$('.elementItem').hide();
			if(!this.alwaysRotate) {
				$('#scrollPaneFlash').hide();
				this.showFlash = false;
			}
		}
	};

	/** Allows to toggle motion detection to be inactive
	    this avoids non-necessary computation when in galleries */
	this.setActive = function(a) {
		this.active = a;
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
		$('#instructionsText').html('Sorry your device does not support motion events :(');
	}
};

/**
 * Register on click events for all elements
 */
HELSINKI.registerClickEvents = function() {
	$('.elementItem').each(function(index, value) {
		$(value).click(HELSINKI.galleryClick);
	});
	$('#galleryClose').click(HELSINKI.hideGallery);
	$('#galleryImage').click(function() { HELSINKI.gallery.next(); } );
};

/**
 * Handles click on items to activate gallery
 */ 
HELSINKI.galleryClick = function() {
	HELSINKI.gallery.setPicturesById(this.id);
	HELSINKI.showGallery();
};

/**
 * Helper for rounding numbers
 */
HELSINKI.round = function (val) {
	var amt = 10;
	return Math.round(val * amt) /  amt;
};

/**
 * Displays the gallery
 */
HELSINKI.showGallery = function() {
	HELSINKI.oHandler.setActive(false);
	$('#threeSixtyDegree').hide();
	$('#instructions').hide();
	$('#gallery').show();
};

/**
 * Hides the gallery and switches back to 360 degree view
 */ 
HELSINKI.hideGallery = function() {
	HELSINKI.oHandler.setActive(true);
	HELSINKI.oHandler.updateUi();
	$('#threeSixtyDegree').show();
	$('#gallery').hide();

};

/**
 * The following will run the startup code in cases where we are not 
 * embedded in the framework
 */
$(document).ready(function() {
	helsinki_startup();
});
