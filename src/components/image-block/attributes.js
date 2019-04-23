const imageBlockAttributes = {
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'img',
		attribute: 'src',
	},
	alt: {
		type: 'string',
		source: 'attribute',
		selector: 'img',
		attribute: 'alt',
		default: '',
	},
	size: {
		type: 'string',
		default: 'full',
	},
	maxWidth: {
		type: 'string',
		default: '100',
	},
	href: {
		type: 'string',
		source: 'attribute',
		selector: 'figure > a',
		attribute: 'href',
	},
	linkDestination: {
		type: 'string',
		default: 'none',
	},
};

export default imageBlockAttributes;
