/**
 * External dependencies
 */
import classnames from 'classnames';
import memoize from 'memize';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	PanelBody,
	SelectControl,
	ToggleControl,
} = wp.components;

/**
 * Internal dependencies
 */
import { default as BackgroundEdit } from '../../components/background-section/edit';

// Define blocks for hero content.
const TEMPLATE = [
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
			parentBlock: 'gt-layout-blocks/buttons',
		},
	} ],
];

/**
 * Returns the layouts configuration for a given number of items.
 *
 * @param {number} number Number of items.
 *
 * @return {Object[]} Items layout configuration.
 */
const getTemplate = memoize( ( heroImage ) => {
	const column = [ 'gt-layout-blocks/column', {
		allowedBlocks: [],
		template: TEMPLATE,
		templateLock: 'all',
	} ];

	const image = [ 'gt-layout-blocks/image', {} ];

	if ( heroImage ) {
		return [ column, image ];
	}

	return [ column ];
} );

/**
 * Block Edit Component
 */
class HeroImageEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
		} = this.props;

		const {
			heroLayout,
			heroImage,
		} = attributes;

		const heroClasses = classnames( 'gt-hero-section', {
			[ `gt-hero-layout-${ heroLayout }` ]: heroLayout,
		} );

		return (
			<Fragment>

				<InspectorControls>

					<PanelBody title={ __( 'Hero Banner Settings' ) } initialOpen={ false } className="gt-panel-hero-banner-settings gt-panel">

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

						<ToggleControl
							label={ __( 'Show Image?' ) }
							checked={ !! heroImage }
							onChange={ () => setAttributes( { heroImage: ! heroImage } ) }
						/>

					</PanelBody>

				</InspectorControls>

				<BackgroundEdit { ...this.props }>

					<div className={ heroClasses }>

						<InnerBlocks
							allowedBlocks={ [ 'gt-layout-blocks/image', 'gt-layout-blocks/column' ] }
							template={ getTemplate( heroImage ) }
							templateLock="all"
						/>

					</div>

				</BackgroundEdit>

			</Fragment>
		);
	}
}

export default HeroImageEdit;
