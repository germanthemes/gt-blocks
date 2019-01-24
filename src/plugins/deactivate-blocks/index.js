/**
 * External dependencies
 */
const { assign } = window.lodash;

/**
 * WordPress dependencies
 */
const { addFilter } = wp.hooks;

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
