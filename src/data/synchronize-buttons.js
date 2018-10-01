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
			type: 'string',
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

		if ( ! props.attributes.siblings || props.attributes.siblings.length < 1 ) {
			return <BlockEdit { ...props } />;
		}

		const synchronizeAttributes = () => {
			const {
				siblings,
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

			siblings.forEach( child => {
				dispatch( 'core/editor' ).updateBlockAttributes( child, newAttributes );
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
