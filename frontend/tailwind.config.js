module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			height: {
				"screen-1/2": "50vh",
				"screen-1/3": "33.333333vh",
				"screen-1/4": "25vh",
				"screen-1/5": "20vh",
				"screen-1/6": "16.666667vh",
				"screen-1/7": "14.285714vh",
				"screen-1/8": "12.5vh",
				"screen-1/9": "11.111111vh",
				"screen-1/10": "10vh",
				"screen-1/11": "9.0909091vh",
				"screen-1/12": "8.3333333vh",
				"screen-2/3": "66.666667vh",
			},
			colors: {
				main: "#282455",
				"secondary-color": "#e8219a",
				"tertiary-color": "#39184c",
				"sf-violet": "#c612d1",
			},
			fontFamily: {
				bebas: ["Bebas Neue", "sans-serif"],
				mont: ["Montserrat", "sans-serif"],
			},
		},
	},
	plugins: [],
};
