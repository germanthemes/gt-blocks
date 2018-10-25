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
	BaseControl,
	Button,
	Dashicon,
	PanelBody,
	RangeControl,
	SelectControl,
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
	const content = [ 'gt-layout-blocks/content', {
		allowedBlocks: [],
		template: TEMPLATE,
		templateLock: 'all',
	} ];

	const image = [ 'gt-layout-blocks/image', {} ];

	if ( heroImage ) {
		return [ content, image ];
	}

	return [ content ];
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
			heroWidth,
			heroImage,
		} = attributes;

		const heroClasses = classnames( 'gt-hero-section', {
			[ `gt-hero-layout-${ heroLayout }` ]: heroLayout,
			[ `gt-hero-content-width-${ heroWidth }` ]: 50 !== heroWidth,
		} );

		return (
			<Fragment>

				<InspectorControls>

					<PanelBody title={ __( 'Hero Banner Settings' ) } initialOpen={ false } className="gt-panel-hero-banner-settings gt-panel">

						<SelectControl
							label={ __( 'Hero Content Position' ) }
							value={ heroLayout }
							onChange={ ( newLayout ) => setAttributes( { heroLayout: newLayout } ) }
							options={ [
								{ value: 'full', label: __( 'Fullwidth' ) },
								{ value: 'center', label: __( 'Center' ) },
								{ value: 'left', label: __( 'Left' ) },
								{ value: 'right', label: __( 'Right' ) },
							] }
						/>

						{ 'full' !== heroWidth && (
							<RangeControl
								label={ __( 'Hero Content Width' ) }
								value={ heroWidth }
								onChange={ ( newWidth ) => setAttributes( { heroWidth: newWidth } ) }
								min={ 20 }
								max={ 80 }
								step={ 10 }
							/>
						) }

						<BaseControl id="gt-image-block" label={ __( 'Hero Image Block' ) }>
							<Button
								isLarge
								className="gt-image-block-button"
								onClick={ () => setAttributes( { heroImage: ! heroImage } ) }
							>
								<Dashicon icon={ heroImage ? 'trash' : 'insert' } />
								{ heroImage ? __( 'Remove Block' ) : __( 'Add Block' ) }
							</Button>
						</BaseControl>

					</PanelBody>

				</InspectorControls>

				<BackgroundEdit { ...this.props }>

					<div className={ heroClasses }>

						<InnerBlocks
							allowedBlocks={ [ 'gt-layout-blocks/image', 'gt-layout-blocks/content' ] }
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
