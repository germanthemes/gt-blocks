/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls, InspectorAdvancedControls } = wp.editor;
const { PanelBody } = wp.components;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

const advancedPanel = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<InspectorAdvancedControls.Slot>
						{ ( fills ) => ! isEmpty( fills ) && (
							<PanelBody
								className="editor-block-inspector__advanced"
								title={ __( 'Advanced' ) }
								initialOpen={ false }
							>
								{ fills }
							</PanelBody>
						) }
					</InspectorAdvancedControls.Slot>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'advancedPanel' );
addFilter( 'editor.BlockEdit', 'gt-layout-blocks/advanced-panel', advancedPanel );

