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

function addParentBlockAttribute( settings, name ) {
	if ( name !== 'gt-layout-blocks/button' ) {
		return settings;
	}

	settings.attributes = assign( settings.attributes, {
		parentBlock: {
			type: 'boolean',
		},
	} );

	return settings;
}
addFilter( 'blocks.registerBlockType', 'gt-layout-blocks/button/parent', addParentBlockAttribute );

const synchronizeButtons = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( props.name !== 'gt-layout-blocks/button' ) {
			return <BlockEdit { ...props } />;
		}

		const getSiblings = ( blockId, blockType ) => {
			let siblings = [];

			// Get all blocks.
			const blocks = select( 'core/editor' ).getBlocks();

			// Get Columns blocks.
			const columnsBlocks = blocks.filter( block => block.name === 'core/columns' );

			// Loop through columns blocks.
			columnsBlocks.some( ( block ) => {
				// Get SingleColumn block.
				const singleColumn = block.innerBlocks;

				// Get children.
				const children = singleColumn.map( item => item.innerBlocks );

				// Reduce to one array.
				const reduce = children.reduce( ( a, b ) => a.concat( b ), [] );

				// Filter out all sibling blocks.
				const siblingBlocks = reduce.filter( c => c.name === blockType );

				// Reduce to clientIds.
				const siblingIds = siblingBlocks.map( d => d.clientId );

				// Return siblings for our blockID.
				if ( siblingIds.includes( blockId ) ) {
					siblings = siblingIds;
					return true;
				}
			} );

			return siblings;
		};

		const synchronizeAttributes = () => {
			const siblings = getSiblings( props.clientId, props.name );

			// Synchronize Button blocks.
			synchronizeButtonBlocks( siblings );
		};

		const synchronizeButtonBlocks = ( siblings ) => {
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
			} = props.attributes;

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

			siblings.forEach( block => {
				dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
			} );
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
							{ __( 'Synchronize Buttons' ) }
						</Button>
					</PanelBody>
				</InspectorControls>
				<BlockEdit { ...props } />
			</Fragment>
		);
	};
}, 'synchronizeButtons' );

addFilter( 'editor.BlockEdit', 'gt-layout-blocks/synchronize/buttons', synchronizeButtons );
