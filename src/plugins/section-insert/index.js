/**
 * External dependencies
 */
import { castArray, last } from 'lodash';

/**
 * WordPress dependencies
 */
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { Button, Dashicon, PanelBody } = wp.components;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { dispatch, select } = wp.data;
const {
	cloneBlock,
	createBlock,
} = wp.blocks;

/**
 * Internal dependencies
 */
import './editor.scss';

// Define supported blocks.
const supportedBlocks = [
	'gt-layout-blocks/portfolio',
	'gt-layout-blocks/features',
];

const insertIntoSection = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// Return early if block does not support insertIntoSection plugin.
		if ( ! supportedBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		// Get Block functions.
		const {
			getBlocksByClientId,
			getBlockIndex,
			getBlockRootClientId,
		} = select( 'core/editor' );

		const {
			insertBlocks,
			removeBlocks,
		} = dispatch( 'core/editor' );

		// Get current block.
		const { clientId } = props;

		// Get parent block.
		const rootClientId = getBlockRootClientId( clientId );

		// Return if block is already a child block.
		if ( rootClientId ) {
			return <BlockEdit { ...props } />;
		}

		// Wrap with Section function.
		const createSection = () => {
			// Get current block.
			const block = getBlocksByClientId( clientId )[ 0 ];

			// Get position to insert section block.
			const lastSelectedIndex = getBlockIndex( last( castArray( clientId ) ), rootClientId );

			// Clone block and wrap into section block.
			const clonedBlock = cloneBlock( block );
			const sectionBlock = createBlock( 'gt-layout-blocks/section', {}, [ clonedBlock ] );

			// Insert Section block.
			insertBlocks( sectionBlock, lastSelectedIndex + 1, rootClientId );

			// Remove old block.
			removeBlocks( clientId );
		};

		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody className="gt-panel-section-insert gt-panel">
						<Button
							key="synchronize-buttons"
							isLarge
							onClick={ createSection }
						>
							<Dashicon icon="controls-repeat" />
							{ __( 'Insert into GT Section block', 'gt-layout-blocks' ) }
						</Button>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'insertIntoSection' );
addFilter( 'editor.BlockEdit', 'gt-layout-blocks/plugins/section-insert', insertIntoSection );

