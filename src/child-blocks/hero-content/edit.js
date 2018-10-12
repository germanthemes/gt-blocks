/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const { __ } = wp.i18n;

const {
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	PanelBody,
	SelectControl,
} = wp.components;

/**
 * Block Edit Component
 */
class HeroContentEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
		} = this.props;

		const {
			heroLayout,
		} = attributes;

		const blockClasses = classnames( 'gt-hero-section', {
			[ `gt-hero-layout-${ heroLayout }` ]: heroLayout,
		} );

		return (
			<Fragment>

				<InspectorControls>

					<PanelBody title={ __( 'Hero Content Settings' ) } initialOpen={ false } className="gt-panel-hero-content-settings gt-panel">

						<SelectControl
							label={ __( 'Hero Layout' ) }
							value={ heroLayout }
							onChange={ ( newLayout ) => setAttributes( { heroLayout: newLayout } ) }
							options={ [
								{ value: 'full', label: __( 'Fullwidth' ) },
								{ value: 'center', label: __( 'Center' ) },
								{ value: 'left', label: __( 'Left' ) },
								{ value: 'right', label: __( 'Right' ) },
							] }
						/>

					</PanelBody>

				</InspectorControls>

				<div className={ blockClasses }>

					<div className="gt-hero-content">

						<InnerBlocks
							allowedBlocks={ [ 'gt-layout-blocks/heading', 'core/paragraph' ] }
							template={ [
								[ 'gt-layout-blocks/heading', {
									placeholder: __( 'Write Hero Heading...' ),
									customFontSize: 48,
								} ],
								[ 'core/paragraph', {
									placeholder: __( 'Write Hero text...' ),
									customFontSize: 20,
								} ],
								[ 'gt-layout-blocks/buttons', {
									customClass: 'gt-buttons-wrapper',
									buttons: 2,
									buttonAttributes: {
										buttonSize: 'medium',
										customFontSize: 20,
										synchronizeStyling: true,
										parentBlock: 'gt-layout-blocks/hero-content',
									},
								} ],
							] }
							templateLock="all"
						/>

					</div>

				</div>

			</Fragment>
		);
	}
}

export default HeroContentEdit;
