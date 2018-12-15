/**
 * External dependencies
 */
import classnames from 'classnames';
const { assign } = window.lodash;

/**
 * WordPress dependencies
 */
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorAdvancedControls } = wp.editor;
const { ToggleControl } = wp.components;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { hasBlockSupport } = wp.blocks;

/**
 * Internal dependencies
 */
import './style.scss';

const withInspectorControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const hasCustomClassName = hasBlockSupport( props.name, 'customClassName', true );

		if ( hasCustomClassName && props.isSelected ) {
			const { gtRemoveMarginBottom } = props.attributes;

			return (
				<Fragment>
					<BlockEdit { ...props } />

					<InspectorAdvancedControls>

						<ToggleControl
							label={ __( 'Remove bottom margin?', 'gt-blocks' ) }
							checked={ !! gtRemoveMarginBottom }
							onChange={ () => props.setAttributes( { gtRemoveMarginBottom: ! gtRemoveMarginBottom } ) }
						/>

					</InspectorAdvancedControls>
				</Fragment>
			);
		}

		return <BlockEdit { ...props } />;
	};
}, 'withInspectorControl' );
addFilter( 'editor.BlockEdit', 'gt-blocks/plugins/margin-bottom', withInspectorControl );

function addAttribute( settings ) {
	if ( hasBlockSupport( settings, 'customClassName', true ) ) {
		settings.attributes = assign( settings.attributes, {
			gtRemoveMarginBottom: {
				type: 'boolean',
				default: false,
			},
		} );
	}

	return settings;
}
addFilter( 'blocks.registerBlockType', 'gt-blocks/attributes/margin-bottom', addAttribute );

function addSaveProps( extraProps, blockType, attributes ) {
	if ( hasBlockSupport( blockType, 'customClassName', true ) && attributes.gtRemoveMarginBottom ) {
		extraProps.className = classnames( extraProps.className, 'gt-remove-margin-bottom' );
	}

	return extraProps;
}
addFilter( 'blocks.getSaveContent.extraProps', 'gt-blocks/save-props/margin-bottom', addSaveProps );
