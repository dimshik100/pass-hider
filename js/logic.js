var dummyCursors = function () {
	var self = this;

	// Globals
	var realCursorPos = {
		'left': 0,
		'top': 0
	};
	var realCursorOldPos = {
		'left': 0,
		'top': 0
	};
	var $keypad = $('.keypad');
	var $password = $('#password');
	var $cursors;
	var keypadDimentions = {};
	var randoms = [];
	var numberOfCursors = 5;
	var myCursors = [];
	var $fakeRealCursor = $('.fake-real-cursor');




	self.init = function () {

		keypadDimentions.width = $keypad.width();
		keypadDimentions.height = $keypad.height();

		updateNumberOfCursors(numberOfCursors);
		createRandoms();

		self.registerEvents();
	}


	self.registerEvents = function () {

		$('.number-of-cursors').keyup(function () {
			var value = $(this).val();

			if ($.isNumeric(value)) {
				numberOfCursors = value;
				updateNumberOfCursors(numberOfCursors);
				createRandoms();
			}
		});

		$($keypad).mousemove(function (e) {

				realCursorOldPos.top = realCursorPos.top;
				realCursorOldPos.left = realCursorPos.left;

				realCursorPos = {
					left: e.pageX - $keypad.offset().left,
					top: e.pageY - $keypad.offset().top
				};

				movePointers();

				moveFakeRealPointer();

		});

		$('.num').click(function () {
			$password.val($password.val() + $(this).text());
		});

		$('body').keypress(function (e) {
			var c = String.fromCharCode(e.keyCode);

			if (c == 'p') {
				if ($password.attr('type') == 'password') {
					$password.attr('type', 'text');
				}
				else {
					$password.attr('type', 'password');
				}
			}

			if (c == 'c') {
				$password.val('');
			}

		});

	}


	function updateNumberOfCursors(numberOfCursors) {

		var $cursorLayer = $('.cursor-layer');
		var cursorsHtml = '';

		// update number of cursors
		for (var i = 0; i < numberOfCursors; i++) {
			cursorsHtml += '<img class="my-cursor" src="images/Cursor arrow Aero.png">';
		}

		$cursorLayer.html(cursorsHtml);

		// update cursors selector
		$cursors = $('.my-cursor');
	}


	function createRandoms() {

		for (var i = 0; i < numberOfCursors; i++) {

			myCursors[i] = {};
			myCursors[i].pos = {};
			myCursors[i].dir = {};
			myCursors[i].pos.top = randomFromInterval(0, keypadDimentions.height);
			myCursors[i].pos.left = randomFromInterval(0, keypadDimentions.width);

			if (randomFromInterval(0, 1) == 1) {
				myCursors[i].dir.top = 1
			}
			else {
				myCursors[i].dir.top = -1;
			}

			if (randomFromInterval(0, 1) == 1) {
				myCursors[i].dir.left = 1
			}
			else {
				myCursors[i].dir.left = -1;
			}

		}
	}



	function keepPointerInScreen(point, screenWidth, screenHeight) {

		if (point.left > screenWidth) {
			point.left = point.left - screenWidth;
		}

		if (point.left < 0) {
			point.left = screenWidth + point.left;
		}

		if (point.top > screenHeight) {
			point.top = point.top - screenHeight;
		}

		if (point.top < 0) {
			point.top = screenHeight + point.top;
		}

		return point;

	}



	function movePointers() {

		var cssObj;

		var mouseDelta = {};

		mouseDelta.top = realCursorPos.top - realCursorOldPos.top;
		mouseDelta.left = realCursorPos.left - realCursorOldPos.left;

		for (var i = 0; i < numberOfCursors; i++) {

			myCursors[i].pos.top = myCursors[i].pos.top + (mouseDelta.top * myCursors[i].dir.top);
			myCursors[i].pos.left = myCursors[i].pos.left + (mouseDelta.left * myCursors[i].dir.left);

			myCursors[i].pos = keepPointerInScreen(myCursors[i].pos, keypadDimentions.width, keypadDimentions.height);

			cssObj = { 'transform': 'translate(' + myCursors[i].pos.left + 'px,' + myCursors[i].pos.top + 'px)' };

			$($cursors[i]).css(cssObj);

		}

	}



	function moveFakeRealPointer() {

		var cssObj;

			cssObj = { 'transform': 'translate(' + realCursorPos.left + 'px,' + realCursorPos.top + 'px)' };

			$fakeRealCursor.css(cssObj);


	}

	// helpers

	function randomFromInterval(from, to) {
		return Math.floor(Math.random() * (to - from + 1) + from);
	}
}




