/**
 * WordPress dependencies
 */
const { unregisterBlockType } = wp.blocks;
const { select } = wp.data;

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
