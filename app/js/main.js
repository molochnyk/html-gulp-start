$(function() {

	function init() {
		console.log(123);
	}
	init();



	//--- Libs Init ---//

	$('.js-popup-open').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});

});
