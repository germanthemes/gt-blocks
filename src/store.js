const { registerStore } = wp.data;

const DEFAULT_STATE = {
    pluginURL: '',
    contentWidth: 0,
};

const actions = {
    setPluginURL( pluginURL ) {
        return {
            type: 'SET_PLUGIN_URL',
            pluginURL,
        };
    },
};

registerStore( 'gt-blocks', {
    reducer( state = DEFAULT_STATE, action ) {
        switch ( action.type ) {
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
        getPluginURL( state ) {
            const { pluginURL } = state;
            return pluginURL;
        },
    },
} );
