/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 2.5.0
 *
 * Copyright 2017 Nick Downie
 * Released under the MIT license
 * https://github.com/chartjs/Chart.js/blob/master/LICENSE.md
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Chart = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/* MIT license */
var colorNames = require(6);

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/,
       hex =  /^#([a-fA-F0-9]{6})$/,
       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       keyword = /(\w+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = colorNames[match[1]];
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb[3] = a;
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, s, l, a];
   }
}

function getHwb(string) {
   if (!string) {
      return;
   }
   var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hwb);
   if (match) {
    var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          w = scale(parseFloat(match[2]), 0, 100),
          b = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, w, b, a];
   }
}

function getRgb(string) {
   var rgba = getRgba(string);
   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);
  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
   else if (vals = getHwb(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
   if (alpha === undefined) {
      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
   }
   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
}

function keyword(rgb) {
  return reverseNames[rgb.slice(0, 3)];
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}


//create a list of reverse color names
var reverseNames = {};
for (var name in colorNames) {
   reverseNames[colorNames[name]] = name;
}

},{"6":6}],3:[function(require,module,exports){
/* MIT license */
var convert = require(5);
var string = require(2);

var Color = function (obj) {
	if (obj instanceof Color) {
		return obj;
	}
	if (!(this instanceof Color)) {
		return new Color(obj);
	}

	this.values = {
		rgb: [0, 0, 0],
		hsl: [0, 0, 0],
		hsv: [0, 0, 0],
		hwb: [0, 0, 0],
		cmyk: [0, 0, 0, 0],
		alpha: 1
	};

	// parse Color() argument
	var vals;
	if (typeof obj === 'string') {
		vals = string.getRgba(obj);
		if (vals) {
			this.setValues('rgb', vals);
		} else if (vals = string.getHsla(obj)) {
			this.setValues('hsl', vals);
		} else if (vals = string.getHwb(obj)) {
			this.setValues('hwb', vals);
		} else {
			throw new Error('Unable to parse color from string "' + obj + '"');
		}
	} else if (typeof obj === 'object') {
		vals = obj;
		if (vals.r !== undefined || vals.red !== undefined) {
			this.setValues('rgb', vals);
		} else if (vals.l !== undefined || vals.lightness !== undefined) {
			this.setValues('hsl', vals);
		} else if (vals.v !== undefined || vals.value !== undefined) {
			this.setValues('hsv', vals);
		} else if (vals.w !== undefined || vals.whiteness !== undefined) {
			this.setValues('hwb', vals);
		} else if (vals.c !== undefined || vals.cyan !== undefined) {
			this.setValues('cmyk', vals);
		} else {
			throw new Error('Unable to parse color from object ' + JSON.stringify(obj));
		}
	}
};

Color.prototype = {
	rgb: function () {
		return this.setSpace('rgb', arguments);
	},
	hsl: function () {
		return this.setSpace('hsl', arguments);
	},
	hsv: function () {
		return this.setSpace('hsv', arguments);
	},
	hwb: function () {
		return this.setSpace('hwb', arguments);
	},
	cmyk: function () {
		return this.setSpace('cmyk', arguments);
	},

	rgbArray: function () {
		return this.values.rgb;
	},
	hslArray: function () {
		return this.values.hsl;
	},
	hsvArray: function () {
		return this.values.hsv;
	},
	hwbArray: function () {
		var values = this.values;
		if (values.alpha !== 1) {
			return values.hwb.concat([values.alpha]);
		}
		return values.hwb;
	},
	cmykArray: function () {
		return this.values.cmyk;
	},
	rgbaArray: function () {
		var values = this.values;
		return values.rgb.concat([values.alpha]);
	},
	hslaArray: function () {
		var values = this.values;
		return values.hsl.concat([values.alpha]);
	},
	alpha: function (val) {
		if (val === undefined) {
			return this.values.alpha;
		}
		this.setValues('alpha', val);
		return this;
	},

	red: function (val) {
		return this.setChannel('rgb', 0, val);
	},
	green: function (val) {
		return this.setChannel('rgb', 1, val);
	},
	blue: function (val) {
		return this.setChannel('rgb', 2, val);
	},
	hue: function (val) {
		if (val) {
			val %= 360;
			val = val < 0 ? 360 + val : val;
		}
		return this.setChannel('hsl', 0, val);
	},
	saturation: function (val) {
		return this.setChannel('hsl', 1, val);
	},
	lightness: function (val) {
		return this.setChannel('hsl', 2, val);
	},
	saturationv: function (val) {
		return this.setChannel('hsv', 1, val);
	},
	whiteness: function (val) {
		return this.setChannel('hwb', 1, val);
	},
	blackness: function (val) {
		return this.setChannel('hwb', 2, val);
	},
	value: function (val) {
		return this.setChannel('hsv', 2, val);
	},
	cyan: function (val) {
		return this.setChannel('cmyk', 0, val);
	},
	magenta: function (val) {
		return this.setChannel('cmyk', 1, val);
	},
	yellow: function (val) {
		return this.setChannel('cmyk', 2, val);
	},
	black: function (val) {
		return this.setChannel('cmyk', 3, val);
	},

	hexString: function () {
		return string.hexString(this.values.rgb);
	},
	rgbString: function () {
		return string.rgbString(this.values.rgb, this.values.alpha);
	},
	rgbaString: function () {
		return string.rgbaString(this.values.rgb, this.values.alpha);
	},
	percentString: function () {
		return string.percentString(this.values.rgb, this.values.alpha);
	},
	hslString: function () {
		return string.hslString(this.values.hsl, this.values.alpha);
	},
	hslaString: function () {
		return string.hslaString(this.values.hsl, this.values.alpha);
	},
	hwbString: function () {
		return string.hwbString(this.values.hwb, this.values.alpha);
	},
	keyword: function () {
		return string.keyword(this.values.rgb, this.values.alpha);
	},

	rgbNumber: function () {
		var rgb = this.values.rgb;
		return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
	},

	luminosity: function () {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		var rgb = this.values.rgb;
		var lum = [];
		for (var i = 0; i < rgb.length; i++) {
			var chan = rgb[i] / 255;
			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
		}
		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast: function (color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		var lum1 = this.luminosity();
		var lum2 = color2.luminosity();
		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}
		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level: function (color2) {
		var contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	dark: function () {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		var rgb = this.values.rgb;
		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	light: function () {
		return !this.dark();
	},

	negate: function () {
		var rgb = [];
		for (var i = 0; i < 3; i++) {
			rgb[i] = 255 - this.values.rgb[i];
		}
		this.setValues('rgb', rgb);
		return this;
	},

	lighten: function (ratio) {
		var hsl = this.values.hsl;
		hsl[2] += hsl[2] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	darken: function (ratio) {
		var hsl = this.values.hsl;
		hsl[2] -= hsl[2] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	saturate: function (ratio) {
		var hsl = this.values.hsl;
		hsl[1] += hsl[1] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	desaturate: function (ratio) {
		var hsl = this.values.hsl;
		hsl[1] -= hsl[1] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	whiten: function (ratio) {
		var hwb = this.values.hwb;
		hwb[1] += hwb[1] * ratio;
		this.setValues('hwb', hwb);
		return this;
	},

	blacken: function (ratio) {
		var hwb = this.values.hwb;
		hwb[2] += hwb[2] * ratio;
		this.setValues('hwb', hwb);
		return this;
	},

	greyscale: function () {
		var rgb = this.values.rgb;
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		this.setValues('rgb', [val, val, val]);
		return this;
	},

	clearer: function (ratio) {
		var alpha = this.values.alpha;
		this.setValues('alpha', alpha - (alpha * ratio));
		return this;
	},

	opaquer: function (ratio) {
		var alpha = this.values.alpha;
		this.setValues('alpha', alpha + (alpha * ratio));
		return this;
	},

	rotate: function (degrees) {
		var hsl = this.values.hsl;
		var hue = (hsl[0] + degrees) % 360;
		hsl[0] = hue < 0 ? 360 + hue : hue;
		this.setValues('hsl', hsl);
		return this;
	},

	/**
	 * Ported from sass implementation in C
	 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
	 */
	mix: function (mixinColor, weight) {
		var color1 = this;
		var color2 = mixinColor;
		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;
		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
		var w2 = 1 - w1;

		return this
			.rgb(
				w1 * color1.red() + w2 * color2.red(),
				w1 * color1.green() + w2 * color2.green(),
				w1 * color1.blue() + w2 * color2.blue()
			)
			.alpha(color1.alpha() * p + color2.alpha() * (1 - p));
	},

	toJSON: function () {
		return this.rgb();
	},

	clone: function () {
		// NOTE(SB): using node-clone creates a dependency to Buffer when using browserify,
		// making the final build way to big to embed in Chart.js. So let's do it manually,
		// assuming that values to clone are 1 dimension arrays containing only numbers,
		// except 'alpha' which is a number.
		var result = new Color();
		var source = this.values;
		var target = result.values;
		var value, type;

		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {
				value = source[prop];
				type = ({}).toString.call(value);
				if (type === '[object Array]') {
					target[prop] = value.slice(0);
				} else if (type === '[object Number]') {
					target[prop] = value;
				} else {
					console.error('unexpected color value:', value);
				}
			}
		}

		return result;
	}
};

Color.prototype.spaces = {
	rgb: ['red', 'green', 'blue'],
	hsl: ['hue', 'saturation', 'lightness'],
	hsv: ['hue', 'saturation', 'value'],
	hwb: ['hue', 'whiteness', 'blackness'],
	cmyk: ['cyan', 'magenta', 'yellow', 'black']
};

Color.prototype.maxes = {
	rgb: [255, 255, 255],
	hsl: [360, 100, 100],
	hsv: [360, 100, 100],
	hwb: [360, 100, 100],
	cmyk: [100, 100, 100, 100]
};

Color.prototype.getValues = function (space) {
	var values = this.values;
	var vals = {};

	for (var i = 0; i < space.length; i++) {
		vals[space.charAt(i)] = values[space][i];
	}

	if (values.alpha !== 1) {
		vals.a = values.alpha;
	}

	// {r: 255, g: 255, b: 255, a: 0.4}
	return vals;
};

Color.prototype.setValues = function (space, vals) {
	var values = this.values;
	var spaces = this.spaces;
	var maxes = this.maxes;
	var alpha = 1;
	var i;

	if (space === 'alpha') {
		alpha = vals;
	} else if (vals.length) {
		// [10, 10, 10]
		values[space] = vals.slice(0, space.length);
		alpha = vals[space.length];
	} else if (vals[space.charAt(0)] !== undefined) {
		// {r: 10, g: 10, b: 10}
		for (i = 0; i < space.length; i++) {
			values[space][i] = vals[space.charAt(i)];
		}

		alpha = vals.a;
	} else if (vals[spaces[space][0]] !== undefined) {
		// {red: 10, green: 10, blue: 10}
		var chans = spaces[space];

		for (i = 0; i < space.length; i++) {
			values[space][i] = vals[chans[i]];
		}

		alpha = vals.alpha;
	}

	values.alpha = Math.max(0, Math.min(1, (alpha === undefined ? values.alpha : alpha)));

	if (space === 'alpha') {
		return false;
	}

	var capped;

	// cap values of the space prior converting all values
	for (i = 0; i < space.length; i++) {
		capped = Math.max(0, Math.min(maxes[space][i], values[space][i]));
		values[space][i] = Math.round(capped);
	}

	// convert to all the other color spaces
	for (var sname in spaces) {
		if (sname !== space) {
			values[sname] = convert[space][sname](values[space]);
		}
	}

	return true;
};

Color.prototype.setSpace = function (space, args) {
	var vals = args[0];

	if (vals === undefined) {
		// color.rgb()
		return this.getValues(space);
	}

	// color.rgb(10, 10, 10)
	if (typeof vals === 'number') {
		vals = Array.prototype.slice.call(args);
	}

	this.setValues(space, vals);
	return this;
};

Color.prototype.setChannel = function (space, index, val) {
	var svalues = this.values[space];
	if (val === undefined) {
		// color.red()
		return svalues[index];
	} else if (val === svalues[index]) {
		// color.red(color.red())
		return this;
	}

	// color.red(100)
	svalues[index] = val;
	this.setValues(space, svalues);

	return this;
};

if (typeof window !== 'undefined') {
	window.Color = Color;
}

module.exports = Color;

},{"2":2,"5":5}],4:[function(require,module,exports){
/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;

  if(l === 0) {
      // no need to do calc on black
      // also avoids divide by 0 error
      return [0, 0, 0];
  }

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

},{}],5:[function(require,module,exports){
var conversions = require(4);

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;
},{"4":4}],6:[function(require,module,exports){
module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};
},{}],7:[function(require,module,exports){
/**
 * @namespace Chart
 */
var Chart = require(28)();

require(26)(Chart);
require(42)(Chart);
require(22)(Chart);
require(31)(Chart);
require(25)(Chart);
require(21)(Chart);
require(23)(Chart);
require(24)(Chart);
require(29)(Chart);
require(33)(Chart);
require(34)(Chart);
require(32)(Chart);
require(35)(Chart);
require(30)(Chart);
require(27)(Chart);
require(36)(Chart);

require(37)(Chart);
require(38)(Chart);
require(39)(Chart);
require(40)(Chart);

require(45)(Chart);
require(43)(Chart);
require(44)(Chart);
require(46)(Chart);
require(47)(Chart);
require(48)(Chart);

// Controllers must be loaded after elements
// See Chart.core.datasetController.dataElementType
require(15)(Chart);
require(16)(Chart);
require(17)(Chart);
require(18)(Chart);
require(19)(Chart);
require(20)(Chart);

require(8)(Chart);
require(9)(Chart);
require(10)(Chart);
require(11)(Chart);
require(12)(Chart);
require(13)(Chart);
require(14)(Chart);

window.Chart = module.exports = Chart;

},{"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"20":20,"21":21,"22":22,"23":23,"24":24,"25":25,"26":26,"27":27,"28":28,"29":29,"30":30,"31":31,"32":32,"33":33,"34":34,"35":35,"36":36,"37":37,"38":38,"39":39,"40":40,"42":42,"43":43,"44":44,"45":45,"46":46,"47":47,"48":48,"8":8,"9":9}],8:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Bar = function(context, config) {
		config.type = 'bar';

		return new Chart(context, config);
	};

};

},{}],9:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Bubble = function(context, config) {
		config.type = 'bubble';
		return new Chart(context, config);
	};

};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Doughnut = function(context, config) {
		config.type = 'doughnut';

		return new Chart(context, config);
	};

};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Line = function(context, config) {
		config.type = 'line';

		return new Chart(context, config);
	};

};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.PolarArea = function(context, config) {
		config.type = 'polarArea';

		return new Chart(context, config);
	};

};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Radar = function(context, config) {
		config.type = 'radar';

		return new Chart(context, config);
	};

};

},{}],14:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var defaultConfig = {
		hover: {
			mode: 'single'
		},

		scales: {
			xAxes: [{
				type: 'linear', // scatter should not use a category axis
				position: 'bottom',
				id: 'x-axis-1' // need an ID so datasets can reference the scale
			}],
			yAxes: [{
				type: 'linear',
				position: 'left',
				id: 'y-axis-1'
			}]
		},

		tooltips: {
			callbacks: {
				title: function() {
					// Title doesn't make sense for scatter since we format the data as a point
					return '';
				},
				label: function(tooltipItem) {
					return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
				}
			}
		}
	};

	// Register the default config for this type
	Chart.defaults.scatter = defaultConfig;

	// Scatter charts use line controllers
	Chart.controllers.scatter = Chart.controllers.line;

	Chart.Scatter = function(context, config) {
		config.type = 'scatter';
		return new Chart(context, config);
	};

};

},{}],15:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.bar = {
		hover: {
			mode: 'label'
		},

		scales: {
			xAxes: [{
				type: 'category',

				// Specific to Bar Controller
				categoryPercentage: 0.8,
				barPercentage: 0.9,

				// grid line settings
				gridLines: {
					offsetGridLines: true
				}
			}],
			yAxes: [{
				type: 'linear'
			}]
		}
	};

	Chart.controllers.bar = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Rectangle,

		initialize: function(chart, datasetIndex) {
			Chart.DatasetController.prototype.initialize.call(this, chart, datasetIndex);

			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();

			meta.stack = dataset.stack;
			// Use this to indicate that this is a bar dataset.
			meta.bar = true;
		},

		// Correctly calculate the bar width accounting for stacks and the fact that not all bars are visible
		getStackCount: function() {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);

			var stacks = [];
			helpers.each(me.chart.data.datasets, function(dataset, datasetIndex) {
				var dsMeta = me.chart.getDatasetMeta(datasetIndex);
				if (dsMeta.bar && me.chart.isDatasetVisible(datasetIndex) &&
					(yScale.options.stacked === false ||
					(yScale.options.stacked === true && stacks.indexOf(dsMeta.stack) === -1) ||
					(yScale.options.stacked === undefined && (dsMeta.stack === undefined || stacks.indexOf(dsMeta.stack) === -1)))) {
					stacks.push(dsMeta.stack);
				}
			}, me);

			return stacks.length;
		},

		update: function(reset) {
			var me = this;
			helpers.each(me.getMeta().data, function(rectangle, index) {
				me.updateElement(rectangle, index, reset);
			}, me);
		},

		updateElement: function(rectangle, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var yScale = me.getScaleForId(meta.yAxisID);
			var scaleBase = yScale.getBasePixel();
			var rectangleElementOptions = me.chart.options.elements.rectangle;
			var custom = rectangle.custom || {};
			var dataset = me.getDataset();

			rectangle._xScale = xScale;
			rectangle._yScale = yScale;
			rectangle._datasetIndex = me.index;
			rectangle._index = index;

			var ruler = me.getRuler(index); // The index argument for compatible
			rectangle._model = {
				x: me.calculateBarX(index, me.index, ruler),
				y: reset ? scaleBase : me.calculateBarY(index, me.index),

				// Tooltip
				label: me.chart.data.labels[index],
				datasetLabel: dataset.label,

				// Appearance
				horizontal: false,
				base: reset ? scaleBase : me.calculateBarBase(me.index, index),
				width: me.calculateBarWidth(ruler),
				backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
				borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
				borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
				borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
			};

			rectangle.pivot();
		},

		calculateBarBase: function(datasetIndex, index) {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var base = yScale.getBaseValue();
			var original = base;

			if ((yScale.options.stacked === true) ||
				(yScale.options.stacked === undefined && meta.stack !== undefined)) {
				var chart = me.chart;
				var datasets = chart.data.datasets;
				var value = Number(datasets[datasetIndex].data[index]);

				for (var i = 0; i < datasetIndex; i++) {
					var currentDs = datasets[i];
					var currentDsMeta = chart.getDatasetMeta(i);
					if (currentDsMeta.bar && currentDsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i) &&
						meta.stack === currentDsMeta.stack) {
						var currentVal = Number(currentDs.data[index]);
						base += value < 0 ? Math.min(currentVal, original) : Math.max(currentVal, original);
					}
				}

				return yScale.getPixelForValue(base);
			}

			return yScale.getBasePixel();
		},

		getRuler: function() {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var stackCount = me.getStackCount();

			var tickWidth = xScale.width / xScale.ticks.length;
			var categoryWidth = tickWidth * xScale.options.categoryPercentage;
			var categorySpacing = (tickWidth - (tickWidth * xScale.options.categoryPercentage)) / 2;
			var fullBarWidth = categoryWidth / stackCount;

			var barWidth = fullBarWidth * xScale.options.barPercentage;
			var barSpacing = fullBarWidth - (fullBarWidth * xScale.options.barPercentage);

			return {
				stackCount: stackCount,
				tickWidth: tickWidth,
				categoryWidth: categoryWidth,
				categorySpacing: categorySpacing,
				fullBarWidth: fullBarWidth,
				barWidth: barWidth,
				barSpacing: barSpacing
			};
		},

		calculateBarWidth: function(ruler) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			if (xScale.options.barThickness) {
				return xScale.options.barThickness;
			}
			return ruler.barWidth;
		},

		// Get stack index from the given dataset index accounting for stacks and the fact that not all bars are visible
		getStackIndex: function(datasetIndex) {
			var me = this;
			var meta = me.chart.getDatasetMeta(datasetIndex);
			var yScale = me.getScaleForId(meta.yAxisID);
			var dsMeta, j;
			var stacks = [meta.stack];

			for (j = 0; j < datasetIndex; ++j) {
				dsMeta = this.chart.getDatasetMeta(j);
				if (dsMeta.bar && this.chart.isDatasetVisible(j) &&
					(yScale.options.stacked === false ||
					(yScale.options.stacked === true && stacks.indexOf(dsMeta.stack) === -1) ||
					(yScale.options.stacked === undefined && (dsMeta.stack === undefined || stacks.indexOf(dsMeta.stack) === -1)))) {
					stacks.push(dsMeta.stack);
				}
			}

			return stacks.length - 1;
		},

		calculateBarX: function(index, datasetIndex, ruler) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var stackIndex = me.getStackIndex(datasetIndex);
			var leftTick = xScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
			leftTick -= me.chart.isCombo ? (ruler.tickWidth / 2) : 0;

			return leftTick +
				(ruler.barWidth / 2) +
				ruler.categorySpacing +
				(ruler.barWidth * stackIndex) +
				(ruler.barSpacing / 2) +
				(ruler.barSpacing * stackIndex);
		},

		calculateBarY: function(index, datasetIndex) {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var value = Number(me.getDataset().data[index]);

			if (yScale.options.stacked ||
				(yScale.options.stacked === undefined && meta.stack !== undefined)) {
				var base = yScale.getBaseValue();
				var sumPos = base,
					sumNeg = base;

				for (var i = 0; i < datasetIndex; i++) {
					var ds = me.chart.data.datasets[i];
					var dsMeta = me.chart.getDatasetMeta(i);
					if (dsMeta.bar && dsMeta.yAxisID === yScale.id && me.chart.isDatasetVisible(i) &&
						meta.stack === dsMeta.stack) {
						var stackedVal = Number(ds.data[index]);
						if (stackedVal < 0) {
							sumNeg += stackedVal || 0;
						} else {
							sumPos += stackedVal || 0;
						}
					}
				}

				if (value < 0) {
					return yScale.getPixelForValue(sumNeg + value);
				}
				return yScale.getPixelForValue(sumPos + value);
			}

			return yScale.getPixelForValue(value);
		},

		draw: function(ease) {
			var me = this;
			var easingDecimal = ease || 1;
			var metaData = me.getMeta().data;
			var dataset = me.getDataset();
			var i, len;

			Chart.canvasHelpers.clipArea(me.chart.chart.ctx, me.chart.chartArea);
			for (i = 0, len = metaData.length; i < len; ++i) {
				var d = dataset.data[i];
				if (d !== null && d !== undefined && !isNaN(d)) {
					metaData[i].transition(easingDecimal).draw();
				}
			}
			Chart.canvasHelpers.unclipArea(me.chart.chart.ctx);
		},

		setHoverStyle: function(rectangle) {
			var dataset = this.chart.data.datasets[rectangle._datasetIndex];
			var index = rectangle._index;

			var custom = rectangle.custom || {};
			var model = rectangle._model;
			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.hoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.hoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(rectangle) {
			var dataset = this.chart.data.datasets[rectangle._datasetIndex];
			var index = rectangle._index;
			var custom = rectangle.custom || {};
			var model = rectangle._model;
			var rectangleElementOptions = this.chart.options.elements.rectangle;

			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth);
		}

	});


	// including horizontalBar in the bar file, instead of a file of its own
	// it extends bar (like pie extends doughnut)
	Chart.defaults.horizontalBar = {
		hover: {
			mode: 'label'
		},

		scales: {
			xAxes: [{
				type: 'linear',
				position: 'bottom'
			}],
			yAxes: [{
				position: 'left',
				type: 'category',

				// Specific to Horizontal Bar Controller
				categoryPercentage: 0.8,
				barPercentage: 0.9,

				// grid line settings
				gridLines: {
					offsetGridLines: true
				}
			}]
		},
		elements: {
			rectangle: {
				borderSkipped: 'left'
			}
		},
		tooltips: {
			callbacks: {
				title: function(tooltipItems, data) {
					// Pick first xLabel for now
					var title = '';

					if (tooltipItems.length > 0) {
						if (tooltipItems[0].yLabel) {
							title = tooltipItems[0].yLabel;
						} else if (data.labels.length > 0 && tooltipItems[0].index < data.labels.length) {
							title = data.labels[tooltipItems[0].index];
						}
					}

					return title;
				},
				label: function(tooltipItem, data) {
					var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
					return datasetLabel + ': ' + tooltipItem.xLabel;
				}
			}
		}
	};

	Chart.controllers.horizontalBar = Chart.controllers.bar.extend({

		// Correctly calculate the bar width accounting for stacks and the fact that not all bars are visible
		getStackCount: function() {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);

			var stacks = [];
			helpers.each(me.chart.data.datasets, function(dataset, datasetIndex) {
				var dsMeta = me.chart.getDatasetMeta(datasetIndex);
				if (dsMeta.bar && me.chart.isDatasetVisible(datasetIndex) &&
					(xScale.options.stacked === false ||
					(xScale.options.stacked === true && stacks.indexOf(dsMeta.stack) === -1) ||
					(xScale.options.stacked === undefined && (dsMeta.stack === undefined || stacks.indexOf(dsMeta.stack) === -1)))) {
					stacks.push(dsMeta.stack);
				}
			}, me);

			return stacks.length;
		},

		updateElement: function(rectangle, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var yScale = me.getScaleForId(meta.yAxisID);
			var scaleBase = xScale.getBasePixel();
			var custom = rectangle.custom || {};
			var dataset = me.getDataset();
			var rectangleElementOptions = me.chart.options.elements.rectangle;

			rectangle._xScale = xScale;
			rectangle._yScale = yScale;
			rectangle._datasetIndex = me.index;
			rectangle._index = index;

			var ruler = me.getRuler(index); // The index argument for compatible
			rectangle._model = {
				x: reset ? scaleBase : me.calculateBarX(index, me.index),
				y: me.calculateBarY(index, me.index, ruler),

				// Tooltip
				label: me.chart.data.labels[index],
				datasetLabel: dataset.label,

				// Appearance
				horizontal: true,
				base: reset ? scaleBase : me.calculateBarBase(me.index, index),
				height: me.calculateBarHeight(ruler),
				backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
				borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
				borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
				borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
			};

			rectangle.pivot();
		},

		calculateBarBase: function(datasetIndex, index) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var base = xScale.getBaseValue();
			var originalBase = base;

			if (xScale.options.stacked ||
				(xScale.options.stacked === undefined && meta.stack !== undefined)) {
				var chart = me.chart;
				var datasets = chart.data.datasets;
				var value = Number(datasets[datasetIndex].data[index]);

				for (var i = 0; i < datasetIndex; i++) {
					var currentDs = datasets[i];
					var currentDsMeta = chart.getDatasetMeta(i);
					if (currentDsMeta.bar && currentDsMeta.xAxisID === xScale.id && chart.isDatasetVisible(i) &&
						meta.stack === currentDsMeta.stack) {
						var currentVal = Number(currentDs.data[index]);
						base += value < 0 ? Math.min(currentVal, originalBase) : Math.max(currentVal, originalBase);
					}
				}

				return xScale.getPixelForValue(base);
			}

			return xScale.getBasePixel();
		},

		getRuler: function() {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var stackCount = me.getStackCount();

			var tickHeight = yScale.height / yScale.ticks.length;
			var categoryHeight = tickHeight * yScale.options.categoryPercentage;
			var categorySpacing = (tickHeight - (tickHeight * yScale.options.categoryPercentage)) / 2;
			var fullBarHeight = categoryHeight / stackCount;

			var barHeight = fullBarHeight * yScale.options.barPercentage;
			var barSpacing = fullBarHeight - (fullBarHeight * yScale.options.barPercentage);

			return {
				stackCount: stackCount,
				tickHeight: tickHeight,
				categoryHeight: categoryHeight,
				categorySpacing: categorySpacing,
				fullBarHeight: fullBarHeight,
				barHeight: barHeight,
				barSpacing: barSpacing
			};
		},

		calculateBarHeight: function(ruler) {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			if (yScale.options.barThickness) {
				return yScale.options.barThickness;
			}
			return ruler.barHeight;
		},

		// Get stack index from the given dataset index accounting for stacks and the fact that not all bars are visible
		getStackIndex: function(datasetIndex) {
			var me = this;
			var meta = me.chart.getDatasetMeta(datasetIndex);
			var xScale = me.getScaleForId(meta.xAxisID);
			var dsMeta, j;
			var stacks = [meta.stack];

			for (j = 0; j < datasetIndex; ++j) {
				dsMeta = this.chart.getDatasetMeta(j);
				if (dsMeta.bar && this.chart.isDatasetVisible(j) &&
					(xScale.options.stacked === false ||
					(xScale.options.stacked === true && stacks.indexOf(dsMeta.stack) === -1) ||
					(xScale.options.stacked === undefined && (dsMeta.stack === undefined || stacks.indexOf(dsMeta.stack) === -1)))) {
					stacks.push(dsMeta.stack);
				}
			}

			return stacks.length - 1;
		},

		calculateBarX: function(index, datasetIndex) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var value = Number(me.getDataset().data[index]);

			if (xScale.options.stacked ||
				(xScale.options.stacked === undefined && meta.stack !== undefined)) {
				var base = xScale.getBaseValue();
				var sumPos = base,
					sumNeg = base;

				for (var i = 0; i < datasetIndex; i++) {
					var ds = me.chart.data.datasets[i];
					var dsMeta = me.chart.getDatasetMeta(i);
					if (dsMeta.bar && dsMeta.xAxisID === xScale.id && me.chart.isDatasetVisible(i) &&
						meta.stack === dsMeta.stack) {
						var stackedVal = Number(ds.data[index]);
						if (stackedVal < 0) {
							sumNeg += stackedVal || 0;
						} else {
							sumPos += stackedVal || 0;
						}
					}
				}

				if (value < 0) {
					return xScale.getPixelForValue(sumNeg + value);
				}
				return xScale.getPixelForValue(sumPos + value);
			}

			return xScale.getPixelForValue(value);
		},

		calculateBarY: function(index, datasetIndex, ruler) {
			var me = this;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var stackIndex = me.getStackIndex(datasetIndex);
			var topTick = yScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
			topTick -= me.chart.isCombo ? (ruler.tickHeight / 2) : 0;

			return topTick +
				(ruler.barHeight / 2) +
				ruler.categorySpacing +
				(ruler.barHeight * stackIndex) +
				(ruler.barSpacing / 2) +
				(ruler.barSpacing * stackIndex);
		}
	});
};

},{}],16:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.bubble = {
		hover: {
			mode: 'single'
		},

		scales: {
			xAxes: [{
				type: 'linear', // bubble should probably use a linear scale by default
				position: 'bottom',
				id: 'x-axis-0' // need an ID so datasets can reference the scale
			}],
			yAxes: [{
				type: 'linear',
				position: 'left',
				id: 'y-axis-0'
			}]
		},

		tooltips: {
			callbacks: {
				title: function() {
					// Title doesn't make sense for scatter since we format the data as a point
					return '';
				},
				label: function(tooltipItem, data) {
					var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
					var dataPoint = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
					return datasetLabel + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ', ' + dataPoint.r + ')';
				}
			}
		}
	};

	Chart.controllers.bubble = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Point,

		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var points = meta.data;

			// Update Points
			helpers.each(points, function(point, index) {
				me.updateElement(point, index, reset);
			});
		},

		updateElement: function(point, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var xScale = me.getScaleForId(meta.xAxisID);
			var yScale = me.getScaleForId(meta.yAxisID);

			var custom = point.custom || {};
			var dataset = me.getDataset();
			var data = dataset.data[index];
			var pointElementOptions = me.chart.options.elements.point;
			var dsIndex = me.index;

			helpers.extend(point, {
				// Utility
				_xScale: xScale,
				_yScale: yScale,
				_datasetIndex: dsIndex,
				_index: index,

				// Desired view properties
				_model: {
					x: reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex, me.chart.isCombo),
					y: reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex),
					// Appearance
					radius: reset ? 0 : custom.radius ? custom.radius : me.getRadius(data),

					// Tooltip
					hitRadius: custom.hitRadius ? custom.hitRadius : helpers.getValueAtIndexOrDefault(dataset.hitRadius, index, pointElementOptions.hitRadius)
				}
			});

			// Trick to reset the styles of the point
			Chart.DatasetController.prototype.removeHoverStyle.call(me, point, pointElementOptions);

			var model = point._model;
			model.skip = custom.skip ? custom.skip : (isNaN(model.x) || isNaN(model.y));

			point.pivot();
		},

		getRadius: function(value) {
			return value.r || this.chart.options.elements.point.radius;
		},

		setHoverStyle: function(point) {
			var me = this;
			Chart.DatasetController.prototype.setHoverStyle.call(me, point);

			// Radius
			var dataset = me.chart.data.datasets[point._datasetIndex];
			var index = point._index;
			var custom = point.custom || {};
			var model = point._model;
			model.radius = custom.hoverRadius ? custom.hoverRadius : (helpers.getValueAtIndexOrDefault(dataset.hoverRadius, index, me.chart.options.elements.point.hoverRadius)) + me.getRadius(dataset.data[index]);
		},

		removeHoverStyle: function(point) {
			var me = this;
			Chart.DatasetController.prototype.removeHoverStyle.call(me, point, me.chart.options.elements.point);

			var dataVal = me.chart.data.datasets[point._datasetIndex].data[point._index];
			var custom = point.custom || {};
			var model = point._model;

			model.radius = custom.radius ? custom.radius : me.getRadius(dataVal);
		}
	});
};

},{}],17:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		defaults = Chart.defaults;

	defaults.doughnut = {
		animation: {
			// Boolean - Whether we animate the rotation of the Doughnut
			animateRotate: true,
			// Boolean - Whether we animate scaling the Doughnut from the centre
			animateScale: false
		},
		aspectRatio: 1,
		hover: {
			mode: 'single'
		},
		legendCallback: function(chart) {
			var text = [];
			text.push('<ul class="' + chart.id + '-legend">');

			var data = chart.data;
			var datasets = data.datasets;
			var labels = data.labels;

			if (datasets.length) {
				for (var i = 0; i < datasets[0].data.length; ++i) {
					text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
					if (labels[i]) {
						text.push(labels[i]);
					}
					text.push('</li>');
				}
			}

			text.push('</ul>');
			return text.join('');
		},
		legend: {
			labels: {
				generateLabels: function(chart) {
					var data = chart.data;
					if (data.labels.length && data.datasets.length) {
						return data.labels.map(function(label, i) {
							var meta = chart.getDatasetMeta(0);
							var ds = data.datasets[0];
							var arc = meta.data[i];
							var custom = arc && arc.custom || {};
							var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
							var arcOpts = chart.options.elements.arc;
							var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
							var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
							var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

							return {
								text: label,
								fillStyle: fill,
								strokeStyle: stroke,
								lineWidth: bw,
								hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

								// Extra data used for toggling the correct item
								index: i
							};
						});
					}
					return [];
				}
			},

			onClick: function(e, legendItem) {
				var index = legendItem.index;
				var chart = this.chart;
				var i, ilen, meta;

				for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
					meta = chart.getDatasetMeta(i);
					// toggle visibility of index if exists
					if (meta.data[index]) {
						meta.data[index].hidden = !meta.data[index].hidden;
					}
				}

				chart.update();
			}
		},

		// The percentage of the chart that we cut out of the middle.
		cutoutPercentage: 50,

		// The rotation of the chart, where the first data arc begins.
		rotation: Math.PI * -0.5,

		// The total circumference of the chart.
		circumference: Math.PI * 2.0,

		// Need to override these to give a nice default
		tooltips: {
			callbacks: {
				title: function() {
					return '';
				},
				label: function(tooltipItem, data) {
					var dataLabel = data.labels[tooltipItem.index];
					var value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

					if (helpers.isArray(dataLabel)) {
						// show value on first line of multiline label
						// need to clone because we are changing the value
						dataLabel = dataLabel.slice();
						dataLabel[0] += value;
					} else {
						dataLabel += value;
					}

					return dataLabel;
				}
			}
		}
	};

	defaults.pie = helpers.clone(defaults.doughnut);
	helpers.extend(defaults.pie, {
		cutoutPercentage: 0
	});


	Chart.controllers.doughnut = Chart.controllers.pie = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Arc,

		linkScales: helpers.noop,

		// Get index of the dataset in relation to the visible datasets. This allows determining the inner and outer radius correctly
		getRingIndex: function(datasetIndex) {
			var ringIndex = 0;

			for (var j = 0; j < datasetIndex; ++j) {
				if (this.chart.isDatasetVisible(j)) {
					++ringIndex;
				}
			}

			return ringIndex;
		},

		update: function(reset) {
			var me = this;
			var chart = me.chart,
				chartArea = chart.chartArea,
				opts = chart.options,
				arcOpts = opts.elements.arc,
				availableWidth = chartArea.right - chartArea.left - arcOpts.borderWidth,
				availableHeight = chartArea.bottom - chartArea.top - arcOpts.borderWidth,
				minSize = Math.min(availableWidth, availableHeight),
				offset = {
					x: 0,
					y: 0
				},
				meta = me.getMeta(),
				cutoutPercentage = opts.cutoutPercentage,
				circumference = opts.circumference;

			// If the chart's circumference isn't a full circle, calculate minSize as a ratio of the width/height of the arc
			if (circumference < Math.PI * 2.0) {
				var startAngle = opts.rotation % (Math.PI * 2.0);
				startAngle += Math.PI * 2.0 * (startAngle >= Math.PI ? -1 : startAngle < -Math.PI ? 1 : 0);
				var endAngle = startAngle + circumference;
				var start = {x: Math.cos(startAngle), y: Math.sin(startAngle)};
				var end = {x: Math.cos(endAngle), y: Math.sin(endAngle)};
				var contains0 = (startAngle <= 0 && 0 <= endAngle) || (startAngle <= Math.PI * 2.0 && Math.PI * 2.0 <= endAngle);
				var contains90 = (startAngle <= Math.PI * 0.5 && Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 2.5 && Math.PI * 2.5 <= endAngle);
				var contains180 = (startAngle <= -Math.PI && -Math.PI <= endAngle) || (startAngle <= Math.PI && Math.PI <= endAngle);
				var contains270 = (startAngle <= -Math.PI * 0.5 && -Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 1.5 && Math.PI * 1.5 <= endAngle);
				var cutout = cutoutPercentage / 100.0;
				var min = {x: contains180 ? -1 : Math.min(start.x * (start.x < 0 ? 1 : cutout), end.x * (end.x < 0 ? 1 : cutout)), y: contains270 ? -1 : Math.min(start.y * (start.y < 0 ? 1 : cutout), end.y * (end.y < 0 ? 1 : cutout))};
				var max = {x: contains0 ? 1 : Math.max(start.x * (start.x > 0 ? 1 : cutout), end.x * (end.x > 0 ? 1 : cutout)), y: contains90 ? 1 : Math.max(start.y * (start.y > 0 ? 1 : cutout), end.y * (end.y > 0 ? 1 : cutout))};
				var size = {width: (max.x - min.x) * 0.5, height: (max.y - min.y) * 0.5};
				minSize = Math.min(availableWidth / size.width, availableHeight / size.height);
				offset = {x: (max.x + min.x) * -0.5, y: (max.y + min.y) * -0.5};
			}

			chart.borderWidth = me.getMaxBorderWidth(meta.data);
			chart.outerRadius = Math.max((minSize - chart.borderWidth) / 2, 0);
			chart.innerRadius = Math.max(cutoutPercentage ? (chart.outerRadius / 100) * (cutoutPercentage) : 0, 0);
			chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
			chart.offsetX = offset.x * chart.outerRadius;
			chart.offsetY = offset.y * chart.outerRadius;

			meta.total = me.calculateTotal();

			me.outerRadius = chart.outerRadius - (chart.radiusLength * me.getRingIndex(me.index));
			me.innerRadius = Math.max(me.outerRadius - chart.radiusLength, 0);

			helpers.each(meta.data, function(arc, index) {
				me.updateElement(arc, index, reset);
			});
		},

		updateElement: function(arc, index, reset) {
			var me = this;
			var chart = me.chart,
				chartArea = chart.chartArea,
				opts = chart.options,
				animationOpts = opts.animation,
				centerX = (chartArea.left + chartArea.right) / 2,
				centerY = (chartArea.top + chartArea.bottom) / 2,
				startAngle = opts.rotation, // non reset case handled later
				endAngle = opts.rotation, // non reset case handled later
				dataset = me.getDataset(),
				circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
				innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius,
				outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius,
				valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

			helpers.extend(arc, {
				// Utility
				_datasetIndex: me.index,
				_index: index,

				// Desired view properties
				_model: {
					x: centerX + chart.offsetX,
					y: centerY + chart.offsetY,
					startAngle: startAngle,
					endAngle: endAngle,
					circumference: circumference,
					outerRadius: outerRadius,
					innerRadius: innerRadius,
					label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
				}
			});

			var model = arc._model;
			// Resets the visual styles
			this.removeHoverStyle(arc);

			// Set correct angles if not resetting
			if (!reset || !animationOpts.animateRotate) {
				if (index === 0) {
					model.startAngle = opts.rotation;
				} else {
					model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
				}

				model.endAngle = model.startAngle + model.circumference;
			}

			arc.pivot();
		},

		removeHoverStyle: function(arc) {
			Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
		},

		calculateTotal: function() {
			var dataset = this.getDataset();
			var meta = this.getMeta();
			var total = 0;
			var value;

			helpers.each(meta.data, function(element, index) {
				value = dataset.data[index];
				if (!isNaN(value) && !element.hidden) {
					total += Math.abs(value);
				}
			});

			/* if (total === 0) {
				total = NaN;
			}*/

			return total;
		},

		calculateCircumference: function(value) {
			var total = this.getMeta().total;
			if (total > 0 && !isNaN(value)) {
				return (Math.PI * 2.0) * (value / total);
			}
			return 0;
		},

		// gets the max border or hover width to properly scale pie charts
		getMaxBorderWidth: function(elements) {
			var max = 0,
				index = this.index,
				length = elements.length,
				borderWidth,
				hoverWidth;

			for (var i = 0; i < length; i++) {
				borderWidth = elements[i]._model ? elements[i]._model.borderWidth : 0;
				hoverWidth = elements[i]._chart ? elements[i]._chart.config.data.datasets[index].hoverBorderWidth : 0;

				max = borderWidth > max ? borderWidth : max;
				max = hoverWidth > max ? hoverWidth : max;
			}
			return max;
		}
	});
};

},{}],18:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.line = {
		showLines: true,
		spanGaps: false,

		hover: {
			mode: 'label'
		},

		scales: {
			xAxes: [{
				type: 'category',
				id: 'x-axis-0'
			}],
			yAxes: [{
				type: 'linear',
				id: 'y-axis-0'
			}]
		}
	};

	function lineEnabled(dataset, options) {
		return helpers.getValueOrDefault(dataset.showLine, options.showLines);
	}

	Chart.controllers.line = Chart.DatasetController.extend({

		datasetElementType: Chart.elements.Line,

		dataElementType: Chart.elements.Point,

		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var line = meta.dataset;
			var points = meta.data || [];
			var options = me.chart.options;
			var lineElementOptions = options.elements.line;
			var scale = me.getScaleForId(meta.yAxisID);
			var i, ilen, custom;
			var dataset = me.getDataset();
			var showLine = lineEnabled(dataset, options);

			// Update Line
			if (showLine) {
				custom = line.custom || {};

				// Compatibility: If the properties are defined with only the old name, use those values
				if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
					dataset.lineTension = dataset.tension;
				}

				// Utility
				line._scale = scale;
				line._datasetIndex = me.index;
				// Data
				line._children = points;
				// Model
				line._model = {
					// Appearance
					// The default behavior of lines is to break at null values, according
					// to https://github.com/chartjs/Chart.js/issues/2435#issuecomment-216718158
					// This option gives lines the ability to span gaps
					spanGaps: dataset.spanGaps ? dataset.spanGaps : options.spanGaps,
					tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, lineElementOptions.tension),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
					borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
					borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
					borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
					borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
					borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),
					fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
					steppedLine: custom.steppedLine ? custom.steppedLine : helpers.getValueOrDefault(dataset.steppedLine, lineElementOptions.stepped),
					cubicInterpolationMode: custom.cubicInterpolationMode ? custom.cubicInterpolationMode : helpers.getValueOrDefault(dataset.cubicInterpolationMode, lineElementOptions.cubicInterpolationMode),
					// Scale
					scaleTop: scale.top,
					scaleBottom: scale.bottom,
					scaleZero: scale.getBasePixel()
				};

				line.pivot();
			}

			// Update Points
			for (i=0, ilen=points.length; i<ilen; ++i) {
				me.updateElement(points[i], i, reset);
			}

			if (showLine && line._model.tension !== 0) {
				me.updateBezierControlPoints();
			}

			// Now pivot the point for animation
			for (i=0, ilen=points.length; i<ilen; ++i) {
				points[i].pivot();
			}
		},

		getPointBackgroundColor: function(point, index) {
			var backgroundColor = this.chart.options.elements.point.backgroundColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.backgroundColor) {
				backgroundColor = custom.backgroundColor;
			} else if (dataset.pointBackgroundColor) {
				backgroundColor = helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, backgroundColor);
			} else if (dataset.backgroundColor) {
				backgroundColor = dataset.backgroundColor;
			}

			return backgroundColor;
		},

		getPointBorderColor: function(point, index) {
			var borderColor = this.chart.options.elements.point.borderColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.borderColor) {
				borderColor = custom.borderColor;
			} else if (dataset.pointBorderColor) {
				borderColor = helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, borderColor);
			} else if (dataset.borderColor) {
				borderColor = dataset.borderColor;
			}

			return borderColor;
		},

		getPointBorderWidth: function(point, index) {
			var borderWidth = this.chart.options.elements.point.borderWidth;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (!isNaN(custom.borderWidth)) {
				borderWidth = custom.borderWidth;
			} else if (!isNaN(dataset.pointBorderWidth)) {
				borderWidth = helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, borderWidth);
			} else if (!isNaN(dataset.borderWidth)) {
				borderWidth = dataset.borderWidth;
			}

			return borderWidth;
		},

		updateElement: function(point, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var custom = point.custom || {};
			var dataset = me.getDataset();
			var datasetIndex = me.index;
			var value = dataset.data[index];
			var yScale = me.getScaleForId(meta.yAxisID);
			var xScale = me.getScaleForId(meta.xAxisID);
			var pointOptions = me.chart.options.elements.point;
			var x, y;
			var labels = me.chart.data.labels || [];
			var includeOffset = (labels.length === 1 || dataset.data.length === 1) || me.chart.isCombo;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
				dataset.pointRadius = dataset.radius;
			}
			if ((dataset.hitRadius !== undefined) && (dataset.pointHitRadius === undefined)) {
				dataset.pointHitRadius = dataset.hitRadius;
			}

			x = xScale.getPixelForValue(typeof value === 'object' ? value : NaN, index, datasetIndex, includeOffset);
			y = reset ? yScale.getBasePixel() : me.calculatePointY(value, index, datasetIndex);

			// Utility
			point._xScale = xScale;
			point._yScale = yScale;
			point._datasetIndex = datasetIndex;
			point._index = index;

			// Desired view properties
			point._model = {
				x: x,
				y: y,
				skip: custom.skip || isNaN(x) || isNaN(y),
				// Appearance
				radius: custom.radius || helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, pointOptions.radius),
				pointStyle: custom.pointStyle || helpers.getValueAtIndexOrDefault(dataset.pointStyle, index, pointOptions.pointStyle),
				backgroundColor: me.getPointBackgroundColor(point, index),
				borderColor: me.getPointBorderColor(point, index),
				borderWidth: me.getPointBorderWidth(point, index),
				tension: meta.dataset._model ? meta.dataset._model.tension : 0,
				steppedLine: meta.dataset._model ? meta.dataset._model.steppedLine : false,
				// Tooltip
				hitRadius: custom.hitRadius || helpers.getValueAtIndexOrDefault(dataset.pointHitRadius, index, pointOptions.hitRadius)
			};
		},

		calculatePointY: function(value, index, datasetIndex) {
			var me = this;
			var chart = me.chart;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var sumPos = 0;
			var sumNeg = 0;
			var i, ds, dsMeta;

			if (yScale.options.stacked) {
				for (i = 0; i < datasetIndex; i++) {
					ds = chart.data.datasets[i];
					dsMeta = chart.getDatasetMeta(i);
					if (dsMeta.type === 'line' && dsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
						var stackedRightValue = Number(yScale.getRightValue(ds.data[index]));
						if (stackedRightValue < 0) {
							sumNeg += stackedRightValue || 0;
						} else {
							sumPos += stackedRightValue || 0;
						}
					}
				}

				var rightValue = Number(yScale.getRightValue(value));
				if (rightValue < 0) {
					return yScale.getPixelForValue(sumNeg + rightValue);
				}
				return yScale.getPixelForValue(sumPos + rightValue);
			}

			return yScale.getPixelForValue(value);
		},

		updateBezierControlPoints: function() {
			var me = this;
			var meta = me.getMeta();
			var area = me.chart.chartArea;
			var points = (meta.data || []);
			var i, ilen, point, model, controlPoints;

			// Only consider points that are drawn in case the spanGaps option is used
			if (meta.dataset._model.spanGaps) {
				points = points.filter(function(pt) {
					return !pt._model.skip;
				});
			}

			function capControlPoint(pt, min, max) {
				return Math.max(Math.min(pt, max), min);
			}

			if (meta.dataset._model.cubicInterpolationMode === 'monotone') {
				helpers.splineCurveMonotone(points);
			} else {
				for (i = 0, ilen = points.length; i < ilen; ++i) {
					point = points[i];
					model = point._model;
					controlPoints = helpers.splineCurve(
						helpers.previousItem(points, i)._model,
						model,
						helpers.nextItem(points, i)._model,
						meta.dataset._model.tension
					);
					model.controlPointPreviousX = controlPoints.previous.x;
					model.controlPointPreviousY = controlPoints.previous.y;
					model.controlPointNextX = controlPoints.next.x;
					model.controlPointNextY = controlPoints.next.y;
				}
			}

			if (me.chart.options.elements.line.capBezierPoints) {
				for (i = 0, ilen = points.length; i < ilen; ++i) {
					model = points[i]._model;
					model.controlPointPreviousX = capControlPoint(model.controlPointPreviousX, area.left, area.right);
					model.controlPointPreviousY = capControlPoint(model.controlPointPreviousY, area.top, area.bottom);
					model.controlPointNextX = capControlPoint(model.controlPointNextX, area.left, area.right);
					model.controlPointNextY = capControlPoint(model.controlPointNextY, area.top, area.bottom);
				}
			}
		},

		draw: function(ease) {
			var me = this;
			var meta = me.getMeta();
			var points = meta.data || [];
			var easingDecimal = ease || 1;
			var i, ilen;

			// Transition Point Locations
			for (i=0, ilen=points.length; i<ilen; ++i) {
				points[i].transition(easingDecimal);
			}

			Chart.canvasHelpers.clipArea(me.chart.chart.ctx, me.chart.chartArea);
			// Transition and Draw the line
			if (lineEnabled(me.getDataset(), me.chart.options)) {
				meta.dataset.transition(easingDecimal).draw();
			}
			Chart.canvasHelpers.unclipArea(me.chart.chart.ctx);

			// Draw the points
			for (i=0, ilen=points.length; i<ilen; ++i) {
				points[i].draw(me.chart.chartArea);
			}
		},

		setHoverStyle: function(point) {
			// Point
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var index = point._index;
			var custom = point.custom || {};
			var model = point._model;

			model.radius = custom.hoverRadius || helpers.getValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
			model.backgroundColor = custom.hoverBackgroundColor || helpers.getValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor || helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth || helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(point) {
			var me = this;
			var dataset = me.chart.data.datasets[point._datasetIndex];
			var index = point._index;
			var custom = point.custom || {};
			var model = point._model;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
				dataset.pointRadius = dataset.radius;
			}

			model.radius = custom.radius || helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, me.chart.options.elements.point.radius);
			model.backgroundColor = me.getPointBackgroundColor(point, index);
			model.borderColor = me.getPointBorderColor(point, index);
			model.borderWidth = me.getPointBorderWidth(point, index);
		}
	});
};

},{}],19:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.polarArea = {

		scale: {
			type: 'radialLinear',
			lineArc: true, // so that lines are circular
			ticks: {
				beginAtZero: true
			}
		},

		// Boolean - Whether to animate the rotation of the chart
		animation: {
			animateRotate: true,
			animateScale: true
		},

		startAngle: -0.5 * Math.PI,
		aspectRatio: 1,
		legendCallback: function(chart) {
			var text = [];
			text.push('<ul class="' + chart.id + '-legend">');

			var data = chart.data;
			var datasets = data.datasets;
			var labels = data.labels;

			if (datasets.length) {
				for (var i = 0; i < datasets[0].data.length; ++i) {
					text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
					if (labels[i]) {
						text.push(labels[i]);
					}
					text.push('</li>');
				}
			}

			text.push('</ul>');
			return text.join('');
		},
		legend: {
			labels: {
				generateLabels: function(chart) {
					var data = chart.data;
					if (data.labels.length && data.datasets.length) {
						return data.labels.map(function(label, i) {
							var meta = chart.getDatasetMeta(0);
							var ds = data.datasets[0];
							var arc = meta.data[i];
							var custom = arc.custom || {};
							var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
							var arcOpts = chart.options.elements.arc;
							var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
							var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
							var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

							return {
								text: label,
								fillStyle: fill,
								strokeStyle: stroke,
								lineWidth: bw,
								hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

								// Extra data used for toggling the correct item
								index: i
							};
						});
					}
					return [];
				}
			},

			onClick: function(e, legendItem) {
				var index = legendItem.index;
				var chart = this.chart;
				var i, ilen, meta;

				for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
					meta = chart.getDatasetMeta(i);
					meta.data[index].hidden = !meta.data[index].hidden;
				}

				chart.update();
			}
		},

		// Need to override these to give a nice default
		tooltips: {
			callbacks: {
				title: function() {
					return '';
				},
				label: function(tooltipItem, data) {
					return data.labels[tooltipItem.index] + ': ' + tooltipItem.yLabel;
				}
			}
		}
	};

	Chart.controllers.polarArea = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Arc,

		linkScales: helpers.noop,

		update: function(reset) {
			var me = this;
			var chart = me.chart;
			var chartArea = chart.chartArea;
			var meta = me.getMeta();
			var opts = chart.options;
			var arcOpts = opts.elements.arc;
			var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
			chart.outerRadius = Math.max((minSize - arcOpts.borderWidth / 2) / 2, 0);
			chart.innerRadius = Math.max(opts.cutoutPercentage ? (chart.outerRadius / 100) * (opts.cutoutPercentage) : 1, 0);
			chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();

			me.outerRadius = chart.outerRadius - (chart.radiusLength * me.index);
			me.innerRadius = me.outerRadius - chart.radiusLength;

			meta.count = me.countVisibleElements();

			helpers.each(meta.data, function(arc, index) {
				me.updateElement(arc, index, reset);
			});
		},

		updateElement: function(arc, index, reset) {
			var me = this;
			var chart = me.chart;
			var dataset = me.getDataset();
			var opts = chart.options;
			var animationOpts = opts.animation;
			var scale = chart.scale;
			var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
			var labels = chart.data.labels;

			var circumference = me.calculateCircumference(dataset.data[index]);
			var centerX = scale.xCenter;
			var centerY = scale.yCenter;

			// If there is NaN data before us, we need to calculate the starting angle correctly.
			// We could be way more efficient here, but its unlikely that the polar area chart will have a lot of data
			var visibleCount = 0;
			var meta = me.getMeta();
			for (var i = 0; i < index; ++i) {
				if (!isNaN(dataset.data[i]) && !meta.data[i].hidden) {
					++visibleCount;
				}
			}

			// var negHalfPI = -0.5 * Math.PI;
			var datasetStartAngle = opts.startAngle;
			var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
			var startAngle = datasetStartAngle + (circumference * visibleCount);
			var endAngle = startAngle + (arc.hidden ? 0 : circumference);

			var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

			helpers.extend(arc, {
				// Utility
				_datasetIndex: me.index,
				_index: index,
				_scale: scale,

				// Desired view properties
				_model: {
					x: centerX,
					y: centerY,
					innerRadius: 0,
					outerRadius: reset ? resetRadius : distance,
					startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
					endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
					label: getValueAtIndexOrDefault(labels, index, labels[index])
				}
			});

			// Apply border and fill style
			me.removeHoverStyle(arc);

			arc.pivot();
		},

		removeHoverStyle: function(arc) {
			Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
		},

		countVisibleElements: function() {
			var dataset = this.getDataset();
			var meta = this.getMeta();
			var count = 0;

			helpers.each(meta.data, function(element, index) {
				if (!isNaN(dataset.data[index]) && !element.hidden) {
					count++;
				}
			});

			return count;
		},

		calculateCircumference: function(value) {
			var count = this.getMeta().count;
			if (count > 0 && !isNaN(value)) {
				return (2 * Math.PI) / count;
			}
			return 0;
		}
	});
};

},{}],20:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.radar = {
		aspectRatio: 1,
		scale: {
			type: 'radialLinear'
		},
		elements: {
			line: {
				tension: 0 // no bezier in radar
			}
		}
	};

	Chart.controllers.radar = Chart.DatasetController.extend({

		datasetElementType: Chart.elements.Line,

		dataElementType: Chart.elements.Point,

		linkScales: helpers.noop,

		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var line = meta.dataset;
			var points = meta.data;
			var custom = line.custom || {};
			var dataset = me.getDataset();
			var lineElementOptions = me.chart.options.elements.line;
			var scale = me.chart.scale;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
				dataset.lineTension = dataset.tension;
			}

			helpers.extend(meta.dataset, {
				// Utility
				_datasetIndex: me.index,
				// Data
				_children: points,
				_loop: true,
				// Model
				_model: {
					// Appearance
					tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, lineElementOptions.tension),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
					borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
					fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
					borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
					borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
					borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
					borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),

					// Scale
					scaleTop: scale.top,
					scaleBottom: scale.bottom,
					scaleZero: scale.getBasePosition()
				}
			});

			meta.dataset.pivot();

			// Update Points
			helpers.each(points, function(point, index) {
				me.updateElement(point, index, reset);
			}, me);

			// Update bezier control points
			me.updateBezierControlPoints();
		},
		updateElement: function(point, index, reset) {
			var me = this;
			var custom = point.custom || {};
			var dataset = me.getDataset();
			var scale = me.chart.scale;
			var pointElementOptions = me.chart.options.elements.point;
			var pointPosition = scale.getPointPositionForValue(index, dataset.data[index]);

			helpers.extend(point, {
				// Utility
				_datasetIndex: me.index,
				_index: index,
				_scale: scale,

				// Desired view properties
				_model: {
					x: reset ? scale.xCenter : pointPosition.x, // value not used in dataset scale, but we want a consistent API between scales
					y: reset ? scale.yCenter : pointPosition.y,

					// Appearance
					tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, me.chart.options.elements.line.tension),
					radius: custom.radius ? custom.radius : helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, pointElementOptions.radius),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor),
					borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth),
					pointStyle: custom.pointStyle ? custom.pointStyle : helpers.getValueAtIndexOrDefault(dataset.pointStyle, index, pointElementOptions.pointStyle),

					// Tooltip
					hitRadius: custom.hitRadius ? custom.hitRadius : helpers.getValueAtIndexOrDefault(dataset.hitRadius, index, pointElementOptions.hitRadius)
				}
			});

			point._model.skip = custom.skip ? custom.skip : (isNaN(point._model.x) || isNaN(point._model.y));
		},
		updateBezierControlPoints: function() {
			var chartArea = this.chart.chartArea;
			var meta = this.getMeta();

			helpers.each(meta.data, function(point, index) {
				var model = point._model;
				var controlPoints = helpers.splineCurve(
					helpers.previousItem(meta.data, index, true)._model,
					model,
					helpers.nextItem(meta.data, index, true)._model,
					model.tension
				);

				// Prevent the bezier going outside of the bounds of the graph
				model.controlPointPreviousX = Math.max(Math.min(controlPoints.previous.x, chartArea.right), chartArea.left);
				model.controlPointPreviousY = Math.max(Math.min(controlPoints.previous.y, chartArea.bottom), chartArea.top);

				model.controlPointNextX = Math.max(Math.min(controlPoints.next.x, chartArea.right), chartArea.left);
				model.controlPointNextY = Math.max(Math.min(controlPoints.next.y, chartArea.bottom), chartArea.top);

				// Now pivot the point for animation
				point.pivot();
			});
		},

		draw: function(ease) {
			var meta = this.getMeta();
			var easingDecimal = ease || 1;

			// Transition Point Locations
			helpers.each(meta.data, function(point) {
				point.transition(easingDecimal);
			});

			// Transition and Draw the line
			meta.dataset.transition(easingDecimal).draw();

			// Draw the points
			helpers.each(meta.data, function(point) {
				point.draw();
			});
		},

		setHoverStyle: function(point) {
			// Point
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var custom = point.custom || {};
			var index = point._index;
			var model = point._model;

			model.radius = custom.hoverRadius ? custom.hoverRadius : helpers.getValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(point) {
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var custom = point.custom || {};
			var index = point._index;
			var model = point._model;
			var pointElementOptions = this.chart.options.elements.point;

			model.radius = custom.radius ? custom.radius : helpers.getValueAtIndexOrDefault(dataset.radius, index, pointElementOptions.radius);
			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth);
		}
	});
};

},{}],21:[function(require,module,exports){
/* global window: false */
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.global.animation = {
		duration: 1000,
		easing: 'easeOutQuart',
		onProgress: helpers.noop,
		onComplete: helpers.noop
	};

	Chart.Animation = Chart.Element.extend({
		currentStep: null, // the current animation step
		numSteps: 60, // default number of steps
		easing: '', // the easing to use for this animation
		render: null, // render function used by the animation service

		onAnimationProgress: null, // user specified callback to fire on each step of the animation
		onAnimationComplete: null // user specified callback to fire when the animation finishes
	});

	Chart.animationService = {
		frameDuration: 17,
		animations: [],
		dropFrames: 0,
		request: null,

		/**
		 * @function Chart.animationService.addAnimation
		 * @param chartInstance {ChartController} the chart to animate
		 * @param animationObject {IAnimation} the animation that we will animate
		 * @param duration {Number} length of animation in ms
		 * @param lazy {Boolean} if true, the chart is not marked as animating to enable more responsive interactions
		 */
		addAnimation: function(chartInstance, animationObject, duration, lazy) {
			var me = this;

			if (!lazy) {
				chartInstance.animating = true;
			}

			for (var index = 0; index < me.animations.length; ++index) {
				if (me.animations[index].chartInstance === chartInstance) {
					// replacing an in progress animation
					me.animations[index].animationObject = animationObject;
					return;
				}
			}

			me.animations.push({
				chartInstance: chartInstance,
				animationObject: animationObject
			});

			// If there are no animations queued, manually kickstart a digest, for lack of a better word
			if (me.animations.length === 1) {
				me.requestAnimationFrame();
			}
		},
		// Cancel the animation for a given chart instance
		cancelAnimation: function(chartInstance) {
			var index = helpers.findIndex(this.animations, function(animationWrapper) {
				return animationWrapper.chartInstance === chartInstance;
			});

			if (index !== -1) {
				this.animations.splice(index, 1);
				chartInstance.animating = false;
			}
		},
		requestAnimationFrame: function() {
			var me = this;
			if (me.request === null) {
				// Skip animation frame requests until the active one is executed.
				// This can happen when processing mouse events, e.g. 'mousemove'
				// and 'mouseout' events will trigger multiple renders.
				me.request = helpers.requestAnimFrame.call(window, function() {
					me.request = null;
					me.startDigest();
				});
			}
		},
		startDigest: function() {
			var me = this;

			var startTime = Date.now();
			var framesToDrop = 0;

			if (me.dropFrames > 1) {
				framesToDrop = Math.floor(me.dropFrames);
				me.dropFrames = me.dropFrames % 1;
			}

			var i = 0;
			while (i < me.animations.length) {
				if (me.animations[i].animationObject.currentStep === null) {
					me.animations[i].animationObject.currentStep = 0;
				}

				me.animations[i].animationObject.currentStep += 1 + framesToDrop;

				if (me.animations[i].animationObject.currentStep > me.animations[i].animationObject.numSteps) {
					me.animations[i].animationObject.currentStep = me.animations[i].animationObject.numSteps;
				}

				me.animations[i].animationObject.render(me.animations[i].chartInstance, me.animations[i].animationObject);
				if (me.animations[i].animationObject.onAnimationProgress && me.animations[i].animationObject.onAnimationProgress.call) {
					me.animations[i].animationObject.onAnimationProgress.call(me.animations[i].chartInstance, me.animations[i]);
				}

				if (me.animations[i].animationObject.currentStep === me.animations[i].animationObject.numSteps) {
					if (me.animations[i].animationObject.onAnimationComplete && me.animations[i].animationObject.onAnimationComplete.call) {
						me.animations[i].animationObject.onAnimationComplete.call(me.animations[i].chartInstance, me.animations[i]);
					}

					// executed the last frame. Remove the animation.
					me.animations[i].chartInstance.animating = false;

					me.animations.splice(i, 1);
				} else {
					++i;
				}
			}

			var endTime = Date.now();
			var dropFrames = (endTime - startTime) / me.frameDuration;

			me.dropFrames += dropFrames;

			// Do we have more stuff to animate?
			if (me.animations.length > 0) {
				me.requestAnimationFrame();
			}
		}
	};
};

},{}],22:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {
	// Global Chart canvas helpers object for drawing items to canvas
	var helpers = Chart.canvasHelpers = {};

	helpers.drawPoint = function(ctx, pointStyle, radius, x, y) {
		var type, edgeLength, xOffset, yOffset, height, size;

		if (typeof pointStyle === 'object') {
			type = pointStyle.toString();
			if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
				ctx.drawImage(pointStyle, x - pointStyle.width / 2, y - pointStyle.height / 2);
				return;
			}
		}

		if (isNaN(radius) || radius <= 0) {
			return;
		}

		switch (pointStyle) {
		// Default includes circle
		default:
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
			break;
		case 'triangle':
			ctx.beginPath();
			edgeLength = 3 * radius / Math.sqrt(3);
			height = edgeLength * Math.sqrt(3) / 2;
			ctx.moveTo(x - edgeLength / 2, y + height / 3);
			ctx.lineTo(x + edgeLength / 2, y + height / 3);
			ctx.lineTo(x, y - 2 * height / 3);
			ctx.closePath();
			ctx.fill();
			break;
		case 'rect':
			size = 1 / Math.SQRT2 * radius;
			ctx.beginPath();
			ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
			ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);
			break;
		case 'rectRounded':
			var offset = radius / Math.SQRT2;
			var leftX = x - offset;
			var topY = y - offset;
			var sideSize = Math.SQRT2 * radius;
			Chart.helpers.drawRoundedRectangle(ctx, leftX, topY, sideSize, sideSize, radius / 2);
			ctx.fill();
			break;
		case 'rectRot':
			size = 1 / Math.SQRT2 * radius;
			ctx.beginPath();
			ctx.moveTo(x - size, y);
			ctx.lineTo(x, y + size);
			ctx.lineTo(x + size, y);
			ctx.lineTo(x, y - size);
			ctx.closePath();
			ctx.fill();
			break;
		case 'cross':
			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y - radius);
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		case 'crossRot':
			ctx.beginPath();
			xOffset = Math.cos(Math.PI / 4) * radius;
			yOffset = Math.sin(Math.PI / 4) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x - xOffset, y + yOffset);
			ctx.lineTo(x + xOffset, y - yOffset);
			ctx.closePath();
			break;
		case 'star':
			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y - radius);
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			xOffset = Math.cos(Math.PI / 4) * radius;
			yOffset = Math.sin(Math.PI / 4) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x - xOffset, y + yOffset);
			ctx.lineTo(x + xOffset, y - yOffset);
			ctx.closePath();
			break;
		case 'line':
			ctx.beginPath();
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		case 'dash':
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		}

		ctx.stroke();
	};

	helpers.clipArea = function(ctx, clipArea) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(clipArea.left, clipArea.top, clipArea.right - clipArea.left, clipArea.bottom - clipArea.top);
		ctx.clip();
	};

	helpers.unclipArea = function(ctx) {
		ctx.restore();
	};

};

},{}],23:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var plugins = Chart.plugins;
	var platform = Chart.platform;

	// Create a dictionary of chart types, to allow for extension of existing types
	Chart.types = {};

	// Store a reference to each instance - allowing us to globally resize chart instances on window resize.
	// Destroy method on the chart will remove the instance of the chart from this reference.
	Chart.instances = {};

	// Controllers available for dataset visualization eg. bar, line, slice, etc.
	Chart.controllers = {};

	/**
	 * Initializes the given config with global and chart default values.
	 */
	function initConfig(config) {
		config = config || {};

		// Do NOT use configMerge() for the data object because this method merges arrays
		// and so would change references to labels and datasets, preventing data updates.
		var data = config.data = config.data || {};
		data.datasets = data.datasets || [];
		data.labels = data.labels || [];

		config.options = helpers.configMerge(
			Chart.defaults.global,
			Chart.defaults[config.type],
			config.options || {});

		return config;
	}

	/**
	 * Updates the config of the chart
	 * @param chart {Chart.Controller} chart to update the options for
	 */
	function updateConfig(chart) {
		var newOptions = chart.options;

		// Update Scale(s) with options
		if (newOptions.scale) {
			chart.scale.options = newOptions.scale;
		} else if (newOptions.scales) {
			newOptions.scales.xAxes.concat(newOptions.scales.yAxes).forEach(function(scaleOptions) {
				chart.scales[scaleOptions.id].options = scaleOptions;
			});
		}

		// Tooltip
		chart.tooltip._options = newOptions.tooltips;
	}

	/**
	 * @class Chart.Controller
	 * The main controller of a chart.
	 */
	Chart.Controller = function(item, config, instance) {
		var me = this;

		config = initConfig(config);

		var context = platform.acquireContext(item, config);
		var canvas = context && context.canvas;
		var height = canvas && canvas.height;
		var width = canvas && canvas.width;

		instance.ctx = context;
		instance.canvas = canvas;
		instance.config = config;
		instance.width = width;
		instance.height = height;
		instance.aspectRatio = height? width / height : null;

		me.id = helpers.uid();
		me.chart = instance;
		me.config = config;
		me.options = config.options;
		me._bufferedRender = false;

		// Add the chart instance to the global namespace
		Chart.instances[me.id] = me;

		Object.defineProperty(me, 'data', {
			get: function() {
				return me.config.data;
			}
		});

		if (!context || !canvas) {
			// The given item is not a compatible context2d element, let's return before finalizing
			// the chart initialization but after setting basic chart / controller properties that
			// can help to figure out that the chart is not valid (e.g chart.canvas !== null);
			// https://github.com/chartjs/Chart.js/issues/2807
			console.error("Failed to create chart: can't acquire context from the given item");
			return me;
		}

		me.initialize();
		me.update();

		return me;
	};

	helpers.extend(Chart.Controller.prototype, /** @lends Chart.Controller.prototype */ {
		initialize: function() {
			var me = this;

			// Before init plugin notification
			plugins.notify(me, 'beforeInit');

			helpers.retinaScale(me.chart);

			me.bindEvents();

			if (me.options.responsive) {
				// Initial resize before chart draws (must be silent to preserve initial animations).
				me.resize(true);
			}

			// Make sure scales have IDs and are built before we build any controllers.
			me.ensureScalesHaveIDs();
			me.buildScales();
			me.initToolTip();

			// After init plugin notification
			plugins.notify(me, 'afterInit');

			return me;
		},

		clear: function() {
			helpers.clear(this.chart);
			return this;
		},

		stop: function() {
			// Stops any current animation loop occurring
			Chart.animationService.cancelAnimation(this);
			return this;
		},

		resize: function(silent) {
			var me = this;
			var chart = me.chart;
			var options = me.options;
			var canvas = chart.canvas;
			var aspectRatio = (options.maintainAspectRatio && chart.aspectRatio) || null;

			// the canvas render width and height will be casted to integers so make sure that
			// the canvas display style uses the same integer values to avoid blurring effect.
			var newWidth = Math.floor(helpers.getMaximumWidth(canvas));
			var newHeight = Math.floor(aspectRatio? newWidth / aspectRatio : helpers.getMaximumHeight(canvas));

			if (chart.width === newWidth && chart.height === newHeight) {
				return;
			}

			canvas.width = chart.width = newWidth;
			canvas.height = chart.height = newHeight;
			canvas.style.width = newWidth + 'px';
			canvas.style.height = newHeight + 'px';

			helpers.retinaScale(chart);

			if (!silent) {
				// Notify any plugins about the resize
				var newSize = {width: newWidth, height: newHeight};
				plugins.notify(me, 'resize', [newSize]);

				// Notify of resize
				if (me.options.onResize) {
					me.options.onResize(me, newSize);
				}

				me.stop();
				me.update(me.options.responsiveAnimationDuration);
			}
		},

		ensureScalesHaveIDs: function() {
			var options = this.options;
			var scalesOptions = options.scales || {};
			var scaleOptions = options.scale;

			helpers.each(scalesOptions.xAxes, function(xAxisOptions, index) {
				xAxisOptions.id = xAxisOptions.id || ('x-axis-' + index);
			});

			helpers.each(scalesOptions.yAxes, function(yAxisOptions, index) {
				yAxisOptions.id = yAxisOptions.id || ('y-axis-' + index);
			});

			if (scaleOptions) {
				scaleOptions.id = scaleOptions.id || 'scale';
			}
		},

		/**
		 * Builds a map of scale ID to scale object for future lookup.
		 */
		buildScales: function() {
			var me = this;
			var options = me.options;
			var scales = me.scales = {};
			var items = [];

			if (options.scales) {
				items = items.concat(
					(options.scales.xAxes || []).map(function(xAxisOptions) {
						return {options: xAxisOptions, dtype: 'category'};
					}),
					(options.scales.yAxes || []).map(function(yAxisOptions) {
						return {options: yAxisOptions, dtype: 'linear'};
					})
				);
			}

			if (options.scale) {
				items.push({options: options.scale, dtype: 'radialLinear', isDefault: true});
			}

			helpers.each(items, function(item) {
				var scaleOptions = item.options;
				var scaleType = helpers.getValueOrDefault(scaleOptions.type, item.dtype);
				var scaleClass = Chart.scaleService.getScaleConstructor(scaleType);
				if (!scaleClass) {
					return;
				}

				var scale = new scaleClass({
					id: scaleOptions.id,
					options: scaleOptions,
					ctx: me.chart.ctx,
					chart: me
				});

				scales[scale.id] = scale;

				// TODO(SB): I think we should be able to remove this custom case (options.scale)
				// and consider it as a regular scale part of the "scales"" map only! This would
				// make the logic easier and remove some useless? custom code.
				if (item.isDefault) {
					me.scale = scale;
				}
			});

			Chart.scaleService.addScalesToLayout(this);
		},

		buildOrUpdateControllers: function() {
			var me = this;
			var types = [];
			var newControllers = [];

			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				var meta = me.getDatasetMeta(datasetIndex);
				if (!meta.type) {
					meta.type = dataset.type || me.config.type;
				}

				types.push(meta.type);

				if (meta.controller) {
					meta.controller.updateIndex(datasetIndex);
				} else {
					meta.controller = new Chart.controllers[meta.type](me, datasetIndex);
					newControllers.push(meta.controller);
				}
			}, me);

			if (types.length > 1) {
				for (var i = 1; i < types.length; i++) {
					if (types[i] !== types[i - 1]) {
						me.isCombo = true;
						break;
					}
				}
			}

			return newControllers;
		},

		/**
		 * Reset the elements of all datasets
		 * @private
		 */
		resetElements: function() {
			var me = this;
			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				me.getDatasetMeta(datasetIndex).controller.reset();
			}, me);
		},

		/**
		* Resets the chart back to it's state before the initial animation
		*/
		reset: function() {
			this.resetElements();
			this.tooltip.initialize();
		},

		update: function(animationDuration, lazy) {
			var me = this;

			updateConfig(me);

			if (plugins.notify(me, 'beforeUpdate') === false) {
				return;
			}

			// In case the entire data object changed
			me.tooltip._data = me.data;

			// Make sure dataset controllers are updated and new controllers are reset
			var newControllers = me.buildOrUpdateControllers();

			// Make sure all dataset controllers have correct meta data counts
			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements();
			}, me);

			me.updateLayout();

			// Can only reset the new controllers after the scales have been updated
			helpers.each(newControllers, function(controller) {
				controller.reset();
			});

			me.updateDatasets();

			// Do this before render so that any plugins that need final scale updates can use it
			plugins.notify(me, 'afterUpdate');

			if (me._bufferedRender) {
				me._bufferedRequest = {
					lazy: lazy,
					duration: animationDuration
				};
			} else {
				me.render(animationDuration, lazy);
			}
		},

		/**
		 * Updates the chart layout unless a plugin returns `false` to the `beforeLayout`
		 * hook, in which case, plugins will not be called on `afterLayout`.
		 * @private
		 */
		updateLayout: function() {
			var me = this;

			if (plugins.notify(me, 'beforeLayout') === false) {
				return;
			}

			Chart.layoutService.update(this, this.chart.width, this.chart.height);

			/**
			 * Provided for backward compatibility, use `afterLayout` instead.
			 * @method IPlugin#afterScaleUpdate
			 * @deprecated since version 2.5.0
			 * @todo remove at version 3
			 */
			plugins.notify(me, 'afterScaleUpdate');
			plugins.notify(me, 'afterLayout');
		},

		/**
		 * Updates all datasets unless a plugin returns `false` to the `beforeDatasetsUpdate`
		 * hook, in which case, plugins will not be called on `afterDatasetsUpdate`.
		 * @private
		 */
		updateDatasets: function() {
			var me = this;

			if (plugins.notify(me, 'beforeDatasetsUpdate') === false) {
				return;
			}

			for (var i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
				me.getDatasetMeta(i).controller.update();
			}

			plugins.notify(me, 'afterDatasetsUpdate');
		},

		render: function(duration, lazy) {
			var me = this;

			if (plugins.notify(me, 'beforeRender') === false) {
				return;
			}

			var animationOptions = me.options.animation;
			var onComplete = function() {
				plugins.notify(me, 'afterRender');
				var callback = animationOptions && animationOptions.onComplete;
				if (callback && callback.call) {
					callback.call(me);
				}
			};

			if (animationOptions && ((typeof duration !== 'undefined' && duration !== 0) || (typeof duration === 'undefined' && animationOptions.duration !== 0))) {
				var animation = new Chart.Animation();
				animation.numSteps = (duration || animationOptions.duration) / 16.66; // 60 fps
				animation.easing = animationOptions.easing;

				// render function
				animation.render = function(chartInstance, animationObject) {
					var easingFunction = helpers.easingEffects[animationObject.easing];
					var stepDecimal = animationObject.currentStep / animationObject.numSteps;
					var easeDecimal = easingFunction(stepDecimal);

					chartInstance.draw(easeDecimal, stepDecimal, animationObject.currentStep);
				};

				// user events
				animation.onAnimationProgress = animationOptions.onProgress;
				animation.onAnimationComplete = onComplete;

				Chart.animationService.addAnimation(me, animation, duration, lazy);
			} else {
				me.draw();
				onComplete();
			}

			return me;
		},

		draw: function(easingValue) {
			var me = this;

			me.clear();

			if (easingValue === undefined || easingValue === null) {
				easingValue = 1;
			}

			if (plugins.notify(me, 'beforeDraw', [easingValue]) === false) {
				return;
			}

			// Draw all the scales
			helpers.each(me.boxes, function(box) {
				box.draw(me.chartArea);
			}, me);

			if (me.scale) {
				me.scale.draw();
			}

			me.drawDatasets(easingValue);

			// Finally draw the tooltip
			me.tooltip.transition(easingValue).draw();

			plugins.notify(me, 'afterDraw', [easingValue]);
		},

		/**
		 * Draws all datasets unless a plugin returns `false` to the `beforeDatasetsDraw`
		 * hook, in which case, plugins will not be called on `afterDatasetsDraw`.
		 * @private
		 */
		drawDatasets: function(easingValue) {
			var me = this;

			if (plugins.notify(me, 'beforeDatasetsDraw', [easingValue]) === false) {
				return;
			}

			// Draw each dataset via its respective controller (reversed to support proper line stacking)
			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				if (me.isDatasetVisible(datasetIndex)) {
					me.getDatasetMeta(datasetIndex).controller.draw(easingValue);
				}
			}, me, true);

			plugins.notify(me, 'afterDatasetsDraw', [easingValue]);
		},

		// Get the single element that was clicked on
		// @return : An object containing the dataset index and element index of the matching element. Also contains the rectangle that was draw
		getElementAtEvent: function(e) {
			return Chart.Interaction.modes.single(this, e);
		},

		getElementsAtEvent: function(e) {
			return Chart.Interaction.modes.label(this, e, {intersect: true});
		},

		getElementsAtXAxis: function(e) {
			return Chart.Interaction.modes['x-axis'](this, e, {intersect: true});
		},

		getElementsAtEventForMode: function(e, mode, options) {
			var method = Chart.Interaction.modes[mode];
			if (typeof method === 'function') {
				return method(this, e, options);
			}

			return [];
		},

		getDatasetAtEvent: function(e) {
			return Chart.Interaction.modes.dataset(this, e, {intersect: true});
		},

		getDatasetMeta: function(datasetIndex) {
			var me = this;
			var dataset = me.data.datasets[datasetIndex];
			if (!dataset._meta) {
				dataset._meta = {};
			}

			var meta = dataset._meta[me.id];
			if (!meta) {
				meta = dataset._meta[me.id] = {
					type: null,
					data: [],
					dataset: null,
					controller: null,
					hidden: null,			// See isDatasetVisible() comment
					xAxisID: null,
					yAxisID: null
				};
			}

			return meta;
		},

		getVisibleDatasetCount: function() {
			var count = 0;
			for (var i = 0, ilen = this.data.datasets.length; i<ilen; ++i) {
				if (this.isDatasetVisible(i)) {
					count++;
				}
			}
			return count;
		},

		isDatasetVisible: function(datasetIndex) {
			var meta = this.getDatasetMeta(datasetIndex);

			// meta.hidden is a per chart dataset hidden flag override with 3 states: if true or false,
			// the dataset.hidden value is ignored, else if null, the dataset hidden state is returned.
			return typeof meta.hidden === 'boolean'? !meta.hidden : !this.data.datasets[datasetIndex].hidden;
		},

		generateLegend: function() {
			return this.options.legendCallback(this);
		},

		destroy: function() {
			var me = this;
			var canvas = me.chart.canvas;
			var meta, i, ilen;

			me.stop();

			// dataset controllers need to cleanup associated data
			for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
				meta = me.getDatasetMeta(i);
				if (meta.controller) {
					meta.controller.destroy();
					meta.controller = null;
				}
			}

			if (canvas) {
				me.unbindEvents();
				helpers.clear(me.chart);
				platform.releaseContext(me.chart.ctx);
				me.chart.canvas = null;
				me.chart.ctx = null;
			}

			plugins.notify(me, 'destroy');

			delete Chart.instances[me.id];
		},

		toBase64Image: function() {
			return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
		},

		initToolTip: function() {
			var me = this;
			me.tooltip = new Chart.Tooltip({
				_chart: me.chart,
				_chartInstance: me,
				_data: me.data,
				_options: me.options.tooltips
			}, me);
			me.tooltip.initialize();
		},

		/**
		 * @private
		 */
		bindEvents: function() {
			var me = this;
			var listeners = me._listeners = {};
			var listener = function() {
				me.eventHandler.apply(me, arguments);
			};

			helpers.each(me.options.events, function(type) {
				platform.addEventListener(me, type, listener);
				listeners[type] = listener;
			});

			// Responsiveness is currently based on the use of an iframe, however this method causes
			// performance issues and could be troublesome when used with ad blockers. So make sure
			// that the user is still able to create a chart without iframe when responsive is false.
			// See https://github.com/chartjs/Chart.js/issues/2210
			if (me.options.responsive) {
				listener = function() {
					me.resize();
				};

				platform.addEventListener(me, 'resize', listener);
				listeners.resize = listener;
			}
		},

		/**
		 * @private
		 */
		unbindEvents: function() {
			var me = this;
			var listeners = me._listeners;
			if (!listeners) {
				return;
			}

			delete me._listeners;
			helpers.each(listeners, function(listener, type) {
				platform.removeEventListener(me, type, listener);
			});
		},

		updateHoverStyle: function(elements, mode, enabled) {
			var method = enabled? 'setHoverStyle' : 'removeHoverStyle';
			var element, i, ilen;

			for (i=0, ilen=elements.length; i<ilen; ++i) {
				element = elements[i];
				if (element) {
					this.getDatasetMeta(element._datasetIndex).controller[method](element);
				}
			}
		},

		/**
		 * @private
		 */
		eventHandler: function(e) {
			var me = this;
			var tooltip = me.tooltip;

			if (plugins.notify(me, 'beforeEvent', [e]) === false) {
				return;
			}

			// Buffer any update calls so that renders do not occur
			me._bufferedRender = true;
			me._bufferedRequest = null;

			var changed = me.handleEvent(e);
			changed |= tooltip && tooltip.handleEvent(e);

			plugins.notify(me, 'afterEvent', [e]);

			var bufferedRequest = me._bufferedRequest;
			if (bufferedRequest) {
				// If we have an update that was triggered, we need to do a normal render
				me.render(bufferedRequest.duration, bufferedRequest.lazy);
			} else if (changed && !me.animating) {
				// If entering, leaving, or changing elements, animate the change via pivot
				me.stop();

				// We only need to render at this point. Updating will cause scales to be
				// recomputed generating flicker & using more memory than necessary.
				me.render(me.options.hover.animationDuration, true);
			}

			me._bufferedRender = false;
			me._bufferedRequest = null;

			return me;
		},

		/**
		 * Handle an event
		 * @private
		 * @param {IEvent} event the event to handle
		 * @return {Boolean} true if the chart needs to re-render
		 */
		handleEvent: function(e) {
			var me = this;
			var options = me.options || {};
			var hoverOptions = options.hover;
			var changed = false;

			me.lastActive = me.lastActive || [];

			// Find Active Elements for hover and tooltips
			if (e.type === 'mouseout') {
				me.active = [];
			} else {
				me.active = me.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions);
			}

			// On Hover hook
			if (hoverOptions.onHover) {
				// Need to call with native event here to not break backwards compatibility
				hoverOptions.onHover.call(me, e.native, me.active);
			}

			if (e.type === 'mouseup' || e.type === 'click') {
				if (options.onClick) {
					// Use e.native here for backwards compatibility
					options.onClick.call(me, e.native, me.active);
				}
			}

			// Remove styling for last active (even if it may still be active)
			if (me.lastActive.length) {
				me.updateHoverStyle(me.lastActive, hoverOptions.mode, false);
			}

			// Built in hover styling
			if (me.active.length && hoverOptions.mode) {
				me.updateHoverStyle(me.active, hoverOptions.mode, true);
			}

			changed = !helpers.arrayEquals(me.active, me.lastActive);

			// Remember Last Actives
			me.lastActive = me.active;

			return changed;
		}
	});
};

},{}],24:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	var arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];

	/**
	 * Hooks the array methods that add or remove values ('push', pop', 'shift', 'splice',
	 * 'unshift') and notify the listener AFTER the array has been altered. Listeners are
	 * called on the 'onData*' callbacks (e.g. onDataPush, etc.) with same arguments.
	 */
	function listenArrayEvents(array, listener) {
		if (array._chartjs) {
			array._chartjs.listeners.push(listener);
			return;
		}

		Object.defineProperty(array, '_chartjs', {
			configurable: true,
			enumerable: false,
			value: {
				listeners: [listener]
			}
		});

		arrayEvents.forEach(function(key) {
			var method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1);
			var base = array[key];

			Object.defineProperty(array, key, {
				configurable: true,
				enumerable: false,
				value: function() {
					var args = Array.prototype.slice.call(arguments);
					var res = base.apply(this, args);

					helpers.each(array._chartjs.listeners, function(object) {
						if (typeof object[method] === 'function') {
							object[method].apply(object, args);
						}
					});

					return res;
				}
			});
		});
	}

	/**
	 * Removes the given array event listener and cleanup extra attached properties (such as
	 * the _chartjs stub and overridden methods) if array doesn't have any more listeners.
	 */
	function unlistenArrayEvents(array, listener) {
		var stub = array._chartjs;
		if (!stub) {
			return;
		}

		var listeners = stub.listeners;
		var index = listeners.indexOf(listener);
		if (index !== -1) {
			listeners.splice(index, 1);
		}

		if (listeners.length > 0) {
			return;
		}

		arrayEvents.forEach(function(key) {
			delete array[key];
		});

		delete array._chartjs;
	}

	// Base class for all dataset controllers (line, bar, etc)
	Chart.DatasetController = function(chart, datasetIndex) {
		this.initialize(chart, datasetIndex);
	};

	helpers.extend(Chart.DatasetController.prototype, {

		/**
		 * Element type used to generate a meta dataset (e.g. Chart.element.Line).
		 * @type {Chart.core.element}
		 */
		datasetElementType: null,

		/**
		 * Element type used to generate a meta data (e.g. Chart.element.Point).
		 * @type {Chart.core.element}
		 */
		dataElementType: null,

		initialize: function(chart, datasetIndex) {
			var me = this;
			me.chart = chart;
			me.index = datasetIndex;
			me.linkScales();
			me.addElements();
		},

		updateIndex: function(datasetIndex) {
			this.index = datasetIndex;
		},

		linkScales: function() {
			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();

			if (meta.xAxisID === null) {
				meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id;
			}
			if (meta.yAxisID === null) {
				meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id;
			}
		},

		getDataset: function() {
			return this.chart.data.datasets[this.index];
		},

		getMeta: function() {
			return this.chart.getDatasetMeta(this.index);
		},

		getScaleForId: function(scaleID) {
			return this.chart.scales[scaleID];
		},

		reset: function() {
			this.update(true);
		},

		/**
		 * @private
		 */
		destroy: function() {
			if (this._data) {
				unlistenArrayEvents(this._data, this);
			}
		},

		createMetaDataset: function() {
			var me = this;
			var type = me.datasetElementType;
			return type && new type({
				_chart: me.chart.chart,
				_datasetIndex: me.index
			});
		},

		createMetaData: function(index) {
			var me = this;
			var type = me.dataElementType;
			return type && new type({
				_chart: me.chart.chart,
				_datasetIndex: me.index,
				_index: index
			});
		},

		addElements: function() {
			var me = this;
			var meta = me.getMeta();
			var data = me.getDataset().data || [];
			var metaData = meta.data;
			var i, ilen;

			for (i=0, ilen=data.length; i<ilen; ++i) {
				metaData[i] = metaData[i] || me.createMetaData(i);
			}

			meta.dataset = meta.dataset || me.createMetaDataset();
		},

		addElementAndReset: function(index) {
			var element = this.createMetaData(index);
			this.getMeta().data.splice(index, 0, element);
			this.updateElement(element, index, true);
		},

		buildOrUpdateElements: function() {
			var me = this;
			var dataset = me.getDataset();
			var data = dataset.data || (dataset.data = []);

			// In order to correctly handle data addition/deletion animation (an thus simulate
			// real-time charts), we need to monitor these data modifications and synchronize
			// the internal meta data accordingly.
			if (me._data !== data) {
				if (me._data) {
					// This case happens when the user replaced the data array instance.
					unlistenArrayEvents(me._data, me);
				}

				listenArrayEvents(data, me);
				me._data = data;
			}

			// Re-sync meta data in case the user replaced the data array or if we missed
			// any updates and so make sure that we handle number of datapoints changing.
			me.resyncElements();
		},

		update: helpers.noop,

		draw: function(ease) {
			var easingDecimal = ease || 1;
			var i, len;
			var metaData = this.getMeta().data;
			for (i = 0, len = metaData.length; i < len; ++i) {
				metaData[i].transition(easingDecimal).draw();
			}
		},

		removeHoverStyle: function(element, elementOpts) {
			var dataset = this.chart.data.datasets[element._datasetIndex],
				index = element._index,
				custom = element.custom || {},
				valueOrDefault = helpers.getValueAtIndexOrDefault,
				model = element._model;

			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : valueOrDefault(dataset.borderColor, index, elementOpts.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : valueOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);
		},

		setHoverStyle: function(element) {
			var dataset = this.chart.data.datasets[element._datasetIndex],
				index = element._index,
				custom = element.custom || {},
				valueOrDefault = helpers.getValueAtIndexOrDefault,
				getHoverColor = helpers.getHoverColor,
				model = element._model;

			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueOrDefault(dataset.hoverBackgroundColor, index, getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : valueOrDefault(dataset.hoverBorderColor, index, getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : valueOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
		},

		/**
		 * @private
		 */
		resyncElements: function() {
			var me = this;
			var meta = me.getMeta();
			var data = me.getDataset().data;
			var numMeta = meta.data.length;
			var numData = data.length;

			if (numData < numMeta) {
				meta.data.splice(numData, numMeta - numData);
			} else if (numData > numMeta) {
				me.insertElements(numMeta, numData - numMeta);
			}
		},

		/**
		 * @private
		 */
		insertElements: function(start, count) {
			for (var i=0; i<count; ++i) {
				this.addElementAndReset(start + i);
			}
		},

		/**
		 * @private
		 */
		onDataPush: function() {
			this.insertElements(this.getDataset().data.length-1, arguments.length);
		},

		/**
		 * @private
		 */
		onDataPop: function() {
			this.getMeta().data.pop();
		},

		/**
		 * @private
		 */
		onDataShift: function() {
			this.getMeta().data.shift();
		},

		/**
		 * @private
		 */
		onDataSplice: function(start, count) {
			this.getMeta().data.splice(start, count);
			this.insertElements(start, arguments.length - 2);
		},

		/**
		 * @private
		 */
		onDataUnshift: function() {
			this.insertElements(0, arguments.length);
		}
	});

	Chart.DatasetController.extend = helpers.inherits;
};

},{}],25:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.elements = {};

	Chart.Element = function(configuration) {
		helpers.extend(this, configuration);
		this.initialize.apply(this, arguments);
	};

	helpers.extend(Chart.Element.prototype, {

		initialize: function() {
			this.hidden = false;
		},

		pivot: function() {
			var me = this;
			if (!me._view) {
				me._view = helpers.clone(me._model);
			}
			me._start = helpers.clone(me._view);
			return me;
		},

		transition: function(ease) {
			var me = this;

			if (!me._view) {
				me._view = helpers.clone(me._model);
			}

			// No animation -> No Transition
			if (ease === 1) {
				me._view = me._model;
				me._start = null;
				return me;
			}

			if (!me._start) {
				me.pivot();
			}

			helpers.each(me._model, function(value, key) {

				if (key[0] === '_') {
					// Only non-underscored properties
				// Init if doesn't exist
				} else if (!me._view.hasOwnProperty(key)) {
					if (typeof value === 'number' && !isNaN(me._view[key])) {
						me._view[key] = value * ease;
					} else {
						me._view[key] = value;
					}
				// No unnecessary computations
				} else if (value === me._view[key]) {
					// It's the same! Woohoo!
				// Color transitions if possible
				} else if (typeof value === 'string') {
					try {
						var color = helpers.color(me._model[key]).mix(helpers.color(me._start[key]), ease);
						me._view[key] = color.rgbString();
					} catch (err) {
						me._view[key] = value;
					}
				// Number transitions
				} else if (typeof value === 'number') {
					var startVal = me._start[key] !== undefined && isNaN(me._start[key]) === false ? me._start[key] : 0;
					me._view[key] = ((me._model[key] - startVal) * ease) + startVal;
				// Everything else
				} else {
					me._view[key] = value;
				}
			}, me);

			return me;
		},

		tooltipPosition: function() {
			return {
				x: this._model.x,
				y: this._model.y
			};
		},

		hasValue: function() {
			return helpers.isNumber(this._model.x) && helpers.isNumber(this._model.y);
		}
	});

	Chart.Element.extend = helpers.inherits;

};

},{}],26:[function(require,module,exports){
/* global window: false */
/* global document: false */
'use strict';

var color = require(3);

module.exports = function(Chart) {
	// Global Chart helpers object for utility methods and classes
	var helpers = Chart.helpers = {};

	// -- Basic js utility methods
	helpers.each = function(loopable, callback, self, reverse) {
		// Check to see if null or undefined firstly.
		var i, len;
		if (helpers.isArray(loopable)) {
			len = loopable.length;
			if (reverse) {
				for (i = len - 1; i >= 0; i--) {
					callback.call(self, loopable[i], i);
				}
			} else {
				for (i = 0; i < len; i++) {
					callback.call(self, loopable[i], i);
				}
			}
		} else if (typeof loopable === 'object') {
			var keys = Object.keys(loopable);
			len = keys.length;
			for (i = 0; i < len; i++) {
				callback.call(self, loopable[keys[i]], keys[i]);
			}
		}
	};
	helpers.clone = function(obj) {
		var objClone = {};
		helpers.each(obj, function(value, key) {
			if (helpers.isArray(value)) {
				objClone[key] = value.slice(0);
			} else if (typeof value === 'object' && value !== null) {
				objClone[key] = helpers.clone(value);
			} else {
				objClone[key] = value;
			}
		});
		return objClone;
	};
	helpers.extend = function(base) {
		var setFn = function(value, key) {
			base[key] = value;
		};
		for (var i = 1, ilen = arguments.length; i < ilen; i++) {
			helpers.each(arguments[i], setFn);
		}
		return base;
	};
	// Need a special merge function to chart configs since they are now grouped
	helpers.configMerge = function(_base) {
		var base = helpers.clone(_base);
		helpers.each(Array.prototype.slice.call(arguments, 1), function(extension) {
			helpers.each(extension, function(value, key) {
				var baseHasProperty = base.hasOwnProperty(key);
				var baseVal = baseHasProperty ? base[key] : {};

				if (key === 'scales') {
					// Scale config merging is complex. Add our own function here for that
					base[key] = helpers.scaleMerge(baseVal, value);
				} else if (key === 'scale') {
					// Used in polar area & radar charts since there is only one scale
					base[key] = helpers.configMerge(baseVal, Chart.scaleService.getScaleDefaults(value.type), value);
				} else if (baseHasProperty
						&& typeof baseVal === 'object'
						&& !helpers.isArray(baseVal)
						&& baseVal !== null
						&& typeof value === 'object'
						&& !helpers.isArray(value)) {
					// If we are overwriting an object with an object, do a merge of the properties.
					base[key] = helpers.configMerge(baseVal, value);
				} else {
					// can just overwrite the value in this case
					base[key] = value;
				}
			});
		});

		return base;
	};
	helpers.scaleMerge = function(_base, extension) {
		var base = helpers.clone(_base);

		helpers.each(extension, function(value, key) {
			if (key === 'xAxes' || key === 'yAxes') {
				// These properties are arrays of items
				if (base.hasOwnProperty(key)) {
					helpers.each(value, function(valueObj, index) {
						var axisType = helpers.getValueOrDefault(valueObj.type, key === 'xAxes' ? 'category' : 'linear');
						var axisDefaults = Chart.scaleService.getScaleDefaults(axisType);
						if (index >= base[key].length || !base[key][index].type) {
							base[key].push(helpers.configMerge(axisDefaults, valueObj));
						} else if (valueObj.type && valueObj.type !== base[key][index].type) {
							// Type changed. Bring in the new defaults before we bring in valueObj so that valueObj can override the correct scale defaults
							base[key][index] = helpers.configMerge(base[key][index], axisDefaults, valueObj);
						} else {
							// Type is the same
							base[key][index] = helpers.configMerge(base[key][index], valueObj);
						}
					});
				} else {
					base[key] = [];
					helpers.each(value, function(valueObj) {
						var axisType = helpers.getValueOrDefault(valueObj.type, key === 'xAxes' ? 'category' : 'linear');
						base[key].push(helpers.configMerge(Chart.scaleService.getScaleDefaults(axisType), valueObj));
					});
				}
			} else if (base.hasOwnProperty(key) && typeof base[key] === 'object' && base[key] !== null && typeof value === 'object') {
				// If we are overwriting an object with an object, do a merge of the properties.
				base[key] = helpers.configMerge(base[key], value);

			} else {
				// can just overwrite the value in this case
				base[key] = value;
			}
		});

		return base;
	};
	helpers.getValueAtIndexOrDefault = function(value, index, defaultValue) {
		if (value === undefined || value === null) {
			return defaultValue;
		}

		if (helpers.isArray(value)) {
			return index < value.length ? value[index] : defaultValue;
		}

		return value;
	};
	helpers.getValueOrDefault = function(value, defaultValue) {
		return value === undefined ? defaultValue : value;
	};
	helpers.indexOf = Array.prototype.indexOf?
		function(array, item) {
			return array.indexOf(item);
		}:
		function(array, item) {
			for (var i = 0, ilen = array.length; i < ilen; ++i) {
				if (array[i] === item) {
					return i;
				}
			}
			return -1;
		};
	helpers.where = function(collection, filterCallback) {
		if (helpers.isArray(collection) && Array.prototype.filter) {
			return collection.filter(filterCallback);
		}
		var filtered = [];

		helpers.each(collection, function(item) {
			if (filterCallback(item)) {
				filtered.push(item);
			}
		});

		return filtered;
	};
	helpers.findIndex = Array.prototype.findIndex?
		function(array, callback, scope) {
			return array.findIndex(callback, scope);
		} :
		function(array, callback, scope) {
			scope = scope === undefined? array : scope;
			for (var i = 0, ilen = array.length; i < ilen; ++i) {
				if (callback.call(scope, array[i], i, array)) {
					return i;
				}
			}
			return -1;
		};
	helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex) {
		// Default to start of the array
		if (startIndex === undefined || startIndex === null) {
			startIndex = -1;
		}
		for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
			var currentItem = arrayToSearch[i];
			if (filterCallback(currentItem)) {
				return currentItem;
			}
		}
	};
	helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex) {
		// Default to end of the array
		if (startIndex === undefined || startIndex === null) {
			startIndex = arrayToSearch.length;
		}
		for (var i = startIndex - 1; i >= 0; i--) {
			var currentItem = arrayToSearch[i];
			if (filterCallback(currentItem)) {
				return currentItem;
			}
		}
	};
	helpers.inherits = function(extensions) {
		// Basic javascript inheritance based on the model created in Backbone.js
		var me = this;
		var ChartElement = (extensions && extensions.hasOwnProperty('constructor')) ? extensions.constructor : function() {
			return me.apply(this, arguments);
		};

		var Surrogate = function() {
			this.constructor = ChartElement;
		};
		Surrogate.prototype = me.prototype;
		ChartElement.prototype = new Surrogate();

		ChartElement.extend = helpers.inherits;

		if (extensions) {
			helpers.extend(ChartElement.prototype, extensions);
		}

		ChartElement.__super__ = me.prototype;

		return ChartElement;
	};
	helpers.noop = function() {};
	helpers.uid = (function() {
		var id = 0;
		return function() {
			return id++;
		};
	}());
	// -- Math methods
	helpers.isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
	helpers.almostEquals = function(x, y, epsilon) {
		return Math.abs(x - y) < epsilon;
	};
	helpers.almostWhole = function(x, epsilon) {
		var rounded = Math.round(x);
		return (((rounded - epsilon) < x) && ((rounded + epsilon) > x));
	};
	helpers.max = function(array) {
		return array.reduce(function(max, value) {
			if (!isNaN(value)) {
				return Math.max(max, value);
			}
			return max;
		}, Number.NEGATIVE_INFINITY);
	};
	helpers.min = function(array) {
		return array.reduce(function(min, value) {
			if (!isNaN(value)) {
				return Math.min(min, value);
			}
			return min;
		}, Number.POSITIVE_INFINITY);
	};
	helpers.sign = Math.sign?
		function(x) {
			return Math.sign(x);
		} :
		function(x) {
			x = +x; // convert to a number
			if (x === 0 || isNaN(x)) {
				return x;
			}
			return x > 0 ? 1 : -1;
		};
	helpers.log10 = Math.log10?
		function(x) {
			return Math.log10(x);
		} :
		function(x) {
			return Math.log(x) / Math.LN10;
		};
	helpers.toRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};
	helpers.toDegrees = function(radians) {
		return radians * (180 / Math.PI);
	};
	// Gets the angle from vertical upright to the point about a centre.
	helpers.getAngleFromPoint = function(centrePoint, anglePoint) {
		var distanceFromXCenter = anglePoint.x - centrePoint.x,
			distanceFromYCenter = anglePoint.y - centrePoint.y,
			radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);

		var angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);

		if (angle < (-0.5 * Math.PI)) {
			angle += 2.0 * Math.PI; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
		}

		return {
			angle: angle,
			distance: radialDistanceFromCenter
		};
	};
	helpers.distanceBetweenPoints = function(pt1, pt2) {
		return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
	};
	helpers.aliasPixel = function(pixelWidth) {
		return (pixelWidth % 2 === 0) ? 0 : 0.5;
	};
	helpers.splineCurve = function(firstPoint, middlePoint, afterPoint, t) {
		// Props to Rob Spencer at scaled innovation for his post on splining between points
		// http://scaledinnovation.com/analytics/splines/aboutSplines.html

		// This function must also respect "skipped" points

		var previous = firstPoint.skip ? middlePoint : firstPoint,
			current = middlePoint,
			next = afterPoint.skip ? middlePoint : afterPoint;

		var d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
		var d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));

		var s01 = d01 / (d01 + d12);
		var s12 = d12 / (d01 + d12);

		// If all points are the same, s01 & s02 will be inf
		s01 = isNaN(s01) ? 0 : s01;
		s12 = isNaN(s12) ? 0 : s12;

		var fa = t * s01; // scaling factor for triangle Ta
		var fb = t * s12;

		return {
			previous: {
				x: current.x - fa * (next.x - previous.x),
				y: current.y - fa * (next.y - previous.y)
			},
			next: {
				x: current.x + fb * (next.x - previous.x),
				y: current.y + fb * (next.y - previous.y)
			}
		};
	};
	helpers.EPSILON = Number.EPSILON || 1e-14;
	helpers.splineCurveMonotone = function(points) {
		// This function calculates Bézier control points in a similar way than |splineCurve|,
		// but preserves monotonicity of the provided data and ensures no local extremums are added
		// between the dataset discrete points due to the interpolation.
		// See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation

		var pointsWithTangents = (points || []).map(function(point) {
			return {
				model: point._model,
				deltaK: 0,
				mK: 0
			};
		});

		// Calculate slopes (deltaK) and initialize tangents (mK)
		var pointsLen = pointsWithTangents.length;
		var i, pointBefore, pointCurrent, pointAfter;
		for (i = 0; i < pointsLen; ++i) {
			pointCurrent = pointsWithTangents[i];
			if (pointCurrent.model.skip) {
				continue;
			}

			pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
			pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
			if (pointAfter && !pointAfter.model.skip) {
				var slopeDeltaX = (pointAfter.model.x - pointCurrent.model.x);

				// In the case of two points that appear at the same x pixel, slopeDeltaX is 0
				pointCurrent.deltaK = slopeDeltaX !== 0 ? (pointAfter.model.y - pointCurrent.model.y) / slopeDeltaX : 0;
			}

			if (!pointBefore || pointBefore.model.skip) {
				pointCurrent.mK = pointCurrent.deltaK;
			} else if (!pointAfter || pointAfter.model.skip) {
				pointCurrent.mK = pointBefore.deltaK;
			} else if (this.sign(pointBefore.deltaK) !== this.sign(pointCurrent.deltaK)) {
				pointCurrent.mK = 0;
			} else {
				pointCurrent.mK = (pointBefore.deltaK + pointCurrent.deltaK) / 2;
			}
		}

		// Adjust tangents to ensure monotonic properties
		var alphaK, betaK, tauK, squaredMagnitude;
		for (i = 0; i < pointsLen - 1; ++i) {
			pointCurrent = pointsWithTangents[i];
			pointAfter = pointsWithTangents[i + 1];
			if (pointCurrent.model.skip || pointAfter.model.skip) {
				continue;
			}

			if (helpers.almostEquals(pointCurrent.deltaK, 0, this.EPSILON)) {
				pointCurrent.mK = pointAfter.mK = 0;
				continue;
			}

			alphaK = pointCurrent.mK / pointCurrent.deltaK;
			betaK = pointAfter.mK / pointCurrent.deltaK;
			squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
			if (squaredMagnitude <= 9) {
				continue;
			}

			tauK = 3 / Math.sqrt(squaredMagnitude);
			pointCurrent.mK = alphaK * tauK * pointCurrent.deltaK;
			pointAfter.mK = betaK * tauK * pointCurrent.deltaK;
		}

		// Compute control points
		var deltaX;
		for (i = 0; i < pointsLen; ++i) {
			pointCurrent = pointsWithTangents[i];
			if (pointCurrent.model.skip) {
				continue;
			}

			pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
			pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
			if (pointBefore && !pointBefore.model.skip) {
				deltaX = (pointCurrent.model.x - pointBefore.model.x) / 3;
				pointCurrent.model.controlPointPreviousX = pointCurrent.model.x - deltaX;
				pointCurrent.model.controlPointPreviousY = pointCurrent.model.y - deltaX * pointCurrent.mK;
			}
			if (pointAfter && !pointAfter.model.skip) {
				deltaX = (pointAfter.model.x - pointCurrent.model.x) / 3;
				pointCurrent.model.controlPointNextX = pointCurrent.model.x + deltaX;
				pointCurrent.model.controlPointNextY = pointCurrent.model.y + deltaX * pointCurrent.mK;
			}
		}
	};
	helpers.nextItem = function(collection, index, loop) {
		if (loop) {
			return index >= collection.length - 1 ? collection[0] : collection[index + 1];
		}
		return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
	};
	helpers.previousItem = function(collection, index, loop) {
		if (loop) {
			return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
		}
		return index <= 0 ? collection[0] : collection[index - 1];
	};
	// Implementation of the nice number algorithm used in determining where axis labels will go
	helpers.niceNum = function(range, round) {
		var exponent = Math.floor(helpers.log10(range));
		var fraction = range / Math.pow(10, exponent);
		var niceFraction;

		if (round) {
			if (fraction < 1.5) {
				niceFraction = 1;
			} else if (fraction < 3) {
				niceFraction = 2;
			} else if (fraction < 7) {
				niceFraction = 5;
			} else {
				niceFraction = 10;
			}
		} else if (fraction <= 1.0) {
			niceFraction = 1;
		} else if (fraction <= 2) {
			niceFraction = 2;
		} else if (fraction <= 5) {
			niceFraction = 5;
		} else {
			niceFraction = 10;
		}

		return niceFraction * Math.pow(10, exponent);
	};
	// Easing functions adapted from Robert Penner's easing equations
	// http://www.robertpenner.com/easing/
	var easingEffects = helpers.easingEffects = {
		linear: function(t) {
			return t;
		},
		easeInQuad: function(t) {
			return t * t;
		},
		easeOutQuad: function(t) {
			return -1 * t * (t - 2);
		},
		easeInOutQuad: function(t) {
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * t * t;
			}
			return -1 / 2 * ((--t) * (t - 2) - 1);
		},
		easeInCubic: function(t) {
			return t * t * t;
		},
		easeOutCubic: function(t) {
			return 1 * ((t = t / 1 - 1) * t * t + 1);
		},
		easeInOutCubic: function(t) {
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * t * t * t;
			}
			return 1 / 2 * ((t -= 2) * t * t + 2);
		},
		easeInQuart: function(t) {
			return t * t * t * t;
		},
		easeOutQuart: function(t) {
			return -1 * ((t = t / 1 - 1) * t * t * t - 1);
		},
		easeInOutQuart: function(t) {
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * t * t * t * t;
			}
			return -1 / 2 * ((t -= 2) * t * t * t - 2);
		},
		easeInQuint: function(t) {
			return 1 * (t /= 1) * t * t * t * t;
		},
		easeOutQuint: function(t) {
			return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
		},
		easeInOutQuint: function(t) {
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * t * t * t * t * t;
			}
			return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
		},
		easeInSine: function(t) {
			return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
		},
		easeOutSine: function(t) {
			return 1 * Math.sin(t / 1 * (Math.PI / 2));
		},
		easeInOutSine: function(t) {
			return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
		},
		easeInExpo: function(t) {
			return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
		},
		easeOutExpo: function(t) {
			return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
		},
		easeInOutExpo: function(t) {
			if (t === 0) {
				return 0;
			}
			if (t === 1) {
				return 1;
			}
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * Math.pow(2, 10 * (t - 1));
			}
			return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
		},
		easeInCirc: function(t) {
			if (t >= 1) {
				return t;
			}
			return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
		},
		easeOutCirc: function(t) {
			return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
		},
		easeInOutCirc: function(t) {
			if ((t /= 1 / 2) < 1) {
				return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
			}
			return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
		},
		easeInElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t === 0) {
				return 0;
			}
			if ((t /= 1) === 1) {
				return 1;
			}
			if (!p) {
				p = 1 * 0.3;
			}
			if (a < Math.abs(1)) {
				a = 1;
				s = p / 4;
			} else {
				s = p / (2 * Math.PI) * Math.asin(1 / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
		},
		easeOutElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t === 0) {
				return 0;
			}
			if ((t /= 1) === 1) {
				return 1;
			}
			if (!p) {
				p = 1 * 0.3;
			}
			if (a < Math.abs(1)) {
				a = 1;
				s = p / 4;
			} else {
				s = p / (2 * Math.PI) * Math.asin(1 / a);
			}
			return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
		},
		easeInOutElastic: function(t) {
			var s = 1.70158;
			var p = 0;
			var a = 1;
			if (t === 0) {
				return 0;
			}
			if ((t /= 1 / 2) === 2) {
				return 1;
			}
			if (!p) {
				p = 1 * (0.3 * 1.5);
			}
			if (a < Math.abs(1)) {
				a = 1;
				s = p / 4;
			} else {
				s = p / (2 * Math.PI) * Math.asin(1 / a);
			}
			if (t < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
			}
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
		},
		easeInBack: function(t) {
			var s = 1.70158;
			return 1 * (t /= 1) * t * ((s + 1) * t - s);
		},
		easeOutBack: function(t) {
			var s = 1.70158;
			return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
		},
		easeInOutBack: function(t) {
			var s = 1.70158;
			if ((t /= 1 / 2) < 1) {
				return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
			}
			return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
		},
		easeInBounce: function(t) {
			return 1 - easingEffects.easeOutBounce(1 - t);
		},
		easeOutBounce: function(t) {
			if ((t /= 1) < (1 / 2.75)) {
				return 1 * (7.5625 * t * t);
			} else if (t < (2 / 2.75)) {
				return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
			} else if (t < (2.5 / 2.75)) {
				return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
			}
			return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
		},
		easeInOutBounce: function(t) {
			if (t < 1 / 2) {
				return easingEffects.easeInBounce(t * 2) * 0.5;
			}
			return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
		}
	};
	// Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	helpers.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				return window.setTimeout(callback, 1000 / 60);
			};
	}());
	// -- DOM methods
	helpers.getRelativePosition = function(evt, chart) {
		var mouseX, mouseY;
		var e = evt.originalEvent || evt,
			canvas = evt.currentTarget || evt.srcElement,
			boundingRect = canvas.getBoundingClientRect();

		var touches = e.touches;
		if (touches && touches.length > 0) {
			mouseX = touches[0].clientX;
			mouseY = touches[0].clientY;

		} else {
			mouseX = e.clientX;
			mouseY = e.clientY;
		}

		// Scale mouse coordinates into canvas coordinates
		// by following the pattern laid out by 'jerryj' in the comments of
		// http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
		var paddingLeft = parseFloat(helpers.getStyle(canvas, 'padding-left'));
		var paddingTop = parseFloat(helpers.getStyle(canvas, 'padding-top'));
		var paddingRight = parseFloat(helpers.getStyle(canvas, 'padding-right'));
		var paddingBottom = parseFloat(helpers.getStyle(canvas, 'padding-bottom'));
		var width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight;
		var height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;

		// We divide by the current device pixel ratio, because the canvas is scaled up by that amount in each direction. However
		// the backend model is in unscaled coordinates. Since we are going to deal with our model coordinates, we go back here
		mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / (width) * canvas.width / chart.currentDevicePixelRatio);
		mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / (height) * canvas.height / chart.currentDevicePixelRatio);

		return {
			x: mouseX,
			y: mouseY
		};

	};
	helpers.addEvent = function(node, eventType, method) {
		if (node.addEventListener) {
			node.addEventListener(eventType, method);
		} else if (node.attachEvent) {
			node.attachEvent('on' + eventType, method);
		} else {
			node['on' + eventType] = method;
		}
	};
	helpers.removeEvent = function(node, eventType, handler) {
		if (node.removeEventListener) {
			node.removeEventListener(eventType, handler, false);
		} else if (node.detachEvent) {
			node.detachEvent('on' + eventType, handler);
		} else {
			node['on' + eventType] = helpers.noop;
		}
	};

	// Private helper function to convert max-width/max-height values that may be percentages into a number
	function parseMaxStyle(styleValue, node, parentProperty) {
		var valueInPixels;
		if (typeof(styleValue) === 'string') {
			valueInPixels = parseInt(styleValue, 10);

			if (styleValue.indexOf('%') !== -1) {
				// percentage * size in dimension
				valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
			}
		} else {
			valueInPixels = styleValue;
		}

		return valueInPixels;
	}

	/**
	 * Returns if the given value contains an effective constraint.
	 * @private
	 */
	function isConstrainedValue(value) {
		return value !== undefined && value !== null && value !== 'none';
	}

	// Private helper to get a constraint dimension
	// @param domNode : the node to check the constraint on
	// @param maxStyle : the style that defines the maximum for the direction we are using (maxWidth / maxHeight)
	// @param percentageProperty : property of parent to use when calculating width as a percentage
	// @see http://www.nathanaeljones.com/blog/2013/reading-max-width-cross-browser
	function getConstraintDimension(domNode, maxStyle, percentageProperty) {
		var view = document.defaultView;
		var parentNode = domNode.parentNode;
		var constrainedNode = view.getComputedStyle(domNode)[maxStyle];
		var constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
		var hasCNode = isConstrainedValue(constrainedNode);
		var hasCContainer = isConstrainedValue(constrainedContainer);
		var infinity = Number.POSITIVE_INFINITY;

		if (hasCNode || hasCContainer) {
			return Math.min(
				hasCNode? parseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity,
				hasCContainer? parseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity);
		}

		return 'none';
	}
	// returns Number or undefined if no constraint
	helpers.getConstraintWidth = function(domNode) {
		return getConstraintDimension(domNode, 'max-width', 'clientWidth');
	};
	// returns Number or undefined if no constraint
	helpers.getConstraintHeight = function(domNode) {
		return getConstraintDimension(domNode, 'max-height', 'clientHeight');
	};
	helpers.getMaximumWidth = function(domNode) {
		var container = domNode.parentNode;
		var paddingLeft = parseInt(helpers.getStyle(container, 'padding-left'), 10);
		var paddingRight = parseInt(helpers.getStyle(container, 'padding-right'), 10);
		var w = container.clientWidth - paddingLeft - paddingRight;
		var cw = helpers.getConstraintWidth(domNode);
		return isNaN(cw)? w : Math.min(w, cw);
	};
	helpers.getMaximumHeight = function(domNode) {
		var container = domNode.parentNode;
		var paddingTop = parseInt(helpers.getStyle(container, 'padding-top'), 10);
		var paddingBottom = parseInt(helpers.getStyle(container, 'padding-bottom'), 10);
		var h = container.clientHeight - paddingTop - paddingBottom;
		var ch = helpers.getConstraintHeight(domNode);
		return isNaN(ch)? h : Math.min(h, ch);
	};
	helpers.getStyle = function(el, property) {
		return el.currentStyle ?
			el.currentStyle[property] :
			document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
	};
	helpers.retinaScale = function(chart) {
		var pixelRatio = chart.currentDevicePixelRatio = window.devicePixelRatio || 1;
		if (pixelRatio === 1) {
			return;
		}

		var canvas = chart.canvas;
		var height = chart.height;
		var width = chart.width;

		canvas.height = height * pixelRatio;
		canvas.width = width * pixelRatio;
		chart.ctx.scale(pixelRatio, pixelRatio);

		// If no style has been set on the canvas, the render size is used as display size,
		// making the chart visually bigger, so let's enforce it to the "correct" values.
		// See https://github.com/chartjs/Chart.js/issues/3575
		canvas.style.height = height + 'px';
		canvas.style.width = width + 'px';
	};
	// -- Canvas methods
	helpers.clear = function(chart) {
		chart.ctx.clearRect(0, 0, chart.width, chart.height);
	};
	helpers.fontString = function(pixelSize, fontStyle, fontFamily) {
		return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
	};
	helpers.longestText = function(ctx, font, arrayOfThings, cache) {
		cache = cache || {};
		var data = cache.data = cache.data || {};
		var gc = cache.garbageCollect = cache.garbageCollect || [];

		if (cache.font !== font) {
			data = cache.data = {};
			gc = cache.garbageCollect = [];
			cache.font = font;
		}

		ctx.font = font;
		var longest = 0;
		helpers.each(arrayOfThings, function(thing) {
			// Undefined strings and arrays should not be measured
			if (thing !== undefined && thing !== null && helpers.isArray(thing) !== true) {
				longest = helpers.measureText(ctx, data, gc, longest, thing);
			} else if (helpers.isArray(thing)) {
				// if it is an array lets measure each element
				// to do maybe simplify this function a bit so we can do this more recursively?
				helpers.each(thing, function(nestedThing) {
					// Undefined strings and arrays should not be measured
					if (nestedThing !== undefined && nestedThing !== null && !helpers.isArray(nestedThing)) {
						longest = helpers.measureText(ctx, data, gc, longest, nestedThing);
					}
				});
			}
		});

		var gcLen = gc.length / 2;
		if (gcLen > arrayOfThings.length) {
			for (var i = 0; i < gcLen; i++) {
				delete data[gc[i]];
			}
			gc.splice(0, gcLen);
		}
		return longest;
	};
	helpers.measureText = function(ctx, data, gc, longest, string) {
		var textWidth = data[string];
		if (!textWidth) {
			textWidth = data[string] = ctx.measureText(string).width;
			gc.push(string);
		}
		if (textWidth > longest) {
			longest = textWidth;
		}
		return longest;
	};
	helpers.numberOfLabelLines = function(arrayOfThings) {
		var numberOfLines = 1;
		helpers.each(arrayOfThings, function(thing) {
			if (helpers.isArray(thing)) {
				if (thing.length > numberOfLines) {
					numberOfLines = thing.length;
				}
			}
		});
		return numberOfLines;
	};
	helpers.drawRoundedRectangle = function(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	};
	helpers.color = function(c) {
		if (!color) {
			console.error('Color.js not found!');
			return c;
		}

		/* global CanvasGradient */
		if (c instanceof CanvasGradient) {
			return color(Chart.defaults.global.defaultColor);
		}

		return color(c);
	};
	helpers.isArray = Array.isArray?
		function(obj) {
			return Array.isArray(obj);
		} :
		function(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		};
	// ! @see http://stackoverflow.com/a/14853974
	helpers.arrayEquals = function(a0, a1) {
		var i, ilen, v0, v1;

		if (!a0 || !a1 || a0.length !== a1.length) {
			return false;
		}

		for (i = 0, ilen=a0.length; i < ilen; ++i) {
			v0 = a0[i];
			v1 = a1[i];

			if (v0 instanceof Array && v1 instanceof Array) {
				if (!helpers.arrayEquals(v0, v1)) {
					return false;
				}
			} else if (v0 !== v1) {
				// NOTE: two different object instances will never be equal: {x:20} != {x:20}
				return false;
			}
		}

		return true;
	};
	helpers.callCallback = function(fn, args, _tArg) {
		if (fn && typeof fn.call === 'function') {
			fn.apply(_tArg, args);
		}
	};
	helpers.getHoverColor = function(colorValue) {
		/* global CanvasPattern */
		return (colorValue instanceof CanvasPattern) ?
			colorValue :
			helpers.color(colorValue).saturate(0.5).darken(0.1).rgbString();
	};
};

},{"3":3}],27:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {
	var helpers = Chart.helpers;

	/**
	 * Helper function to get relative position for an event
	 * @param {Event|IEvent} event - The event to get the position for
	 * @param {Chart} chart - The chart
	 * @returns {Point} the event position
	 */
	function getRelativePosition(e, chart) {
		if (e.native) {
			return {
				x: e.x,
				y: e.y
			};
		}

		return helpers.getRelativePosition(e, chart);
	}

	/**
	 * Helper function to traverse all of the visible elements in the chart
	 * @param chart {chart} the chart
	 * @param handler {Function} the callback to execute for each visible item
	 */
	function parseVisibleItems(chart, handler) {
		var datasets = chart.data.datasets;
		var meta, i, j, ilen, jlen;

		for (i = 0, ilen = datasets.length; i < ilen; ++i) {
			if (!chart.isDatasetVisible(i)) {
				continue;
			}

			meta = chart.getDatasetMeta(i);
			for (j = 0, jlen = meta.data.length; j < jlen; ++j) {
				var element = meta.data[j];
				if (!element._view.skip) {
					handler(element);
				}
			}
		}
	}

	/**
	 * Helper function to get the items that intersect the event position
	 * @param items {ChartElement[]} elements to filter
	 * @param position {Point} the point to be nearest to
	 * @return {ChartElement[]} the nearest items
	 */
	function getIntersectItems(chart, position) {
		var elements = [];

		parseVisibleItems(chart, function(element) {
			if (element.inRange(position.x, position.y)) {
				elements.push(element);
			}
		});

		return elements;
	}

	/**
	 * Helper function to get the items nearest to the event position considering all visible items in teh chart
	 * @param chart {Chart} the chart to look at elements from
	 * @param position {Point} the point to be nearest to
	 * @param intersect {Boolean} if true, only consider items that intersect the position
	 * @param distanceMetric {Function} Optional function to provide the distance between
	 * @return {ChartElement[]} the nearest items
	 */
	function getNearestItems(chart, position, intersect, distanceMetric) {
		var minDistance = Number.POSITIVE_INFINITY;
		var nearestItems = [];

		if (!distanceMetric) {
			distanceMetric = helpers.distanceBetweenPoints;
		}

		parseVisibleItems(chart, function(element) {
			if (intersect && !element.inRange(position.x, position.y)) {
				return;
			}

			var center = element.getCenterPoint();
			var distance = distanceMetric(position, center);

			if (distance < minDistance) {
				nearestItems = [element];
				minDistance = distance;
			} else if (distance === minDistance) {
				// Can have multiple items at the same distance in which case we sort by size
				nearestItems.push(element);
			}
		});

		return nearestItems;
	}

	function indexMode(chart, e, options) {
		var position = getRelativePosition(e, chart.chart);
		var distanceMetric = function(pt1, pt2) {
			return Math.abs(pt1.x - pt2.x);
		};
		var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);
		var elements = [];

		if (!items.length) {
			return [];
		}

		chart.data.datasets.forEach(function(dataset, datasetIndex) {
			if (chart.isDatasetVisible(datasetIndex)) {
				var meta = chart.getDatasetMeta(datasetIndex),
					element = meta.data[items[0]._index];

				// don't count items that are skipped (null data)
				if (element && !element._view.skip) {
					elements.push(element);
				}
			}
		});

		return elements;
	}

	/**
	 * @interface IInteractionOptions
	 */
	/**
	 * If true, only consider items that intersect the point
	 * @name IInterfaceOptions#boolean
	 * @type Boolean
	 */

	/**
	 * Contains interaction related functions
	 * @namespace Chart.Interaction
	 */
	Chart.Interaction = {
		// Helper function for different modes
		modes: {
			single: function(chart, e) {
				var position = getRelativePosition(e, chart.chart);
				var elements = [];

				parseVisibleItems(chart, function(element) {
					if (element.inRange(position.x, position.y)) {
						elements.push(element);
						return elements;
					}
				});

				return elements.slice(0, 1);
			},

			/**
			 * @function Chart.Interaction.modes.label
			 * @deprecated since version 2.4.0
			 */
			label: indexMode,

			/**
			 * Returns items at the same index. If the options.intersect parameter is true, we only return items if we intersect something
			 * If the options.intersect mode is false, we find the nearest item and return the items at the same index as that item
			 * @function Chart.Interaction.modes.index
			 * @since v2.4.0
			 * @param chart {chart} the chart we are returning items from
			 * @param e {Event} the event we are find things at
			 * @param options {IInteractionOptions} options to use during interaction
			 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
			 */
			index: indexMode,

			/**
			 * Returns items in the same dataset. If the options.intersect parameter is true, we only return items if we intersect something
			 * If the options.intersect is false, we find the nearest item and return the items in that dataset
			 * @function Chart.Interaction.modes.dataset
			 * @param chart {chart} the chart we are returning items from
			 * @param e {Event} the event we are find things at
			 * @param options {IInteractionOptions} options to use during interaction
			 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
			 */
			dataset: function(chart, e, options) {
				var position = getRelativePosition(e, chart.chart);
				var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false);

				if (items.length > 0) {
					items = chart.getDatasetMeta(items[0]._datasetIndex).data;
				}

				return items;
			},

			/**
			 * @function Chart.Interaction.modes.x-axis
			 * @deprecated since version 2.4.0. Use index mode and intersect == true
			 */
			'x-axis': function(chart, e) {
				return indexMode(chart, e, true);
			},

			/**
			 * Point mode returns all elements that hit test based on the event position
			 * of the event
			 * @function Chart.Interaction.modes.intersect
			 * @param chart {chart} the chart we are returning items from
			 * @param e {Event} the event we are find things at
			 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
			 */
			point: function(chart, e) {
				var position = getRelativePosition(e, chart.chart);
				return getIntersectItems(chart, position);
			},

			/**
			 * nearest mode returns the element closest to the point
			 * @function Chart.Interaction.modes.intersect
			 * @param chart {chart} the chart we are returning items from
			 * @param e {Event} the event we are find things at
			 * @param options {IInteractionOptions} options to use
			 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
			 */
			nearest: function(chart, e, options) {
				var position = getRelativePosition(e, chart.chart);
				var nearestItems = getNearestItems(chart, position, options.intersect);

				// We have multiple items at the same distance from the event. Now sort by smallest
				if (nearestItems.length > 1) {
					nearestItems.sort(function(a, b) {
						var sizeA = a.getArea();
						var sizeB = b.getArea();
						var ret = sizeA - sizeB;

						if (ret === 0) {
							// if equal sort by dataset index
							ret = a._datasetIndex - b._datasetIndex;
						}

						return ret;
					});
				}

				// Return only 1 item
				return nearestItems.slice(0, 1);
			},

			/**
			 * x mode returns the elements that hit-test at the current x coordinate
			 * @function Chart.Interaction.modes.x
			 * @param chart {chart} the chart we are returning items from
			 * @param e {Event} the event we are find things at
			 * @param options {IInteractionOptions} options to use
			 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
			 */
			x: function(chart, e, options) {
				var position = getRelativePosition(e, chart.chart);
				var items = [];
				var intersectsItem = false;

				parseVisibleItems(chart, function(element) {
					if (element.inXRange(position.x)) {
						items.push(element);
					}

					if (element.inRange(position.x, position.y)) {
						intersectsItem = true;
					}
				});

				// If we want to trigger on an intersect and we don't have any items
				// that intersect the position, return nothing
				if (options.intersect && !intersectsItem) {
					items = [];
				}
				return items;
			},

			/**
			 * y mode returns the elements that hit-test at the current y coordinate
			 * @function Chart.Interaction.modes.y
			 * @param chart {chart} the chart we are returning items from
			 * @param e {Event} the event we are find things at
			 * @param options {IInteractionOptions} options to use
			 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
			 */
			y: function(chart, e, options) {
				var position = getRelativePosition(e, chart.chart);
				var items = [];
				var intersectsItem = false;

				parseVisibleItems(chart, function(element) {
					if (element.inYRange(position.y)) {
						items.push(element);
					}

					if (element.inRange(position.x, position.y)) {
						intersectsItem = true;
					}
				});

				// If we want to trigger on an intersect and we don't have any items
				// that intersect the position, return nothing
				if (options.intersect && !intersectsItem) {
					items = [];
				}
				return items;
			}
		}
	};
};

},{}],28:[function(require,module,exports){
'use strict';

module.exports = function() {

	// Occupy the global variable of Chart, and create a simple base class
	var Chart = function(item, config) {
		this.controller = new Chart.Controller(item, config, this);
		return this.controller;
	};

	// Globally expose the defaults to allow for user updating/changing
	Chart.defaults = {
		global: {
			responsive: true,
			responsiveAnimationDuration: 0,
			maintainAspectRatio: true,
			events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
			hover: {
				onHover: null,
				mode: 'nearest',
				intersect: true,
				animationDuration: 400
			},
			onClick: null,
			defaultColor: 'rgba(0,0,0,0.1)',
			defaultFontColor: '#666',
			defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
			defaultFontSize: 12,
			defaultFontStyle: 'normal',
			showLines: true,

			// Element defaults defined in element extensions
			elements: {},

			// Legend callback string
			legendCallback: function(chart) {
				var text = [];
				text.push('<ul class="' + chart.id + '-legend">');
				for (var i = 0; i < chart.data.datasets.length; i++) {
					text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
					if (chart.data.datasets[i].label) {
						text.push(chart.data.datasets[i].label);
					}
					text.push('</li>');
				}
				text.push('</ul>');

				return text.join('');
			}
		}
	};

	Chart.Chart = Chart;

	return Chart;
};

},{}],29:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	// The layout service is very self explanatory.  It's responsible for the layout within a chart.
	// Scales, Legends and Plugins all rely on the layout service and can easily register to be placed anywhere they need
	// It is this service's responsibility of carrying out that layout.
	Chart.layoutService = {
		defaults: {},

		// Register a box to a chartInstance. A box is simply a reference to an object that requires layout. eg. Scales, Legend, Plugins.
		addBox: function(chartInstance, box) {
			if (!chartInstance.boxes) {
				chartInstance.boxes = [];
			}
			chartInstance.boxes.push(box);
		},

		removeBox: function(chartInstance, box) {
			if (!chartInstance.boxes) {
				return;
			}
			chartInstance.boxes.splice(chartInstance.boxes.indexOf(box), 1);
		},

		// The most important function
		update: function(chartInstance, width, height) {

			if (!chartInstance) {
				return;
			}

			var layoutOptions = chartInstance.options.layout;
			var padding = layoutOptions ? layoutOptions.padding : null;

			var leftPadding = 0;
			var rightPadding = 0;
			var topPadding = 0;
			var bottomPadding = 0;

			if (!isNaN(padding)) {
				// options.layout.padding is a number. assign to all
				leftPadding = padding;
				rightPadding = padding;
				topPadding = padding;
				bottomPadding = padding;
			} else {
				leftPadding = padding.left || 0;
				rightPadding = padding.right || 0;
				topPadding = padding.top || 0;
				bottomPadding = padding.bottom || 0;
			}

			var leftBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'left';
			});
			var rightBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'right';
			});
			var topBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'top';
			});
			var bottomBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'bottom';
			});

			// Boxes that overlay the chartarea such as the radialLinear scale
			var chartAreaBoxes = helpers.where(chartInstance.boxes, function(box) {
				return box.options.position === 'chartArea';
			});

			// Ensure that full width boxes are at the very top / bottom
			topBoxes.sort(function(a, b) {
				return (b.options.fullWidth ? 1 : 0) - (a.options.fullWidth ? 1 : 0);
			});
			bottomBoxes.sort(function(a, b) {
				return (a.options.fullWidth ? 1 : 0) - (b.options.fullWidth ? 1 : 0);
			});

			// Essentially we now have any number of boxes on each of the 4 sides.
			// Our canvas looks like the following.
			// The areas L1 and L2 are the left axes. R1 is the right axis, T1 is the top axis and
			// B1 is the bottom axis
			// There are also 4 quadrant-like locations (left to right instead of clockwise) reserved for chart overlays
			// These locations are single-box locations only, when trying to register a chartArea location that is already taken,
			// an error will be thrown.
			//
			// |----------------------------------------------------|
			// |                  T1 (Full Width)                   |
			// |----------------------------------------------------|
			// |    |    |                 T2                  |    |
			// |    |----|-------------------------------------|----|
			// |    |    | C1 |                           | C2 |    |
			// |    |    |----|                           |----|    |
			// |    |    |                                     |    |
			// | L1 | L2 |           ChartArea (C0)            | R1 |
			// |    |    |                                     |    |
			// |    |    |----|                           |----|    |
			// |    |    | C3 |                           | C4 |    |
			// |    |----|-------------------------------------|----|
			// |    |    |                 B1                  |    |
			// |----------------------------------------------------|
			// |                  B2 (Full Width)                   |
			// |----------------------------------------------------|
			//
			// What we do to find the best sizing, we do the following
			// 1. Determine the minimum size of the chart area.
			// 2. Split the remaining width equally between each vertical axis
			// 3. Split the remaining height equally between each horizontal axis
			// 4. Give each layout the maximum size it can be. The layout will return it's minimum size
			// 5. Adjust the sizes of each axis based on it's minimum reported size.
			// 6. Refit each axis
			// 7. Position each axis in the final location
			// 8. Tell the chart the final location of the chart area
			// 9. Tell any axes that overlay the chart area the positions of the chart area

			// Step 1
			var chartWidth = width - leftPadding - rightPadding;
			var chartHeight = height - topPadding - bottomPadding;
			var chartAreaWidth = chartWidth / 2; // min 50%
			var chartAreaHeight = chartHeight / 2; // min 50%

			// Step 2
			var verticalBoxWidth = (width - chartAreaWidth) / (leftBoxes.length + rightBoxes.length);

			// Step 3
			var horizontalBoxHeight = (height - chartAreaHeight) / (topBoxes.length + bottomBoxes.length);

			// Step 4
			var maxChartAreaWidth = chartWidth;
			var maxChartAreaHeight = chartHeight;
			var minBoxSizes = [];

			function getMinimumBoxSize(box) {
				var minSize;
				var isHorizontal = box.isHorizontal();

				if (isHorizontal) {
					minSize = box.update(box.options.fullWidth ? chartWidth : maxChartAreaWidth, horizontalBoxHeight);
					maxChartAreaHeight -= minSize.height;
				} else {
					minSize = box.update(verticalBoxWidth, chartAreaHeight);
					maxChartAreaWidth -= minSize.width;
				}

				minBoxSizes.push({
					horizontal: isHorizontal,
					minSize: minSize,
					box: box,
				});
			}

			helpers.each(leftBoxes.concat(rightBoxes, topBoxes, bottomBoxes), getMinimumBoxSize);

			// If a horizontal box has padding, we move the left boxes over to avoid ugly charts (see issue #2478)
			var maxHorizontalLeftPadding = 0;
			var maxHorizontalRightPadding = 0;
			var maxVerticalTopPadding = 0;
			var maxVerticalBottomPadding = 0;

			helpers.each(topBoxes.concat(bottomBoxes), function(horizontalBox) {
				if (horizontalBox.getPadding) {
					var boxPadding = horizontalBox.getPadding();
					maxHorizontalLeftPadding = Math.max(maxHorizontalLeftPadding, boxPadding.left);
					maxHorizontalRightPadding = Math.max(maxHorizontalRightPadding, boxPadding.right);
				}
			});

			helpers.each(leftBoxes.concat(rightBoxes), function(verticalBox) {
				if (verticalBox.getPadding) {
					var boxPadding = verticalBox.getPadding();
					maxVerticalTopPadding = Math.max(maxVerticalTopPadding, boxPadding.top);
					maxVerticalBottomPadding = Math.max(maxVerticalBottomPadding, boxPadding.bottom);
				}
			});

			// At this point, maxChartAreaHeight and maxChartAreaWidth are the size the chart area could
			// be if the axes are drawn at their minimum sizes.
			// Steps 5 & 6
			var totalLeftBoxesWidth = leftPadding;
			var totalRightBoxesWidth = rightPadding;
			var totalTopBoxesHeight = topPadding;
			var totalBottomBoxesHeight = bottomPadding;

			// Function to fit a box
			function fitBox(box) {
				var minBoxSize = helpers.findNextWhere(minBoxSizes, function(minBox) {
					return minBox.box === box;
				});

				if (minBoxSize) {
					if (box.isHorizontal()) {
						var scaleMargin = {
							left: Math.max(totalLeftBoxesWidth, maxHorizontalLeftPadding),
							right: Math.max(totalRightBoxesWidth, maxHorizontalRightPadding),
							top: 0,
							bottom: 0
						};

						// Don't use min size here because of label rotation. When the labels are rotated, their rotation highly depends
						// on the margin. Sometimes they need to increase in size slightly
						box.update(box.options.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2, scaleMargin);
					} else {
						box.update(minBoxSize.minSize.width, maxChartAreaHeight);
					}
				}
			}

			// Update, and calculate the left and right margins for the horizontal boxes
			helpers.each(leftBoxes.concat(rightBoxes), fitBox);

			helpers.each(leftBoxes, function(box) {
				totalLeftBoxesWidth += box.width;
			});

			helpers.each(rightBoxes, function(box) {
				totalRightBoxesWidth += box.width;
			});

			// Set the Left and Right margins for the horizontal boxes
			helpers.each(topBoxes.concat(bottomBoxes), fitBox);

			// Figure out how much margin is on the top and bottom of the vertical boxes
			helpers.each(topBoxes, function(box) {
				totalTopBoxesHeight += box.height;
			});

			helpers.each(bottomBoxes, function(box) {
				totalBottomBoxesHeight += box.height;
			});

			function finalFitVerticalBox(box) {
				var minBoxSize = helpers.findNextWhere(minBoxSizes, function(minSize) {
					return minSize.box === box;
				});

				var scaleMargin = {
					left: 0,
					right: 0,
					top: totalTopBoxesHeight,
					bottom: totalBottomBoxesHeight
				};

				if (minBoxSize) {
					box.update(minBoxSize.minSize.width, maxChartAreaHeight, scaleMargin);
				}
			}

			// Let the left layout know the final margin
			helpers.each(leftBoxes.concat(rightBoxes), finalFitVerticalBox);

			// Recalculate because the size of each layout might have changed slightly due to the margins (label rotation for instance)
			totalLeftBoxesWidth = leftPadding;
			totalRightBoxesWidth = rightPadding;
			totalTopBoxesHeight = topPadding;
			totalBottomBoxesHeight = bottomPadding;

			helpers.each(leftBoxes, function(box) {
				totalLeftBoxesWidth += box.width;
			});

			helpers.each(rightBoxes, function(box) {
				totalRightBoxesWidth += box.width;
			});

			helpers.each(topBoxes, function(box) {
				totalTopBoxesHeight += box.height;
			});
			helpers.each(bottomBoxes, function(box) {
				totalBottomBoxesHeight += box.height;
			});

			// We may be adding some padding to account for rotated x axis labels
			var leftPaddingAddition = Math.max(maxHorizontalLeftPadding - totalLeftBoxesWidth, 0);
			totalLeftBoxesWidth += leftPaddingAddition;
			totalRightBoxesWidth += Math.max(maxHorizontalRightPadding - totalRightBoxesWidth, 0);

			var topPaddingAddition = Math.max(maxVerticalTopPadding - totalTopBoxesHeight, 0);
			totalTopBoxesHeight += topPaddingAddition;
			totalBottomBoxesHeight += Math.max(maxVerticalBottomPadding - totalBottomBoxesHeight, 0);

			// Figure out if our chart area changed. This would occur if the dataset layout label rotation
			// changed due to the application of the margins in step 6. Since we can only get bigger, this is safe to do
			// without calling `fit` again
			var newMaxChartAreaHeight = height - totalTopBoxesHeight - totalBottomBoxesHeight;
			var newMaxChartAreaWidth = width - totalLeftBoxesWidth - totalRightBoxesWidth;

			if (newMaxChartAreaWidth !== maxChartAreaWidth || newMaxChartAreaHeight !== maxChartAreaHeight) {
				helpers.each(leftBoxes, function(box) {
					box.height = newMaxChartAreaHeight;
				});

				helpers.each(rightBoxes, function(box) {
					box.height = newMaxChartAreaHeight;
				});

				helpers.each(topBoxes, function(box) {
					if (!box.options.fullWidth) {
						box.width = newMaxChartAreaWidth;
					}
				});

				helpers.each(bottomBoxes, function(box) {
					if (!box.options.fullWidth) {
						box.width = newMaxChartAreaWidth;
					}
				});

				maxChartAreaHeight = newMaxChartAreaHeight;
				maxChartAreaWidth = newMaxChartAreaWidth;
			}

			// Step 7 - Position the boxes
			var left = leftPadding + leftPaddingAddition;
			var top = topPadding + topPaddingAddition;

			function placeBox(box) {
				if (box.isHorizontal()) {
					box.left = box.options.fullWidth ? leftPadding : totalLeftBoxesWidth;
					box.right = box.options.fullWidth ? width - rightPadding : totalLeftBoxesWidth + maxChartAreaWidth;
					box.top = top;
					box.bottom = top + box.height;

					// Move to next point
					top = box.bottom;

				} else {

					box.left = left;
					box.right = left + box.width;
					box.top = totalTopBoxesHeight;
					box.bottom = totalTopBoxesHeight + maxChartAreaHeight;

					// Move to next point
					left = box.right;
				}
			}

			helpers.each(leftBoxes.concat(topBoxes), placeBox);

			// Account for chart width and height
			left += maxChartAreaWidth;
			top += maxChartAreaHeight;

			helpers.each(rightBoxes, placeBox);
			helpers.each(bottomBoxes, placeBox);

			// Step 8
			chartInstance.chartArea = {
				left: totalLeftBoxesWidth,
				top: totalTopBoxesHeight,
				right: totalLeftBoxesWidth + maxChartAreaWidth,
				bottom: totalTopBoxesHeight + maxChartAreaHeight
			};

			// Step 9
			helpers.each(chartAreaBoxes, function(box) {
				box.left = chartInstance.chartArea.left;
				box.top = chartInstance.chartArea.top;
				box.right = chartInstance.chartArea.right;
				box.bottom = chartInstance.chartArea.bottom;

				box.update(maxChartAreaWidth, maxChartAreaHeight);
			});
		}
	};
};

},{}],30:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var noop = helpers.noop;

	Chart.defaults.global.legend = {

		display: true,
		position: 'top',
		fullWidth: true, // marks that this box should take the full width of the canvas (pushing down other boxes)
		reverse: false,

		// a callback that will handle
		onClick: function(e, legendItem) {
			var index = legendItem.datasetIndex;
			var ci = this.chart;
			var meta = ci.getDatasetMeta(index);

			// See controller.isDatasetVisible comment
			meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;

			// We hid a dataset ... rerender the chart
			ci.update();
		},

		onHover: null,

		labels: {
			boxWidth: 40,
			padding: 10,
			// Generates labels shown in the legend
			// Valid properties to return:
			// text : text to display
			// fillStyle : fill of coloured box
			// strokeStyle: stroke of coloured box
			// hidden : if this legend item refers to a hidden item
			// lineCap : cap style for line
			// lineDash
			// lineDashOffset :
			// lineJoin :
			// lineWidth :
			generateLabels: function(chart) {
				var data = chart.data;
				return helpers.isArray(data.datasets) ? data.datasets.map(function(dataset, i) {
					return {
						text: dataset.label,
						fillStyle: (!helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]),
						hidden: !chart.isDatasetVisible(i),
						lineCap: dataset.borderCapStyle,
						lineDash: dataset.borderDash,
						lineDashOffset: dataset.borderDashOffset,
						lineJoin: dataset.borderJoinStyle,
						lineWidth: dataset.borderWidth,
						strokeStyle: dataset.borderColor,
						pointStyle: dataset.pointStyle,

						// Below is extra data used for toggling the datasets
						datasetIndex: i
					};
				}, this) : [];
			}
		}
	};

	/**
	 * Helper function to get the box width based on the usePointStyle option
	 * @param labelopts {Object} the label options on the legend
	 * @param fontSize {Number} the label font size
	 * @return {Number} width of the color box area
	 */
	function getBoxWidth(labelOpts, fontSize) {
		return labelOpts.usePointStyle ?
			fontSize * Math.SQRT2 :
			labelOpts.boxWidth;
	}

	Chart.Legend = Chart.Element.extend({

		initialize: function(config) {
			helpers.extend(this, config);

			// Contains hit boxes for each dataset (in dataset order)
			this.legendHitBoxes = [];

			// Are we in doughnut mode which has a different data type
			this.doughnutMode = false;
		},

		// These methods are ordered by lifecycle. Utilities then follow.
		// Any function defined here is inherited by all legend types.
		// Any function can be extended by the legend type

		beforeUpdate: noop,
		update: function(maxWidth, maxHeight, margins) {
			var me = this;

			// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
			me.beforeUpdate();

			// Absorb the master measurements
			me.maxWidth = maxWidth;
			me.maxHeight = maxHeight;
			me.margins = margins;

			// Dimensions
			me.beforeSetDimensions();
			me.setDimensions();
			me.afterSetDimensions();
			// Labels
			me.beforeBuildLabels();
			me.buildLabels();
			me.afterBuildLabels();

			// Fit
			me.beforeFit();
			me.fit();
			me.afterFit();
			//
			me.afterUpdate();

			return me.minSize;
		},
		afterUpdate: noop,

		//

		beforeSetDimensions: noop,
		setDimensions: function() {
			var me = this;
			// Set the unconstrained dimension before label rotation
			if (me.isHorizontal()) {
				// Reset position before calculating rotation
				me.width = me.maxWidth;
				me.left = 0;
				me.right = me.width;
			} else {
				me.height = me.maxHeight;

				// Reset position before calculating rotation
				me.top = 0;
				me.bottom = me.height;
			}

			// Reset padding
			me.paddingLeft = 0;
			me.paddingTop = 0;
			me.paddingRight = 0;
			me.paddingBottom = 0;

			// Reset minSize
			me.minSize = {
				width: 0,
				height: 0
			};
		},
		afterSetDimensions: noop,

		//

		beforeBuildLabels: noop,
		buildLabels: function() {
			var me = this;
			var labelOpts = me.options.labels;
			var legendItems = labelOpts.generateLabels.call(me, me.chart);

			if (labelOpts.filter) {
				legendItems = legendItems.filter(function(item) {
					return labelOpts.filter(item, me.chart.data);
				});
			}

			if (me.options.reverse) {
				legendItems.reverse();
			}

			me.legendItems = legendItems;
		},
		afterBuildLabels: noop,

		//

		beforeFit: noop,
		fit: function() {
			var me = this;
			var opts = me.options;
			var labelOpts = opts.labels;
			var display = opts.display;

			var ctx = me.ctx;

			var globalDefault = Chart.defaults.global,
				itemOrDefault = helpers.getValueOrDefault,
				fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize),
				fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle),
				fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily),
				labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

			// Reset hit boxes
			var hitboxes = me.legendHitBoxes = [];

			var minSize = me.minSize;
			var isHorizontal = me.isHorizontal();

			if (isHorizontal) {
				minSize.width = me.maxWidth; // fill all the width
				minSize.height = display ? 10 : 0;
			} else {
				minSize.width = display ? 10 : 0;
				minSize.height = me.maxHeight; // fill all the height
			}

			// Increase sizes here
			if (display) {
				ctx.font = labelFont;

				if (isHorizontal) {
					// Labels

					// Width of each line of legend boxes. Labels wrap onto multiple lines when there are too many to fit on one
					var lineWidths = me.lineWidths = [0];
					var totalHeight = me.legendItems.length ? fontSize + (labelOpts.padding) : 0;

					ctx.textAlign = 'left';
					ctx.textBaseline = 'top';

					helpers.each(me.legendItems, function(legendItem, i) {
						var boxWidth = getBoxWidth(labelOpts, fontSize);
						var width = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;

						if (lineWidths[lineWidths.length - 1] + width + labelOpts.padding >= me.width) {
							totalHeight += fontSize + (labelOpts.padding);
							lineWidths[lineWidths.length] = me.left;
						}

						// Store the hitbox width and height here. Final position will be updated in `draw`
						hitboxes[i] = {
							left: 0,
							top: 0,
							width: width,
							height: fontSize
						};

						lineWidths[lineWidths.length - 1] += width + labelOpts.padding;
					});

					minSize.height += totalHeight;

				} else {
					var vPadding = labelOpts.padding;
					var columnWidths = me.columnWidths = [];
					var totalWidth = labelOpts.padding;
					var currentColWidth = 0;
					var currentColHeight = 0;
					var itemHeight = fontSize + vPadding;

					helpers.each(me.legendItems, function(legendItem, i) {
						var boxWidth = getBoxWidth(labelOpts, fontSize);
						var itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;

						// If too tall, go to new column
						if (currentColHeight + itemHeight > minSize.height) {
							totalWidth += currentColWidth + labelOpts.padding;
							columnWidths.push(currentColWidth); // previous column width

							currentColWidth = 0;
							currentColHeight = 0;
						}

						// Get max width
						currentColWidth = Math.max(currentColWidth, itemWidth);
						currentColHeight += itemHeight;

						// Store the hitbox width and height here. Final position will be updated in `draw`
						hitboxes[i] = {
							left: 0,
							top: 0,
							width: itemWidth,
							height: fontSize
						};
					});

					totalWidth += currentColWidth;
					columnWidths.push(currentColWidth);
					minSize.width += totalWidth;
				}
			}

			me.width = minSize.width;
			me.height = minSize.height;
		},
		afterFit: noop,

		// Shared Methods
		isHorizontal: function() {
			return this.options.position === 'top' || this.options.position === 'bottom';
		},

		// Actually draw the legend on the canvas
		draw: function() {
			var me = this;
			var opts = me.options;
			var labelOpts = opts.labels;
			var globalDefault = Chart.defaults.global,
				lineDefault = globalDefault.elements.line,
				legendWidth = me.width,
				lineWidths = me.lineWidths;

			if (opts.display) {
				var ctx = me.ctx,
					cursor,
					itemOrDefault = helpers.getValueOrDefault,
					fontColor = itemOrDefault(labelOpts.fontColor, globalDefault.defaultFontColor),
					fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize),
					fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle),
					fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily),
					labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

				// Canvas setup
				ctx.textAlign = 'left';
				ctx.textBaseline = 'top';
				ctx.lineWidth = 0.5;
				ctx.strokeStyle = fontColor; // for strikethrough effect
				ctx.fillStyle = fontColor; // render in correct colour
				ctx.font = labelFont;

				var boxWidth = getBoxWidth(labelOpts, fontSize),
					hitboxes = me.legendHitBoxes;

				// current position
				var drawLegendBox = function(x, y, legendItem) {
					if (isNaN(boxWidth) || boxWidth <= 0) {
						return;
					}

					// Set the ctx for the box
					ctx.save();

					ctx.fillStyle = itemOrDefault(legendItem.fillStyle, globalDefault.defaultColor);
					ctx.lineCap = itemOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
					ctx.lineDashOffset = itemOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
					ctx.lineJoin = itemOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
					ctx.lineWidth = itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
					ctx.strokeStyle = itemOrDefault(legendItem.strokeStyle, globalDefault.defaultColor);
					var isLineWidthZero = (itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth) === 0);

					if (ctx.setLineDash) {
						// IE 9 and 10 do not support line dash
						ctx.setLineDash(itemOrDefault(legendItem.lineDash, lineDefault.borderDash));
					}

					if (opts.labels && opts.labels.usePointStyle) {
						// Recalculate x and y for drawPoint() because its expecting
						// x and y to be center of figure (instead of top left)
						var radius = fontSize * Math.SQRT2 / 2;
						var offSet = radius / Math.SQRT2;
						var centerX = x + offSet;
						var centerY = y + offSet;

						// Draw pointStyle as legend symbol
						Chart.canvasHelpers.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
					} else {
						// Draw box as legend symbol
						if (!isLineWidthZero) {
							ctx.strokeRect(x, y, boxWidth, fontSize);
						}
						ctx.fillRect(x, y, boxWidth, fontSize);
					}

					ctx.restore();
				};
				var fillText = function(x, y, legendItem, textWidth) {
					ctx.fillText(legendItem.text, boxWidth + (fontSize / 2) + x, y);

					if (legendItem.hidden) {
						// Strikethrough the text if hidden
						ctx.beginPath();
						ctx.lineWidth = 2;
						ctx.moveTo(boxWidth + (fontSize / 2) + x, y + (fontSize / 2));
						ctx.lineTo(boxWidth + (fontSize / 2) + x + textWidth, y + (fontSize / 2));
						ctx.stroke();
					}
				};

				// Horizontal
				var isHorizontal = me.isHorizontal();
				if (isHorizontal) {
					cursor = {
						x: me.left + ((legendWidth - lineWidths[0]) / 2),
						y: me.top + labelOpts.padding,
						line: 0
					};
				} else {
					cursor = {
						x: me.left + labelOpts.padding,
						y: me.top + labelOpts.padding,
						line: 0
					};
				}

				var itemHeight = fontSize + labelOpts.padding;
				helpers.each(me.legendItems, function(legendItem, i) {
					var textWidth = ctx.measureText(legendItem.text).width,
						width = boxWidth + (fontSize / 2) + textWidth,
						x = cursor.x,
						y = cursor.y;

					if (isHorizontal) {
						if (x + width >= legendWidth) {
							y = cursor.y += itemHeight;
							cursor.line++;
							x = cursor.x = me.left + ((legendWidth - lineWidths[cursor.line]) / 2);
						}
					} else if (y + itemHeight > me.bottom) {
						x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
						y = cursor.y = me.top + labelOpts.padding;
						cursor.line++;
					}

					drawLegendBox(x, y, legendItem);

					hitboxes[i].left = x;
					hitboxes[i].top = y;

					// Fill the actual label
					fillText(x, y, legendItem, textWidth);

					if (isHorizontal) {
						cursor.x += width + (labelOpts.padding);
					} else {
						cursor.y += itemHeight;
					}

				});
			}
		},

		/**
		 * Handle an event
		 * @private
		 * @param {IEvent} event - The event to handle
		 * @return {Boolean} true if a change occured
		 */
		handleEvent: function(e) {
			var me = this;
			var opts = me.options;
			var type = e.type === 'mouseup' ? 'click' : e.type;
			var changed = false;

			if (type === 'mousemove') {
				if (!opts.onHover) {
					return;
				}
			} else if (type === 'click') {
				if (!opts.onClick) {
					return;
				}
			} else {
				return;
			}

			// Chart event already has relative position in it
			var x = e.x,
				y = e.y;

			if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) {
				// See if we are touching one of the dataset boxes
				var lh = me.legendHitBoxes;
				for (var i = 0; i < lh.length; ++i) {
					var hitBox = lh[i];

					if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
						// Touching an element
						if (type === 'click') {
							// use e.native for backwards compatibility
							opts.onClick.call(me, e.native, me.legendItems[i]);
							changed = true;
							break;
						} else if (type === 'mousemove') {
							// use e.native for backwards compatibility
							opts.onHover.call(me, e.native, me.legendItems[i]);
							changed = true;
							break;
						}
					}
				}
			}

			return changed;
		}
	});

	function createNewLegendAndAttach(chartInstance, legendOpts) {
		var legend = new Chart.Legend({
			ctx: chartInstance.chart.ctx,
			options: legendOpts,
			chart: chartInstance
		});
		chartInstance.legend = legend;
		Chart.layoutService.addBox(chartInstance, legend);
	}

	// Register the legend plugin
	Chart.plugins.register({
		beforeInit: function(chartInstance) {
			var legendOpts = chartInstance.options.legend;

			if (legendOpts) {
				createNewLegendAndAttach(chartInstance, legendOpts);
			}
		},
		beforeUpdate: function(chartInstance) {
			var legendOpts = chartInstance.options.legend;

			if (legendOpts) {
				legendOpts = helpers.configMerge(Chart.defaults.global.legend, legendOpts);

				if (chartInstance.legend) {
					chartInstance.legend.options = legendOpts;
				} else {
					createNewLegendAndAttach(chartInstance, legendOpts);
				}
			} else {
				Chart.layoutService.removeBox(chartInstance, chartInstance.legend);
				delete chartInstance.legend;
			}
		},
		afterEvent: function(chartInstance, e) {
			var legend = chartInstance.legend;
			if (legend) {
				legend.handleEvent(e);
			}
		}
	});
};

},{}],31:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.global.plugins = {};

	/**
	 * The plugin service singleton
	 * @namespace Chart.plugins
	 * @since 2.1.0
	 */
	Chart.plugins = {
		/**
		 * Globally registered plugins.
		 * @private
		 */
		_plugins: [],

		/**
		 * This identifier is used to invalidate the descriptors cache attached to each chart
		 * when a global plugin is registered or unregistered. In this case, the cache ID is
		 * incremented and descriptors are regenerated during following API calls.
		 * @private
		 */
		_cacheId: 0,

		/**
		 * Registers the given plugin(s) if not already registered.
		 * @param {Array|Object} plugins plugin instance(s).
		 */
		register: function(plugins) {
			var p = this._plugins;
			([]).concat(plugins).forEach(function(plugin) {
				if (p.indexOf(plugin) === -1) {
					p.push(plugin);
				}
			});

			this._cacheId++;
		},

		/**
		 * Unregisters the given plugin(s) only if registered.
		 * @param {Array|Object} plugins plugin instance(s).
		 */
		unregister: function(plugins) {
			var p = this._plugins;
			([]).concat(plugins).forEach(function(plugin) {
				var idx = p.indexOf(plugin);
				if (idx !== -1) {
					p.splice(idx, 1);
				}
			});

			this._cacheId++;
		},

		/**
		 * Remove all registered plugins.
		 * @since 2.1.5
		 */
		clear: function() {
			this._plugins = [];
			this._cacheId++;
		},

		/**
		 * Returns the number of registered plugins?
		 * @returns {Number}
		 * @since 2.1.5
		 */
		count: function() {
			return this._plugins.length;
		},

		/**
		 * Returns all registered plugin instances.
		 * @returns {Array} array of plugin objects.
		 * @since 2.1.5
		 */
		getAll: function() {
			return this._plugins;
		},

		/**
		 * Calls enabled plugins for `chart` on the specified hook and with the given args.
		 * This method immediately returns as soon as a plugin explicitly returns false. The
		 * returned value can be used, for instance, to interrupt the current action.
		 * @param {Object} chart - The chart instance for which plugins should be called.
		 * @param {String} hook - The name of the plugin method to call (e.g. 'beforeUpdate').
		 * @param {Array} [args] - Extra arguments to apply to the hook call.
		 * @returns {Boolean} false if any of the plugins return false, else returns true.
		 */
		notify: function(chart, hook, args) {
			var descriptors = this.descriptors(chart);
			var ilen = descriptors.length;
			var i, descriptor, plugin, params, method;

			for (i=0; i<ilen; ++i) {
				descriptor = descriptors[i];
				plugin = descriptor.plugin;
				method = plugin[hook];
				if (typeof method === 'function') {
					params = [chart].concat(args || []);
					params.push(descriptor.options);
					if (method.apply(plugin, params) === false) {
						return false;
					}
				}
			}

			return true;
		},

		/**
		 * Returns descriptors of enabled plugins for the given chart.
		 * @returns {Array} [{ plugin, options }]
		 * @private
		 */
		descriptors: function(chart) {
			var cache = chart._plugins || (chart._plugins = {});
			if (cache.id === this._cacheId) {
				return cache.descriptors;
			}

			var plugins = [];
			var descriptors = [];
			var config = (chart && chart.config) || {};
			var defaults = Chart.defaults.global.plugins;
			var options = (config.options && config.options.plugins) || {};

			this._plugins.concat(config.plugins || []).forEach(function(plugin) {
				var idx = plugins.indexOf(plugin);
				if (idx !== -1) {
					return;
				}

				var id = plugin.id;
				var opts = options[id];
				if (opts === false) {
					return;
				}

				if (opts === true) {
					opts = helpers.clone(defaults[id]);
				}

				plugins.push(plugin);
				descriptors.push({
					plugin: plugin,
					options: opts || {}
				});
			});

			cache.descriptors = descriptors;
			cache.id = this._cacheId;
			return descriptors;
		}
	};

	/**
	 * Plugin extension hooks.
	 * @interface IPlugin
	 * @since 2.1.0
	 */
	/**
	 * @method IPlugin#beforeInit
	 * @desc Called before initializing `chart`.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#afterInit
	 * @desc Called after `chart` has been initialized and before the first update.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#beforeUpdate
	 * @desc Called before updating `chart`. If any plugin returns `false`, the update
	 * is cancelled (and thus subsequent render(s)) until another `update` is triggered.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 * @returns {Boolean} `false` to cancel the chart update.
	 */
	/**
	 * @method IPlugin#afterUpdate
	 * @desc Called after `chart` has been updated and before rendering. Note that this
	 * hook will not be called if the chart update has been previously cancelled.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#beforeDatasetsUpdate
 	 * @desc Called before updating the `chart` datasets. If any plugin returns `false`,
	 * the datasets update is cancelled until another `update` is triggered.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 * @returns {Boolean} false to cancel the datasets update.
	 * @since version 2.1.5
	 */
	/**
	 * @method IPlugin#afterDatasetsUpdate
	 * @desc Called after the `chart` datasets have been updated. Note that this hook
	 * will not be called if the datasets update has been previously cancelled.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 * @since version 2.1.5
	 */
	/**
	 * @method IPlugin#beforeLayout
	 * @desc Called before laying out `chart`. If any plugin returns `false`,
	 * the layout update is cancelled until another `update` is triggered.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 * @returns {Boolean} `false` to cancel the chart layout.
	 */
	/**
	 * @method IPlugin#afterLayout
	 * @desc Called after the `chart` has been layed out. Note that this hook will not
	 * be called if the layout update has been previously cancelled.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#beforeRender
	 * @desc Called before rendering `chart`. If any plugin returns `false`,
	 * the rendering is cancelled until another `render` is triggered.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 * @returns {Boolean} `false` to cancel the chart rendering.
	 */
	/**
	 * @method IPlugin#afterRender
	 * @desc Called after the `chart` has been fully rendered (and animation completed). Note
	 * that this hook will not be called if the rendering has been previously cancelled.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#beforeDraw
	 * @desc Called before drawing `chart` at every animation frame specified by the given
	 * easing value. If any plugin returns `false`, the frame drawing is cancelled until
	 * another `render` is triggered.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Number} easingValue - The current animation value, between 0.0 and 1.0.
	 * @param {Object} options - The plugin options.
	 * @returns {Boolean} `false` to cancel the chart drawing.
	 */
	/**
	 * @method IPlugin#afterDraw
	 * @desc Called after the `chart` has been drawn for the specific easing value. Note
	 * that this hook will not be called if the drawing has been previously cancelled.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Number} easingValue - The current animation value, between 0.0 and 1.0.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#beforeDatasetsDraw
 	 * @desc Called before drawing the `chart` datasets. If any plugin returns `false`,
	 * the datasets drawing is cancelled until another `render` is triggered.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Number} easingValue - The current animation value, between 0.0 and 1.0.
	 * @param {Object} options - The plugin options.
	 * @returns {Boolean} `false` to cancel the chart datasets drawing.
	 */
	/**
	 * @method IPlugin#afterDatasetsDraw
	 * @desc Called after the `chart` datasets have been drawn. Note that this hook
	 * will not be called if the datasets drawing has been previously cancelled.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Number} easingValue - The current animation value, between 0.0 and 1.0.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#beforeEvent
 	 * @desc Called before processing the specified `event`. If any plugin returns `false`,
	 * the event will be discarded.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {IEvent} event - The event object.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#afterEvent
	 * @desc Called after the `event` has been consumed. Note that this hook
	 * will not be called if the `event` has been previously discarded.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {IEvent} event - The event object.
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#resize
	 * @desc Called after the chart as been resized.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Number} size - The new canvas display size (eq. canvas.style width & height).
	 * @param {Object} options - The plugin options.
	 */
	/**
	 * @method IPlugin#destroy
	 * @desc Called after the chart as been destroyed.
	 * @param {Chart.Controller} chart - The chart instance.
	 * @param {Object} options - The plugin options.
	 */

	/**
	 * Provided for backward compatibility, use Chart.plugins instead
	 * @namespace Chart.pluginService
	 * @deprecated since version 2.1.5
	 * @todo remove at version 3
	 * @private
	 */
	Chart.pluginService = Chart.plugins;

	/**
	 * Provided for backward compatibility, inheriting from Chart.PlugingBase has no
	 * effect, instead simply create/register plugins via plain JavaScript objects.
	 * @interface Chart.PluginBase
	 * @deprecated since version 2.5.0
	 * @todo remove at version 3
	 * @private
	 */
	Chart.PluginBase = helpers.inherits({});
};

},{}],32:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.scale = {
		display: true,
		position: 'left',

		// grid line settings
		gridLines: {
			display: true,
			color: 'rgba(0, 0, 0, 0.1)',
			lineWidth: 1,
			drawBorder: true,
			drawOnChartArea: true,
			drawTicks: true,
			tickMarkLength: 10,
			zeroLineWidth: 1,
			zeroLineColor: 'rgba(0,0,0,0.25)',
			offsetGridLines: false,
			borderDash: [],
			borderDashOffset: 0.0
		},

		// scale label
		scaleLabel: {
			// actual label
			labelString: '',

			// display property
			display: false
		},

		// label settings
		ticks: {
			beginAtZero: false,
			minRotation: 0,
			maxRotation: 50,
			mirror: false,
			padding: 0,
			reverse: false,
			display: true,
			autoSkip: true,
			autoSkipPadding: 0,
			labelOffset: 0,
			// We pass through arrays to be rendered as multiline labels, we convert Others to strings here.
			callback: Chart.Ticks.formatters.values
		}
	};

	function computeTextSize(context, tick, font) {
		return helpers.isArray(tick) ?
			helpers.longestText(context, font, tick) :
			context.measureText(tick).width;
	}

	function parseFontOptions(options) {
		var getValueOrDefault = helpers.getValueOrDefault;
		var globalDefaults = Chart.defaults.global;
		var size = getValueOrDefault(options.fontSize, globalDefaults.defaultFontSize);
		var style = getValueOrDefault(options.fontStyle, globalDefaults.defaultFontStyle);
		var family = getValueOrDefault(options.fontFamily, globalDefaults.defaultFontFamily);

		return {
			size: size,
			style: style,
			family: family,
			font: helpers.fontString(size, style, family)
		};
	}

	Chart.Scale = Chart.Element.extend({
		/**
		 * Get the padding needed for the scale
		 * @method getPadding
		 * @private
		 * @returns {Padding} the necessary padding
		 */
		getPadding: function() {
			var me = this;
			return {
				left: me.paddingLeft || 0,
				top: me.paddingTop || 0,
				right: me.paddingRight || 0,
				bottom: me.paddingBottom || 0
			};
		},

		// These methods are ordered by lifecyle. Utilities then follow.
		// Any function defined here is inherited by all scale types.
		// Any function can be extended by the scale type

		beforeUpdate: function() {
			helpers.callCallback(this.options.beforeUpdate, [this]);
		},
		update: function(maxWidth, maxHeight, margins) {
			var me = this;

			// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
			me.beforeUpdate();

			// Absorb the master measurements
			me.maxWidth = maxWidth;
			me.maxHeight = maxHeight;
			me.margins = helpers.extend({
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}, margins);
			me.longestTextCache = me.longestTextCache || {};

			// Dimensions
			me.beforeSetDimensions();
			me.setDimensions();
			me.afterSetDimensions();

			// Data min/max
			me.beforeDataLimits();
			me.determineDataLimits();
			me.afterDataLimits();

			// Ticks
			me.beforeBuildTicks();
			me.buildTicks();
			me.afterBuildTicks();

			me.beforeTickToLabelConversion();
			me.convertTicksToLabels();
			me.afterTickToLabelConversion();

			// Tick Rotation
			me.beforeCalculateTickRotation();
			me.calculateTickRotation();
			me.afterCalculateTickRotation();
			// Fit
			me.beforeFit();
			me.fit();
			me.afterFit();
			//
			me.afterUpdate();

			return me.minSize;

		},
		afterUpdate: function() {
			helpers.callCallback(this.options.afterUpdate, [this]);
		},

		//

		beforeSetDimensions: function() {
			helpers.callCallback(this.options.beforeSetDimensions, [this]);
		},
		setDimensions: function() {
			var me = this;
			// Set the unconstrained dimension before label rotation
			if (me.isHorizontal()) {
				// Reset position before calculating rotation
				me.width = me.maxWidth;
				me.left = 0;
				me.right = me.width;
			} else {
				me.height = me.maxHeight;

				// Reset position before calculating rotation
				me.top = 0;
				me.bottom = me.height;
			}

			// Reset padding
			me.paddingLeft = 0;
			me.paddingTop = 0;
			me.paddingRight = 0;
			me.paddingBottom = 0;
		},
		afterSetDimensions: function() {
			helpers.callCallback(this.options.afterSetDimensions, [this]);
		},

		// Data limits
		beforeDataLimits: function() {
			helpers.callCallback(this.options.beforeDataLimits, [this]);
		},
		determineDataLimits: helpers.noop,
		afterDataLimits: function() {
			helpers.callCallback(this.options.afterDataLimits, [this]);
		},

		//
		beforeBuildTicks: function() {
			helpers.callCallback(this.options.beforeBuildTicks, [this]);
		},
		buildTicks: helpers.noop,
		afterBuildTicks: function() {
			helpers.callCallback(this.options.afterBuildTicks, [this]);
		},

		beforeTickToLabelConversion: function() {
			helpers.callCallback(this.options.beforeTickToLabelConversion, [this]);
		},
		convertTicksToLabels: function() {
			var me = this;
			// Convert ticks to strings
			var tickOpts = me.options.ticks;
			me.ticks = me.ticks.map(tickOpts.userCallback || tickOpts.callback);
		},
		afterTickToLabelConversion: function() {
			helpers.callCallback(this.options.afterTickToLabelConversion, [this]);
		},

		//

		beforeCalculateTickRotation: function() {
			helpers.callCallback(this.options.beforeCalculateTickRotation, [this]);
		},
		calculateTickRotation: function() {
			var me = this;
			var context = me.ctx;
			var tickOpts = me.options.ticks;

			// Get the width of each grid by calculating the difference
			// between x offsets between 0 and 1.
			var tickFont = parseFontOptions(tickOpts);
			context.font = tickFont.font;

			var labelRotation = tickOpts.minRotation || 0;

			if (me.options.display && me.isHorizontal()) {
				var originalLabelWidth = helpers.longestText(context, tickFont.font, me.ticks, me.longestTextCache);
				var labelWidth = originalLabelWidth;
				var cosRotation;
				var sinRotation;

				// Allow 3 pixels x2 padding either side for label readability
				var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;

				// Max label rotation can be set or default to 90 - also act as a loop counter
				while (labelWidth > tickWidth && labelRotation < tickOpts.maxRotation) {
					var angleRadians = helpers.toRadians(labelRotation);
					cosRotation = Math.cos(angleRadians);
					sinRotation = Math.sin(angleRadians);

					if (sinRotation * originalLabelWidth > me.maxHeight) {
						// go back one step
						labelRotation--;
						break;
					}

					labelRotation++;
					labelWidth = cosRotation * originalLabelWidth;
				}
			}

			me.labelRotation = labelRotation;
		},
		afterCalculateTickRotation: function() {
			helpers.callCallback(this.options.afterCalculateTickRotation, [this]);
		},

		//

		beforeFit: function() {
			helpers.callCallback(this.options.beforeFit, [this]);
		},
		fit: function() {
			var me = this;
			// Reset
			var minSize = me.minSize = {
				width: 0,
				height: 0
			};

			var opts = me.options;
			var tickOpts = opts.ticks;
			var scaleLabelOpts = opts.scaleLabel;
			var gridLineOpts = opts.gridLines;
			var display = opts.display;
			var isHorizontal = me.isHorizontal();

			var tickFont = parseFontOptions(tickOpts);
			var scaleLabelFontSize = parseFontOptions(scaleLabelOpts).size * 1.5;
			var tickMarkLength = opts.gridLines.tickMarkLength;

			// Width
			if (isHorizontal) {
				// subtract the margins to line up with the chartArea if we are a full width scale
				minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth;
			} else {
				minSize.width = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
			}

			// height
			if (isHorizontal) {
				minSize.height = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
			} else {
				minSize.height = me.maxHeight; // fill all the height
			}

			// Are we showing a title for the scale?
			if (scaleLabelOpts.display && display) {
				if (isHorizontal) {
					minSize.height += scaleLabelFontSize;
				} else {
					minSize.width += scaleLabelFontSize;
				}
			}

			// Don't bother fitting the ticks if we are not showing them
			if (tickOpts.display && display) {
				var largestTextWidth = helpers.longestText(me.ctx, tickFont.font, me.ticks, me.longestTextCache);
				var tallestLabelHeightInLines = helpers.numberOfLabelLines(me.ticks);
				var lineSpace = tickFont.size * 0.5;

				if (isHorizontal) {
					// A horizontal axis is more constrained by the height.
					me.longestLabelWidth = largestTextWidth;

					var angleRadians = helpers.toRadians(me.labelRotation);
					var cosRotation = Math.cos(angleRadians);
					var sinRotation = Math.sin(angleRadians);

					// TODO - improve this calculation
					var labelHeight = (sinRotation * largestTextWidth)
						+ (tickFont.size * tallestLabelHeightInLines)
						+ (lineSpace * tallestLabelHeightInLines);

					minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight);
					me.ctx.font = tickFont.font;

					var firstTick = me.ticks[0];
					var firstLabelWidth = computeTextSize(me.ctx, firstTick, tickFont.font);

					var lastTick = me.ticks[me.ticks.length - 1];
					var lastLabelWidth = computeTextSize(me.ctx, lastTick, tickFont.font);

					// Ensure that our ticks are always inside the canvas. When rotated, ticks are right aligned which means that the right padding is dominated
					// by the font height
					if (me.labelRotation !== 0) {
						me.paddingLeft = opts.position === 'bottom'? (cosRotation * firstLabelWidth) + 3: (cosRotation * lineSpace) + 3; // add 3 px to move away from canvas edges
						me.paddingRight = opts.position === 'bottom'? (cosRotation * lineSpace) + 3: (cosRotation * lastLabelWidth) + 3;
					} else {
						me.paddingLeft = firstLabelWidth / 2 + 3; // add 3 px to move away from canvas edges
						me.paddingRight = lastLabelWidth / 2 + 3;
					}
				} else {
					// A vertical axis is more constrained by the width. Labels are the dominant factor here, so get that length first
					// Account for padding

					if (tickOpts.mirror) {
						largestTextWidth = 0;
					} else {
						largestTextWidth += me.options.ticks.padding;
					}
					minSize.width += largestTextWidth;
					me.paddingTop = tickFont.size / 2;
					me.paddingBottom = tickFont.size / 2;
				}
			}

			me.handleMargins();

			me.width = minSize.width;
			me.height = minSize.height;
		},

		/**
		 * Handle margins and padding interactions
		 * @private
		 */
		handleMargins: function() {
			var me = this;
			if (me.margins) {
				me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
				me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
				me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
				me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0);
			}
		},

		afterFit: function() {
			helpers.callCallback(this.options.afterFit, [this]);
		},

		// Shared Methods
		isHorizontal: function() {
			return this.options.position === 'top' || this.options.position === 'bottom';
		},
		isFullWidth: function() {
			return (this.options.fullWidth);
		},

		// Get the correct value. NaN bad inputs, If the value type is object get the x or y based on whether we are horizontal or not
		getRightValue: function(rawValue) {
			// Null and undefined values first
			if (rawValue === null || typeof(rawValue) === 'undefined') {
				return NaN;
			}
			// isNaN(object) returns true, so make sure NaN is checking for a number; Discard Infinite values
			if (typeof(rawValue) === 'number' && !isFinite(rawValue)) {
				return NaN;
			}
			// If it is in fact an object, dive in one more level
			if (typeof(rawValue) === 'object') {
				if ((rawValue instanceof Date) || (rawValue.isValid)) {
					return rawValue;
				}
				return this.getRightValue(this.isHorizontal() ? rawValue.x : rawValue.y);
			}

			// Value is good, return it
			return rawValue;
		},

		// Used to get the value to display in the tooltip for the data at the given index
		// function getLabelForIndex(index, datasetIndex)
		getLabelForIndex: helpers.noop,

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: helpers.noop,

		// Used to get the data value from a given pixel. This is the inverse of getPixelForValue
		getValueForPixel: helpers.noop,

		// Used for tick location, should
		getPixelForTick: function(index, includeOffset) {
			var me = this;
			if (me.isHorizontal()) {
				var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
				var tickWidth = innerWidth / Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
				var pixel = (tickWidth * index) + me.paddingLeft;

				if (includeOffset) {
					pixel += tickWidth / 2;
				}

				var finalVal = me.left + Math.round(pixel);
				finalVal += me.isFullWidth() ? me.margins.left : 0;
				return finalVal;
			}
			var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
			return me.top + (index * (innerHeight / (me.ticks.length - 1)));
		},

		// Utility for getting the pixel location of a percentage of scale
		getPixelForDecimal: function(decimal /* , includeOffset*/) {
			var me = this;
			if (me.isHorizontal()) {
				var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
				var valueOffset = (innerWidth * decimal) + me.paddingLeft;

				var finalVal = me.left + Math.round(valueOffset);
				finalVal += me.isFullWidth() ? me.margins.left : 0;
				return finalVal;
			}
			return me.top + (decimal * me.height);
		},

		getBasePixel: function() {
			return this.getPixelForValue(this.getBaseValue());
		},

		getBaseValue: function() {
			var me = this;
			var min = me.min;
			var max = me.max;

			return me.beginAtZero ? 0:
				min < 0 && max < 0? max :
				min > 0 && max > 0? min :
				0;
		},

		// Actually draw the scale on the canvas
		// @param {rectangle} chartArea : the area of the chart to draw full grid lines on
		draw: function(chartArea) {
			var me = this;
			var options = me.options;
			if (!options.display) {
				return;
			}

			var context = me.ctx;
			var globalDefaults = Chart.defaults.global;
			var optionTicks = options.ticks;
			var gridLines = options.gridLines;
			var scaleLabel = options.scaleLabel;

			var isRotated = me.labelRotation !== 0;
			var skipRatio;
			var useAutoskipper = optionTicks.autoSkip;
			var isHorizontal = me.isHorizontal();

			// figure out the maximum number of gridlines to show
			var maxTicks;
			if (optionTicks.maxTicksLimit) {
				maxTicks = optionTicks.maxTicksLimit;
			}

			var tickFontColor = helpers.getValueOrDefault(optionTicks.fontColor, globalDefaults.defaultFontColor);
			var tickFont = parseFontOptions(optionTicks);

			var tl = gridLines.drawTicks ? gridLines.tickMarkLength : 0;
			var borderDash = helpers.getValueOrDefault(gridLines.borderDash, globalDefaults.borderDash);
			var borderDashOffset = helpers.getValueOrDefault(gridLines.borderDashOffset, globalDefaults.borderDashOffset);

			var scaleLabelFontColor = helpers.getValueOrDefault(scaleLabel.fontColor, globalDefaults.defaultFontColor);
			var scaleLabelFont = parseFontOptions(scaleLabel);

			var labelRotationRadians = helpers.toRadians(me.labelRotation);
			var cosRotation = Math.cos(labelRotationRadians);
			var longestRotatedLabel = me.longestLabelWidth * cosRotation;

			// Make sure we draw text in the correct color and font
			context.fillStyle = tickFontColor;

			var itemsToDraw = [];

			if (isHorizontal) {
				skipRatio = false;

				// Only calculate the skip ratio with the half width of longestRotateLabel if we got an actual rotation
				// See #2584
				if (isRotated) {
					longestRotatedLabel /= 2;
				}

				if ((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length > (me.width - (me.paddingLeft + me.paddingRight))) {
					skipRatio = 1 + Math.floor(((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length) / (me.width - (me.paddingLeft + me.paddingRight)));
				}

				// if they defined a max number of optionTicks,
				// increase skipRatio until that number is met
				if (maxTicks && me.ticks.length > maxTicks) {
					while (!skipRatio || me.ticks.length / (skipRatio || 1) > maxTicks) {
						if (!skipRatio) {
							skipRatio = 1;
						}
						skipRatio += 1;
					}
				}

				if (!useAutoskipper) {
					skipRatio = false;
				}
			}


			var xTickStart = options.position === 'right' ? me.left : me.right - tl;
			var xTickEnd = options.position === 'right' ? me.left + tl : me.right;
			var yTickStart = options.position === 'bottom' ? me.top : me.bottom - tl;
			var yTickEnd = options.position === 'bottom' ? me.top + tl : me.bottom;

			helpers.each(me.ticks, function(label, index) {
				// If the callback returned a null or undefined value, do not draw this line
				if (label === undefined || label === null) {
					return;
				}

				var isLastTick = me.ticks.length === index + 1;

				// Since we always show the last tick,we need may need to hide the last shown one before
				var shouldSkip = (skipRatio > 1 && index % skipRatio > 0) || (index % skipRatio === 0 && index + skipRatio >= me.ticks.length);
				if (shouldSkip && !isLastTick || (label === undefined || label === null)) {
					return;
				}

				var lineWidth, lineColor;
				if (index === (typeof me.zeroLineIndex !== 'undefined' ? me.zeroLineIndex : 0)) {
					// Draw the first index specially
					lineWidth = gridLines.zeroLineWidth;
					lineColor = gridLines.zeroLineColor;
				} else {
					lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, index);
					lineColor = helpers.getValueAtIndexOrDefault(gridLines.color, index);
				}

				// Common properties
				var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY;
				var textAlign = 'middle';
				var textBaseline = 'middle';

				if (isHorizontal) {

					if (options.position === 'bottom') {
						// bottom
						textBaseline = !isRotated? 'top':'middle';
						textAlign = !isRotated? 'center': 'right';
						labelY = me.top + tl;
					} else {
						// top
						textBaseline = !isRotated? 'bottom':'middle';
						textAlign = !isRotated? 'center': 'left';
						labelY = me.bottom - tl;
					}

					var xLineValue = me.getPixelForTick(index) + helpers.aliasPixel(lineWidth); // xvalues for grid lines
					labelX = me.getPixelForTick(index, gridLines.offsetGridLines) + optionTicks.labelOffset; // x values for optionTicks (need to consider offsetLabel option)

					tx1 = tx2 = x1 = x2 = xLineValue;
					ty1 = yTickStart;
					ty2 = yTickEnd;
					y1 = chartArea.top;
					y2 = chartArea.bottom;
				} else {
					var isLeft = options.position === 'left';
					var tickPadding = optionTicks.padding;
					var labelXOffset;

					if (optionTicks.mirror) {
						textAlign = isLeft ? 'left' : 'right';
						labelXOffset = tickPadding;
					} else {
						textAlign = isLeft ? 'right' : 'left';
						labelXOffset = tl + tickPadding;
					}

					labelX = isLeft ? me.right - labelXOffset : me.left + labelXOffset;

					var yLineValue = me.getPixelForTick(index); // xvalues for grid lines
					yLineValue += helpers.aliasPixel(lineWidth);
					labelY = me.getPixelForTick(index, gridLines.offsetGridLines);

					tx1 = xTickStart;
					tx2 = xTickEnd;
					x1 = chartArea.left;
					x2 = chartArea.right;
					ty1 = ty2 = y1 = y2 = yLineValue;
				}

				itemsToDraw.push({
					tx1: tx1,
					ty1: ty1,
					tx2: tx2,
					ty2: ty2,
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
					labelX: labelX,
					labelY: labelY,
					glWidth: lineWidth,
					glColor: lineColor,
					glBorderDash: borderDash,
					glBorderDashOffset: borderDashOffset,
					rotation: -1 * labelRotationRadians,
					label: label,
					textBaseline: textBaseline,
					textAlign: textAlign
				});
			});

			// Draw all of the tick labels, tick marks, and grid lines at the correct places
			helpers.each(itemsToDraw, function(itemToDraw) {
				if (gridLines.display) {
					context.save();
					context.lineWidth = itemToDraw.glWidth;
					context.strokeStyle = itemToDraw.glColor;
					if (context.setLineDash) {
						context.setLineDash(itemToDraw.glBorderDash);
						context.lineDashOffset = itemToDraw.glBorderDashOffset;
					}

					context.beginPath();

					if (gridLines.drawTicks) {
						context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
						context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
					}

					if (gridLines.drawOnChartArea) {
						context.moveTo(itemToDraw.x1, itemToDraw.y1);
						context.lineTo(itemToDraw.x2, itemToDraw.y2);
					}

					context.stroke();
					context.restore();
				}

				if (optionTicks.display) {
					context.save();
					context.translate(itemToDraw.labelX, itemToDraw.labelY);
					context.rotate(itemToDraw.rotation);
					context.font = tickFont.font;
					context.textBaseline = itemToDraw.textBaseline;
					context.textAlign = itemToDraw.textAlign;

					var label = itemToDraw.label;
					if (helpers.isArray(label)) {
						for (var i = 0, y = 0; i < label.length; ++i) {
							// We just make sure the multiline element is a string here..
							context.fillText('' + label[i], 0, y);
							// apply same lineSpacing as calculated @ L#320
							y += (tickFont.size * 1.5);
						}
					} else {
						context.fillText(label, 0, 0);
					}
					context.restore();
				}
			});

			if (scaleLabel.display) {
				// Draw the scale label
				var scaleLabelX;
				var scaleLabelY;
				var rotation = 0;

				if (isHorizontal) {
					scaleLabelX = me.left + ((me.right - me.left) / 2); // midpoint of the width
					scaleLabelY = options.position === 'bottom' ? me.bottom - (scaleLabelFont.size / 2) : me.top + (scaleLabelFont.size / 2);
				} else {
					var isLeft = options.position === 'left';
					scaleLabelX = isLeft ? me.left + (scaleLabelFont.size / 2) : me.right - (scaleLabelFont.size / 2);
					scaleLabelY = me.top + ((me.bottom - me.top) / 2);
					rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
				}

				context.save();
				context.translate(scaleLabelX, scaleLabelY);
				context.rotate(rotation);
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillStyle = scaleLabelFontColor; // render in correct colour
				context.font = scaleLabelFont.font;
				context.fillText(scaleLabel.labelString, 0, 0);
				context.restore();
			}

			if (gridLines.drawBorder) {
				// Draw the line at the edge of the axis
				context.lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, 0);
				context.strokeStyle = helpers.getValueAtIndexOrDefault(gridLines.color, 0);
				var x1 = me.left,
					x2 = me.right,
					y1 = me.top,
					y2 = me.bottom;

				var aliasPixel = helpers.aliasPixel(context.lineWidth);
				if (isHorizontal) {
					y1 = y2 = options.position === 'top' ? me.bottom : me.top;
					y1 += aliasPixel;
					y2 += aliasPixel;
				} else {
					x1 = x2 = options.position === 'left' ? me.right : me.left;
					x1 += aliasPixel;
					x2 += aliasPixel;
				}

				context.beginPath();
				context.moveTo(x1, y1);
				context.lineTo(x2, y2);
				context.stroke();
			}
		}
	});
};

},{}],33:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.scaleService = {
		// Scale registration object. Extensions can register new scale types (such as log or DB scales) and then
		// use the new chart options to grab the correct scale
		constructors: {},
		// Use a registration function so that we can move to an ES6 map when we no longer need to support
		// old browsers

		// Scale config defaults
		defaults: {},
		registerScaleType: function(type, scaleConstructor, defaults) {
			this.constructors[type] = scaleConstructor;
			this.defaults[type] = helpers.clone(defaults);
		},
		getScaleConstructor: function(type) {
			return this.constructors.hasOwnProperty(type) ? this.constructors[type] : undefined;
		},
		getScaleDefaults: function(type) {
			// Return the scale defaults merged with the global settings so that we always use the latest ones
			return this.defaults.hasOwnProperty(type) ? helpers.scaleMerge(Chart.defaults.scale, this.defaults[type]) : {};
		},
		updateScaleDefaults: function(type, additions) {
			var defaults = this.defaults;
			if (defaults.hasOwnProperty(type)) {
				defaults[type] = helpers.extend(defaults[type], additions);
			}
		},
		addScalesToLayout: function(chartInstance) {
			// Adds each scale to the chart.boxes array to be sized accordingly
			helpers.each(chartInstance.scales, function(scale) {
				Chart.layoutService.addBox(chartInstance, scale);
			});
		}
	};
};

},{}],34:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	/**
	 * Namespace to hold static tick generation functions
	 * @namespace Chart.Ticks
	 */
	Chart.Ticks = {
		/**
		 * Namespace to hold generators for different types of ticks
		 * @namespace Chart.Ticks.generators
		 */
		generators: {
			/**
			 * Interface for the options provided to the numeric tick generator
			 * @interface INumericTickGenerationOptions
			 */
			/**
			 * The maximum number of ticks to display
			 * @name INumericTickGenerationOptions#maxTicks
			 * @type Number
			 */
			/**
			 * The distance between each tick.
			 * @name INumericTickGenerationOptions#stepSize
			 * @type Number
			 * @optional
			 */
			/**
			 * Forced minimum for the ticks. If not specified, the minimum of the data range is used to calculate the tick minimum
			 * @name INumericTickGenerationOptions#min
			 * @type Number
			 * @optional
			 */
			/**
			 * The maximum value of the ticks. If not specified, the maximum of the data range is used to calculate the tick maximum
			 * @name INumericTickGenerationOptions#max
			 * @type Number
			 * @optional
			 */

			/**
			 * Generate a set of linear ticks
			 * @method Chart.Ticks.generators.linear
			 * @param generationOptions {INumericTickGenerationOptions} the options used to generate the ticks
			 * @param dataRange {IRange} the range of the data
			 * @returns {Array<Number>} array of tick values
			 */
			linear: function(generationOptions, dataRange) {
				var ticks = [];
				// To get a "nice" value for the tick spacing, we will use the appropriately named
				// "nice number" algorithm. See http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
				// for details.

				var spacing;
				if (generationOptions.stepSize && generationOptions.stepSize > 0) {
					spacing = generationOptions.stepSize;
				} else {
					var niceRange = helpers.niceNum(dataRange.max - dataRange.min, false);
					spacing = helpers.niceNum(niceRange / (generationOptions.maxTicks - 1), true);
				}
				var niceMin = Math.floor(dataRange.min / spacing) * spacing;
				var niceMax = Math.ceil(dataRange.max / spacing) * spacing;

				// If min, max and stepSize is set and they make an evenly spaced scale use it.
				if (generationOptions.min && generationOptions.max && generationOptions.stepSize) {
					// If very close to our whole number, use it.
					if (helpers.almostWhole((generationOptions.max - generationOptions.min) / generationOptions.stepSize, spacing / 1000)) {
						niceMin = generationOptions.min;
						niceMax = generationOptions.max;
					}
				}

				var numSpaces = (niceMax - niceMin) / spacing;
				// If very close to our rounded value, use it.
				if (helpers.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
					numSpaces = Math.round(numSpaces);
				} else {
					numSpaces = Math.ceil(numSpaces);
				}

				// Put the values into the ticks array
				ticks.push(generationOptions.min !== undefined ? generationOptions.min : niceMin);
				for (var j = 1; j < numSpaces; ++j) {
					ticks.push(niceMin + (j * spacing));
				}
				ticks.push(generationOptions.max !== undefined ? generationOptions.max : niceMax);

				return ticks;
			},

			/**
			 * Generate a set of logarithmic ticks
			 * @method Chart.Ticks.generators.logarithmic
			 * @param generationOptions {INumericTickGenerationOptions} the options used to generate the ticks
			 * @param dataRange {IRange} the range of the data
			 * @returns {Array<Number>} array of tick values
			 */
			logarithmic: function(generationOptions, dataRange) {
				var ticks = [];
				var getValueOrDefault = helpers.getValueOrDefault;

				// Figure out what the max number of ticks we can support it is based on the size of
				// the axis area. For now, we say that the minimum tick spacing in pixels must be 50
				// We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
				// the graph
				var tickVal = getValueOrDefault(generationOptions.min, Math.pow(10, Math.floor(helpers.log10(dataRange.min))));

				var endExp = Math.floor(helpers.log10(dataRange.max));
				var endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
				var exp;
				var significand;

				if (tickVal === 0) {
					exp = Math.floor(helpers.log10(dataRange.minNotZero));
					significand = Math.floor(dataRange.minNotZero / Math.pow(10, exp));

					ticks.push(tickVal);
					tickVal = significand * Math.pow(10, exp);
				} else {
					exp = Math.floor(helpers.log10(tickVal));
					significand = Math.floor(tickVal / Math.pow(10, exp));
				}

				do {
					ticks.push(tickVal);

					++significand;
					if (significand === 10) {
						significand = 1;
						++exp;
					}

					tickVal = significand * Math.pow(10, exp);
				} while (exp < endExp || (exp === endExp && significand < endSignificand));

				var lastTick = getValueOrDefault(generationOptions.max, tickVal);
				ticks.push(lastTick);

				return ticks;
			}
		},

		/**
		 * Namespace to hold formatters for different types of ticks
		 * @namespace Chart.Ticks.formatters
		 */
		formatters: {
			/**
			 * Formatter for value labels
			 * @method Chart.Ticks.formatters.values
			 * @param value the value to display
			 * @return {String|Array} the label to display
			 */
			values: function(value) {
				return helpers.isArray(value) ? value : '' + value;
			},

			/**
			 * Formatter for linear numeric ticks
			 * @method Chart.Ticks.formatters.linear
			 * @param tickValue {Number} the value to be formatted
			 * @param index {Number} the position of the tickValue parameter in the ticks array
			 * @param ticks {Array<Number>} the list of ticks being converted
			 * @return {String} string representation of the tickValue parameter
			 */
			linear: function(tickValue, index, ticks) {
				// If we have lots of ticks, don't use the ones
				var delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];

				// If we have a number like 2.5 as the delta, figure out how many decimal places we need
				if (Math.abs(delta) > 1) {
					if (tickValue !== Math.floor(tickValue)) {
						// not an integer
						delta = tickValue - Math.floor(tickValue);
					}
				}

				var logDelta = helpers.log10(Math.abs(delta));
				var tickString = '';

				if (tickValue !== 0) {
					var numDecimal = -1 * Math.floor(logDelta);
					numDecimal = Math.max(Math.min(numDecimal, 20), 0); // toFixed has a max of 20 decimal places
					tickString = tickValue.toFixed(numDecimal);
				} else {
					tickString = '0'; // never show decimal places for 0
				}

				return tickString;
			},

			logarithmic: function(tickValue, index, ticks) {
				var remain = tickValue / (Math.pow(10, Math.floor(helpers.log10(tickValue))));

				if (tickValue === 0) {
					return '0';
				} else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === ticks.length - 1) {
					return tickValue.toExponential();
				}
				return '';
			}
		}
	};
};

},{}],35:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	Chart.defaults.global.title = {
		display: false,
		position: 'top',
		fullWidth: true, // marks that this box should take the full width of the canvas (pushing down other boxes)

		fontStyle: 'bold',
		padding: 10,

		// actual title
		text: ''
	};

	var noop = helpers.noop;
	Chart.Title = Chart.Element.extend({

		initialize: function(config) {
			var me = this;
			helpers.extend(me, config);

			// Contains hit boxes for each dataset (in dataset order)
			me.legendHitBoxes = [];
		},

		// These methods are ordered by lifecycle. Utilities then follow.

		beforeUpdate: noop,
		update: function(maxWidth, maxHeight, margins) {
			var me = this;

			// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
			me.beforeUpdate();

			// Absorb the master measurements
			me.maxWidth = maxWidth;
			me.maxHeight = maxHeight;
			me.margins = margins;

			// Dimensions
			me.beforeSetDimensions();
			me.setDimensions();
			me.afterSetDimensions();
			// Labels
			me.beforeBuildLabels();
			me.buildLabels();
			me.afterBuildLabels();

			// Fit
			me.beforeFit();
			me.fit();
			me.afterFit();
			//
			me.afterUpdate();

			return me.minSize;

		},
		afterUpdate: noop,

		//

		beforeSetDimensions: noop,
		setDimensions: function() {
			var me = this;
			// Set the unconstrained dimension before label rotation
			if (me.isHorizontal()) {
				// Reset position before calculating rotation
				me.width = me.maxWidth;
				me.left = 0;
				me.right = me.width;
			} else {
				me.height = me.maxHeight;

				// Reset position before calculating rotation
				me.top = 0;
				me.bottom = me.height;
			}

			// Reset padding
			me.paddingLeft = 0;
			me.paddingTop = 0;
			me.paddingRight = 0;
			me.paddingBottom = 0;

			// Reset minSize
			me.minSize = {
				width: 0,
				height: 0
			};
		},
		afterSetDimensions: noop,

		//

		beforeBuildLabels: noop,
		buildLabels: noop,
		afterBuildLabels: noop,

		//

		beforeFit: noop,
		fit: function() {
			var me = this,
				valueOrDefault = helpers.getValueOrDefault,
				opts = me.options,
				globalDefaults = Chart.defaults.global,
				display = opts.display,
				fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize),
				minSize = me.minSize;

			if (me.isHorizontal()) {
				minSize.width = me.maxWidth; // fill all the width
				minSize.height = display ? fontSize + (opts.padding * 2) : 0;
			} else {
				minSize.width = display ? fontSize + (opts.padding * 2) : 0;
				minSize.height = me.maxHeight; // fill all the height
			}

			me.width = minSize.width;
			me.height = minSize.height;

		},
		afterFit: noop,

		// Shared Methods
		isHorizontal: function() {
			var pos = this.options.position;
			return pos === 'top' || pos === 'bottom';
		},

		// Actually draw the title block on the canvas
		draw: function() {
			var me = this,
				ctx = me.ctx,
				valueOrDefault = helpers.getValueOrDefault,
				opts = me.options,
				globalDefaults = Chart.defaults.global;

			if (opts.display) {
				var fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize),
					fontStyle = valueOrDefault(opts.fontStyle, globalDefaults.defaultFontStyle),
					fontFamily = valueOrDefault(opts.fontFamily, globalDefaults.defaultFontFamily),
					titleFont = helpers.fontString(fontSize, fontStyle, fontFamily),
					rotation = 0,
					titleX,
					titleY,
					top = me.top,
					left = me.left,
					bottom = me.bottom,
					right = me.right,
					maxWidth;

				ctx.fillStyle = valueOrDefault(opts.fontColor, globalDefaults.defaultFontColor); // render in correct colour
				ctx.font = titleFont;

				// Horizontal
				if (me.isHorizontal()) {
					titleX = left + ((right - left) / 2); // midpoint of the width
					titleY = top + ((bottom - top) / 2); // midpoint of the height
					maxWidth = right - left;
				} else {
					titleX = opts.position === 'left' ? left + (fontSize / 2) : right - (fontSize / 2);
					titleY = top + ((bottom - top) / 2);
					maxWidth = bottom - top;
					rotation = Math.PI * (opts.position === 'left' ? -0.5 : 0.5);
				}

				ctx.save();
				ctx.translate(titleX, titleY);
				ctx.rotate(rotation);
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(opts.text, 0, 0, maxWidth);
				ctx.restore();
			}
		}
	});

	function createNewTitleBlockAndAttach(chartInstance, titleOpts) {
		var title = new Chart.Title({
			ctx: chartInstance.chart.ctx,
			options: titleOpts,
			chart: chartInstance
		});
		chartInstance.titleBlock = title;
		Chart.layoutService.addBox(chartInstance, title);
	}

	// Register the title plugin
	Chart.plugins.register({
		beforeInit: function(chartInstance) {
			var titleOpts = chartInstance.options.title;

			if (titleOpts) {
				createNewTitleBlockAndAttach(chartInstance, titleOpts);
			}
		},
		beforeUpdate: function(chartInstance) {
			var titleOpts = chartInstance.options.title;

			if (titleOpts) {
				titleOpts = helpers.configMerge(Chart.defaults.global.title, titleOpts);

				if (chartInstance.titleBlock) {
					chartInstance.titleBlock.options = titleOpts;
				} else {
					createNewTitleBlockAndAttach(chartInstance, titleOpts);
				}
			} else {
				Chart.layoutService.removeBox(chartInstance, chartInstance.titleBlock);
				delete chartInstance.titleBlock;
			}
		}
	});
};

},{}],36:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	/**
 	 * Helper method to merge the opacity into a color
 	 */
	function mergeOpacity(colorString, opacity) {
		var color = helpers.color(colorString);
		return color.alpha(opacity * color.alpha()).rgbaString();
	}

	Chart.defaults.global.tooltips = {
		enabled: true,
		custom: null,
		mode: 'nearest',
		position: 'average',
		intersect: true,
		backgroundColor: 'rgba(0,0,0,0.8)',
		titleFontStyle: 'bold',
		titleSpacing: 2,
		titleMarginBottom: 6,
		titleFontColor: '#fff',
		titleAlign: 'left',
		bodySpacing: 2,
		bodyFontColor: '#fff',
		bodyAlign: 'left',
		footerFontStyle: 'bold',
		footerSpacing: 2,
		footerMarginTop: 6,
		footerFontColor: '#fff',
		footerAlign: 'left',
		yPadding: 6,
		xPadding: 6,
		caretSize: 5,
		cornerRadius: 6,
		multiKeyBackground: '#fff',
		displayColors: true,
		callbacks: {
			// Args are: (tooltipItems, data)
			beforeTitle: helpers.noop,
			title: function(tooltipItems, data) {
				// Pick first xLabel for now
				var title = '';
				var labels = data.labels;
				var labelCount = labels ? labels.length : 0;

				if (tooltipItems.length > 0) {
					var item = tooltipItems[0];

					if (item.xLabel) {
						title = item.xLabel;
					} else if (labelCount > 0 && item.index < labelCount) {
						title = labels[item.index];
					}
				}

				return title;
			},
			afterTitle: helpers.noop,

			// Args are: (tooltipItems, data)
			beforeBody: helpers.noop,

			// Args are: (tooltipItem, data)
			beforeLabel: helpers.noop,
			label: function(tooltipItem, data) {
				var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
				return datasetLabel + ': ' + tooltipItem.yLabel;
			},
			labelColor: function(tooltipItem, chartInstance) {
				var meta = chartInstance.getDatasetMeta(tooltipItem.datasetIndex);
				var activeElement = meta.data[tooltipItem.index];
				var view = activeElement._view;
				return {
					borderColor: view.borderColor,
					backgroundColor: view.backgroundColor
				};
			},
			afterLabel: helpers.noop,

			// Args are: (tooltipItems, data)
			afterBody: helpers.noop,

			// Args are: (tooltipItems, data)
			beforeFooter: helpers.noop,
			footer: helpers.noop,
			afterFooter: helpers.noop
		}
	};

	// Helper to push or concat based on if the 2nd parameter is an array or not
	function pushOrConcat(base, toPush) {
		if (toPush) {
			if (helpers.isArray(toPush)) {
				// base = base.concat(toPush);
				Array.prototype.push.apply(base, toPush);
			} else {
				base.push(toPush);
			}
		}

		return base;
	}

	// Private helper to create a tooltip item model
	// @param element : the chart element (point, arc, bar) to create the tooltip item for
	// @return : new tooltip item
	function createTooltipItem(element) {
		var xScale = element._xScale;
		var yScale = element._yScale || element._scale; // handle radar || polarArea charts
		var index = element._index,
			datasetIndex = element._datasetIndex;

		return {
			xLabel: xScale ? xScale.getLabelForIndex(index, datasetIndex) : '',
			yLabel: yScale ? yScale.getLabelForIndex(index, datasetIndex) : '',
			index: index,
			datasetIndex: datasetIndex,
			x: element._model.x,
			y: element._model.y
		};
	}

	/**
	 * Helper to get the reset model for the tooltip
	 * @param tooltipOpts {Object} the tooltip options
	 */
	function getBaseModel(tooltipOpts) {
		var globalDefaults = Chart.defaults.global;
		var getValueOrDefault = helpers.getValueOrDefault;

		return {
			// Positioning
			xPadding: tooltipOpts.xPadding,
			yPadding: tooltipOpts.yPadding,
			xAlign: tooltipOpts.xAlign,
			yAlign: tooltipOpts.yAlign,

			// Body
			bodyFontColor: tooltipOpts.bodyFontColor,
			_bodyFontFamily: getValueOrDefault(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily),
			_bodyFontStyle: getValueOrDefault(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle),
			_bodyAlign: tooltipOpts.bodyAlign,
			bodyFontSize: getValueOrDefault(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize),
			bodySpacing: tooltipOpts.bodySpacing,

			// Title
			titleFontColor: tooltipOpts.titleFontColor,
			_titleFontFamily: getValueOrDefault(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily),
			_titleFontStyle: getValueOrDefault(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle),
			titleFontSize: getValueOrDefault(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize),
			_titleAlign: tooltipOpts.titleAlign,
			titleSpacing: tooltipOpts.titleSpacing,
			titleMarginBottom: tooltipOpts.titleMarginBottom,

			// Footer
			footerFontColor: tooltipOpts.footerFontColor,
			_footerFontFamily: getValueOrDefault(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily),
			_footerFontStyle: getValueOrDefault(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle),
			footerFontSize: getValueOrDefault(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize),
			_footerAlign: tooltipOpts.footerAlign,
			footerSpacing: tooltipOpts.footerSpacing,
			footerMarginTop: tooltipOpts.footerMarginTop,

			// Appearance
			caretSize: tooltipOpts.caretSize,
			cornerRadius: tooltipOpts.cornerRadius,
			backgroundColor: tooltipOpts.backgroundColor,
			opacity: 0,
			legendColorBackground: tooltipOpts.multiKeyBackground,
			displayColors: tooltipOpts.displayColors
		};
	}

	/**
	 * Get the size of the tooltip
	 */
	function getTooltipSize(tooltip, model) {
		var ctx = tooltip._chart.ctx;

		var height = model.yPadding * 2; // Tooltip Padding
		var width = 0;

		// Count of all lines in the body
		var body = model.body;
		var combinedBodyLength = body.reduce(function(count, bodyItem) {
			return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length;
		}, 0);
		combinedBodyLength += model.beforeBody.length + model.afterBody.length;

		var titleLineCount = model.title.length;
		var footerLineCount = model.footer.length;
		var titleFontSize = model.titleFontSize,
			bodyFontSize = model.bodyFontSize,
			footerFontSize = model.footerFontSize;

		height += titleLineCount * titleFontSize; // Title Lines
		height += titleLineCount ? (titleLineCount - 1) * model.titleSpacing : 0; // Title Line Spacing
		height += titleLineCount ? model.titleMarginBottom : 0; // Title's bottom Margin
		height += combinedBodyLength * bodyFontSize; // Body Lines
		height += combinedBodyLength ? (combinedBodyLength - 1) * model.bodySpacing : 0; // Body Line Spacing
		height += footerLineCount ? model.footerMarginTop : 0; // Footer Margin
		height += footerLineCount * (footerFontSize); // Footer Lines
		height += footerLineCount ? (footerLineCount - 1) * model.footerSpacing : 0; // Footer Line Spacing

		// Title width
		var widthPadding = 0;
		var maxLineWidth = function(line) {
			width = Math.max(width, ctx.measureText(line).width + widthPadding);
		};

		ctx.font = helpers.fontString(titleFontSize, model._titleFontStyle, model._titleFontFamily);
		helpers.each(model.title, maxLineWidth);

		// Body width
		ctx.font = helpers.fontString(bodyFontSize, model._bodyFontStyle, model._bodyFontFamily);
		helpers.each(model.beforeBody.concat(model.afterBody), maxLineWidth);

		// Body lines may include some extra width due to the color box
		widthPadding = model.displayColors ? (bodyFontSize + 2) : 0;
		helpers.each(body, function(bodyItem) {
			helpers.each(bodyItem.before, maxLineWidth);
			helpers.each(bodyItem.lines, maxLineWidth);
			helpers.each(bodyItem.after, maxLineWidth);
		});

		// Reset back to 0
		widthPadding = 0;

		// Footer width
		ctx.font = helpers.fontString(footerFontSize, model._footerFontStyle, model._footerFontFamily);
		helpers.each(model.footer, maxLineWidth);

		// Add padding
		width += 2 * model.xPadding;

		return {
			width: width,
			height: height
		};
	}

	/**
	 * Helper to get the alignment of a tooltip given the size
	 */
	function determineAlignment(tooltip, size) {
		var model = tooltip._model;
		var chart = tooltip._chart;
		var chartArea = tooltip._chartInstance.chartArea;
		var xAlign = 'center';
		var yAlign = 'center';

		if (model.y < size.height) {
			yAlign = 'top';
		} else if (model.y > (chart.height - size.height)) {
			yAlign = 'bottom';
		}

		var lf, rf; // functions to determine left, right alignment
		var olf, orf; // functions to determine if left/right alignment causes tooltip to go outside chart
		var yf; // function to get the y alignment if the tooltip goes outside of the left or right edges
		var midX = (chartArea.left + chartArea.right) / 2;
		var midY = (chartArea.top + chartArea.bottom) / 2;

		if (yAlign === 'center') {
			lf = function(x) {
				return x <= midX;
			};
			rf = function(x) {
				return x > midX;
			};
		} else {
			lf = function(x) {
				return x <= (size.width / 2);
			};
			rf = function(x) {
				return x >= (chart.width - (size.width / 2));
			};
		}

		olf = function(x) {
			return x + size.width > chart.width;
		};
		orf = function(x) {
			return x - size.width < 0;
		};
		yf = function(y) {
			return y <= midY ? 'top' : 'bottom';
		};

		if (lf(model.x)) {
			xAlign = 'left';

			// Is tooltip too wide and goes over the right side of the chart.?
			if (olf(model.x)) {
				xAlign = 'center';
				yAlign = yf(model.y);
			}
		} else if (rf(model.x)) {
			xAlign = 'right';

			// Is tooltip too wide and goes outside left edge of canvas?
			if (orf(model.x)) {
				xAlign = 'center';
				yAlign = yf(model.y);
			}
		}

		var opts = tooltip._options;
		return {
			xAlign: opts.xAlign ? opts.xAlign : xAlign,
			yAlign: opts.yAlign ? opts.yAlign : yAlign
		};
	}

	/**
	 * @Helper to get the location a tooltip needs to be placed at given the initial position (via the vm) and the size and alignment
	 */
	function getBackgroundPoint(vm, size, alignment) {
		// Background Position
		var x = vm.x;
		var y = vm.y;

		var caretSize = vm.caretSize,
			caretPadding = vm.caretPadding,
			cornerRadius = vm.cornerRadius,
			xAlign = alignment.xAlign,
			yAlign = alignment.yAlign,
			paddingAndSize = caretSize + caretPadding,
			radiusAndPadding = cornerRadius + caretPadding;

		if (xAlign === 'right') {
			x -= size.width;
		} else if (xAlign === 'center') {
			x -= (size.width / 2);
		}

		if (yAlign === 'top') {
			y += paddingAndSize;
		} else if (yAlign === 'bottom') {
			y -= size.height + paddingAndSize;
		} else {
			y -= (size.height / 2);
		}

		if (yAlign === 'center') {
			if (xAlign === 'left') {
				x += paddingAndSize;
			} else if (xAlign === 'right') {
				x -= paddingAndSize;
			}
		} else if (xAlign === 'left') {
			x -= radiusAndPadding;
		} else if (xAlign === 'right') {
			x += radiusAndPadding;
		}

		return {
			x: x,
			y: y
		};
	}

	Chart.Tooltip = Chart.Element.extend({
		initialize: function() {
			this._model = getBaseModel(this._options);
		},

		// Get the title
		// Args are: (tooltipItem, data)
		getTitle: function() {
			var me = this;
			var opts = me._options;
			var callbacks = opts.callbacks;

			var beforeTitle = callbacks.beforeTitle.apply(me, arguments),
				title = callbacks.title.apply(me, arguments),
				afterTitle = callbacks.afterTitle.apply(me, arguments);

			var lines = [];
			lines = pushOrConcat(lines, beforeTitle);
			lines = pushOrConcat(lines, title);
			lines = pushOrConcat(lines, afterTitle);

			return lines;
		},

		// Args are: (tooltipItem, data)
		getBeforeBody: function() {
			var lines = this._options.callbacks.beforeBody.apply(this, arguments);
			return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
		},

		// Args are: (tooltipItem, data)
		getBody: function(tooltipItems, data) {
			var me = this;
			var callbacks = me._options.callbacks;
			var bodyItems = [];

			helpers.each(tooltipItems, function(tooltipItem) {
				var bodyItem = {
					before: [],
					lines: [],
					after: []
				};
				pushOrConcat(bodyItem.before, callbacks.beforeLabel.call(me, tooltipItem, data));
				pushOrConcat(bodyItem.lines, callbacks.label.call(me, tooltipItem, data));
				pushOrConcat(bodyItem.after, callbacks.afterLabel.call(me, tooltipItem, data));

				bodyItems.push(bodyItem);
			});

			return bodyItems;
		},

		// Args are: (tooltipItem, data)
		getAfterBody: function() {
			var lines = this._options.callbacks.afterBody.apply(this, arguments);
			return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
		},

		// Get the footer and beforeFooter and afterFooter lines
		// Args are: (tooltipItem, data)
		getFooter: function() {
			var me = this;
			var callbacks = me._options.callbacks;

			var beforeFooter = callbacks.beforeFooter.apply(me, arguments);
			var footer = callbacks.footer.apply(me, arguments);
			var afterFooter = callbacks.afterFooter.apply(me, arguments);

			var lines = [];
			lines = pushOrConcat(lines, beforeFooter);
			lines = pushOrConcat(lines, footer);
			lines = pushOrConcat(lines, afterFooter);

			return lines;
		},

		update: function(changed) {
			var me = this;
			var opts = me._options;

			// Need to regenerate the model because its faster than using extend and it is necessary due to the optimization in Chart.Element.transition
			// that does _view = _model if ease === 1. This causes the 2nd tooltip update to set properties in both the view and model at the same time
			// which breaks any animations.
			var existingModel = me._model;
			var model = me._model = getBaseModel(opts);
			var active = me._active;

			var data = me._data;
			var chartInstance = me._chartInstance;

			// In the case where active.length === 0 we need to keep these at existing values for good animations
			var alignment = {
				xAlign: existingModel.xAlign,
				yAlign: existingModel.yAlign
			};
			var backgroundPoint = {
				x: existingModel.x,
				y: existingModel.y
			};
			var tooltipSize = {
				width: existingModel.width,
				height: existingModel.height
			};
			var tooltipPosition = {
				x: existingModel.caretX,
				y: existingModel.caretY
			};

			var i, len;

			if (active.length) {
				model.opacity = 1;

				var labelColors = [];
				tooltipPosition = Chart.Tooltip.positioners[opts.position](active, me._eventPosition);

				var tooltipItems = [];
				for (i = 0, len = active.length; i < len; ++i) {
					tooltipItems.push(createTooltipItem(active[i]));
				}

				// If the user provided a filter function, use it to modify the tooltip items
				if (opts.filter) {
					tooltipItems = tooltipItems.filter(function(a) {
						return opts.filter(a, data);
					});
				}

				// If the user provided a sorting function, use it to modify the tooltip items
				if (opts.itemSort) {
					tooltipItems = tooltipItems.sort(function(a, b) {
						return opts.itemSort(a, b, data);
					});
				}

				// Determine colors for boxes
				helpers.each(tooltipItems, function(tooltipItem) {
					labelColors.push(opts.callbacks.labelColor.call(me, tooltipItem, chartInstance));
				});

				// Build the Text Lines
				model.title = me.getTitle(tooltipItems, data);
				model.beforeBody = me.getBeforeBody(tooltipItems, data);
				model.body = me.getBody(tooltipItems, data);
				model.afterBody = me.getAfterBody(tooltipItems, data);
				model.footer = me.getFooter(tooltipItems, data);

				// Initial positioning and colors
				model.x = Math.round(tooltipPosition.x);
				model.y = Math.round(tooltipPosition.y);
				model.caretPadding = helpers.getValueOrDefault(tooltipPosition.padding, 2);
				model.labelColors = labelColors;

				// data points
				model.dataPoints = tooltipItems;

				// We need to determine alignment of the tooltip
				tooltipSize = getTooltipSize(this, model);
				alignment = determineAlignment(this, tooltipSize);
				// Final Size and Position
				backgroundPoint = getBackgroundPoint(model, tooltipSize, alignment);
			} else {
				model.opacity = 0;
			}

			model.xAlign = alignment.xAlign;
			model.yAlign = alignment.yAlign;
			model.x = backgroundPoint.x;
			model.y = backgroundPoint.y;
			model.width = tooltipSize.width;
			model.height = tooltipSize.height;

			// Point where the caret on the tooltip points to
			model.caretX = tooltipPosition.x;
			model.caretY = tooltipPosition.y;

			me._model = model;

			if (changed && opts.custom) {
				opts.custom.call(me, model);
			}

			return me;
		},
		drawCaret: function(tooltipPoint, size, opacity) {
			var vm = this._view;
			var ctx = this._chart.ctx;
			var x1, x2, x3;
			var y1, y2, y3;
			var caretSize = vm.caretSize;
			var cornerRadius = vm.cornerRadius;
			var xAlign = vm.xAlign,
				yAlign = vm.yAlign;
			var ptX = tooltipPoint.x,
				ptY = tooltipPoint.y;
			var width = size.width,
				height = size.height;

			if (yAlign === 'center') {
				// Left or right side
				if (xAlign === 'left') {
					x1 = ptX;
					x2 = x1 - caretSize;
					x3 = x1;
				} else {
					x1 = ptX + width;
					x2 = x1 + caretSize;
					x3 = x1;
				}

				y2 = ptY + (height / 2);
				y1 = y2 - caretSize;
				y3 = y2 + caretSize;
			} else {
				if (xAlign === 'left') {
					x1 = ptX + cornerRadius;
					x2 = x1 + caretSize;
					x3 = x2 + caretSize;
				} else if (xAlign === 'right') {
					x1 = ptX + width - cornerRadius;
					x2 = x1 - caretSize;
					x3 = x2 - caretSize;
				} else {
					x2 = ptX + (width / 2);
					x1 = x2 - caretSize;
					x3 = x2 + caretSize;
				}

				if (yAlign === 'top') {
					y1 = ptY;
					y2 = y1 - caretSize;
					y3 = y1;
				} else {
					y1 = ptY + height;
					y2 = y1 + caretSize;
					y3 = y1;
				}
			}

			ctx.fillStyle = mergeOpacity(vm.backgroundColor, opacity);
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.closePath();
			ctx.fill();
		},
		drawTitle: function(pt, vm, ctx, opacity) {
			var title = vm.title;

			if (title.length) {
				ctx.textAlign = vm._titleAlign;
				ctx.textBaseline = 'top';

				var titleFontSize = vm.titleFontSize,
					titleSpacing = vm.titleSpacing;

				ctx.fillStyle = mergeOpacity(vm.titleFontColor, opacity);
				ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);

				var i, len;
				for (i = 0, len = title.length; i < len; ++i) {
					ctx.fillText(title[i], pt.x, pt.y);
					pt.y += titleFontSize + titleSpacing; // Line Height and spacing

					if (i + 1 === title.length) {
						pt.y += vm.titleMarginBottom - titleSpacing; // If Last, add margin, remove spacing
					}
				}
			}
		},
		drawBody: function(pt, vm, ctx, opacity) {
			var bodyFontSize = vm.bodyFontSize;
			var bodySpacing = vm.bodySpacing;
			var body = vm.body;

			ctx.textAlign = vm._bodyAlign;
			ctx.textBaseline = 'top';

			var textColor = mergeOpacity(vm.bodyFontColor, opacity);
			ctx.fillStyle = textColor;
			ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);

			// Before Body
			var xLinePadding = 0;
			var fillLineOfText = function(line) {
				ctx.fillText(line, pt.x + xLinePadding, pt.y);
				pt.y += bodyFontSize + bodySpacing;
			};

			// Before body lines
			helpers.each(vm.beforeBody, fillLineOfText);

			var drawColorBoxes = vm.displayColors;
			xLinePadding = drawColorBoxes ? (bodyFontSize + 2) : 0;

			// Draw body lines now
			helpers.each(body, function(bodyItem, i) {
				helpers.each(bodyItem.before, fillLineOfText);

				helpers.each(bodyItem.lines, function(line) {
					// Draw Legend-like boxes if needed
					if (drawColorBoxes) {
						// Fill a white rect so that colours merge nicely if the opacity is < 1
						ctx.fillStyle = mergeOpacity(vm.legendColorBackground, opacity);
						ctx.fillRect(pt.x, pt.y, bodyFontSize, bodyFontSize);

						// Border
						ctx.strokeStyle = mergeOpacity(vm.labelColors[i].borderColor, opacity);
						ctx.strokeRect(pt.x, pt.y, bodyFontSize, bodyFontSize);

						// Inner square
						ctx.fillStyle = mergeOpacity(vm.labelColors[i].backgroundColor, opacity);
						ctx.fillRect(pt.x + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);

						ctx.fillStyle = textColor;
					}

					fillLineOfText(line);
				});

				helpers.each(bodyItem.after, fillLineOfText);
			});

			// Reset back to 0 for after body
			xLinePadding = 0;

			// After body lines
			helpers.each(vm.afterBody, fillLineOfText);
			pt.y -= bodySpacing; // Remove last body spacing
		},
		drawFooter: function(pt, vm, ctx, opacity) {
			var footer = vm.footer;

			if (footer.length) {
				pt.y += vm.footerMarginTop;

				ctx.textAlign = vm._footerAlign;
				ctx.textBaseline = 'top';

				ctx.fillStyle = mergeOpacity(vm.footerFontColor, opacity);
				ctx.font = helpers.fontString(vm.footerFontSize, vm._footerFontStyle, vm._footerFontFamily);

				helpers.each(footer, function(line) {
					ctx.fillText(line, pt.x, pt.y);
					pt.y += vm.footerFontSize + vm.footerSpacing;
				});
			}
		},
		drawBackground: function(pt, vm, ctx, tooltipSize, opacity) {
			ctx.fillStyle = mergeOpacity(vm.backgroundColor, opacity);
			helpers.drawRoundedRectangle(ctx, pt.x, pt.y, tooltipSize.width, tooltipSize.height, vm.cornerRadius);
			ctx.fill();
		},
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			if (vm.opacity === 0) {
				return;
			}

			var tooltipSize = {
				width: vm.width,
				height: vm.height
			};
			var pt = {
				x: vm.x,
				y: vm.y
			};

			// IE11/Edge does not like very small opacities, so snap to 0
			var opacity = Math.abs(vm.opacity < 1e-3) ? 0 : vm.opacity;

			if (this._options.enabled) {
				// Draw Background
				this.drawBackground(pt, vm, ctx, tooltipSize, opacity);

				// Draw Caret
				this.drawCaret(pt, tooltipSize, opacity);

				// Draw Title, Body, and Footer
				pt.x += vm.xPadding;
				pt.y += vm.yPadding;

				// Titles
				this.drawTitle(pt, vm, ctx, opacity);

				// Body
				this.drawBody(pt, vm, ctx, opacity);

				// Footer
				this.drawFooter(pt, vm, ctx, opacity);
			}
		},

		/**
		 * Handle an event
		 * @private
		 * @param {IEvent} event - The event to handle
		 * @returns {Boolean} true if the tooltip changed
		 */
		handleEvent: function(e) {
			var me = this;
			var options = me._options;
			var changed = false;

			me._lastActive = me._lastActive || [];

			// Find Active Elements for tooltips
			if (e.type === 'mouseout') {
				me._active = [];
			} else {
				me._active = me._chartInstance.getElementsAtEventForMode(e, options.mode, options);
			}

			// Remember Last Actives
			changed = !helpers.arrayEquals(me._active, me._lastActive);
			me._lastActive = me._active;

			if (options.enabled || options.custom) {
				me._eventPosition = {
					x: e.x,
					y: e.y
				};

				var model = me._model;
				me.update(true);
				me.pivot();

				// See if our tooltip position changed
				changed |= (model.x !== me._model.x) || (model.y !== me._model.y);
			}

			return changed;
		}
	});

	/**
	 * @namespace Chart.Tooltip.positioners
	 */
	Chart.Tooltip.positioners = {
		/**
		 * Average mode places the tooltip at the average position of the elements shown
		 * @function Chart.Tooltip.positioners.average
		 * @param elements {ChartElement[]} the elements being displayed in the tooltip
		 * @returns {Point} tooltip position
		 */
		average: function(elements) {
			if (!elements.length) {
				return false;
			}

			var i, len;
			var x = 0;
			var y = 0;
			var count = 0;

			for (i = 0, len = elements.length; i < len; ++i) {
				var el = elements[i];
				if (el && el.hasValue()) {
					var pos = el.tooltipPosition();
					x += pos.x;
					y += pos.y;
					++count;
				}
			}

			return {
				x: Math.round(x / count),
				y: Math.round(y / count)
			};
		},

		/**
		 * Gets the tooltip position nearest of the item nearest to the event position
		 * @function Chart.Tooltip.positioners.nearest
		 * @param elements {Chart.Element[]} the tooltip elements
		 * @param eventPosition {Point} the position of the event in canvas coordinates
		 * @returns {Point} the tooltip position
		 */
		nearest: function(elements, eventPosition) {
			var x = eventPosition.x;
			var y = eventPosition.y;

			var nearestElement;
			var minDistance = Number.POSITIVE_INFINITY;
			var i, len;
			for (i = 0, len = elements.length; i < len; ++i) {
				var el = elements[i];
				if (el && el.hasValue()) {
					var center = el.getCenterPoint();
					var d = helpers.distanceBetweenPoints(eventPosition, center);

					if (d < minDistance) {
						minDistance = d;
						nearestElement = el;
					}
				}
			}

			if (nearestElement) {
				var tp = nearestElement.tooltipPosition();
				x = tp.x;
				y = tp.y;
			}

			return {
				x: x,
				y: y
			};
		}
	};
};

},{}],37:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		globalOpts = Chart.defaults.global;

	globalOpts.elements.arc = {
		backgroundColor: globalOpts.defaultColor,
		borderColor: '#fff',
		borderWidth: 2
	};

	Chart.elements.Arc = Chart.Element.extend({
		inLabelRange: function(mouseX) {
			var vm = this._view;

			if (vm) {
				return (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2));
			}
			return false;
		},
		inRange: function(chartX, chartY) {
			var vm = this._view;

			if (vm) {
				var pointRelativePosition = helpers.getAngleFromPoint(vm, {
						x: chartX,
						y: chartY
					}),
					angle = pointRelativePosition.angle,
					distance = pointRelativePosition.distance;

				// Sanitise angle range
				var startAngle = vm.startAngle;
				var endAngle = vm.endAngle;
				while (endAngle < startAngle) {
					endAngle += 2.0 * Math.PI;
				}
				while (angle > endAngle) {
					angle -= 2.0 * Math.PI;
				}
				while (angle < startAngle) {
					angle += 2.0 * Math.PI;
				}

				// Check if within the range of the open/close angle
				var betweenAngles = (angle >= startAngle && angle <= endAngle),
					withinRadius = (distance >= vm.innerRadius && distance <= vm.outerRadius);

				return (betweenAngles && withinRadius);
			}
			return false;
		},
		getCenterPoint: function() {
			var vm = this._view;
			var halfAngle = (vm.startAngle + vm.endAngle) / 2;
			var halfRadius = (vm.innerRadius + vm.outerRadius) / 2;
			return {
				x: vm.x + Math.cos(halfAngle) * halfRadius,
				y: vm.y + Math.sin(halfAngle) * halfRadius
			};
		},
		getArea: function() {
			var vm = this._view;
			return Math.PI * ((vm.endAngle - vm.startAngle) / (2 * Math.PI)) * (Math.pow(vm.outerRadius, 2) - Math.pow(vm.innerRadius, 2));
		},
		tooltipPosition: function() {
			var vm = this._view;

			var centreAngle = vm.startAngle + ((vm.endAngle - vm.startAngle) / 2),
				rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;
			return {
				x: vm.x + (Math.cos(centreAngle) * rangeFromCentre),
				y: vm.y + (Math.sin(centreAngle) * rangeFromCentre)
			};
		},
		draw: function() {

			var ctx = this._chart.ctx,
				vm = this._view,
				sA = vm.startAngle,
				eA = vm.endAngle;

			ctx.beginPath();

			ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
			ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

			ctx.closePath();
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = vm.borderWidth;

			ctx.fillStyle = vm.backgroundColor;

			ctx.fill();
			ctx.lineJoin = 'bevel';

			if (vm.borderWidth) {
				ctx.stroke();
			}
		}
	});
};

},{}],38:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalDefaults = Chart.defaults.global;

	Chart.defaults.global.elements.line = {
		tension: 0.4,
		backgroundColor: globalDefaults.defaultColor,
		borderWidth: 3,
		borderColor: globalDefaults.defaultColor,
		borderCapStyle: 'butt',
		borderDash: [],
		borderDashOffset: 0.0,
		borderJoinStyle: 'miter',
		capBezierPoints: true,
		fill: true, // do we fill in the area between the line and its base axis
	};

	Chart.elements.Line = Chart.Element.extend({
		draw: function() {
			var me = this;
			var vm = me._view;
			var spanGaps = vm.spanGaps;
			var fillPoint = vm.scaleZero;
			var loop = me._loop;

			// Handle different fill modes for cartesian lines
			if (!loop) {
				if (vm.fill === 'top') {
					fillPoint = vm.scaleTop;
				} else if (vm.fill === 'bottom') {
					fillPoint = vm.scaleBottom;
				}
			}

			var ctx = me._chart.ctx;
			ctx.save();

			// Helper function to draw a line to a point
			function lineToPoint(previousPoint, point) {
				var pointVM = point._view;
				if (point._view.steppedLine === true) {
					ctx.lineTo(pointVM.x, previousPoint._view.y);
					ctx.lineTo(pointVM.x, pointVM.y);
				} else if (point._view.tension === 0) {
					ctx.lineTo(pointVM.x, pointVM.y);
				} else {
					ctx.bezierCurveTo(
						previousPoint._view.controlPointNextX,
						previousPoint._view.controlPointNextY,
						pointVM.controlPointPreviousX,
						pointVM.controlPointPreviousY,
						pointVM.x,
						pointVM.y
					);
				}
			}

			var points = me._children.slice(); // clone array
			var lastDrawnIndex = -1;

			// If we are looping, adding the first point again
			if (loop && points.length) {
				points.push(points[0]);
			}

			var index, current, previous, currentVM;

			// Fill Line
			if (points.length && vm.fill) {
				ctx.beginPath();

				for (index = 0; index < points.length; ++index) {
					current = points[index];
					previous = helpers.previousItem(points, index);
					currentVM = current._view;

					// First point moves to it's starting position no matter what
					if (index === 0) {
						if (loop) {
							ctx.moveTo(fillPoint.x, fillPoint.y);
						} else {
							ctx.moveTo(currentVM.x, fillPoint);
						}

						if (!currentVM.skip) {
							lastDrawnIndex = index;
							ctx.lineTo(currentVM.x, currentVM.y);
						}
					} else {
						previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

						if (currentVM.skip) {
							// Only do this if this is the first point that is skipped
							if (!spanGaps && lastDrawnIndex === (index - 1)) {
								if (loop) {
									ctx.lineTo(fillPoint.x, fillPoint.y);
								} else {
									ctx.lineTo(previous._view.x, fillPoint);
								}
							}
						} else {
							if (lastDrawnIndex !== (index - 1)) {
								// There was a gap and this is the first point after the gap. If we've never drawn a point, this is a special case.
								// If the first data point is NaN, then there is no real gap to skip
								if (spanGaps && lastDrawnIndex !== -1) {
									// We are spanning the gap, so simple draw a line to this point
									lineToPoint(previous, current);
								} else if (loop) {
									ctx.lineTo(currentVM.x, currentVM.y);
								} else {
									ctx.lineTo(currentVM.x, fillPoint);
									ctx.lineTo(currentVM.x, currentVM.y);
								}
							} else {
								// Line to next point
								lineToPoint(previous, current);
							}
							lastDrawnIndex = index;
						}
					}
				}

				if (!loop && lastDrawnIndex !== -1) {
					ctx.lineTo(points[lastDrawnIndex]._view.x, fillPoint);
				}

				ctx.fillStyle = vm.backgroundColor || globalDefaults.defaultColor;
				ctx.closePath();
				ctx.fill();
			}

			// Stroke Line Options
			var globalOptionLineElements = globalDefaults.elements.line;
			ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;

			// IE 9 and 10 do not support line dash
			if (ctx.setLineDash) {
				ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
			}

			ctx.lineDashOffset = vm.borderDashOffset || globalOptionLineElements.borderDashOffset;
			ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
			ctx.lineWidth = vm.borderWidth || globalOptionLineElements.borderWidth;
			ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;

			// Stroke Line
			ctx.beginPath();
			lastDrawnIndex = -1;

			for (index = 0; index < points.length; ++index) {
				current = points[index];
				previous = helpers.previousItem(points, index);
				currentVM = current._view;

				// First point moves to it's starting position no matter what
				if (index === 0) {
					if (!currentVM.skip) {
						ctx.moveTo(currentVM.x, currentVM.y);
						lastDrawnIndex = index;
					}
				} else {
					previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

					if (!currentVM.skip) {
						if ((lastDrawnIndex !== (index - 1) && !spanGaps) || lastDrawnIndex === -1) {
							// There was a gap and this is the first point after the gap
							ctx.moveTo(currentVM.x, currentVM.y);
						} else {
							// Line to next point
							lineToPoint(previous, current);
						}
						lastDrawnIndex = index;
					}
				}
			}

			ctx.stroke();
			ctx.restore();
		}
	});
};

},{}],39:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		globalOpts = Chart.defaults.global,
		defaultColor = globalOpts.defaultColor;

	globalOpts.elements.point = {
		radius: 3,
		pointStyle: 'circle',
		backgroundColor: defaultColor,
		borderWidth: 1,
		borderColor: defaultColor,
		// Hover
		hitRadius: 1,
		hoverRadius: 4,
		hoverBorderWidth: 1
	};

	function xRange(mouseX) {
		var vm = this._view;
		return vm ? (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hitRadius, 2)) : false;
	}

	function yRange(mouseY) {
		var vm = this._view;
		return vm ? (Math.pow(mouseY - vm.y, 2) < Math.pow(vm.radius + vm.hitRadius, 2)) : false;
	}

	Chart.elements.Point = Chart.Element.extend({
		inRange: function(mouseX, mouseY) {
			var vm = this._view;
			return vm ? ((Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2)) < Math.pow(vm.hitRadius + vm.radius, 2)) : false;
		},

		inLabelRange: xRange,
		inXRange: xRange,
		inYRange: yRange,

		getCenterPoint: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: vm.y
			};
		},
		getArea: function() {
			return Math.PI * Math.pow(this._view.radius, 2);
		},
		tooltipPosition: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: vm.y,
				padding: vm.radius + vm.borderWidth
			};
		},
		draw: function(chartArea) {
			var vm = this._view;
			var model = this._model;
			var ctx = this._chart.ctx;
			var pointStyle = vm.pointStyle;
			var radius = vm.radius;
			var x = vm.x;
			var y = vm.y;
			var color = Chart.helpers.color;
			var errMargin = 1.01; // 1.01 is margin for Accumulated error. (Especially Edge, IE.)
			var ratio = 0;

			if (vm.skip) {
				return;
			}

			ctx.strokeStyle = vm.borderColor || defaultColor;
			ctx.lineWidth = helpers.getValueOrDefault(vm.borderWidth, globalOpts.elements.point.borderWidth);
			ctx.fillStyle = vm.backgroundColor || defaultColor;

			// Cliping for Points.
			// going out from inner charArea?
			if ((chartArea !== undefined) && ((model.x < chartArea.left) || (chartArea.right*errMargin < model.x) || (model.y < chartArea.top) || (chartArea.bottom*errMargin < model.y))) {
				// Point fade out
				if (model.x < chartArea.left) {
					ratio = (x - model.x) / (chartArea.left - model.x);
				} else if (chartArea.right*errMargin < model.x) {
					ratio = (model.x - x) / (model.x - chartArea.right);
				} else if (model.y < chartArea.top) {
					ratio = (y - model.y) / (chartArea.top - model.y);
				} else if (chartArea.bottom*errMargin < model.y) {
					ratio = (model.y - y) / (model.y - chartArea.bottom);
				}
				ratio = Math.round(ratio*100) / 100;
				ctx.strokeStyle = color(ctx.strokeStyle).alpha(ratio).rgbString();
				ctx.fillStyle = color(ctx.fillStyle).alpha(ratio).rgbString();
			}

			Chart.canvasHelpers.drawPoint(ctx, pointStyle, radius, x, y);
		}
	});
};

},{}],40:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var globalOpts = Chart.defaults.global;

	globalOpts.elements.rectangle = {
		backgroundColor: globalOpts.defaultColor,
		borderWidth: 0,
		borderColor: globalOpts.defaultColor,
		borderSkipped: 'bottom'
	};

	function isVertical(bar) {
		return bar._view.width !== undefined;
	}

	/**
	 * Helper function to get the bounds of the bar regardless of the orientation
	 * @private
	 * @param bar {Chart.Element.Rectangle} the bar
	 * @return {Bounds} bounds of the bar
	 */
	function getBarBounds(bar) {
		var vm = bar._view;
		var x1, x2, y1, y2;

		if (isVertical(bar)) {
			// vertical
			var halfWidth = vm.width / 2;
			x1 = vm.x - halfWidth;
			x2 = vm.x + halfWidth;
			y1 = Math.min(vm.y, vm.base);
			y2 = Math.max(vm.y, vm.base);
		} else {
			// horizontal bar
			var halfHeight = vm.height / 2;
			x1 = Math.min(vm.x, vm.base);
			x2 = Math.max(vm.x, vm.base);
			y1 = vm.y - halfHeight;
			y2 = vm.y + halfHeight;
		}

		return {
			left: x1,
			top: y1,
			right: x2,
			bottom: y2
		};
	}

	Chart.elements.Rectangle = Chart.Element.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;
			var left, right, top, bottom, signX, signY, borderSkipped;
			var borderWidth = vm.borderWidth;

			if (!vm.horizontal) {
				// bar
				left = vm.x - vm.width / 2;
				right = vm.x + vm.width / 2;
				top = vm.y;
				bottom = vm.base;
				signX = 1;
				signY = bottom > top? 1: -1;
				borderSkipped = vm.borderSkipped || 'bottom';
			} else {
				// horizontal bar
				left = vm.base;
				right = vm.x;
				top = vm.y - vm.height / 2;
				bottom = vm.y + vm.height / 2;
				signX = right > left? 1: -1;
				signY = 1;
				borderSkipped = vm.borderSkipped || 'left';
			}

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (borderWidth) {
				// borderWidth shold be less than bar width and bar height.
				var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
				borderWidth = borderWidth > barSize? barSize: borderWidth;
				var halfStroke = borderWidth / 2;
				// Adjust borderWidth when bar top position is near vm.base(zero).
				var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
				var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
				var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
				var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
				// not become a vertical line?
				if (borderLeft !== borderRight) {
					top = borderTop;
					bottom = borderBottom;
				}
				// not become a horizontal line?
				if (borderTop !== borderBottom) {
					left = borderLeft;
					right = borderRight;
				}
			}

			ctx.beginPath();
			ctx.fillStyle = vm.backgroundColor;
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = borderWidth;

			// Corner points, from bottom-left to bottom-right clockwise
			// | 1 2 |
			// | 0 3 |
			var corners = [
				[left, bottom],
				[left, top],
				[right, top],
				[right, bottom]
			];

			// Find first (starting) corner with fallback to 'bottom'
			var borders = ['bottom', 'left', 'top', 'right'];
			var startCorner = borders.indexOf(borderSkipped, 0);
			if (startCorner === -1) {
				startCorner = 0;
			}

			function cornerAt(index) {
				return corners[(startCorner + index) % 4];
			}

			// Draw rectangle from 'startCorner'
			var corner = cornerAt(0);
			ctx.moveTo(corner[0], corner[1]);

			for (var i = 1; i < 4; i++) {
				corner = cornerAt(i);
				ctx.lineTo(corner[0], corner[1]);
			}

			ctx.fill();
			if (borderWidth) {
				ctx.stroke();
			}
		},
		height: function() {
			var vm = this._view;
			return vm.base - vm.y;
		},
		inRange: function(mouseX, mouseY) {
			var inRange = false;

			if (this._view) {
				var bounds = getBarBounds(this);
				inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inLabelRange: function(mouseX, mouseY) {
			var me = this;
			if (!me._view) {
				return false;
			}

			var inRange = false;
			var bounds = getBarBounds(me);

			if (isVertical(me)) {
				inRange = mouseX >= bounds.left && mouseX <= bounds.right;
			} else {
				inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inXRange: function(mouseX) {
			var bounds = getBarBounds(this);
			return mouseX >= bounds.left && mouseX <= bounds.right;
		},
		inYRange: function(mouseY) {
			var bounds = getBarBounds(this);
			return mouseY >= bounds.top && mouseY <= bounds.bottom;
		},
		getCenterPoint: function() {
			var vm = this._view;
			var x, y;
			if (isVertical(this)) {
				x = vm.x;
				y = (vm.y + vm.base) / 2;
			} else {
				x = (vm.x + vm.base) / 2;
				y = vm.y;
			}

			return {x: x, y: y};
		},
		getArea: function() {
			var vm = this._view;
			return vm.width * Math.abs(vm.y - vm.base);
		},
		tooltipPosition: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: vm.y
			};
		}
	});

};

},{}],41:[function(require,module,exports){
'use strict';

// Chart.Platform implementation for targeting a web browser
module.exports = function(Chart) {
	var helpers = Chart.helpers;

	// DOM event types -> Chart.js event types.
	// Note: only events with different types are mapped.
	// https://developer.mozilla.org/en-US/docs/Web/Events
	var eventTypeMap = {
		// Touch events
		touchstart: 'mousedown',
		touchmove: 'mousemove',
		touchend: 'mouseup',

		// Pointer events
		pointerenter: 'mouseenter',
		pointerdown: 'mousedown',
		pointermove: 'mousemove',
		pointerup: 'mouseup',
		pointerleave: 'mouseout',
		pointerout: 'mouseout'
	};

	/**
	 * The "used" size is the final value of a dimension property after all calculations have
	 * been performed. This method uses the computed style of `element` but returns undefined
	 * if the computed style is not expressed in pixels. That can happen in some cases where
	 * `element` has a size relative to its parent and this last one is not yet displayed,
	 * for example because of `display: none` on a parent node.
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
	 * @returns {Number} Size in pixels or undefined if unknown.
	 */
	function readUsedSize(element, property) {
		var value = helpers.getStyle(element, property);
		var matches = value && value.match(/(\d+)px/);
		return matches? Number(matches[1]) : undefined;
	}

	/**
	 * Initializes the canvas style and render size without modifying the canvas display size,
	 * since responsiveness is handled by the controller.resize() method. The config is used
	 * to determine the aspect ratio to apply in case no explicit height has been specified.
	 */
	function initCanvas(canvas, config) {
		var style = canvas.style;

		// NOTE(SB) canvas.getAttribute('width') !== canvas.width: in the first case it
		// returns null or '' if no explicit value has been set to the canvas attribute.
		var renderHeight = canvas.getAttribute('height');
		var renderWidth = canvas.getAttribute('width');

		// Chart.js modifies some canvas values that we want to restore on destroy
		canvas._chartjs = {
			initial: {
				height: renderHeight,
				width: renderWidth,
				style: {
					display: style.display,
					height: style.height,
					width: style.width
				}
			}
		};

		// Force canvas to display as block to avoid extra space caused by inline
		// elements, which would interfere with the responsive resize process.
		// https://github.com/chartjs/Chart.js/issues/2538
		style.display = style.display || 'block';

		if (renderWidth === null || renderWidth === '') {
			var displayWidth = readUsedSize(canvas, 'width');
			if (displayWidth !== undefined) {
				canvas.width = displayWidth;
			}
		}

		if (renderHeight === null || renderHeight === '') {
			if (canvas.style.height === '') {
				// If no explicit render height and style height, let's apply the aspect ratio,
				// which one can be specified by the user but also by charts as default option
				// (i.e. options.aspectRatio). If not specified, use canvas aspect ratio of 2.
				canvas.height = canvas.width / (config.options.aspectRatio || 2);
			} else {
				var displayHeight = readUsedSize(canvas, 'height');
				if (displayWidth !== undefined) {
					canvas.height = displayHeight;
				}
			}
		}

		return canvas;
	}

	function createEvent(type, chart, x, y, native) {
		return {
			type: type,
			chart: chart,
			native: native || null,
			x: x !== undefined? x : null,
			y: y !== undefined? y : null,
		};
	}

	function fromNativeEvent(event, chart) {
		var type = eventTypeMap[event.type] || event.type;
		var pos = helpers.getRelativePosition(event, chart);
		return createEvent(type, chart, pos.x, pos.y, event);
	}

	function createResizer(handler) {
		var iframe = document.createElement('iframe');
		iframe.className = 'chartjs-hidden-iframe';
		iframe.style.cssText =
			'display:block;'+
			'overflow:hidden;'+
			'border:0;'+
			'margin:0;'+
			'top:0;'+
			'left:0;'+
			'bottom:0;'+
			'right:0;'+
			'height:100%;'+
			'width:100%;'+
			'position:absolute;'+
			'pointer-events:none;'+
			'z-index:-1;';

		// Prevent the iframe to gain focus on tab.
		// https://github.com/chartjs/Chart.js/issues/3090
		iframe.tabIndex = -1;

		// If the iframe is re-attached to the DOM, the resize listener is removed because the
		// content is reloaded, so make sure to install the handler after the iframe is loaded.
		// https://github.com/chartjs/Chart.js/issues/3521
		helpers.addEvent(iframe, 'load', function() {
			helpers.addEvent(iframe.contentWindow || iframe, 'resize', handler);

			// The iframe size might have changed while loading, which can also
			// happen if the size has been changed while detached from the DOM.
			handler();
		});

		return iframe;
	}

	function addResizeListener(node, listener, chart) {
		var stub = node._chartjs = {
			ticking: false
		};

		// Throttle the callback notification until the next animation frame.
		var notify = function() {
			if (!stub.ticking) {
				stub.ticking = true;
				helpers.requestAnimFrame.call(window, function() {
					if (stub.resizer) {
						stub.ticking = false;
						return listener(createEvent('resize', chart));
					}
				});
			}
		};

		// Let's keep track of this added iframe and thus avoid DOM query when removing it.
		stub.resizer = createResizer(notify);

		node.insertBefore(stub.resizer, node.firstChild);
	}

	function removeResizeListener(node) {
		if (!node || !node._chartjs) {
			return;
		}

		var resizer = node._chartjs.resizer;
		if (resizer) {
			resizer.parentNode.removeChild(resizer);
			node._chartjs.resizer = null;
		}

		delete node._chartjs;
	}

	return {
		acquireContext: function(item, config) {
			if (typeof item === 'string') {
				item = document.getElementById(item);
			} else if (item.length) {
				// Support for array based queries (such as jQuery)
				item = item[0];
			}

			if (item && item.canvas) {
				// Support for any object associated to a canvas (including a context2d)
				item = item.canvas;
			}

			if (item instanceof HTMLCanvasElement) {
				// To prevent canvas fingerprinting, some add-ons undefine the getContext
				// method, for example: https://github.com/kkapsner/CanvasBlocker
				// https://github.com/chartjs/Chart.js/issues/2807
				var context = item.getContext && item.getContext('2d');
				if (context instanceof CanvasRenderingContext2D) {
					initCanvas(item, config);
					return context;
				}
			}

			return null;
		},

		releaseContext: function(context) {
			var canvas = context.canvas;
			if (!canvas._chartjs) {
				return;
			}

			var initial = canvas._chartjs.initial;
			['height', 'width'].forEach(function(prop) {
				var value = initial[prop];
				if (value === undefined || value === null) {
					canvas.removeAttribute(prop);
				} else {
					canvas.setAttribute(prop, value);
				}
			});

			helpers.each(initial.style || {}, function(value, key) {
				canvas.style[key] = value;
			});

			// The canvas render size might have been changed (and thus the state stack discarded),
			// we can't use save() and restore() to restore the initial state. So make sure that at
			// least the canvas context is reset to the default state by setting the canvas width.
			// https://www.w3.org/TR/2011/WD-html5-20110525/the-canvas-element.html
			canvas.width = canvas.width;

			delete canvas._chartjs;
		},

		addEventListener: function(chart, type, listener) {
			var canvas = chart.chart.canvas;
			if (type === 'resize') {
				// Note: the resize event is not supported on all browsers.
				addResizeListener(canvas.parentNode, listener, chart.chart);
				return;
			}

			var stub = listener._chartjs || (listener._chartjs = {});
			var proxies = stub.proxies || (stub.proxies = {});
			var proxy = proxies[chart.id + '_' + type] = function(event) {
				listener(fromNativeEvent(event, chart.chart));
			};

			helpers.addEvent(canvas, type, proxy);
		},

		removeEventListener: function(chart, type, listener) {
			var canvas = chart.chart.canvas;
			if (type === 'resize') {
				// Note: the resize event is not supported on all browsers.
				removeResizeListener(canvas.parentNode, listener);
				return;
			}

			var stub = listener._chartjs || {};
			var proxies = stub.proxies || {};
			var proxy = proxies[chart.id + '_' + type];
			if (!proxy) {
				return;
			}

			helpers.removeEvent(canvas, type, proxy);
		}
	};
};

},{}],42:[function(require,module,exports){
'use strict';

// By default, select the browser (DOM) platform.
// @TODO Make possible to select another platform at build time.
var implementation = require(41);

module.exports = function(Chart) {
	/**
	 * @namespace Chart.platform
	 * @see https://chartjs.gitbooks.io/proposals/content/Platform.html
	 * @since 2.4.0
	 */
	Chart.platform = {
		/**
		 * Called at chart construction time, returns a context2d instance implementing
		 * the [W3C Canvas 2D Context API standard]{@link https://www.w3.org/TR/2dcontext/}.
		 * @param {*} item - The native item from which to acquire context (platform specific)
		 * @param {Object} options - The chart options
		 * @returns {CanvasRenderingContext2D} context2d instance
		 */
		acquireContext: function() {},

		/**
		 * Called at chart destruction time, releases any resources associated to the context
		 * previously returned by the acquireContext() method.
		 * @param {CanvasRenderingContext2D} context - The context2d instance
		 * @returns {Boolean} true if the method succeeded, else false
		 */
		releaseContext: function() {},

		/**
		 * Registers the specified listener on the given chart.
		 * @param {Chart} chart - Chart from which to listen for event
		 * @param {String} type - The ({@link IEvent}) type to listen for
		 * @param {Function} listener - Receives a notification (an object that implements
		 * the {@link IEvent} interface) when an event of the specified type occurs.
		 */
		addEventListener: function() {},

		/**
		 * Removes the specified listener previously registered with addEventListener.
		 * @param {Chart} chart -Chart from which to remove the listener
		 * @param {String} type - The ({@link IEvent}) type to remove
		 * @param {Function} listener - The listener function to remove from the event target.
		 */
		removeEventListener: function() {}
	};

	/**
	 * @interface IPlatform
	 * Allows abstracting platform dependencies away from the chart
	 * @borrows Chart.platform.acquireContext as acquireContext
	 * @borrows Chart.platform.releaseContext as releaseContext
	 * @borrows Chart.platform.addEventListener as addEventListener
	 * @borrows Chart.platform.removeEventListener as removeEventListener
	 */

	/**
	 * @interface IEvent
	 * @prop {String} type - The event type name, possible values are:
	 * 'contextmenu', 'mouseenter', 'mousedown', 'mousemove', 'mouseup', 'mouseout',
	 * 'click', 'dblclick', 'keydown', 'keypress', 'keyup' and 'resize'
	 * @prop {*} native - The original native event (null for emulated events, e.g. 'resize')
	 * @prop {Number} x - The mouse x position, relative to the canvas (null for incompatible events)
	 * @prop {Number} y - The mouse y position, relative to the canvas (null for incompatible events)
	 */

	Chart.helpers.extend(Chart.platform, implementation(Chart));
};

},{"41":41}],43:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	// Default config for a category scale
	var defaultConfig = {
		position: 'bottom'
	};

	var DatasetScale = Chart.Scale.extend({
		/**
		* Internal function to get the correct labels. If data.xLabels or data.yLabels are defined, use those
		* else fall back to data.labels
		* @private
		*/
		getLabels: function() {
			var data = this.chart.data;
			return (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
		},
		// Implement this so that
		determineDataLimits: function() {
			var me = this;
			var labels = me.getLabels();
			me.minIndex = 0;
			me.maxIndex = labels.length - 1;
			var findIndex;

			if (me.options.ticks.min !== undefined) {
				// user specified min value
				findIndex = helpers.indexOf(labels, me.options.ticks.min);
				me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
			}

			if (me.options.ticks.max !== undefined) {
				// user specified max value
				findIndex = helpers.indexOf(labels, me.options.ticks.max);
				me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
			}

			me.min = labels[me.minIndex];
			me.max = labels[me.maxIndex];
		},

		buildTicks: function() {
			var me = this;
			var labels = me.getLabels();
			// If we are viewing some subset of labels, slice the original array
			me.ticks = (me.minIndex === 0 && me.maxIndex === labels.length - 1) ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
		},

		getLabelForIndex: function(index, datasetIndex) {
			var me = this;
			var data = me.chart.data;
			var isHorizontal = me.isHorizontal();

			if (data.yLabels && !isHorizontal) {
				return me.getRightValue(data.datasets[datasetIndex].data[index]);
			}
			return me.ticks[index - me.minIndex];
		},

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: function(value, index, datasetIndex, includeOffset) {
			var me = this;
			// 1 is added because we need the length but we have the indexes
			var offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);

			if (value !== undefined && isNaN(index)) {
				var labels = me.getLabels();
				var idx = labels.indexOf(value);
				index = idx !== -1 ? idx : index;
			}

			if (me.isHorizontal()) {
				var valueWidth = me.width / offsetAmt;
				var widthOffset = (valueWidth * (index - me.minIndex));

				if (me.options.gridLines.offsetGridLines && includeOffset || me.maxIndex === me.minIndex && includeOffset) {
					widthOffset += (valueWidth / 2);
				}

				return me.left + Math.round(widthOffset);
			}
			var valueHeight = me.height / offsetAmt;
			var heightOffset = (valueHeight * (index - me.minIndex));

			if (me.options.gridLines.offsetGridLines && includeOffset) {
				heightOffset += (valueHeight / 2);
			}

			return me.top + Math.round(heightOffset);
		},
		getPixelForTick: function(index, includeOffset) {
			return this.getPixelForValue(this.ticks[index], index + this.minIndex, null, includeOffset);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var value;
			var offsetAmt = Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
			var horz = me.isHorizontal();
			var valueDimension = (horz ? me.width : me.height) / offsetAmt;

			pixel -= horz ? me.left : me.top;

			if (me.options.gridLines.offsetGridLines) {
				pixel -= (valueDimension / 2);
			}

			if (pixel <= 0) {
				value = 0;
			} else {
				value = Math.round(pixel / valueDimension);
			}

			return value;
		},
		getBasePixel: function() {
			return this.bottom;
		}
	});

	Chart.scaleService.registerScaleType('category', DatasetScale, defaultConfig);

};

},{}],44:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	var defaultConfig = {
		position: 'left',
		ticks: {
			callback: Chart.Ticks.formatters.linear
		}
	};

	var LinearScale = Chart.LinearScaleBase.extend({
		determineDataLimits: function() {
			var me = this;
			var opts = me.options;
			var chart = me.chart;
			var data = chart.data;
			var datasets = data.datasets;
			var isHorizontal = me.isHorizontal();

			function IDMatches(meta) {
				return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
			}

			// First Calculate the range
			me.min = null;
			me.max = null;

			var hasStacks = opts.stacked;
			if (hasStacks === undefined) {
				helpers.each(datasets, function(dataset, datasetIndex) {
					if (hasStacks) {
						return;
					}

					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) &&
						meta.stack !== undefined) {
						hasStacks = true;
					}
				});
			}

			if (opts.stacked || hasStacks) {
				var valuesPerStack = {};

				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					var key = [
						meta.type,
						// we have a separate stack for stack=undefined datasets when the opts.stacked is undefined
						((opts.stacked === undefined && meta.stack === undefined) ? datasetIndex : ''),
						meta.stack
					].join('.');

					if (valuesPerStack[key] === undefined) {
						valuesPerStack[key] = {
							positiveValues: [],
							negativeValues: []
						};
					}

					// Store these per type
					var positiveValues = valuesPerStack[key].positiveValues;
					var negativeValues = valuesPerStack[key].negativeValues;

					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							positiveValues[index] = positiveValues[index] || 0;
							negativeValues[index] = negativeValues[index] || 0;

							if (opts.relativePoints) {
								positiveValues[index] = 100;
							} else if (value < 0) {
								negativeValues[index] += value;
							} else {
								positiveValues[index] += value;
							}
						});
					}
				});

				helpers.each(valuesPerStack, function(valuesForType) {
					var values = valuesForType.positiveValues.concat(valuesForType.negativeValues);
					var minVal = helpers.min(values);
					var maxVal = helpers.max(values);
					me.min = me.min === null ? minVal : Math.min(me.min, minVal);
					me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
				});

			} else {
				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							if (me.min === null) {
								me.min = value;
							} else if (value < me.min) {
								me.min = value;
							}

							if (me.max === null) {
								me.max = value;
							} else if (value > me.max) {
								me.max = value;
							}
						});
					}
				});
			}

			// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
			this.handleTickRangeOptions();
		},
		getTickLimit: function() {
			var maxTicks;
			var me = this;
			var tickOpts = me.options.ticks;

			if (me.isHorizontal()) {
				maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.width / 50));
			} else {
				// The factor of 2 used to scale the font size has been experimentally determined.
				var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, Chart.defaults.global.defaultFontSize);
				maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.height / (2 * tickFontSize)));
			}

			return maxTicks;
		},
		// Called after the ticks are built. We need
		handleDirectionalChanges: function() {
			if (!this.isHorizontal()) {
				// We are in a vertical orientation. The top value is the highest. So reverse the array
				this.ticks.reverse();
			}
		},
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		// Utils
		getPixelForValue: function(value) {
			// This must be called after fit has been run so that
			// this.left, this.top, this.right, and this.bottom have been defined
			var me = this;
			var start = me.start;

			var rightValue = +me.getRightValue(value);
			var pixel;
			var range = me.end - start;

			if (me.isHorizontal()) {
				pixel = me.left + (me.width / range * (rightValue - start));
				return Math.round(pixel);
			}

			pixel = me.bottom - (me.height / range * (rightValue - start));
			return Math.round(pixel);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var isHorizontal = me.isHorizontal();
			var innerDimension = isHorizontal ? me.width : me.height;
			var offset = (isHorizontal ? pixel - me.left : me.bottom - pixel) / innerDimension;
			return me.start + ((me.end - me.start) * offset);
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.ticksAsNumbers[index]);
		}
	});
	Chart.scaleService.registerScaleType('linear', LinearScale, defaultConfig);

};

},{}],45:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		noop = helpers.noop;

	Chart.LinearScaleBase = Chart.Scale.extend({
		handleTickRangeOptions: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;

			// If we are forcing it to begin at 0, but 0 will already be rendered on the chart,
			// do nothing since that would make the chart weird. If the user really wants a weird chart
			// axis, they can manually override it
			if (tickOpts.beginAtZero) {
				var minSign = helpers.sign(me.min);
				var maxSign = helpers.sign(me.max);

				if (minSign < 0 && maxSign < 0) {
					// move the top up to 0
					me.max = 0;
				} else if (minSign > 0 && maxSign > 0) {
					// move the bottom down to 0
					me.min = 0;
				}
			}

			if (tickOpts.min !== undefined) {
				me.min = tickOpts.min;
			} else if (tickOpts.suggestedMin !== undefined) {
				me.min = Math.min(me.min, tickOpts.suggestedMin);
			}

			if (tickOpts.max !== undefined) {
				me.max = tickOpts.max;
			} else if (tickOpts.suggestedMax !== undefined) {
				me.max = Math.max(me.max, tickOpts.suggestedMax);
			}

			if (me.min === me.max) {
				me.max++;

				if (!tickOpts.beginAtZero) {
					me.min--;
				}
			}
		},
		getTickLimit: noop,
		handleDirectionalChanges: noop,

		buildTicks: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;

			// Figure out what the max number of ticks we can support it is based on the size of
			// the axis area. For now, we say that the minimum tick spacing in pixels must be 50
			// We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
			// the graph. Make sure we always have at least 2 ticks
			var maxTicks = me.getTickLimit();
			maxTicks = Math.max(2, maxTicks);

			var numericGeneratorOptions = {
				maxTicks: maxTicks,
				min: tickOpts.min,
				max: tickOpts.max,
				stepSize: helpers.getValueOrDefault(tickOpts.fixedStepSize, tickOpts.stepSize)
			};
			var ticks = me.ticks = Chart.Ticks.generators.linear(numericGeneratorOptions, me);

			me.handleDirectionalChanges();

			// At this point, we need to update our max and min given the tick values since we have expanded the
			// range of the scale
			me.max = helpers.max(ticks);
			me.min = helpers.min(ticks);

			if (tickOpts.reverse) {
				ticks.reverse();

				me.start = me.max;
				me.end = me.min;
			} else {
				me.start = me.min;
				me.end = me.max;
			}
		},
		convertTicksToLabels: function() {
			var me = this;
			me.ticksAsNumbers = me.ticks.slice();
			me.zeroLineIndex = me.ticks.indexOf(0);

			Chart.Scale.prototype.convertTicksToLabels.call(me);
		}
	});
};

},{}],46:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	var defaultConfig = {
		position: 'left',

		// label settings
		ticks: {
			callback: Chart.Ticks.formatters.logarithmic
		}
	};

	var LogarithmicScale = Chart.Scale.extend({
		determineDataLimits: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;
			var chart = me.chart;
			var data = chart.data;
			var datasets = data.datasets;
			var getValueOrDefault = helpers.getValueOrDefault;
			var isHorizontal = me.isHorizontal();
			function IDMatches(meta) {
				return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
			}

			// Calculate Range
			me.min = null;
			me.max = null;
			me.minNotZero = null;

			var hasStacks = opts.stacked;
			if (hasStacks === undefined) {
				helpers.each(datasets, function(dataset, datasetIndex) {
					if (hasStacks) {
						return;
					}

					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) &&
						meta.stack !== undefined) {
						hasStacks = true;
					}
				});
			}

			if (opts.stacked || hasStacks) {
				var valuesPerStack = {};

				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					var key = [
						meta.type,
						// we have a separate stack for stack=undefined datasets when the opts.stacked is undefined
						((opts.stacked === undefined && meta.stack === undefined) ? datasetIndex : ''),
						meta.stack
					].join('.');

					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						if (valuesPerStack[key] === undefined) {
							valuesPerStack[key] = [];
						}

						helpers.each(dataset.data, function(rawValue, index) {
							var values = valuesPerStack[key];
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							values[index] = values[index] || 0;

							if (opts.relativePoints) {
								values[index] = 100;
							} else {
								// Don't need to split positive and negative since the log scale can't handle a 0 crossing
								values[index] += value;
							}
						});
					}
				});

				helpers.each(valuesPerStack, function(valuesForType) {
					var minVal = helpers.min(valuesForType);
					var maxVal = helpers.max(valuesForType);
					me.min = me.min === null ? minVal : Math.min(me.min, minVal);
					me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
				});

			} else {
				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							if (me.min === null) {
								me.min = value;
							} else if (value < me.min) {
								me.min = value;
							}

							if (me.max === null) {
								me.max = value;
							} else if (value > me.max) {
								me.max = value;
							}

							if (value !== 0 && (me.minNotZero === null || value < me.minNotZero)) {
								me.minNotZero = value;
							}
						});
					}
				});
			}

			me.min = getValueOrDefault(tickOpts.min, me.min);
			me.max = getValueOrDefault(tickOpts.max, me.max);

			if (me.min === me.max) {
				if (me.min !== 0 && me.min !== null) {
					me.min = Math.pow(10, Math.floor(helpers.log10(me.min)) - 1);
					me.max = Math.pow(10, Math.floor(helpers.log10(me.max)) + 1);
				} else {
					me.min = 1;
					me.max = 10;
				}
			}
		},
		buildTicks: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;

			var generationOptions = {
				min: tickOpts.min,
				max: tickOpts.max
			};
			var ticks = me.ticks = Chart.Ticks.generators.logarithmic(generationOptions, me);

			if (!me.isHorizontal()) {
				// We are in a vertical orientation. The top value is the highest. So reverse the array
				ticks.reverse();
			}

			// At this point, we need to update our max and min given the tick values since we have expanded the
			// range of the scale
			me.max = helpers.max(ticks);
			me.min = helpers.min(ticks);

			if (tickOpts.reverse) {
				ticks.reverse();

				me.start = me.max;
				me.end = me.min;
			} else {
				me.start = me.min;
				me.end = me.max;
			}
		},
		convertTicksToLabels: function() {
			this.tickValues = this.ticks.slice();

			Chart.Scale.prototype.convertTicksToLabels.call(this);
		},
		// Get the correct tooltip label
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.tickValues[index]);
		},
		getPixelForValue: function(value) {
			var me = this;
			var innerDimension;
			var pixel;

			var start = me.start;
			var newVal = +me.getRightValue(value);
			var range;
			var opts = me.options;
			var tickOpts = opts.ticks;

			if (me.isHorizontal()) {
				range = helpers.log10(me.end) - helpers.log10(start); // todo: if start === 0
				if (newVal === 0) {
					pixel = me.left;
				} else {
					innerDimension = me.width;
					pixel = me.left + (innerDimension / range * (helpers.log10(newVal) - helpers.log10(start)));
				}
			} else {
				// Bottom - top since pixels increase downward on a screen
				innerDimension = me.height;
				if (start === 0 && !tickOpts.reverse) {
					range = helpers.log10(me.end) - helpers.log10(me.minNotZero);
					if (newVal === start) {
						pixel = me.bottom;
					} else if (newVal === me.minNotZero) {
						pixel = me.bottom - innerDimension * 0.02;
					} else {
						pixel = me.bottom - innerDimension * 0.02 - (innerDimension * 0.98/ range * (helpers.log10(newVal)-helpers.log10(me.minNotZero)));
					}
				} else if (me.end === 0 && tickOpts.reverse) {
					range = helpers.log10(me.start) - helpers.log10(me.minNotZero);
					if (newVal === me.end) {
						pixel = me.top;
					} else if (newVal === me.minNotZero) {
						pixel = me.top + innerDimension * 0.02;
					} else {
						pixel = me.top + innerDimension * 0.02 + (innerDimension * 0.98/ range * (helpers.log10(newVal)-helpers.log10(me.minNotZero)));
					}
				} else {
					range = helpers.log10(me.end) - helpers.log10(start);
					innerDimension = me.height;
					pixel = me.bottom - (innerDimension / range * (helpers.log10(newVal) - helpers.log10(start)));
				}
			}
			return pixel;
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var range = helpers.log10(me.end) - helpers.log10(me.start);
			var value, innerDimension;

			if (me.isHorizontal()) {
				innerDimension = me.width;
				value = me.start * Math.pow(10, (pixel - me.left) * range / innerDimension);
			} else {  // todo: if start === 0
				innerDimension = me.height;
				value = Math.pow(10, (me.bottom - pixel) * range / innerDimension) / me.start;
			}
			return value;
		}
	});
	Chart.scaleService.registerScaleType('logarithmic', LogarithmicScale, defaultConfig);

};

},{}],47:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalDefaults = Chart.defaults.global;

	var defaultConfig = {
		display: true,

		// Boolean - Whether to animate scaling the chart from the centre
		animate: true,
		lineArc: false,
		position: 'chartArea',

		angleLines: {
			display: true,
			color: 'rgba(0, 0, 0, 0.1)',
			lineWidth: 1
		},

		// label settings
		ticks: {
			// Boolean - Show a backdrop to the scale label
			showLabelBackdrop: true,

			// String - The colour of the label backdrop
			backdropColor: 'rgba(255,255,255,0.75)',

			// Number - The backdrop padding above & below the label in pixels
			backdropPaddingY: 2,

			// Number - The backdrop padding to the side of the label in pixels
			backdropPaddingX: 2,

			callback: Chart.Ticks.formatters.linear
		},

		pointLabels: {
			// Number - Point label font size in pixels
			fontSize: 10,

			// Function - Used to convert point labels
			callback: function(label) {
				return label;
			}
		}
	};

	function getValueCount(scale) {
		return !scale.options.lineArc ? scale.chart.data.labels.length : 0;
	}

	function getPointLabelFontOptions(scale) {
		var pointLabelOptions = scale.options.pointLabels;
		var fontSize = helpers.getValueOrDefault(pointLabelOptions.fontSize, globalDefaults.defaultFontSize);
		var fontStyle = helpers.getValueOrDefault(pointLabelOptions.fontStyle, globalDefaults.defaultFontStyle);
		var fontFamily = helpers.getValueOrDefault(pointLabelOptions.fontFamily, globalDefaults.defaultFontFamily);
		var font = helpers.fontString(fontSize, fontStyle, fontFamily);

		return {
			size: fontSize,
			style: fontStyle,
			family: fontFamily,
			font: font
		};
	}

	function measureLabelSize(ctx, fontSize, label) {
		if (helpers.isArray(label)) {
			return {
				w: helpers.longestText(ctx, ctx.font, label),
				h: (label.length * fontSize) + ((label.length - 1) * 1.5 * fontSize)
			};
		}

		return {
			w: ctx.measureText(label).width,
			h: fontSize
		};
	}

	function determineLimits(angle, pos, size, min, max) {
		if (angle === min || angle === max) {
			return {
				start: pos - (size / 2),
				end: pos + (size / 2)
			};
		} else if (angle < min || angle > max) {
			return {
				start: pos - size - 5,
				end: pos
			};
		}

		return {
			start: pos,
			end: pos + size + 5
		};
	}

	/**
	 * Helper function to fit a radial linear scale with point labels
	 */
	function fitWithPointLabels(scale) {
		/*
		 * Right, this is really confusing and there is a lot of maths going on here
		 * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
		 *
		 * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
		 *
		 * Solution:
		 *
		 * We assume the radius of the polygon is half the size of the canvas at first
		 * at each index we check if the text overlaps.
		 *
		 * Where it does, we store that angle and that index.
		 *
		 * After finding the largest index and angle we calculate how much we need to remove
		 * from the shape radius to move the point inwards by that x.
		 *
		 * We average the left and right distances to get the maximum shape radius that can fit in the box
		 * along with labels.
		 *
		 * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
		 * on each side, removing that from the size, halving it and adding the left x protrusion width.
		 *
		 * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
		 * and position it in the most space efficient manner
		 *
		 * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
		 */

		var plFont = getPointLabelFontOptions(scale);

		// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
		// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
		var largestPossibleRadius = Math.min(scale.height / 2, scale.width / 2);
		var furthestLimits = {
			l: scale.width,
			r: 0,
			t: scale.height,
			b: 0
		};
		var furthestAngles = {};
		var i;
		var textSize;
		var pointPosition;

		scale.ctx.font = plFont.font;
		scale._pointLabelSizes = [];

		var valueCount = getValueCount(scale);
		for (i = 0; i < valueCount; i++) {
			pointPosition = scale.getPointPosition(i, largestPossibleRadius);
			textSize = measureLabelSize(scale.ctx, plFont.size, scale.pointLabels[i] || '');
			scale._pointLabelSizes[i] = textSize;

			// Add quarter circle to make degree 0 mean top of circle
			var angleRadians = scale.getIndexAngle(i);
			var angle = helpers.toDegrees(angleRadians) % 360;
			var hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
			var vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);

			if (hLimits.start < furthestLimits.l) {
				furthestLimits.l = hLimits.start;
				furthestAngles.l = angleRadians;
			}

			if (hLimits.end > furthestLimits.r) {
				furthestLimits.r = hLimits.end;
				furthestAngles.r = angleRadians;
			}

			if (vLimits.start < furthestLimits.t) {
				furthestLimits.t = vLimits.start;
				furthestAngles.t = angleRadians;
			}

			if (vLimits.end > furthestLimits.b) {
				furthestLimits.b = vLimits.end;
				furthestAngles.b = angleRadians;
			}
		}

		scale.setReductions(largestPossibleRadius, furthestLimits, furthestAngles);
	}

	/**
	 * Helper function to fit a radial linear scale with no point labels
	 */
	function fit(scale) {
		var largestPossibleRadius = Math.min(scale.height / 2, scale.width / 2);
		scale.drawingArea = Math.round(largestPossibleRadius);
		scale.setCenterPoint(0, 0, 0, 0);
	}

	function getTextAlignForAngle(angle) {
		if (angle === 0 || angle === 180) {
			return 'center';
		} else if (angle < 180) {
			return 'left';
		}

		return 'right';
	}

	function fillText(ctx, text, position, fontSize) {
		if (helpers.isArray(text)) {
			var y = position.y;
			var spacing = 1.5 * fontSize;

			for (var i = 0; i < text.length; ++i) {
				ctx.fillText(text[i], position.x, y);
				y+= spacing;
			}
		} else {
			ctx.fillText(text, position.x, position.y);
		}
	}

	function adjustPointPositionForLabelHeight(angle, textSize, position) {
		if (angle === 90 || angle === 270) {
			position.y -= (textSize.h / 2);
		} else if (angle > 270 || angle < 90) {
			position.y -= textSize.h;
		}
	}

	function drawPointLabels(scale) {
		var ctx = scale.ctx;
		var getValueOrDefault = helpers.getValueOrDefault;
		var opts = scale.options;
		var angleLineOpts = opts.angleLines;
		var pointLabelOpts = opts.pointLabels;

		ctx.lineWidth = angleLineOpts.lineWidth;
		ctx.strokeStyle = angleLineOpts.color;

		var outerDistance = scale.getDistanceFromCenterForValue(opts.reverse ? scale.min : scale.max);

		// Point Label Font
		var plFont = getPointLabelFontOptions(scale);

		ctx.textBaseline = 'top';

		for (var i = getValueCount(scale) - 1; i >= 0; i--) {
			if (angleLineOpts.display) {
				var outerPosition = scale.getPointPosition(i, outerDistance);
				ctx.beginPath();
				ctx.moveTo(scale.xCenter, scale.yCenter);
				ctx.lineTo(outerPosition.x, outerPosition.y);
				ctx.stroke();
				ctx.closePath();
			}
			// Extra 3px out for some label spacing
			var pointLabelPosition = scale.getPointPosition(i, outerDistance + 5);

			// Keep this in loop since we may support array properties here
			var pointLabelFontColor = getValueOrDefault(pointLabelOpts.fontColor, globalDefaults.defaultFontColor);
			ctx.font = plFont.font;
			ctx.fillStyle = pointLabelFontColor;

			var angleRadians = scale.getIndexAngle(i);
			var angle = helpers.toDegrees(angleRadians);
			ctx.textAlign = getTextAlignForAngle(angle);
			adjustPointPositionForLabelHeight(angle, scale._pointLabelSizes[i], pointLabelPosition);
			fillText(ctx, scale.pointLabels[i] || '', pointLabelPosition, plFont.size);
		}
	}

	function drawRadiusLine(scale, gridLineOpts, radius, index) {
		var ctx = scale.ctx;
		ctx.strokeStyle = helpers.getValueAtIndexOrDefault(gridLineOpts.color, index - 1);
		ctx.lineWidth = helpers.getValueAtIndexOrDefault(gridLineOpts.lineWidth, index - 1);

		if (scale.options.lineArc) {
			// Draw circular arcs between the points
			ctx.beginPath();
			ctx.arc(scale.xCenter, scale.yCenter, radius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.stroke();
		} else {
			// Draw straight lines connecting each index
			var valueCount = getValueCount(scale);

			if (valueCount === 0) {
				return;
			}

			ctx.beginPath();
			var pointPosition = scale.getPointPosition(0, radius);
			ctx.moveTo(pointPosition.x, pointPosition.y);

			for (var i = 1; i < valueCount; i++) {
				pointPosition = scale.getPointPosition(i, radius);
				ctx.lineTo(pointPosition.x, pointPosition.y);
			}

			ctx.closePath();
			ctx.stroke();
		}
	}

	function numberOrZero(param) {
		return helpers.isNumber(param) ? param : 0;
	}

	var LinearRadialScale = Chart.LinearScaleBase.extend({
		setDimensions: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;
			// Set the unconstrained dimension before label rotation
			me.width = me.maxWidth;
			me.height = me.maxHeight;
			me.xCenter = Math.round(me.width / 2);
			me.yCenter = Math.round(me.height / 2);

			var minSize = helpers.min([me.height, me.width]);
			var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
			me.drawingArea = opts.display ? (minSize / 2) - (tickFontSize / 2 + tickOpts.backdropPaddingY) : (minSize / 2);
		},
		determineDataLimits: function() {
			var me = this;
			var chart = me.chart;
			var min = Number.POSITIVE_INFINITY;
			var max = Number.NEGATIVE_INFINITY;

			helpers.each(chart.data.datasets, function(dataset, datasetIndex) {
				if (chart.isDatasetVisible(datasetIndex)) {
					var meta = chart.getDatasetMeta(datasetIndex);

					helpers.each(dataset.data, function(rawValue, index) {
						var value = +me.getRightValue(rawValue);
						if (isNaN(value) || meta.data[index].hidden) {
							return;
						}

						min = Math.min(value, min);
						max = Math.max(value, max);
					});
				}
			});

			me.min = (min === Number.POSITIVE_INFINITY ? 0 : min);
			me.max = (max === Number.NEGATIVE_INFINITY ? 0 : max);

			// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
			me.handleTickRangeOptions();
		},
		getTickLimit: function() {
			var tickOpts = this.options.ticks;
			var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
			return Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(this.drawingArea / (1.5 * tickFontSize)));
		},
		convertTicksToLabels: function() {
			var me = this;
			Chart.LinearScaleBase.prototype.convertTicksToLabels.call(me);

			// Point labels
			me.pointLabels = me.chart.data.labels.map(me.options.pointLabels.callback, me);
		},
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		fit: function() {
			if (this.options.lineArc) {
				fit(this);
			} else {
				fitWithPointLabels(this);
			}
		},
		/**
		 * Set radius reductions and determine new radius and center point
		 * @private
		 */
		setReductions: function(largestPossibleRadius, furthestLimits, furthestAngles) {
			var me = this;
			var radiusReductionLeft = furthestLimits.l / Math.sin(furthestAngles.l);
			var radiusReductionRight = Math.max(furthestLimits.r - me.width, 0) / Math.sin(furthestAngles.r);
			var radiusReductionTop = -furthestLimits.t / Math.cos(furthestAngles.t);
			var radiusReductionBottom = -Math.max(furthestLimits.b - me.height, 0) / Math.cos(furthestAngles.b);

			radiusReductionLeft = numberOrZero(radiusReductionLeft);
			radiusReductionRight = numberOrZero(radiusReductionRight);
			radiusReductionTop = numberOrZero(radiusReductionTop);
			radiusReductionBottom = numberOrZero(radiusReductionBottom);

			me.drawingArea = Math.min(
				Math.round(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2),
				Math.round(largestPossibleRadius - (radiusReductionTop + radiusReductionBottom) / 2));
			me.setCenterPoint(radiusReductionLeft, radiusReductionRight, radiusReductionTop, radiusReductionBottom);
		},
		setCenterPoint: function(leftMovement, rightMovement, topMovement, bottomMovement) {
			var me = this;
			var maxRight = me.width - rightMovement - me.drawingArea,
				maxLeft = leftMovement + me.drawingArea,
				maxTop = topMovement + me.drawingArea,
				maxBottom = me.height - bottomMovement - me.drawingArea;

			me.xCenter = Math.round(((maxLeft + maxRight) / 2) + me.left);
			me.yCenter = Math.round(((maxTop + maxBottom) / 2) + me.top);
		},

		getIndexAngle: function(index) {
			var angleMultiplier = (Math.PI * 2) / getValueCount(this);
			var startAngle = this.chart.options && this.chart.options.startAngle ?
				this.chart.options.startAngle :
				0;

			var startAngleRadians = startAngle * Math.PI * 2 / 360;

			// Start from the top instead of right, so remove a quarter of the circle
			return index * angleMultiplier + startAngleRadians;
		},
		getDistanceFromCenterForValue: function(value) {
			var me = this;

			if (value === null) {
				return 0; // null always in center
			}

			// Take into account half font size + the yPadding of the top value
			var scalingFactor = me.drawingArea / (me.max - me.min);
			if (me.options.reverse) {
				return (me.max - value) * scalingFactor;
			}
			return (value - me.min) * scalingFactor;
		},
		getPointPosition: function(index, distanceFromCenter) {
			var me = this;
			var thisAngle = me.getIndexAngle(index) - (Math.PI / 2);
			return {
				x: Math.round(Math.cos(thisAngle) * distanceFromCenter) + me.xCenter,
				y: Math.round(Math.sin(thisAngle) * distanceFromCenter) + me.yCenter
			};
		},
		getPointPositionForValue: function(index, value) {
			return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
		},

		getBasePosition: function() {
			var me = this;
			var min = me.min;
			var max = me.max;

			return me.getPointPositionForValue(0,
				me.beginAtZero? 0:
				min < 0 && max < 0? max :
				min > 0 && max > 0? min :
				0);
		},

		draw: function() {
			var me = this;
			var opts = me.options;
			var gridLineOpts = opts.gridLines;
			var tickOpts = opts.ticks;
			var getValueOrDefault = helpers.getValueOrDefault;

			if (opts.display) {
				var ctx = me.ctx;

				// Tick Font
				var tickFontSize = getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
				var tickFontStyle = getValueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
				var tickFontFamily = getValueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
				var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

				helpers.each(me.ticks, function(label, index) {
					// Don't draw a centre value (if it is minimum)
					if (index > 0 || opts.reverse) {
						var yCenterOffset = me.getDistanceFromCenterForValue(me.ticksAsNumbers[index]);
						var yHeight = me.yCenter - yCenterOffset;

						// Draw circular lines around the scale
						if (gridLineOpts.display && index !== 0) {
							drawRadiusLine(me, gridLineOpts, yCenterOffset, index);
						}

						if (tickOpts.display) {
							var tickFontColor = getValueOrDefault(tickOpts.fontColor, globalDefaults.defaultFontColor);
							ctx.font = tickLabelFont;

							if (tickOpts.showLabelBackdrop) {
								var labelWidth = ctx.measureText(label).width;
								ctx.fillStyle = tickOpts.backdropColor;
								ctx.fillRect(
									me.xCenter - labelWidth / 2 - tickOpts.backdropPaddingX,
									yHeight - tickFontSize / 2 - tickOpts.backdropPaddingY,
									labelWidth + tickOpts.backdropPaddingX * 2,
									tickFontSize + tickOpts.backdropPaddingY * 2
								);
							}

							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillStyle = tickFontColor;
							ctx.fillText(label, me.xCenter, yHeight);
						}
					}
				});

				if (!opts.lineArc) {
					drawPointLabels(me);
				}
			}
		}
	});
	Chart.scaleService.registerScaleType('radialLinear', LinearRadialScale, defaultConfig);

};

},{}],48:[function(require,module,exports){
/* global window: false */
'use strict';

var moment = require(1);
moment = typeof(moment) === 'function' ? moment : window.moment;

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var time = {
		units: [{
			name: 'millisecond',
			steps: [1, 2, 5, 10, 20, 50, 100, 250, 500]
		}, {
			name: 'second',
			steps: [1, 2, 5, 10, 30]
		}, {
			name: 'minute',
			steps: [1, 2, 5, 10, 30]
		}, {
			name: 'hour',
			steps: [1, 2, 3, 6, 12]
		}, {
			name: 'day',
			steps: [1, 2, 5]
		}, {
			name: 'week',
			maxStep: 4
		}, {
			name: 'month',
			maxStep: 3
		}, {
			name: 'quarter',
			maxStep: 4
		}, {
			name: 'year',
			maxStep: false
		}]
	};

	var defaultConfig = {
		position: 'bottom',

		time: {
			parser: false, // false == a pattern string from http://momentjs.com/docs/#/parsing/string-format/ or a custom callback that converts its argument to a moment
			format: false, // DEPRECATED false == date objects, moment object, callback or a pattern string from http://momentjs.com/docs/#/parsing/string-format/
			unit: false, // false == automatic or override with week, month, year, etc.
			round: false, // none, or override with week, month, year, etc.
			displayFormat: false, // DEPRECATED
			isoWeekday: false, // override week start day - see http://momentjs.com/docs/#/get-set/iso-weekday/
			minUnit: 'millisecond',

			// defaults to unit's corresponding unitFormat below or override using pattern string from http://momentjs.com/docs/#/displaying/format/
			displayFormats: {
				millisecond: 'h:mm:ss.SSS a', // 11:20:01.123 AM,
				second: 'h:mm:ss a', // 11:20:01 AM
				minute: 'h:mm:ss a', // 11:20:01 AM
				hour: 'MMM D, hA', // Sept 4, 5PM
				day: 'll', // Sep 4 2015
				week: 'll', // Week 46, or maybe "[W]WW - YYYY" ?
				month: 'MMM YYYY', // Sept 2015
				quarter: '[Q]Q - YYYY', // Q3
				year: 'YYYY' // 2015
			}
		},
		ticks: {
			autoSkip: false
		}
	};

	var TimeScale = Chart.Scale.extend({
		initialize: function() {
			if (!moment) {
				throw new Error('Chart.js - Moment.js could not be found! You must include it before Chart.js to use the time scale. Download at https://momentjs.com');
			}

			Chart.Scale.prototype.initialize.call(this);
		},
		getLabelMoment: function(datasetIndex, index) {
			if (datasetIndex === null || index === null) {
				return null;
			}

			if (typeof this.labelMoments[datasetIndex] !== 'undefined') {
				return this.labelMoments[datasetIndex][index];
			}

			return null;
		},
		getLabelDiff: function(datasetIndex, index) {
			var me = this;
			if (datasetIndex === null || index === null) {
				return null;
			}

			if (me.labelDiffs === undefined) {
				me.buildLabelDiffs();
			}

			if (typeof me.labelDiffs[datasetIndex] !== 'undefined') {
				return me.labelDiffs[datasetIndex][index];
			}

			return null;
		},
		getMomentStartOf: function(tick) {
			var me = this;
			if (me.options.time.unit === 'week' && me.options.time.isoWeekday !== false) {
				return tick.clone().startOf('isoWeek').isoWeekday(me.options.time.isoWeekday);
			}
			return tick.clone().startOf(me.tickUnit);
		},
		determineDataLimits: function() {
			var me = this;
			me.labelMoments = [];

			// Only parse these once. If the dataset does not have data as x,y pairs, we will use
			// these
			var scaleLabelMoments = [];
			if (me.chart.data.labels && me.chart.data.labels.length > 0) {
				helpers.each(me.chart.data.labels, function(label) {
					var labelMoment = me.parseTime(label);

					if (labelMoment.isValid()) {
						if (me.options.time.round) {
							labelMoment.startOf(me.options.time.round);
						}
						scaleLabelMoments.push(labelMoment);
					}
				}, me);

				me.firstTick = moment.min.call(me, scaleLabelMoments);
				me.lastTick = moment.max.call(me, scaleLabelMoments);
			} else {
				me.firstTick = null;
				me.lastTick = null;
			}

			helpers.each(me.chart.data.datasets, function(dataset, datasetIndex) {
				var momentsForDataset = [];
				var datasetVisible = me.chart.isDatasetVisible(datasetIndex);

				if (typeof dataset.data[0] === 'object' && dataset.data[0] !== null) {
					helpers.each(dataset.data, function(value) {
						var labelMoment = me.parseTime(me.getRightValue(value));

						if (labelMoment.isValid()) {
							if (me.options.time.round) {
								labelMoment.startOf(me.options.time.round);
							}
							momentsForDataset.push(labelMoment);

							if (datasetVisible) {
								// May have gone outside the scale ranges, make sure we keep the first and last ticks updated
								me.firstTick = me.firstTick !== null ? moment.min(me.firstTick, labelMoment) : labelMoment;
								me.lastTick = me.lastTick !== null ? moment.max(me.lastTick, labelMoment) : labelMoment;
							}
						}
					}, me);
				} else {
					// We have no labels. Use the ones from the scale
					momentsForDataset = scaleLabelMoments;
				}

				me.labelMoments.push(momentsForDataset);
			}, me);

			// Set these after we've done all the data
			if (me.options.time.min) {
				me.firstTick = me.parseTime(me.options.time.min);
			}

			if (me.options.time.max) {
				me.lastTick = me.parseTime(me.options.time.max);
			}

			// We will modify these, so clone for later
			me.firstTick = (me.firstTick || moment()).clone();
			me.lastTick = (me.lastTick || moment()).clone();
		},
		buildLabelDiffs: function() {
			var me = this;
			me.labelDiffs = [];
			var scaleLabelDiffs = [];
			// Parse common labels once
			if (me.chart.data.labels && me.chart.data.labels.length > 0) {
				helpers.each(me.chart.data.labels, function(label) {
					var labelMoment = me.parseTime(label);

					if (labelMoment.isValid()) {
						if (me.options.time.round) {
							labelMoment.startOf(me.options.time.round);
						}
						scaleLabelDiffs.push(labelMoment.diff(me.firstTick, me.tickUnit, true));
					}
				}, me);
			}

			helpers.each(me.chart.data.datasets, function(dataset) {
				var diffsForDataset = [];

				if (typeof dataset.data[0] === 'object' && dataset.data[0] !== null) {
					helpers.each(dataset.data, function(value) {
						var labelMoment = me.parseTime(me.getRightValue(value));

						if (labelMoment.isValid()) {
							if (me.options.time.round) {
								labelMoment.startOf(me.options.time.round);
							}
							diffsForDataset.push(labelMoment.diff(me.firstTick, me.tickUnit, true));
						}
					}, me);
				} else {
					// We have no labels. Use common ones
					diffsForDataset = scaleLabelDiffs;
				}

				me.labelDiffs.push(diffsForDataset);
			}, me);
		},
		buildTicks: function() {
			var me = this;

			me.ctx.save();
			var tickFontSize = helpers.getValueOrDefault(me.options.ticks.fontSize, Chart.defaults.global.defaultFontSize);
			var tickFontStyle = helpers.getValueOrDefault(me.options.ticks.fontStyle, Chart.defaults.global.defaultFontStyle);
			var tickFontFamily = helpers.getValueOrDefault(me.options.ticks.fontFamily, Chart.defaults.global.defaultFontFamily);
			var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
			me.ctx.font = tickLabelFont;

			me.ticks = [];
			me.unitScale = 1; // How much we scale the unit by, ie 2 means 2x unit per step
			me.scaleSizeInUnits = 0; // How large the scale is in the base unit (seconds, minutes, etc)

			// Set unit override if applicable
			if (me.options.time.unit) {
				me.tickUnit = me.options.time.unit || 'day';
				me.displayFormat = me.options.time.displayFormats[me.tickUnit];
				me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
				me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, 1);
			} else {
				// Determine the smallest needed unit of the time
				var innerWidth = me.isHorizontal() ? me.width : me.height;

				// Crude approximation of what the label length might be
				var tempFirstLabel = me.tickFormatFunction(me.firstTick, 0, []);
				var tickLabelWidth = me.ctx.measureText(tempFirstLabel).width;
				var cosRotation = Math.cos(helpers.toRadians(me.options.ticks.maxRotation));
				var sinRotation = Math.sin(helpers.toRadians(me.options.ticks.maxRotation));
				tickLabelWidth = (tickLabelWidth * cosRotation) + (tickFontSize * sinRotation);
				var labelCapacity = innerWidth / (tickLabelWidth);

				// Start as small as possible
				me.tickUnit = me.options.time.minUnit;
				me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
				me.displayFormat = me.options.time.displayFormats[me.tickUnit];

				var unitDefinitionIndex = 0;
				var unitDefinition = time.units[unitDefinitionIndex];

				// While we aren't ideal and we don't have units left
				while (unitDefinitionIndex < time.units.length) {
					// Can we scale this unit. If `false` we can scale infinitely
					me.unitScale = 1;

					if (helpers.isArray(unitDefinition.steps) && Math.ceil(me.scaleSizeInUnits / labelCapacity) < helpers.max(unitDefinition.steps)) {
						// Use one of the predefined steps
						for (var idx = 0; idx < unitDefinition.steps.length; ++idx) {
							if (unitDefinition.steps[idx] >= Math.ceil(me.scaleSizeInUnits / labelCapacity)) {
								me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, unitDefinition.steps[idx]);
								break;
							}
						}

						break;
					} else if ((unitDefinition.maxStep === false) || (Math.ceil(me.scaleSizeInUnits / labelCapacity) < unitDefinition.maxStep)) {
						// We have a max step. Scale this unit
						me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, Math.ceil(me.scaleSizeInUnits / labelCapacity));
						break;
					} else {
						// Move to the next unit up
						++unitDefinitionIndex;
						unitDefinition = time.units[unitDefinitionIndex];

						me.tickUnit = unitDefinition.name;
						var leadingUnitBuffer = me.firstTick.diff(me.getMomentStartOf(me.firstTick), me.tickUnit, true);
						var trailingUnitBuffer = me.getMomentStartOf(me.lastTick.clone().add(1, me.tickUnit)).diff(me.lastTick, me.tickUnit, true);
						me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true) + leadingUnitBuffer + trailingUnitBuffer;
						me.displayFormat = me.options.time.displayFormats[unitDefinition.name];
					}
				}
			}

			var roundedStart;

			// Only round the first tick if we have no hard minimum
			if (!me.options.time.min) {
				me.firstTick = me.getMomentStartOf(me.firstTick);
				roundedStart = me.firstTick;
			} else {
				roundedStart = me.getMomentStartOf(me.firstTick);
			}

			// Only round the last tick if we have no hard maximum
			if (!me.options.time.max) {
				var roundedEnd = me.getMomentStartOf(me.lastTick);
				var delta = roundedEnd.diff(me.lastTick, me.tickUnit, true);
				if (delta < 0) {
					// Do not use end of because we need me to be in the next time unit
					me.lastTick = me.getMomentStartOf(me.lastTick.add(1, me.tickUnit));
				} else if (delta >= 0) {
					me.lastTick = roundedEnd;
				}

				me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
			}

			// Tick displayFormat override
			if (me.options.time.displayFormat) {
				me.displayFormat = me.options.time.displayFormat;
			}

			// first tick. will have been rounded correctly if options.time.min is not specified
			me.ticks.push(me.firstTick.clone());

			// For every unit in between the first and last moment, create a moment and add it to the ticks tick
			for (var i = me.unitScale; i <= me.scaleSizeInUnits; i += me.unitScale) {
				var newTick = roundedStart.clone().add(i, me.tickUnit);

				// Are we greater than the max time
				if (me.options.time.max && newTick.diff(me.lastTick, me.tickUnit, true) >= 0) {
					break;
				}

				me.ticks.push(newTick);
			}

			// Always show the right tick
			var diff = me.ticks[me.ticks.length - 1].diff(me.lastTick, me.tickUnit);
			if (diff !== 0 || me.scaleSizeInUnits === 0) {
				// this is a weird case. If the <max> option is the same as the end option, we can't just diff the times because the tick was created from the roundedStart
				// but the last tick was not rounded.
				if (me.options.time.max) {
					me.ticks.push(me.lastTick.clone());
					me.scaleSizeInUnits = me.lastTick.diff(me.ticks[0], me.tickUnit, true);
				} else {
					me.ticks.push(me.lastTick.clone());
					me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
				}
			}

			me.ctx.restore();

			// Invalidate label diffs cache
			me.labelDiffs = undefined;
		},
		// Get tooltip label
		getLabelForIndex: function(index, datasetIndex) {
			var me = this;
			var label = me.chart.data.labels && index < me.chart.data.labels.length ? me.chart.data.labels[index] : '';
			var value = me.chart.data.datasets[datasetIndex].data[index];

			if (value !== null && typeof value === 'object') {
				label = me.getRightValue(value);
			}

			// Format nicely
			if (me.options.time.tooltipFormat) {
				label = me.parseTime(label).format(me.options.time.tooltipFormat);
			}

			return label;
		},
		// Function to format an individual tick mark
		tickFormatFunction: function(tick, index, ticks) {
			var formattedTick = tick.format(this.displayFormat);
			var tickOpts = this.options.ticks;
			var callback = helpers.getValueOrDefault(tickOpts.callback, tickOpts.userCallback);

			if (callback) {
				return callback(formattedTick, index, ticks);
			}
			return formattedTick;
		},
		convertTicksToLabels: function() {
			var me = this;
			me.tickMoments = me.ticks;
			me.ticks = me.ticks.map(me.tickFormatFunction, me);
		},
		getPixelForValue: function(value, index, datasetIndex) {
			var me = this;
			var offset = null;
			if (index !== undefined && datasetIndex !== undefined) {
				offset = me.getLabelDiff(datasetIndex, index);
			}

			if (offset === null) {
				if (!value || !value.isValid) {
					// not already a moment object
					value = me.parseTime(me.getRightValue(value));
				}
				if (value && value.isValid && value.isValid()) {
					offset = value.diff(me.firstTick, me.tickUnit, true);
				}
			}

			if (offset !== null) {
				var decimal = offset !== 0 ? offset / me.scaleSizeInUnits : offset;

				if (me.isHorizontal()) {
					var valueOffset = (me.width * decimal);
					return me.left + Math.round(valueOffset);
				}

				var heightOffset = (me.height * decimal);
				return me.top + Math.round(heightOffset);
			}
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.tickMoments[index], null, null);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var innerDimension = me.isHorizontal() ? me.width : me.height;
			var offset = (pixel - (me.isHorizontal() ? me.left : me.top)) / innerDimension;
			offset *= me.scaleSizeInUnits;
			return me.firstTick.clone().add(moment.duration(offset, me.tickUnit).asSeconds(), 'seconds');
		},
		parseTime: function(label) {
			var me = this;
			if (typeof me.options.time.parser === 'string') {
				return moment(label, me.options.time.parser);
			}
			if (typeof me.options.time.parser === 'function') {
				return me.options.time.parser(label);
			}
			// Date objects
			if (typeof label.getMonth === 'function' || typeof label === 'number') {
				return moment(label);
			}
			// Moment support
			if (label.isValid && label.isValid()) {
				return label;
			}
			// Custom parsing (return an instance of moment)
			if (typeof me.options.time.format !== 'string' && me.options.time.format.call) {
				console.warn('options.time.format is deprecated and replaced by options.time.parser. See http://nnnick.github.io/Chart.js/docs-v2/#scales-time-scale');
				return me.options.time.format(label);
			}
			// Moment format parsing
			return moment(label, me.options.time.format);
		}
	});
	Chart.scaleService.registerScaleType('time', TimeScale, defaultConfig);

};

},{"1":1}]},{},[7])(7)
});
;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&la(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==oa?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ma.length;){if(c=ma[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return ua++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:xa?M:ya?P:wa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ea&&d-e===0,g=b&(Ga|Ha)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=ra(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=qa(j.x)>qa(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Ea&&f.eventType!==Ga||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Ha&&(i>Da||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=qa(l.x)>qa(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:pa(a.pointers[c].clientX),clientY:pa(a.pointers[c].clientY)},c++;return{timeStamp:ra(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:pa(a[0].clientX),y:pa(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:pa(c/b),y:pa(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ia:qa(a)>=qa(b)?0>a?Ja:Ka:0>b?La:Ma}function H(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ra)+I(a[1],a[0],Ra)}function K(a,b){return H(b[0],b[1],Ra)/H(a[0],a[1],Ra)}function L(){this.evEl=Ta,this.evWin=Ua,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Xa,this.evWin=Ya,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=$a,this.evWin=_a,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ga|Ha)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=bb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ea|Fa)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ea)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ga|Ha)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function S(a,b){a&Ea?(this.primaryTouch=b.changedPointers[0].identifier,T.call(this,b)):a&(Ga|Ha)&&T.call(this,b)}function T(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,cb)}}function U(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(db>=f&&db>=g)return!0}return!1}function V(a,b){this.manager=a,this.set(b)}function W(a){if(p(a,jb))return jb;var b=p(a,kb),c=p(a,lb);return b&&c?jb:b||c?b?kb:lb:p(a,ib)?ib:hb}function X(){if(!fb)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=c?a.CSS.supports("touch-action",d):!0}),b}function Y(a){this.options=la({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=nb,this.simultaneous={},this.requireFail=[]}function Z(a){return a&sb?"cancel":a&qb?"end":a&pb?"move":a&ob?"start":""}function $(a){return a==Ma?"down":a==La?"up":a==Ja?"left":a==Ka?"right":""}function _(a,b){var c=b.manager;return c?c.get(a):a}function aa(){Y.apply(this,arguments)}function ba(){aa.apply(this,arguments),this.pX=null,this.pY=null}function ca(){aa.apply(this,arguments)}function da(){Y.apply(this,arguments),this._timer=null,this._input=null}function ea(){aa.apply(this,arguments)}function fa(){aa.apply(this,arguments)}function ga(){Y.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function ha(a,b){return b=b||{},b.recognizers=l(b.recognizers,ha.defaults.preset),new ia(a,b)}function ia(a,b){this.options=la({},ha.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=y(this),this.touchAction=new V(this,this.options.touchAction),ja(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ja(a,b){var c=a.element;if(c.style){var d;g(a.options.cssProps,function(e,f){d=u(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function ka(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var la,ma=["","webkit","Moz","MS","ms","o"],na=b.createElement("div"),oa="function",pa=Math.round,qa=Math.abs,ra=Date.now;la="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var sa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),ta=h(function(a,b){return sa(a,b,!0)},"merge","Use `assign`."),ua=1,va=/mobile|tablet|ip(ad|hone|od)|android/i,wa="ontouchstart"in a,xa=u(a,"PointerEvent")!==d,ya=wa&&va.test(navigator.userAgent),za="touch",Aa="pen",Ba="mouse",Ca="kinect",Da=25,Ea=1,Fa=2,Ga=4,Ha=8,Ia=1,Ja=2,Ka=4,La=8,Ma=16,Na=Ja|Ka,Oa=La|Ma,Pa=Na|Oa,Qa=["x","y"],Ra=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Sa={mousedown:Ea,mousemove:Fa,mouseup:Ga},Ta="mousedown",Ua="mousemove mouseup";i(L,x,{handler:function(a){var b=Sa[a.type];b&Ea&&0===a.button&&(this.pressed=!0),b&Fa&&1!==a.which&&(b=Ga),this.pressed&&(b&Ga&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:Ba,srcEvent:a}))}});var Va={pointerdown:Ea,pointermove:Fa,pointerup:Ga,pointercancel:Ha,pointerout:Ha},Wa={2:za,3:Aa,4:Ba,5:Ca},Xa="pointerdown",Ya="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Xa="MSPointerDown",Ya="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Va[d],f=Wa[a.pointerType]||a.pointerType,g=f==za,h=r(b,a.pointerId,"pointerId");e&Ea&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ga|Ha)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Za={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},$a="touchstart",_a="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Za[a.type];if(b===Ea&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ga|Ha)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}}});var ab={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},bb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=ab[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}});var cb=2500,db=25;i(R,x,{handler:function(a,b,c){var d=c.pointerType==za,e=c.pointerType==Ba;if(!(e&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)S.call(this,b,c);else if(e&&U.call(this,c))return;this.callback(a,b,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var eb=u(na.style,"touchAction"),fb=eb!==d,gb="compute",hb="auto",ib="manipulation",jb="none",kb="pan-x",lb="pan-y",mb=X();V.prototype={set:function(a){a==gb&&(a=this.compute()),fb&&this.manager.element.style&&mb[a]&&(this.manager.element.style[eb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),W(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,jb)&&!mb[jb],f=p(d,lb)&&!mb[lb],g=p(d,kb)&&!mb[kb];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Na||g&&c&Oa?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var nb=1,ob=2,pb=4,qb=8,rb=qb,sb=16,tb=32;Y.prototype={defaults:{},set:function(a){return la(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=_(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=_(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=_(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;qb>d&&b(c.options.event+Z(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=qb&&b(c.options.event+Z(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=tb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(tb|nb)))return!1;a++}return!0},recognize:function(a){var b=la({},a);return k(this.options.enable,[this,b])?(this.state&(rb|sb|tb)&&(this.state=nb),this.state=this.process(b),void(this.state&(ob|pb|qb|sb)&&this.tryEmit(b))):(this.reset(),void(this.state=tb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(aa,Y,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(ob|pb),e=this.attrTest(a);return d&&(c&Ha||!e)?b|sb:d||e?c&Ga?b|qb:b&ob?b|pb:ob:tb}}),i(ba,aa,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pa},getTouchAction:function(){var a=this.options.direction,b=[];return a&Na&&b.push(lb),a&Oa&&b.push(kb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Na?(e=0===f?Ia:0>f?Ja:Ka,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ia:0>g?La:Ma,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return aa.prototype.attrTest.call(this,a)&&(this.state&ob||!(this.state&ob)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i(ca,aa,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&ob)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(da,Y,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[hb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ga|Ha)&&!f)this.reset();else if(a.eventType&Ea)this.reset(),this._timer=e(function(){this.state=rb,this.tryEmit()},b.time,this);else if(a.eventType&Ga)return rb;return tb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===rb&&(a&&a.eventType&Ga?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=ra(),this.manager.emit(this.options.event,this._input)))}}),i(ea,aa,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&ob)}}),i(fa,aa,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Na|Oa,pointers:1},getTouchAction:function(){return ba.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Na|Oa)?b=a.overallVelocity:c&Na?b=a.overallVelocityX:c&Oa&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&qa(b)>this.options.velocity&&a.eventType&Ga},emit:function(a){var b=$(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ga,Y,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ib]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ea&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ga)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=rb,this.tryEmit()},b.interval,this),ob):rb}return tb},failTimeout:function(){return this._timer=e(function(){this.state=tb},this.options.interval,this),tb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==rb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),ha.VERSION="2.0.7",ha.defaults={domEvents:!1,touchAction:gb,enable:!0,inputTarget:null,inputClass:null,preset:[[ea,{enable:!1}],[ca,{enable:!1},["rotate"]],[fa,{direction:Na}],[ba,{direction:Na},["swipe"]],[ga],[ga,{event:"doubletap",taps:2},["tap"]],[da]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ub=1,vb=2;ia.prototype={set:function(a){return la(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?vb:ub},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&rb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===vb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(ob|pb|qb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Y)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&ka(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ja(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},la(ha,{INPUT_START:Ea,INPUT_MOVE:Fa,INPUT_END:Ga,INPUT_CANCEL:Ha,STATE_POSSIBLE:nb,STATE_BEGAN:ob,STATE_CHANGED:pb,STATE_ENDED:qb,STATE_RECOGNIZED:rb,STATE_CANCELLED:sb,STATE_FAILED:tb,DIRECTION_NONE:Ia,DIRECTION_LEFT:Ja,DIRECTION_RIGHT:Ka,DIRECTION_UP:La,DIRECTION_DOWN:Ma,DIRECTION_HORIZONTAL:Na,DIRECTION_VERTICAL:Oa,DIRECTION_ALL:Pa,Manager:ia,Input:x,TouchAction:V,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:Y,AttrRecognizer:aa,Tap:ga,Pan:ba,Swipe:fa,Pinch:ca,Rotate:ea,Press:da,on:m,off:n,each:g,merge:ta,extend:sa,assign:la,inherit:i,bindFn:j,prefixed:u});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=ha,"function"==typeof define&&define.amd?define(function(){return ha}):"undefined"!=typeof module&&module.exports?module.exports=ha:a[c]=ha}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.js.map
;/*!
 * Bootstrap v4.0.0 (https://getbootstrap.com)
 * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ?
        e(exports, require("jquery"), require("popper.js")) :
        "function" == typeof define && define.amd ?
            define(["exports", "jquery", "popper.js"], e) :
            e((t.bootstrap = {}), t.jQuery, t.Popper);
})(this, function (t, e, n) {
    "use strict";

    function i(t, e) {
        for (var n = 0; n < e.length; n++) {
            var i = e[n];
            (i.enumerable = i.enumerable || !1),
                (i.configurable = !0),
                "value" in i && (i.writable = !0),
                Object.defineProperty(t, i.key, i);
        }
    }

    function s(t, e, n) {
        return e && i(t.prototype, e), n && i(t, n), t;
    }

    function r() {
        return (r =
            Object.assign ||
            function (t) {
                for (var e = 1; e < arguments.length; e++) {
                    var n = arguments[e];
                    for (var i in n)
                        Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
                }
                return t;
            }).apply(this, arguments);
    }
    (e = e && e.hasOwnProperty("default") ? e.default : e),
        (n = n && n.hasOwnProperty("default") ? n.default : n);
    var o,
        a,
        l,
        h,
        c,
        u,
        f,
        d,
        _,
        g,
        p,
        m,
        v,
        E,
        T,
        y,
        C,
        I,
        A,
        b,
        D,
        S,
        w,
        N,
        O,
        k,
        P = (function (t) {
            var e = !1;

            function n(e) {
                var n = this,
                    s = !1;
                return (
                    t(this).one(i.TRANSITION_END, function () {
                        s = !0;
                    }),
                    setTimeout(function () {
                        s || i.triggerTransitionEnd(n);
                    }, e),
                    this
                );
            }
            var i = {
                TRANSITION_END: "bsTransitionEnd",
                getUID: function (t) {
                    do {
                        t += ~~(1e6 * Math.random());
                    } while (document.getElementById(t));
                    return t;
                },
                getSelectorFromElement: function (e) {
                    var n,
                        i = e.getAttribute("data-target");
                    (i && "#" !== i) || (i = e.getAttribute("href") || ""),
                        "#" === i.charAt(0) &&
                        ((n = i),
                            (i = n =
                                "function" == typeof t.escapeSelector ?
                                    t.escapeSelector(n).substr(1) :
                                    n.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1")));
                    try {
                        return t(document).find(i).length > 0 ? i : null;
                    } catch (t) {
                        return null;
                    }
                },
                reflow: function (t) {
                    return t.offsetHeight;
                },
                triggerTransitionEnd: function (n) {
                    t(n).trigger(e.end);
                },
                supportsTransitionEnd: function () {
                    return Boolean(e);
                },
                isElement: function (t) {
                    return (t[0] || t).nodeType;
                },
                typeCheckConfig: function (t, e, n) {
                    for (var s in n)
                        if (Object.prototype.hasOwnProperty.call(n, s)) {
                            var r = n[s],
                                o = e[s],
                                a =
                                    o && i.isElement(o) ?
                                        "element" :
                                        ((l = o), {}.toString
                                            .call(l)
                                            .match(/\s([a-zA-Z]+)/)[1]
                                            .toLowerCase());
                            if (!new RegExp(r).test(a))
                                throw new Error(
                                    t.toUpperCase() +
                                    ': Option "' +
                                    s +
                                    '" provided type "' +
                                    a +
                                    '" but expected type "' +
                                    r +
                                    '".'
                                );
                        }
                    var l;
                },
            };
            return (
                (e = ("undefined" == typeof window || !window.QUnit) && {
                    end: "transitionend",
                }),
                (t.fn.emulateTransitionEnd = n),
                i.supportsTransitionEnd() &&
                (t.event.special[i.TRANSITION_END] = {
                    bindType: e.end,
                    delegateType: e.end,
                    handle: function (e) {
                        if (t(e.target).is(this))
                            return e.handleObj.handler.apply(this, arguments);
                    },
                }),
                i
            );
        })(e),
        L =
            ((a = "alert"),
                (h = "." + (l = "bs.alert")),
                (c = (o = e).fn[a]),
                (u = {
                    CLOSE: "close" + h,
                    CLOSED: "closed" + h,
                    CLICK_DATA_API: "click" + h + ".data-api",
                }),
                (f = "alert"),
                (d = "fade"),
                (_ = "show"),
                (g = (function () {
                    function t(t) {
                        this._element = t;
                    }
                    var e = t.prototype;
                    return (
                        (e.close = function (t) {
                            t = t || this._element;
                            var e = this._getRootElement(t);
                            this._triggerCloseEvent(e).isDefaultPrevented() ||
                                this._removeElement(e);
                        }),
                        (e.dispose = function () {
                            o.removeData(this._element, l), (this._element = null);
                        }),
                        (e._getRootElement = function (t) {
                            var e = P.getSelectorFromElement(t),
                                n = !1;
                            return e && (n = o(e)[0]), n || (n = o(t).closest("." + f)[0]), n;
                        }),
                        (e._triggerCloseEvent = function (t) {
                            var e = o.Event(u.CLOSE);
                            return o(t).trigger(e), e;
                        }),
                        (e._removeElement = function (t) {
                            var e = this;
                            o(t).removeClass(_),
                                P.supportsTransitionEnd() && o(t).hasClass(d) ?
                                    o(t)
                                        .one(P.TRANSITION_END, function (n) {
                                            return e._destroyElement(t, n);
                                        })
                                        .emulateTransitionEnd(150) :
                                    this._destroyElement(t);
                        }),
                        (e._destroyElement = function (t) {
                            o(t).detach().trigger(u.CLOSED).remove();
                        }),
                        (t._jQueryInterface = function (e) {
                            return this.each(function () {
                                var n = o(this),
                                    i = n.data(l);
                                i || ((i = new t(this)), n.data(l, i)),
                                    "close" === e && i[e](this);
                            });
                        }),
                        (t._handleDismiss = function (t) {
                            return function (e) {
                                e && e.preventDefault(), t.close(this);
                            };
                        }),
                        s(t, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },]),
                        t
                    );
                })()),
                o(document).on(
                    u.CLICK_DATA_API,
                    '[data-dismiss="alert"]',
                    g._handleDismiss(new g())
                ),
                (o.fn[a] = g._jQueryInterface),
                (o.fn[a].Constructor = g),
                (o.fn[a].noConflict = function () {
                    return (o.fn[a] = c), g._jQueryInterface;
                }),
                g),
        R =
            ((m = "button"),
                (E = "." + (v = "bs.button")),
                (T = ".data-api"),
                (y = (p = e).fn[m]),
                (C = "active"),
                (I = "btn"),
                (A = "focus"),
                (b = '[data-toggle^="button"]'),
                (D = '[data-toggle="buttons"]'),
                (S = "input"),
                (w = ".active"),
                (N = ".btn"),
                (O = {
                    CLICK_DATA_API: "click" + E + T,
                    FOCUS_BLUR_DATA_API: "focus" + E + T + " blur" + E + T,
                }),
                (k = (function () {
                    function t(t) {
                        this._element = t;
                    }
                    var e = t.prototype;
                    return (
                        (e.toggle = function () {
                            var t = !0,
                                e = !0,
                                n = p(this._element).closest(D)[0];
                            if (n) {
                                var i = p(this._element).find(S)[0];
                                if (i) {
                                    if ("radio" === i.type)
                                        if (i.checked && p(this._element).hasClass(C)) t = !1;
                                        else {
                                            var s = p(n).find(w)[0];
                                            s && p(s).removeClass(C);
                                        }
                                    if (t) {
                                        if (
                                            i.hasAttribute("disabled") ||
                                            n.hasAttribute("disabled") ||
                                            i.classList.contains("disabled") ||
                                            n.classList.contains("disabled")
                                        )
                                            return;
                                        (i.checked = !p(this._element).hasClass(C)),
                                            p(i).trigger("change");
                                    }
                                    i.focus(), (e = !1);
                                }
                            }
                            e &&
                                this._element.setAttribute(
                                    "aria-pressed", !p(this._element).hasClass(C)
                                ),
                                t && p(this._element).toggleClass(C);
                        }),
                        (e.dispose = function () {
                            p.removeData(this._element, v), (this._element = null);
                        }),
                        (t._jQueryInterface = function (e) {
                            return this.each(function () {
                                var n = p(this).data(v);
                                n || ((n = new t(this)), p(this).data(v, n)),
                                    "toggle" === e && n[e]();
                            });
                        }),
                        s(t, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },]),
                        t
                    );
                })()),
                p(document)
                    .on(O.CLICK_DATA_API, b, function (t) {
                        t.preventDefault();
                        var e = t.target;
                        p(e).hasClass(I) || (e = p(e).closest(N)),
                            k._jQueryInterface.call(p(e), "toggle");
                    })
                    .on(O.FOCUS_BLUR_DATA_API, b, function (t) {
                        var e = p(t.target).closest(N)[0];
                        p(e).toggleClass(A, /^focus(in)?$/.test(t.type));
                    }),
                (p.fn[m] = k._jQueryInterface),
                (p.fn[m].Constructor = k),
                (p.fn[m].noConflict = function () {
                    return (p.fn[m] = y), k._jQueryInterface;
                }),
                k),
        j = (function (t) {
            var e = "carousel",
                n = "bs.carousel",
                i = "." + n,
                o = t.fn[e],
                a = {
                    interval: 5e3,
                    keyboard: !0,
                    slide: !1,
                    pause: "hover",
                    wrap: !0,
                },
                l = {
                    interval: "(number|boolean)",
                    keyboard: "boolean",
                    slide: "(boolean|string)",
                    pause: "(string|boolean)",
                    wrap: "boolean",
                },
                h = "next",
                c = "prev",
                u = "left",
                f = "right",
                d = {
                    SLIDE: "slide" + i,
                    SLID: "slid" + i,
                    KEYDOWN: "keydown" + i,
                    MOUSEENTER: "mouseenter" + i,
                    MOUSELEAVE: "mouseleave" + i,
                    TOUCHEND: "touchend" + i,
                    LOAD_DATA_API: "load" + i + ".data-api",
                    CLICK_DATA_API: "click" + i + ".data-api",
                },
                _ = "carousel",
                g = "active",
                p = "slide",
                m = "carousel-item-right",
                v = "carousel-item-left",
                E = "carousel-item-next",
                T = "carousel-item-prev",
                y = {
                    ACTIVE: ".active",
                    ACTIVE_ITEM: ".active.carousel-item",
                    ITEM: ".carousel-item",
                    NEXT_PREV: ".carousel-item-next, .carousel-item-prev",
                    INDICATORS: ".carousel-indicators",
                    DATA_SLIDE: "[data-slide], [data-slide-to]",
                    DATA_RIDE: '[data-ride="carousel"]',
                },
                C = (function () {
                    function o(e, n) {
                        (this._items = null),
                            (this._interval = null),
                            (this._activeElement = null),
                            (this._isPaused = !1),
                            (this._isSliding = !1),
                            (this.touchTimeout = null),
                            (this._config = this._getConfig(n)),
                            (this._element = t(e)[0]),
                            (this._indicatorsElement = t(this._element).find(
                                y.INDICATORS
                            )[0]),
                            this._addEventListeners();
                    }
                    var C = o.prototype;
                    return (
                        (C.next = function () {
                            this._isSliding || this._slide(h);
                        }),
                        (C.nextWhenVisible = function () {
                            !document.hidden &&
                                t(this._element).is(":visible") &&
                                "hidden" !== t(this._element).css("visibility") &&
                                this.next();
                        }),
                        (C.prev = function () {
                            this._isSliding || this._slide(c);
                        }),
                        (C.pause = function (e) {
                            e || (this._isPaused = !0),
                                t(this._element).find(y.NEXT_PREV)[0] &&
                                P.supportsTransitionEnd() &&
                                (P.triggerTransitionEnd(this._element), this.cycle(!0)),
                                clearInterval(this._interval),
                                (this._interval = null);
                        }),
                        (C.cycle = function (t) {
                            t || (this._isPaused = !1),
                                this._interval &&
                                (clearInterval(this._interval), (this._interval = null)),
                                this._config.interval &&
                                !this._isPaused &&
                                (this._interval = setInterval(
                                    (document.visibilityState ?
                                        this.nextWhenVisible :
                                        this.next
                                    ).bind(this),
                                    this._config.interval
                                ));
                        }),
                        (C.to = function (e) {
                            var n = this;
                            this._activeElement = t(this._element).find(y.ACTIVE_ITEM)[0];
                            var i = this._getItemIndex(this._activeElement);
                            if (!(e > this._items.length - 1 || e < 0))
                                if (this._isSliding)
                                    t(this._element).one(d.SLID, function () {
                                        return n.to(e);
                                    });
                                else {
                                    if (i === e) return this.pause(), void this.cycle();
                                    var s = e > i ? h : c;
                                    this._slide(s, this._items[e]);
                                }
                        }),
                        (C.dispose = function () {
                            t(this._element).off(i),
                                t.removeData(this._element, n),
                                (this._items = null),
                                (this._config = null),
                                (this._element = null),
                                (this._interval = null),
                                (this._isPaused = null),
                                (this._isSliding = null),
                                (this._activeElement = null),
                                (this._indicatorsElement = null);
                        }),
                        (C._getConfig = function (t) {
                            return (t = r({}, a, t)), P.typeCheckConfig(e, t, l), t;
                        }),
                        (C._addEventListeners = function () {
                            var e = this;
                            this._config.keyboard &&
                                t(this._element).on(d.KEYDOWN, function (t) {
                                    return e._keydown(t);
                                }),
                                "hover" === this._config.pause &&
                                (t(this._element)
                                    .on(d.MOUSEENTER, function (t) {
                                        return e.pause(t);
                                    })
                                    .on(d.MOUSELEAVE, function (t) {
                                        return e.cycle(t);
                                    }),
                                    "ontouchstart" in document.documentElement &&
                                    t(this._element).on(d.TOUCHEND, function () {
                                        e.pause(),
                                            e.touchTimeout && clearTimeout(e.touchTimeout),
                                            (e.touchTimeout = setTimeout(function (t) {
                                                return e.cycle(t);
                                            }, 500 + e._config.interval));
                                    }));
                        }),
                        (C._keydown = function (t) {
                            if (!/input|textarea/i.test(t.target.tagName))
                                switch (t.which) {
                                    case 37:
                                        t.preventDefault(), this.prev();
                                        break;
                                    case 39:
                                        t.preventDefault(), this.next();
                                }
                        }),
                        (C._getItemIndex = function (e) {
                            return (
                                (this._items = t.makeArray(t(e).parent().find(y.ITEM))),
                                this._items.indexOf(e)
                            );
                        }),
                        (C._getItemByDirection = function (t, e) {
                            var n = t === h,
                                i = t === c,
                                s = this._getItemIndex(e),
                                r = this._items.length - 1;
                            if (((i && 0 === s) || (n && s === r)) && !this._config.wrap)
                                return e;
                            var o = (s + (t === c ? -1 : 1)) % this._items.length;
                            return -1 === o ?
                                this._items[this._items.length - 1] :
                                this._items[o];
                        }),
                        (C._triggerSlideEvent = function (e, n) {
                            var i = this._getItemIndex(e),
                                s = this._getItemIndex(t(this._element).find(y.ACTIVE_ITEM)[0]),
                                r = t.Event(d.SLIDE, {
                                    relatedTarget: e,
                                    direction: n,
                                    from: s,
                                    to: i,
                                });
                            return t(this._element).trigger(r), r;
                        }),
                        (C._setActiveIndicatorElement = function (e) {
                            if (this._indicatorsElement) {
                                t(this._indicatorsElement).find(y.ACTIVE).removeClass(g);
                                var n = this._indicatorsElement.children[this._getItemIndex(e)];
                                n && t(n).addClass(g);
                            }
                        }),
                        (C._slide = function (e, n) {
                            var i,
                                s,
                                r,
                                o = this,
                                a = t(this._element).find(y.ACTIVE_ITEM)[0],
                                l = this._getItemIndex(a),
                                c = n || (a && this._getItemByDirection(e, a)),
                                _ = this._getItemIndex(c),
                                C = Boolean(this._interval);
                            if (
                                (e === h ?
                                    ((i = v), (s = E), (r = u)) :
                                    ((i = m), (s = T), (r = f)),
                                    c && t(c).hasClass(g))
                            )
                                this._isSliding = !1;
                            else if (!this._triggerSlideEvent(c, r).isDefaultPrevented() &&
                                a &&
                                c
                            ) {
                                (this._isSliding = !0),
                                    C && this.pause(),
                                    this._setActiveIndicatorElement(c);
                                var I = t.Event(d.SLID, {
                                    relatedTarget: c,
                                    direction: r,
                                    from: l,
                                    to: _,
                                });
                                P.supportsTransitionEnd() && t(this._element).hasClass(p) ?
                                    (t(c).addClass(s),
                                        P.reflow(c),
                                        t(a).addClass(i),
                                        t(c).addClass(i),
                                        t(a)
                                            .one(P.TRANSITION_END, function () {
                                                t(c)
                                                    .removeClass(i + " " + s)
                                                    .addClass(g),
                                                    t(a).removeClass(g + " " + s + " " + i),
                                                    (o._isSliding = !1),
                                                    setTimeout(function () {
                                                        return t(o._element).trigger(I);
                                                    }, 0);
                                            })
                                            .emulateTransitionEnd(600)) :
                                    (t(a).removeClass(g),
                                        t(c).addClass(g),
                                        (this._isSliding = !1),
                                        t(this._element).trigger(I)),
                                    C && this.cycle();
                            }
                        }),
                        (o._jQueryInterface = function (e) {
                            return this.each(function () {
                                var i = t(this).data(n),
                                    s = r({}, a, t(this).data());
                                "object" == typeof e && (s = r({}, s, e));
                                var l = "string" == typeof e ? e : s.slide;
                                if (
                                    (i || ((i = new o(this, s)), t(this).data(n, i)),
                                        "number" == typeof e)
                                )
                                    i.to(e);
                                else if ("string" == typeof l) {
                                    if ("undefined" == typeof i[l])
                                        throw new TypeError('No method named "' + l + '"');
                                    i[l]();
                                } else s.interval && (i.pause(), i.cycle());
                            });
                        }),
                        (o._dataApiClickHandler = function (e) {
                            var i = P.getSelectorFromElement(this);
                            if (i) {
                                var s = t(i)[0];
                                if (s && t(s).hasClass(_)) {
                                    var a = r({}, t(s).data(), t(this).data()),
                                        l = this.getAttribute("data-slide-to");
                                    l && (a.interval = !1),
                                        o._jQueryInterface.call(t(s), a),
                                        l && t(s).data(n).to(l),
                                        e.preventDefault();
                                }
                            }
                        }),
                        s(o, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },
                        {
                            key: "Default",
                            get: function () {
                                return a;
                            },
                        },
                        ]),
                        o
                    );
                })();
            return (
                t(document).on(d.CLICK_DATA_API, y.DATA_SLIDE, C._dataApiClickHandler),
                t(window).on(d.LOAD_DATA_API, function () {
                    t(y.DATA_RIDE).each(function () {
                        var e = t(this);
                        C._jQueryInterface.call(e, e.data());
                    });
                }),
                (t.fn[e] = C._jQueryInterface),
                (t.fn[e].Constructor = C),
                (t.fn[e].noConflict = function () {
                    return (t.fn[e] = o), C._jQueryInterface;
                }),
                C
            );
        })(e),
        H = (function (t) {
            var e = "collapse",
                n = "bs.collapse",
                i = "." + n,
                o = t.fn[e],
                a = { toggle: !0, parent: "" },
                l = { toggle: "boolean", parent: "(string|element)" },
                h = {
                    SHOW: "show" + i,
                    SHOWN: "shown" + i,
                    HIDE: "hide" + i,
                    HIDDEN: "hidden" + i,
                    CLICK_DATA_API: "click" + i + ".data-api",
                },
                c = "show",
                u = "collapse",
                f = "collapsing",
                d = "collapsed",
                _ = "width",
                g = "height",
                p = {
                    ACTIVES: ".show, .collapsing",
                    DATA_TOGGLE: '[data-toggle="collapse"]',
                },
                m = (function () {
                    function i(e, n) {
                        (this._isTransitioning = !1),
                            (this._element = e),
                            (this._config = this._getConfig(n)),
                            (this._triggerArray = t.makeArray(
                                t(
                                    '[data-toggle="collapse"][href="#' +
                                    e.id +
                                    '"],[data-toggle="collapse"][data-target="#' +
                                    e.id +
                                    '"]'
                                )
                            ));
                        for (var i = t(p.DATA_TOGGLE), s = 0; s < i.length; s++) {
                            var r = i[s],
                                o = P.getSelectorFromElement(r);
                            null !== o &&
                                t(o).filter(e).length > 0 &&
                                ((this._selector = o), this._triggerArray.push(r));
                        }
                        (this._parent = this._config.parent ? this._getParent() : null),
                            this._config.parent ||
                            this._addAriaAndCollapsedClass(
                                this._element,
                                this._triggerArray
                            ),
                            this._config.toggle && this.toggle();
                    }
                    var o = i.prototype;
                    return (
                        (o.toggle = function () {
                            t(this._element).hasClass(c) ? this.hide() : this.show();
                        }),
                        (o.show = function () {
                            var e,
                                s,
                                r = this;
                            if (!this._isTransitioning &&
                                !t(this._element).hasClass(c) &&
                                (this._parent &&
                                    0 ===
                                    (e = t.makeArray(
                                        t(this._parent)
                                            .find(p.ACTIVES)
                                            .filter('[data-parent="' + this._config.parent + '"]')
                                    )).length &&
                                    (e = null), !(
                                        e &&
                                        (s = t(e).not(this._selector).data(n)) &&
                                        s._isTransitioning
                                    ))
                            ) {
                                var o = t.Event(h.SHOW);
                                if ((t(this._element).trigger(o), !o.isDefaultPrevented())) {
                                    e &&
                                        (i._jQueryInterface.call(t(e).not(this._selector), "hide"),
                                            s || t(e).data(n, null));
                                    var a = this._getDimension();
                                    t(this._element).removeClass(u).addClass(f),
                                        (this._element.style[a] = 0),
                                        this._triggerArray.length > 0 &&
                                        t(this._triggerArray)
                                            .removeClass(d)
                                            .attr("aria-expanded", !0),
                                        this.setTransitioning(!0);
                                    var l = function () {
                                        t(r._element).removeClass(f).addClass(u).addClass(c),
                                            (r._element.style[a] = ""),
                                            r.setTransitioning(!1),
                                            t(r._element).trigger(h.SHOWN);
                                    };
                                    if (P.supportsTransitionEnd()) {
                                        var _ = "scroll" + (a[0].toUpperCase() + a.slice(1));
                                        t(this._element)
                                            .one(P.TRANSITION_END, l)
                                            .emulateTransitionEnd(600),
                                            (this._element.style[a] = this._element[_] + "px");
                                    } else l();
                                }
                            }
                        }),
                        (o.hide = function () {
                            var e = this;
                            if (!this._isTransitioning && t(this._element).hasClass(c)) {
                                var n = t.Event(h.HIDE);
                                if ((t(this._element).trigger(n), !n.isDefaultPrevented())) {
                                    var i = this._getDimension();
                                    if (
                                        ((this._element.style[i] =
                                            this._element.getBoundingClientRect()[i] + "px"),
                                            P.reflow(this._element),
                                            t(this._element).addClass(f).removeClass(u).removeClass(c),
                                            this._triggerArray.length > 0)
                                    )
                                        for (var s = 0; s < this._triggerArray.length; s++) {
                                            var r = this._triggerArray[s],
                                                o = P.getSelectorFromElement(r);
                                            if (null !== o)
                                                t(o).hasClass(c) ||
                                                    t(r).addClass(d).attr("aria-expanded", !1);
                                        }
                                    this.setTransitioning(!0);
                                    var a = function () {
                                        e.setTransitioning(!1),
                                            t(e._element)
                                                .removeClass(f)
                                                .addClass(u)
                                                .trigger(h.HIDDEN);
                                    };
                                    (this._element.style[i] = ""),
                                        P.supportsTransitionEnd() ?
                                            t(this._element)
                                                .one(P.TRANSITION_END, a)
                                                .emulateTransitionEnd(600) :
                                            a();
                                }
                            }
                        }),
                        (o.setTransitioning = function (t) {
                            this._isTransitioning = t;
                        }),
                        (o.dispose = function () {
                            t.removeData(this._element, n),
                                (this._config = null),
                                (this._parent = null),
                                (this._element = null),
                                (this._triggerArray = null),
                                (this._isTransitioning = null);
                        }),
                        (o._getConfig = function (t) {
                            return (
                                ((t = r({}, a, t)).toggle = Boolean(t.toggle)),
                                P.typeCheckConfig(e, t, l),
                                t
                            );
                        }),
                        (o._getDimension = function () {
                            return t(this._element).hasClass(_) ? _ : g;
                        }),
                        (o._getParent = function () {
                            var e = this,
                                n = null;
                            P.isElement(this._config.parent) ?
                                ((n = this._config.parent),
                                    "undefined" != typeof this._config.parent.jquery &&
                                    (n = this._config.parent[0])) :
                                (n = t(this._config.parent)[0]);
                            var s =
                                '[data-toggle="collapse"][data-parent="' +
                                this._config.parent +
                                '"]';
                            return (
                                t(n)
                                    .find(s)
                                    .each(function (t, n) {
                                        e._addAriaAndCollapsedClass(i._getTargetFromElement(n), [
                                            n,
                                        ]);
                                    }),
                                n
                            );
                        }),
                        (o._addAriaAndCollapsedClass = function (e, n) {
                            if (e) {
                                var i = t(e).hasClass(c);
                                n.length > 0 &&
                                    t(n).toggleClass(d, !i).attr("aria-expanded", i);
                            }
                        }),
                        (i._getTargetFromElement = function (e) {
                            var n = P.getSelectorFromElement(e);
                            return n ? t(n)[0] : null;
                        }),
                        (i._jQueryInterface = function (e) {
                            return this.each(function () {
                                var s = t(this),
                                    o = s.data(n),
                                    l = r({}, a, s.data(), "object" == typeof e && e);
                                if (
                                    (!o && l.toggle && /show|hide/.test(e) && (l.toggle = !1),
                                        o || ((o = new i(this, l)), s.data(n, o)),
                                        "string" == typeof e)
                                ) {
                                    if ("undefined" == typeof o[e])
                                        throw new TypeError('No method named "' + e + '"');
                                    o[e]();
                                }
                            });
                        }),
                        s(i, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },
                        {
                            key: "Default",
                            get: function () {
                                return a;
                            },
                        },
                        ]),
                        i
                    );
                })();
            return (
                t(document).on(h.CLICK_DATA_API, p.DATA_TOGGLE, function (e) {
                    "A" === e.currentTarget.tagName && e.preventDefault();
                    var i = t(this),
                        s = P.getSelectorFromElement(this);
                    t(s).each(function () {
                        var e = t(this),
                            s = e.data(n) ? "toggle" : i.data();
                        m._jQueryInterface.call(e, s);
                    });
                }),
                (t.fn[e] = m._jQueryInterface),
                (t.fn[e].Constructor = m),
                (t.fn[e].noConflict = function () {
                    return (t.fn[e] = o), m._jQueryInterface;
                }),
                m
            );
        })(e),
        W = (function (t) {
            var e = "dropdown",
                i = "bs.dropdown",
                o = "." + i,
                a = ".data-api",
                l = t.fn[e],
                h = new RegExp("38|40|27"),
                c = {
                    HIDE: "hide" + o,
                    HIDDEN: "hidden" + o,
                    SHOW: "show" + o,
                    SHOWN: "shown" + o,
                    CLICK: "click" + o,
                    CLICK_DATA_API: "click" + o + a,
                    KEYDOWN_DATA_API: "keydown" + o + a,
                    KEYUP_DATA_API: "keyup" + o + a,
                },
                u = "disabled",
                f = "show",
                d = "dropup",
                _ = "dropright",
                g = "dropleft",
                p = "dropdown-menu-right",
                m = "dropdown-menu-left",
                v = "position-static",
                E = '[data-toggle="dropdown"]',
                T = ".dropdown form",
                y = ".dropdown-menu",
                C = ".navbar-nav",
                I = ".dropdown-menu .dropdown-item:not(.disabled)",
                A = "top-start",
                b = "top-end",
                D = "bottom-start",
                S = "bottom-end",
                w = "right-start",
                N = "left-start",
                O = { offset: 0, flip: !0, boundary: "scrollParent" },
                k = {
                    offset: "(number|string|function)",
                    flip: "boolean",
                    boundary: "(string|element)",
                },
                L = (function () {
                    function a(t, e) {
                        (this._element = t),
                            (this._popper = null),
                            (this._config = this._getConfig(e)),
                            (this._menu = this._getMenuElement()),
                            (this._inNavbar = this._detectNavbar()),
                            this._addEventListeners();
                    }
                    var l = a.prototype;
                    return (
                        (l.toggle = function () {
                            if (!this._element.disabled && !t(this._element).hasClass(u)) {
                                var e = a._getParentFromElement(this._element),
                                    i = t(this._menu).hasClass(f);
                                if ((a._clearMenus(), !i)) {
                                    var s = { relatedTarget: this._element },
                                        r = t.Event(c.SHOW, s);
                                    if ((t(e).trigger(r), !r.isDefaultPrevented())) {
                                        if (!this._inNavbar) {
                                            if ("undefined" == typeof n)
                                                throw new TypeError(
                                                    "Bootstrap dropdown require Popper.js (https://popper.js.org)"
                                                );
                                            var o = this._element;
                                            t(e).hasClass(d) &&
                                                (t(this._menu).hasClass(m) ||
                                                    t(this._menu).hasClass(p)) &&
                                                (o = e),
                                                "scrollParent" !== this._config.boundary &&
                                                t(e).addClass(v),
                                                (this._popper = new n(
                                                    o,
                                                    this._menu,
                                                    this._getPopperConfig()
                                                ));
                                        }
                                        "ontouchstart" in document.documentElement &&
                                            0 === t(e).closest(C).length &&
                                            t("body").children().on("mouseover", null, t.noop),
                                            this._element.focus(),
                                            this._element.setAttribute("aria-expanded", !0),
                                            t(this._menu).toggleClass(f),
                                            t(e).toggleClass(f).trigger(t.Event(c.SHOWN, s));
                                    }
                                }
                            }
                        }),
                        (l.dispose = function () {
                            t.removeData(this._element, i),
                                t(this._element).off(o),
                                (this._element = null),
                                (this._menu = null),
                                null !== this._popper &&
                                (this._popper.destroy(), (this._popper = null));
                        }),
                        (l.update = function () {
                            (this._inNavbar = this._detectNavbar()),
                                null !== this._popper && this._popper.scheduleUpdate();
                        }),
                        (l._addEventListeners = function () {
                            var e = this;
                            t(this._element).on(c.CLICK, function (t) {
                                t.preventDefault(), t.stopPropagation(), e.toggle();
                            });
                        }),
                        (l._getConfig = function (n) {
                            return (
                                (n = r({},
                                    this.constructor.Default,
                                    t(this._element).data(),
                                    n
                                )),
                                P.typeCheckConfig(e, n, this.constructor.DefaultType),
                                n
                            );
                        }),
                        (l._getMenuElement = function () {
                            if (!this._menu) {
                                var e = a._getParentFromElement(this._element);
                                this._menu = t(e).find(y)[0];
                            }
                            return this._menu;
                        }),
                        (l._getPlacement = function () {
                            var e = t(this._element).parent(),
                                n = D;
                            return (
                                e.hasClass(d) ?
                                    ((n = A), t(this._menu).hasClass(p) && (n = b)) :
                                    e.hasClass(_) ?
                                        (n = w) :
                                        e.hasClass(g) ?
                                            (n = N) :
                                            t(this._menu).hasClass(p) && (n = S),
                                n
                            );
                        }),
                        (l._detectNavbar = function () {
                            return t(this._element).closest(".navbar").length > 0;
                        }),
                        (l._getPopperConfig = function () {
                            var t = this,
                                e = {};
                            return (
                                "function" == typeof this._config.offset ?
                                    (e.fn = function (e) {
                                        return (
                                            (e.offsets = r({},
                                                e.offsets,
                                                t._config.offset(e.offsets) || {}
                                            )),
                                            e
                                        );
                                    }) :
                                    (e.offset = this._config.offset), {
                                    placement: this._getPlacement(),
                                    modifiers: {
                                        offset: e,
                                        flip: { enabled: this._config.flip },
                                        preventOverflow: {
                                            boundariesElement: this._config.boundary,
                                        },
                                    },
                                }
                            );
                        }),
                        (a._jQueryInterface = function (e) {
                            return this.each(function () {
                                var n = t(this).data(i);
                                if (
                                    (n ||
                                        ((n = new a(this, "object" == typeof e ? e : null)),
                                            t(this).data(i, n)),
                                        "string" == typeof e)
                                ) {
                                    if ("undefined" == typeof n[e])
                                        throw new TypeError('No method named "' + e + '"');
                                    n[e]();
                                }
                            });
                        }),
                        (a._clearMenus = function (e) {
                            if (!e ||
                                (3 !== e.which && ("keyup" !== e.type || 9 === e.which))
                            )
                                for (var n = t.makeArray(t(E)), s = 0; s < n.length; s++) {
                                    var r = a._getParentFromElement(n[s]),
                                        o = t(n[s]).data(i),
                                        l = { relatedTarget: n[s] };
                                    if (o) {
                                        var h = o._menu;
                                        if (
                                            t(r).hasClass(f) &&
                                            !(
                                                e &&
                                                (("click" === e.type &&
                                                    /input|textarea/i.test(e.target.tagName)) ||
                                                    ("keyup" === e.type && 9 === e.which)) &&
                                                t.contains(r, e.target)
                                            )
                                        ) {
                                            var u = t.Event(c.HIDE, l);
                                            t(r).trigger(u),
                                                u.isDefaultPrevented() ||
                                                ("ontouchstart" in document.documentElement &&
                                                    t("body").children().off("mouseover", null, t.noop),
                                                    n[s].setAttribute("aria-expanded", "false"),
                                                    t(h).removeClass(f),
                                                    t(r).removeClass(f).trigger(t.Event(c.HIDDEN, l)));
                                        }
                                    }
                                }
                        }),
                        (a._getParentFromElement = function (e) {
                            var n,
                                i = P.getSelectorFromElement(e);
                            return i && (n = t(i)[0]), n || e.parentNode;
                        }),
                        (a._dataApiKeydownHandler = function (e) {
                            if (
                                (/input|textarea/i.test(e.target.tagName) ?
                                    !(
                                        32 === e.which ||
                                        (27 !== e.which &&
                                            ((40 !== e.which && 38 !== e.which) ||
                                                t(e.target).closest(y).length))
                                    ) :
                                    h.test(e.which)) &&
                                (e.preventDefault(),
                                    e.stopPropagation(), !this.disabled && !t(this).hasClass(u))
                            ) {
                                var n = a._getParentFromElement(this),
                                    i = t(n).hasClass(f);
                                if (
                                    (i || (27 === e.which && 32 === e.which)) &&
                                    (!i || (27 !== e.which && 32 !== e.which))
                                ) {
                                    var s = t(n).find(I).get();
                                    if (0 !== s.length) {
                                        var r = s.indexOf(e.target);
                                        38 === e.which && r > 0 && r--,
                                            40 === e.which && r < s.length - 1 && r++,
                                            r < 0 && (r = 0),
                                            s[r].focus();
                                    }
                                } else {
                                    if (27 === e.which) {
                                        var o = t(n).find(E)[0];
                                        t(o).trigger("focus");
                                    }
                                    t(this).trigger("click");
                                }
                            }
                        }),
                        s(a, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },
                        {
                            key: "Default",
                            get: function () {
                                return O;
                            },
                        },
                        {
                            key: "DefaultType",
                            get: function () {
                                return k;
                            },
                        },
                        ]),
                        a
                    );
                })();
            return (
                t(document)
                    .on(c.KEYDOWN_DATA_API, E, L._dataApiKeydownHandler)
                    .on(c.KEYDOWN_DATA_API, y, L._dataApiKeydownHandler)
                    .on(c.CLICK_DATA_API + " " + c.KEYUP_DATA_API, L._clearMenus)
                    .on(c.CLICK_DATA_API, E, function (e) {
                        e.preventDefault(),
                            e.stopPropagation(),
                            L._jQueryInterface.call(t(this), "toggle");
                    })
                    .on(c.CLICK_DATA_API, T, function (t) {
                        t.stopPropagation();
                    }),
                (t.fn[e] = L._jQueryInterface),
                (t.fn[e].Constructor = L),
                (t.fn[e].noConflict = function () {
                    return (t.fn[e] = l), L._jQueryInterface;
                }),
                L
            );
        })(e),
        M = (function (t) {
            var e = "modal",
                n = "bs.modal",
                i = "." + n,
                o = t.fn.modal,
                a = { backdrop: !0, keyboard: !0, focus: !0, show: !0 },
                l = {
                    backdrop: "(boolean|string)",
                    keyboard: "boolean",
                    focus: "boolean",
                    show: "boolean",
                },
                h = {
                    HIDE: "hide" + i,
                    HIDDEN: "hidden" + i,
                    SHOW: "show" + i,
                    SHOWN: "shown" + i,
                    FOCUSIN: "focusin" + i,
                    RESIZE: "resize" + i,
                    CLICK_DISMISS: "click.dismiss" + i,
                    KEYDOWN_DISMISS: "keydown.dismiss" + i,
                    MOUSEUP_DISMISS: "mouseup.dismiss" + i,
                    MOUSEDOWN_DISMISS: "mousedown.dismiss" + i,
                    CLICK_DATA_API: "click" + i + ".data-api",
                },
                c = "modal-scrollbar-measure",
                u = "modal-backdrop",
                f = "modal-open",
                d = "fade",
                _ = "show",
                g = {
                    DIALOG: ".modal-dialog",
                    DATA_TOGGLE: '[data-toggle="modal"]',
                    DATA_DISMISS: '[data-dismiss="modal"]',
                    FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
                    STICKY_CONTENT: ".sticky-top",
                    NAVBAR_TOGGLER: ".navbar-toggler",
                },
                p = (function () {
                    function o(e, n) {
                        (this._config = this._getConfig(n)),
                            (this._element = e),
                            (this._dialog = t(e).find(g.DIALOG)[0]),
                            (this._backdrop = null),
                            (this._isShown = !1),
                            (this._isBodyOverflowing = !1),
                            (this._ignoreBackdropClick = !1),
                            (this._originalBodyPadding = 0),
                            (this._scrollbarWidth = 0);
                    }
                    var p = o.prototype;
                    return (
                        (p.toggle = function (t) {
                            return this._isShown ? this.hide() : this.show(t);
                        }),
                        (p.show = function (e) {
                            var n = this;
                            if (!this._isTransitioning && !this._isShown) {
                                P.supportsTransitionEnd() &&
                                    t(this._element).hasClass(d) &&
                                    (this._isTransitioning = !0);
                                var i = t.Event(h.SHOW, { relatedTarget: e });
                                t(this._element).trigger(i),
                                    this._isShown ||
                                    i.isDefaultPrevented() ||
                                    ((this._isShown = !0),
                                        this._checkScrollbar(),
                                        this._setScrollbar(),
                                        this._adjustDialog(),
                                        t(document.body).addClass(f),
                                        this._setEscapeEvent(),
                                        this._setResizeEvent(),
                                        t(this._element).on(
                                            h.CLICK_DISMISS,
                                            g.DATA_DISMISS,
                                            function (t) {
                                                return n.hide(t);
                                            }
                                        ),
                                        t(this._dialog).on(h.MOUSEDOWN_DISMISS, function () {
                                            t(n._element).one(h.MOUSEUP_DISMISS, function (e) {
                                                t(e.target).is(n._element) &&
                                                    (n._ignoreBackdropClick = !0);
                                            });
                                        }),
                                        this._showBackdrop(function () {
                                            return n._showElement(e);
                                        }));
                            }
                        }),
                        (p.hide = function (e) {
                            var n = this;
                            if (
                                (e && e.preventDefault(), !this._isTransitioning && this._isShown)
                            ) {
                                var i = t.Event(h.HIDE);
                                if (
                                    (t(this._element).trigger(i),
                                        this._isShown && !i.isDefaultPrevented())
                                ) {
                                    this._isShown = !1;
                                    var s =
                                        P.supportsTransitionEnd() && t(this._element).hasClass(d);
                                    s && (this._isTransitioning = !0),
                                        this._setEscapeEvent(),
                                        this._setResizeEvent(),
                                        t(document).off(h.FOCUSIN),
                                        t(this._element).removeClass(_),
                                        t(this._element).off(h.CLICK_DISMISS),
                                        t(this._dialog).off(h.MOUSEDOWN_DISMISS),
                                        s ?
                                            t(this._element)
                                                .one(P.TRANSITION_END, function (t) {
                                                    return n._hideModal(t);
                                                })
                                                .emulateTransitionEnd(300) :
                                            this._hideModal();
                                }
                            }
                        }),
                        (p.dispose = function () {
                            t.removeData(this._element, n),
                                t(window, document, this._element, this._backdrop).off(i),
                                (this._config = null),
                                (this._element = null),
                                (this._dialog = null),
                                (this._backdrop = null),
                                (this._isShown = null),
                                (this._isBodyOverflowing = null),
                                (this._ignoreBackdropClick = null),
                                (this._scrollbarWidth = null);
                        }),
                        (p.handleUpdate = function () {
                            this._adjustDialog();
                        }),
                        (p._getConfig = function (t) {
                            return (t = r({}, a, t)), P.typeCheckConfig(e, t, l), t;
                        }),
                        (p._showElement = function (e) {
                            var n = this,
                                i = P.supportsTransitionEnd() && t(this._element).hasClass(d);
                            (this._element.parentNode &&
                                this._element.parentNode.nodeType === Node.ELEMENT_NODE) ||
                                document.body.appendChild(this._element),
                                (this._element.style.display = "block"),
                                this._element.removeAttribute("aria-hidden"),
                                (this._element.scrollTop = 0),
                                i && P.reflow(this._element),
                                t(this._element).addClass(_),
                                this._config.focus && this._enforceFocus();
                            var s = t.Event(h.SHOWN, { relatedTarget: e }),
                                r = function () {
                                    n._config.focus && n._element.focus(),
                                        (n._isTransitioning = !1),
                                        t(n._element).trigger(s);
                                };
                            i
                                ?
                                t(this._dialog)
                                    .one(P.TRANSITION_END, r)
                                    .emulateTransitionEnd(300) :
                                r();
                        }),
                        (p._enforceFocus = function () {
                            var e = this;
                            t(document)
                                .off(h.FOCUSIN)
                                .on(h.FOCUSIN, function (n) {
                                    document !== n.target &&
                                        e._element !== n.target &&
                                        0 === t(e._element).has(n.target).length &&
                                        e._element.focus();
                                });
                        }),
                        (p._setEscapeEvent = function () {
                            var e = this;
                            this._isShown && this._config.keyboard ?
                                t(this._element).on(h.KEYDOWN_DISMISS, function (t) {
                                    27 === t.which && (t.preventDefault(), e.hide());
                                }) :
                                this._isShown || t(this._element).off(h.KEYDOWN_DISMISS);
                        }),
                        (p._setResizeEvent = function () {
                            var e = this;
                            this._isShown ?
                                t(window).on(h.RESIZE, function (t) {
                                    return e.handleUpdate(t);
                                }) :
                                t(window).off(h.RESIZE);
                        }),
                        (p._hideModal = function () {
                            var e = this;
                            (this._element.style.display = "none"),
                                this._element.setAttribute("aria-hidden", !0),
                                (this._isTransitioning = !1),
                                this._showBackdrop(function () {
                                    t(document.body).removeClass(f),
                                        e._resetAdjustments(),
                                        e._resetScrollbar(),
                                        t(e._element).trigger(h.HIDDEN);
                                });
                        }),
                        (p._removeBackdrop = function () {
                            this._backdrop &&
                                (t(this._backdrop).remove(), (this._backdrop = null));
                        }),
                        (p._showBackdrop = function (e) {
                            var n = this,
                                i = t(this._element).hasClass(d) ? d : "";
                            if (this._isShown && this._config.backdrop) {
                                var s = P.supportsTransitionEnd() && i;
                                if (
                                    ((this._backdrop = document.createElement("div")),
                                        (this._backdrop.className = u),
                                        i && t(this._backdrop).addClass(i),
                                        t(this._backdrop).appendTo(document.body),
                                        t(this._element).on(h.CLICK_DISMISS, function (t) {
                                            n._ignoreBackdropClick ?
                                                (n._ignoreBackdropClick = !1) :
                                                t.target === t.currentTarget &&
                                                ("static" === n._config.backdrop ?
                                                    n._element.focus() :
                                                    n.hide());
                                        }),
                                        s && P.reflow(this._backdrop),
                                        t(this._backdrop).addClass(_), !e)
                                )
                                    return;
                                if (!s) return void e();
                                t(this._backdrop)
                                    .one(P.TRANSITION_END, e)
                                    .emulateTransitionEnd(150);
                            } else if (!this._isShown && this._backdrop) {
                                t(this._backdrop).removeClass(_);
                                var r = function () {
                                    n._removeBackdrop(), e && e();
                                };
                                P.supportsTransitionEnd() && t(this._element).hasClass(d) ?
                                    t(this._backdrop)
                                        .one(P.TRANSITION_END, r)
                                        .emulateTransitionEnd(150) :
                                    r();
                            } else e && e();
                        }),
                        (p._adjustDialog = function () {
                            var t =
                                this._element.scrollHeight >
                                document.documentElement.clientHeight;
                            !this._isBodyOverflowing &&
                                t &&
                                (this._element.style.paddingLeft = this._scrollbarWidth + "px"),
                                this._isBodyOverflowing &&
                                !t &&
                                (this._element.style.paddingRight =
                                    this._scrollbarWidth + "px");
                        }),
                        (p._resetAdjustments = function () {
                            (this._element.style.paddingLeft = ""),
                                (this._element.style.paddingRight = "");
                        }),
                        (p._checkScrollbar = function () {
                            var t = document.body.getBoundingClientRect();
                            (this._isBodyOverflowing = t.left + t.right < window.innerWidth),
                                (this._scrollbarWidth = this._getScrollbarWidth());
                        }),
                        (p._setScrollbar = function () {
                            var e = this;
                            if (this._isBodyOverflowing) {
                                t(g.FIXED_CONTENT).each(function (n, i) {
                                    var s = t(i)[0].style.paddingRight,
                                        r = t(i).css("padding-right");
                                    t(i)
                                        .data("padding-right", s)
                                        .css(
                                            "padding-right",
                                            parseFloat(r) + e._scrollbarWidth + "px"
                                        );
                                }),
                                    t(g.STICKY_CONTENT).each(function (n, i) {
                                        var s = t(i)[0].style.marginRight,
                                            r = t(i).css("margin-right");
                                        t(i)
                                            .data("margin-right", s)
                                            .css(
                                                "margin-right",
                                                parseFloat(r) - e._scrollbarWidth + "px"
                                            );
                                    }),
                                    t(g.NAVBAR_TOGGLER).each(function (n, i) {
                                        var s = t(i)[0].style.marginRight,
                                            r = t(i).css("margin-right");
                                        t(i)
                                            .data("margin-right", s)
                                            .css(
                                                "margin-right",
                                                parseFloat(r) + e._scrollbarWidth + "px"
                                            );
                                    });
                                var n = document.body.style.paddingRight,
                                    i = t("body").css("padding-right");
                                t("body")
                                    .data("padding-right", n)
                                    .css(
                                        "padding-right",
                                        parseFloat(i) + this._scrollbarWidth + "px"
                                    );
                            }
                        }),
                        (p._resetScrollbar = function () {
                            t(g.FIXED_CONTENT).each(function (e, n) {
                                var i = t(n).data("padding-right");
                                "undefined" != typeof i &&
                                    t(n).css("padding-right", i).removeData("padding-right");
                            }),
                                t(g.STICKY_CONTENT + ", " + g.NAVBAR_TOGGLER).each(function (
                                    e,
                                    n
                                ) {
                                    var i = t(n).data("margin-right");
                                    "undefined" != typeof i &&
                                        t(n).css("margin-right", i).removeData("margin-right");
                                });
                            var e = t("body").data("padding-right");
                            "undefined" != typeof e &&
                                t("body").css("padding-right", e).removeData("padding-right");
                        }),
                        (p._getScrollbarWidth = function () {
                            var t = document.createElement("div");
                            (t.className = c), document.body.appendChild(t);
                            var e = t.getBoundingClientRect().width - t.clientWidth;
                            return document.body.removeChild(t), e;
                        }),
                        (o._jQueryInterface = function (e, i) {
                            return this.each(function () {
                                var s = t(this).data(n),
                                    a = r({},
                                        o.Default,
                                        t(this).data(),
                                        "object" == typeof e && e
                                    );
                                if (
                                    (s || ((s = new o(this, a)), t(this).data(n, s)),
                                        "string" == typeof e)
                                ) {
                                    if ("undefined" == typeof s[e])
                                        throw new TypeError('No method named "' + e + '"');
                                    s[e](i);
                                } else a.show && s.show(i);
                            });
                        }),
                        s(o, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },
                        {
                            key: "Default",
                            get: function () {
                                return a;
                            },
                        },
                        ]),
                        o
                    );
                })();
            return (
                t(document).on(h.CLICK_DATA_API, g.DATA_TOGGLE, function (e) {
                    var i,
                        s = this,
                        o = P.getSelectorFromElement(this);
                    o && (i = t(o)[0]);
                    var a = t(i).data(n) ? "toggle" : r({}, t(i).data(), t(this).data());
                    ("A" !== this.tagName && "AREA" !== this.tagName) ||
                        e.preventDefault();
                    var l = t(i).one(h.SHOW, function (e) {
                        e.isDefaultPrevented() ||
                            l.one(h.HIDDEN, function () {
                                t(s).is(":visible") && s.focus();
                            });
                    });
                    p._jQueryInterface.call(t(i), a, this);
                }),
                (t.fn.modal = p._jQueryInterface),
                (t.fn.modal.Constructor = p),
                (t.fn.modal.noConflict = function () {
                    return (t.fn.modal = o), p._jQueryInterface;
                }),
                p
            );
        })(e),
        U = (function (t) {
            var e = "tooltip",
                i = "bs.tooltip",
                o = "." + i,
                a = t.fn[e],
                l = new RegExp("(^|\\s)bs-tooltip\\S+", "g"),
                h = {
                    animation: "boolean",
                    template: "string",
                    title: "(string|element|function)",
                    trigger: "string",
                    delay: "(number|object)",
                    html: "boolean",
                    selector: "(string|boolean)",
                    placement: "(string|function)",
                    offset: "(number|string)",
                    container: "(string|element|boolean)",
                    fallbackPlacement: "(string|array)",
                    boundary: "(string|element)",
                },
                c = {
                    AUTO: "auto",
                    TOP: "top",
                    RIGHT: "right",
                    BOTTOM: "bottom",
                    LEFT: "left",
                },
                u = {
                    animation: !0,
                    template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    trigger: "hover focus",
                    title: "",
                    delay: 0,
                    html: !1,
                    selector: !1,
                    placement: "top",
                    offset: 0,
                    container: !1,
                    fallbackPlacement: "flip",
                    boundary: "scrollParent",
                },
                f = "show",
                d = "out",
                _ = {
                    HIDE: "hide" + o,
                    HIDDEN: "hidden" + o,
                    SHOW: "show" + o,
                    SHOWN: "shown" + o,
                    INSERTED: "inserted" + o,
                    CLICK: "click" + o,
                    FOCUSIN: "focusin" + o,
                    FOCUSOUT: "focusout" + o,
                    MOUSEENTER: "mouseenter" + o,
                    MOUSELEAVE: "mouseleave" + o,
                },
                g = "fade",
                p = "show",
                m = ".tooltip-inner",
                v = ".arrow",
                E = "hover",
                T = "focus",
                y = "click",
                C = "manual",
                I = (function () {
                    function a(t, e) {
                        if ("undefined" == typeof n)
                            throw new TypeError(
                                "Bootstrap tooltips require Popper.js (https://popper.js.org)"
                            );
                        (this._isEnabled = !0),
                            (this._timeout = 0),
                            (this._hoverState = ""),
                            (this._activeTrigger = {}),
                            (this._popper = null),
                            (this.element = t),
                            (this.config = this._getConfig(e)),
                            (this.tip = null),
                            this._setListeners();
                    }
                    var I = a.prototype;
                    return (
                        (I.enable = function () {
                            this._isEnabled = !0;
                        }),
                        (I.disable = function () {
                            this._isEnabled = !1;
                        }),
                        (I.toggleEnabled = function () {
                            this._isEnabled = !this._isEnabled;
                        }),
                        (I.toggle = function (e) {
                            if (this._isEnabled)
                                if (e) {
                                    var n = this.constructor.DATA_KEY,
                                        i = t(e.currentTarget).data(n);
                                    i ||
                                        ((i = new this.constructor(
                                            e.currentTarget,
                                            this._getDelegateConfig()
                                        )),
                                            t(e.currentTarget).data(n, i)),
                                        (i._activeTrigger.click = !i._activeTrigger.click),
                                        i._isWithActiveTrigger() ?
                                            i._enter(null, i) :
                                            i._leave(null, i);
                                } else {
                                    if (t(this.getTipElement()).hasClass(p))
                                        return void this._leave(null, this);
                                    this._enter(null, this);
                                }
                        }),
                        (I.dispose = function () {
                            clearTimeout(this._timeout),
                                t.removeData(this.element, this.constructor.DATA_KEY),
                                t(this.element).off(this.constructor.EVENT_KEY),
                                t(this.element).closest(".modal").off("hide.bs.modal"),
                                this.tip && t(this.tip).remove(),
                                (this._isEnabled = null),
                                (this._timeout = null),
                                (this._hoverState = null),
                                (this._activeTrigger = null),
                                null !== this._popper && this._popper.destroy(),
                                (this._popper = null),
                                (this.element = null),
                                (this.config = null),
                                (this.tip = null);
                        }),
                        (I.show = function () {
                            var e = this;
                            if ("none" === t(this.element).css("display"))
                                throw new Error("Please use show on visible elements");
                            var i = t.Event(this.constructor.Event.SHOW);
                            if (this.isWithContent() && this._isEnabled) {
                                t(this.element).trigger(i);
                                var s = t.contains(
                                    this.element.ownerDocument.documentElement,
                                    this.element
                                );
                                if (i.isDefaultPrevented() || !s) return;
                                var r = this.getTipElement(),
                                    o = P.getUID(this.constructor.NAME);
                                r.setAttribute("id", o),
                                    this.element.setAttribute("aria-describedby", o),
                                    this.setContent(),
                                    this.config.animation && t(r).addClass(g);
                                var l =
                                    "function" == typeof this.config.placement ?
                                        this.config.placement.call(this, r, this.element) :
                                        this.config.placement,
                                    h = this._getAttachment(l);
                                this.addAttachmentClass(h);
                                var c = !1 === this.config.container ?
                                    document.body :
                                    t(this.config.container);
                                t(r).data(this.constructor.DATA_KEY, this),
                                    t.contains(
                                        this.element.ownerDocument.documentElement,
                                        this.tip
                                    ) || t(r).appendTo(c),
                                    t(this.element).trigger(this.constructor.Event.INSERTED),
                                    (this._popper = new n(this.element, r, {
                                        placement: h,
                                        modifiers: {
                                            offset: { offset: this.config.offset },
                                            flip: { behavior: this.config.fallbackPlacement },
                                            arrow: { element: v },
                                            preventOverflow: {
                                                boundariesElement: this.config.boundary,
                                            },
                                        },
                                        onCreate: function (t) {
                                            t.originalPlacement !== t.placement &&
                                                e._handlePopperPlacementChange(t);
                                        },
                                        onUpdate: function (t) {
                                            e._handlePopperPlacementChange(t);
                                        },
                                    })),
                                    t(r).addClass(p),
                                    "ontouchstart" in document.documentElement &&
                                    t("body").children().on("mouseover", null, t.noop);
                                var u = function () {
                                    e.config.animation && e._fixTransition();
                                    var n = e._hoverState;
                                    (e._hoverState = null),
                                        t(e.element).trigger(e.constructor.Event.SHOWN),
                                        n === d && e._leave(null, e);
                                };
                                P.supportsTransitionEnd() && t(this.tip).hasClass(g) ?
                                    t(this.tip)
                                        .one(P.TRANSITION_END, u)
                                        .emulateTransitionEnd(a._TRANSITION_DURATION) :
                                    u();
                            }
                        }),
                        (I.hide = function (e) {
                            var n = this,
                                i = this.getTipElement(),
                                s = t.Event(this.constructor.Event.HIDE),
                                r = function () {
                                    n._hoverState !== f &&
                                        i.parentNode &&
                                        i.parentNode.removeChild(i),
                                        n._cleanTipClass(),
                                        n.element.removeAttribute("aria-describedby"),
                                        t(n.element).trigger(n.constructor.Event.HIDDEN),
                                        null !== n._popper && n._popper.destroy(),
                                        e && e();
                                };
                            t(this.element).trigger(s),
                                s.isDefaultPrevented() ||
                                (t(i).removeClass(p),
                                    "ontouchstart" in document.documentElement &&
                                    t("body").children().off("mouseover", null, t.noop),
                                    (this._activeTrigger[y] = !1),
                                    (this._activeTrigger[T] = !1),
                                    (this._activeTrigger[E] = !1),
                                    P.supportsTransitionEnd() && t(this.tip).hasClass(g) ?
                                        t(i).one(P.TRANSITION_END, r).emulateTransitionEnd(150) :
                                        r(),
                                    (this._hoverState = ""));
                        }),
                        (I.update = function () {
                            null !== this._popper && this._popper.scheduleUpdate();
                        }),
                        (I.isWithContent = function () {
                            return Boolean(this.getTitle());
                        }),
                        (I.addAttachmentClass = function (e) {
                            t(this.getTipElement()).addClass("bs-tooltip-" + e);
                        }),
                        (I.getTipElement = function () {
                            return (
                                (this.tip = this.tip || t(this.config.template)[0]), this.tip
                            );
                        }),
                        (I.setContent = function () {
                            var e = t(this.getTipElement());
                            this.setElementContent(e.find(m), this.getTitle()),
                                e.removeClass(g + " " + p);
                        }),
                        (I.setElementContent = function (e, n) {
                            var i = this.config.html;
                            "object" == typeof n && (n.nodeType || n.jquery) ?
                                i ?
                                    t(n).parent().is(e) || e.empty().append(n) :
                                    e.text(t(n).text()) :
                                e[i ? "html" : "text"](n);
                        }),
                        (I.getTitle = function () {
                            var t = this.element.getAttribute("data-original-title");
                            return (
                                t ||
                                (t =
                                    "function" == typeof this.config.title ?
                                        this.config.title.call(this.element) :
                                        this.config.title),
                                t
                            );
                        }),
                        (I._getAttachment = function (t) {
                            return c[t.toUpperCase()];
                        }),
                        (I._setListeners = function () {
                            var e = this;
                            this.config.trigger.split(" ").forEach(function (n) {
                                if ("click" === n)
                                    t(e.element).on(
                                        e.constructor.Event.CLICK,
                                        e.config.selector,
                                        function (t) {
                                            return e.toggle(t);
                                        }
                                    );
                                else if (n !== C) {
                                    var i =
                                        n === E ?
                                            e.constructor.Event.MOUSEENTER :
                                            e.constructor.Event.FOCUSIN,
                                        s =
                                            n === E ?
                                                e.constructor.Event.MOUSELEAVE :
                                                e.constructor.Event.FOCUSOUT;
                                    t(e.element)
                                        .on(i, e.config.selector, function (t) {
                                            return e._enter(t);
                                        })
                                        .on(s, e.config.selector, function (t) {
                                            return e._leave(t);
                                        });
                                }
                                t(e.element)
                                    .closest(".modal")
                                    .on("hide.bs.modal", function () {
                                        return e.hide();
                                    });
                            }),
                                this.config.selector ?
                                    (this.config = r({}, this.config, {
                                        trigger: "manual",
                                        selector: "",
                                    })) :
                                    this._fixTitle();
                        }),
                        (I._fixTitle = function () {
                            var t = typeof this.element.getAttribute("data-original-title");
                            (this.element.getAttribute("title") || "string" !== t) &&
                                (this.element.setAttribute(
                                    "data-original-title",
                                    this.element.getAttribute("title") || ""
                                ),
                                    this.element.setAttribute("title", ""));
                        }),
                        (I._enter = function (e, n) {
                            var i = this.constructor.DATA_KEY;
                            (n = n || t(e.currentTarget).data(i)) ||
                                ((n = new this.constructor(
                                    e.currentTarget,
                                    this._getDelegateConfig()
                                )),
                                    t(e.currentTarget).data(i, n)),
                                e && (n._activeTrigger["focusin" === e.type ? T : E] = !0),
                                t(n.getTipElement()).hasClass(p) || n._hoverState === f ?
                                    (n._hoverState = f) :
                                    (clearTimeout(n._timeout),
                                        (n._hoverState = f),
                                        n.config.delay && n.config.delay.show ?
                                            (n._timeout = setTimeout(function () {
                                                n._hoverState === f && n.show();
                                            }, n.config.delay.show)) :
                                            n.show());
                        }),
                        (I._leave = function (e, n) {
                            var i = this.constructor.DATA_KEY;
                            (n = n || t(e.currentTarget).data(i)) ||
                                ((n = new this.constructor(
                                    e.currentTarget,
                                    this._getDelegateConfig()
                                )),
                                    t(e.currentTarget).data(i, n)),
                                e && (n._activeTrigger["focusout" === e.type ? T : E] = !1),
                                n._isWithActiveTrigger() ||
                                (clearTimeout(n._timeout),
                                    (n._hoverState = d),
                                    n.config.delay && n.config.delay.hide ?
                                        (n._timeout = setTimeout(function () {
                                            n._hoverState === d && n.hide();
                                        }, n.config.delay.hide)) :
                                        n.hide());
                        }),
                        (I._isWithActiveTrigger = function () {
                            for (var t in this._activeTrigger)
                                if (this._activeTrigger[t]) return !0;
                            return !1;
                        }),
                        (I._getConfig = function (n) {
                            return (
                                "number" ==
                                typeof (n = r({},
                                    this.constructor.Default,
                                    t(this.element).data(),
                                    n
                                )).delay && (n.delay = { show: n.delay, hide: n.delay }),
                                "number" == typeof n.title && (n.title = n.title.toString()),
                                "number" == typeof n.content &&
                                (n.content = n.content.toString()),
                                P.typeCheckConfig(e, n, this.constructor.DefaultType),
                                n
                            );
                        }),
                        (I._getDelegateConfig = function () {
                            var t = {};
                            if (this.config)
                                for (var e in this.config)
                                    this.constructor.Default[e] !== this.config[e] &&
                                        (t[e] = this.config[e]);
                            return t;
                        }),
                        (I._cleanTipClass = function () {
                            var e = t(this.getTipElement()),
                                n = e.attr("class").match(l);
                            null !== n && n.length > 0 && e.removeClass(n.join(""));
                        }),
                        (I._handlePopperPlacementChange = function (t) {
                            this._cleanTipClass(),
                                this.addAttachmentClass(this._getAttachment(t.placement));
                        }),
                        (I._fixTransition = function () {
                            var e = this.getTipElement(),
                                n = this.config.animation;
                            null === e.getAttribute("x-placement") &&
                                (t(e).removeClass(g),
                                    (this.config.animation = !1),
                                    this.hide(),
                                    this.show(),
                                    (this.config.animation = n));
                        }),
                        (a._jQueryInterface = function (e) {
                            return this.each(function () {
                                var n = t(this).data(i),
                                    s = "object" == typeof e && e;
                                if (
                                    (n || !/dispose|hide/.test(e)) &&
                                    (n || ((n = new a(this, s)), t(this).data(i, n)),
                                        "string" == typeof e)
                                ) {
                                    if ("undefined" == typeof n[e])
                                        throw new TypeError('No method named "' + e + '"');
                                    n[e]();
                                }
                            });
                        }),
                        s(a, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },
                        {
                            key: "Default",
                            get: function () {
                                return u;
                            },
                        },
                        {
                            key: "NAME",
                            get: function () {
                                return e;
                            },
                        },
                        {
                            key: "DATA_KEY",
                            get: function () {
                                return i;
                            },
                        },
                        {
                            key: "Event",
                            get: function () {
                                return _;
                            },
                        },
                        {
                            key: "EVENT_KEY",
                            get: function () {
                                return o;
                            },
                        },
                        {
                            key: "DefaultType",
                            get: function () {
                                return h;
                            },
                        },
                        ]),
                        a
                    );
                })();
            return (
                (t.fn[e] = I._jQueryInterface),
                (t.fn[e].Constructor = I),
                (t.fn[e].noConflict = function () {
                    return (t.fn[e] = a), I._jQueryInterface;
                }),
                I
            );
        })(e),
        x = (function (t) {
            var e = "popover",
                n = "bs.popover",
                i = "." + n,
                o = t.fn[e],
                a = new RegExp("(^|\\s)bs-popover\\S+", "g"),
                l = r({}, U.Default, {
                    placement: "right",
                    trigger: "click",
                    content: "",
                    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                }),
                h = r({}, U.DefaultType, { content: "(string|element|function)" }),
                c = "fade",
                u = "show",
                f = ".popover-header",
                d = ".popover-body",
                _ = {
                    HIDE: "hide" + i,
                    HIDDEN: "hidden" + i,
                    SHOW: "show" + i,
                    SHOWN: "shown" + i,
                    INSERTED: "inserted" + i,
                    CLICK: "click" + i,
                    FOCUSIN: "focusin" + i,
                    FOCUSOUT: "focusout" + i,
                    MOUSEENTER: "mouseenter" + i,
                    MOUSELEAVE: "mouseleave" + i,
                },
                g = (function (r) {
                    var o, g;

                    function p() {
                        return r.apply(this, arguments) || this;
                    }
                    (g = r),
                        ((o = p).prototype = Object.create(g.prototype)),
                        (o.prototype.constructor = o),
                        (o.__proto__ = g);
                    var m = p.prototype;
                    return (
                        (m.isWithContent = function () {
                            return this.getTitle() || this._getContent();
                        }),
                        (m.addAttachmentClass = function (e) {
                            t(this.getTipElement()).addClass("bs-popover-" + e);
                        }),
                        (m.getTipElement = function () {
                            return (
                                (this.tip = this.tip || t(this.config.template)[0]), this.tip
                            );
                        }),
                        (m.setContent = function () {
                            var e = t(this.getTipElement());
                            this.setElementContent(e.find(f), this.getTitle());
                            var n = this._getContent();
                            "function" == typeof n && (n = n.call(this.element)),
                                this.setElementContent(e.find(d), n),
                                e.removeClass(c + " " + u);
                        }),
                        (m._getContent = function () {
                            return (
                                this.element.getAttribute("data-content") || this.config.content
                            );
                        }),
                        (m._cleanTipClass = function () {
                            var e = t(this.getTipElement()),
                                n = e.attr("class").match(a);
                            null !== n && n.length > 0 && e.removeClass(n.join(""));
                        }),
                        (p._jQueryInterface = function (e) {
                            return this.each(function () {
                                var i = t(this).data(n),
                                    s = "object" == typeof e ? e : null;
                                if (
                                    (i || !/destroy|hide/.test(e)) &&
                                    (i || ((i = new p(this, s)), t(this).data(n, i)),
                                        "string" == typeof e)
                                ) {
                                    if ("undefined" == typeof i[e])
                                        throw new TypeError('No method named "' + e + '"');
                                    i[e]();
                                }
                            });
                        }),
                        s(p, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },
                        {
                            key: "Default",
                            get: function () {
                                return l;
                            },
                        },
                        {
                            key: "NAME",
                            get: function () {
                                return e;
                            },
                        },
                        {
                            key: "DATA_KEY",
                            get: function () {
                                return n;
                            },
                        },
                        {
                            key: "Event",
                            get: function () {
                                return _;
                            },
                        },
                        {
                            key: "EVENT_KEY",
                            get: function () {
                                return i;
                            },
                        },
                        {
                            key: "DefaultType",
                            get: function () {
                                return h;
                            },
                        },
                        ]),
                        p
                    );
                })(U);
            return (
                (t.fn[e] = g._jQueryInterface),
                (t.fn[e].Constructor = g),
                (t.fn[e].noConflict = function () {
                    return (t.fn[e] = o), g._jQueryInterface;
                }),
                g
            );
        })(e),
        K = (function (t) {
            var e = "scrollspy",
                n = "bs.scrollspy",
                i = "." + n,
                o = t.fn[e],
                a = { offset: 10, method: "auto", target: "" },
                l = { offset: "number", method: "string", target: "(string|element)" },
                h = {
                    ACTIVATE: "activate" + i,
                    SCROLL: "scroll" + i,
                    LOAD_DATA_API: "load" + i + ".data-api",
                },
                c = "dropdown-item",
                u = "active",
                f = {
                    DATA_SPY: '[data-spy="scroll"]',
                    ACTIVE: ".active",
                    NAV_LIST_GROUP: ".nav, .list-group",
                    NAV_LINKS: ".nav-link",
                    NAV_ITEMS: ".nav-item",
                    LIST_ITEMS: ".list-group-item",
                    DROPDOWN: ".dropdown",
                    DROPDOWN_ITEMS: ".dropdown-item",
                    DROPDOWN_TOGGLE: ".dropdown-toggle",
                },
                d = "offset",
                _ = "position",
                g = (function () {
                    function o(e, n) {
                        var i = this;
                        (this._element = e),
                            (this._scrollElement = "BODY" === e.tagName ? window : e),
                            (this._config = this._getConfig(n)),
                            (this._selector =
                                this._config.target +
                                " " +
                                f.NAV_LINKS +
                                "," +
                                this._config.target +
                                " " +
                                f.LIST_ITEMS +
                                "," +
                                this._config.target +
                                " " +
                                f.DROPDOWN_ITEMS),
                            (this._offsets = []),
                            (this._targets = []),
                            (this._activeTarget = null),
                            (this._scrollHeight = 0),
                            t(this._scrollElement).on(h.SCROLL, function (t) {
                                return i._process(t);
                            }),
                            this.refresh(),
                            this._process();
                    }
                    var g = o.prototype;
                    return (
                        (g.refresh = function () {
                            var e = this,
                                n = this._scrollElement === this._scrollElement.window ? d : _,
                                i = "auto" === this._config.method ? n : this._config.method,
                                s = i === _ ? this._getScrollTop() : 0;
                            (this._offsets = []),
                                (this._targets = []),
                                (this._scrollHeight = this._getScrollHeight()),
                                t
                                    .makeArray(t(this._selector))
                                    .map(function (e) {
                                        var n,
                                            r = P.getSelectorFromElement(e);
                                        if ((r && (n = t(r)[0]), n)) {
                                            var o = n.getBoundingClientRect();
                                            if (o.width || o.height) return [t(n)[i]().top + s, r];
                                        }
                                        return null;
                                    })
                                    .filter(function (t) {
                                        return t;
                                    })
                                    .sort(function (t, e) {
                                        return t[0] - e[0];
                                    })
                                    .forEach(function (t) {
                                        e._offsets.push(t[0]), e._targets.push(t[1]);
                                    });
                        }),
                        (g.dispose = function () {
                            t.removeData(this._element, n),
                                t(this._scrollElement).off(i),
                                (this._element = null),
                                (this._scrollElement = null),
                                (this._config = null),
                                (this._selector = null),
                                (this._offsets = null),
                                (this._targets = null),
                                (this._activeTarget = null),
                                (this._scrollHeight = null);
                        }),
                        (g._getConfig = function (n) {
                            if ("string" != typeof (n = r({}, a, n)).target) {
                                var i = t(n.target).attr("id");
                                i || ((i = P.getUID(e)), t(n.target).attr("id", i)),
                                    (n.target = "#" + i);
                            }
                            return P.typeCheckConfig(e, n, l), n;
                        }),
                        (g._getScrollTop = function () {
                            return this._scrollElement === window ?
                                this._scrollElement.pageYOffset :
                                this._scrollElement.scrollTop;
                        }),
                        (g._getScrollHeight = function () {
                            return (
                                this._scrollElement.scrollHeight ||
                                Math.max(
                                    document.body.scrollHeight,
                                    document.documentElement.scrollHeight
                                )
                            );
                        }),
                        (g._getOffsetHeight = function () {
                            return this._scrollElement === window ?
                                window.innerHeight :
                                this._scrollElement.getBoundingClientRect().height;
                        }),
                        (g._process = function () {
                            var t = this._getScrollTop() + this._config.offset,
                                e = this._getScrollHeight(),
                                n = this._config.offset + e - this._getOffsetHeight();
                            if ((this._scrollHeight !== e && this.refresh(), t >= n)) {
                                var i = this._targets[this._targets.length - 1];
                                this._activeTarget !== i && this._activate(i);
                            } else {
                                if (
                                    this._activeTarget &&
                                    t < this._offsets[0] &&
                                    this._offsets[0] > 0
                                )
                                    return (this._activeTarget = null), void this._clear();
                                for (var s = this._offsets.length; s--;) {
                                    this._activeTarget !== this._targets[s] &&
                                        t >= this._offsets[s] &&
                                        ("undefined" == typeof this._offsets[s + 1] ||
                                            t < this._offsets[s + 1]) &&
                                        this._activate(this._targets[s]);
                                }
                            }
                        }),
                        (g._activate = function (e) {
                            (this._activeTarget = e), this._clear();
                            var n = this._selector.split(",");
                            n = n.map(function (t) {
                                return (
                                    t + '[data-target="' + e + '"],' + t + '[href="' + e + '"]'
                                );
                            });
                            var i = t(n.join(","));
                            i.hasClass(c) ?
                                (i.closest(f.DROPDOWN).find(f.DROPDOWN_TOGGLE).addClass(u),
                                    i.addClass(u)) :
                                (i.addClass(u),
                                    i
                                        .parents(f.NAV_LIST_GROUP)
                                        .prev(f.NAV_LINKS + ", " + f.LIST_ITEMS)
                                        .addClass(u),
                                    i
                                        .parents(f.NAV_LIST_GROUP)
                                        .prev(f.NAV_ITEMS)
                                        .children(f.NAV_LINKS)
                                        .addClass(u)),
                                t(this._scrollElement).trigger(h.ACTIVATE, {
                                    relatedTarget: e,
                                });
                        }),
                        (g._clear = function () {
                            t(this._selector).filter(f.ACTIVE).removeClass(u);
                        }),
                        (o._jQueryInterface = function (e) {
                            return this.each(function () {
                                var i = t(this).data(n);
                                if (
                                    (i ||
                                        ((i = new o(this, "object" == typeof e && e)),
                                            t(this).data(n, i)),
                                        "string" == typeof e)
                                ) {
                                    if ("undefined" == typeof i[e])
                                        throw new TypeError('No method named "' + e + '"');
                                    i[e]();
                                }
                            });
                        }),
                        s(o, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },
                        {
                            key: "Default",
                            get: function () {
                                return a;
                            },
                        },
                        ]),
                        o
                    );
                })();
            return (
                t(window).on(h.LOAD_DATA_API, function () {
                    for (var e = t.makeArray(t(f.DATA_SPY)), n = e.length; n--;) {
                        var i = t(e[n]);
                        g._jQueryInterface.call(i, i.data());
                    }
                }),
                (t.fn[e] = g._jQueryInterface),
                (t.fn[e].Constructor = g),
                (t.fn[e].noConflict = function () {
                    return (t.fn[e] = o), g._jQueryInterface;
                }),
                g
            );
        })(e),
        V = (function (t) {
            var e = "bs.tab",
                n = "." + e,
                i = t.fn.tab,
                r = {
                    HIDE: "hide" + n,
                    HIDDEN: "hidden" + n,
                    SHOW: "show" + n,
                    SHOWN: "shown" + n,
                    CLICK_DATA_API: "click.bs.tab.data-api",
                },
                o = "dropdown-menu",
                a = "active",
                l = "disabled",
                h = "fade",
                c = "show",
                u = ".dropdown",
                f = ".nav, .list-group",
                d = ".active",
                _ = "> li > .active",
                g = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
                p = ".dropdown-toggle",
                m = "> .dropdown-menu .active",
                v = (function () {
                    function n(t) {
                        this._element = t;
                    }
                    var i = n.prototype;
                    return (
                        (i.show = function () {
                            var e = this;
                            if (!(
                                (this._element.parentNode &&
                                    this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
                                    t(this._element).hasClass(a)) ||
                                t(this._element).hasClass(l)
                            )) {
                                var n,
                                    i,
                                    s = t(this._element).closest(f)[0],
                                    o = P.getSelectorFromElement(this._element);
                                if (s) {
                                    var h = "UL" === s.nodeName ? _ : d;
                                    i = (i = t.makeArray(t(s).find(h)))[i.length - 1];
                                }
                                var c = t.Event(r.HIDE, { relatedTarget: this._element }),
                                    u = t.Event(r.SHOW, { relatedTarget: i });
                                if (
                                    (i && t(i).trigger(c),
                                        t(this._element).trigger(u), !u.isDefaultPrevented() && !c.isDefaultPrevented())
                                ) {
                                    o && (n = t(o)[0]), this._activate(this._element, s);
                                    var g = function () {
                                        var n = t.Event(r.HIDDEN, { relatedTarget: e._element }),
                                            s = t.Event(r.SHOWN, { relatedTarget: i });
                                        t(i).trigger(n), t(e._element).trigger(s);
                                    };
                                    n ? this._activate(n, n.parentNode, g) : g();
                                }
                            }
                        }),
                        (i.dispose = function () {
                            t.removeData(this._element, e), (this._element = null);
                        }),
                        (i._activate = function (e, n, i) {
                            var s = this,
                                r = ("UL" === n.nodeName ? t(n).find(_) : t(n).children(d))[0],
                                o = i && P.supportsTransitionEnd() && r && t(r).hasClass(h),
                                a = function () {
                                    return s._transitionComplete(e, r, i);
                                };
                            r && o ?
                                t(r).one(P.TRANSITION_END, a).emulateTransitionEnd(150) :
                                a();
                        }),
                        (i._transitionComplete = function (e, n, i) {
                            if (n) {
                                t(n).removeClass(c + " " + a);
                                var s = t(n.parentNode).find(m)[0];
                                s && t(s).removeClass(a),
                                    "tab" === n.getAttribute("role") &&
                                    n.setAttribute("aria-selected", !1);
                            }
                            if (
                                (t(e).addClass(a),
                                    "tab" === e.getAttribute("role") &&
                                    e.setAttribute("aria-selected", !0),
                                    P.reflow(e),
                                    t(e).addClass(c),
                                    e.parentNode && t(e.parentNode).hasClass(o))
                            ) {
                                var r = t(e).closest(u)[0];
                                r && t(r).find(p).addClass(a),
                                    e.setAttribute("aria-expanded", !0);
                            }
                            i && i();
                        }),
                        (n._jQueryInterface = function (i) {
                            return this.each(function () {
                                var s = t(this),
                                    r = s.data(e);
                                if (
                                    (r || ((r = new n(this)), s.data(e, r)), "string" == typeof i)
                                ) {
                                    if ("undefined" == typeof r[i])
                                        throw new TypeError('No method named "' + i + '"');
                                    r[i]();
                                }
                            });
                        }),
                        s(n, null, [{
                            key: "VERSION",
                            get: function () {
                                return "4.0.0";
                            },
                        },]),
                        n
                    );
                })();
            return (
                t(document).on(r.CLICK_DATA_API, g, function (e) {
                    e.preventDefault(), v._jQueryInterface.call(t(this), "show");
                }),
                (t.fn.tab = v._jQueryInterface),
                (t.fn.tab.Constructor = v),
                (t.fn.tab.noConflict = function () {
                    return (t.fn.tab = i), v._jQueryInterface;
                }),
                v
            );
        })(e);
    !(function (t) {
        if ("undefined" == typeof t)
            throw new TypeError(
                "Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript."
            );
        var e = t.fn.jquery.split(" ")[0].split(".");
        if (
            (e[0] < 2 && e[1] < 9) ||
            (1 === e[0] && 9 === e[1] && e[2] < 1) ||
            e[0] >= 4
        )
            throw new Error(
                "Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0"
            );
    })(e),
        (t.Util = P),
        (t.Alert = L),
        (t.Button = R),
        (t.Carousel = j),
        (t.Collapse = H),
        (t.Dropdown = W),
        (t.Modal = M),
        (t.Popover = x),
        (t.Scrollspy = K),
        (t.Tab = V),
        (t.Tooltip = U),
        Object.defineProperty(t, "__esModule", { value: !0 });
});




;$(document).ready(function() {
    $(".toggle-menu").click(function() {
        $(this).toggleClass("active");
        $("#menu").toggleClass("open");
    });



});
;
;/*!
 * GSAP 3.12.2
 * https://greensock.com
 * 
 * @license Copyright 2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).window=t.window||{})}(this,function(e){"use strict";function _inheritsLoose(t,e){t.prototype=Object.create(e.prototype),(t.prototype.constructor=t).__proto__=e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function r(t){return"string"==typeof t}function s(t){return"function"==typeof t}function t(t){return"number"==typeof t}function u(t){return void 0===t}function v(t){return"object"==typeof t}function w(t){return!1!==t}function x(){return"undefined"!=typeof window}function y(t){return s(t)||r(t)}function P(t){return(i=yt(t,ot))&&Ee}function Q(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")}function R(t,e){return!e&&console.warn(t)}function S(t,e){return t&&(ot[t]=e)&&i&&(i[t]=e)||ot}function T(){return 0}function ea(t){var e,r,i=t[0];if(v(i)||s(i)||(t=[t]),!(e=(i._gsap||{}).harness)){for(r=gt.length;r--&&!gt[r].targetTest(i););e=gt[r]}for(r=t.length;r--;)t[r]&&(t[r]._gsap||(t[r]._gsap=new Vt(t[r],e)))||t.splice(r,1);return t}function fa(t){return t._gsap||ea(Ot(t))[0]._gsap}function ga(t,e,r){return(r=t[e])&&s(r)?t[e]():u(r)&&t.getAttribute&&t.getAttribute(e)||r}function ha(t,e){return(t=t.split(",")).forEach(e)||t}function ia(t){return Math.round(1e5*t)/1e5||0}function ja(t){return Math.round(1e7*t)/1e7||0}function ka(t,e){var r=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),"+"===r?t+i:"-"===r?t-i:"*"===r?t*i:t/i}function la(t,e){for(var r=e.length,i=0;t.indexOf(e[i])<0&&++i<r;);return i<r}function ma(){var t,e,r=ct.length,i=ct.slice(0);for(dt={},t=ct.length=0;t<r;t++)(e=i[t])&&e._lazy&&(e.render(e._lazy[0],e._lazy[1],!0)._lazy=0)}function na(t,e,r,i){ct.length&&!L&&ma(),t.render(e,r,i||L&&e<0&&(t._initted||t._startAt)),ct.length&&!L&&ma()}function oa(t){var e=parseFloat(t);return(e||0===e)&&(t+"").match(at).length<2?e:r(t)?t.trim():t}function pa(t){return t}function qa(t,e){for(var r in e)r in t||(t[r]=e[r]);return t}function ta(t,e){for(var r in e)"__proto__"!==r&&"constructor"!==r&&"prototype"!==r&&(t[r]=v(e[r])?ta(t[r]||(t[r]={}),e[r]):e[r]);return t}function ua(t,e){var r,i={};for(r in t)r in e||(i[r]=t[r]);return i}function va(t){var e=t.parent||I,r=t.keyframes?function _setKeyframeDefaults(i){return function(t,e){for(var r in e)r in t||"duration"===r&&i||"ease"===r||(t[r]=e[r])}}($(t.keyframes)):qa;if(w(t.inherit))for(;e;)r(t,e.vars.defaults),e=e.parent||e._dp;return t}function xa(t,e,r,i,n){void 0===r&&(r="_first"),void 0===i&&(i="_last");var a,s=t[i];if(n)for(a=e[n];s&&s[n]>a;)s=s._prev;return s?(e._next=s._next,s._next=e):(e._next=t[r],t[r]=e),e._next?e._next._prev=e:t[i]=e,e._prev=s,e.parent=e._dp=t,e}function ya(t,e,r,i){void 0===r&&(r="_first"),void 0===i&&(i="_last");var n=e._prev,a=e._next;n?n._next=a:t[r]===e&&(t[r]=a),a?a._prev=n:t[i]===e&&(t[i]=n),e._next=e._prev=e.parent=null}function za(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0}function Aa(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var r=t;r;)r._dirty=1,r=r.parent;return t}function Ca(t,e,r,i){return t._startAt&&(L?t._startAt.revert(ht):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))}function Ea(t){return t._repeat?Tt(t._tTime,t=t.duration()+t._rDelay)*t:0}function Ga(t,e){return(t-e._start)*e._ts+(0<=e._ts?0:e._dirty?e.totalDuration():e._tDur)}function Ha(t){return t._end=ja(t._start+(t._tDur/Math.abs(t._ts||t._rts||X)||0))}function Ia(t,e){var r=t._dp;return r&&r.smoothChildTiming&&t._ts&&(t._start=ja(r._time-(0<t._ts?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Ha(t),r._dirty||Aa(r,t)),t}function Ja(t,e){var r;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(r=Ga(t.rawTime(),e),(!e._dur||kt(0,e.totalDuration(),r)-e._tTime>X)&&e.render(r,!0)),Aa(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(r=t;r._dp;)0<=r.rawTime()&&r.totalTime(r._tTime),r=r._dp;t._zTime=-X}}function Ka(e,r,i,n){return r.parent&&za(r),r._start=ja((t(i)?i:i||e!==I?xt(e,i,r):e._time)+r._delay),r._end=ja(r._start+(r.totalDuration()/Math.abs(r.timeScale())||0)),xa(e,r,"_first","_last",e._sort?"_start":0),bt(r)||(e._recent=r),n||Ja(e,r),e._ts<0&&Ia(e,e._tTime),e}function La(t,e){return(ot.ScrollTrigger||Q("scrollTrigger",e))&&ot.ScrollTrigger.create(e,t)}function Ma(t,e,r,i,n){return Gt(t,e,n),t._initted?!r&&t._pt&&!L&&(t._dur&&!1!==t.vars.lazy||!t._dur&&t.vars.lazy)&&f!==Rt.frame?(ct.push(t),t._lazy=[n,i],1):void 0:1}function Ra(t,e,r,i){var n=t._repeat,a=ja(e)||0,s=t._tTime/t._tDur;return s&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=n?n<0?1e10:ja(a*(n+1)+t._rDelay*n):a,0<s&&!i&&Ia(t,t._tTime=t._tDur*s),t.parent&&Ha(t),r||Aa(t.parent,t),t}function Sa(t){return t instanceof Xt?Aa(t):Ra(t,t._dur)}function Va(e,r,i){var n,a,s=t(r[1]),o=(s?2:1)+(e<2?0:1),u=r[o];if(s&&(u.duration=r[1]),u.parent=i,e){for(n=u,a=i;a&&!("immediateRender"in n);)n=a.vars.defaults||{},a=w(a.vars.inherit)&&a.parent;u.immediateRender=w(n.immediateRender),e<2?u.runBackwards=1:u.startAt=r[o-1]}return new Zt(r[0],u,r[1+o])}function Wa(t,e){return t||0===t?e(t):e}function Ya(t,e){return r(t)&&(e=st.exec(t))?e[1]:""}function _a(t,e){return t&&v(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&v(t[0]))&&!t.nodeType&&t!==h}function cb(r){return r=Ot(r)[0]||R("Invalid scope")||{},function(t){var e=r.current||r.nativeElement||r;return Ot(t,e.querySelectorAll?e:e===r?R("Invalid scope")||a.createElement("div"):r)}}function db(t){return t.sort(function(){return.5-Math.random()})}function eb(t){if(s(t))return t;var p=v(t)?t:{each:t},_=jt(p.ease),m=p.from||0,g=parseFloat(p.base)||0,y={},e=0<m&&m<1,T=isNaN(m)||e,b=p.axis,w=m,x=m;return r(m)?w=x={center:.5,edges:.5,end:1}[m]||0:!e&&T&&(w=m[0],x=m[1]),function(t,e,r){var i,n,a,s,o,u,h,l,f,c=(r||p).length,d=y[c];if(!d){if(!(f="auto"===p.grid?0:(p.grid||[1,U])[1])){for(h=-U;h<(h=r[f++].getBoundingClientRect().left)&&f<c;);f--}for(d=y[c]=[],i=T?Math.min(f,c)*w-.5:m%f,n=f===U?0:T?c*x/f-.5:m/f|0,l=U,u=h=0;u<c;u++)a=u%f-i,s=n-(u/f|0),d[u]=o=b?Math.abs("y"===b?s:a):K(a*a+s*s),h<o&&(h=o),o<l&&(l=o);"random"===m&&db(d),d.max=h-l,d.min=l,d.v=c=(parseFloat(p.amount)||parseFloat(p.each)*(c<f?c-1:b?"y"===b?c/f:f:Math.max(f,c/f))||0)*("edges"===m?-1:1),d.b=c<0?g-c:g,d.u=Ya(p.amount||p.each)||0,_=_&&c<0?Yt(_):_}return c=(d[t]-d.min)/d.max||0,ja(d.b+(_?_(c):c)*d.v)+d.u}}function fb(i){var n=Math.pow(10,((i+"").split(".")[1]||"").length);return function(e){var r=ja(Math.round(parseFloat(e)/i)*i*n);return(r-r%1)/n+(t(e)?0:Ya(e))}}function gb(h,e){var l,f,r=$(h);return!r&&v(h)&&(l=r=h.radius||U,h.values?(h=Ot(h.values),(f=!t(h[0]))&&(l*=l)):h=fb(h.increment)),Wa(e,r?s(h)?function(t){return f=h(t),Math.abs(f-t)<=l?f:t}:function(e){for(var r,i,n=parseFloat(f?e.x:e),a=parseFloat(f?e.y:0),s=U,o=0,u=h.length;u--;)(r=f?(r=h[u].x-n)*r+(i=h[u].y-a)*i:Math.abs(h[u]-n))<s&&(s=r,o=u);return o=!l||s<=l?h[o]:e,f||o===e||t(e)?o:o+Ya(e)}:fb(h))}function hb(t,e,r,i){return Wa($(t)?!e:!0===r?!!(r=0):!i,function(){return $(t)?t[~~(Math.random()*t.length)]:(r=r||1e-5)&&(i=r<1?Math.pow(10,(r+"").length-2):1)&&Math.floor(Math.round((t-r/2+Math.random()*(e-t+.99*r))/r)*r*i)/i})}function lb(e,r,t){return Wa(t,function(t){return e[~~r(t)]})}function ob(t){for(var e,r,i,n,a=0,s="";~(e=t.indexOf("random(",a));)i=t.indexOf(")",e),n="["===t.charAt(e+7),r=t.substr(e+7,i-e-7).match(n?at:tt),s+=t.substr(a,e-a)+hb(n?r:+r[0],n?0:+r[1],+r[2]||1e-5),a=i+1;return s+t.substr(a,t.length-a)}function rb(t,e,r){var i,n,a,s=t.labels,o=U;for(i in s)(n=s[i]-e)<0==!!r&&n&&o>(n=Math.abs(n))&&(a=i,o=n);return a}function tb(t){return za(t),t.scrollTrigger&&t.scrollTrigger.kill(!!L),t.progress()<1&&At(t,"onInterrupt"),t}function wb(t){if(x()&&t){var e=(t=!t.name&&t.default||t).name,r=s(t),i=e&&!r&&t.init?function(){this._props=[]}:t,n={init:T,render:he,add:Qt,kill:ce,modifier:fe,rawVars:0},a={targetTest:0,get:0,getSetter:ne,aliases:{},register:0};if(Ft(),t!==i){if(pt[e])return;qa(i,qa(ua(t,n),a)),yt(i.prototype,yt(n,ua(t,a))),pt[i.prop=e]=i,t.targetTest&&(gt.push(i),ft[e]=1),e=("css"===e?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}S(e,i),t.register&&t.register(Ee,i,_e)}else t&&Ct.push(t)}function zb(t,e,r){return(6*(t+=t<0?1:1<t?-1:0)<1?e+(r-e)*t*6:t<.5?r:3*t<2?e+(r-e)*(2/3-t)*6:e)*St+.5|0}function Ab(e,r,i){var n,a,s,o,u,h,l,f,c,d,p=e?t(e)?[e>>16,e>>8&St,e&St]:0:Et.black;if(!p){if(","===e.substr(-1)&&(e=e.substr(0,e.length-1)),Et[e])p=Et[e];else if("#"===e.charAt(0)){if(e.length<6&&(e="#"+(n=e.charAt(1))+n+(a=e.charAt(2))+a+(s=e.charAt(3))+s+(5===e.length?e.charAt(4)+e.charAt(4):"")),9===e.length)return[(p=parseInt(e.substr(1,6),16))>>16,p>>8&St,p&St,parseInt(e.substr(7),16)/255];p=[(e=parseInt(e.substr(1),16))>>16,e>>8&St,e&St]}else if("hsl"===e.substr(0,3))if(p=d=e.match(tt),r){if(~e.indexOf("="))return p=e.match(et),i&&p.length<4&&(p[3]=1),p}else o=+p[0]%360/360,u=p[1]/100,n=2*(h=p[2]/100)-(a=h<=.5?h*(u+1):h+u-h*u),3<p.length&&(p[3]*=1),p[0]=zb(o+1/3,n,a),p[1]=zb(o,n,a),p[2]=zb(o-1/3,n,a);else p=e.match(tt)||Et.transparent;p=p.map(Number)}return r&&!d&&(n=p[0]/St,a=p[1]/St,s=p[2]/St,h=((l=Math.max(n,a,s))+(f=Math.min(n,a,s)))/2,l===f?o=u=0:(c=l-f,u=.5<h?c/(2-l-f):c/(l+f),o=l===n?(a-s)/c+(a<s?6:0):l===a?(s-n)/c+2:(n-a)/c+4,o*=60),p[0]=~~(o+.5),p[1]=~~(100*u+.5),p[2]=~~(100*h+.5)),i&&p.length<4&&(p[3]=1),p}function Bb(t){var r=[],i=[],n=-1;return t.split(Dt).forEach(function(t){var e=t.match(rt)||[];r.push.apply(r,e),i.push(n+=e.length+1)}),r.c=i,r}function Cb(t,e,r){var i,n,a,s,o="",u=(t+o).match(Dt),h=e?"hsla(":"rgba(",l=0;if(!u)return t;if(u=u.map(function(t){return(t=Ab(t,e,1))&&h+(e?t[0]+","+t[1]+"%,"+t[2]+"%,"+t[3]:t.join(","))+")"}),r&&(a=Bb(t),(i=r.c).join(o)!==a.c.join(o)))for(s=(n=t.replace(Dt,"1").split(rt)).length-1;l<s;l++)o+=n[l]+(~i.indexOf(l)?u.shift()||h+"0,0,0,0)":(a.length?a:u.length?u:r).shift());if(!n)for(s=(n=t.split(Dt)).length-1;l<s;l++)o+=n[l]+u[l];return o+n[s]}function Fb(t){var e,r=t.join(" ");if(Dt.lastIndex=0,Dt.test(r))return e=zt.test(r),t[1]=Cb(t[1],e),t[0]=Cb(t[0],e,Bb(t[1])),!0}function Ob(t){var e=(t+"").split("("),r=Bt[e[0]];return r&&1<e.length&&r.config?r.config.apply(null,~t.indexOf("{")?[function _parseObjectInString(t){for(var e,r,i,n={},a=t.substr(1,t.length-3).split(":"),s=a[0],o=1,u=a.length;o<u;o++)r=a[o],e=o!==u-1?r.lastIndexOf(","):r.length,i=r.substr(0,e),n[s]=isNaN(i)?i.replace(It,"").trim():+i,s=r.substr(e+1).trim();return n}(e[1])]:function _valueInParentheses(t){var e=t.indexOf("(")+1,r=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<r?t.indexOf(")",r+1):r)}(t).split(",").map(oa)):Bt._CE&&Lt.test(t)?Bt._CE("",t):r}function Qb(t,e){for(var r,i=t._first;i;)i instanceof Xt?Qb(i,e):!i.vars.yoyoEase||i._yoyo&&i._repeat||i._yoyo===e||(i.timeline?Qb(i.timeline,e):(r=i._ease,i._ease=i._yEase,i._yEase=r,i._yoyo=e)),i=i._next}function Sb(t,e,r,i){void 0===r&&(r=function easeOut(t){return 1-e(1-t)}),void 0===i&&(i=function easeInOut(t){return t<.5?e(2*t)/2:1-e(2*(1-t))/2});var n,a={easeIn:e,easeOut:r,easeInOut:i};return ha(t,function(t){for(var e in Bt[t]=ot[t]=a,Bt[n=t.toLowerCase()]=r,a)Bt[n+("easeIn"===e?".in":"easeOut"===e?".out":".inOut")]=Bt[t+"."+e]=a[e]}),a}function Tb(e){return function(t){return t<.5?(1-e(1-2*t))/2:.5+e(2*(t-.5))/2}}function Ub(r,t,e){function Jm(t){return 1===t?1:i*Math.pow(2,-10*t)*H((t-a)*n)+1}var i=1<=t?t:1,n=(e||(r?.3:.45))/(t<1?t:1),a=n/N*(Math.asin(1/i)||0),s="out"===r?Jm:"in"===r?function(t){return 1-Jm(1-t)}:Tb(Jm);return n=N/n,s.config=function(t,e){return Ub(r,t,e)},s}function Vb(e,r){function Rm(t){return t?--t*t*((r+1)*t+r)+1:0}void 0===r&&(r=1.70158);var t="out"===e?Rm:"in"===e?function(t){return 1-Rm(1-t)}:Tb(Rm);return t.config=function(t){return Vb(e,t)},t}var B,L,l,I,h,n,a,i,o,f,c,d,p,_,m,g,b,k,M,O,A,C,E,D,z,F,Y,j,q={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},V={duration:.5,overwrite:!1,delay:0},U=1e8,X=1/U,N=2*Math.PI,W=N/4,G=0,K=Math.sqrt,J=Math.cos,H=Math.sin,Z="function"==typeof ArrayBuffer&&ArrayBuffer.isView||function(){},$=Array.isArray,tt=/(?:-?\.?\d|\.)+/gi,et=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,rt=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,it=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,nt=/[+-]=-?[.\d]+/,at=/[^,'"\[\]\s]+/gi,st=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,ot={},ut={suppressEvents:!0,isStart:!0,kill:!1},ht={suppressEvents:!0,kill:!1},lt={suppressEvents:!0},ft={},ct=[],dt={},pt={},_t={},mt=30,gt=[],vt="",yt=function _merge(t,e){for(var r in e)t[r]=e[r];return t},Tt=function _animationCycle(t,e){var r=Math.floor(t/=e);return t&&r===t?r-1:r},bt=function _isFromOrFromStart(t){var e=t.data;return"isFromStart"===e||"isStart"===e},wt={_start:0,endTime:T,totalDuration:T},xt=function _parsePosition(t,e,i){var n,a,s,o=t.labels,u=t._recent||wt,h=t.duration()>=U?u.endTime(!1):t._dur;return r(e)&&(isNaN(e)||e in o)?(a=e.charAt(0),s="%"===e.substr(-1),n=e.indexOf("="),"<"===a||">"===a?(0<=n&&(e=e.replace(/=/,"")),("<"===a?u._start:u.endTime(0<=u._repeat))+(parseFloat(e.substr(1))||0)*(s?(n<0?u:i).totalDuration()/100:1)):n<0?(e in o||(o[e]=h),o[e]):(a=parseFloat(e.charAt(n-1)+e.substr(n+1)),s&&i&&(a=a/100*($(i)?i[0]:i).totalDuration()),1<n?_parsePosition(t,e.substr(0,n-1),i)+a:h+a)):null==e?h:+e},kt=function _clamp(t,e,r){return r<t?t:e<r?e:r},Mt=[].slice,Ot=function toArray(t,e,i){return l&&!e&&l.selector?l.selector(t):!r(t)||i||!n&&Ft()?$(t)?function _flatten(t,e,i){return void 0===i&&(i=[]),t.forEach(function(t){return r(t)&&!e||_a(t,1)?i.push.apply(i,Ot(t)):i.push(t)})||i}(t,i):_a(t)?Mt.call(t,0):t?[t]:[]:Mt.call((e||a).querySelectorAll(t),0)},Pt=function mapRange(e,t,r,i,n){var a=t-e,s=i-r;return Wa(n,function(t){return r+((t-e)/a*s||0)})},At=function _callback(t,e,r){var i,n,a,s=t.vars,o=s[e],u=l,h=t._ctx;if(o)return i=s[e+"Params"],n=s.callbackScope||t,r&&ct.length&&ma(),h&&(l=h),a=i?o.apply(n,i):o.call(n),l=u,a},Ct=[],St=255,Et={aqua:[0,St,St],lime:[0,St,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,St],navy:[0,0,128],white:[St,St,St],olive:[128,128,0],yellow:[St,St,0],orange:[St,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[St,0,0],pink:[St,192,203],cyan:[0,St,St],transparent:[St,St,St,0]},Dt=function(){var t,e="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";for(t in Et)e+="|"+t+"\\b";return new RegExp(e+")","gi")}(),zt=/hsl[a]?\(/,Rt=(M=Date.now,O=500,A=33,C=M(),E=C,z=D=1e3/240,g={time:0,frame:0,tick:function tick(){yl(!0)},deltaRatio:function deltaRatio(t){return b/(1e3/(t||60))},wake:function wake(){o&&(!n&&x()&&(h=n=window,a=h.document||{},ot.gsap=Ee,(h.gsapVersions||(h.gsapVersions=[])).push(Ee.version),P(i||h.GreenSockGlobals||!h.gsap&&h||{}),m=h.requestAnimationFrame,Ct.forEach(wb)),p&&g.sleep(),_=m||function(t){return setTimeout(t,z-1e3*g.time+1|0)},d=1,yl(2))},sleep:function sleep(){(m?h.cancelAnimationFrame:clearTimeout)(p),d=0,_=T},lagSmoothing:function lagSmoothing(t,e){O=t||1/0,A=Math.min(e||33,O)},fps:function fps(t){D=1e3/(t||240),z=1e3*g.time+D},add:function add(n,t,e){var a=t?function(t,e,r,i){n(t,e,r,i),g.remove(a)}:n;return g.remove(n),F[e?"unshift":"push"](a),Ft(),a},remove:function remove(t,e){~(e=F.indexOf(t))&&F.splice(e,1)&&e<=k&&k--},_listeners:F=[]}),Ft=function _wake(){return!d&&Rt.wake()},Bt={},Lt=/^[\d.\-M][\d.\-,\s]/,It=/["']/g,Yt=function _invertEase(e){return function(t){return 1-e(1-t)}},jt=function _parseEase(t,e){return t&&(s(t)?t:Bt[t]||Ob(t))||e};function yl(t){var e,r,i,n,a=M()-E,s=!0===t;if(O<a&&(C+=a-A),(0<(e=(i=(E+=a)-C)-z)||s)&&(n=++g.frame,b=i-1e3*g.time,g.time=i/=1e3,z+=e+(D<=e?4:D-e),r=1),s||(p=_(yl)),r)for(k=0;k<F.length;k++)F[k](i,b,n,t)}function gn(t){return t<j?Y*t*t:t<.7272727272727273?Y*Math.pow(t-1.5/2.75,2)+.75:t<.9090909090909092?Y*(t-=2.25/2.75)*t+.9375:Y*Math.pow(t-2.625/2.75,2)+.984375}ha("Linear,Quad,Cubic,Quart,Quint,Strong",function(t,e){var r=e<5?e+1:e;Sb(t+",Power"+(r-1),e?function(t){return Math.pow(t,r)}:function(t){return t},function(t){return 1-Math.pow(1-t,r)},function(t){return t<.5?Math.pow(2*t,r)/2:1-Math.pow(2*(1-t),r)/2})}),Bt.Linear.easeNone=Bt.none=Bt.Linear.easeIn,Sb("Elastic",Ub("in"),Ub("out"),Ub()),Y=7.5625,j=1/2.75,Sb("Bounce",function(t){return 1-gn(1-t)},gn),Sb("Expo",function(t){return t?Math.pow(2,10*(t-1)):0}),Sb("Circ",function(t){return-(K(1-t*t)-1)}),Sb("Sine",function(t){return 1===t?1:1-J(t*W)}),Sb("Back",Vb("in"),Vb("out"),Vb()),Bt.SteppedEase=Bt.steps=ot.SteppedEase={config:function config(t,e){void 0===t&&(t=1);var r=1/t,i=t+(e?0:1),n=e?1:0;return function(t){return((i*kt(0,.99999999,t)|0)+n)*r}}},V.ease=Bt["quad.out"],ha("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(t){return vt+=t+","+t+"Params,"});var qt,Vt=function GSCache(t,e){this.id=G++,(t._gsap=this).target=t,this.harness=e,this.get=e?e.get:ga,this.set=e?e.getSetter:ne},Ut=((qt=Animation.prototype).delay=function delay(t){return t||0===t?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+t-this._delay),this._delay=t,this):this._delay},qt.duration=function duration(t){return arguments.length?this.totalDuration(0<this._repeat?t+(t+this._rDelay)*this._repeat:t):this.totalDuration()&&this._dur},qt.totalDuration=function totalDuration(t){return arguments.length?(this._dirty=0,Ra(this,this._repeat<0?t:(t-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},qt.totalTime=function totalTime(t,e){if(Ft(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(Ia(this,t),!r._dp||r.parent||Ja(r,this);r&&r.parent;)r.parent._time!==r._start+(0<=r._ts?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(0<this._ts&&t<this._tDur||this._ts<0&&0<t||!this._tDur&&!t)&&Ka(this._dp,this,this._start-this._delay)}return(this._tTime!==t||!this._dur&&!e||this._initted&&Math.abs(this._zTime)===X||!t&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=t),na(this,t,e)),this},qt.time=function time(t,e){return arguments.length?this.totalTime(Math.min(this.totalDuration(),t+Ea(this))%(this._dur+this._rDelay)||(t?this._dur:0),e):this._time},qt.totalProgress=function totalProgress(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.ratio},qt.progress=function progress(t,e){return arguments.length?this.totalTime(this.duration()*(!this._yoyo||1&this.iteration()?t:1-t)+Ea(this),e):this.duration()?Math.min(1,this._time/this._dur):this.ratio},qt.iteration=function iteration(t,e){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(t-1)*r,e):this._repeat?Tt(this._tTime,r)+1:1},qt.timeScale=function timeScale(t){if(!arguments.length)return this._rts===-X?0:this._rts;if(this._rts===t)return this;var e=this.parent&&this._ts?Ga(this.parent._time,this):this._tTime;return this._rts=+t||0,this._ts=this._ps||t===-X?0:this._rts,this.totalTime(kt(-Math.abs(this._delay),this._tDur,e),!0),Ha(this),function _recacheAncestors(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t}(this)},qt.paused=function paused(t){return arguments.length?(this._ps!==t&&((this._ps=t)?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Ft(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,1===this.progress()&&Math.abs(this._zTime)!==X&&(this._tTime-=X)))),this):this._ps},qt.startTime=function startTime(t){if(arguments.length){this._start=t;var e=this.parent||this._dp;return!e||!e._sort&&this.parent||Ka(e,this,t-this._delay),this}return this._start},qt.endTime=function endTime(t){return this._start+(w(t)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},qt.rawTime=function rawTime(t){var e=this.parent||this._dp;return e?t&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Ga(e.rawTime(t),this):this._tTime:this._tTime},qt.revert=function revert(t){void 0===t&&(t=lt);var e=L;return L=t,(this._initted||this._startAt)&&(this.timeline&&this.timeline.revert(t),this.totalTime(-.01,t.suppressEvents)),"nested"!==this.data&&!1!==t.kill&&this.kill(),L=e,this},qt.globalTime=function globalTime(t){for(var e=this,r=arguments.length?t:e.rawTime();e;)r=e._start+r/(e._ts||1),e=e._dp;return!this.parent&&this._sat?this._sat.vars.immediateRender?-1/0:this._sat.globalTime(t):r},qt.repeat=function repeat(t){return arguments.length?(this._repeat=t===1/0?-2:t,Sa(this)):-2===this._repeat?1/0:this._repeat},qt.repeatDelay=function repeatDelay(t){if(arguments.length){var e=this._time;return this._rDelay=t,Sa(this),e?this.time(e):this}return this._rDelay},qt.yoyo=function yoyo(t){return arguments.length?(this._yoyo=t,this):this._yoyo},qt.seek=function seek(t,e){return this.totalTime(xt(this,t),w(e))},qt.restart=function restart(t,e){return this.play().totalTime(t?-this._delay:0,w(e))},qt.play=function play(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},qt.reverse=function reverse(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},qt.pause=function pause(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},qt.resume=function resume(){return this.paused(!1)},qt.reversed=function reversed(t){return arguments.length?(!!t!==this.reversed()&&this.timeScale(-this._rts||(t?-X:0)),this):this._rts<0},qt.invalidate=function invalidate(){return this._initted=this._act=0,this._zTime=-X,this},qt.isActive=function isActive(){var t,e=this.parent||this._dp,r=this._start;return!(e&&!(this._ts&&this._initted&&e.isActive()&&(t=e.rawTime(!0))>=r&&t<this.endTime(!0)-X))},qt.eventCallback=function eventCallback(t,e,r){var i=this.vars;return 1<arguments.length?(e?(i[t]=e,r&&(i[t+"Params"]=r),"onUpdate"===t&&(this._onUpdate=e)):delete i[t],this):i[t]},qt.then=function then(t){var i=this;return new Promise(function(e){function Bo(){var t=i.then;i.then=null,s(r)&&(r=r(i))&&(r.then||r===i)&&(i.then=t),e(r),i.then=t}var r=s(t)?t:pa;i._initted&&1===i.totalProgress()&&0<=i._ts||!i._tTime&&i._ts<0?Bo():i._prom=Bo})},qt.kill=function kill(){tb(this)},Animation);function Animation(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Ra(this,+t.duration,1,1),this.data=t.data,l&&(this._ctx=l).data.push(this),d||Rt.wake()}qa(Ut.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-X,_prom:0,_ps:!1,_rts:1});var Xt=function(i){function Timeline(t,e){var r;return void 0===t&&(t={}),(r=i.call(this,t)||this).labels={},r.smoothChildTiming=!!t.smoothChildTiming,r.autoRemoveChildren=!!t.autoRemoveChildren,r._sort=w(t.sortChildren),I&&Ka(t.parent||I,_assertThisInitialized(r),e),t.reversed&&r.reverse(),t.paused&&r.paused(!0),t.scrollTrigger&&La(_assertThisInitialized(r),t.scrollTrigger),r}_inheritsLoose(Timeline,i);var e=Timeline.prototype;return e.to=function to(t,e,r){return Va(0,arguments,this),this},e.from=function from(t,e,r){return Va(1,arguments,this),this},e.fromTo=function fromTo(t,e,r,i){return Va(2,arguments,this),this},e.set=function set(t,e,r){return e.duration=0,e.parent=this,va(e).repeatDelay||(e.repeat=0),e.immediateRender=!!e.immediateRender,new Zt(t,e,xt(this,r),1),this},e.call=function call(t,e,r){return Ka(this,Zt.delayedCall(0,t,e),r)},e.staggerTo=function staggerTo(t,e,r,i,n,a,s){return r.duration=e,r.stagger=r.stagger||i,r.onComplete=a,r.onCompleteParams=s,r.parent=this,new Zt(t,r,xt(this,n)),this},e.staggerFrom=function staggerFrom(t,e,r,i,n,a,s){return r.runBackwards=1,va(r).immediateRender=w(r.immediateRender),this.staggerTo(t,e,r,i,n,a,s)},e.staggerFromTo=function staggerFromTo(t,e,r,i,n,a,s,o){return i.startAt=r,va(i).immediateRender=w(i.immediateRender),this.staggerTo(t,e,i,n,a,s,o)},e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f,c,d,p,_=this._time,m=this._dirty?this.totalDuration():this._tDur,g=this._dur,v=t<=0?0:ja(t),y=this._zTime<0!=t<0&&(this._initted||!g);if(this!==I&&m<v&&0<=t&&(v=m),v!==this._tTime||r||y){if(_!==this._time&&g&&(v+=this._time-_,t+=this._time-_),i=v,f=this._start,u=!(l=this._ts),y&&(g||(_=this._zTime),!t&&e||(this._zTime=t)),this._repeat){if(d=this._yoyo,o=g+this._rDelay,this._repeat<-1&&t<0)return this.totalTime(100*o+t,e,r);if(i=ja(v%o),v===m?(s=this._repeat,i=g):((s=~~(v/o))&&s===v/o&&(i=g,s--),g<i&&(i=g)),c=Tt(this._tTime,o),!_&&this._tTime&&c!==s&&this._tTime-c*o-this._dur<=0&&(c=s),d&&1&s&&(i=g-i,p=1),s!==c&&!this._lock){var T=d&&1&c,b=T===(d&&1&s);if(s<c&&(T=!T),_=T?0:v%g?g:v,this._lock=1,this.render(_||(p?0:ja(s*o)),e,!g)._lock=0,this._tTime=v,!e&&this.parent&&At(this,"onRepeat"),this.vars.repeatRefresh&&!p&&(this.invalidate()._lock=1),_&&_!==this._time||u!=!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(g=this._dur,m=this._tDur,b&&(this._lock=2,_=T?g:-1e-4,this.render(_,!0),this.vars.repeatRefresh&&!p&&this.invalidate()),this._lock=0,!this._ts&&!u)return this;Qb(this,p)}}if(this._hasPause&&!this._forcing&&this._lock<2&&(h=function _findNextPauseTween(t,e,r){var i;if(e<r)for(i=t._first;i&&i._start<=r;){if("isPause"===i.data&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=r;){if("isPause"===i.data&&i._start<e)return i;i=i._prev}}(this,ja(_),ja(i)))&&(v-=i-(i=h._start)),this._tTime=v,this._time=i,this._act=!l,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=t,_=0),!_&&i&&!e&&!s&&(At(this,"onStart"),this._tTime!==v))return this;if(_<=i&&0<=t)for(n=this._first;n;){if(a=n._next,(n._act||i>=n._start)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(i-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(i-n._start)*n._ts,e,r),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=-X);break}}n=a}else{n=this._last;for(var w=t<0?t:i;n;){if(a=n._prev,(n._act||w<=n._end)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(w-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(w-n._start)*n._ts,e,r||L&&(n._initted||n._startAt)),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=w?-X:X);break}}n=a}}if(h&&!e&&(this.pause(),h.render(_<=i?0:-X)._zTime=_<=i?1:-1,this._ts))return this._start=f,Ha(this),this.render(t,e,r);this._onUpdate&&!e&&At(this,"onUpdate",!0),(v===m&&this._tTime>=this.totalDuration()||!v&&_)&&(f!==this._start&&Math.abs(l)===Math.abs(this._ts)||this._lock||(!t&&g||!(v===m&&0<this._ts||!v&&this._ts<0)||za(this,1),e||t<0&&!_||!v&&!_&&m||(At(this,v===m&&0<=t?"onComplete":"onReverseComplete",!0),!this._prom||v<m&&0<this.timeScale()||this._prom())))}return this},e.add=function add(e,i){var n=this;if(t(i)||(i=xt(this,i,e)),!(e instanceof Ut)){if($(e))return e.forEach(function(t){return n.add(t,i)}),this;if(r(e))return this.addLabel(e,i);if(!s(e))return this;e=Zt.delayedCall(0,e)}return this!==e?Ka(this,e,i):this},e.getChildren=function getChildren(t,e,r,i){void 0===t&&(t=!0),void 0===e&&(e=!0),void 0===r&&(r=!0),void 0===i&&(i=-U);for(var n=[],a=this._first;a;)a._start>=i&&(a instanceof Zt?e&&n.push(a):(r&&n.push(a),t&&n.push.apply(n,a.getChildren(!0,e,r)))),a=a._next;return n},e.getById=function getById(t){for(var e=this.getChildren(1,1,1),r=e.length;r--;)if(e[r].vars.id===t)return e[r]},e.remove=function remove(t){return r(t)?this.removeLabel(t):s(t)?this.killTweensOf(t):(ya(this,t),t===this._recent&&(this._recent=this._last),Aa(this))},e.totalTime=function totalTime(t,e){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=ja(Rt.time-(0<this._ts?t/this._ts:(this.totalDuration()-t)/-this._ts))),i.prototype.totalTime.call(this,t,e),this._forcing=0,this):this._tTime},e.addLabel=function addLabel(t,e){return this.labels[t]=xt(this,e),this},e.removeLabel=function removeLabel(t){return delete this.labels[t],this},e.addPause=function addPause(t,e,r){var i=Zt.delayedCall(0,e||T,r);return i.data="isPause",this._hasPause=1,Ka(this,i,xt(this,t))},e.removePause=function removePause(t){var e=this._first;for(t=xt(this,t);e;)e._start===t&&"isPause"===e.data&&za(e),e=e._next},e.killTweensOf=function killTweensOf(t,e,r){for(var i=this.getTweensOf(t,r),n=i.length;n--;)Nt!==i[n]&&i[n].kill(t,e);return this},e.getTweensOf=function getTweensOf(e,r){for(var i,n=[],a=Ot(e),s=this._first,o=t(r);s;)s instanceof Zt?la(s._targets,a)&&(o?(!Nt||s._initted&&s._ts)&&s.globalTime(0)<=r&&s.globalTime(s.totalDuration())>r:!r||s.isActive())&&n.push(s):(i=s.getTweensOf(a,r)).length&&n.push.apply(n,i),s=s._next;return n},e.tweenTo=function tweenTo(t,e){e=e||{};var r,i=this,n=xt(i,t),a=e.startAt,s=e.onStart,o=e.onStartParams,u=e.immediateRender,h=Zt.to(i,qa({ease:e.ease||"none",lazy:!1,immediateRender:!1,time:n,overwrite:"auto",duration:e.duration||Math.abs((n-(a&&"time"in a?a.time:i._time))/i.timeScale())||X,onStart:function onStart(){if(i.pause(),!r){var t=e.duration||Math.abs((n-(a&&"time"in a?a.time:i._time))/i.timeScale());h._dur!==t&&Ra(h,t,0,1).render(h._time,!0,!0),r=1}s&&s.apply(h,o||[])}},e));return u?h.render(0):h},e.tweenFromTo=function tweenFromTo(t,e,r){return this.tweenTo(e,qa({startAt:{time:xt(this,t)}},r))},e.recent=function recent(){return this._recent},e.nextLabel=function nextLabel(t){return void 0===t&&(t=this._time),rb(this,xt(this,t))},e.previousLabel=function previousLabel(t){return void 0===t&&(t=this._time),rb(this,xt(this,t),1)},e.currentLabel=function currentLabel(t){return arguments.length?this.seek(t,!0):this.previousLabel(this._time+X)},e.shiftChildren=function shiftChildren(t,e,r){void 0===r&&(r=0);for(var i,n=this._first,a=this.labels;n;)n._start>=r&&(n._start+=t,n._end+=t),n=n._next;if(e)for(i in a)a[i]>=r&&(a[i]+=t);return Aa(this)},e.invalidate=function invalidate(t){var e=this._first;for(this._lock=0;e;)e.invalidate(t),e=e._next;return i.prototype.invalidate.call(this,t)},e.clear=function clear(t){void 0===t&&(t=!0);for(var e,r=this._first;r;)e=r._next,this.remove(r),r=e;return this._dp&&(this._time=this._tTime=this._pTime=0),t&&(this.labels={}),Aa(this)},e.totalDuration=function totalDuration(t){var e,r,i,n=0,a=this,s=a._last,o=U;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-t:t));if(a._dirty){for(i=a.parent;s;)e=s._prev,s._dirty&&s.totalDuration(),o<(r=s._start)&&a._sort&&s._ts&&!a._lock?(a._lock=1,Ka(a,s,r-s._delay,1)._lock=0):o=r,r<0&&s._ts&&(n-=r,(!i&&!a._dp||i&&i.smoothChildTiming)&&(a._start+=r/a._ts,a._time-=r,a._tTime-=r),a.shiftChildren(-r,!1,-Infinity),o=0),s._end>n&&s._ts&&(n=s._end),s=e;Ra(a,a===I&&a._time>n?a._time:n,1,1),a._dirty=0}return a._tDur},Timeline.updateRoot=function updateRoot(t){if(I._ts&&(na(I,Ga(t,I)),f=Rt.frame),Rt.frame>=mt){mt+=q.autoSleep||120;var e=I._first;if((!e||!e._ts)&&q.autoSleep&&Rt._listeners.length<2){for(;e&&!e._ts;)e=e._next;e||Rt.sleep()}}},Timeline}(Ut);qa(Xt.prototype,{_lock:0,_hasPause:0,_forcing:0});function ac(t,e,i,n,a,o){var u,h,l,f;if(pt[t]&&!1!==(u=new pt[t]).init(a,u.rawVars?e[t]:function _processVars(t,e,i,n,a){if(s(t)&&(t=Kt(t,a,e,i,n)),!v(t)||t.style&&t.nodeType||$(t)||Z(t))return r(t)?Kt(t,a,e,i,n):t;var o,u={};for(o in t)u[o]=Kt(t[o],a,e,i,n);return u}(e[t],n,a,o,i),i,n,o)&&(i._pt=h=new _e(i._pt,a,t,0,1,u.render,u,0,u.priority),i!==c))for(l=i._ptLookup[i._targets.indexOf(a)],f=u._props.length;f--;)l[u._props[f]]=h;return u}function gc(t,r,e,i){var n,a,s=r.ease||i||"power1.inOut";if($(r))a=e[t]||(e[t]=[]),r.forEach(function(t,e){return a.push({t:e/(r.length-1)*100,v:t,e:s})});else for(n in r)a=e[n]||(e[n]=[]),"ease"===n||a.push({t:parseFloat(t),v:r[n],e:s})}var Nt,Wt,Qt=function _addPropTween(t,e,i,n,a,o,u,h,l,f){s(n)&&(n=n(a||0,t,o));var c,d=t[e],p="get"!==i?i:s(d)?l?t[e.indexOf("set")||!s(t["get"+e.substr(3)])?e:"get"+e.substr(3)](l):t[e]():d,_=s(d)?l?re:te:$t;if(r(n)&&(~n.indexOf("random(")&&(n=ob(n)),"="===n.charAt(1)&&(!(c=ka(p,n)+(Ya(p)||0))&&0!==c||(n=c))),!f||p!==n||Wt)return isNaN(p*n)||""===n?(d||e in t||Q(e,n),function _addComplexStringPropTween(t,e,r,i,n,a,s){var o,u,h,l,f,c,d,p,_=new _e(this._pt,t,e,0,1,ue,null,n),m=0,g=0;for(_.b=r,_.e=i,r+="",(d=~(i+="").indexOf("random("))&&(i=ob(i)),a&&(a(p=[r,i],t,e),r=p[0],i=p[1]),u=r.match(it)||[];o=it.exec(i);)l=o[0],f=i.substring(m,o.index),h?h=(h+1)%5:"rgba("===f.substr(-5)&&(h=1),l!==u[g++]&&(c=parseFloat(u[g-1])||0,_._pt={_next:_._pt,p:f||1===g?f:",",s:c,c:"="===l.charAt(1)?ka(c,l)-c:parseFloat(l)-c,m:h&&h<4?Math.round:0},m=it.lastIndex);return _.c=m<i.length?i.substring(m,i.length):"",_.fp=s,(nt.test(i)||d)&&(_.e=0),this._pt=_}.call(this,t,e,p,n,_,h||q.stringFilter,l)):(c=new _e(this._pt,t,e,+p||0,n-(p||0),"boolean"==typeof d?se:ae,0,_),l&&(c.fp=l),u&&c.modifier(u,this,t),this._pt=c)},Gt=function _initTween(t,e,r){var i,n,a,s,o,u,h,l,f,c,d,p,_,m=t.vars,g=m.ease,v=m.startAt,y=m.immediateRender,T=m.lazy,b=m.onUpdate,x=m.onUpdateParams,k=m.callbackScope,M=m.runBackwards,O=m.yoyoEase,P=m.keyframes,A=m.autoRevert,C=t._dur,S=t._startAt,E=t._targets,D=t.parent,z=D&&"nested"===D.data?D.vars.targets:E,R="auto"===t._overwrite&&!B,F=t.timeline;if(!F||P&&g||(g="none"),t._ease=jt(g,V.ease),t._yEase=O?Yt(jt(!0===O?g:O,V.ease)):0,O&&t._yoyo&&!t._repeat&&(O=t._yEase,t._yEase=t._ease,t._ease=O),t._from=!F&&!!m.runBackwards,!F||P&&!m.stagger){if(p=(l=E[0]?fa(E[0]).harness:0)&&m[l.prop],i=ua(m,ft),S&&(S._zTime<0&&S.progress(1),e<0&&M&&y&&!A?S.render(-1,!0):S.revert(M&&C?ht:ut),S._lazy=0),v){if(za(t._startAt=Zt.set(E,qa({data:"isStart",overwrite:!1,parent:D,immediateRender:!0,lazy:!S&&w(T),startAt:null,delay:0,onUpdate:b,onUpdateParams:x,callbackScope:k,stagger:0},v))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(L||!y&&!A)&&t._startAt.revert(ht),y&&C&&e<=0&&r<=0)return void(e&&(t._zTime=e))}else if(M&&C&&!S)if(e&&(y=!1),a=qa({overwrite:!1,data:"isFromStart",lazy:y&&!S&&w(T),immediateRender:y,stagger:0,parent:D},i),p&&(a[l.prop]=p),za(t._startAt=Zt.set(E,a)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(L?t._startAt.revert(ht):t._startAt.render(-1,!0)),t._zTime=e,y){if(!e)return}else _initTween(t._startAt,X,X);for(t._pt=t._ptCache=0,T=C&&w(T)||T&&!C,n=0;n<E.length;n++){if(h=(o=E[n])._gsap||ea(E)[n]._gsap,t._ptLookup[n]=c={},dt[h.id]&&ct.length&&ma(),d=z===E?n:z.indexOf(o),l&&!1!==(f=new l).init(o,p||i,t,d,z)&&(t._pt=s=new _e(t._pt,o,f.name,0,1,f.render,f,0,f.priority),f._props.forEach(function(t){c[t]=s}),f.priority&&(u=1)),!l||p)for(a in i)pt[a]&&(f=ac(a,i,t,d,o,z))?f.priority&&(u=1):c[a]=s=Qt.call(t,o,a,"get",i[a],d,z,0,m.stringFilter);t._op&&t._op[n]&&t.kill(o,t._op[n]),R&&t._pt&&(Nt=t,I.killTweensOf(o,c,t.globalTime(e)),_=!t.parent,Nt=0),t._pt&&T&&(dt[h.id]=1)}u&&pe(t),t._onInit&&t._onInit(t)}t._onUpdate=b,t._initted=(!t._op||t._pt)&&!_,P&&e<=0&&F.render(U,!0,!0)},Kt=function _parseFuncOrString(t,e,i,n,a){return s(t)?t.call(e,i,n,a):r(t)&&~t.indexOf("random(")?ob(t):t},Jt=vt+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",Ht={};ha(Jt+",id,stagger,delay,duration,paused,scrollTrigger",function(t){return Ht[t]=1});var Zt=function(z){function Tween(e,r,i,n){var a;"number"==typeof r&&(i.duration=r,r=i,i=null);var s,o,u,h,l,f,c,d,p=(a=z.call(this,n?r:va(r))||this).vars,_=p.duration,m=p.delay,g=p.immediateRender,T=p.stagger,b=p.overwrite,x=p.keyframes,k=p.defaults,M=p.scrollTrigger,O=p.yoyoEase,P=r.parent||I,A=($(e)||Z(e)?t(e[0]):"length"in r)?[e]:Ot(e);if(a._targets=A.length?ea(A):R("GSAP target "+e+" not found. https://greensock.com",!q.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=b,x||T||y(_)||y(m)){if(r=a.vars,(s=a.timeline=new Xt({data:"nested",defaults:k||{},targets:P&&"nested"===P.data?P.vars.targets:A})).kill(),s.parent=s._dp=_assertThisInitialized(a),s._start=0,T||y(_)||y(m)){if(h=A.length,c=T&&eb(T),v(T))for(l in T)~Jt.indexOf(l)&&((d=d||{})[l]=T[l]);for(o=0;o<h;o++)(u=ua(r,Ht)).stagger=0,O&&(u.yoyoEase=O),d&&yt(u,d),f=A[o],u.duration=+Kt(_,_assertThisInitialized(a),o,f,A),u.delay=(+Kt(m,_assertThisInitialized(a),o,f,A)||0)-a._delay,!T&&1===h&&u.delay&&(a._delay=m=u.delay,a._start+=m,u.delay=0),s.to(f,u,c?c(o,f,A):0),s._ease=Bt.none;s.duration()?_=m=0:a.timeline=0}else if(x){va(qa(s.vars.defaults,{ease:"none"})),s._ease=jt(x.ease||r.ease||"none");var C,S,E,D=0;if($(x))x.forEach(function(t){return s.to(A,t,">")}),s.duration();else{for(l in u={},x)"ease"===l||"easeEach"===l||gc(l,x[l],u,x.easeEach);for(l in u)for(C=u[l].sort(function(t,e){return t.t-e.t}),o=D=0;o<C.length;o++)(E={ease:(S=C[o]).e,duration:(S.t-(o?C[o-1].t:0))/100*_})[l]=S.v,s.to(A,E,D),D+=E.duration;s.duration()<_&&s.to({},{duration:_-s.duration()})}}_||a.duration(_=s.duration())}else a.timeline=0;return!0!==b||B||(Nt=_assertThisInitialized(a),I.killTweensOf(A),Nt=0),Ka(P,_assertThisInitialized(a),i),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(g||!_&&!x&&a._start===ja(P._time)&&w(g)&&function _hasNoPausedAncestors(t){return!t||t._ts&&_hasNoPausedAncestors(t.parent)}(_assertThisInitialized(a))&&"nested"!==P.data)&&(a._tTime=-X,a.render(Math.max(0,-m)||0)),M&&La(_assertThisInitialized(a),M),a}_inheritsLoose(Tween,z);var e=Tween.prototype;return e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f,c=this._time,d=this._tDur,p=this._dur,_=t<0,m=d-X<t&&!_?d:t<X?0:t;if(p){if(m!==this._tTime||!t||r||!this._initted&&this._tTime||this._startAt&&this._zTime<0!=_){if(i=m,l=this.timeline,this._repeat){if(s=p+this._rDelay,this._repeat<-1&&_)return this.totalTime(100*s+t,e,r);if(i=ja(m%s),m===d?(a=this._repeat,i=p):((a=~~(m/s))&&a===m/s&&(i=p,a--),p<i&&(i=p)),(u=this._yoyo&&1&a)&&(f=this._yEase,i=p-i),o=Tt(this._tTime,s),i===c&&!r&&this._initted)return this._tTime=m,this;a!==o&&(l&&this._yEase&&Qb(l,u),!this.vars.repeatRefresh||u||this._lock||(this._lock=r=1,this.render(ja(s*a),!0).invalidate()._lock=0))}if(!this._initted){if(Ma(this,_?t:i,r,e,m))return this._tTime=0,this;if(c!==this._time)return this;if(p!==this._dur)return this.render(t,e,r)}if(this._tTime=m,this._time=i,!this._act&&this._ts&&(this._act=1,this._lazy=0),this.ratio=h=(f||this._ease)(i/p),this._from&&(this.ratio=h=1-h),i&&!c&&!e&&!a&&(At(this,"onStart"),this._tTime!==m))return this;for(n=this._pt;n;)n.r(h,n.d),n=n._next;l&&l.render(t<0?t:!i&&u?-X:l._dur*l._ease(i/this._dur),e,r)||this._startAt&&(this._zTime=t),this._onUpdate&&!e&&(_&&Ca(this,t,0,r),At(this,"onUpdate")),this._repeat&&a!==o&&this.vars.onRepeat&&!e&&this.parent&&At(this,"onRepeat"),m!==this._tDur&&m||this._tTime!==m||(_&&!this._onUpdate&&Ca(this,t,0,!0),!t&&p||!(m===this._tDur&&0<this._ts||!m&&this._ts<0)||za(this,1),e||_&&!c||!(m||c||u)||(At(this,m===d?"onComplete":"onReverseComplete",!0),!this._prom||m<d&&0<this.timeScale()||this._prom()))}}else!function _renderZeroDurationTween(t,e,r,i){var n,a,s,o=t.ratio,u=e<0||!e&&(!t._start&&function _parentPlayheadIsBeforeStart(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||_parentPlayheadIsBeforeStart(e))}(t)&&(t._initted||!bt(t))||(t._ts<0||t._dp._ts<0)&&!bt(t))?0:1,h=t._rDelay,l=0;if(h&&t._repeat&&(l=kt(0,t._tDur,e),a=Tt(l,h),t._yoyo&&1&a&&(u=1-u),a!==Tt(t._tTime,h)&&(o=1-u,t.vars.repeatRefresh&&t._initted&&t.invalidate())),u!==o||L||i||t._zTime===X||!e&&t._zTime){if(!t._initted&&Ma(t,e,i,r,l))return;for(s=t._zTime,t._zTime=e||(r?X:0),r=r||e&&!s,t.ratio=u,t._from&&(u=1-u),t._time=0,t._tTime=l,n=t._pt;n;)n.r(u,n.d),n=n._next;e<0&&Ca(t,e,0,!0),t._onUpdate&&!r&&At(t,"onUpdate"),l&&t._repeat&&!r&&t.parent&&At(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===u&&(u&&za(t,1),r||L||(At(t,u?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)}(this,t,e,r);return this},e.targets=function targets(){return this._targets},e.invalidate=function invalidate(t){return t&&this.vars.runBackwards||(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(t),z.prototype.invalidate.call(this,t)},e.resetTo=function resetTo(t,e,r,i){d||Rt.wake(),this._ts||this.play();var n,a=Math.min(this._dur,(this._dp._time-this._start)*this._ts);return this._initted||Gt(this,a),n=this._ease(a/this._dur),function _updatePropTweens(t,e,r,i,n,a,s){var o,u,h,l,f=(t._pt&&t._ptCache||(t._ptCache={}))[e];if(!f)for(f=t._ptCache[e]=[],h=t._ptLookup,l=t._targets.length;l--;){if((o=h[l][e])&&o.d&&o.d._pt)for(o=o.d._pt;o&&o.p!==e&&o.fp!==e;)o=o._next;if(!o)return Wt=1,t.vars[e]="+=0",Gt(t,s),Wt=0,1;f.push(o)}for(l=f.length;l--;)(o=(u=f[l])._pt||u).s=!i&&0!==i||n?o.s+(i||0)+a*o.c:i,o.c=r-o.s,u.e&&(u.e=ia(r)+Ya(u.e)),u.b&&(u.b=o.s+Ya(u.b))}(this,t,e,r,i,n,a)?this.resetTo(t,e,r,i):(Ia(this,0),this.parent||xa(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function kill(t,e){if(void 0===e&&(e="all"),!(t||e&&"all"!==e))return this._lazy=this._pt=0,this.parent?tb(this):this;if(this.timeline){var i=this.timeline.totalDuration();return this.timeline.killTweensOf(t,e,Nt&&!0!==Nt.vars.overwrite)._first||tb(this),this.parent&&i!==this.timeline.totalDuration()&&Ra(this,this._dur*this.timeline._tDur/i,0,1),this}var n,a,s,o,u,h,l,f=this._targets,c=t?Ot(t):f,d=this._ptLookup,p=this._pt;if((!e||"all"===e)&&function _arraysMatch(t,e){for(var r=t.length,i=r===e.length;i&&r--&&t[r]===e[r];);return r<0}(f,c))return"all"===e&&(this._pt=0),tb(this);for(n=this._op=this._op||[],"all"!==e&&(r(e)&&(u={},ha(e,function(t){return u[t]=1}),e=u),e=function _addAliasesToVars(t,e){var r,i,n,a,s=t[0]?fa(t[0]).harness:0,o=s&&s.aliases;if(!o)return e;for(i in r=yt({},e),o)if(i in r)for(n=(a=o[i].split(",")).length;n--;)r[a[n]]=r[i];return r}(f,e)),l=f.length;l--;)if(~c.indexOf(f[l]))for(u in a=d[l],"all"===e?(n[l]=e,o=a,s={}):(s=n[l]=n[l]||{},o=e),o)(h=a&&a[u])&&("kill"in h.d&&!0!==h.d.kill(u)||ya(this,h,"_pt"),delete a[u]),"all"!==s&&(s[u]=1);return this._initted&&!this._pt&&p&&tb(this),this},Tween.to=function to(t,e,r){return new Tween(t,e,r)},Tween.from=function from(t,e){return Va(1,arguments)},Tween.delayedCall=function delayedCall(t,e,r,i){return new Tween(e,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:t,onComplete:e,onReverseComplete:e,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:i})},Tween.fromTo=function fromTo(t,e,r){return Va(2,arguments)},Tween.set=function set(t,e){return e.duration=0,e.repeatDelay||(e.repeat=0),new Tween(t,e)},Tween.killTweensOf=function killTweensOf(t,e,r){return I.killTweensOf(t,e,r)},Tween}(Ut);qa(Zt.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0}),ha("staggerTo,staggerFrom,staggerFromTo",function(r){Zt[r]=function(){var t=new Xt,e=Mt.call(arguments,0);return e.splice("staggerFromTo"===r?5:4,0,0),t[r].apply(t,e)}});function oc(t,e,r){return t.setAttribute(e,r)}function wc(t,e,r,i){i.mSet(t,e,i.m.call(i.tween,r,i.mt),i)}var $t=function _setterPlain(t,e,r){return t[e]=r},te=function _setterFunc(t,e,r){return t[e](r)},re=function _setterFuncWithParam(t,e,r,i){return t[e](i.fp,r)},ne=function _getSetter(t,e){return s(t[e])?te:u(t[e])&&t.setAttribute?oc:$t},ae=function _renderPlain(t,e){return e.set(e.t,e.p,Math.round(1e6*(e.s+e.c*t))/1e6,e)},se=function _renderBoolean(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},ue=function _renderComplexString(t,e){var r=e._pt,i="";if(!t&&e.b)i=e.b;else if(1===t&&e.e)i=e.e;else{for(;r;)i=r.p+(r.m?r.m(r.s+r.c*t):Math.round(1e4*(r.s+r.c*t))/1e4)+i,r=r._next;i+=e.c}e.set(e.t,e.p,i,e)},he=function _renderPropTweens(t,e){for(var r=e._pt;r;)r.r(t,r.d),r=r._next},fe=function _addPluginModifier(t,e,r,i){for(var n,a=this._pt;a;)n=a._next,a.p===i&&a.modifier(t,e,r),a=n},ce=function _killPropTweensOf(t){for(var e,r,i=this._pt;i;)r=i._next,i.p===t&&!i.op||i.op===t?ya(this,i,"_pt"):i.dep||(e=1),i=r;return!e},pe=function _sortPropTweensByPriority(t){for(var e,r,i,n,a=t._pt;a;){for(e=a._next,r=i;r&&r.pr>a.pr;)r=r._next;(a._prev=r?r._prev:n)?a._prev._next=a:i=a,(a._next=r)?r._prev=a:n=a,a=e}t._pt=i},_e=(PropTween.prototype.modifier=function modifier(t,e,r){this.mSet=this.mSet||this.set,this.set=wc,this.m=t,this.mt=r,this.tween=e},PropTween);function PropTween(t,e,r,i,n,a,s,o,u){this.t=e,this.s=i,this.c=n,this.p=r,this.r=a||ae,this.d=s||this,this.set=o||$t,this.pr=u||0,(this._next=t)&&(t._prev=this)}ha(vt+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",function(t){return ft[t]=1}),ot.TweenMax=ot.TweenLite=Zt,ot.TimelineLite=ot.TimelineMax=Xt,I=new Xt({sortChildren:!1,defaults:V,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0}),q.stringFilter=Fb;function Ec(t){return(ye[t]||Te).map(function(t){return t()})}function Fc(){var t=Date.now(),o=[];2<t-Me&&(Ec("matchMediaInit"),ge.forEach(function(t){var e,r,i,n,a=t.queries,s=t.conditions;for(r in a)(e=h.matchMedia(a[r]).matches)&&(i=1),e!==s[r]&&(s[r]=e,n=1);n&&(t.revert(),i&&o.push(t))}),Ec("matchMediaRevert"),o.forEach(function(t){return t.onMatch(t)}),Me=t,Ec("matchMedia"))}var me,ge=[],ye={},Te=[],Me=0,Oe=0,Pe=((me=Context.prototype).add=function add(t,i,n){function Ew(){var t,e=l,r=a.selector;return e&&e!==a&&e.data.push(a),n&&(a.selector=cb(n)),l=a,t=i.apply(a,arguments),s(t)&&a._r.push(t),l=e,a.selector=r,a.isReverted=!1,t}s(t)&&(n=i,i=t,t=s);var a=this;return a.last=Ew,t===s?Ew(a):t?a[t]=Ew:Ew},me.ignore=function ignore(t){var e=l;l=null,t(this),l=e},me.getTweens=function getTweens(){var e=[];return this.data.forEach(function(t){return t instanceof Context?e.push.apply(e,t.getTweens()):t instanceof Zt&&!(t.parent&&"nested"===t.parent.data)&&e.push(t)}),e},me.clear=function clear(){this._r.length=this.data.length=0},me.kill=function kill(e,t){var r=this;if(e){var i=this.getTweens();this.data.forEach(function(t){"isFlip"===t.data&&(t.revert(),t.getChildren(!0,!0,!1).forEach(function(t){return i.splice(i.indexOf(t),1)}))}),i.map(function(t){return{g:t.globalTime(0),t:t}}).sort(function(t,e){return e.g-t.g||-1/0}).forEach(function(t){return t.t.revert(e)}),this.data.forEach(function(t){return!(t instanceof Zt)&&t.revert&&t.revert(e)}),this._r.forEach(function(t){return t(e,r)}),this.isReverted=!0}else this.data.forEach(function(t){return t.kill&&t.kill()});if(this.clear(),t)for(var n=ge.length;n--;)ge[n].id===this.id&&ge.splice(n,1)},me.revert=function revert(t){this.kill(t||{})},Context);function Context(t,e){this.selector=e&&cb(e),this.data=[],this._r=[],this.isReverted=!1,this.id=Oe++,t&&this.add(t)}var Ae,Ce=((Ae=MatchMedia.prototype).add=function add(t,e,r){v(t)||(t={matches:t});var i,n,a,s=new Pe(0,r||this.scope),o=s.conditions={};for(n in l&&!s.selector&&(s.selector=l.selector),this.contexts.push(s),e=s.add("onMatch",e),s.queries=t)"all"===n?a=1:(i=h.matchMedia(t[n]))&&(ge.indexOf(s)<0&&ge.push(s),(o[n]=i.matches)&&(a=1),i.addListener?i.addListener(Fc):i.addEventListener("change",Fc));return a&&e(s),this},Ae.revert=function revert(t){this.kill(t||{})},Ae.kill=function kill(e){this.contexts.forEach(function(t){return t.kill(e,!0)})},MatchMedia);function MatchMedia(t){this.contexts=[],this.scope=t}var Se={registerPlugin:function registerPlugin(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];e.forEach(function(t){return wb(t)})},timeline:function timeline(t){return new Xt(t)},getTweensOf:function getTweensOf(t,e){return I.getTweensOf(t,e)},getProperty:function getProperty(i,t,e,n){r(i)&&(i=Ot(i)[0]);var a=fa(i||{}).get,s=e?pa:oa;return"native"===e&&(e=""),i?t?s((pt[t]&&pt[t].get||a)(i,t,e,n)):function(t,e,r){return s((pt[t]&&pt[t].get||a)(i,t,e,r))}:i},quickSetter:function quickSetter(r,e,i){if(1<(r=Ot(r)).length){var n=r.map(function(t){return Ee.quickSetter(t,e,i)}),a=n.length;return function(t){for(var e=a;e--;)n[e](t)}}r=r[0]||{};var s=pt[e],o=fa(r),u=o.harness&&(o.harness.aliases||{})[e]||e,h=s?function(t){var e=new s;c._pt=0,e.init(r,i?t+i:t,c,0,[r]),e.render(1,e),c._pt&&he(1,c)}:o.set(r,u);return s?h:function(t){return h(r,u,i?t+i:t,o,1)}},quickTo:function quickTo(t,i,e){function Wx(t,e,r){return n.resetTo(i,t,e,r)}var r,n=Ee.to(t,yt(((r={})[i]="+=0.1",r.paused=!0,r),e||{}));return Wx.tween=n,Wx},isTweening:function isTweening(t){return 0<I.getTweensOf(t,!0).length},defaults:function defaults(t){return t&&t.ease&&(t.ease=jt(t.ease,V.ease)),ta(V,t||{})},config:function config(t){return ta(q,t||{})},registerEffect:function registerEffect(t){var i=t.name,n=t.effect,e=t.plugins,a=t.defaults,r=t.extendTimeline;(e||"").split(",").forEach(function(t){return t&&!pt[t]&&!ot[t]&&R(i+" effect requires "+t+" plugin.")}),_t[i]=function(t,e,r){return n(Ot(t),qa(e||{},a),r)},r&&(Xt.prototype[i]=function(t,e,r){return this.add(_t[i](t,v(e)?e:(r=e)&&{},this),r)})},registerEase:function registerEase(t,e){Bt[t]=jt(e)},parseEase:function parseEase(t,e){return arguments.length?jt(t,e):Bt},getById:function getById(t){return I.getById(t)},exportRoot:function exportRoot(t,e){void 0===t&&(t={});var r,i,n=new Xt(t);for(n.smoothChildTiming=w(t.smoothChildTiming),I.remove(n),n._dp=0,n._time=n._tTime=I._time,r=I._first;r;)i=r._next,!e&&!r._dur&&r instanceof Zt&&r.vars.onComplete===r._targets[0]||Ka(n,r,r._start-r._delay),r=i;return Ka(I,n,0),n},context:function context(t,e){return t?new Pe(t,e):l},matchMedia:function matchMedia(t){return new Ce(t)},matchMediaRefresh:function matchMediaRefresh(){return ge.forEach(function(t){var e,r,i=t.conditions;for(r in i)i[r]&&(i[r]=!1,e=1);e&&t.revert()})||Fc()},addEventListener:function addEventListener(t,e){var r=ye[t]||(ye[t]=[]);~r.indexOf(e)||r.push(e)},removeEventListener:function removeEventListener(t,e){var r=ye[t],i=r&&r.indexOf(e);0<=i&&r.splice(i,1)},utils:{wrap:function wrap(e,t,r){var i=t-e;return $(e)?lb(e,wrap(0,e.length),t):Wa(r,function(t){return(i+(t-e)%i)%i+e})},wrapYoyo:function wrapYoyo(e,t,r){var i=t-e,n=2*i;return $(e)?lb(e,wrapYoyo(0,e.length-1),t):Wa(r,function(t){return e+(i<(t=(n+(t-e)%n)%n||0)?n-t:t)})},distribute:eb,random:hb,snap:gb,normalize:function normalize(t,e,r){return Pt(t,e,0,1,r)},getUnit:Ya,clamp:function clamp(e,r,t){return Wa(t,function(t){return kt(e,r,t)})},splitColor:Ab,toArray:Ot,selector:cb,mapRange:Pt,pipe:function pipe(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return function(t){return e.reduce(function(t,e){return e(t)},t)}},unitize:function unitize(e,r){return function(t){return e(parseFloat(t))+(r||Ya(t))}},interpolate:function interpolate(e,i,t,n){var a=isNaN(e+i)?0:function(t){return(1-t)*e+t*i};if(!a){var s,o,u,h,l,f=r(e),c={};if(!0===t&&(n=1)&&(t=null),f)e={p:e},i={p:i};else if($(e)&&!$(i)){for(u=[],h=e.length,l=h-2,o=1;o<h;o++)u.push(interpolate(e[o-1],e[o]));h--,a=function func(t){t*=h;var e=Math.min(l,~~t);return u[e](t-e)},t=i}else n||(e=yt($(e)?[]:{},e));if(!u){for(s in i)Qt.call(c,e,s,"get",i[s]);a=function func(t){return he(t,c)||(f?e.p:e)}}}return Wa(t,a)},shuffle:db},install:P,effects:_t,ticker:Rt,updateRoot:Xt.updateRoot,plugins:pt,globalTimeline:I,core:{PropTween:_e,globals:S,Tween:Zt,Timeline:Xt,Animation:Ut,getCache:fa,_removeLinkedListItem:ya,reverting:function reverting(){return L},context:function context(t){return t&&l&&(l.data.push(t),t._ctx=l),l},suppressOverwrites:function suppressOverwrites(t){return B=t}}};ha("to,from,fromTo,delayedCall,set,killTweensOf",function(t){return Se[t]=Zt[t]}),Rt.add(Xt.updateRoot),c=Se.to({},{duration:0});function Jc(t,e){for(var r=t._pt;r&&r.p!==e&&r.op!==e&&r.fp!==e;)r=r._next;return r}function Lc(t,a){return{name:t,rawVars:1,init:function init(t,n,e){e._onInit=function(t){var e,i;if(r(n)&&(e={},ha(n,function(t){return e[t]=1}),n=e),a){for(i in e={},n)e[i]=a(n[i]);n=e}!function _addModifiers(t,e){var r,i,n,a=t._targets;for(r in e)for(i=a.length;i--;)(n=(n=t._ptLookup[i][r])&&n.d)&&(n._pt&&(n=Jc(n,r)),n&&n.modifier&&n.modifier(e[r],t,a[i],r))}(t,n)}}}}var Ee=Se.registerPlugin({name:"attr",init:function init(t,e,r,i,n){var a,s,o;for(a in this.tween=r,e)o=t.getAttribute(a)||"",(s=this.add(t,"setAttribute",(o||0)+"",e[a],i,n,0,0,a)).op=a,s.b=o,this._props.push(a)},render:function render(t,e){for(var r=e._pt;r;)L?r.set(r.t,r.p,r.b,r):r.r(t,r.d),r=r._next}},{name:"endArray",init:function init(t,e){for(var r=e.length;r--;)this.add(t,r,t[r]||0,e[r],0,0,0,0,0,1)}},Lc("roundProps",fb),Lc("modifiers"),Lc("snap",gb))||Se;Zt.version=Xt.version=Ee.version="3.12.2",o=1,x()&&Ft();function vd(t,e){return e.set(e.t,e.p,Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function wd(t,e){return e.set(e.t,e.p,1===t?e.e:Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function xd(t,e){return e.set(e.t,e.p,t?Math.round(1e4*(e.s+e.c*t))/1e4+e.u:e.b,e)}function yd(t,e){var r=e.s+e.c*t;e.set(e.t,e.p,~~(r+(r<0?-.5:.5))+e.u,e)}function zd(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)}function Ad(t,e){return e.set(e.t,e.p,1!==t?e.b:e.e,e)}function Bd(t,e,r){return t.style[e]=r}function Cd(t,e,r){return t.style.setProperty(e,r)}function Dd(t,e,r){return t._gsap[e]=r}function Ed(t,e,r){return t._gsap.scaleX=t._gsap.scaleY=r}function Fd(t,e,r,i,n){var a=t._gsap;a.scaleX=a.scaleY=r,a.renderTransform(n,a)}function Gd(t,e,r,i,n){var a=t._gsap;a[e]=r,a.renderTransform(n,a)}function Jd(t,e){var r=this,i=this.target,n=i.style;if(t in ar&&n){if(this.tfm=this.tfm||{},"transform"===t)return cr.transform.split(",").forEach(function(t){return Jd.call(r,t,e)});if(~(t=cr[t]||t).indexOf(",")?t.split(",").forEach(function(t){return r.tfm[t]=yr(i,t)}):this.tfm[t]=i._gsap.x?i._gsap[t]:yr(i,t),0<=this.props.indexOf(dr))return;i._gsap.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(pr,e,"")),t=dr}(n||e)&&this.props.push(t,e,n[t])}function Kd(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))}function Ld(){var t,e,r=this.props,i=this.target,n=i.style,a=i._gsap;for(t=0;t<r.length;t+=3)r[t+1]?i[r[t]]=r[t+2]:r[t+2]?n[r[t]]=r[t+2]:n.removeProperty("--"===r[t].substr(0,2)?r[t]:r[t].replace(hr,"-$1").toLowerCase());if(this.tfm){for(e in this.tfm)a[e]=this.tfm[e];a.svg&&(a.renderTransform(),i.setAttribute("data-svg-origin",this.svgo||"")),(t=Ie())&&t.isStart||n[dr]||(Kd(n),a.uncache=1)}}function Md(t,e){var r={target:t,props:[],revert:Ld,save:Jd};return t._gsap||Ee.core.getCache(t),e&&e.split(",").forEach(function(t){return r.save(t)}),r}function Od(t,e){var r=ze.createElementNS?ze.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):ze.createElement(t);return r.style?r:ze.createElement(t)}function Pd(t,e,r){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(hr,"-$1").toLowerCase())||i.getPropertyValue(e)||!r&&Pd(t,mr(e)||e,1)||""}function Sd(){(function _windowExists(){return"undefined"!=typeof window})()&&window.document&&(De=window,ze=De.document,Re=ze.documentElement,Be=Od("div")||{style:{}},Od("div"),dr=mr(dr),pr=dr+"Origin",Be.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Ye=!!mr("perspective"),Ie=Ee.core.reverting,Fe=1)}function Td(t){var e,r=Od("svg",this.ownerSVGElement&&this.ownerSVGElement.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=this.parentNode,n=this.nextSibling,a=this.style.cssText;if(Re.appendChild(r),r.appendChild(this),this.style.display="block",t)try{e=this.getBBox(),this._gsapBBox=this.getBBox,this.getBBox=Td}catch(t){}else this._gsapBBox&&(e=this._gsapBBox());return i&&(n?i.insertBefore(this,n):i.appendChild(this)),Re.removeChild(r),this.style.cssText=a,e}function Ud(t,e){for(var r=e.length;r--;)if(t.hasAttribute(e[r]))return t.getAttribute(e[r])}function Vd(e){var r;try{r=e.getBBox()}catch(t){r=Td.call(e,!0)}return r&&(r.width||r.height)||e.getBBox===Td||(r=Td.call(e,!0)),!r||r.width||r.x||r.y?r:{x:+Ud(e,["x","cx","x1"])||0,y:+Ud(e,["y","cy","y1"])||0,width:0,height:0}}function Wd(t){return!(!t.getCTM||t.parentNode&&!t.ownerSVGElement||!Vd(t))}function Xd(t,e){if(e){var r=t.style;e in ar&&e!==pr&&(e=dr),r.removeProperty?("ms"!==e.substr(0,2)&&"webkit"!==e.substr(0,6)||(e="-"+e),r.removeProperty(e.replace(hr,"-$1").toLowerCase())):r.removeAttribute(e)}}function Yd(t,e,r,i,n,a){var s=new _e(t._pt,e,r,0,1,a?Ad:zd);return(t._pt=s).b=i,s.e=n,t._props.push(r),s}function _d(t,e,r,i){var n,a,s,o,u=parseFloat(r)||0,h=(r+"").trim().substr((u+"").length)||"px",l=Be.style,f=lr.test(e),c="svg"===t.tagName.toLowerCase(),d=(c?"client":"offset")+(f?"Width":"Height"),p="px"===i,_="%"===i;return i===h||!u||gr[i]||gr[h]?u:("px"===h||p||(u=_d(t,e,r,"px")),o=t.getCTM&&Wd(t),!_&&"%"!==h||!ar[e]&&!~e.indexOf("adius")?(l[f?"width":"height"]=100+(p?h:i),a=~e.indexOf("adius")||"em"===i&&t.appendChild&&!c?t:t.parentNode,o&&(a=(t.ownerSVGElement||{}).parentNode),a&&a!==ze&&a.appendChild||(a=ze.body),(s=a._gsap)&&_&&s.width&&f&&s.time===Rt.time&&!s.uncache?ia(u/s.width*100):(!_&&"%"!==h||vr[Pd(a,"display")]||(l.position=Pd(t,"position")),a===t&&(l.position="static"),a.appendChild(Be),n=Be[d],a.removeChild(Be),l.position="absolute",f&&_&&((s=fa(a)).time=Rt.time,s.width=a[d]),ia(p?n*u/100:n&&u?100/n*u:0))):(n=o?t.getBBox()[f?"width":"height"]:t[d],ia(_?u/n*100:u/100*n)))}function be(t,e,r,i){if(!r||"none"===r){var n=mr(e,t,1),a=n&&Pd(t,n,1);a&&a!==r?(e=n,r=a):"borderColor"===e&&(r=Pd(t,"borderTopColor"))}var s,o,u,h,l,f,c,d,p,_,m,g=new _e(this._pt,t.style,e,0,1,ue),v=0,y=0;if(g.b=r,g.e=i,r+="","auto"===(i+="")&&(t.style[e]=i,i=Pd(t,e)||i,t.style[e]=r),Fb(s=[r,i]),i=s[1],u=(r=s[0]).match(rt)||[],(i.match(rt)||[]).length){for(;o=rt.exec(i);)c=o[0],p=i.substring(v,o.index),l?l=(l+1)%5:"rgba("!==p.substr(-5)&&"hsla("!==p.substr(-5)||(l=1),c!==(f=u[y++]||"")&&(h=parseFloat(f)||0,m=f.substr((h+"").length),"="===c.charAt(1)&&(c=ka(h,c)+m),d=parseFloat(c),_=c.substr((d+"").length),v=rt.lastIndex-_.length,_||(_=_||q.units[e]||m,v===i.length&&(i+=_,g.e+=_)),m!==_&&(h=_d(t,e,f,_)||0),g._pt={_next:g._pt,p:p||1===y?p:",",s:h,c:d-h,m:l&&l<4||"zIndex"===e?Math.round:0});g.c=v<i.length?i.substring(v,i.length):""}else g.r="display"===e&&"none"===i?Ad:zd;return nt.test(i)&&(g.e=0),this._pt=g}function de(t){var e=t.split(" "),r=e[0],i=e[1]||"50%";return"top"!==r&&"bottom"!==r&&"left"!==i&&"right"!==i||(t=r,r=i,i=t),e[0]=Tr[r]||r,e[1]=Tr[i]||i,e.join(" ")}function ee(t,e){if(e.tween&&e.tween._time===e.tween._dur){var r,i,n,a=e.t,s=a.style,o=e.u,u=a._gsap;if("all"===o||!0===o)s.cssText="",i=1;else for(n=(o=o.split(",")).length;-1<--n;)r=o[n],ar[r]&&(i=1,r="transformOrigin"===r?pr:dr),Xd(a,r);i&&(Xd(a,dr),u&&(u.svg&&a.removeAttribute("transform"),kr(a,1),u.uncache=1,Kd(s)))}}function ie(t){return"matrix(1, 0, 0, 1, 0, 0)"===t||"none"===t||!t}function je(t){var e=Pd(t,dr);return ie(e)?wr:e.substr(7).match(et).map(ia)}function ke(t,e){var r,i,n,a,s=t._gsap||fa(t),o=t.style,u=je(t);return s.svg&&t.getAttribute("transform")?"1,0,0,1,0,0"===(u=[(n=t.transform.baseVal.consolidate().matrix).a,n.b,n.c,n.d,n.e,n.f]).join(",")?wr:u:(u!==wr||t.offsetParent||t===Re||s.svg||(n=o.display,o.display="block",(r=t.parentNode)&&t.offsetParent||(a=1,i=t.nextElementSibling,Re.appendChild(t)),u=je(t),n?o.display=n:Xd(t,"display"),a&&(i?r.insertBefore(t,i):r?r.appendChild(t):Re.removeChild(t))),e&&6<u.length?[u[0],u[1],u[4],u[5],u[12],u[13]]:u)}function le(t,e,r,i,n,a){var s,o,u,h=t._gsap,l=n||ke(t,!0),f=h.xOrigin||0,c=h.yOrigin||0,d=h.xOffset||0,p=h.yOffset||0,_=l[0],m=l[1],g=l[2],v=l[3],y=l[4],T=l[5],b=e.split(" "),w=parseFloat(b[0])||0,x=parseFloat(b[1])||0;r?l!==wr&&(o=_*v-m*g)&&(u=w*(-m/o)+x*(_/o)-(_*T-m*y)/o,w=w*(v/o)+x*(-g/o)+(g*T-v*y)/o,x=u):(w=(s=Vd(t)).x+(~b[0].indexOf("%")?w/100*s.width:w),x=s.y+(~(b[1]||b[0]).indexOf("%")?x/100*s.height:x)),i||!1!==i&&h.smooth?(y=w-f,T=x-c,h.xOffset=d+(y*_+T*g)-y,h.yOffset=p+(y*m+T*v)-T):h.xOffset=h.yOffset=0,h.xOrigin=w,h.yOrigin=x,h.smooth=!!i,h.origin=e,h.originIsAbsolute=!!r,t.style[pr]="0px 0px",a&&(Yd(a,h,"xOrigin",f,w),Yd(a,h,"yOrigin",c,x),Yd(a,h,"xOffset",d,h.xOffset),Yd(a,h,"yOffset",p,h.yOffset)),t.setAttribute("data-svg-origin",w+" "+x)}function oe(t,e,r){var i=Ya(e);return ia(parseFloat(e)+parseFloat(_d(t,"x",r+"px",i)))+i}function ve(t,e,i,n,a){var s,o,u=360,h=r(a),l=parseFloat(a)*(h&&~a.indexOf("rad")?sr:1)-n,f=n+l+"deg";return h&&("short"===(s=a.split("_")[1])&&(l%=u)!==l%180&&(l+=l<0?u:-u),"cw"===s&&l<0?l=(l+36e9)%u-~~(l/u)*u:"ccw"===s&&0<l&&(l=(l-36e9)%u-~~(l/u)*u)),t._pt=o=new _e(t._pt,e,i,n,l,wd),o.e=f,o.u="deg",t._props.push(i),o}function we(t,e){for(var r in e)t[r]=e[r];return t}function xe(t,e,r){var i,n,a,s,o,u,h,l=we({},r._gsap),f=r.style;for(n in l.svg?(a=r.getAttribute("transform"),r.setAttribute("transform",""),f[dr]=e,i=kr(r,1),Xd(r,dr),r.setAttribute("transform",a)):(a=getComputedStyle(r)[dr],f[dr]=e,i=kr(r,1),f[dr]=a),ar)(a=l[n])!==(s=i[n])&&"perspective,force3D,transformOrigin,svgOrigin".indexOf(n)<0&&(o=Ya(a)!==(h=Ya(s))?_d(r,n,a,h):parseFloat(a),u=parseFloat(s),t._pt=new _e(t._pt,i,n,o,u-o,vd),t._pt.u=h||0,t._props.push(n));we(i,l)}var De,ze,Re,Fe,Be,Le,Ie,Ye,qe=Bt.Power0,Ve=Bt.Power1,Ue=Bt.Power2,Xe=Bt.Power3,Ne=Bt.Power4,We=Bt.Linear,Qe=Bt.Quad,Ge=Bt.Cubic,Ke=Bt.Quart,Je=Bt.Quint,He=Bt.Strong,Ze=Bt.Elastic,$e=Bt.Back,tr=Bt.SteppedEase,er=Bt.Bounce,rr=Bt.Sine,ir=Bt.Expo,nr=Bt.Circ,ar={},sr=180/Math.PI,or=Math.PI/180,ur=Math.atan2,hr=/([A-Z])/g,lr=/(left|right|width|margin|padding|x)/i,fr=/[\s,\(]\S/,cr={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},dr="transform",pr=dr+"Origin",_r="O,Moz,ms,Ms,Webkit".split(","),mr=function _checkPropPrefix(t,e,r){var i=(e||Be).style,n=5;if(t in i&&!r)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);n--&&!(_r[n]+t in i););return n<0?null:(3===n?"ms":0<=n?_r[n]:"")+t},gr={deg:1,rad:1,turn:1},vr={grid:1,flex:1},yr=function _get(t,e,r,i){var n;return Fe||Sd(),e in cr&&"transform"!==e&&~(e=cr[e]).indexOf(",")&&(e=e.split(",")[0]),ar[e]&&"transform"!==e?(n=kr(t,i),n="transformOrigin"!==e?n[e]:n.svg?n.origin:Mr(Pd(t,pr))+" "+n.zOrigin+"px"):(n=t.style[e])&&"auto"!==n&&!i&&!~(n+"").indexOf("calc(")||(n=br[e]&&br[e](t,e,r)||Pd(t,e)||ga(t,e)||("opacity"===e?1:0)),r&&!~(n+"").trim().indexOf(" ")?_d(t,e,n,r)+r:n},Tr={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},br={clearProps:function clearProps(t,e,r,i,n){if("isFromStart"!==n.data){var a=t._pt=new _e(t._pt,e,r,0,0,ee);return a.u=i,a.pr=-10,a.tween=n,t._props.push(r),1}}},wr=[1,0,0,1,0,0],xr={},kr=function _parseTransform(t,e){var r=t._gsap||new Vt(t);if("x"in r&&!e&&!r.uncache)return r;var i,n,a,s,o,u,h,l,f,c,d,p,_,m,g,v,y,T,b,w,x,k,M,O,P,A,C,S,E,D,z,R,F=t.style,B=r.scaleX<0,L="deg",I=getComputedStyle(t),Y=Pd(t,pr)||"0";return i=n=a=u=h=l=f=c=d=0,s=o=1,r.svg=!(!t.getCTM||!Wd(t)),I.translate&&("none"===I.translate&&"none"===I.scale&&"none"===I.rotate||(F[dr]=("none"!==I.translate?"translate3d("+(I.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+("none"!==I.rotate?"rotate("+I.rotate+") ":"")+("none"!==I.scale?"scale("+I.scale.split(" ").join(",")+") ":"")+("none"!==I[dr]?I[dr]:"")),F.scale=F.rotate=F.translate="none"),m=ke(t,r.svg),r.svg&&(O=r.uncache?(P=t.getBBox(),Y=r.xOrigin-P.x+"px "+(r.yOrigin-P.y)+"px",""):!e&&t.getAttribute("data-svg-origin"),le(t,O||Y,!!O||r.originIsAbsolute,!1!==r.smooth,m)),p=r.xOrigin||0,_=r.yOrigin||0,m!==wr&&(T=m[0],b=m[1],w=m[2],x=m[3],i=k=m[4],n=M=m[5],6===m.length?(s=Math.sqrt(T*T+b*b),o=Math.sqrt(x*x+w*w),u=T||b?ur(b,T)*sr:0,(f=w||x?ur(w,x)*sr+u:0)&&(o*=Math.abs(Math.cos(f*or))),r.svg&&(i-=p-(p*T+_*w),n-=_-(p*b+_*x))):(R=m[6],D=m[7],C=m[8],S=m[9],E=m[10],z=m[11],i=m[12],n=m[13],a=m[14],h=(g=ur(R,E))*sr,g&&(O=k*(v=Math.cos(-g))+C*(y=Math.sin(-g)),P=M*v+S*y,A=R*v+E*y,C=k*-y+C*v,S=M*-y+S*v,E=R*-y+E*v,z=D*-y+z*v,k=O,M=P,R=A),l=(g=ur(-w,E))*sr,g&&(v=Math.cos(-g),z=x*(y=Math.sin(-g))+z*v,T=O=T*v-C*y,b=P=b*v-S*y,w=A=w*v-E*y),u=(g=ur(b,T))*sr,g&&(O=T*(v=Math.cos(g))+b*(y=Math.sin(g)),P=k*v+M*y,b=b*v-T*y,M=M*v-k*y,T=O,k=P),h&&359.9<Math.abs(h)+Math.abs(u)&&(h=u=0,l=180-l),s=ia(Math.sqrt(T*T+b*b+w*w)),o=ia(Math.sqrt(M*M+R*R)),g=ur(k,M),f=2e-4<Math.abs(g)?g*sr:0,d=z?1/(z<0?-z:z):0),r.svg&&(O=t.getAttribute("transform"),r.forceCSS=t.setAttribute("transform","")||!ie(Pd(t,dr)),O&&t.setAttribute("transform",O))),90<Math.abs(f)&&Math.abs(f)<270&&(B?(s*=-1,f+=u<=0?180:-180,u+=u<=0?180:-180):(o*=-1,f+=f<=0?180:-180)),e=e||r.uncache,r.x=i-((r.xPercent=i&&(!e&&r.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-i)?-50:0)))?t.offsetWidth*r.xPercent/100:0)+"px",r.y=n-((r.yPercent=n&&(!e&&r.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-n)?-50:0)))?t.offsetHeight*r.yPercent/100:0)+"px",r.z=a+"px",r.scaleX=ia(s),r.scaleY=ia(o),r.rotation=ia(u)+L,r.rotationX=ia(h)+L,r.rotationY=ia(l)+L,r.skewX=f+L,r.skewY=c+L,r.transformPerspective=d+"px",(r.zOrigin=parseFloat(Y.split(" ")[2])||0)&&(F[pr]=Mr(Y)),r.xOffset=r.yOffset=0,r.force3D=q.force3D,r.renderTransform=r.svg?Er:Ye?Sr:Or,r.uncache=0,r},Mr=function _firstTwoOnly(t){return(t=t.split(" "))[0]+" "+t[1]},Or=function _renderNon3DTransforms(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,Sr(t,e)},Pr="0deg",Ar="0px",Cr=") ",Sr=function _renderCSSTransforms(t,e){var r=e||this,i=r.xPercent,n=r.yPercent,a=r.x,s=r.y,o=r.z,u=r.rotation,h=r.rotationY,l=r.rotationX,f=r.skewX,c=r.skewY,d=r.scaleX,p=r.scaleY,_=r.transformPerspective,m=r.force3D,g=r.target,v=r.zOrigin,y="",T="auto"===m&&t&&1!==t||!0===m;if(v&&(l!==Pr||h!==Pr)){var b,w=parseFloat(h)*or,x=Math.sin(w),k=Math.cos(w);w=parseFloat(l)*or,b=Math.cos(w),a=oe(g,a,x*b*-v),s=oe(g,s,-Math.sin(w)*-v),o=oe(g,o,k*b*-v+v)}_!==Ar&&(y+="perspective("+_+Cr),(i||n)&&(y+="translate("+i+"%, "+n+"%) "),!T&&a===Ar&&s===Ar&&o===Ar||(y+=o!==Ar||T?"translate3d("+a+", "+s+", "+o+") ":"translate("+a+", "+s+Cr),u!==Pr&&(y+="rotate("+u+Cr),h!==Pr&&(y+="rotateY("+h+Cr),l!==Pr&&(y+="rotateX("+l+Cr),f===Pr&&c===Pr||(y+="skew("+f+", "+c+Cr),1===d&&1===p||(y+="scale("+d+", "+p+Cr),g.style[dr]=y||"translate(0, 0)"},Er=function _renderSVGTransforms(t,e){var r,i,n,a,s,o=e||this,u=o.xPercent,h=o.yPercent,l=o.x,f=o.y,c=o.rotation,d=o.skewX,p=o.skewY,_=o.scaleX,m=o.scaleY,g=o.target,v=o.xOrigin,y=o.yOrigin,T=o.xOffset,b=o.yOffset,w=o.forceCSS,x=parseFloat(l),k=parseFloat(f);c=parseFloat(c),d=parseFloat(d),(p=parseFloat(p))&&(d+=p=parseFloat(p),c+=p),c||d?(c*=or,d*=or,r=Math.cos(c)*_,i=Math.sin(c)*_,n=Math.sin(c-d)*-m,a=Math.cos(c-d)*m,d&&(p*=or,s=Math.tan(d-p),n*=s=Math.sqrt(1+s*s),a*=s,p&&(s=Math.tan(p),r*=s=Math.sqrt(1+s*s),i*=s)),r=ia(r),i=ia(i),n=ia(n),a=ia(a)):(r=_,a=m,i=n=0),(x&&!~(l+"").indexOf("px")||k&&!~(f+"").indexOf("px"))&&(x=_d(g,"x",l,"px"),k=_d(g,"y",f,"px")),(v||y||T||b)&&(x=ia(x+v-(v*r+y*n)+T),k=ia(k+y-(v*i+y*a)+b)),(u||h)&&(s=g.getBBox(),x=ia(x+u/100*s.width),k=ia(k+h/100*s.height)),s="matrix("+r+","+i+","+n+","+a+","+x+","+k+")",g.setAttribute("transform",s),w&&(g.style[dr]=s)};ha("padding,margin,Width,Radius",function(e,r){var t="Right",i="Bottom",n="Left",o=(r<3?["Top",t,i,n]:["Top"+n,"Top"+t,i+t,i+n]).map(function(t){return r<2?e+t:"border"+t+e});br[1<r?"border"+e:e]=function(e,t,r,i,n){var a,s;if(arguments.length<4)return a=o.map(function(t){return yr(e,t,r)}),5===(s=a.join(" ")).split(a[0]).length?a[0]:s;a=(i+"").split(" "),s={},o.forEach(function(t,e){return s[t]=a[e]=a[e]||a[(e-1)/2|0]}),e.init(t,s,n)}});var Dr,zr,Rr,Fr={name:"css",register:Sd,targetTest:function targetTest(t){return t.style&&t.nodeType},init:function init(t,e,i,n,a){var s,o,u,h,l,f,c,d,p,_,m,g,v,y,T,b,w=this._props,x=t.style,k=i.vars.startAt;for(c in Fe||Sd(),this.styles=this.styles||Md(t),b=this.styles.props,this.tween=i,e)if("autoRound"!==c&&(o=e[c],!pt[c]||!ac(c,e,i,n,t,a)))if(l=typeof o,f=br[c],"function"===l&&(l=typeof(o=o.call(i,n,t,a))),"string"===l&&~o.indexOf("random(")&&(o=ob(o)),f)f(this,t,c,o,i)&&(T=1);else if("--"===c.substr(0,2))s=(getComputedStyle(t).getPropertyValue(c)+"").trim(),o+="",Dt.lastIndex=0,Dt.test(s)||(d=Ya(s),p=Ya(o)),p?d!==p&&(s=_d(t,c,s,p)+p):d&&(o+=d),this.add(x,"setProperty",s,o,n,a,0,0,c),w.push(c),b.push(c,0,x[c]);else if("undefined"!==l){if(k&&c in k?(s="function"==typeof k[c]?k[c].call(i,n,t,a):k[c],r(s)&&~s.indexOf("random(")&&(s=ob(s)),Ya(s+"")||(s+=q.units[c]||Ya(yr(t,c))||""),"="===(s+"").charAt(1)&&(s=yr(t,c))):s=yr(t,c),h=parseFloat(s),(_="string"===l&&"="===o.charAt(1)&&o.substr(0,2))&&(o=o.substr(2)),u=parseFloat(o),c in cr&&("autoAlpha"===c&&(1===h&&"hidden"===yr(t,"visibility")&&u&&(h=0),b.push("visibility",0,x.visibility),Yd(this,x,"visibility",h?"inherit":"hidden",u?"inherit":"hidden",!u)),"scale"!==c&&"transform"!==c&&~(c=cr[c]).indexOf(",")&&(c=c.split(",")[0])),m=c in ar)if(this.styles.save(c),g||((v=t._gsap).renderTransform&&!e.parseTransform||kr(t,e.parseTransform),y=!1!==e.smoothOrigin&&v.smooth,(g=this._pt=new _e(this._pt,x,dr,0,1,v.renderTransform,v,0,-1)).dep=1),"scale"===c)this._pt=new _e(this._pt,v,"scaleY",v.scaleY,(_?ka(v.scaleY,_+u):u)-v.scaleY||0,vd),this._pt.u=0,w.push("scaleY",c),c+="X";else{if("transformOrigin"===c){b.push(pr,0,x[pr]),o=de(o),v.svg?le(t,o,0,y,0,this):((p=parseFloat(o.split(" ")[2])||0)!==v.zOrigin&&Yd(this,v,"zOrigin",v.zOrigin,p),Yd(this,x,c,Mr(s),Mr(o)));continue}if("svgOrigin"===c){le(t,o,1,y,0,this);continue}if(c in xr){ve(this,v,c,h,_?ka(h,_+o):o);continue}if("smoothOrigin"===c){Yd(this,v,"smooth",v.smooth,o);continue}if("force3D"===c){v[c]=o;continue}if("transform"===c){xe(this,o,t);continue}}else c in x||(c=mr(c)||c);if(m||(u||0===u)&&(h||0===h)&&!fr.test(o)&&c in x)u=u||0,(d=(s+"").substr((h+"").length))!==(p=Ya(o)||(c in q.units?q.units[c]:d))&&(h=_d(t,c,s,p)),this._pt=new _e(this._pt,m?v:x,c,h,(_?ka(h,_+u):u)-h,m||"px"!==p&&"zIndex"!==c||!1===e.autoRound?vd:yd),this._pt.u=p||0,d!==p&&"%"!==p&&(this._pt.b=s,this._pt.r=xd);else if(c in x)be.call(this,t,c,s,_?_+o:o);else if(c in t)this.add(t,c,s||t[c],_?_+o:o,n,a);else if("parseTransform"!==c){Q(c,o);continue}m||(c in x?b.push(c,0,x[c]):b.push(c,1,s||t[c])),w.push(c)}T&&pe(this)},render:function render(t,e){if(e.tween._time||!Ie())for(var r=e._pt;r;)r.r(t,r.d),r=r._next;else e.styles.revert()},get:yr,aliases:cr,getSetter:function getSetter(t,e,r){var i=cr[e];return i&&i.indexOf(",")<0&&(e=i),e in ar&&e!==pr&&(t._gsap.x||yr(t,"x"))?r&&Le===r?"scale"===e?Ed:Dd:(Le=r||{})&&("scale"===e?Fd:Gd):t.style&&!u(t.style[e])?Bd:~e.indexOf("-")?Cd:ne(t,e)},core:{_removeProperty:Xd,_getMatrix:ke}};Ee.utils.checkPrefix=mr,Ee.core.getStyleSaver=Md,Rr=ha((Dr="x,y,z,scale,scaleX,scaleY,xPercent,yPercent")+","+(zr="rotation,rotationX,rotationY,skewX,skewY")+",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",function(t){ar[t]=1}),ha(zr,function(t){q.units[t]="deg",xr[t]=1}),cr[Rr[13]]=Dr+","+zr,ha("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY",function(t){var e=t.split(":");cr[e[1]]=Rr[e[0]]}),ha("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(t){q.units[t]="px"}),Ee.registerPlugin(Fr);var Br=Ee.registerPlugin(Fr)||Ee,Lr=Br.core.Tween;e.Back=$e,e.Bounce=er,e.CSSPlugin=Fr,e.Circ=nr,e.Cubic=Ge,e.Elastic=Ze,e.Expo=ir,e.Linear=We,e.Power0=qe,e.Power1=Ve,e.Power2=Ue,e.Power3=Xe,e.Power4=Ne,e.Quad=Qe,e.Quart=Ke,e.Quint=Je,e.Sine=rr,e.SteppedEase=tr,e.Strong=He,e.TimelineLite=Xt,e.TimelineMax=Xt,e.TweenLite=Zt,e.TweenMax=Lr,e.default=Br,e.gsap=Br;if (typeof(window)==="undefined"||window!==e){Object.defineProperty(e,"__esModule",{value:!0})} else {delete e.default}});


;!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).LocomotiveScroll=e()}(this,(function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}function i(t,i,s){return i&&e(t.prototype,i),s&&e(t,s),t}function s(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function n(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,s)}return i}function o(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?n(Object(i),!0).forEach((function(e){s(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function l(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)}function r(t){return(r=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function h(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?c(t):e}function d(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,s=r(t);if(e){var n=r(this).constructor;i=Reflect.construct(s,arguments,n)}else i=s.apply(this,arguments);return h(this,i)}}function u(t,e,i){return(u="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,i){var s=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=r(t)););return t}(t,e);if(s){var n=Object.getOwnPropertyDescriptor(s,e);return n.get?n.get.call(i):n.value}})(t,e,i||t)}function f(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var i=[],s=!0,n=!1,o=void 0;try{for(var l,r=t[Symbol.iterator]();!(s=(l=r.next()).done)&&(i.push(l.value),!e||i.length!==e);s=!0);}catch(t){n=!0,o=t}finally{try{s||null==r.return||r.return()}finally{if(n)throw o}}return i}(t,e)||m(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(t){return function(t){if(Array.isArray(t))return v(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||m(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(t,e){if(t){if("string"==typeof t)return v(t,e);var i=Object.prototype.toString.call(t).slice(8,-1);return"Object"===i&&t.constructor&&(i=t.constructor.name),"Map"===i||"Set"===i?Array.from(t):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?v(t,e):void 0}}function v(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,s=new Array(e);i<e;i++)s[i]=t[i];return s}var y={el:document,name:"scroll",offset:[0,0],repeat:!1,smooth:!1,initPosition:{x:0,y:0},direction:"vertical",gestureDirection:"vertical",reloadOnContextChange:!1,lerp:.1,class:"is-inview",scrollbarContainer:!1,scrollbarClass:"c-scrollbar",scrollingClass:"has-scroll-scrolling",draggingClass:"has-scroll-dragging",smoothClass:"has-scroll-smooth",initClass:"has-scroll-init",getSpeed:!1,getDirection:!1,scrollFromAnywhere:!1,multiplier:1,firefoxMultiplier:50,touchMultiplier:2,resetNativeScroll:!0,tablet:{smooth:!1,direction:"vertical",gestureDirection:"vertical",breakpoint:1024},smartphone:{smooth:!1,direction:"vertical",gestureDirection:"vertical"}},b=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t(this,e),Object.assign(this,y,i),this.smartphone=y.smartphone,i.smartphone&&Object.assign(this.smartphone,i.smartphone),this.tablet=y.tablet,i.tablet&&Object.assign(this.tablet,i.tablet),this.namespace="locomotive",this.html=document.documentElement,this.windowHeight=window.innerHeight,this.windowWidth=window.innerWidth,this.windowMiddle={x:this.windowWidth/2,y:this.windowHeight/2},this.els={},this.currentElements={},this.listeners={},this.hasScrollTicking=!1,this.hasCallEventSet=!1,this.checkScroll=this.checkScroll.bind(this),this.checkResize=this.checkResize.bind(this),this.checkEvent=this.checkEvent.bind(this),this.instance={scroll:{x:0,y:0},limit:{x:this.html.offsetWidth,y:this.html.offsetHeight},currentElements:this.currentElements},this.isMobile?this.isTablet?this.context="tablet":this.context="smartphone":this.context="desktop",this.isMobile&&(this.direction=this[this.context].direction),"horizontal"===this.direction?this.directionAxis="x":this.directionAxis="y",this.getDirection&&(this.instance.direction=null),this.getDirection&&(this.instance.speed=0),this.html.classList.add(this.initClass),window.addEventListener("resize",this.checkResize,!1)}return i(e,[{key:"init",value:function(){this.initEvents()}},{key:"checkScroll",value:function(){this.dispatchScroll()}},{key:"checkResize",value:function(){var t=this;this.resizeTick||(this.resizeTick=!0,requestAnimationFrame((function(){t.resize(),t.resizeTick=!1})))}},{key:"resize",value:function(){}},{key:"checkContext",value:function(){if(this.reloadOnContextChange){this.isMobile=/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||"MacIntel"===navigator.platform&&navigator.maxTouchPoints>1||this.windowWidth<this.tablet.breakpoint,this.isTablet=this.isMobile&&this.windowWidth>=this.tablet.breakpoint;var t=this.context;if(this.isMobile?this.isTablet?this.context="tablet":this.context="smartphone":this.context="desktop",t!=this.context)("desktop"==t?this.smooth:this[t].smooth)!=("desktop"==this.context?this.smooth:this[this.context].smooth)&&window.location.reload()}}},{key:"initEvents",value:function(){var t=this;this.scrollToEls=this.el.querySelectorAll("[data-".concat(this.name,"-to]")),this.setScrollTo=this.setScrollTo.bind(this),this.scrollToEls.forEach((function(e){e.addEventListener("click",t.setScrollTo,!1)}))}},{key:"setScrollTo",value:function(t){t.preventDefault(),this.scrollTo(t.currentTarget.getAttribute("data-".concat(this.name,"-href"))||t.currentTarget.getAttribute("href"),{offset:t.currentTarget.getAttribute("data-".concat(this.name,"-offset"))})}},{key:"addElements",value:function(){}},{key:"detectElements",value:function(t){var e=this,i=this.instance.scroll.y,s=i+this.windowHeight,n=this.instance.scroll.x,o=n+this.windowWidth;Object.entries(this.els).forEach((function(l){var r=f(l,2),a=r[0],c=r[1];if(!c||c.inView&&!t||("horizontal"===e.direction?o>=c.left&&n<c.right&&e.setInView(c,a):s>=c.top&&i<c.bottom&&e.setInView(c,a)),c&&c.inView)if("horizontal"===e.direction){var h=c.right-c.left;c.progress=(e.instance.scroll.x-(c.left-e.windowWidth))/(h+e.windowWidth),(o<c.left||n>c.right)&&e.setOutOfView(c,a)}else{var d=c.bottom-c.top;c.progress=(e.instance.scroll.y-(c.top-e.windowHeight))/(d+e.windowHeight),(s<c.top||i>c.bottom)&&e.setOutOfView(c,a)}})),this.hasScrollTicking=!1}},{key:"setInView",value:function(t,e){this.els[e].inView=!0,t.el.classList.add(t.class),this.currentElements[e]=t,t.call&&this.hasCallEventSet&&(this.dispatchCall(t,"enter"),t.repeat||(this.els[e].call=!1))}},{key:"setOutOfView",value:function(t,e){var i=this;this.els[e].inView=!1,Object.keys(this.currentElements).forEach((function(t){t===e&&delete i.currentElements[t]})),t.call&&this.hasCallEventSet&&this.dispatchCall(t,"exit"),t.repeat&&t.el.classList.remove(t.class)}},{key:"dispatchCall",value:function(t,e){this.callWay=e,this.callValue=t.call.split(",").map((function(t){return t.trim()})),this.callObj=t,1==this.callValue.length&&(this.callValue=this.callValue[0]);var i=new Event(this.namespace+"call");this.el.dispatchEvent(i)}},{key:"dispatchScroll",value:function(){var t=new Event(this.namespace+"scroll");this.el.dispatchEvent(t)}},{key:"setEvents",value:function(t,e){this.listeners[t]||(this.listeners[t]=[]);var i=this.listeners[t];i.push(e),1===i.length&&this.el.addEventListener(this.namespace+t,this.checkEvent,!1),"call"===t&&(this.hasCallEventSet=!0,this.detectElements(!0))}},{key:"unsetEvents",value:function(t,e){if(this.listeners[t]){var i=this.listeners[t],s=i.indexOf(e);s<0||(i.splice(s,1),0===i.index&&this.el.removeEventListener(this.namespace+t,this.checkEvent,!1))}}},{key:"checkEvent",value:function(t){var e=this,i=t.type.replace(this.namespace,""),s=this.listeners[i];s&&0!==s.length&&s.forEach((function(t){switch(i){case"scroll":return t(e.instance);case"call":return t(e.callValue,e.callWay,e.callObj);default:return t()}}))}},{key:"startScroll",value:function(){}},{key:"stopScroll",value:function(){}},{key:"setScroll",value:function(t,e){this.instance.scroll={x:0,y:0}}},{key:"destroy",value:function(){var t=this;window.removeEventListener("resize",this.checkResize,!1),Object.keys(this.listeners).forEach((function(e){t.el.removeEventListener(t.namespace+e,t.checkEvent,!1)})),this.listeners={},this.scrollToEls.forEach((function(e){e.removeEventListener("click",t.setScrollTo,!1)})),this.html.classList.remove(this.initClass)}}]),e}(),g="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function w(t,e){return t(e={exports:{}},e.exports),e.exports}var S=w((function(t,e){t.exports={polyfill:function(){var t=window,e=document;if(!("scrollBehavior"in e.documentElement.style)||!0===t.__forceSmoothScrollPolyfill__){var i,s=t.HTMLElement||t.Element,n={scroll:t.scroll||t.scrollTo,scrollBy:t.scrollBy,elementScroll:s.prototype.scroll||r,scrollIntoView:s.prototype.scrollIntoView},o=t.performance&&t.performance.now?t.performance.now.bind(t.performance):Date.now,l=(i=t.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(i)?1:0);t.scroll=t.scrollTo=function(){void 0!==arguments[0]&&(!0!==a(arguments[0])?p.call(t,e.body,void 0!==arguments[0].left?~~arguments[0].left:t.scrollX||t.pageXOffset,void 0!==arguments[0].top?~~arguments[0].top:t.scrollY||t.pageYOffset):n.scroll.call(t,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:t.scrollX||t.pageXOffset,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:t.scrollY||t.pageYOffset))},t.scrollBy=function(){void 0!==arguments[0]&&(a(arguments[0])?n.scrollBy.call(t,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:0,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:0):p.call(t,e.body,~~arguments[0].left+(t.scrollX||t.pageXOffset),~~arguments[0].top+(t.scrollY||t.pageYOffset)))},s.prototype.scroll=s.prototype.scrollTo=function(){if(void 0!==arguments[0])if(!0!==a(arguments[0])){var t=arguments[0].left,e=arguments[0].top;p.call(this,this,void 0===t?this.scrollLeft:~~t,void 0===e?this.scrollTop:~~e)}else{if("number"==typeof arguments[0]&&void 0===arguments[1])throw new SyntaxError("Value could not be converted");n.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left:"object"!=typeof arguments[0]?~~arguments[0]:this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top:void 0!==arguments[1]?~~arguments[1]:this.scrollTop)}},s.prototype.scrollBy=function(){void 0!==arguments[0]&&(!0!==a(arguments[0])?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):n.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},s.prototype.scrollIntoView=function(){if(!0!==a(arguments[0])){var i=u(this),s=i.getBoundingClientRect(),o=this.getBoundingClientRect();i!==e.body?(p.call(this,i,i.scrollLeft+o.left-s.left,i.scrollTop+o.top-s.top),"fixed"!==t.getComputedStyle(i).position&&t.scrollBy({left:s.left,top:s.top,behavior:"smooth"})):t.scrollBy({left:o.left,top:o.top,behavior:"smooth"})}else n.scrollIntoView.call(this,void 0===arguments[0]||arguments[0])}}function r(t,e){this.scrollLeft=t,this.scrollTop=e}function a(t){if(null===t||"object"!=typeof t||void 0===t.behavior||"auto"===t.behavior||"instant"===t.behavior)return!0;if("object"==typeof t&&"smooth"===t.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+t.behavior+" is not a valid value for enumeration ScrollBehavior.")}function c(t,e){return"Y"===e?t.clientHeight+l<t.scrollHeight:"X"===e?t.clientWidth+l<t.scrollWidth:void 0}function h(e,i){var s=t.getComputedStyle(e,null)["overflow"+i];return"auto"===s||"scroll"===s}function d(t){var e=c(t,"Y")&&h(t,"Y"),i=c(t,"X")&&h(t,"X");return e||i}function u(t){for(;t!==e.body&&!1===d(t);)t=t.parentNode||t.host;return t}function f(e){var i,s,n,l,r=(o()-e.startTime)/468;l=r=r>1?1:r,i=.5*(1-Math.cos(Math.PI*l)),s=e.startX+(e.x-e.startX)*i,n=e.startY+(e.y-e.startY)*i,e.method.call(e.scrollable,s,n),s===e.x&&n===e.y||t.requestAnimationFrame(f.bind(t,e))}function p(i,s,l){var a,c,h,d,u=o();i===e.body?(a=t,c=t.scrollX||t.pageXOffset,h=t.scrollY||t.pageYOffset,d=n.scroll):(a=i,c=i.scrollLeft,h=i.scrollTop,d=r),f({scrollable:a,method:d,startTime:u,startX:c,startY:h,x:s,y:l})}}}})),x=(S.polyfill,function(e){l(n,e);var s=d(n);function n(){var e,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return t(this,n),(e=s.call(this,i)).resetNativeScroll&&(history.scrollRestoration&&(history.scrollRestoration="manual"),window.scrollTo(0,0)),window.addEventListener("scroll",e.checkScroll,!1),void 0===window.smoothscrollPolyfill&&(window.smoothscrollPolyfill=S,window.smoothscrollPolyfill.polyfill()),e}return i(n,[{key:"init",value:function(){this.instance.scroll.y=window.pageYOffset,this.addElements(),this.detectElements(),u(r(n.prototype),"init",this).call(this)}},{key:"checkScroll",value:function(){var t=this;u(r(n.prototype),"checkScroll",this).call(this),this.getDirection&&this.addDirection(),this.getSpeed&&(this.addSpeed(),this.speedTs=Date.now()),this.instance.scroll.y=window.pageYOffset,Object.entries(this.els).length&&(this.hasScrollTicking||(requestAnimationFrame((function(){t.detectElements()})),this.hasScrollTicking=!0))}},{key:"addDirection",value:function(){window.pageYOffset>this.instance.scroll.y?"down"!==this.instance.direction&&(this.instance.direction="down"):window.pageYOffset<this.instance.scroll.y&&"up"!==this.instance.direction&&(this.instance.direction="up")}},{key:"addSpeed",value:function(){window.pageYOffset!=this.instance.scroll.y?this.instance.speed=(window.pageYOffset-this.instance.scroll.y)/Math.max(1,Date.now()-this.speedTs):this.instance.speed=0}},{key:"resize",value:function(){Object.entries(this.els).length&&(this.windowHeight=window.innerHeight,this.updateElements())}},{key:"addElements",value:function(){var t=this;this.els={},this.el.querySelectorAll("[data-"+this.name+"]").forEach((function(e,i){e.getBoundingClientRect();var s,n,o,l=e.dataset[t.name+"Class"]||t.class,r="string"==typeof e.dataset[t.name+"Id"]?e.dataset[t.name+"Id"]:i,a="string"==typeof e.dataset[t.name+"Offset"]?e.dataset[t.name+"Offset"].split(","):t.offset,c=e.dataset[t.name+"Repeat"],h=e.dataset[t.name+"Call"],d=e.dataset[t.name+"Target"],u=(o=void 0!==d?document.querySelector("".concat(d)):e).getBoundingClientRect();s=u.top+t.instance.scroll.y,n=u.left+t.instance.scroll.x;var f=s+o.offsetHeight,p=n+o.offsetWidth;c="false"!=c&&(null!=c||t.repeat);var m=t.getRelativeOffset(a),v={el:e,targetEl:o,id:r,class:l,top:s+=m[0],bottom:f-=m[1],left:n,right:p,offset:a,progress:0,repeat:c,inView:!1,call:h};t.els[r]=v,e.classList.contains(l)&&t.setInView(t.els[r],r)}))}},{key:"updateElements",value:function(){var t=this;Object.entries(this.els).forEach((function(e){var i=f(e,2),s=i[0],n=i[1],o=n.targetEl.getBoundingClientRect().top+t.instance.scroll.y,l=o+n.targetEl.offsetHeight,r=t.getRelativeOffset(n.offset);t.els[s].top=o+r[0],t.els[s].bottom=l-r[1]})),this.hasScrollTicking=!1}},{key:"getRelativeOffset",value:function(t){var e=[0,0];if(t)for(var i=0;i<t.length;i++)"string"==typeof t[i]?t[i].includes("%")?e[i]=parseInt(t[i].replace("%","")*this.windowHeight/100):e[i]=parseInt(t[i]):e[i]=t[i];return e}},{key:"scrollTo",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=parseInt(e.offset)||0,s=!!e.callback&&e.callback;if("string"==typeof t){if("top"===t)t=this.html;else if("bottom"===t)t=this.html.offsetHeight-window.innerHeight;else if(!(t=document.querySelector(t)))return}else if("number"==typeof t)t=parseInt(t);else if(!t||!t.tagName)return void console.warn("`target` parameter is not valid");i="number"!=typeof t?t.getBoundingClientRect().top+i+this.instance.scroll.y:t+i;var n=function(){return parseInt(window.pageYOffset)===parseInt(i)};if(s){if(n())return void s();var o=function t(){n()&&(window.removeEventListener("scroll",t),s())};window.addEventListener("scroll",o)}window.scrollTo({top:i,behavior:0===e.duration?"auto":"smooth"})}},{key:"update",value:function(){this.addElements(),this.detectElements()}},{key:"destroy",value:function(){u(r(n.prototype),"destroy",this).call(this),window.removeEventListener("scroll",this.checkScroll,!1)}}]),n}(b)),k=Object.getOwnPropertySymbols,T=Object.prototype.hasOwnProperty,E=Object.prototype.propertyIsEnumerable;function A(t){if(null==t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}var O=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},i=0;i<10;i++)e["_"+String.fromCharCode(i)]=i;if("0123456789"!==Object.getOwnPropertyNames(e).map((function(t){return e[t]})).join(""))return!1;var s={};return"abcdefghijklmnopqrst".split("").forEach((function(t){s[t]=t})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},s)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var i,s,n=A(t),o=1;o<arguments.length;o++){for(var l in i=Object(arguments[o]))T.call(i,l)&&(n[l]=i[l]);if(k){s=k(i);for(var r=0;r<s.length;r++)E.call(i,s[r])&&(n[s[r]]=i[s[r]])}}return n};function D(){}D.prototype={on:function(t,e,i){var s=this.e||(this.e={});return(s[t]||(s[t]=[])).push({fn:e,ctx:i}),this},once:function(t,e,i){var s=this;function n(){s.off(t,n),e.apply(i,arguments)}return n._=e,this.on(t,n,i)},emit:function(t){for(var e=[].slice.call(arguments,1),i=((this.e||(this.e={}))[t]||[]).slice(),s=0,n=i.length;s<n;s++)i[s].fn.apply(i[s].ctx,e);return this},off:function(t,e){var i=this.e||(this.e={}),s=i[t],n=[];if(s&&e)for(var o=0,l=s.length;o<l;o++)s[o].fn!==e&&s[o].fn._!==e&&n.push(s[o]);return n.length?i[t]=n:delete i[t],this}};var C=D,L=w((function(t,e){(function(){(null!==e?e:this).Lethargy=function(){function t(t,e,i,s){this.stability=null!=t?Math.abs(t):8,this.sensitivity=null!=e?1+Math.abs(e):100,this.tolerance=null!=i?1+Math.abs(i):1.1,this.delay=null!=s?s:150,this.lastUpDeltas=function(){var t,e,i;for(i=[],t=1,e=2*this.stability;1<=e?t<=e:t>=e;1<=e?t++:t--)i.push(null);return i}.call(this),this.lastDownDeltas=function(){var t,e,i;for(i=[],t=1,e=2*this.stability;1<=e?t<=e:t>=e;1<=e?t++:t--)i.push(null);return i}.call(this),this.deltasTimestamp=function(){var t,e,i;for(i=[],t=1,e=2*this.stability;1<=e?t<=e:t>=e;1<=e?t++:t--)i.push(null);return i}.call(this)}return t.prototype.check=function(t){var e;return null!=(t=t.originalEvent||t).wheelDelta?e=t.wheelDelta:null!=t.deltaY?e=-40*t.deltaY:null==t.detail&&0!==t.detail||(e=-40*t.detail),this.deltasTimestamp.push(Date.now()),this.deltasTimestamp.shift(),e>0?(this.lastUpDeltas.push(e),this.lastUpDeltas.shift(),this.isInertia(1)):(this.lastDownDeltas.push(e),this.lastDownDeltas.shift(),this.isInertia(-1))},t.prototype.isInertia=function(t){var e,i,s,n,o,l,r;return null===(e=-1===t?this.lastDownDeltas:this.lastUpDeltas)[0]?t:!(this.deltasTimestamp[2*this.stability-2]+this.delay>Date.now()&&e[0]===e[2*this.stability-1])&&(s=e.slice(0,this.stability),i=e.slice(this.stability,2*this.stability),r=s.reduce((function(t,e){return t+e})),o=i.reduce((function(t,e){return t+e})),l=r/s.length,n=o/i.length,Math.abs(l)<Math.abs(n*this.tolerance)&&this.sensitivity<Math.abs(n)&&t)},t.prototype.showLastUpDeltas=function(){return this.lastUpDeltas},t.prototype.showLastDownDeltas=function(){return this.lastDownDeltas},t}()}).call(g)})),M={hasWheelEvent:"onwheel"in document,hasMouseWheelEvent:"onmousewheel"in document,hasTouch:"ontouchstart"in window||window.TouchEvent||window.DocumentTouch&&document instanceof DocumentTouch,hasTouchWin:navigator.msMaxTouchPoints&&navigator.msMaxTouchPoints>1,hasPointer:!!window.navigator.msPointerEnabled,hasKeyDown:"onkeydown"in document,isFirefox:navigator.userAgent.indexOf("Firefox")>-1},j=Object.prototype.toString,_=Object.prototype.hasOwnProperty;function B(t,e){return function(){return t.apply(e,arguments)}}var W=L.Lethargy,H="virtualscroll",R=V,P=37,Y=38,I=39,z=40,X=32;function V(t){!function(t){if(!t)return console.warn("bindAll requires at least one argument.");var e=Array.prototype.slice.call(arguments,1);if(0===e.length)for(var i in t)_.call(t,i)&&"function"==typeof t[i]&&"[object Function]"==j.call(t[i])&&e.push(i);for(var s=0;s<e.length;s++){var n=e[s];t[n]=B(t[n],t)}}(this,"_onWheel","_onMouseWheel","_onTouchStart","_onTouchMove","_onKeyDown"),this.el=window,t&&t.el&&(this.el=t.el,delete t.el),this.options=O({mouseMultiplier:1,touchMultiplier:2,firefoxMultiplier:15,keyStep:120,preventTouch:!1,unpreventTouchClass:"vs-touchmove-allowed",limitInertia:!1,useKeyboard:!0,useTouch:!0},t),this.options.limitInertia&&(this._lethargy=new W),this._emitter=new C,this._event={y:0,x:0,deltaX:0,deltaY:0},this.touchStartX=null,this.touchStartY=null,this.bodyTouchAction=null,void 0!==this.options.passive&&(this.listenerOptions={passive:this.options.passive})}function F(t,e,i){return(1-i)*t+i*e}function q(t){var e={};if(window.getComputedStyle){var i=getComputedStyle(t),s=i.transform||i.webkitTransform||i.mozTransform,n=s.match(/^matrix3d\((.+)\)$/);return n?(e.x=n?parseFloat(n[1].split(", ")[12]):0,e.y=n?parseFloat(n[1].split(", ")[13]):0):(n=s.match(/^matrix\((.+)\)$/),e.x=n?parseFloat(n[1].split(", ")[4]):0,e.y=n?parseFloat(n[1].split(", ")[5]):0),e}}function K(t){for(var e=[];t&&t!==document;t=t.parentNode)e.push(t);return e}V.prototype._notify=function(t){var e=this._event;e.x+=e.deltaX,e.y+=e.deltaY,this._emitter.emit(H,{x:e.x,y:e.y,deltaX:e.deltaX,deltaY:e.deltaY,originalEvent:t})},V.prototype._onWheel=function(t){var e=this.options;if(!this._lethargy||!1!==this._lethargy.check(t)){var i=this._event;i.deltaX=t.wheelDeltaX||-1*t.deltaX,i.deltaY=t.wheelDeltaY||-1*t.deltaY,M.isFirefox&&1==t.deltaMode&&(i.deltaX*=e.firefoxMultiplier,i.deltaY*=e.firefoxMultiplier),i.deltaX*=e.mouseMultiplier,i.deltaY*=e.mouseMultiplier,this._notify(t)}},V.prototype._onMouseWheel=function(t){if(!this.options.limitInertia||!1!==this._lethargy.check(t)){var e=this._event;e.deltaX=t.wheelDeltaX?t.wheelDeltaX:0,e.deltaY=t.wheelDeltaY?t.wheelDeltaY:t.wheelDelta,this._notify(t)}},V.prototype._onTouchStart=function(t){var e=t.targetTouches?t.targetTouches[0]:t;this.touchStartX=e.pageX,this.touchStartY=e.pageY},V.prototype._onTouchMove=function(t){var e=this.options;e.preventTouch&&!t.target.classList.contains(e.unpreventTouchClass)&&t.preventDefault();var i=this._event,s=t.targetTouches?t.targetTouches[0]:t;i.deltaX=(s.pageX-this.touchStartX)*e.touchMultiplier,i.deltaY=(s.pageY-this.touchStartY)*e.touchMultiplier,this.touchStartX=s.pageX,this.touchStartY=s.pageY,this._notify(t)},V.prototype._onKeyDown=function(t){var e=this._event;e.deltaX=e.deltaY=0;var i=window.innerHeight-40;switch(t.keyCode){case P:case Y:e.deltaY=this.options.keyStep;break;case I:case z:e.deltaY=-this.options.keyStep;break;case t.shiftKey:e.deltaY=i;break;case X:e.deltaY=-i;break;default:return}this._notify(t)},V.prototype._bind=function(){M.hasWheelEvent&&this.el.addEventListener("wheel",this._onWheel,this.listenerOptions),M.hasMouseWheelEvent&&this.el.addEventListener("mousewheel",this._onMouseWheel,this.listenerOptions),M.hasTouch&&this.options.useTouch&&(this.el.addEventListener("touchstart",this._onTouchStart,this.listenerOptions),this.el.addEventListener("touchmove",this._onTouchMove,this.listenerOptions)),M.hasPointer&&M.hasTouchWin&&(this.bodyTouchAction=document.body.style.msTouchAction,document.body.style.msTouchAction="none",this.el.addEventListener("MSPointerDown",this._onTouchStart,!0),this.el.addEventListener("MSPointerMove",this._onTouchMove,!0)),M.hasKeyDown&&this.options.useKeyboard&&document.addEventListener("keydown",this._onKeyDown)},V.prototype._unbind=function(){M.hasWheelEvent&&this.el.removeEventListener("wheel",this._onWheel),M.hasMouseWheelEvent&&this.el.removeEventListener("mousewheel",this._onMouseWheel),M.hasTouch&&(this.el.removeEventListener("touchstart",this._onTouchStart),this.el.removeEventListener("touchmove",this._onTouchMove)),M.hasPointer&&M.hasTouchWin&&(document.body.style.msTouchAction=this.bodyTouchAction,this.el.removeEventListener("MSPointerDown",this._onTouchStart,!0),this.el.removeEventListener("MSPointerMove",this._onTouchMove,!0)),M.hasKeyDown&&this.options.useKeyboard&&document.removeEventListener("keydown",this._onKeyDown)},V.prototype.on=function(t,e){this._emitter.on(H,t,e);var i=this._emitter.e;i&&i[H]&&1===i[H].length&&this._bind()},V.prototype.off=function(t,e){this._emitter.off(H,t,e);var i=this._emitter.e;(!i[H]||i[H].length<=0)&&this._unbind()},V.prototype.reset=function(){var t=this._event;t.x=0,t.y=0},V.prototype.destroy=function(){this._emitter.off(),this._unbind()};var N="function"==typeof Float32Array;function U(t,e){return 1-3*e+3*t}function $(t,e){return 3*e-6*t}function G(t){return 3*t}function J(t,e,i){return((U(e,i)*t+$(e,i))*t+G(e))*t}function Q(t,e,i){return 3*U(e,i)*t*t+2*$(e,i)*t+G(e)}function Z(t){return t}var tt=function(t,e,i,s){if(!(0<=t&&t<=1&&0<=i&&i<=1))throw new Error("bezier x values must be in [0, 1] range");if(t===e&&i===s)return Z;for(var n=N?new Float32Array(11):new Array(11),o=0;o<11;++o)n[o]=J(.1*o,t,i);function l(e){for(var s=0,o=1;10!==o&&n[o]<=e;++o)s+=.1;--o;var l=s+.1*((e-n[o])/(n[o+1]-n[o])),r=Q(l,t,i);return r>=.001?function(t,e,i,s){for(var n=0;n<4;++n){var o=Q(e,i,s);if(0===o)return e;e-=(J(e,i,s)-t)/o}return e}(e,l,t,i):0===r?l:function(t,e,i,s,n){var o,l,r=0;do{(o=J(l=e+(i-e)/2,s,n)-t)>0?i=l:e=l}while(Math.abs(o)>1e-7&&++r<10);return l}(e,s,s+.1,t,i)}return function(t){return 0===t?0:1===t?1:J(l(t),e,s)}},et=38,it=40,st=32,nt=9,ot=33,lt=34,rt=36,at=35,ct=function(e){l(n,e);var s=d(n);function n(){var e,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return t(this,n),history.scrollRestoration&&(history.scrollRestoration="manual"),window.scrollTo(0,0),(e=s.call(this,i)).inertia&&(e.lerp=.1*e.inertia),e.isScrolling=!1,e.isDraggingScrollbar=!1,e.isTicking=!1,e.hasScrollTicking=!1,e.parallaxElements={},e.stop=!1,e.scrollbarContainer=i.scrollbarContainer,e.checkKey=e.checkKey.bind(c(e)),window.addEventListener("keydown",e.checkKey,!1),e}return i(n,[{key:"init",value:function(){var t=this;this.html.classList.add(this.smoothClass),this.html.setAttribute("data-".concat(this.name,"-direction"),this.direction),this.instance=o({delta:{x:this.initPosition.x,y:this.initPosition.y},scroll:{x:this.initPosition.x,y:this.initPosition.y}},this.instance),this.vs=new R({el:this.scrollFromAnywhere?document:this.el,mouseMultiplier:navigator.platform.indexOf("Win")>-1?1:.4,firefoxMultiplier:this.firefoxMultiplier,touchMultiplier:this.touchMultiplier,useKeyboard:!1,passive:!0}),this.vs.on((function(e){t.stop||t.isDraggingScrollbar||requestAnimationFrame((function(){t.updateDelta(e),t.isScrolling||t.startScrolling()}))})),this.setScrollLimit(),this.initScrollBar(),this.addSections(),this.addElements(),this.checkScroll(!0),this.transformElements(!0,!0),u(r(n.prototype),"init",this).call(this)}},{key:"setScrollLimit",value:function(){if(this.instance.limit.y=this.el.offsetHeight-this.windowHeight,"horizontal"===this.direction){for(var t=0,e=this.el.children,i=0;i<e.length;i++)t+=e[i].offsetWidth;this.instance.limit.x=t-this.windowWidth}}},{key:"startScrolling",value:function(){this.startScrollTs=Date.now(),this.isScrolling=!0,this.checkScroll(),this.html.classList.add(this.scrollingClass)}},{key:"stopScrolling",value:function(){cancelAnimationFrame(this.checkScrollRaf),this.startScrollTs=void 0,this.scrollToRaf&&(cancelAnimationFrame(this.scrollToRaf),this.scrollToRaf=null),this.isScrolling=!1,this.instance.scroll.y=Math.round(this.instance.scroll.y),this.html.classList.remove(this.scrollingClass)}},{key:"checkKey",value:function(t){var e=this;if(this.stop)t.keyCode==nt&&requestAnimationFrame((function(){e.html.scrollTop=0,document.body.scrollTop=0,e.html.scrollLeft=0,document.body.scrollLeft=0}));else{switch(t.keyCode){case nt:requestAnimationFrame((function(){e.html.scrollTop=0,document.body.scrollTop=0,e.html.scrollLeft=0,document.body.scrollLeft=0,e.scrollTo(document.activeElement,{offset:-window.innerHeight/2})}));break;case et:this.isActiveElementScrollSensitive()&&(this.instance.delta[this.directionAxis]-=240);break;case it:this.isActiveElementScrollSensitive()&&(this.instance.delta[this.directionAxis]+=240);break;case ot:this.instance.delta[this.directionAxis]-=window.innerHeight;break;case lt:this.instance.delta[this.directionAxis]+=window.innerHeight;break;case rt:this.instance.delta[this.directionAxis]-=this.instance.limit[this.directionAxis];break;case at:this.instance.delta[this.directionAxis]+=this.instance.limit[this.directionAxis];break;case st:this.isActiveElementScrollSensitive()&&(t.shiftKey?this.instance.delta[this.directionAxis]-=window.innerHeight:this.instance.delta[this.directionAxis]+=window.innerHeight);break;default:return}this.instance.delta[this.directionAxis]<0&&(this.instance.delta[this.directionAxis]=0),this.instance.delta[this.directionAxis]>this.instance.limit[this.directionAxis]&&(this.instance.delta[this.directionAxis]=this.instance.limit[this.directionAxis]),this.stopScrolling(),this.isScrolling=!0,this.checkScroll(),this.html.classList.add(this.scrollingClass)}}},{key:"isActiveElementScrollSensitive",value:function(){return!(document.activeElement instanceof HTMLInputElement||document.activeElement instanceof HTMLTextAreaElement||document.activeElement instanceof HTMLButtonElement||document.activeElement instanceof HTMLSelectElement)}},{key:"checkScroll",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e||this.isScrolling||this.isDraggingScrollbar){this.hasScrollTicking||(this.checkScrollRaf=requestAnimationFrame((function(){return t.checkScroll()})),this.hasScrollTicking=!0),this.updateScroll();var i=Math.abs(this.instance.delta[this.directionAxis]-this.instance.scroll[this.directionAxis]),s=Date.now()-this.startScrollTs;if(!this.animatingScroll&&s>100&&(i<.5&&0!=this.instance.delta[this.directionAxis]||i<.5&&0==this.instance.delta[this.directionAxis])&&this.stopScrolling(),Object.entries(this.sections).forEach((function(i){var s=f(i,2),n=(s[0],s[1]);n.persistent||t.instance.scroll[t.directionAxis]>n.offset[t.directionAxis]&&t.instance.scroll[t.directionAxis]<n.limit[t.directionAxis]?("horizontal"===t.direction?t.transform(n.el,-t.instance.scroll[t.directionAxis],0):t.transform(n.el,0,-t.instance.scroll[t.directionAxis]),n.inView||(n.inView=!0,n.el.style.opacity=1,n.el.style.pointerEvents="all",n.el.setAttribute("data-".concat(t.name,"-section-inview"),""))):((n.inView||e)&&(n.inView=!1,n.el.style.opacity=0,n.el.style.pointerEvents="none",n.el.removeAttribute("data-".concat(t.name,"-section-inview"))),t.transform(n.el,0,0))})),this.getDirection&&this.addDirection(),this.getSpeed&&(this.addSpeed(),this.speedTs=Date.now()),this.detectElements(),this.transformElements(),this.hasScrollbar){var o=this.instance.scroll[this.directionAxis]/this.instance.limit[this.directionAxis]*this.scrollBarLimit[this.directionAxis];"horizontal"===this.direction?this.transform(this.scrollbarThumb,o,0):this.transform(this.scrollbarThumb,0,o)}u(r(n.prototype),"checkScroll",this).call(this),this.hasScrollTicking=!1}}},{key:"resize",value:function(){this.windowHeight=window.innerHeight,this.windowWidth=window.innerWidth,this.checkContext(),this.windowMiddle={x:this.windowWidth/2,y:this.windowHeight/2},this.update()}},{key:"updateDelta",value:function(t){var e,i=this[this.context]&&this[this.context].gestureDirection?this[this.context].gestureDirection:this.gestureDirection;e="both"===i?t.deltaX+t.deltaY:"vertical"===i?t.deltaY:"horizontal"===i?t.deltaX:t.deltaY,this.instance.delta[this.directionAxis]-=e*this.multiplier,this.instance.delta[this.directionAxis]<0&&(this.instance.delta[this.directionAxis]=0),this.instance.delta[this.directionAxis]>this.instance.limit[this.directionAxis]&&(this.instance.delta[this.directionAxis]=this.instance.limit[this.directionAxis])}},{key:"updateScroll",value:function(t){this.isScrolling||this.isDraggingScrollbar?this.instance.scroll[this.directionAxis]=F(this.instance.scroll[this.directionAxis],this.instance.delta[this.directionAxis],this.lerp):this.instance.scroll[this.directionAxis]>this.instance.limit[this.directionAxis]?this.setScroll(this.instance.scroll[this.directionAxis],this.instance.limit[this.directionAxis]):this.instance.scroll.y<0?this.setScroll(this.instance.scroll[this.directionAxis],0):this.setScroll(this.instance.scroll[this.directionAxis],this.instance.delta[this.directionAxis])}},{key:"addDirection",value:function(){this.instance.delta.y>this.instance.scroll.y?"down"!==this.instance.direction&&(this.instance.direction="down"):this.instance.delta.y<this.instance.scroll.y&&"up"!==this.instance.direction&&(this.instance.direction="up"),this.instance.delta.x>this.instance.scroll.x?"right"!==this.instance.direction&&(this.instance.direction="right"):this.instance.delta.x<this.instance.scroll.x&&"left"!==this.instance.direction&&(this.instance.direction="left")}},{key:"addSpeed",value:function(){this.instance.delta[this.directionAxis]!=this.instance.scroll[this.directionAxis]?this.instance.speed=(this.instance.delta[this.directionAxis]-this.instance.scroll[this.directionAxis])/Math.max(1,Date.now()-this.speedTs):this.instance.speed=0}},{key:"initScrollBar",value:function(){if(this.scrollbar=document.createElement("span"),this.scrollbarThumb=document.createElement("span"),this.scrollbar.classList.add("".concat(this.scrollbarClass)),this.scrollbarThumb.classList.add("".concat(this.scrollbarClass,"_thumb")),this.scrollbar.append(this.scrollbarThumb),this.scrollbarContainer?this.scrollbarContainer.append(this.scrollbar):document.body.append(this.scrollbar),this.getScrollBar=this.getScrollBar.bind(this),this.releaseScrollBar=this.releaseScrollBar.bind(this),this.moveScrollBar=this.moveScrollBar.bind(this),this.scrollbarThumb.addEventListener("mousedown",this.getScrollBar),window.addEventListener("mouseup",this.releaseScrollBar),window.addEventListener("mousemove",this.moveScrollBar),this.hasScrollbar=!1,"horizontal"==this.direction){if(this.instance.limit.x+this.windowWidth<=this.windowWidth)return}else if(this.instance.limit.y+this.windowHeight<=this.windowHeight)return;this.hasScrollbar=!0,this.scrollbarBCR=this.scrollbar.getBoundingClientRect(),this.scrollbarHeight=this.scrollbarBCR.height,this.scrollbarWidth=this.scrollbarBCR.width,"horizontal"===this.direction?this.scrollbarThumb.style.width="".concat(this.scrollbarWidth*this.scrollbarWidth/(this.instance.limit.x+this.scrollbarWidth),"px"):this.scrollbarThumb.style.height="".concat(this.scrollbarHeight*this.scrollbarHeight/(this.instance.limit.y+this.scrollbarHeight),"px"),this.scrollbarThumbBCR=this.scrollbarThumb.getBoundingClientRect(),this.scrollBarLimit={x:this.scrollbarWidth-this.scrollbarThumbBCR.width,y:this.scrollbarHeight-this.scrollbarThumbBCR.height}}},{key:"reinitScrollBar",value:function(){if(this.hasScrollbar=!1,"horizontal"==this.direction){if(this.instance.limit.x+this.windowWidth<=this.windowWidth)return}else if(this.instance.limit.y+this.windowHeight<=this.windowHeight)return;this.hasScrollbar=!0,this.scrollbarBCR=this.scrollbar.getBoundingClientRect(),this.scrollbarHeight=this.scrollbarBCR.height,this.scrollbarWidth=this.scrollbarBCR.width,"horizontal"===this.direction?this.scrollbarThumb.style.width="".concat(this.scrollbarWidth*this.scrollbarWidth/(this.instance.limit.x+this.scrollbarWidth),"px"):this.scrollbarThumb.style.height="".concat(this.scrollbarHeight*this.scrollbarHeight/(this.instance.limit.y+this.scrollbarHeight),"px"),this.scrollbarThumbBCR=this.scrollbarThumb.getBoundingClientRect(),this.scrollBarLimit={x:this.scrollbarWidth-this.scrollbarThumbBCR.width,y:this.scrollbarHeight-this.scrollbarThumbBCR.height}}},{key:"destroyScrollBar",value:function(){this.scrollbarThumb.removeEventListener("mousedown",this.getScrollBar),window.removeEventListener("mouseup",this.releaseScrollBar),window.removeEventListener("mousemove",this.moveScrollBar),this.scrollbar.remove()}},{key:"getScrollBar",value:function(t){this.isDraggingScrollbar=!0,this.checkScroll(),this.html.classList.remove(this.scrollingClass),this.html.classList.add(this.draggingClass)}},{key:"releaseScrollBar",value:function(t){this.isDraggingScrollbar=!1,this.isScrolling&&this.html.classList.add(this.scrollingClass),this.html.classList.remove(this.draggingClass)}},{key:"moveScrollBar",value:function(t){var e=this;this.isDraggingScrollbar&&requestAnimationFrame((function(){var i=100*(t.clientX-e.scrollbarBCR.left)/e.scrollbarWidth*e.instance.limit.x/100,s=100*(t.clientY-e.scrollbarBCR.top)/e.scrollbarHeight*e.instance.limit.y/100;s>0&&s<e.instance.limit.y&&(e.instance.delta.y=s),i>0&&i<e.instance.limit.x&&(e.instance.delta.x=i)}))}},{key:"addElements",value:function(){var t=this;this.els={},this.parallaxElements={},this.el.querySelectorAll("[data-".concat(this.name,"]")).forEach((function(e,i){var s,n,o,l=K(e),r=Object.entries(t.sections).map((function(t){var e=f(t,2);e[0];return e[1]})).find((function(t){return l.includes(t.el)})),a=e.dataset[t.name+"Class"]||t.class,c="string"==typeof e.dataset[t.name+"Id"]?e.dataset[t.name+"Id"]:"el"+i,h=e.dataset[t.name+"Repeat"],d=e.dataset[t.name+"Call"],u=e.dataset[t.name+"Position"],p=e.dataset[t.name+"Delay"],m=e.dataset[t.name+"Direction"],v="string"==typeof e.dataset[t.name+"Sticky"],y=!!e.dataset[t.name+"Speed"]&&parseFloat(e.dataset[t.name+"Speed"])/10,b="string"==typeof e.dataset[t.name+"Offset"]?e.dataset[t.name+"Offset"].split(","):t.offset,g=e.dataset[t.name+"Target"],w=(o=void 0!==g?document.querySelector("".concat(g)):e).getBoundingClientRect();null===r||r.inView?(s=w.top+t.instance.scroll.y-q(o).y,n=w.left+t.instance.scroll.x-q(o).x):(s=w.top-q(r.el).y-q(o).y,n=w.left-q(r.el).x-q(o).x);var S=s+o.offsetHeight,x=n+o.offsetWidth,k={x:(x-n)/2+n,y:(S-s)/2+s};if(v){var T=e.getBoundingClientRect(),E=T.top,A=T.left,O={x:A-n,y:E-s};s+=window.innerHeight,n+=window.innerWidth,S=E+o.offsetHeight-e.offsetHeight-O[t.directionAxis],k={x:((x=A+o.offsetWidth-e.offsetWidth-O[t.directionAxis])-n)/2+n,y:(S-s)/2+s}}h="false"!=h&&(null!=h||t.repeat);var D=[0,0];if(b)if("horizontal"===t.direction){for(var C=0;C<b.length;C++)"string"==typeof b[C]?b[C].includes("%")?D[C]=parseInt(b[C].replace("%","")*t.windowWidth/100):D[C]=parseInt(b[C]):D[C]=b[C];n+=D[0],x-=D[1]}else{for(C=0;C<b.length;C++)"string"==typeof b[C]?b[C].includes("%")?D[C]=parseInt(b[C].replace("%","")*t.windowHeight/100):D[C]=parseInt(b[C]):D[C]=b[C];s+=D[0],S-=D[1]}var L={el:e,id:c,class:a,section:r,top:s,middle:k,bottom:S,left:n,right:x,offset:b,progress:0,repeat:h,inView:!1,call:d,speed:y,delay:p,position:u,target:o,direction:m,sticky:v};t.els[c]=L,e.classList.contains(a)&&t.setInView(t.els[c],c),(!1!==y||v)&&(t.parallaxElements[c]=L)}))}},{key:"addSections",value:function(){var t=this;this.sections={};var e=this.el.querySelectorAll("[data-".concat(this.name,"-section]"));0===e.length&&(e=[this.el]),e.forEach((function(e,i){var s="string"==typeof e.dataset[t.name+"Id"]?e.dataset[t.name+"Id"]:"section"+i,n=e.getBoundingClientRect(),o={x:n.left-1.5*window.innerWidth-q(e).x,y:n.top-1.5*window.innerHeight-q(e).y},l={x:o.x+n.width+2*window.innerWidth,y:o.y+n.height+2*window.innerHeight},r="string"==typeof e.dataset[t.name+"Persistent"];e.setAttribute("data-scroll-section-id",s);var a={el:e,offset:o,limit:l,inView:!1,persistent:r,id:s};t.sections[s]=a}))}},{key:"transform",value:function(t,e,i,s){var n;if(s){var o=q(t),l=F(o.x,e,s),r=F(o.y,i,s);n="matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(l,",").concat(r,",0,1)")}else n="matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(e,",").concat(i,",0,1)");t.style.webkitTransform=n,t.style.msTransform=n,t.style.transform=n}},{key:"transformElements",value:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],s=this.instance.scroll.x+this.windowWidth,n=this.instance.scroll.y+this.windowHeight,o={x:this.instance.scroll.x+this.windowMiddle.x,y:this.instance.scroll.y+this.windowMiddle.y};Object.entries(this.parallaxElements).forEach((function(l){var r=f(l,2),a=(r[0],r[1]),c=!1;if(t&&(c=0),a.inView||i)switch(a.position){case"top":c=e.instance.scroll[e.directionAxis]*-a.speed;break;case"elementTop":c=(n-a.top)*-a.speed;break;case"bottom":c=(e.instance.limit[e.directionAxis]-n+e.windowHeight)*a.speed;break;case"left":c=e.instance.scroll[e.directionAxis]*-a.speed;break;case"elementLeft":c=(s-a.left)*-a.speed;break;case"right":c=(e.instance.limit[e.directionAxis]-s+e.windowHeight)*a.speed;break;default:c=(o[e.directionAxis]-a.middle[e.directionAxis])*-a.speed}a.sticky&&(c=a.inView?"horizontal"===e.direction?e.instance.scroll.x-a.left+window.innerWidth:e.instance.scroll.y-a.top+window.innerHeight:"horizontal"===e.direction?e.instance.scroll.x<a.left-window.innerWidth&&e.instance.scroll.x<a.left-window.innerWidth/2?0:e.instance.scroll.x>a.right&&e.instance.scroll.x>a.right+100&&a.right-a.left+window.innerWidth:e.instance.scroll.y<a.top-window.innerHeight&&e.instance.scroll.y<a.top-window.innerHeight/2?0:e.instance.scroll.y>a.bottom&&e.instance.scroll.y>a.bottom+100&&a.bottom-a.top+window.innerHeight),!1!==c&&("horizontal"===a.direction||"horizontal"===e.direction&&"vertical"!==a.direction?e.transform(a.el,c,0,!t&&a.delay):e.transform(a.el,0,c,!t&&a.delay))}))}},{key:"scrollTo",value:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=parseInt(i.offset)||0,n=isNaN(parseInt(i.duration))?1e3:parseInt(i.duration),o=i.easing||[.25,0,.35,1],l=!!i.disableLerp,r=!!i.callback&&i.callback;if(o=tt.apply(void 0,p(o)),"string"==typeof t){if("top"===t)t=0;else if("bottom"===t)t=this.instance.limit.y;else if("left"===t)t=0;else if("right"===t)t=this.instance.limit.x;else if(!(t=document.querySelector(t)))return}else if("number"==typeof t)t=parseInt(t);else if(!t||!t.tagName)return void console.warn("`target` parameter is not valid");if("number"!=typeof t){var a=K(t).includes(this.el);if(!a)return;var c=t.getBoundingClientRect(),h=c.top,d=c.left,u=K(t),m=u.find((function(t){return Object.entries(e.sections).map((function(t){var e=f(t,2);e[0];return e[1]})).find((function(e){return e.el==t}))})),v=0;v=m?q(m)[this.directionAxis]:-this.instance.scroll[this.directionAxis],s="horizontal"===this.direction?d+s-v:h+s-v}else s=t+s;var y=parseFloat(this.instance.delta[this.directionAxis]),b=Math.max(0,Math.min(s,this.instance.limit[this.directionAxis])),g=b-y,w=function(t){l?"horizontal"===e.direction?e.setScroll(y+g*t,e.instance.delta.y):e.setScroll(e.instance.delta.x,y+g*t):e.instance.delta[e.directionAxis]=y+g*t};this.animatingScroll=!0,this.stopScrolling(),this.startScrolling();var S=Date.now(),x=function t(){var i=(Date.now()-S)/n;i>1?(w(1),e.animatingScroll=!1,0==n&&e.update(),r&&r()):(e.scrollToRaf=requestAnimationFrame(t),w(o(i)))};x()}},{key:"update",value:function(){this.setScrollLimit(),this.addSections(),this.addElements(),this.detectElements(),this.updateScroll(),this.transformElements(!0),this.reinitScrollBar(),this.checkScroll(!0)}},{key:"startScroll",value:function(){this.stop=!1}},{key:"stopScroll",value:function(){this.stop=!0}},{key:"setScroll",value:function(t,e){this.instance=o(o({},this.instance),{},{scroll:{x:t,y:e},delta:{x:t,y:e},speed:0})}},{key:"destroy",value:function(){u(r(n.prototype),"destroy",this).call(this),this.stopScrolling(),this.html.classList.remove(this.smoothClass),this.vs.destroy(),this.destroyScrollBar(),window.removeEventListener("keydown",this.checkKey,!1)}}]),n}(b);return function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t(this,e),this.options=i,Object.assign(this,y,i),this.smartphone=y.smartphone,i.smartphone&&Object.assign(this.smartphone,i.smartphone),this.tablet=y.tablet,i.tablet&&Object.assign(this.tablet,i.tablet),this.smooth||"horizontal"!=this.direction||console.warn("🚨 `smooth:false` & `horizontal` direction are not yet compatible"),this.tablet.smooth||"horizontal"!=this.tablet.direction||console.warn("🚨 `smooth:false` & `horizontal` direction are not yet compatible (tablet)"),this.smartphone.smooth||"horizontal"!=this.smartphone.direction||console.warn("🚨 `smooth:false` & `horizontal` direction are not yet compatible (smartphone)"),this.init()}return i(e,[{key:"init",value:function(){if(this.options.isMobile=/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||"MacIntel"===navigator.platform&&navigator.maxTouchPoints>1||window.innerWidth<this.tablet.breakpoint,this.options.isTablet=this.options.isMobile&&window.innerWidth>=this.tablet.breakpoint,this.smooth&&!this.options.isMobile||this.tablet.smooth&&this.options.isTablet||this.smartphone.smooth&&this.options.isMobile&&!this.options.isTablet?this.scroll=new ct(this.options):this.scroll=new x(this.options),this.scroll.init(),window.location.hash){var t=window.location.hash.slice(1,window.location.hash.length),e=document.getElementById(t);e&&this.scroll.scrollTo(e)}}},{key:"update",value:function(){this.scroll.update()}},{key:"start",value:function(){this.scroll.startScroll()}},{key:"stop",value:function(){this.scroll.stopScroll()}},{key:"scrollTo",value:function(t,e){this.scroll.scrollTo(t,e)}},{key:"setScroll",value:function(t,e){this.scroll.setScroll(t,e)}},{key:"on",value:function(t,e){this.scroll.setEvents(t,e)}},{key:"off",value:function(t,e){this.scroll.unsetEvents(t,e)}},{key:"destroy",value:function(){this.scroll.destroy()}}]),e}()}));
;/*! jQuery v3.5.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(C,e){"use strict";var t=[],r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply([],e)},u=t.push,i=t.indexOf,n={},o=n.toString,v=n.hasOwnProperty,a=v.toString,l=a.call(Object),y={},m=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType},x=function(e){return null!=e&&e===e.window},E=C.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function b(e,t,n){var r,i,o=(n=n||E).createElement("script");if(o.text=e,t)for(r in c)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function w(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[o.call(e)]||"object":typeof e}var f="3.5.1",S=function(e,t){return new S.fn.init(e,t)};function p(e){var t=!!e&&"length"in e&&e.length,n=w(e);return!m(e)&&!x(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}S.fn=S.prototype={jquery:f,constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(n){return this.pushStack(S.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:t.sort,splice:t.splice},S.extend=S.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||m(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||S.isPlainObject(n)?n:{},i=!1,a[t]=S.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},S.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==o.call(e))&&(!(t=r(e))||"function"==typeof(n=v.call(t,"constructor")&&t.constructor)&&a.call(n)===l)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){b(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(p(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(p(Object(e))?S.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:i.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(p(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:y}),"function"==typeof Symbol&&(S.fn[Symbol.iterator]=t[Symbol.iterator]),S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var d=function(n){var e,d,b,o,i,h,f,g,w,u,l,T,C,a,E,v,s,c,y,S="sizzle"+1*new Date,p=n.document,k=0,r=0,m=ue(),x=ue(),A=ue(),N=ue(),D=function(e,t){return e===t&&(l=!0),0},j={}.hasOwnProperty,t=[],q=t.pop,L=t.push,H=t.push,O=t.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",I="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",W="\\["+M+"*("+I+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+I+"))|)"+M+"*\\]",F=":("+I+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+W+")*)|.*)\\)|)",B=new RegExp(M+"+","g"),$=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp(M+"|>"),X=new RegExp(F),V=new RegExp("^"+I+"$"),G={ID:new RegExp("^#("+I+")"),CLASS:new RegExp("^\\.("+I+")"),TAG:new RegExp("^("+I+"|[*])"),ATTR:new RegExp("^"+W),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){T()},ae=be(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{H.apply(t=O.call(p.childNodes),p.childNodes),t[p.childNodes.length].nodeType}catch(e){H={apply:t.length?function(e,t){L.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function se(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(T(e),e=e||C,E)){if(11!==p&&(u=Z.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(f&&(a=f.getElementById(i))&&y(e,a)&&a.id===i)return n.push(a),n}else{if(u[2])return H.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&d.getElementsByClassName&&e.getElementsByClassName)return H.apply(n,e.getElementsByClassName(i)),n}if(d.qsa&&!N[t+" "]&&(!v||!v.test(t))&&(1!==p||"object"!==e.nodeName.toLowerCase())){if(c=t,f=e,1===p&&(U.test(t)||z.test(t))){(f=ee.test(t)&&ye(e.parentNode)||e)===e&&d.scope||((s=e.getAttribute("id"))?s=s.replace(re,ie):e.setAttribute("id",s=S)),o=(l=h(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+xe(l[o]);c=l.join(",")}try{return H.apply(n,f.querySelectorAll(c)),n}catch(e){N(t,!0)}finally{s===S&&e.removeAttribute("id")}}}return g(t.replace($,"$1"),e,n,r)}function ue(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function le(e){return e[S]=!0,e}function ce(e){var t=C.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){var n=e.split("|"),r=n.length;while(r--)b.attrHandle[n[r]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function de(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function he(n){return function(e){var t=e.nodeName.toLowerCase();return("input"===t||"button"===t)&&e.type===n}}function ge(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&ae(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function ve(a){return le(function(o){return o=+o,le(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]))})})}function ye(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}for(e in d=se.support={},i=se.isXML=function(e){var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return!Y.test(t||n&&n.nodeName||"HTML")},T=se.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:p;return r!=C&&9===r.nodeType&&r.documentElement&&(a=(C=r).documentElement,E=!i(C),p!=C&&(n=C.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",oe,!1):n.attachEvent&&n.attachEvent("onunload",oe)),d.scope=ce(function(e){return a.appendChild(e).appendChild(C.createElement("div")),"undefined"!=typeof e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),d.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),d.getElementsByTagName=ce(function(e){return e.appendChild(C.createComment("")),!e.getElementsByTagName("*").length}),d.getElementsByClassName=K.test(C.getElementsByClassName),d.getById=ce(function(e){return a.appendChild(e).id=S,!C.getElementsByName||!C.getElementsByName(S).length}),d.getById?(b.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(te,ne);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),b.find.TAG=d.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):d.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=d.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&E)return t.getElementsByClassName(e)},s=[],v=[],(d.qsa=K.test(C.querySelectorAll))&&(ce(function(e){var t;a.appendChild(e).innerHTML="<a id='"+S+"'></a><select id='"+S+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+S+"-]").length||v.push("~="),(t=C.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||v.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+S+"+*").length||v.push(".#.+[+~]"),e.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]")}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=C.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),a.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:")})),(d.matchesSelector=K.test(c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ce(function(e){d.disconnectedMatch=c.call(e,"*"),c.call(e,"[s!='']:x"),s.push("!=",F)}),v=v.length&&new RegExp(v.join("|")),s=s.length&&new RegExp(s.join("|")),t=K.test(a.compareDocumentPosition),y=t||K.test(a.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return l=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!d.sortDetached&&t.compareDocumentPosition(e)===n?e==C||e.ownerDocument==p&&y(p,e)?-1:t==C||t.ownerDocument==p&&y(p,t)?1:u?P(u,e)-P(u,t):0:4&n?-1:1)}:function(e,t){if(e===t)return l=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e==C?-1:t==C?1:i?-1:o?1:u?P(u,e)-P(u,t):0;if(i===o)return pe(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?pe(a[r],s[r]):a[r]==p?-1:s[r]==p?1:0}),C},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(T(e),d.matchesSelector&&E&&!N[t+" "]&&(!s||!s.test(t))&&(!v||!v.test(t)))try{var n=c.call(e,t);if(n||d.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){N(t,!0)}return 0<se(t,C,null,[e]).length},se.contains=function(e,t){return(e.ownerDocument||e)!=C&&T(e),y(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=C&&T(e);var n=b.attrHandle[t.toLowerCase()],r=n&&j.call(b.attrHandle,t.toLowerCase())?n(e,t,!E):void 0;return void 0!==r?r:d.attributes||!E?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},se.escape=function(e){return(e+"").replace(re,ie)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,n=[],r=0,i=0;if(l=!d.detectDuplicates,u=!d.sortStable&&e.slice(0),e.sort(D),l){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1)}return u=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else while(t=e[r++])n+=o(t);return n},(b=se.selectors={cacheLength:50,createPseudo:le,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return G.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=h(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=m[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&m(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=se.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(B," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(h,e,t,g,v){var y="nth"!==h.slice(0,3),m="last"!==h.slice(-4),x="of-type"===e;return 1===g&&0===v?function(e){return!!e.parentNode}:function(e,t,n){var r,i,o,a,s,u,l=y!==m?"nextSibling":"previousSibling",c=e.parentNode,f=x&&e.nodeName.toLowerCase(),p=!n&&!x,d=!1;if(c){if(y){while(l){a=e;while(a=a[l])if(x?a.nodeName.toLowerCase()===f:1===a.nodeType)return!1;u=l="only"===h&&!u&&"nextSibling"}return!0}if(u=[m?c.firstChild:c.lastChild],m&&p){d=(s=(r=(i=(o=(a=c)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1])&&r[2],a=s&&c.childNodes[s];while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if(1===a.nodeType&&++d&&a===e){i[h]=[k,s,d];break}}else if(p&&(d=s=(r=(i=(o=(a=e)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1]),!1===d)while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if((x?a.nodeName.toLowerCase()===f:1===a.nodeType)&&++d&&(p&&((i=(o=a[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]=[k,d]),a===e))break;return(d-=v)===g||d%g==0&&0<=d/g}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=P(e,r[i])]=!(t[n]=r[i])}):function(e){return a(e,0,t)}):a}},pseudos:{not:le(function(e){var r=[],i=[],s=f(e.replace($,"$1"));return s[S]?le(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i))}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:le(function(t){return function(e){return 0<se(t,e).length}}),contains:le(function(t){return t=t.replace(te,ne),function(e){return-1<(e.textContent||o(e)).indexOf(t)}}),lang:le(function(n){return V.test(n||"")||se.error("unsupported lang: "+n),n=n.replace(te,ne).toLowerCase(),function(e){var t;do{if(t=E?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=n.location&&n.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===a},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return J.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ve(function(){return[0]}),last:ve(function(e,t){return[t-1]}),eq:ve(function(e,t,n){return[n<0?n+t:n]}),even:ve(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ve(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ve(function(e,t,n){for(var r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:ve(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=de(e);for(e in{submit:!0,reset:!0})b.pseudos[e]=he(e);function me(){}function xe(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function be(s,e,t){var u=e.dir,l=e.next,c=l||u,f=t&&"parentNode"===c,p=r++;return e.first?function(e,t,n){while(e=e[u])if(1===e.nodeType||f)return s(e,t,n);return!1}:function(e,t,n){var r,i,o,a=[k,p];if(n){while(e=e[u])if((1===e.nodeType||f)&&s(e,t,n))return!0}else while(e=e[u])if(1===e.nodeType||f)if(i=(o=e[S]||(e[S]={}))[e.uniqueID]||(o[e.uniqueID]={}),l&&l===e.nodeName.toLowerCase())e=e[u]||e;else{if((r=i[c])&&r[0]===k&&r[1]===p)return a[2]=r[2];if((i[c]=a)[2]=s(e,t,n))return!0}return!1}}function we(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return!1;return!0}:i[0]}function Te(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Ce(d,h,g,v,y,e){return v&&!v[S]&&(v=Ce(v)),y&&!y[S]&&(y=Ce(y,e)),le(function(e,t,n,r){var i,o,a,s=[],u=[],l=t.length,c=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)se(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),f=!d||!e&&h?c:Te(c,s,d,n,r),p=g?y||(e?d:l||v)?[]:t:f;if(g&&g(f,p,n,r),v){i=Te(p,u),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(p[u[o]]=!(f[u[o]]=a))}if(e){if(y||d){if(y){i=[],o=p.length;while(o--)(a=p[o])&&i.push(f[o]=a);y(null,p=[],i,r)}o=p.length;while(o--)(a=p[o])&&-1<(i=y?P(e,a):s[o])&&(e[i]=!(t[i]=a))}}else p=Te(p===t?p.splice(l,p.length):p),y?y(null,t,p,r):H.apply(t,p)})}function Ee(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=be(function(e){return e===i},a,!0),l=be(function(e){return-1<P(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!==w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[be(we(c),t)];else{if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return Ce(1<s&&we(c),1<s&&xe(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),t,s<n&&Ee(e.slice(s,n)),n<r&&Ee(e=e.slice(n)),n<r&&xe(e))}c.push(t)}return we(c)}return me.prototype=b.filters=b.pseudos,b.setFilters=new me,h=se.tokenize=function(e,t){var n,r,i,o,a,s,u,l=x[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=_.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace($," ")}),a=a.slice(n.length)),b.filter)!(r=G[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?se.error(e):x(e,s).slice(0)},f=se.compile=function(e,t){var n,v,y,m,x,r,i=[],o=[],a=A[e+" "];if(!a){t||(t=h(e)),n=t.length;while(n--)(a=Ee(t[n]))[S]?i.push(a):o.push(a);(a=A(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=k+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==C||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==C||(T(o),n=!E);while(s=v[a++])if(s(o,t||C,n)){r.push(o);break}i&&(k=h)}m&&((o=!s&&o)&&u--,e&&c.push(o))}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=q.call(r));f=Te(f)}H.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&se.uniqueSort(r)}return i&&(k=h,w=p),c},m?le(r):r))).selector=e}return a},g=se.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&h(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&E&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(te,ne),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}i=G.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(te,ne),ee.test(o[0].type)&&ye(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&xe(o)))return H.apply(n,r),n;break}}}return(l||f(e,c))(r,t,!E,n,!t||ee.test(e)&&ye(t.parentNode)||t),n},d.sortStable=S.split("").sort(D).join("")===S,d.detectDuplicates=!!l,T(),d.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(C.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),d.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(C);S.find=d,S.expr=d.selectors,S.expr[":"]=S.expr.pseudos,S.uniqueSort=S.unique=d.uniqueSort,S.text=d.getText,S.isXMLDoc=d.isXML,S.contains=d.contains,S.escapeSelector=d.escape;var h=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&S(e).is(n))break;r.push(e)}return r},T=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},k=S.expr.match.needsContext;function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var N=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function D(e,n,r){return m(n)?S.grep(e,function(e,t){return!!n.call(e,t,e)!==r}):n.nodeType?S.grep(e,function(e){return e===n!==r}):"string"!=typeof n?S.grep(e,function(e){return-1<i.call(n,e)!==r}):S.filter(n,e,r)}S.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return 1===e.nodeType}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return 1<r?S.uniqueSort(n):n},filter:function(e){return this.pushStack(D(this,e||[],!1))},not:function(e){return this.pushStack(D(this,e||[],!0))},is:function(e){return!!D(this,"string"==typeof e&&k.test(e)?S(e):e||[],!1).length}});var j,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(S.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||j,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:q.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:E,!0)),N.test(r[1])&&S.isPlainObject(t))for(r in t)m(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(i=E.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):m(e)?void 0!==n.ready?n.ready(e):e(S):S.makeArray(e,this)}).prototype=S.fn,j=S(E);var L=/^(?:parents|prev(?:Until|All))/,H={children:!0,contents:!0,next:!0,prev:!0};function O(e,t){while((e=e[t])&&1!==e.nodeType);return e}S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&S(e);if(!k.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&S.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?S.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?i.call(S(e),this[0]):i.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),S.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return h(e,"parentNode")},parentsUntil:function(e,t,n){return h(e,"parentNode",n)},next:function(e){return O(e,"nextSibling")},prev:function(e){return O(e,"previousSibling")},nextAll:function(e){return h(e,"nextSibling")},prevAll:function(e){return h(e,"previousSibling")},nextUntil:function(e,t,n){return h(e,"nextSibling",n)},prevUntil:function(e,t,n){return h(e,"previousSibling",n)},siblings:function(e){return T((e.parentNode||{}).firstChild,e)},children:function(e){return T(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),S.merge([],e.childNodes))}},function(r,i){S.fn[r]=function(e,t){var n=S.map(this,i,e);return"Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=S.filter(t,n)),1<this.length&&(H[r]||S.uniqueSort(n),L.test(r)&&n.reverse()),this.pushStack(n)}});var P=/[^\x20\t\r\n\f]+/g;function R(e){return e}function M(e){throw e}function I(e,t,n,r){var i;try{e&&m(i=e.promise)?i.call(e).done(t).fail(n):e&&m(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}S.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},S.each(e.match(P)||[],function(e,t){n[t]=!0}),n):S.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1)}r.memory||(t=!1),i=!1,a&&(s=t?[]:"")},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){S.each(e,function(e,t){m(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==w(t)&&n(t)})}(arguments),t&&!i&&c()),this},remove:function(){return S.each(arguments,function(e,t){var n;while(-1<(n=S.inArray(t,s,n)))s.splice(n,1),n<=l&&l--}),this},has:function(e){return e?-1<S.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return!s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return!!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},S.extend({Deferred:function(e){var o=[["notify","progress",S.Callbacks("memory"),S.Callbacks("memory"),2],["resolve","done",S.Callbacks("once memory"),S.Callbacks("once memory"),0,"resolved"],["reject","fail",S.Callbacks("once memory"),S.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return S.Deferred(function(r){S.each(o,function(e,t){var n=m(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&m(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments)})}),i=null}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,m(t)?s?t.call(e,l(u,o,R,s),l(u,o,M,s)):(u++,t.call(e,l(u,o,R,s),l(u,o,M,s),l(u,o,R,o.notifyWith))):(a!==R&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r))}},t=s?e:function(){try{e()}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,t.stackTrace),u<=i+1&&(a!==M&&(n=void 0,r=[e]),o.rejectWith(n,r))}};i?t():(S.Deferred.getStackHook&&(t.stackTrace=S.Deferred.getStackHook()),C.setTimeout(t))}}return S.Deferred(function(e){o[0][3].add(l(0,e,m(r)?r:R,e.notifyWith)),o[1][3].add(l(0,e,m(t)?t:R)),o[2][3].add(l(0,e,m(n)?n:M))}).promise()},promise:function(e){return null!=e?S.extend(e,a):a}},s={};return S.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=s.call(arguments),o=S.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?s.call(arguments):e,--n||o.resolveWith(r,i)}};if(n<=1&&(I(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||m(i[t]&&i[t].then)))return o.then();while(t--)I(i[t],a(t),o.reject);return o.promise()}});var W=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(e,t){C.console&&C.console.warn&&e&&W.test(e.name)&&C.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},S.readyException=function(e){C.setTimeout(function(){throw e})};var F=S.Deferred();function B(){E.removeEventListener("DOMContentLoaded",B),C.removeEventListener("load",B),S.ready()}S.fn.ready=function(e){return F.then(e)["catch"](function(e){S.readyException(e)}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--S.readyWait:S.isReady)||(S.isReady=!0)!==e&&0<--S.readyWait||F.resolveWith(E,[S])}}),S.ready.then=F.then,"complete"===E.readyState||"loading"!==E.readyState&&!E.documentElement.doScroll?C.setTimeout(S.ready):(E.addEventListener("DOMContentLoaded",B),C.addEventListener("load",B));var $=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,m(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},_=/^-ms-/,z=/-([a-z])/g;function U(e,t){return t.toUpperCase()}function X(e){return e.replace(_,"ms-").replace(z,U)}var V=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=S.expando+G.uid++}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},V(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[X(t)]=n;else for(r in t)i[X(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][X(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(X):(t=X(t))in r?[t]:t.match(P)||[]).length;while(n--)delete r[t[n]]}(void 0===t||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!S.isEmptyObject(t)}};var Y=new G,Q=new G,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function Z(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(K,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:J.test(i)?JSON.parse(i):i)}catch(e){}Q.set(e,t,n)}else n=void 0;return n}S.extend({hasData:function(e){return Q.hasData(e)||Y.hasData(e)},data:function(e,t,n){return Q.access(e,t,n)},removeData:function(e,t){Q.remove(e,t)},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t)}}),S.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=Q.get(o),1===o.nodeType&&!Y.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=X(r.slice(5)),Z(o,r,i[r]));Y.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof n?this.each(function(){Q.set(this,n)}):$(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=Q.get(o,n))?t:void 0!==(t=Z(o,n))?t:void 0;this.each(function(){Q.set(this,n,e)})},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){Q.remove(this,e)})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.access(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=S.queue(e,t),r=n.length,i=n.shift(),o=S._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){S.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Y.get(e,n)||Y.access(e,n,{empty:S.Callbacks("once memory").add(function(){Y.remove(e,[t+"queue",n])})})}}),S.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?S.queue(this[0],t):void 0===n?this:this.each(function(){var e=S.queue(this,t,n);S._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&S.dequeue(this,t)})},dequeue:function(e){return this.each(function(){S.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=S.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=Y.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var ee=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,te=new RegExp("^(?:([+-])=|)("+ee+")([a-z%]*)$","i"),ne=["Top","Right","Bottom","Left"],re=E.documentElement,ie=function(e){return S.contains(e.ownerDocument,e)},oe={composed:!0};re.getRootNode&&(ie=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(oe)===e.ownerDocument});var ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&ie(e)&&"none"===S.css(e,"display")};function se(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,"")},u=s(),l=n&&n[3]||(S.cssNumber[t]?"":"px"),c=e.nodeType&&(S.cssNumber[t]||"px"!==l&&+u)&&te.exec(S.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)S.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,S.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ue={};function le(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=Y.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ae(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ue[s])||(o=a.body.appendChild(a.createElement(s)),u=S.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ue[s]=u)))):"none"!==n&&(l[c]="none",Y.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}S.fn.extend({show:function(){return le(this,!0)},hide:function(){return le(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?S(this).show():S(this).hide()})}});var ce,fe,pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,he=/^$|^module$|\/(?:java|ecma)script/i;ce=E.createDocumentFragment().appendChild(E.createElement("div")),(fe=E.createElement("input")).setAttribute("type","radio"),fe.setAttribute("checked","checked"),fe.setAttribute("name","t"),ce.appendChild(fe),y.checkClone=ce.cloneNode(!0).cloneNode(!0).lastChild.checked,ce.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ce.cloneNode(!0).lastChild.defaultValue,ce.innerHTML="<option></option>",y.option=!!ce.lastChild;var ge={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?S.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],"globalEval",!t||Y.get(t[n],"globalEval"))}ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td,y.option||(ge.optgroup=ge.option=[1,"<select multiple='multiple'>","</select>"]);var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===w(o))S.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+S.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;S.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<S.inArray(o,r))i&&i.push(o);else if(l=ie(o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}var be=/^key/,we=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Te=/^([^.]*)(?:\.(.+)|)/;function Ce(){return!0}function Ee(){return!1}function Se(e,t){return e===function(){try{return E.activeElement}catch(e){}}()==("focus"===t)}function ke(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)ke(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Ee;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return S().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=S.guid++)),e.each(function(){S.event.add(this,t,i,r,n)})}function Ae(e,i,o){o?(Y.set(e,i,!1),S.event.add(e,i,{namespace:!1,handler:function(e){var t,n,r=Y.get(this,i);if(1&e.isTrigger&&this[i]){if(r.length)(S.event.special[i]||{}).delegateType&&e.stopPropagation();else if(r=s.call(arguments),Y.set(this,i,r),t=o(this,i),this[i](),r!==(n=Y.get(this,i))||t?Y.set(this,i,!1):n={},r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n.value}else r.length&&(Y.set(this,i,{value:S.event.trigger(S.extend(r[0],S.Event.prototype),r.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===Y.get(e,i)&&S.event.add(e,i,Ce)}S.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.get(t);if(V(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&S.find.matchesSelector(re,i),n.guid||(n.guid=S.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return"undefined"!=typeof S&&S.event.triggered!==e.type?S.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(P)||[""]).length;while(l--)d=g=(s=Te.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=S.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=S.event.special[d]||{},c=S.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),S.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.hasData(e)&&Y.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(P)||[""]).length;while(l--)if(d=g=(s=Te.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=S.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||S.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)S.event.remove(e,d+t[l],n,r,!0);S.isEmptyObject(u)&&Y.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=S.event.fix(e),l=(Y.get(this,"events")||Object.create(null))[u.type]||[],c=S.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=S.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((S.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<S(i,this).index(l):S.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(S.Event.prototype,t,{enumerable:!0,configurable:!0,get:m(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Ae(t,"click",Ce),!1},trigger:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Ae(t,"click"),!0},_default:function(e){var t=e.target;return pe.test(t.type)&&t.click&&A(t,"input")&&Y.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ce:Ee,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Ee,isPropagationStopped:Ee,isImmediatePropagationStopped:Ee,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ce,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ce,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ce,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&be.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&we.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},S.event.addProp),S.each({focus:"focusin",blur:"focusout"},function(e,t){S.event.special[e]={setup:function(){return Ae(this,e,Se),!1},trigger:function(){return Ae(this,e),!0},delegateType:t}}),S.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){S.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||S.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}}}),S.fn.extend({on:function(e,t,n,r){return ke(this,e,t,n,r)},one:function(e,t,n,r){return ke(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Ee),this.each(function(){S.event.remove(this,e,n,t)})}});var Ne=/<script|<style|<link/i,De=/checked\s*(?:[^=]|=\s*.checked.)/i,je=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function qe(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&S(e).children("tbody")[0]||e}function Le(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function He(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Oe(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(Y.hasData(e)&&(s=Y.get(e).events))for(i in Y.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)S.event.add(t,i,s[i][n]);Q.hasData(e)&&(o=Q.access(e),a=S.extend({},o),Q.set(t,a))}}function Pe(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=m(d);if(h||1<f&&"string"==typeof d&&!y.checkClone&&De.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),Pe(t,r,i,o)});if(f&&(t=(e=xe(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=S.map(ve(e,"script"),Le)).length;c<f;c++)u=e,c!==p&&(u=S.clone(u,!0,!0),s&&S.merge(a,ve(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,S.map(a,He),c=0;c<s;c++)u=a[c],he.test(u.type||"")&&!Y.access(u,"globalEval")&&S.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?S._evalUrl&&!u.noModule&&S._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):b(u.textContent.replace(je,""),u,l))}return n}function Re(e,t,n){for(var r,i=t?S.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||S.cleanData(ve(r)),r.parentNode&&(n&&ie(r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=ie(e);if(!(y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||S.isXMLDoc(e)))for(a=ve(c),r=0,i=(o=ve(e)).length;r<i;r++)s=o[r],u=a[r],void 0,"input"===(l=u.nodeName.toLowerCase())&&pe.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||ve(e),a=a||ve(c),r=0,i=o.length;r<i;r++)Oe(o[r],a[r]);else Oe(e,c);return 0<(a=ve(c,"script")).length&&ye(a,!f&&ve(e,"script")),c},cleanData:function(e){for(var t,n,r,i=S.event.special,o=0;void 0!==(n=e[o]);o++)if(V(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0}n[Q.expando]&&(n[Q.expando]=void 0)}}}),S.fn.extend({detach:function(e){return Re(this,e,!0)},remove:function(e){return Re(this,e)},text:function(e){return $(this,function(e){return void 0===e?S.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Pe(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||qe(this,e).appendChild(e)})},prepend:function(){return Pe(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=qe(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Pe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Pe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(S.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return S.clone(this,e,t)})},html:function(e){return $(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ne.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(S.cleanData(ve(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var n=[];return Pe(this,arguments,function(e){var t=this.parentNode;S.inArray(this,n)<0&&(S.cleanData(ve(this)),t&&t.replaceChild(e,this))},n)}}),S.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){S.fn[e]=function(e){for(var t,n=[],r=S(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),S(r[o])[a](t),u.apply(n,t.get());return this.pushStack(n)}});var Me=new RegExp("^("+ee+")(?!px)[a-z%]+$","i"),Ie=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=C),t.getComputedStyle(e)},We=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Fe=new RegExp(ne.join("|"),"i");function Be(e,t,n){var r,i,o,a,s=e.style;return(n=n||Ie(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ie(e)||(a=S.style(e,t)),!y.pixelBoxStyles()&&Me.test(a)&&Fe.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function $e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(u).appendChild(l);var e=C.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),re.removeChild(u),l=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=E.createElement("div"),l=E.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===l.style.backgroundClip,S.extend(y,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=E.createElement("table"),t=E.createElement("tr"),n=E.createElement("div"),e.style.cssText="position:absolute;left:-11111px",t.style.height="1px",n.style.height="9px",re.appendChild(e).appendChild(t).appendChild(n),r=C.getComputedStyle(t),a=3<parseInt(r.height),re.removeChild(e)),a}}))}();var _e=["Webkit","Moz","ms"],ze=E.createElement("div").style,Ue={};function Xe(e){var t=S.cssProps[e]||Ue[e];return t||(e in ze?e:Ue[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=_e.length;while(n--)if((e=_e[n]+t)in ze)return e}(e)||e)}var Ve=/^(none|table(?!-c[ea]).+)/,Ge=/^--/,Ye={position:"absolute",visibility:"hidden",display:"block"},Qe={letterSpacing:"0",fontWeight:"400"};function Je(e,t,n){var r=te.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ke(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=S.css(e,n+ne[a],!0,i)),r?("content"===n&&(u-=S.css(e,"padding"+ne[a],!0,i)),"margin"!==n&&(u-=S.css(e,"border"+ne[a]+"Width",!0,i))):(u+=S.css(e,"padding"+ne[a],!0,i),"padding"!==n?u+=S.css(e,"border"+ne[a]+"Width",!0,i):s+=S.css(e,"border"+ne[a]+"Width",!0,i));return!r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function Ze(e,t,n){var r=Ie(e),i=(!y.boxSizingReliable()||n)&&"border-box"===S.css(e,"boxSizing",!1,r),o=i,a=Be(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Me.test(a)){if(!n)return a;a="auto"}return(!y.boxSizingReliable()&&i||!y.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===S.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===S.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+Ke(e,t,n||(i?"border":"content"),o,r,a)+"px"}function et(e,t,n,r,i){return new et.prototype.init(e,t,n,r,i)}S.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Be(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=X(t),u=Ge.test(t),l=e.style;if(u||(t=Xe(s)),a=S.cssHooks[t]||S.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=te.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(S.cssNumber[s]?"":"px")),y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=X(t);return Ge.test(t)||(t=Xe(s)),(a=S.cssHooks[t]||S.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Be(e,t,r)),"normal"===i&&t in Qe&&(i=Qe[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),S.each(["height","width"],function(e,u){S.cssHooks[u]={get:function(e,t,n){if(t)return!Ve.test(S.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?Ze(e,u,n):We(e,Ye,function(){return Ze(e,u,n)})},set:function(e,t,n){var r,i=Ie(e),o=!y.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===S.css(e,"boxSizing",!1,i),s=n?Ke(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-Ke(e,u,"border",!1,i)-.5)),s&&(r=te.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=S.css(e,u)),Je(0,t,s)}}}),S.cssHooks.marginLeft=$e(y.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Be(e,"marginLeft"))||e.getBoundingClientRect().left-We(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),S.each({margin:"",padding:"",border:"Width"},function(i,o){S.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+ne[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(S.cssHooks[i+o].set=Je)}),S.fn.extend({css:function(e,t){return $(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Ie(e),i=t.length;a<i;a++)o[t[a]]=S.css(e,t[a],!1,r);return o}return void 0!==n?S.style(e,t,n):S.css(e,t)},e,t,1<arguments.length)}}),((S.Tween=et).prototype={constructor:et,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(S.cssNumber[n]?"":"px")},cur:function(){var e=et.propHooks[this.prop];return e&&e.get?e.get(this):et.propHooks._default.get(this)},run:function(e){var t,n=et.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):et.propHooks._default.set(this),this}}).init.prototype=et.prototype,(et.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=S.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):1!==e.elem.nodeType||!S.cssHooks[e.prop]&&null==e.elem.style[Xe(e.prop)]?e.elem[e.prop]=e.now:S.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=et.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},S.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},S.fx=et.prototype.init,S.fx.step={};var tt,nt,rt,it,ot=/^(?:toggle|show|hide)$/,at=/queueHooks$/;function st(){nt&&(!1===E.hidden&&C.requestAnimationFrame?C.requestAnimationFrame(st):C.setTimeout(st,S.fx.interval),S.fx.tick())}function ut(){return C.setTimeout(function(){tt=void 0}),tt=Date.now()}function lt(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=ne[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function ct(e,t,n){for(var r,i=(ft.tweeners[t]||[]).concat(ft.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ft(o,e,t){var n,a,r=0,i=ft.prefilters.length,s=S.Deferred().always(function(){delete u.elem}),u=function(){if(a)return!1;for(var e=tt||ut(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:S.extend({},e),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},t),originalProperties:e,originalOptions:t,startTime:tt||ut(),duration:t.duration,tweens:[],createTween:function(e,t){var n=S.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=X(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=S.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i}(c,l.opts.specialEasing);r<i;r++)if(n=ft.prefilters[r].call(l,o,c,l.opts))return m(n.stop)&&(S._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return S.map(c,ct,l),m(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(ft,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return se(n.elem,e,te.exec(t),n),n}]},tweener:function(e,t){m(e)?(t=e,e=["*"]):e=e.match(P);for(var n,r=0,i=e.length;r<i;r++)n=e[r],ft.tweeners[n]=ft.tweeners[n]||[],ft.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),v=Y.get(e,"fxshow");for(r in n.queue||(null==(a=S._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,S.queue(e,"fx").length||a.empty.fire()})})),t)if(i=t[r],ot.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||S.style(e,r)}if((u=!S.isEmptyObject(t))||!S.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=Y.get(e,"display")),"none"===(c=S.css(e,"display"))&&(l?c=l:(le([e],!0),l=e.style.display||l,c=S.css(e,"display"),le([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===S.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=Y.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&le([e],!0),p.done(function(){for(r in g||le([e]),Y.remove(e,"fxshow"),d)S.style(e,r,d[r])})),u=ct(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?ft.prefilters.unshift(e):ft.prefilters.push(e)}}),S.speed=function(e,t,n){var r=e&&"object"==typeof e?S.extend({},e):{complete:n||!n&&t||m(e)&&e,duration:e,easing:n&&t||t&&!m(t)&&t};return S.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){m(r.old)&&r.old.call(this),r.queue&&S.dequeue(this,r.queue)},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=S.isEmptyObject(t),o=S.speed(e,n,r),a=function(){var e=ft(this,S.extend({},t),o);(i||Y.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o)};return"string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=S.timers,r=Y.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&at.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||S.dequeue(this,i)})},finish:function(a){return!1!==a&&(a=a||"fx"),this.each(function(){var e,t=Y.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=S.timers,o=n?n.length:0;for(t.finish=!0,S.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),S.each(["toggle","show","hide"],function(e,r){var i=S.fn[r];S.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(lt(r,!0),e,t,n)}}),S.each({slideDown:lt("show"),slideUp:lt("hide"),slideToggle:lt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){S.fn[e]=function(e,t,n){return this.animate(r,e,t,n)}}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(tt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||S.fx.stop(),tt=void 0},S.fx.timer=function(e){S.timers.push(e),S.fx.start()},S.fx.interval=13,S.fx.start=function(){nt||(nt=!0,st())},S.fx.stop=function(){nt=null},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(r,e){return r=S.fx&&S.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=C.setTimeout(e,r);t.stop=function(){C.clearTimeout(n)}})},rt=E.createElement("input"),it=E.createElement("select").appendChild(E.createElement("option")),rt.type="checkbox",y.checkOn=""!==rt.value,y.optSelected=it.selected,(rt=E.createElement("input")).value="t",rt.type="radio",y.radioValue="t"===rt.value;var pt,dt=S.expr.attrHandle;S.fn.extend({attr:function(e,t){return $(this,S.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e)})}}),S.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?S.prop(e,t,n):(1===o&&S.isXMLDoc(e)||(i=S.attrHooks[t.toLowerCase()]||(S.expr.match.bool.test(t)?pt:void 0)),void 0!==n?null===n?void S.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=S.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!y.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(P);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),pt={set:function(e,t,n){return!1===t?S.removeAttr(e,n):e.setAttribute(n,n),n}},S.each(S.expr.match.bool.source.match(/\w+/g),function(e,t){var a=dt[t]||S.find.attr;dt[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=dt[o],dt[o]=r,r=null!=a(e,t,n)?o:null,dt[o]=i),r}});var ht=/^(?:input|select|textarea|button)$/i,gt=/^(?:a|area)$/i;function vt(e){return(e.match(P)||[]).join(" ")}function yt(e){return e.getAttribute&&e.getAttribute("class")||""}function mt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(P)||[]}S.fn.extend({prop:function(e,t){return $(this,S.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e]})}}),S.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&S.isXMLDoc(e)||(t=S.propFix[t]||t,i=S.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=S.find.attr(e,"tabindex");return t?parseInt(t,10):ht.test(e.nodeName)||gt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),y.optSelected||(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),S.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){S.propFix[this.toLowerCase()]=this}),S.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).addClass(t.call(this,e,yt(this)))});if((e=mt(t)).length)while(n=this[u++])if(i=yt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=e[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).removeClass(t.call(this,e,yt(this)))});if(!arguments.length)return this.attr("class","");if((e=mt(t)).length)while(n=this[u++])if(i=yt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=e[a++])while(-1<r.indexOf(" "+o+" "))r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(i,t){var o=typeof i,a="string"===o||Array.isArray(i);return"boolean"==typeof t&&a?t?this.addClass(i):this.removeClass(i):m(i)?this.each(function(e){S(this).toggleClass(i.call(this,e,yt(this),t),t)}):this.each(function(){var e,t,n,r;if(a){t=0,n=S(this),r=mt(i);while(e=r[t++])n.hasClass(e)?n.removeClass(e):n.addClass(e)}else void 0!==i&&"boolean"!==o||((e=yt(this))&&Y.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===i?"":Y.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+vt(yt(n))+" ").indexOf(t))return!0;return!1}});var xt=/\r/g;S.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,S(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=S.map(t,function(e){return null==e?"":e+""})),(r=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=S.valHooks[t.type]||S.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(xt,""):null==e?"":e:void 0}}),S.extend({valHooks:{option:{get:function(e){var t=S.find.attr(e,"value");return null!=t?t:vt(S.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=S(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=S.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<S.inArray(S.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),S.each(["radio","checkbox"],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<S.inArray(S(e).val(),t)}},y.checkOn||(S.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),y.focusin="onfocusin"in C;var bt=/^(?:focusinfocus|focusoutblur)$/,wt=function(e){e.stopPropagation()};S.extend(S.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||E],d=v.call(e,"type")?e.type:e,h=v.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||E,3!==n.nodeType&&8!==n.nodeType&&!bt.test(d+S.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[S.expando]?e:new S.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:S.makeArray(t,[e]),c=S.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!x(n)){for(s=c.delegateType||d,bt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||E)&&p.push(a.defaultView||a.parentWindow||C)}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(Y.get(o,"events")||Object.create(null))[e.type]&&Y.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&V(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!V(n)||u&&m(n[d])&&!x(n)&&((a=n[u])&&(n[u]=null),S.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,wt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,wt),S.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t)}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}}),y.focusin||S.each({focus:"focusin",blur:"focusout"},function(n,r){var i=function(e){S.event.simulate(r,e.target,S.event.fix(e))};S.event.special[r]={setup:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r);t||e.addEventListener(n,i,!0),Y.access(e,r,(t||0)+1)},teardown:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r)-1;t?Y.access(e,r,t):(e.removeEventListener(n,i,!0),Y.remove(e,r))}}});var Tt=C.location,Ct={guid:Date.now()},Et=/\?/;S.parseXML=function(e){var t;if(!e||"string"!=typeof e)return null;try{t=(new C.DOMParser).parseFromString(e,"text/xml")}catch(e){t=void 0}return t&&!t.getElementsByTagName("parsererror").length||S.error("Invalid XML: "+e),t};var St=/\[\]$/,kt=/\r?\n/g,At=/^(?:submit|button|image|reset|file)$/i,Nt=/^(?:input|select|textarea|keygen)/i;function Dt(n,e,r,i){var t;if(Array.isArray(e))S.each(e,function(e,t){r||St.test(n)?i(n,t):Dt(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i)});else if(r||"object"!==w(e))i(n,e);else for(t in e)Dt(n+"["+t+"]",e[t],r,i)}S.param=function(e,t){var n,r=[],i=function(e,t){var n=m(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value)});else for(n in e)Dt(n,e[n],t,i);return r.join("&")},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,"elements");return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(":disabled")&&Nt.test(this.nodeName)&&!At.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=S(this).val();return null==n?null:Array.isArray(n)?S.map(n,function(e){return{name:t.name,value:e.replace(kt,"\r\n")}}):{name:t.name,value:n.replace(kt,"\r\n")}}).get()}});var jt=/%20/g,qt=/#.*$/,Lt=/([?&])_=[^&]*/,Ht=/^(.*?):[ \t]*([^\r\n]*)$/gm,Ot=/^(?:GET|HEAD)$/,Pt=/^\/\//,Rt={},Mt={},It="*/".concat("*"),Wt=E.createElement("a");function Ft(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(P)||[];if(m(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t)}}function Bt(t,i,o,a){var s={},u=t===Mt;function l(e){var r;return s[e]=!0,S.each(t[e]||[],function(e,t){var n=t(i,o,a);return"string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function $t(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&S.extend(!0,e,r),e}Wt.href=Tt.href,S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Tt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Tt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":It,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?$t($t(e,S.ajaxSettings),t):$t(S.ajaxSettings,e)},ajaxPrefilter:Ft(Rt),ajaxTransport:Ft(Mt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=S.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?S(y):S.event,x=S.Deferred(),b=S.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=Ht.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2])}t=n[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||Tt.href)+"").replace(Pt,Tt.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(P)||[""],null==v.crossDomain){r=E.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Wt.protocol+"//"+Wt.host!=r.protocol+"//"+r.host}catch(e){v.crossDomain=!0}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=S.param(v.data,v.traditional)),Bt(Rt,v,t,T),h)return T;for(i in(g=S.event&&v.global)&&0==S.active++&&S.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Ot.test(v.type),f=v.url.replace(qt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(jt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(Et.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(Lt,"$1"),o=(Et.test(f)?"&":"?")+"_="+Ct.guid+++o),v.url=f+o),v.ifModified&&(S.lastModified[f]&&T.setRequestHeader("If-Modified-Since",S.lastModified[f]),S.etag[f]&&T.setRequestHeader("If-None-Match",S.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+It+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Bt(Mt,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=C.setTimeout(function(){T.abort("timeout")},v.timeout));try{h=!1,c.send(a,l)}catch(e){if(h)throw e;l(-1,e)}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&C.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<S.inArray("script",v.dataTypes)&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(S.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(S.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--S.active||S.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return S.get(e,t,n,"json")},getScript:function(e,t){return S.get(e,void 0,t,"script")}}),S.each(["get","post"],function(e,i){S[i]=function(e,t,n,r){return m(t)&&(r=r||n,n=t,t=void 0),S.ajax(S.extend({url:e,type:i,dataType:r,data:t,success:n},S.isPlainObject(e)&&e))}}),S.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n)}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(m(e)&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return m(n)?this.each(function(e){S(this).wrapInner(n.call(this,e))}):this.each(function(){var e=S(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=m(t);return this.each(function(e){S(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(e){return this.parent(e).not("body").each(function(){S(this).replaceWith(this.childNodes)}),this}}),S.expr.pseudos.hidden=function(e){return!S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){try{return new C.XMLHttpRequest}catch(e){}};var _t={0:200,1223:204},zt=S.ajaxSettings.xhr();y.cors=!!zt&&"withCredentials"in zt,y.ajax=zt=!!zt,S.ajaxTransport(function(i){var o,a;if(y.cors||zt&&!i.crossDomain)return{send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(_t[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()))}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&C.setTimeout(function(){o&&a()})},o=o("abort");try{r.send(i.hasContent&&i.data||null)}catch(e){if(o)throw e}},abort:function(){o&&o()}}}),S.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),S.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),S.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return{send:function(e,t){r=S("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type)}),E.head.appendChild(r[0])},abort:function(){i&&i()}}});var Ut,Xt=[],Vt=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Xt.pop()||S.expando+"_"+Ct.guid++;return this[e]=!0,e}}),S.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Vt.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Vt.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=m(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Vt,"$1"+r):!1!==e.jsonp&&(e.url+=(Et.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||S.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=C[r],C[r]=function(){o=arguments},n.always(function(){void 0===i?S(C).removeProp(r):C[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,Xt.push(r)),o&&m(i)&&i(o[0]),o=i=void 0}),"script"}),y.createHTMLDocument=((Ut=E.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===Ut.childNodes.length),S.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(y.createHTMLDocument?((r=(t=E.implementation.createHTMLDocument("")).createElement("base")).href=E.location.href,t.head.appendChild(r)):t=E),o=!n&&[],(i=N.exec(e))?[t.createElement(i[1])]:(i=xe([e],t,o),o&&o.length&&S(o).remove(),S.merge([],i.childNodes)));var r,i,o},S.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return-1<s&&(r=vt(e.slice(s)),e=e.slice(0,s)),m(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&S.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?S("<div>").append(S.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},S.expr.pseudos.animated=function(t){return S.grep(S.timers,function(e){return t===e.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=S.css(e,"position"),c=S(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=S.css(e,"top"),u=S.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),m(t)&&(t=t.call(e,n,S.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):("number"==typeof f.top&&(f.top+="px"),"number"==typeof f.left&&(f.left+="px"),c.css(f))}},S.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){S.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===S.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===S.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=S(e).offset()).top+=S.css(e,"borderTopWidth",!0),i.left+=S.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-S.css(r,"marginTop",!0),left:t.left-i.left-S.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===S.css(e,"position"))e=e.offsetParent;return e||re})}}),S.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;S.fn[t]=function(e){return $(this,function(e,t,n){var r;if(x(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n},t,e,arguments.length)}}),S.each(["top","left"],function(e,n){S.cssHooks[n]=$e(y.pixelPosition,function(e,t){if(t)return t=Be(e,n),Me.test(t)?S(e).position()[n]+"px":t})}),S.each({Height:"height",Width:"width"},function(a,s){S.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){S.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return $(this,function(e,t,n){var r;return x(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?S.css(e,t,i):S.style(e,t,n,i)},s,n?e:void 0,n)}})}),S.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){S.fn[t]=function(e){return this.on(t,e)}}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){S.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}});var Gt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;S.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),m(e))return r=s.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||S.guid++,i},S.holdReady=function(e){e?S.readyWait++:S.ready(!0)},S.isArray=Array.isArray,S.parseJSON=JSON.parse,S.nodeName=A,S.isFunction=m,S.isWindow=x,S.camelCase=X,S.type=w,S.now=Date.now,S.isNumeric=function(e){var t=S.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},S.trim=function(e){return null==e?"":(e+"").replace(Gt,"")},"function"==typeof define&&define.amd&&define("jquery",[],function(){return S});var Yt=C.jQuery,Qt=C.$;return S.noConflict=function(e){return C.$===S&&(C.$=Qt),e&&C.jQuery===S&&(C.jQuery=Yt),S},"undefined"==typeof e&&(C.jQuery=C.$=S),S});

;// ==================================================
// fancyBox v3.5.7
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2019 fancyApps
//
// ==================================================
!function(t,e,n,o){"use strict";function i(t,e){var o,i,a,s=[],r=0;t&&t.isDefaultPrevented()||(t.preventDefault(),e=e||{},t&&t.data&&(e=h(t.data.options,e)),o=e.$target||n(t.currentTarget).trigger("blur"),(a=n.fancybox.getInstance())&&a.$trigger&&a.$trigger.is(o)||(e.selector?s=n(e.selector):(i=o.attr("data-fancybox")||"",i?(s=t.data?t.data.items:[],s=s.length?s.filter('[data-fancybox="'+i+'"]'):n('[data-fancybox="'+i+'"]')):s=[o]),r=n(s).index(o),r<0&&(r=0),a=n.fancybox.open(s,e,r),a.$trigger=o))}if(t.console=t.console||{info:function(t){}},n){if(n.fn.fancybox)return void console.info("fancyBox already initialized");var a={closeExisting:!1,loop:!1,gutter:50,keyboard:!0,preventCaptionOverlap:!0,arrows:!0,infobar:!0,smallBtn:"auto",toolbar:"auto",buttons:["zoom","slideShow","thumbs","close"],idleTime:3,protect:!1,modal:!1,image:{preload:!1},ajax:{settings:{data:{fancybox:!0}}},iframe:{tpl:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',preload:!0,css:{},attr:{scrolling:"auto"}},video:{tpl:'<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>',format:"",autoStart:!0},defaultType:"image",animationEffect:"zoom",animationDuration:366,zoomOpacity:"auto",transitionEffect:"fade",transitionDuration:366,slideClass:"",baseClass:"",baseTpl:'<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"><div class="fancybox-caption__body"></div></div></div></div>',spinnerTpl:'<div class="fancybox-loading"></div>',errorTpl:'<div class="fancybox-error"><p>{{ERROR}}</p></div>',btnTpl:{download:'<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',zoom:'<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',close:'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',arrowLeft:'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',arrowRight:'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',smallBtn:'<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>'},parentEl:"body",hideScrollbar:!0,autoFocus:!0,backFocus:!0,trapFocus:!0,fullScreen:{autoStart:!1},touch:{vertical:!0,momentum:!0},hash:null,media:{},slideShow:{autoStart:!1,speed:3e3},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"},wheel:"auto",onInit:n.noop,beforeLoad:n.noop,afterLoad:n.noop,beforeShow:n.noop,afterShow:n.noop,beforeClose:n.noop,afterClose:n.noop,onActivate:n.noop,onDeactivate:n.noop,clickContent:function(t,e){return"image"===t.type&&"zoom"},clickSlide:"close",clickOutside:"close",dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1,mobile:{preventCaptionOverlap:!1,idleTime:!1,clickContent:function(t,e){return"image"===t.type&&"toggleControls"},clickSlide:function(t,e){return"image"===t.type?"toggleControls":"close"},dblclickContent:function(t,e){return"image"===t.type&&"zoom"},dblclickSlide:function(t,e){return"image"===t.type&&"zoom"}},lang:"en",i18n:{en:{CLOSE:"Close",NEXT:"Next",PREV:"Previous",ERROR:"The requested content cannot be loaded. <br/> Please try again later.",PLAY_START:"Start slideshow",PLAY_STOP:"Pause slideshow",FULL_SCREEN:"Full screen",THUMBS:"Thumbnails",DOWNLOAD:"Download",SHARE:"Share",ZOOM:"Zoom"},de:{CLOSE:"Schlie&szlig;en",NEXT:"Weiter",PREV:"Zur&uuml;ck",ERROR:"Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",PLAY_START:"Diaschau starten",PLAY_STOP:"Diaschau beenden",FULL_SCREEN:"Vollbild",THUMBS:"Vorschaubilder",DOWNLOAD:"Herunterladen",SHARE:"Teilen",ZOOM:"Vergr&ouml;&szlig;ern"}}},s=n(t),r=n(e),c=0,l=function(t){return t&&t.hasOwnProperty&&t instanceof n},d=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),u=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),f=function(){var t,n=e.createElement("fakeelement"),o={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in o)if(void 0!==n.style[t])return o[t];return"transitionend"}(),p=function(t){return t&&t.length&&t[0].offsetHeight},h=function(t,e){var o=n.extend(!0,{},t,e);return n.each(e,function(t,e){n.isArray(e)&&(o[t]=e)}),o},g=function(t){var o,i;return!(!t||t.ownerDocument!==e)&&(n(".fancybox-container").css("pointer-events","none"),o={x:t.getBoundingClientRect().left+t.offsetWidth/2,y:t.getBoundingClientRect().top+t.offsetHeight/2},i=e.elementFromPoint(o.x,o.y)===t,n(".fancybox-container").css("pointer-events",""),i)},b=function(t,e,o){var i=this;i.opts=h({index:o},n.fancybox.defaults),n.isPlainObject(e)&&(i.opts=h(i.opts,e)),n.fancybox.isMobile&&(i.opts=h(i.opts,i.opts.mobile)),i.id=i.opts.id||++c,i.currIndex=parseInt(i.opts.index,10)||0,i.prevIndex=null,i.prevPos=null,i.currPos=0,i.firstRun=!0,i.group=[],i.slides={},i.addContent(t),i.group.length&&i.init()};n.extend(b.prototype,{init:function(){var o,i,a=this,s=a.group[a.currIndex],r=s.opts;r.closeExisting&&n.fancybox.close(!0),n("body").addClass("fancybox-active"),!n.fancybox.getInstance()&&!1!==r.hideScrollbar&&!n.fancybox.isMobile&&e.body.scrollHeight>t.innerHeight&&(n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:'+(t.innerWidth-e.documentElement.clientWidth)+"px;}</style>"),n("body").addClass("compensate-for-scrollbar")),i="",n.each(r.buttons,function(t,e){i+=r.btnTpl[e]||""}),o=n(a.translate(a,r.baseTpl.replace("{{buttons}}",i).replace("{{arrows}}",r.btnTpl.arrowLeft+r.btnTpl.arrowRight))).attr("id","fancybox-container-"+a.id).addClass(r.baseClass).data("FancyBox",a).appendTo(r.parentEl),a.$refs={container:o},["bg","inner","infobar","toolbar","stage","caption","navigation"].forEach(function(t){a.$refs[t]=o.find(".fancybox-"+t)}),a.trigger("onInit"),a.activate(),a.jumpTo(a.currIndex)},translate:function(t,e){var n=t.opts.i18n[t.opts.lang]||t.opts.i18n.en;return e.replace(/\{\{(\w+)\}\}/g,function(t,e){return void 0===n[e]?t:n[e]})},addContent:function(t){var e,o=this,i=n.makeArray(t);n.each(i,function(t,e){var i,a,s,r,c,l={},d={};n.isPlainObject(e)?(l=e,d=e.opts||e):"object"===n.type(e)&&n(e).length?(i=n(e),d=i.data()||{},d=n.extend(!0,{},d,d.options),d.$orig=i,l.src=o.opts.src||d.src||i.attr("href"),l.type||l.src||(l.type="inline",l.src=e)):l={type:"html",src:e+""},l.opts=n.extend(!0,{},o.opts,d),n.isArray(d.buttons)&&(l.opts.buttons=d.buttons),n.fancybox.isMobile&&l.opts.mobile&&(l.opts=h(l.opts,l.opts.mobile)),a=l.type||l.opts.type,r=l.src||"",!a&&r&&((s=r.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))?(a="video",l.opts.video.format||(l.opts.video.format="video/"+("ogv"===s[1]?"ogg":s[1]))):r.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)?a="image":r.match(/\.(pdf)((\?|#).*)?$/i)?(a="iframe",l=n.extend(!0,l,{contentType:"pdf",opts:{iframe:{preload:!1}}})):"#"===r.charAt(0)&&(a="inline")),a?l.type=a:o.trigger("objectNeedsType",l),l.contentType||(l.contentType=n.inArray(l.type,["html","inline","ajax"])>-1?"html":l.type),l.index=o.group.length,"auto"==l.opts.smallBtn&&(l.opts.smallBtn=n.inArray(l.type,["html","inline","ajax"])>-1),"auto"===l.opts.toolbar&&(l.opts.toolbar=!l.opts.smallBtn),l.$thumb=l.opts.$thumb||null,l.opts.$trigger&&l.index===o.opts.index&&(l.$thumb=l.opts.$trigger.find("img:first"),l.$thumb.length&&(l.opts.$orig=l.opts.$trigger)),l.$thumb&&l.$thumb.length||!l.opts.$orig||(l.$thumb=l.opts.$orig.find("img:first")),l.$thumb&&!l.$thumb.length&&(l.$thumb=null),l.thumb=l.opts.thumb||(l.$thumb?l.$thumb[0].src:null),"function"===n.type(l.opts.caption)&&(l.opts.caption=l.opts.caption.apply(e,[o,l])),"function"===n.type(o.opts.caption)&&(l.opts.caption=o.opts.caption.apply(e,[o,l])),l.opts.caption instanceof n||(l.opts.caption=void 0===l.opts.caption?"":l.opts.caption+""),"ajax"===l.type&&(c=r.split(/\s+/,2),c.length>1&&(l.src=c.shift(),l.opts.filter=c.shift())),l.opts.modal&&(l.opts=n.extend(!0,l.opts,{trapFocus:!0,infobar:0,toolbar:0,smallBtn:0,keyboard:0,slideShow:0,fullScreen:0,thumbs:0,touch:0,clickContent:!1,clickSlide:!1,clickOutside:!1,dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1})),o.group.push(l)}),Object.keys(o.slides).length&&(o.updateControls(),(e=o.Thumbs)&&e.isActive&&(e.create(),e.focus()))},addEvents:function(){var e=this;e.removeEvents(),e.$refs.container.on("click.fb-close","[data-fancybox-close]",function(t){t.stopPropagation(),t.preventDefault(),e.close(t)}).on("touchstart.fb-prev click.fb-prev","[data-fancybox-prev]",function(t){t.stopPropagation(),t.preventDefault(),e.previous()}).on("touchstart.fb-next click.fb-next","[data-fancybox-next]",function(t){t.stopPropagation(),t.preventDefault(),e.next()}).on("click.fb","[data-fancybox-zoom]",function(t){e[e.isScaledDown()?"scaleToActual":"scaleToFit"]()}),s.on("orientationchange.fb resize.fb",function(t){t&&t.originalEvent&&"resize"===t.originalEvent.type?(e.requestId&&u(e.requestId),e.requestId=d(function(){e.update(t)})):(e.current&&"iframe"===e.current.type&&e.$refs.stage.hide(),setTimeout(function(){e.$refs.stage.show(),e.update(t)},n.fancybox.isMobile?600:250))}),r.on("keydown.fb",function(t){var o=n.fancybox?n.fancybox.getInstance():null,i=o.current,a=t.keyCode||t.which;if(9==a)return void(i.opts.trapFocus&&e.focus(t));if(!(!i.opts.keyboard||t.ctrlKey||t.altKey||t.shiftKey||n(t.target).is("input,textarea,video,audio,select")))return 8===a||27===a?(t.preventDefault(),void e.close(t)):37===a||38===a?(t.preventDefault(),void e.previous()):39===a||40===a?(t.preventDefault(),void e.next()):void e.trigger("afterKeydown",t,a)}),e.group[e.currIndex].opts.idleTime&&(e.idleSecondsCounter=0,r.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",function(t){e.idleSecondsCounter=0,e.isIdle&&e.showControls(),e.isIdle=!1}),e.idleInterval=t.setInterval(function(){++e.idleSecondsCounter>=e.group[e.currIndex].opts.idleTime&&!e.isDragging&&(e.isIdle=!0,e.idleSecondsCounter=0,e.hideControls())},1e3))},removeEvents:function(){var e=this;s.off("orientationchange.fb resize.fb"),r.off("keydown.fb .fb-idle"),this.$refs.container.off(".fb-close .fb-prev .fb-next"),e.idleInterval&&(t.clearInterval(e.idleInterval),e.idleInterval=null)},previous:function(t){return this.jumpTo(this.currPos-1,t)},next:function(t){return this.jumpTo(this.currPos+1,t)},jumpTo:function(t,e){var o,i,a,s,r,c,l,d,u,f=this,h=f.group.length;if(!(f.isDragging||f.isClosing||f.isAnimating&&f.firstRun)){if(t=parseInt(t,10),!(a=f.current?f.current.opts.loop:f.opts.loop)&&(t<0||t>=h))return!1;if(o=f.firstRun=!Object.keys(f.slides).length,r=f.current,f.prevIndex=f.currIndex,f.prevPos=f.currPos,s=f.createSlide(t),h>1&&((a||s.index<h-1)&&f.createSlide(t+1),(a||s.index>0)&&f.createSlide(t-1)),f.current=s,f.currIndex=s.index,f.currPos=s.pos,f.trigger("beforeShow",o),f.updateControls(),s.forcedDuration=void 0,n.isNumeric(e)?s.forcedDuration=e:e=s.opts[o?"animationDuration":"transitionDuration"],e=parseInt(e,10),i=f.isMoved(s),s.$slide.addClass("fancybox-slide--current"),o)return s.opts.animationEffect&&e&&f.$refs.container.css("transition-duration",e+"ms"),f.$refs.container.addClass("fancybox-is-open").trigger("focus"),f.loadSlide(s),void f.preload("image");c=n.fancybox.getTranslate(r.$slide),l=n.fancybox.getTranslate(f.$refs.stage),n.each(f.slides,function(t,e){n.fancybox.stop(e.$slide,!0)}),r.pos!==s.pos&&(r.isComplete=!1),r.$slide.removeClass("fancybox-slide--complete fancybox-slide--current"),i?(u=c.left-(r.pos*c.width+r.pos*r.opts.gutter),n.each(f.slides,function(t,o){o.$slide.removeClass("fancybox-animated").removeClass(function(t,e){return(e.match(/(^|\s)fancybox-fx-\S+/g)||[]).join(" ")});var i=o.pos*c.width+o.pos*o.opts.gutter;n.fancybox.setTranslate(o.$slide,{top:0,left:i-l.left+u}),o.pos!==s.pos&&o.$slide.addClass("fancybox-slide--"+(o.pos>s.pos?"next":"previous")),p(o.$slide),n.fancybox.animate(o.$slide,{top:0,left:(o.pos-s.pos)*c.width+(o.pos-s.pos)*o.opts.gutter},e,function(){o.$slide.css({transform:"",opacity:""}).removeClass("fancybox-slide--next fancybox-slide--previous"),o.pos===f.currPos&&f.complete()})})):e&&s.opts.transitionEffect&&(d="fancybox-animated fancybox-fx-"+s.opts.transitionEffect,r.$slide.addClass("fancybox-slide--"+(r.pos>s.pos?"next":"previous")),n.fancybox.animate(r.$slide,d,e,function(){r.$slide.removeClass(d).removeClass("fancybox-slide--next fancybox-slide--previous")},!1)),s.isLoaded?f.revealContent(s):f.loadSlide(s),f.preload("image")}},createSlide:function(t){var e,o,i=this;return o=t%i.group.length,o=o<0?i.group.length+o:o,!i.slides[t]&&i.group[o]&&(e=n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage),i.slides[t]=n.extend(!0,{},i.group[o],{pos:t,$slide:e,isLoaded:!1}),i.updateSlide(i.slides[t])),i.slides[t]},scaleToActual:function(t,e,o){var i,a,s,r,c,l=this,d=l.current,u=d.$content,f=n.fancybox.getTranslate(d.$slide).width,p=n.fancybox.getTranslate(d.$slide).height,h=d.width,g=d.height;l.isAnimating||l.isMoved()||!u||"image"!=d.type||!d.isLoaded||d.hasError||(l.isAnimating=!0,n.fancybox.stop(u),t=void 0===t?.5*f:t,e=void 0===e?.5*p:e,i=n.fancybox.getTranslate(u),i.top-=n.fancybox.getTranslate(d.$slide).top,i.left-=n.fancybox.getTranslate(d.$slide).left,r=h/i.width,c=g/i.height,a=.5*f-.5*h,s=.5*p-.5*g,h>f&&(a=i.left*r-(t*r-t),a>0&&(a=0),a<f-h&&(a=f-h)),g>p&&(s=i.top*c-(e*c-e),s>0&&(s=0),s<p-g&&(s=p-g)),l.updateCursor(h,g),n.fancybox.animate(u,{top:s,left:a,scaleX:r,scaleY:c},o||366,function(){l.isAnimating=!1}),l.SlideShow&&l.SlideShow.isActive&&l.SlideShow.stop())},scaleToFit:function(t){var e,o=this,i=o.current,a=i.$content;o.isAnimating||o.isMoved()||!a||"image"!=i.type||!i.isLoaded||i.hasError||(o.isAnimating=!0,n.fancybox.stop(a),e=o.getFitPos(i),o.updateCursor(e.width,e.height),n.fancybox.animate(a,{top:e.top,left:e.left,scaleX:e.width/a.width(),scaleY:e.height/a.height()},t||366,function(){o.isAnimating=!1}))},getFitPos:function(t){var e,o,i,a,s=this,r=t.$content,c=t.$slide,l=t.width||t.opts.width,d=t.height||t.opts.height,u={};return!!(t.isLoaded&&r&&r.length)&&(e=n.fancybox.getTranslate(s.$refs.stage).width,o=n.fancybox.getTranslate(s.$refs.stage).height,e-=parseFloat(c.css("paddingLeft"))+parseFloat(c.css("paddingRight"))+parseFloat(r.css("marginLeft"))+parseFloat(r.css("marginRight")),o-=parseFloat(c.css("paddingTop"))+parseFloat(c.css("paddingBottom"))+parseFloat(r.css("marginTop"))+parseFloat(r.css("marginBottom")),l&&d||(l=e,d=o),i=Math.min(1,e/l,o/d),l*=i,d*=i,l>e-.5&&(l=e),d>o-.5&&(d=o),"image"===t.type?(u.top=Math.floor(.5*(o-d))+parseFloat(c.css("paddingTop")),u.left=Math.floor(.5*(e-l))+parseFloat(c.css("paddingLeft"))):"video"===t.contentType&&(a=t.opts.width&&t.opts.height?l/d:t.opts.ratio||16/9,d>l/a?d=l/a:l>d*a&&(l=d*a)),u.width=l,u.height=d,u)},update:function(t){var e=this;n.each(e.slides,function(n,o){e.updateSlide(o,t)})},updateSlide:function(t,e){var o=this,i=t&&t.$content,a=t.width||t.opts.width,s=t.height||t.opts.height,r=t.$slide;o.adjustCaption(t),i&&(a||s||"video"===t.contentType)&&!t.hasError&&(n.fancybox.stop(i),n.fancybox.setTranslate(i,o.getFitPos(t)),t.pos===o.currPos&&(o.isAnimating=!1,o.updateCursor())),o.adjustLayout(t),r.length&&(r.trigger("refresh"),t.pos===o.currPos&&o.$refs.toolbar.add(o.$refs.navigation.find(".fancybox-button--arrow_right")).toggleClass("compensate-for-scrollbar",r.get(0).scrollHeight>r.get(0).clientHeight)),o.trigger("onUpdate",t,e)},centerSlide:function(t){var e=this,o=e.current,i=o.$slide;!e.isClosing&&o&&(i.siblings().css({transform:"",opacity:""}),i.parent().children().removeClass("fancybox-slide--previous fancybox-slide--next"),n.fancybox.animate(i,{top:0,left:0,opacity:1},void 0===t?0:t,function(){i.css({transform:"",opacity:""}),o.isComplete||e.complete()},!1))},isMoved:function(t){var e,o,i=t||this.current;return!!i&&(o=n.fancybox.getTranslate(this.$refs.stage),e=n.fancybox.getTranslate(i.$slide),!i.$slide.hasClass("fancybox-animated")&&(Math.abs(e.top-o.top)>.5||Math.abs(e.left-o.left)>.5))},updateCursor:function(t,e){var o,i,a=this,s=a.current,r=a.$refs.container;s&&!a.isClosing&&a.Guestures&&(r.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan"),o=a.canPan(t,e),i=!!o||a.isZoomable(),r.toggleClass("fancybox-is-zoomable",i),n("[data-fancybox-zoom]").prop("disabled",!i),o?r.addClass("fancybox-can-pan"):i&&("zoom"===s.opts.clickContent||n.isFunction(s.opts.clickContent)&&"zoom"==s.opts.clickContent(s))?r.addClass("fancybox-can-zoomIn"):s.opts.touch&&(s.opts.touch.vertical||a.group.length>1)&&"video"!==s.contentType&&r.addClass("fancybox-can-swipe"))},isZoomable:function(){var t,e=this,n=e.current;if(n&&!e.isClosing&&"image"===n.type&&!n.hasError){if(!n.isLoaded)return!0;if((t=e.getFitPos(n))&&(n.width>t.width||n.height>t.height))return!0}return!1},isScaledDown:function(t,e){var o=this,i=!1,a=o.current,s=a.$content;return void 0!==t&&void 0!==e?i=t<a.width&&e<a.height:s&&(i=n.fancybox.getTranslate(s),i=i.width<a.width&&i.height<a.height),i},canPan:function(t,e){var o=this,i=o.current,a=null,s=!1;return"image"===i.type&&(i.isComplete||t&&e)&&!i.hasError&&(s=o.getFitPos(i),void 0!==t&&void 0!==e?a={width:t,height:e}:i.isComplete&&(a=n.fancybox.getTranslate(i.$content)),a&&s&&(s=Math.abs(a.width-s.width)>1.5||Math.abs(a.height-s.height)>1.5)),s},loadSlide:function(t){var e,o,i,a=this;if(!t.isLoading&&!t.isLoaded){if(t.isLoading=!0,!1===a.trigger("beforeLoad",t))return t.isLoading=!1,!1;switch(e=t.type,o=t.$slide,o.off("refresh").trigger("onReset").addClass(t.opts.slideClass),e){case"image":a.setImage(t);break;case"iframe":a.setIframe(t);break;case"html":a.setContent(t,t.src||t.content);break;case"video":a.setContent(t,t.opts.video.tpl.replace(/\{\{src\}\}/gi,t.src).replace("{{format}}",t.opts.videoFormat||t.opts.video.format||"").replace("{{poster}}",t.thumb||""));break;case"inline":n(t.src).length?a.setContent(t,n(t.src)):a.setError(t);break;case"ajax":a.showLoading(t),i=n.ajax(n.extend({},t.opts.ajax.settings,{url:t.src,success:function(e,n){"success"===n&&a.setContent(t,e)},error:function(e,n){e&&"abort"!==n&&a.setError(t)}})),o.one("onReset",function(){i.abort()});break;default:a.setError(t)}return!0}},setImage:function(t){var o,i=this;setTimeout(function(){var e=t.$image;i.isClosing||!t.isLoading||e&&e.length&&e[0].complete||t.hasError||i.showLoading(t)},50),i.checkSrcset(t),t.$content=n('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(t.$slide.addClass("fancybox-slide--image")),!1!==t.opts.preload&&t.opts.width&&t.opts.height&&t.thumb&&(t.width=t.opts.width,t.height=t.opts.height,o=e.createElement("img"),o.onerror=function(){n(this).remove(),t.$ghost=null},o.onload=function(){i.afterLoad(t)},t.$ghost=n(o).addClass("fancybox-image").appendTo(t.$content).attr("src",t.thumb)),i.setBigImage(t)},checkSrcset:function(e){var n,o,i,a,s=e.opts.srcset||e.opts.image.srcset;if(s){i=t.devicePixelRatio||1,a=t.innerWidth*i,o=s.split(",").map(function(t){var e={};return t.trim().split(/\s+/).forEach(function(t,n){var o=parseInt(t.substring(0,t.length-1),10);if(0===n)return e.url=t;o&&(e.value=o,e.postfix=t[t.length-1])}),e}),o.sort(function(t,e){return t.value-e.value});for(var r=0;r<o.length;r++){var c=o[r];if("w"===c.postfix&&c.value>=a||"x"===c.postfix&&c.value>=i){n=c;break}}!n&&o.length&&(n=o[o.length-1]),n&&(e.src=n.url,e.width&&e.height&&"w"==n.postfix&&(e.height=e.width/e.height*n.value,e.width=n.value),e.opts.srcset=s)}},setBigImage:function(t){var o=this,i=e.createElement("img"),a=n(i);t.$image=a.one("error",function(){o.setError(t)}).one("load",function(){var e;t.$ghost||(o.resolveImageSlideSize(t,this.naturalWidth,this.naturalHeight),o.afterLoad(t)),o.isClosing||(t.opts.srcset&&(e=t.opts.sizes,e&&"auto"!==e||(e=(t.width/t.height>1&&s.width()/s.height()>1?"100":Math.round(t.width/t.height*100))+"vw"),a.attr("sizes",e).attr("srcset",t.opts.srcset)),t.$ghost&&setTimeout(function(){t.$ghost&&!o.isClosing&&t.$ghost.hide()},Math.min(300,Math.max(1e3,t.height/1600))),o.hideLoading(t))}).addClass("fancybox-image").attr("src",t.src).appendTo(t.$content),(i.complete||"complete"==i.readyState)&&a.naturalWidth&&a.naturalHeight?a.trigger("load"):i.error&&a.trigger("error")},resolveImageSlideSize:function(t,e,n){var o=parseInt(t.opts.width,10),i=parseInt(t.opts.height,10);t.width=e,t.height=n,o>0&&(t.width=o,t.height=Math.floor(o*n/e)),i>0&&(t.width=Math.floor(i*e/n),t.height=i)},setIframe:function(t){var e,o=this,i=t.opts.iframe,a=t.$slide;t.$content=n('<div class="fancybox-content'+(i.preload?" fancybox-is-hidden":"")+'"></div>').css(i.css).appendTo(a),a.addClass("fancybox-slide--"+t.contentType),t.$iframe=e=n(i.tpl.replace(/\{rnd\}/g,(new Date).getTime())).attr(i.attr).appendTo(t.$content),i.preload?(o.showLoading(t),e.on("load.fb error.fb",function(e){this.isReady=1,t.$slide.trigger("refresh"),o.afterLoad(t)}),a.on("refresh.fb",function(){var n,o,s=t.$content,r=i.css.width,c=i.css.height;if(1===e[0].isReady){try{n=e.contents(),o=n.find("body")}catch(t){}o&&o.length&&o.children().length&&(a.css("overflow","visible"),s.css({width:"100%","max-width":"100%",height:"9999px"}),void 0===r&&(r=Math.ceil(Math.max(o[0].clientWidth,o.outerWidth(!0)))),s.css("width",r||"").css("max-width",""),void 0===c&&(c=Math.ceil(Math.max(o[0].clientHeight,o.outerHeight(!0)))),s.css("height",c||""),a.css("overflow","auto")),s.removeClass("fancybox-is-hidden")}})):o.afterLoad(t),e.attr("src",t.src),a.one("onReset",function(){try{n(this).find("iframe").hide().unbind().attr("src","//about:blank")}catch(t){}n(this).off("refresh.fb").empty(),t.isLoaded=!1,t.isRevealed=!1})},setContent:function(t,e){var o=this;o.isClosing||(o.hideLoading(t),t.$content&&n.fancybox.stop(t.$content),t.$slide.empty(),l(e)&&e.parent().length?((e.hasClass("fancybox-content")||e.parent().hasClass("fancybox-content"))&&e.parents(".fancybox-slide").trigger("onReset"),t.$placeholder=n("<div>").hide().insertAfter(e),e.css("display","inline-block")):t.hasError||("string"===n.type(e)&&(e=n("<div>").append(n.trim(e)).contents()),t.opts.filter&&(e=n("<div>").html(e).find(t.opts.filter))),t.$slide.one("onReset",function(){n(this).find("video,audio").trigger("pause"),t.$placeholder&&(t.$placeholder.after(e.removeClass("fancybox-content").hide()).remove(),t.$placeholder=null),t.$smallBtn&&(t.$smallBtn.remove(),t.$smallBtn=null),t.hasError||(n(this).empty(),t.isLoaded=!1,t.isRevealed=!1)}),n(e).appendTo(t.$slide),n(e).is("video,audio")&&(n(e).addClass("fancybox-video"),n(e).wrap("<div></div>"),t.contentType="video",t.opts.width=t.opts.width||n(e).attr("width"),t.opts.height=t.opts.height||n(e).attr("height")),t.$content=t.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first(),t.$content.siblings().hide(),t.$content.length||(t.$content=t.$slide.wrapInner("<div></div>").children().first()),t.$content.addClass("fancybox-content"),t.$slide.addClass("fancybox-slide--"+t.contentType),o.afterLoad(t))},setError:function(t){t.hasError=!0,t.$slide.trigger("onReset").removeClass("fancybox-slide--"+t.contentType).addClass("fancybox-slide--error"),t.contentType="html",this.setContent(t,this.translate(t,t.opts.errorTpl)),t.pos===this.currPos&&(this.isAnimating=!1)},showLoading:function(t){var e=this;(t=t||e.current)&&!t.$spinner&&(t.$spinner=n(e.translate(e,e.opts.spinnerTpl)).appendTo(t.$slide).hide().fadeIn("fast"))},hideLoading:function(t){var e=this;(t=t||e.current)&&t.$spinner&&(t.$spinner.stop().remove(),delete t.$spinner)},afterLoad:function(t){var e=this;e.isClosing||(t.isLoading=!1,t.isLoaded=!0,e.trigger("afterLoad",t),e.hideLoading(t),!t.opts.smallBtn||t.$smallBtn&&t.$smallBtn.length||(t.$smallBtn=n(e.translate(t,t.opts.btnTpl.smallBtn)).appendTo(t.$content)),t.opts.protect&&t.$content&&!t.hasError&&(t.$content.on("contextmenu.fb",function(t){return 2==t.button&&t.preventDefault(),!0}),"image"===t.type&&n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)),e.adjustCaption(t),e.adjustLayout(t),t.pos===e.currPos&&e.updateCursor(),e.revealContent(t))},adjustCaption:function(t){var e,n=this,o=t||n.current,i=o.opts.caption,a=o.opts.preventCaptionOverlap,s=n.$refs.caption,r=!1;s.toggleClass("fancybox-caption--separate",a),a&&i&&i.length&&(o.pos!==n.currPos?(e=s.clone().appendTo(s.parent()),e.children().eq(0).empty().html(i),r=e.outerHeight(!0),e.empty().remove()):n.$caption&&(r=n.$caption.outerHeight(!0)),o.$slide.css("padding-bottom",r||""))},adjustLayout:function(t){var e,n,o,i,a=this,s=t||a.current;s.isLoaded&&!0!==s.opts.disableLayoutFix&&(s.$content.css("margin-bottom",""),s.$content.outerHeight()>s.$slide.height()+.5&&(o=s.$slide[0].style["padding-bottom"],i=s.$slide.css("padding-bottom"),parseFloat(i)>0&&(e=s.$slide[0].scrollHeight,s.$slide.css("padding-bottom",0),Math.abs(e-s.$slide[0].scrollHeight)<1&&(n=i),s.$slide.css("padding-bottom",o))),s.$content.css("margin-bottom",n))},revealContent:function(t){var e,o,i,a,s=this,r=t.$slide,c=!1,l=!1,d=s.isMoved(t),u=t.isRevealed;return t.isRevealed=!0,e=t.opts[s.firstRun?"animationEffect":"transitionEffect"],i=t.opts[s.firstRun?"animationDuration":"transitionDuration"],i=parseInt(void 0===t.forcedDuration?i:t.forcedDuration,10),!d&&t.pos===s.currPos&&i||(e=!1),"zoom"===e&&(t.pos===s.currPos&&i&&"image"===t.type&&!t.hasError&&(l=s.getThumbPos(t))?c=s.getFitPos(t):e="fade"),"zoom"===e?(s.isAnimating=!0,c.scaleX=c.width/l.width,c.scaleY=c.height/l.height,a=t.opts.zoomOpacity,"auto"==a&&(a=Math.abs(t.width/t.height-l.width/l.height)>.1),a&&(l.opacity=.1,c.opacity=1),n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"),l),p(t.$content),void n.fancybox.animate(t.$content,c,i,function(){s.isAnimating=!1,s.complete()})):(s.updateSlide(t),e?(n.fancybox.stop(r),o="fancybox-slide--"+(t.pos>=s.prevPos?"next":"previous")+" fancybox-animated fancybox-fx-"+e,r.addClass(o).removeClass("fancybox-slide--current"),t.$content.removeClass("fancybox-is-hidden"),p(r),"image"!==t.type&&t.$content.hide().show(0),void n.fancybox.animate(r,"fancybox-slide--current",i,function(){r.removeClass(o).css({transform:"",opacity:""}),t.pos===s.currPos&&s.complete()},!0)):(t.$content.removeClass("fancybox-is-hidden"),u||!d||"image"!==t.type||t.hasError||t.$content.hide().fadeIn("fast"),void(t.pos===s.currPos&&s.complete())))},getThumbPos:function(t){var e,o,i,a,s,r=!1,c=t.$thumb;return!(!c||!g(c[0]))&&(e=n.fancybox.getTranslate(c),o=parseFloat(c.css("border-top-width")||0),i=parseFloat(c.css("border-right-width")||0),a=parseFloat(c.css("border-bottom-width")||0),s=parseFloat(c.css("border-left-width")||0),r={top:e.top+o,left:e.left+s,width:e.width-i-s,height:e.height-o-a,scaleX:1,scaleY:1},e.width>0&&e.height>0&&r)},complete:function(){var t,e=this,o=e.current,i={};!e.isMoved()&&o.isLoaded&&(o.isComplete||(o.isComplete=!0,o.$slide.siblings().trigger("onReset"),e.preload("inline"),p(o.$slide),o.$slide.addClass("fancybox-slide--complete"),n.each(e.slides,function(t,o){o.pos>=e.currPos-1&&o.pos<=e.currPos+1?i[o.pos]=o:o&&(n.fancybox.stop(o.$slide),o.$slide.off().remove())}),e.slides=i),e.isAnimating=!1,e.updateCursor(),e.trigger("afterShow"),o.opts.video.autoStart&&o.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended",function(){Document.exitFullscreen?Document.exitFullscreen():this.webkitExitFullscreen&&this.webkitExitFullscreen(),e.next()}),o.opts.autoFocus&&"html"===o.contentType&&(t=o.$content.find("input[autofocus]:enabled:visible:first"),t.length?t.trigger("focus"):e.focus(null,!0)),o.$slide.scrollTop(0).scrollLeft(0))},preload:function(t){var e,n,o=this;o.group.length<2||(n=o.slides[o.currPos+1],e=o.slides[o.currPos-1],e&&e.type===t&&o.loadSlide(e),n&&n.type===t&&o.loadSlide(n))},focus:function(t,o){var i,a,s=this,r=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","video","audio","[contenteditable]",'[tabindex]:not([tabindex^="-"])'].join(",");s.isClosing||(i=!t&&s.current&&s.current.isComplete?s.current.$slide.find("*:visible"+(o?":not(.fancybox-close-small)":"")):s.$refs.container.find("*:visible"),i=i.filter(r).filter(function(){return"hidden"!==n(this).css("visibility")&&!n(this).hasClass("disabled")}),i.length?(a=i.index(e.activeElement),t&&t.shiftKey?(a<0||0==a)&&(t.preventDefault(),i.eq(i.length-1).trigger("focus")):(a<0||a==i.length-1)&&(t&&t.preventDefault(),i.eq(0).trigger("focus"))):s.$refs.container.trigger("focus"))},activate:function(){var t=this;n(".fancybox-container").each(function(){var e=n(this).data("FancyBox");e&&e.id!==t.id&&!e.isClosing&&(e.trigger("onDeactivate"),e.removeEvents(),e.isVisible=!1)}),t.isVisible=!0,(t.current||t.isIdle)&&(t.update(),t.updateControls()),t.trigger("onActivate"),t.addEvents()},close:function(t,e){var o,i,a,s,r,c,l,u=this,f=u.current,h=function(){u.cleanUp(t)};return!u.isClosing&&(u.isClosing=!0,!1===u.trigger("beforeClose",t)?(u.isClosing=!1,d(function(){u.update()}),!1):(u.removeEvents(),a=f.$content,o=f.opts.animationEffect,i=n.isNumeric(e)?e:o?f.opts.animationDuration:0,f.$slide.removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"),!0!==t?n.fancybox.stop(f.$slide):o=!1,f.$slide.siblings().trigger("onReset").remove(),i&&u.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration",i+"ms"),u.hideLoading(f),u.hideControls(!0),u.updateCursor(),"zoom"!==o||a&&i&&"image"===f.type&&!u.isMoved()&&!f.hasError&&(l=u.getThumbPos(f))||(o="fade"),"zoom"===o?(n.fancybox.stop(a),s=n.fancybox.getTranslate(a),c={top:s.top,left:s.left,scaleX:s.width/l.width,scaleY:s.height/l.height,width:l.width,height:l.height},r=f.opts.zoomOpacity,
"auto"==r&&(r=Math.abs(f.width/f.height-l.width/l.height)>.1),r&&(l.opacity=0),n.fancybox.setTranslate(a,c),p(a),n.fancybox.animate(a,l,i,h),!0):(o&&i?n.fancybox.animate(f.$slide.addClass("fancybox-slide--previous").removeClass("fancybox-slide--current"),"fancybox-animated fancybox-fx-"+o,i,h):!0===t?setTimeout(h,i):h(),!0)))},cleanUp:function(e){var o,i,a,s=this,r=s.current.opts.$orig;s.current.$slide.trigger("onReset"),s.$refs.container.empty().remove(),s.trigger("afterClose",e),s.current.opts.backFocus&&(r&&r.length&&r.is(":visible")||(r=s.$trigger),r&&r.length&&(i=t.scrollX,a=t.scrollY,r.trigger("focus"),n("html, body").scrollTop(a).scrollLeft(i))),s.current=null,o=n.fancybox.getInstance(),o?o.activate():(n("body").removeClass("fancybox-active compensate-for-scrollbar"),n("#fancybox-style-noscroll").remove())},trigger:function(t,e){var o,i=Array.prototype.slice.call(arguments,1),a=this,s=e&&e.opts?e:a.current;if(s?i.unshift(s):s=a,i.unshift(a),n.isFunction(s.opts[t])&&(o=s.opts[t].apply(s,i)),!1===o)return o;"afterClose"!==t&&a.$refs?a.$refs.container.trigger(t+".fb",i):r.trigger(t+".fb",i)},updateControls:function(){var t=this,o=t.current,i=o.index,a=t.$refs.container,s=t.$refs.caption,r=o.opts.caption;o.$slide.trigger("refresh"),r&&r.length?(t.$caption=s,s.children().eq(0).html(r)):t.$caption=null,t.hasHiddenControls||t.isIdle||t.showControls(),a.find("[data-fancybox-count]").html(t.group.length),a.find("[data-fancybox-index]").html(i+1),a.find("[data-fancybox-prev]").prop("disabled",!o.opts.loop&&i<=0),a.find("[data-fancybox-next]").prop("disabled",!o.opts.loop&&i>=t.group.length-1),"image"===o.type?a.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href",o.opts.image.src||o.src).show():o.opts.toolbar&&a.find("[data-fancybox-download],[data-fancybox-zoom]").hide(),n(e.activeElement).is(":hidden,[disabled]")&&t.$refs.container.trigger("focus")},hideControls:function(t){var e=this,n=["infobar","toolbar","nav"];!t&&e.current.opts.preventCaptionOverlap||n.push("caption"),this.$refs.container.removeClass(n.map(function(t){return"fancybox-show-"+t}).join(" ")),this.hasHiddenControls=!0},showControls:function(){var t=this,e=t.current?t.current.opts:t.opts,n=t.$refs.container;t.hasHiddenControls=!1,t.idleSecondsCounter=0,n.toggleClass("fancybox-show-toolbar",!(!e.toolbar||!e.buttons)).toggleClass("fancybox-show-infobar",!!(e.infobar&&t.group.length>1)).toggleClass("fancybox-show-caption",!!t.$caption).toggleClass("fancybox-show-nav",!!(e.arrows&&t.group.length>1)).toggleClass("fancybox-is-modal",!!e.modal)},toggleControls:function(){this.hasHiddenControls?this.showControls():this.hideControls()}}),n.fancybox={version:"3.5.7",defaults:a,getInstance:function(t){var e=n('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),o=Array.prototype.slice.call(arguments,1);return e instanceof b&&("string"===n.type(t)?e[t].apply(e,o):"function"===n.type(t)&&t.apply(e,o),e)},open:function(t,e,n){return new b(t,e,n)},close:function(t){var e=this.getInstance();e&&(e.close(),!0===t&&this.close(t))},destroy:function(){this.close(!0),r.add("body").off("click.fb-start","**")},isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),use3d:function(){var n=e.createElement("div");return t.getComputedStyle&&t.getComputedStyle(n)&&t.getComputedStyle(n).getPropertyValue("transform")&&!(e.documentMode&&e.documentMode<11)}(),getTranslate:function(t){var e;return!(!t||!t.length)&&(e=t[0].getBoundingClientRect(),{top:e.top||0,left:e.left||0,width:e.width,height:e.height,opacity:parseFloat(t.css("opacity"))})},setTranslate:function(t,e){var n="",o={};if(t&&e)return void 0===e.left&&void 0===e.top||(n=(void 0===e.left?t.position().left:e.left)+"px, "+(void 0===e.top?t.position().top:e.top)+"px",n=this.use3d?"translate3d("+n+", 0px)":"translate("+n+")"),void 0!==e.scaleX&&void 0!==e.scaleY?n+=" scale("+e.scaleX+", "+e.scaleY+")":void 0!==e.scaleX&&(n+=" scaleX("+e.scaleX+")"),n.length&&(o.transform=n),void 0!==e.opacity&&(o.opacity=e.opacity),void 0!==e.width&&(o.width=e.width),void 0!==e.height&&(o.height=e.height),t.css(o)},animate:function(t,e,o,i,a){var s,r=this;n.isFunction(o)&&(i=o,o=null),r.stop(t),s=r.getTranslate(t),t.on(f,function(c){(!c||!c.originalEvent||t.is(c.originalEvent.target)&&"z-index"!=c.originalEvent.propertyName)&&(r.stop(t),n.isNumeric(o)&&t.css("transition-duration",""),n.isPlainObject(e)?void 0!==e.scaleX&&void 0!==e.scaleY&&r.setTranslate(t,{top:e.top,left:e.left,width:s.width*e.scaleX,height:s.height*e.scaleY,scaleX:1,scaleY:1}):!0!==a&&t.removeClass(e),n.isFunction(i)&&i(c))}),n.isNumeric(o)&&t.css("transition-duration",o+"ms"),n.isPlainObject(e)?(void 0!==e.scaleX&&void 0!==e.scaleY&&(delete e.width,delete e.height,t.parent().hasClass("fancybox-slide--image")&&t.parent().addClass("fancybox-is-scaling")),n.fancybox.setTranslate(t,e)):t.addClass(e),t.data("timer",setTimeout(function(){t.trigger(f)},o+33))},stop:function(t,e){t&&t.length&&(clearTimeout(t.data("timer")),e&&t.trigger(f),t.off(f).css("transition-duration",""),t.parent().removeClass("fancybox-is-scaling"))}},n.fn.fancybox=function(t){var e;return t=t||{},e=t.selector||!1,e?n("body").off("click.fb-start",e).on("click.fb-start",e,{options:t},i):this.off("click.fb-start").on("click.fb-start",{items:this,options:t},i),this},r.on("click.fb-start","[data-fancybox]",i),r.on("click.fb-start","[data-fancybox-trigger]",function(t){n('[data-fancybox="'+n(this).attr("data-fancybox-trigger")+'"]').eq(n(this).attr("data-fancybox-index")||0).trigger("click.fb-start",{$trigger:n(this)})}),function(){var t=null;r.on("mousedown mouseup focus blur",".fancybox-button",function(e){switch(e.type){case"mousedown":t=n(this);break;case"mouseup":t=null;break;case"focusin":n(".fancybox-button").removeClass("fancybox-focus"),n(this).is(t)||n(this).is("[disabled]")||n(this).addClass("fancybox-focus");break;case"focusout":n(".fancybox-button").removeClass("fancybox-focus")}})}()}}(window,document,jQuery),function(t){"use strict";var e={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"https://www.youtube-nocookie.com/embed/$4",thumb:"https://img.youtube.com/vi/$4/hqdefault.jpg"},vimeo:{matcher:/^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1},paramPlace:3,type:"iframe",url:"//player.vimeo.com/video/$2"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},gmap_place:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/?ll="+(t[9]?t[9]+"&z="+Math.floor(t[10])+(t[12]?t[12].replace(/^\//,"&"):""):t[12]+"").replace(/\?/,"&")+"&output="+(t[12]&&t[12].indexOf("layer=c")>0?"svembed":"embed")}},gmap_search:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/maps?q="+t[5].replace("query=","q=").replace("api=1","")+"&output=embed"}}},n=function(e,n,o){if(e)return o=o||"","object"===t.type(o)&&(o=t.param(o,!0)),t.each(n,function(t,n){e=e.replace("$"+t,n||"")}),o.length&&(e+=(e.indexOf("?")>0?"&":"?")+o),e};t(document).on("objectNeedsType.fb",function(o,i,a){var s,r,c,l,d,u,f,p=a.src||"",h=!1;s=t.extend(!0,{},e,a.opts.media),t.each(s,function(e,o){if(c=p.match(o.matcher)){if(h=o.type,f=e,u={},o.paramPlace&&c[o.paramPlace]){d=c[o.paramPlace],"?"==d[0]&&(d=d.substring(1)),d=d.split("&");for(var i=0;i<d.length;++i){var s=d[i].split("=",2);2==s.length&&(u[s[0]]=decodeURIComponent(s[1].replace(/\+/g," ")))}}return l=t.extend(!0,{},o.params,a.opts[e],u),p="function"===t.type(o.url)?o.url.call(this,c,l,a):n(o.url,c,l),r="function"===t.type(o.thumb)?o.thumb.call(this,c,l,a):n(o.thumb,c),"youtube"===e?p=p.replace(/&t=((\d+)m)?(\d+)s/,function(t,e,n,o){return"&start="+((n?60*parseInt(n,10):0)+parseInt(o,10))}):"vimeo"===e&&(p=p.replace("&%23","#")),!1}}),h?(a.opts.thumb||a.opts.$thumb&&a.opts.$thumb.length||(a.opts.thumb=r),"iframe"===h&&(a.opts=t.extend(!0,a.opts,{iframe:{preload:!1,attr:{scrolling:"no"}}})),t.extend(a,{type:h,src:p,origSrc:a.src,contentSource:f,contentType:"image"===h?"image":"gmap_place"==f||"gmap_search"==f?"map":"video"})):p&&(a.type=a.opts.defaultType)});var o={youtube:{src:"https://www.youtube.com/iframe_api",class:"YT",loading:!1,loaded:!1},vimeo:{src:"https://player.vimeo.com/api/player.js",class:"Vimeo",loading:!1,loaded:!1},load:function(t){var e,n=this;if(this[t].loaded)return void setTimeout(function(){n.done(t)});this[t].loading||(this[t].loading=!0,e=document.createElement("script"),e.type="text/javascript",e.src=this[t].src,"youtube"===t?window.onYouTubeIframeAPIReady=function(){n[t].loaded=!0,n.done(t)}:e.onload=function(){n[t].loaded=!0,n.done(t)},document.body.appendChild(e))},done:function(e){var n,o,i;"youtube"===e&&delete window.onYouTubeIframeAPIReady,(n=t.fancybox.getInstance())&&(o=n.current.$content.find("iframe"),"youtube"===e&&void 0!==YT&&YT?i=new YT.Player(o.attr("id"),{events:{onStateChange:function(t){0==t.data&&n.next()}}}):"vimeo"===e&&void 0!==Vimeo&&Vimeo&&(i=new Vimeo.Player(o),i.on("ended",function(){n.next()})))}};t(document).on({"afterShow.fb":function(t,e,n){e.group.length>1&&("youtube"===n.contentSource||"vimeo"===n.contentSource)&&o.load(n.contentSource)}})}(jQuery),function(t,e,n){"use strict";var o=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),i=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),a=function(e){var n=[];e=e.originalEvent||e||t.e,e=e.touches&&e.touches.length?e.touches:e.changedTouches&&e.changedTouches.length?e.changedTouches:[e];for(var o in e)e[o].pageX?n.push({x:e[o].pageX,y:e[o].pageY}):e[o].clientX&&n.push({x:e[o].clientX,y:e[o].clientY});return n},s=function(t,e,n){return e&&t?"x"===n?t.x-e.x:"y"===n?t.y-e.y:Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)):0},r=function(t){if(t.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe')||n.isFunction(t.get(0).onclick)||t.data("selectable"))return!0;for(var e=0,o=t[0].attributes,i=o.length;e<i;e++)if("data-fancybox-"===o[e].nodeName.substr(0,14))return!0;return!1},c=function(e){var n=t.getComputedStyle(e)["overflow-y"],o=t.getComputedStyle(e)["overflow-x"],i=("scroll"===n||"auto"===n)&&e.scrollHeight>e.clientHeight,a=("scroll"===o||"auto"===o)&&e.scrollWidth>e.clientWidth;return i||a},l=function(t){for(var e=!1;;){if(e=c(t.get(0)))break;if(t=t.parent(),!t.length||t.hasClass("fancybox-stage")||t.is("body"))break}return e},d=function(t){var e=this;e.instance=t,e.$bg=t.$refs.bg,e.$stage=t.$refs.stage,e.$container=t.$refs.container,e.destroy(),e.$container.on("touchstart.fb.touch mousedown.fb.touch",n.proxy(e,"ontouchstart"))};d.prototype.destroy=function(){var t=this;t.$container.off(".fb.touch"),n(e).off(".fb.touch"),t.requestId&&(i(t.requestId),t.requestId=null),t.tapped&&(clearTimeout(t.tapped),t.tapped=null)},d.prototype.ontouchstart=function(o){var i=this,c=n(o.target),d=i.instance,u=d.current,f=u.$slide,p=u.$content,h="touchstart"==o.type;if(h&&i.$container.off("mousedown.fb.touch"),(!o.originalEvent||2!=o.originalEvent.button)&&f.length&&c.length&&!r(c)&&!r(c.parent())&&(c.is("img")||!(o.originalEvent.clientX>c[0].clientWidth+c.offset().left))){if(!u||d.isAnimating||u.$slide.hasClass("fancybox-animated"))return o.stopPropagation(),void o.preventDefault();i.realPoints=i.startPoints=a(o),i.startPoints.length&&(u.touch&&o.stopPropagation(),i.startEvent=o,i.canTap=!0,i.$target=c,i.$content=p,i.opts=u.opts.touch,i.isPanning=!1,i.isSwiping=!1,i.isZooming=!1,i.isScrolling=!1,i.canPan=d.canPan(),i.startTime=(new Date).getTime(),i.distanceX=i.distanceY=i.distance=0,i.canvasWidth=Math.round(f[0].clientWidth),i.canvasHeight=Math.round(f[0].clientHeight),i.contentLastPos=null,i.contentStartPos=n.fancybox.getTranslate(i.$content)||{top:0,left:0},i.sliderStartPos=n.fancybox.getTranslate(f),i.stagePos=n.fancybox.getTranslate(d.$refs.stage),i.sliderStartPos.top-=i.stagePos.top,i.sliderStartPos.left-=i.stagePos.left,i.contentStartPos.top-=i.stagePos.top,i.contentStartPos.left-=i.stagePos.left,n(e).off(".fb.touch").on(h?"touchend.fb.touch touchcancel.fb.touch":"mouseup.fb.touch mouseleave.fb.touch",n.proxy(i,"ontouchend")).on(h?"touchmove.fb.touch":"mousemove.fb.touch",n.proxy(i,"ontouchmove")),n.fancybox.isMobile&&e.addEventListener("scroll",i.onscroll,!0),((i.opts||i.canPan)&&(c.is(i.$stage)||i.$stage.find(c).length)||(c.is(".fancybox-image")&&o.preventDefault(),n.fancybox.isMobile&&c.parents(".fancybox-caption").length))&&(i.isScrollable=l(c)||l(c.parent()),n.fancybox.isMobile&&i.isScrollable||o.preventDefault(),(1===i.startPoints.length||u.hasError)&&(i.canPan?(n.fancybox.stop(i.$content),i.isPanning=!0):i.isSwiping=!0,i.$container.addClass("fancybox-is-grabbing")),2===i.startPoints.length&&"image"===u.type&&(u.isLoaded||u.$ghost)&&(i.canTap=!1,i.isSwiping=!1,i.isPanning=!1,i.isZooming=!0,n.fancybox.stop(i.$content),i.centerPointStartX=.5*(i.startPoints[0].x+i.startPoints[1].x)-n(t).scrollLeft(),i.centerPointStartY=.5*(i.startPoints[0].y+i.startPoints[1].y)-n(t).scrollTop(),i.percentageOfImageAtPinchPointX=(i.centerPointStartX-i.contentStartPos.left)/i.contentStartPos.width,i.percentageOfImageAtPinchPointY=(i.centerPointStartY-i.contentStartPos.top)/i.contentStartPos.height,i.startDistanceBetweenFingers=s(i.startPoints[0],i.startPoints[1]))))}},d.prototype.onscroll=function(t){var n=this;n.isScrolling=!0,e.removeEventListener("scroll",n.onscroll,!0)},d.prototype.ontouchmove=function(t){var e=this;return void 0!==t.originalEvent.buttons&&0===t.originalEvent.buttons?void e.ontouchend(t):e.isScrolling?void(e.canTap=!1):(e.newPoints=a(t),void((e.opts||e.canPan)&&e.newPoints.length&&e.newPoints.length&&(e.isSwiping&&!0===e.isSwiping||t.preventDefault(),e.distanceX=s(e.newPoints[0],e.startPoints[0],"x"),e.distanceY=s(e.newPoints[0],e.startPoints[0],"y"),e.distance=s(e.newPoints[0],e.startPoints[0]),e.distance>0&&(e.isSwiping?e.onSwipe(t):e.isPanning?e.onPan():e.isZooming&&e.onZoom()))))},d.prototype.onSwipe=function(e){var a,s=this,r=s.instance,c=s.isSwiping,l=s.sliderStartPos.left||0;if(!0!==c)"x"==c&&(s.distanceX>0&&(s.instance.group.length<2||0===s.instance.current.index&&!s.instance.current.opts.loop)?l+=Math.pow(s.distanceX,.8):s.distanceX<0&&(s.instance.group.length<2||s.instance.current.index===s.instance.group.length-1&&!s.instance.current.opts.loop)?l-=Math.pow(-s.distanceX,.8):l+=s.distanceX),s.sliderLastPos={top:"x"==c?0:s.sliderStartPos.top+s.distanceY,left:l},s.requestId&&(i(s.requestId),s.requestId=null),s.requestId=o(function(){s.sliderLastPos&&(n.each(s.instance.slides,function(t,e){var o=e.pos-s.instance.currPos;n.fancybox.setTranslate(e.$slide,{top:s.sliderLastPos.top,left:s.sliderLastPos.left+o*s.canvasWidth+o*e.opts.gutter})}),s.$container.addClass("fancybox-is-sliding"))});else if(Math.abs(s.distance)>10){if(s.canTap=!1,r.group.length<2&&s.opts.vertical?s.isSwiping="y":r.isDragging||!1===s.opts.vertical||"auto"===s.opts.vertical&&n(t).width()>800?s.isSwiping="x":(a=Math.abs(180*Math.atan2(s.distanceY,s.distanceX)/Math.PI),s.isSwiping=a>45&&a<135?"y":"x"),"y"===s.isSwiping&&n.fancybox.isMobile&&s.isScrollable)return void(s.isScrolling=!0);r.isDragging=s.isSwiping,s.startPoints=s.newPoints,n.each(r.slides,function(t,e){var o,i;n.fancybox.stop(e.$slide),o=n.fancybox.getTranslate(e.$slide),i=n.fancybox.getTranslate(r.$refs.stage),e.$slide.css({transform:"",opacity:"","transition-duration":""}).removeClass("fancybox-animated").removeClass(function(t,e){return(e.match(/(^|\s)fancybox-fx-\S+/g)||[]).join(" ")}),e.pos===r.current.pos&&(s.sliderStartPos.top=o.top-i.top,s.sliderStartPos.left=o.left-i.left),n.fancybox.setTranslate(e.$slide,{top:o.top-i.top,left:o.left-i.left})}),r.SlideShow&&r.SlideShow.isActive&&r.SlideShow.stop()}},d.prototype.onPan=function(){var t=this;if(s(t.newPoints[0],t.realPoints[0])<(n.fancybox.isMobile?10:5))return void(t.startPoints=t.newPoints);t.canTap=!1,t.contentLastPos=t.limitMovement(),t.requestId&&i(t.requestId),t.requestId=o(function(){n.fancybox.setTranslate(t.$content,t.contentLastPos)})},d.prototype.limitMovement=function(){var t,e,n,o,i,a,s=this,r=s.canvasWidth,c=s.canvasHeight,l=s.distanceX,d=s.distanceY,u=s.contentStartPos,f=u.left,p=u.top,h=u.width,g=u.height;return i=h>r?f+l:f,a=p+d,t=Math.max(0,.5*r-.5*h),e=Math.max(0,.5*c-.5*g),n=Math.min(r-h,.5*r-.5*h),o=Math.min(c-g,.5*c-.5*g),l>0&&i>t&&(i=t-1+Math.pow(-t+f+l,.8)||0),l<0&&i<n&&(i=n+1-Math.pow(n-f-l,.8)||0),d>0&&a>e&&(a=e-1+Math.pow(-e+p+d,.8)||0),d<0&&a<o&&(a=o+1-Math.pow(o-p-d,.8)||0),{top:a,left:i}},d.prototype.limitPosition=function(t,e,n,o){var i=this,a=i.canvasWidth,s=i.canvasHeight;return n>a?(t=t>0?0:t,t=t<a-n?a-n:t):t=Math.max(0,a/2-n/2),o>s?(e=e>0?0:e,e=e<s-o?s-o:e):e=Math.max(0,s/2-o/2),{top:e,left:t}},d.prototype.onZoom=function(){var e=this,a=e.contentStartPos,r=a.width,c=a.height,l=a.left,d=a.top,u=s(e.newPoints[0],e.newPoints[1]),f=u/e.startDistanceBetweenFingers,p=Math.floor(r*f),h=Math.floor(c*f),g=(r-p)*e.percentageOfImageAtPinchPointX,b=(c-h)*e.percentageOfImageAtPinchPointY,m=(e.newPoints[0].x+e.newPoints[1].x)/2-n(t).scrollLeft(),v=(e.newPoints[0].y+e.newPoints[1].y)/2-n(t).scrollTop(),y=m-e.centerPointStartX,x=v-e.centerPointStartY,w=l+(g+y),$=d+(b+x),S={top:$,left:w,scaleX:f,scaleY:f};e.canTap=!1,e.newWidth=p,e.newHeight=h,e.contentLastPos=S,e.requestId&&i(e.requestId),e.requestId=o(function(){n.fancybox.setTranslate(e.$content,e.contentLastPos)})},d.prototype.ontouchend=function(t){var o=this,s=o.isSwiping,r=o.isPanning,c=o.isZooming,l=o.isScrolling;if(o.endPoints=a(t),o.dMs=Math.max((new Date).getTime()-o.startTime,1),o.$container.removeClass("fancybox-is-grabbing"),n(e).off(".fb.touch"),e.removeEventListener("scroll",o.onscroll,!0),o.requestId&&(i(o.requestId),o.requestId=null),o.isSwiping=!1,o.isPanning=!1,o.isZooming=!1,o.isScrolling=!1,o.instance.isDragging=!1,o.canTap)return o.onTap(t);o.speed=100,o.velocityX=o.distanceX/o.dMs*.5,o.velocityY=o.distanceY/o.dMs*.5,r?o.endPanning():c?o.endZooming():o.endSwiping(s,l)},d.prototype.endSwiping=function(t,e){var o=this,i=!1,a=o.instance.group.length,s=Math.abs(o.distanceX),r="x"==t&&a>1&&(o.dMs>130&&s>10||s>50);o.sliderLastPos=null,"y"==t&&!e&&Math.abs(o.distanceY)>50?(n.fancybox.animate(o.instance.current.$slide,{top:o.sliderStartPos.top+o.distanceY+150*o.velocityY,opacity:0},200),i=o.instance.close(!0,250)):r&&o.distanceX>0?i=o.instance.previous(300):r&&o.distanceX<0&&(i=o.instance.next(300)),!1!==i||"x"!=t&&"y"!=t||o.instance.centerSlide(200),o.$container.removeClass("fancybox-is-sliding")},d.prototype.endPanning=function(){var t,e,o,i=this;i.contentLastPos&&(!1===i.opts.momentum||i.dMs>350?(t=i.contentLastPos.left,e=i.contentLastPos.top):(t=i.contentLastPos.left+500*i.velocityX,e=i.contentLastPos.top+500*i.velocityY),o=i.limitPosition(t,e,i.contentStartPos.width,i.contentStartPos.height),o.width=i.contentStartPos.width,o.height=i.contentStartPos.height,n.fancybox.animate(i.$content,o,366))},d.prototype.endZooming=function(){var t,e,o,i,a=this,s=a.instance.current,r=a.newWidth,c=a.newHeight;a.contentLastPos&&(t=a.contentLastPos.left,e=a.contentLastPos.top,i={top:e,left:t,width:r,height:c,scaleX:1,scaleY:1},n.fancybox.setTranslate(a.$content,i),r<a.canvasWidth&&c<a.canvasHeight?a.instance.scaleToFit(150):r>s.width||c>s.height?a.instance.scaleToActual(a.centerPointStartX,a.centerPointStartY,150):(o=a.limitPosition(t,e,r,c),n.fancybox.animate(a.$content,o,150)))},d.prototype.onTap=function(e){var o,i=this,s=n(e.target),r=i.instance,c=r.current,l=e&&a(e)||i.startPoints,d=l[0]?l[0].x-n(t).scrollLeft()-i.stagePos.left:0,u=l[0]?l[0].y-n(t).scrollTop()-i.stagePos.top:0,f=function(t){var o=c.opts[t];if(n.isFunction(o)&&(o=o.apply(r,[c,e])),o)switch(o){case"close":r.close(i.startEvent);break;case"toggleControls":r.toggleControls();break;case"next":r.next();break;case"nextOrClose":r.group.length>1?r.next():r.close(i.startEvent);break;case"zoom":"image"==c.type&&(c.isLoaded||c.$ghost)&&(r.canPan()?r.scaleToFit():r.isScaledDown()?r.scaleToActual(d,u):r.group.length<2&&r.close(i.startEvent))}};if((!e.originalEvent||2!=e.originalEvent.button)&&(s.is("img")||!(d>s[0].clientWidth+s.offset().left))){if(s.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"))o="Outside";else if(s.is(".fancybox-slide"))o="Slide";else{if(!r.current.$content||!r.current.$content.find(s).addBack().filter(s).length)return;o="Content"}if(i.tapped){if(clearTimeout(i.tapped),i.tapped=null,Math.abs(d-i.tapX)>50||Math.abs(u-i.tapY)>50)return this;f("dblclick"+o)}else i.tapX=d,i.tapY=u,c.opts["dblclick"+o]&&c.opts["dblclick"+o]!==c.opts["click"+o]?i.tapped=setTimeout(function(){i.tapped=null,r.isAnimating||f("click"+o)},500):f("click"+o);return this}},n(e).on("onActivate.fb",function(t,e){e&&!e.Guestures&&(e.Guestures=new d(e))}).on("beforeClose.fb",function(t,e){e&&e.Guestures&&e.Guestures.destroy()})}(window,document,jQuery),function(t,e){"use strict";e.extend(!0,e.fancybox.defaults,{btnTpl:{slideShow:'<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>'},slideShow:{autoStart:!1,speed:3e3,progress:!0}});var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{timer:null,isActive:!1,$button:null,init:function(){var t=this,n=t.instance,o=n.group[n.currIndex].opts.slideShow;t.$button=n.$refs.toolbar.find("[data-fancybox-play]").on("click",function(){t.toggle()}),n.group.length<2||!o?t.$button.hide():o.progress&&(t.$progress=e('<div class="fancybox-progress"></div>').appendTo(n.$refs.inner))},set:function(t){var n=this,o=n.instance,i=o.current;i&&(!0===t||i.opts.loop||o.currIndex<o.group.length-1)?n.isActive&&"video"!==i.contentType&&(n.$progress&&e.fancybox.animate(n.$progress.show(),{scaleX:1},i.opts.slideShow.speed),n.timer=setTimeout(function(){o.current.opts.loop||o.current.index!=o.group.length-1?o.next():o.jumpTo(0)},i.opts.slideShow.speed)):(n.stop(),o.idleSecondsCounter=0,o.showControls())},clear:function(){var t=this;clearTimeout(t.timer),t.timer=null,t.$progress&&t.$progress.removeAttr("style").hide()},start:function(){var t=this,e=t.instance.current;e&&(t.$button.attr("title",(e.opts.i18n[e.opts.lang]||e.opts.i18n.en).PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"),t.isActive=!0,e.isComplete&&t.set(!0),t.instance.trigger("onSlideShowChange",!0))},stop:function(){var t=this,e=t.instance.current;t.clear(),t.$button.attr("title",(e.opts.i18n[e.opts.lang]||e.opts.i18n.en).PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"),t.isActive=!1,t.instance.trigger("onSlideShowChange",!1),t.$progress&&t.$progress.removeAttr("style").hide()},toggle:function(){var t=this;t.isActive?t.stop():t.start()}}),e(t).on({"onInit.fb":function(t,e){e&&!e.SlideShow&&(e.SlideShow=new n(e))},"beforeShow.fb":function(t,e,n,o){var i=e&&e.SlideShow;o?i&&n.opts.slideShow.autoStart&&i.start():i&&i.isActive&&i.clear()},"afterShow.fb":function(t,e,n){var o=e&&e.SlideShow;o&&o.isActive&&o.set()},"afterKeydown.fb":function(n,o,i,a,s){var r=o&&o.SlideShow;!r||!i.opts.slideShow||80!==s&&32!==s||e(t.activeElement).is("button,a,input")||(a.preventDefault(),r.toggle())},"beforeClose.fb onDeactivate.fb":function(t,e){var n=e&&e.SlideShow;n&&n.stop()}}),e(t).on("visibilitychange",function(){var n=e.fancybox.getInstance(),o=n&&n.SlideShow;o&&o.isActive&&(t.hidden?o.clear():o.set())})}(document,jQuery),function(t,e){"use strict";var n=function(){for(var e=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],n={},o=0;o<e.length;o++){var i=e[o];if(i&&i[1]in t){for(var a=0;a<i.length;a++)n[e[0][a]]=i[a];return n}}return!1}();if(n){var o={request:function(e){e=e||t.documentElement,e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT)},exit:function(){t[n.exitFullscreen]()},toggle:function(e){e=e||t.documentElement,this.isFullscreen()?this.exit():this.request(e)},isFullscreen:function(){return Boolean(t[n.fullscreenElement])},enabled:function(){return Boolean(t[n.fullscreenEnabled])}};e.extend(!0,e.fancybox.defaults,{btnTpl:{fullScreen:'<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>'},fullScreen:{autoStart:!1}}),e(t).on(n.fullscreenchange,function(){var t=o.isFullscreen(),n=e.fancybox.getInstance();n&&(n.current&&"image"===n.current.type&&n.isAnimating&&(n.isAnimating=!1,n.update(!0,!0,0),n.isComplete||n.complete()),n.trigger("onFullscreenChange",t),n.$refs.container.toggleClass("fancybox-is-fullscreen",t),n.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter",!t).toggleClass("fancybox-button--fsexit",t))})}e(t).on({"onInit.fb":function(t,e){var i;if(!n)return void e.$refs.toolbar.find("[data-fancybox-fullscreen]").remove();e&&e.group[e.currIndex].opts.fullScreen?(i=e.$refs.container,i.on("click.fb-fullscreen","[data-fancybox-fullscreen]",function(t){t.stopPropagation(),t.preventDefault(),o.toggle()}),e.opts.fullScreen&&!0===e.opts.fullScreen.autoStart&&o.request(),e.FullScreen=o):e&&e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide()},"afterKeydown.fb":function(t,e,n,o,i){e&&e.FullScreen&&70===i&&(o.preventDefault(),e.FullScreen.toggle())},"beforeClose.fb":function(t,e){e&&e.FullScreen&&e.$refs.container.hasClass("fancybox-is-fullscreen")&&o.exit()}})}(document,jQuery),function(t,e){"use strict";var n="fancybox-thumbs";e.fancybox.defaults=e.extend(!0,{btnTpl:{thumbs:'<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>'},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"}},e.fancybox.defaults);var o=function(t){this.init(t)};e.extend(o.prototype,{$button:null,$grid:null,$list:null,isVisible:!1,isActive:!1,init:function(t){var e=this,n=t.group,o=0;e.instance=t,e.opts=n[t.currIndex].opts.thumbs,t.Thumbs=e,e.$button=t.$refs.toolbar.find("[data-fancybox-thumbs]");for(var i=0,a=n.length;i<a&&(n[i].thumb&&o++,!(o>1));i++);o>1&&e.opts?(e.$button.removeAttr("style").on("click",function(){e.toggle()}),e.isActive=!0):e.$button.hide()},create:function(){var t,o=this,i=o.instance,a=o.opts.parentEl,s=[];o.$grid||(o.$grid=e('<div class="'+n+" "+n+"-"+o.opts.axis+'"></div>').appendTo(i.$refs.container.find(a).addBack().filter(a)),o.$grid.on("click","a",function(){i.jumpTo(e(this).attr("data-index"))})),o.$list||(o.$list=e('<div class="'+n+'__list">').appendTo(o.$grid)),e.each(i.group,function(e,n){t=n.thumb,t||"image"!==n.type||(t=n.src),s.push('<a href="javascript:;" tabindex="0" data-index="'+e+'"'+(t&&t.length?' style="background-image:url('+t+')"':'class="fancybox-thumbs-missing"')+"></a>")}),o.$list[0].innerHTML=s.join(""),"x"===o.opts.axis&&o.$list.width(parseInt(o.$grid.css("padding-right"),10)+i.group.length*o.$list.children().eq(0).outerWidth(!0))},focus:function(t){var e,n,o=this,i=o.$list,a=o.$grid;o.instance.current&&(e=i.children().removeClass("fancybox-thumbs-active").filter('[data-index="'+o.instance.current.index+'"]').addClass("fancybox-thumbs-active"),n=e.position(),"y"===o.opts.axis&&(n.top<0||n.top>i.height()-e.outerHeight())?i.stop().animate({scrollTop:i.scrollTop()+n.top},t):"x"===o.opts.axis&&(n.left<a.scrollLeft()||n.left>a.scrollLeft()+(a.width()-e.outerWidth()))&&i.parent().stop().animate({scrollLeft:n.left},t))},update:function(){var t=this;t.instance.$refs.container.toggleClass("fancybox-show-thumbs",this.isVisible),t.isVisible?(t.$grid||t.create(),t.instance.trigger("onThumbsShow"),t.focus(0)):t.$grid&&t.instance.trigger("onThumbsHide"),t.instance.update()},hide:function(){this.isVisible=!1,this.update()},show:function(){this.isVisible=!0,this.update()},toggle:function(){this.isVisible=!this.isVisible,this.update()}}),e(t).on({"onInit.fb":function(t,e){var n;e&&!e.Thumbs&&(n=new o(e),n.isActive&&!0===n.opts.autoStart&&n.show())},"beforeShow.fb":function(t,e,n,o){var i=e&&e.Thumbs;i&&i.isVisible&&i.focus(o?0:250)},"afterKeydown.fb":function(t,e,n,o,i){var a=e&&e.Thumbs;a&&a.isActive&&71===i&&(o.preventDefault(),a.toggle())},"beforeClose.fb":function(t,e){var n=e&&e.Thumbs;n&&n.isVisible&&!1!==n.opts.hideOnClose&&n.$grid.hide()}})}(document,jQuery),function(t,e){"use strict";function n(t){var e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};return String(t).replace(/[&<>"'`=\/]/g,function(t){return e[t]})}e.extend(!0,e.fancybox.defaults,{btnTpl:{share:'<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>'},share:{url:function(t,e){return!t.currentHash&&"inline"!==e.type&&"html"!==e.type&&(e.origSrc||e.src)||window.location},
tpl:'<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>'}}),e(t).on("click","[data-fancybox-share]",function(){var t,o,i=e.fancybox.getInstance(),a=i.current||null;a&&("function"===e.type(a.opts.share.url)&&(t=a.opts.share.url.apply(a,[i,a])),o=a.opts.share.tpl.replace(/\{\{media\}\}/g,"image"===a.type?encodeURIComponent(a.src):"").replace(/\{\{url\}\}/g,encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g,n(t)).replace(/\{\{descr\}\}/g,i.$caption?encodeURIComponent(i.$caption.text()):""),e.fancybox.open({src:i.translate(i,o),type:"html",opts:{touch:!1,animationEffect:!1,afterLoad:function(t,e){i.$refs.container.one("beforeClose.fb",function(){t.close(null,0)}),e.$content.find(".fancybox-share__button").click(function(){return window.open(this.href,"Share","width=550, height=450"),!1})},mobile:{autoFocus:!1}}}))})}(document,jQuery),function(t,e,n){"use strict";function o(){var e=t.location.hash.substr(1),n=e.split("-"),o=n.length>1&&/^\+?\d+$/.test(n[n.length-1])?parseInt(n.pop(-1),10)||1:1,i=n.join("-");return{hash:e,index:o<1?1:o,gallery:i}}function i(t){""!==t.gallery&&n("[data-fancybox='"+n.escapeSelector(t.gallery)+"']").eq(t.index-1).focus().trigger("click.fb-start")}function a(t){var e,n;return!!t&&(e=t.current?t.current.opts:t.opts,""!==(n=e.hash||(e.$orig?e.$orig.data("fancybox")||e.$orig.data("fancybox-trigger"):""))&&n)}n.escapeSelector||(n.escapeSelector=function(t){return(t+"").replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t})}),n(function(){!1!==n.fancybox.defaults.hash&&(n(e).on({"onInit.fb":function(t,e){var n,i;!1!==e.group[e.currIndex].opts.hash&&(n=o(),(i=a(e))&&n.gallery&&i==n.gallery&&(e.currIndex=n.index-1))},"beforeShow.fb":function(n,o,i,s){var r;i&&!1!==i.opts.hash&&(r=a(o))&&(o.currentHash=r+(o.group.length>1?"-"+(i.index+1):""),t.location.hash!=="#"+o.currentHash&&(s&&!o.origHash&&(o.origHash=t.location.hash),o.hashTimer&&clearTimeout(o.hashTimer),o.hashTimer=setTimeout(function(){"replaceState"in t.history?(t.history[s?"pushState":"replaceState"]({},e.title,t.location.pathname+t.location.search+"#"+o.currentHash),s&&(o.hasCreatedHistory=!0)):t.location.hash=o.currentHash,o.hashTimer=null},300)))},"beforeClose.fb":function(n,o,i){i&&!1!==i.opts.hash&&(clearTimeout(o.hashTimer),o.currentHash&&o.hasCreatedHistory?t.history.back():o.currentHash&&("replaceState"in t.history?t.history.replaceState({},e.title,t.location.pathname+t.location.search+(o.origHash||"")):t.location.hash=o.origHash),o.currentHash=null)}}),n(t).on("hashchange.fb",function(){var t=o(),e=null;n.each(n(".fancybox-container").get().reverse(),function(t,o){var i=n(o).data("FancyBox");if(i&&i.currentHash)return e=i,!1}),e?e.currentHash===t.gallery+"-"+t.index||1===t.index&&e.currentHash==t.gallery||(e.currentHash=null,e.close()):""!==t.gallery&&i(t)}),setTimeout(function(){n.fancybox.getInstance()||i(o())},50))})}(window,document,jQuery),function(t,e){"use strict";var n=(new Date).getTime();e(t).on({"onInit.fb":function(t,e,o){e.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll",function(t){var o=e.current,i=(new Date).getTime();e.group.length<2||!1===o.opts.wheel||"auto"===o.opts.wheel&&"image"!==o.type||(t.preventDefault(),t.stopPropagation(),o.$slide.hasClass("fancybox-animated")||(t=t.originalEvent||t,i-n<250||(n=i,e[(-t.deltaY||-t.deltaX||t.wheelDelta||-t.detail)<0?"next":"previous"]())))})}})}(document,jQuery);
;
//# sourceMappingURL=scripts.js.map