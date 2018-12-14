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
		placeholder: __( 'Write Hero Heading...', 'gt-layout-blocks' ),
		customFontSize: 36,
	} ],
	[ 'core/paragraph', {
		placeholder: __( 'Write Hero text...', 'gt-layout-blocks' ),
	} ],
	[ 'gt-layout-blocks/buttons', {
		customClass: 'gt-buttons-wrapper',
		buttons: 2,
		buttonAttributes: {
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
		template: TEMPLATE,
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
			verticalAlign,
		} = attributes;

		const heroClasses = classnames( 'gt-hero-section', {
			[ `gt-hero-layout-${ heroLayout }` ]: heroLayout,
			[ `gt-hero-content-width-${ heroWidth }` ]: 50 !== heroWidth,
			[ `gt-hero-vertical-align-${ verticalAlign }` ]: 'none' !== verticalAlign,
			'gt-has-hero-image': heroImage,
		} );

		const contentSettings = <Fragment>
			<PanelBody title={ __( 'Hero Settings', 'gt-layout-blocks' ) } initialOpen={ false } className="gt-panel-hero-settings gt-panel">
				<BaseControl id="gt-image-block" label={ __( 'Image Block', 'gt-layout-blocks' ) }>
					<Button
						isLarge
						className="gt-image-block-button"
						onClick={ () => setAttributes( { heroImage: ! heroImage } ) }
					>
						<Dashicon icon={ heroImage ? 'trash' : 'insert' } />
						{ heroImage ? __( 'Remove Block', 'gt-layout-blocks' ) : __( 'Add Block', 'gt-layout-blocks' ) }
					</Button>
				</BaseControl>

				<SelectControl
					label={ __( 'Content Position', 'gt-layout-blocks' ) }
					value={ heroLayout }
					onChange={ ( newLayout ) => setAttributes( { heroLayout: newLayout } ) }
					options={ [
						{ value: 'center', label: __( 'Center', 'gt-layout-blocks' ) },
						{ value: 'left', label: __( 'Left', 'gt-layout-blocks' ) },
						{ value: 'right', label: __( 'Right', 'gt-layout-blocks' ) },
					] }
				/>

				{ 'center' !== heroLayout && (
					<RangeControl
						label={ __( 'Content Width', 'gt-layout-blocks' ) }
						value={ heroWidth }
						onChange={ ( newWidth ) => setAttributes( { heroWidth: newWidth } ) }
						min={ 20 }
						max={ 80 }
						step={ 10 }
					/>
				) }

				<SelectControl
					label={ __( 'Vertical Align', 'gt-layout-blocks' ) }
					value={ verticalAlign }
					onChange={ ( newAlign ) => setAttributes( { verticalAlign: newAlign } ) }
					options={ [
						{ value: 'none', label: __( 'None', 'gt-layout-blocks' ) },
						{ value: 'top', label: __( 'Top', 'gt-layout-blocks' ) },
						{ value: 'center', label: __( 'Center', 'gt-layout-blocks' ) },
						{ value: 'bottom', label: __( 'Bottom', 'gt-layout-blocks' ) },
					] }
				/>

			</PanelBody>
		</Fragment>;

		return (
			<Fragment>

				<BackgroundEdit
					contentSettings={ contentSettings }
					{ ...this.props }
				>

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
