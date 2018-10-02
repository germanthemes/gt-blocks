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
const { Button, PanelBody } = wp.components;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { dispatch, select } = wp.data;

const getSiblings = ( blockId, blockType, parentBlock ) => {
	let siblings = [];
	let containerBlock = '';

	switch ( parentBlock ) {
		case 'gt-layout-blocks/hero-image': {
			containerBlock = 'gt-layout-blocks/wrapper';
			break;
		}
		case 'gt-layout-blocks/icon-grid': {
			containerBlock = 'gt-layout-blocks/icon-grid-column';
			break;
		}
	}

	// Get all blocks.
	select( 'core/editor' ).getBlocks()

		// Filter out columns blocks.
		.filter( block => block.name === parentBlock )

		// Loop through columns blocks until siblings are found.
		.some( block => {
			// Get inner blocks.
			const siblingIds = block.innerBlocks

				// Filter out container blocks..
				.filter( child => child.name === containerBlock )

				// Get child blocks of column.
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

const synchronizeParagraphs = ( blockList, attributes ) => {
	const {
		align,
		dropCap,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		fontSize,
		customFontSize,
	} = attributes;

	const newAttributes = {
		align,
		dropCap,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		fontSize,
		customFontSize,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

const synchronizeButtons = ( blockList, attributes ) => {
	const {
		buttonSize,
		paddingVertical,
		paddingHorizontal,
		buttonShape,
		roundedCorners,
		fontStyle,
		uppercase,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
		hoverColor,
		hoverBackgroundColor,
		customHoverColor,
		customHoverBackgroundColor,
		fontSize,
		customFontSize,
	} = attributes;

	const newAttributes = {
		buttonSize,
		paddingVertical,
		paddingHorizontal,
		buttonShape,
		roundedCorners,
		fontStyle,
		uppercase,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
		hoverColor,
		hoverBackgroundColor,
		customHoverColor,
		customHoverBackgroundColor,
		fontSize,
		customFontSize,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

const synchronizeHeadings = ( blockList, attributes ) => {
	const {
		titleTag,
		blockAlignment,
		textAlignment,
		headingWidth,
		marginTop,
		marginBottom,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		fontStyle,
		uppercase,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
		fontSize,
		customFontSize,
		border,
		borderWidth,
	} = attributes;

	const newAttributes = {
		titleTag,
		blockAlignment,
		textAlignment,
		headingWidth,
		marginTop,
		marginBottom,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		fontStyle,
		uppercase,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
		fontSize,
		customFontSize,
		border,
		borderWidth,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

const supportedBlocks = [ 'core/paragraph', 'gt-layout-blocks/button', 'gt-layout-blocks/heading' ];

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
				case 'core/paragraph': {
					synchronizeParagraphs( siblings, props.attributes );
					break;
				}
				case 'gt-layout-blocks/button': {
					synchronizeButtons( siblings, props.attributes );
					break;
				}
				case 'gt-layout-blocks/heading': {
					synchronizeHeadings( siblings, props.attributes );
					break;
				}
			}
		};

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody>
						<Button
							key="synchronize-buttons"
							isLarge
							onClick={ synchronizeAttributes }
						>
							{ __( 'Synchronize Styling' ) }
						</Button>
					</PanelBody>
				</InspectorControls>
				<BlockEdit { ...props } />
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
	} );

	return settings;
}
addFilter( 'blocks.registerBlockType', 'gt-layout-blocks/synchronize/attribute', addSynchronizeStylingAttribute );
