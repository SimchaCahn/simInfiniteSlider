var SliderUtils = (function() {

	function isObject(val) {
		if (val === null) return;
		return ((typeof val === 'function') || (typeof val === 'object'));
	}

	function extend(defaults, config) {
		if (!isObject(defaults)) defaults = {};
		if (!isObject(config)) config = {};

		var obj = {};
		for (var key in defaults) {
			if (!defaults.hasOwnProperty(key)) continue;
			obj[key] = (config.hasOwnProperty(key)) ? config[key] : defaults[key];
		}
		return obj;
	}

	function clamp(amount, min, max) {
		return Math.min(Math.max(amount, min), max);
	}

	function elementSuportedFormatError(elem) {
		throw new Error(elem + ' Not supported format. HTMLElement, HTMLCollection and Array of HTMLElement supported formats');
	}

	function convertElementsToArray(elements) {
		if (elements instanceof HTMLElement) {
			return [elements];
		} else if (elements instanceof HTMLCollection) {
			return Array.prototype.slice.call(elements);
		} else if (elements instanceof Array) {
			elements.forEach(function(elem) {
				if (!(elem instanceof HTMLElement)) elementSuportedFormatError(elem);
			});
			return elements;
		} else {
			elementSuportedFormatError(elements);
		}
	}
	
	function emptyFunction() {}

	return {
		isObject: isObject,
		extend: extend,
		clamp: clamp,
		convertElementsToArray: convertElementsToArray,
		emptyFunction: emptyFunction
	};
})();

console.clear();







var SimInfiniteSlider = (function() {

	var preventSlide = false, // global
		moveSetAmount = 0,
		moveSlideAmount = 0,
		currentPxPos = 0,
		lastSlideShown = 0,
		numberOfDuplicates = 0,
		amountOfSlidesShown = 0,
		amountOfSlides = 0,
		amountOfSlidesWithDups = 0,
		defaultOptions = {
			margin: 3,
			numberOfSlidesToShow: 2,
			lastSlideToShow: 0,
			
			// Callbacks
			beforeInit: SliderUtils.emptyFunction,
			afterInit: SliderUtils.emptyFunction,
			beforeSlide: SliderUtils.emptyFunction,
			afterSlide: SliderUtils.emptyFunction
		},
		userOptions = {};

	var slides = [],
		parentElem = null,
		outerWrapper = document.createElement('div'),
		innerWrapper = document.createElement('div');

	function SimInfiniteSlider(elems, options) {
		slides = SliderUtils.convertElementsToArray(elems);
		parentElem = slides[0].parentElement;

		userOptions = SliderUtils.extend(defaultOptions, options);

		init();
	}

	function init() {
		// Callback
		userOptions.beforeInit();
		
		configDOM();

		currentPxPos = 1 - moveSetAmount;
		// In 'reconfigDuplicates' we add/subtract to 'amountOfSlidesWithDups'
		amountOfSlides = amountOfSlidesWithDups = slides.length;

		innerWrapper.addEventListener('transitionend', finishSlideCallback);

		setAmountOfSlidesShown(userOptions.numberOfSlidesToShow);
		lastSlideShown = amountOfSlidesShown;
		
		// If lastSlideToShow is set. i.e. it's not set to its default value of 0
		if (userOptions.lastSlideToShow) moveToSlide(userOptions.lastSlideToShow, false, false);
		// Callback
		userOptions.afterInit(innerWrapper, outerWrapper);
	}
	
	function configDOM() {
		while (parentElem.children.length > 0) {
			var currentCell = parentElem.children[0];
			innerWrapper.appendChild(parentElem.children[0])

			applySlidesStyle(currentCell);
		}
		outerWrapper.appendChild(innerWrapper);
		parentElem.appendChild(outerWrapper);

		outerWrapper.className = 'infiniteSlider-outerWrapper';
		innerWrapper.className = 'infiniteSlider-innerWrapper';
	}
	
	function applySlidesStyle(slide) {
		slide.style.margin = userOptions.margin + 'px';
		slide.classList.add('infiniteSlider-slides');
	}

	function reconfigDuplicates(value, oldValue) {
		if (typeof value !== 'number' || typeof oldValue !== 'number') return;
		if (value < 0 || value > amountOfSlides) {
			throw new Error(value + ' is out of range. \'value\' must be between 1 and ' + amountOfSlides + ' (slides.length)');
		}

		var remove = oldValue > value,
			slidesToAdd = amountOfSlides % value;

		if (slidesToAdd === 0) slidesToAdd = value;

		while (innerWrapper.children.length !== amountOfSlides + value) {
			if (remove) {
				innerWrapper.removeChild(innerWrapper.lastElementChild);
				numberOfDuplicates--;
				lastSlideShown--;
				amountOfSlidesWithDups--;
			} else {
				var clonedCell = slides[numberOfDuplicates++].cloneNode(true);
				applySlidesStyle(clonedCell);
				innerWrapper.appendChild(clonedCell);
				lastSlideShown++;
				amountOfSlidesWithDups++;
			}
		}

		moveOutOfBetweenDups(false);
	}

	function moveOutOfBetweenDups(animate) {
		if (lastSlideShown <= amountOfSlides) return;
		// Slider is holding at the duplicates

		var halfOfDups = amountOfSlidesShown / 2;
		if (lastSlideShown > amountOfSlides + halfOfDups) slideToEndAfterDups(animate); // 'lastSlideShown' is closer to absolute end
		else slideToEndBeforeDups(animate); // 'lastSlideShown' is closer to slides.length end
	}

	function finishSlideCallback(e) {
		if (e.target !== innerWrapper && e.propertyName !== 'transform') return;
		preventSlide = false;
	}

	
	function setAmountOfSlidesShown(value) {
		if (typeof value !== 'number' || value === amountOfSlidesShown) return;

		if (value < 0 || value > amountOfSlides) {
			throw new Error(value + ' is out of range. \'numberOfSlidesToShow\' must be between 1 and ' + amountOfSlides + ' (slides.length)');
		}

		var oldValue = amountOfSlidesShown;
		amountOfSlidesShown = value;
		reconfigDuplicates(value, oldValue);

		moveSlideAmount = slides[0].offsetWidth + userOptions.margin * 2
		moveSetAmount = moveSlideAmount * value;
		outerWrapper.style.width = moveSetAmount + 'px';
	}
	
	function slideToPx(amount, relative, animate) {
		if (typeof amount !== 'number') return;
		
		currentPxPos = (relative) ? currentPxPos + amount : amount;

		if (!animate) innerWrapper.style.transition = 'none';
		innerWrapper.style.transform = 'translate3d(' + currentPxPos + 'px, 0, 0)';
		setTimeout(function() {
			innerWrapper.style.transition = '';
		});
		
		if (!animate) preventSlide = false;
	}

	function moveToSlide(index, relative, animate) {
		if (preventSlide || typeof index !== 'number') return;
		preventSlide = true;

		var slideAmount = 0,
			tempLastSlideShown = (relative) ? lastSlideShown + index : index;
		
		tempLastSlideShown = SliderUtils.clamp(tempLastSlideShown, amountOfSlidesShown, innerWrapper.children.length);
		
		// Callback
		userOptions.beforeSlide(lastSlideShown, tempLastSlideShown);
		
		lastSlideShown = tempLastSlideShown;
		slideAmount = (lastSlideShown - amountOfSlidesShown) * moveSlideAmount;
		slideAmount = -slideAmount;
		
		// Start Slide
		slideToPx(slideAmount, false, animate);
		
		// Callback
		userOptions.afterSlide(lastSlideShown, slideAmount);
	}

	function slideToNextSet() {
		if (preventSlide) return;

		var slideAmount = amountOfSlidesShown,
			upcomingLastSlideShown = lastSlideShown + amountOfSlidesShown;

		if (lastSlideShown === innerWrapper.children.length) {
			// Slider is at absolute end. Got to beginning, then slide to next slide
			slideToBeginning();
		}
		// Can't do 'else' because next if statement possible when at beginning.
		// Example case. 4 slides, while 3 slides show at once.
		if (upcomingLastSlideShown > amountOfSlides && lastSlideShown !== amountOfSlides) {
			// Upcoming amount to slide isn't divisable by amountOfSlidesShown
			// And, slider is NOT at end, before the duplicates. If it is, slide to duplicates
			// Get remainder amount, then slide that much
			var remainderSlides = amountOfSlides - lastSlideShown;
			slideAmount = remainderSlides;
		}
		
		setTimeout(function() {
			moveToSlide(slideAmount, true, true);
		}, 100);
	}

	function slideToPrevSet() {
		if (preventSlide) return;

		var slideAmount = amountOfSlidesShown,
			remainder = lastSlideShown % amountOfSlidesShown;

		if (remainder !== 0 && lastSlideShown !== innerWrapper.children.length) {
			// Slider isn't holding at divisible (even) value
			// And, slider is NOT at absolute end. If it is, slide regularly backwards
			// Slide remainder amount backwards
			slideAmount = remainder;
		}
		
		if (lastSlideShown === amountOfSlidesShown) {
			// Slider is holding at beginning
			// Got to end, then slide back regularly
			slideToEndAfterDups(false);
		}
		slideAmount = -slideAmount;

		setTimeout(function() {
			moveToSlide(slideAmount, true, true);
		});
	}

	function slideToBeginning(animate) {
		moveToSlide(amountOfSlidesShown, false, animate);
	}

	function slideToEndAfterDups(animate) {
		moveToSlide(innerWrapper.children.length, false, animate);
	}

	function slideToEndBeforeDups(animate) {
		moveToSlide(amountOfSlides, false, animate);
	}

	SimInfiniteSlider.prototype = {
		constructor: SimInfiniteSlider,
		preventSlide: preventSlide,
		setAmountOfSlidesShown: setAmountOfSlidesShown,
		moveToSlide: moveToSlide,
		slideToNextSet: slideToNextSet,
		slideToPrevSet: slideToPrevSet,
		slideToBeginning: slideToBeginning,
		slideToEndAfterDups: slideToEndAfterDups,
		slideToEndBeforeDups: slideToEndBeforeDups
	}

	return SimInfiniteSlider;

}());
