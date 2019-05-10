const contentContainerAttributes = {
	allowedBlocks: {
		type: 'array',
	},
	template: {
		type: 'array',
	},
	templateLock: {
		type: 'string',
	},
	padding: {
		type: 'string',
		default: 'default',
	},
	removeFirstBlockPadding: {
		type: 'boolean',
		default: false,
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
};

export default contentContainerAttributes;
