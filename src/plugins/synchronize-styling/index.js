/**
 * External dependencies
 */
const { assign } = window.lodash;

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

const synchronizeStyling = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! supportedBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		if ( ! props.attributes.synchronizeStyling || ! props.attributes.parentBlock ) {
			return <BlockEdit { ...props } />;
		}

		const synchronizeAttributes = () => {
			const siblings = getSiblings( props.clientId, props.name, props.attributes.parentBlock );

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

function addSynchronizeStylingAttribute( settings, name ) {
	if ( ! supportedBlocks.includes( name ) ) {
		return settings;
	}

	settings.attributes = assign( settings.attributes, {
		synchronizeStyling: {
			type: 'boolean',
		},
		parentBlock: {
			type: 'string',
		},
	} );

	return settings;
}
addFilter( 'blocks.registerBlockType', 'gt-blocks/attributes/synchronize-styling', addSynchronizeStylingAttribute );
