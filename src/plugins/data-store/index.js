const { registerStore } = wp.data;

const DEFAULT_STATE = {
	pluginURL: '',
	pluginOptions: {},
};

const actions = {
	setPluginOptions( pluginOptions ) {
		return {
			type: 'SET_PLUGIN_OPTIONS',
			pluginOptions,
		};
	},
	setPluginURL( pluginURL ) {
		return {
			type: 'SET_PLUGIN_URL',
			pluginURL,
		};
	},
};

registerStore( 'gt-blocks-store', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_PLUGIN_OPTIONS':
				return {
					...state,
					pluginOptions: action.pluginOptions,
				};

			case 'SET_PLUGIN_URL':
				return {
					...state,
					pluginURL: action.pluginURL,
				};
		}

		return state;
	},

	actions,

	selectors: {
		getPluginOptions( state ) {
			const { pluginOptions } = state;
			return pluginOptions;
		},
		getPluginURL( state ) {
			const { pluginURL } = state;
			return pluginURL;
		},
	},
} );
