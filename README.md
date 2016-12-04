## simInfiniteSlider

A completely 'hackable', easy to understand, infinite slider.

### [Demo](http://s.codepen.io/simchaCahn/debug/jVWogR)

### [Playground](http://codepen.io/simchaCahn/pen/jVWogR?editors=0010)

### Files

To start working with simInfiniteSlider, you need to add the following two files to your project:

* [SimInfiniteSlider.js](https://rawgit.com/SimchaCahn/simInfiniteSlider/master/SimInfiniteSlider.js)
* [SimInfiniteSlider.css](https://rawgit.com/SimchaCahn/simInfiniteSlider/master/SimInfiniteSlider.css)

---

## Example using simInfiniteSlider:

Just add a link to the css file in your `<head>`:

```html
<link rel="stylesheet" type="text/css" href="https://rawgit.com/SimchaCahn/simInfiniteSlider/master/SimInfiniteSlider.css"/>
```

Then, before your closing ```<body>``` tag add:

```html
<script type="text/javascript" src="https://rawgit.com/SimchaCahn/simInfiniteSlider/master/SimInfiniteSlider.js"></script>
```

Next, have a list of html elements.

```html
<div id="slider">
	<div class="item">Item - 1</div>
	<div class="item">Item - 2</div>
	<div class="item">Item - 3</div>
	<div class="item">Item - 4</div>
	<div class="item">Item - 5</div>
	<div class="item">Item - 6</div>
	<div class="item">Item - 7</div>
</div>
```

Lastly, in your JavaScript file, or your inline JavaScript add `new SimInfiniteSlider(items);`, where `items` are the list of items to slide. For example:

```javascript
var items = document.getElementsByClassName('item');
var mySlider = new SimInfiniteSlider(items, {
	margin: 5
});
```

---

## Settings

| Option                   | Type       | Default   |
|--------------------------|------------|-----------|
| `margin`                 | `number`   | 3         |
| `numberOfSlidesToShow`   | `number`   | 2         |
| `lastSlideToShow`        | `number`   | 0 (If set to 0, `lastSlideShown` will be `numberOfSlidesToShow`) |

beforeInit
afterInit
beforeSlide
afterSlide

## Callbacks

| Event Name      | Listener Arguments                          |
|-----------------|---------------------------------------------|
| `beforeInit`    | N/A                                         |
| `afterInit`     | `innerWrapper`, `outerWrapper`              |
| `beforeSlide`   | `newLastSlideShown`, `prevLastSlideShown`   |
| `afterSlide`    | `newLastSlideShown`, `slideAmount`          |

---

## API

| Event Name                 | Listener Arguments   | Event Description   |
|----------------------------|----------------------|---------------------|
| `preventSlide`             | N/A                  | If set to `true`, the slider will never slide until set to `false` |
| `setAmountOfSlidesShown`   | `value`              | Set's amount of slides shown at once. i.e., how many sets of slides. |
| `moveToSlide`              | `index`, `relative`, `animate` | Move to any slide. If `relative` is true, `index` will be based on the previous slide position. Else, `index` will be absolute, so whatever `index` is set to, that's where the slider will slide to.|
| `slideToNextSet`           | `animate`            | Slides to the next set. "Set" is whatever `numberOfSlidesToShow` is set to. Can change it with `setAmountOfSlidesShown()` function.|
| `slideToPrevSet`           | `animate`            | Slides to the previous set. "Set" is whatever `numberOfSlidesToShow` is set to. Can change it with `setAmountOfSlidesShown()` function.|
| `slideToBeginning`         | `animate`            | Slides to beginning of slider |
| `slideToEndAfterDups`      | `animate`            | Slides to absolute end of slider, past the duplicates. See [this](http://stackoverflow.com/questions/15876754/infinity-loop-slider-concepts#comment40701431_15877302) for reason why we need the duplicates. |
| `slideToEndBeforeDups`     | `animate`            | Slides to end of slider, before the duplicates. See [this](http://stackoverflow.com/questions/15876754/infinity-loop-slider-concepts#comment40701431_15877302) for reason why we need the duplicates. |

---

### Dependencies

None! 😊

### License

Copyright (c) 2016 Simcha Cahn

Licensed under the MIT license.

---

I would **love** ❤️ to see feedback, and constructive critsism.

Any question, comments, or to just say "Hello", just email me at: simchacahn(at)gmail.com

