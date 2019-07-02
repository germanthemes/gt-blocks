/**
 * External dependencies
 */
import classnames from 'classnames';
const { getComputedStyle } = window;

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const { __ } = wp.i18n;
const { compose } = wp.compose;
const { withSelect } = wp.data;

const {
	BlockAlignmentToolbar,
	BlockControls,
	ContrastChecker,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	BaseControl,
	PanelBody,
	SelectControl,
	ToggleControl,
	Toolbar,
	withFallbackStyles,
} = wp.components;

/**
 * Internal dependencies
 */
import ImageBlockEdit from '../../components/image-block/edit';
import {
	gtIconVerticalAlignTop,
	gtIconVerticalAlignCenter,
	gtIconVerticalAlignBottom,
} from '../../components/icons';

// Define vertical alignment controls.
const verticalAlignmentControls = {
	top: {
		icon: gtIconVerticalAlignTop,
		title: __( 'Top', 'gt-blocks' ),
	},
	center: {
		icon: gtIconVerticalAlignCenter,
		title: __( 'Center', 'gt-blocks' ),
	},
	bottom: {
		icon: gtIconVerticalAlignBottom,
		title: __( 'Bottom', 'gt-blocks' ),
	},
};

// Define block template.
const TEMPLATE = [
	[ 'gt-blocks/content', {
		template: [
			[ 'core/paragraph' ],
		],
	} ],
];

/**
 * Block Edit Component
 */
class ImageCardEdit extends Component {
	componentDidUpdate() {
		const {
			attributes,
			setAttributes,
			wideControlsEnabled,
		} = this.props;

		// Set block alignment to default if theme does not support wide and full width blocks.
		if ( ! wideControlsEnabled && 'default' !== attributes.blockAlignment ) {
			setAttributes( { blockAlignment: 'default' } );
		}
	}

	render() {
		const {
			attributes,
			setAttributes,
			className,
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			wideControlsEnabled,
		} = this.props;

		const {
			blockAlignment,
			imagePosition,
			contentWidth,
			verticalAlignment,
			columnGap,
			overlayCard,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `gt-image-position-${ imagePosition }` ]: 'left' !== imagePosition,
			[ `gt-content-width-${ contentWidth }` ]: '50' !== contentWidth,
			[ `gt-vertical-align-${ verticalAlignment }` ]: 'top' !== verticalAlignment,
			[ `gt-${ columnGap }-column-gap` ]: 'normal' !== columnGap,
			'gt-overlay-card': overlayCard,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const blockStyles = {
			color: textColor.class ? undefined : textColor.color,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
		};

		return (
			<Fragment>

				<BlockControls>

					{ wideControlsEnabled && (
						<BlockAlignmentToolbar
							value={ blockAlignment }
							onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign ? newAlign : 'default' } ) }
							controls={ [ 'wide', 'full' ] }
						/>
					) }

					<Toolbar
						className="gt-image-position-control"
						controls={ [ {
							icon: 'align-pull-left',
							title: __( 'Show image on left', 'gt-blocks' ),
							isActive: imagePosition === 'left',
							onClick: () => setAttributes( { imagePosition: 'left' } ),
						}, {
							icon: 'align-pull-right',
							title: __( 'Show image on right', 'gt-blocks' ),
							isActive: imagePosition === 'right',
							onClick: () => setAttributes( { imagePosition: 'right' } ),
						} ] }
					/>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Layout Settings', 'gt-blocks' ) } initialOpen={ true } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Content Width', 'gt-blocks' ) }
							value={ contentWidth }
							onChange={ ( newWidth ) => setAttributes( { contentWidth: newWidth } ) }
							options={ [
								{ value: '30', label: __( '30%', 'gt-blocks' ) },
								{ value: '40', label: __( '40%', 'gt-blocks' ) },
								{ value: '50', label: __( '50%', 'gt-blocks' ) },
								{ value: '60', label: __( '60%', 'gt-blocks' ) },
								{ value: '70', label: __( '70%', 'gt-blocks' ) },
							] }
						/>

						<BaseControl id="gt-vertical-alignment" label={ __( 'Vertical Alignment', 'gt-blocks' ) }>
							<Toolbar
								className="gt-vertical-align-control"
								controls={
									[ 'top', 'center', 'bottom' ].map( control => {
										return {
											...verticalAlignmentControls[ control ],
											isActive: verticalAlignment === control,
											onClick: () => setAttributes( { verticalAlignment: control } ),
										};
									} )
								}
							/>
						</BaseControl>

						<SelectControl
							label={ __( 'Column Gap', 'gt-blocks' ) }
							value={ columnGap }
							onChange={ ( value ) => setAttributes( { columnGap: value } ) }
							options={ [
								{ value: 'none', label: __( 'None', 'gt-blocks' ) },
								{ value: 'small', label: __( 'Small', 'gt-blocks' ) },
								{ value: 'normal', label: __( 'Normal', 'gt-blocks' ) },
								{ value: 'medium', label: __( 'Medium', 'gt-blocks' ) },
								{ value: 'large', label: __( 'Large', 'gt-blocks' ) },
								{ value: 'extra-large', label: __( 'Extra Large', 'gt-blocks' ) },
							] }
						/>

						<ToggleControl
							label={ __( 'Overlap content card?', 'gt-blocks' ) }
							checked={ !! overlayCard }
							onChange={ () => setAttributes( { overlayCard: ! overlayCard } ) }
						/>

					</PanelBody>

				</InspectorControls>

				<div className={ blockClasses } style={ blockStyles }>

					<div className="gt-image-card-columns">

						<div className="gt-image-column">

							<ImageBlockEdit
								customClasses="gt-image"
								isPanelOpen={ false }
								{ ...this.props }
							/>

						</div>

						<div className="gt-text-column">

							<InnerBlocks
								allowedBlocks={ [ 'gt-blocks/content' ] }
								template={ TEMPLATE }
								templateLock="all"
							/>

						</div>

					</div>

				</div>

				<InspectorControls>

					<PanelColorSettings
						title={ __( 'Color Settings', 'gt-blocks' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color', 'gt-blocks' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'gt-blocks' ),
							},
						] }
					>
						<ContrastChecker
							{ ...{
								textColor: textColor.color,
								backgroundColor: backgroundColor.color,
								fallbackTextColor,
								fallbackBackgroundColor,
							} }
						/>
					</PanelColorSettings>

				</InspectorControls>

			</Fragment>
		);
	}
}

export default compose( [
	withSelect(
		( select ) => ( {
			wideControlsEnabled: select( 'core/editor' ).getEditorSettings().alignWide,
		} )
	),
	withColors( 'backgroundColor', { textColor: 'color' } ),
	withFallbackStyles( ( node, ownProps ) => {
		const { textColor, backgroundColor } = ownProps.attributes;
		const editableNode = node.querySelector( '[contenteditable="true"]' );
		//verify if editableNode is available, before using getComputedStyle.
		const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
		return {
			fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
			fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		};
	} ),
] )( ImageCardEdit );
