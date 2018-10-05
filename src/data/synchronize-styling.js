/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { Button, Dashicon, PanelBody } = wp.components;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import {
	synchronizeButtons,
	synchronizeColumns,
	synchronizeHeadings,
	synchronizeIcons,
	synchronizeParagraphs,
} from './synchronize-functions';

// Define supported blocks.
const supportedBlocks = [
	'gt-layout-blocks/button',
	'gt-layout-blocks/column',
	'gt-layout-blocks/heading',
	'gt-layout-blocks/icon',
	'core/paragraph',
];

const getSiblings = ( blockId, blockType, parentBlock, containerBlock = '' ) => {
	// Get all blocks.
	const blocks = select( 'core/editor' ).getBlocks();

	// Filter out parent blocks.
	const parentBlocks = blocks.filter( block => block.name === parentBlock );

	// Retrieve siblings.
	if ( '' !== containerBlock ) {
		return getSecondLevelSiblings( blockId, blockType, parentBlocks, containerBlock );
	}

	return getFirstLevelSiblings( blockId, blockType, parentBlocks );
};

const getFirstLevelSiblings = ( blockId, blockType, parentBlocks ) => {
	let siblings = [];

	// Loop through parent blocks until siblings are found.
	parentBlocks.some( block => {
		// Get child blocks of parent blocks.
		const siblingIds = block.innerBlocks

			// Filter out sibling blocks (= blocks with same block type).
			.filter( child => child.name === blockType )

			// Get clientIds for all siblings.
			.map( child => child.clientId );

		// Check if blockId matches siblings.
		if ( siblingIds.includes( blockId ) ) {
			siblings = siblingIds;
			return true;
		}
	} );

	return siblings;
};

const getSecondLevelSiblings = ( blockId, blockType, parentBlocks, containerBlock ) => {
	let siblings = [];

	// Loop through parent blocks until siblings are found.
	parentBlocks.some( block => {
		// Get child blocks of parent blocks.
		const siblingIds = block.innerBlocks

			// Filter out container blocks.
			.filter( child => child.name === containerBlock )

			// Get child blocks of container blocks.
			.map( item => item.innerBlocks )

			// Reduce child blocks to one array.
			.reduce( ( a, b ) => a.concat( b ), [] )

			// Filter out sibling blocks (= blocks with same block type).
			.filter( child => child.name === blockType )

			// Get clientIds for all siblings.
			.map( child => child.clientId );

		// Check if blockId matches siblings.
		if ( siblingIds.includes( blockId ) ) {
			siblings = siblingIds;
			return true;
		}
	} );

	return siblings;
};

const synchronizeStyling = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! supportedBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		if ( ! props.attributes.synchronizeStyling || ! props.attributes.parentBlock ) {
			return <BlockEdit { ...props } />;
		}

		const synchronizeAttributes = () => {
			const siblings = getSiblings( props.clientId, props.name, props.attributes.parentBlock, props.attributes.containerBlock );

			switch ( props.name ) {
				case 'gt-layout-blocks/button': {
					synchronizeButtons( siblings, props.attributes );
					break;
				}
				case 'gt-layout-blocks/column': {
					synchronizeColumns( siblings, props.attributes );
					break;
				}
				case 'gt-layout-blocks/heading': {
					synchronizeHeadings( siblings, props.attributes );
					break;
				}
				case 'gt-layout-blocks/icon': {
					synchronizeIcons( siblings, props.attributes );
					break;
				}
				case 'core/paragraph': {
					synchronizeParagraphs( siblings, props.attributes );
					break;
				}
			}
		};

		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody className="gt-panel-synchronize-styling gt-panel">
						<Button
							key="synchronize-buttons"
							isLarge
							onClick={ synchronizeAttributes }
						>
							<Dashicon icon="controls-repeat" />
							{ __( 'Synchronize Styling' ) }
						</Button>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'synchronizeStyling' );
addFilter( 'editor.BlockEdit', 'gt-layout-blocks/synchronize/styling', synchronizeStyling );

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
		containerBlock: {
			type: 'string',
		},
	} );

	return settings;
}
addFilter( 'blocks.registerBlockType', 'gt-layout-blocks/synchronize/attribute', addSynchronizeStylingAttribute );
