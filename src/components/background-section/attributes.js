const backgroundAttributes = {
	contentWidth: {
		type: 'number',
		default: 720,
	},
	paddingTop: {
		type: 'number',
		default: 64,
	},
	paddingBottom: {
		type: 'number',
		default: 64,
	},
	blockAlignment: {
		type: 'string',
		default: 'center',
	},
	textColor: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	backgroundImageId: {
		type: 'number',
	},
	backgroundImageUrl: {
		type: 'string',
		source: 'attribute',
		selector: '.gt-has-background-image',
		attribute: 'data-background-image',
	},
	imageOpacity: {
		type: 'number',
		default: 100,
	},
	backgroundPosition: {
		type: 'string',
		default: 'center center',
	},
	fixedBackground: {
		type: 'boolean',
		default: false,
	},
};

export default backgroundAttributes;
