/**
 * External dependencies
 */
const { assign } = window.lodash;

/**
 * WordPress dependencies
 */
//const { unregisterBlockType } = wp.blocks;
//const { select } = wp.data;
const { addFilter } = wp.hooks;

/* Unregistering blocks breaks Editor if blocks were already added
wp.domReady( function() {
	// Get Plugin Options.
	const options = select( 'gt-blocks-store' ).getPluginOptions();

	// Unregister deactivated blocks.
	Object.keys( options ).forEach( ( block ) => {
		// Check if block is deactivated.
		if ( false === options[ block ] ) {
			unregisterBlockType( block );
		}
	} );
} );
*/

function removeBlockFromInserter( settings ) {
	function isBlockDisabled( block ) {
		if ( '' === gtEnabledBlocks[ block ] ) {
			return true;
		}

		return false;
	}

	if ( isBlockDisabled( settings.name ) ) {
		settings.supports = assign( settings.supports, {
			inserter: false,
		} );
	}

	return settings;
}
addFilter( 'blocks.registerBlockType', 'gt-blocks/supports/inserter', removeBlockFromInserter );
