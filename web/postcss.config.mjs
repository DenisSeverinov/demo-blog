const config = {
	plugins: {
		"postcss-flexbugs-fixes": {},
		"postcss-preset-env": {
			autoprefixer: {
				flexbox: "no-2009",
			},
			stage: 3,
			features: {
				"custom-properties": false,
				"nesting-rules": true,
			},
		},
	},
};

export default config;
