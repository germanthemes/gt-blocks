/**
 * WordPress dependencies
 */
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { Button, Dashicon, PanelBody } = wp.components;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

/**
 * Internal dependencies
 */
import {
	getSiblings,
	getParentBlock,
	synchronizeButtons,
	synchronizeColumns,
	synchronizeHeadings,
	synchronizeIcons,
	synchronizeImages,
	synchronizeParagraphs,
} from './functions';
import './editor.scss';

// Define supported blocks.
const supportedBlocks = [
	'gt-blocks/button',
	'gt-blocks/column',
	'gt-blocks/heading',
	'gt-blocks/icon',
	'gt-blocks/image',
	'core/paragraph',
];

// Define parent blocks.
const parentBlocks = [
	'gt-blocks/column',
	'gt-blocks/columns',
	'gt-blocks/features',
	'gt-blocks/portfolio',
	'gt-blocks/grid-layout',
	'gt-blocks/multiple-buttons',
];

const synchronizeStyling = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! supportedBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		// Get Parent Block.
		const parentBlock = getParentBlock( props.clientId );

		// Return early if block has no parent.
		if ( ! parentBlock || ! parentBlocks.includes( parentBlock.name ) ) {
			return <BlockEdit { ...props } />;
		}

		// Retrieve sibling blocks.
		const siblings = getSiblings( props.name, parentBlock );

		// Return early if block has no siblings.
		if ( siblings.length < 2 ) {
			return <BlockEdit { ...props } />;
		}

		// Synchronize Styling function.
		const synchronizeAttributes = () => {
			switch ( props.name ) {
				case 'gt-blocks/button': {
					synchronizeButtons( siblings, props.attributes );
					break;
				}
				case 'gt-blocks/column': {
					synchronizeColumns( siblings, props.attributes );
					break;
				}
				case 'gt-blocks/heading': {
					synchronizeHeadings( siblings, props.attributes );
					break;
				}
				case 'gt-blocks/icon': {
					synchronizeIcons( siblings, props.attributes );
					break;
				}
				case 'gt-blocks/image': {
					synchronizeImages( siblings, props.attributes );
					break;
				}
				case 'core/paragraph': {
					synchronizeParagraphs( siblings, props.attributes );
					break;
				}
			}
		};

		// Synchronize Styling Description Text.
		const synchronizeDescriptionText = () => {
			switch ( props.name ) {
				case 'gt-blocks/button': {
					return __( 'Copy button settings and colors of this block and apply them to all sibling blocks.', 'gt-blocks' );
				}
				case 'gt-blocks/column': {
					return __( 'Copy colors of this block and apply them to all sibling blocks.', 'gt-blocks' );
				}
				case 'gt-blocks/heading': {
					return __( 'Copy heading settings and colors of this block and apply them to all sibling blocks.', 'gt-blocks' );
				}
				case 'gt-blocks/icon': {
					return __( 'Copy icon settings and colors of this block and apply them to all sibling blocks.', 'gt-blocks' );
				}
				case 'gt-blocks/image': {
					return __( 'Copy image size and URL settings of this block and apply them to all sibling blocks.', 'gt-blocks' );
				}
				case 'core/paragraph': {
					return __( 'Copy text settings and colors of this block and apply them to all sibling blocks.', 'gt-blocks' );
				}
			}
		};

		return (
			<Fragment>
				<BlockEdit { ...props } />

				<InspectorControls>

					<PanelBody title={ __( 'Synchronize Styling', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-synchronize-styling gt-panel">

						<p id="gt-synchronize-styling__help" className="components-base-control__help">
							{ synchronizeDescriptionText() }
						</p>

						<Button
							key="synchronize-buttons"
							isLarge
							onClick={ synchronizeAttributes }
						>
							<Dashicon icon="controls-repeat" />
							{ __( 'Synchronize Styling', 'gt-blocks' ) }
						</Button>

					</PanelBody>

				</InspectorControls>
			</Fragment>
		);
	};
}, 'synchronizeStyling' );
addFilter( 'editor.BlockEdit', 'gt-blocks/plugins/synchronize-styling', synchronizeStyling );

