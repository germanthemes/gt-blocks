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

const {
	__,
} = wp.i18n;

const { compose, withInstanceId } = wp.compose;
const { withSelect } = wp.data;

const {
	BlockAlignmentToolbar,
	BlockControls,
	ContrastChecker,
	MediaUpload,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	BaseControl,
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	Toolbar,
	withFallbackStyles,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Block Edit Component
 */
class BackgroundEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
	}

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

	onSelectImage( img ) {
		this.props.setAttributes( {
			backgroundImageId: img.id,
			backgroundImageUrl: img.url,
		} );
	}

	onRemoveImage() {
		this.props.setAttributes( {
			backgroundImageId: undefined,
			backgroundImageUrl: undefined,
		} );
	}

	render() {
		const {
			attributes,
			children,
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			setAttributes,
			instanceId,
			className,
			wideControlsEnabled,
		} = this.props;

		const {
			blockAlignment,
			contentWidth,
			padding,
			backgroundImageId,
			backgroundImageUrl,
			imageOpacity,
			backgroundPosition,
			fixedBackground,
		} = attributes;

		const blockId = `gt-container-block-${ instanceId }`;

		const blockClasses = classnames( className, 'gt-background-section', {
			[ `gt-${ padding }-padding` ]: 'none' !== padding,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'gt-has-background-image': backgroundImageId,
			'gt-fixed-background': fixedBackground,
		} );

		const blockStyles = {
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			color: textColor.class ? undefined : textColor.color,
			backgroundImage: backgroundImageId ? `url(${ backgroundImageUrl })` : undefined,
			backgroundPosition: 'center center' !== backgroundPosition ? backgroundPosition : undefined,
		};

		const overlayClasses = classnames( 'gt-background-overlay', {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const overlayStyles = {
			backgroundColor: backgroundColor.color ? backgroundColor.color : '#ffffff',
			opacity: ( 100 - imageOpacity ) / 100,
		};

		const contentClasses = classnames( 'gt-section-content', {
			[ `gt-${ contentWidth }-width` ]: 'default' !== blockAlignment,
		} );

		const dataBackgroundImage = backgroundImageId ? backgroundImageUrl : undefined;

		const ALIGNMENT_CONTROLS = {
			default: {
				icon: 'align-center',
				title: __( 'Default width', 'gt-layout-blocks' ),
			},
			wide: {
				icon: 'align-wide',
				title: __( 'Wide width', 'gt-layout-blocks' ),
			},
			full: {
				icon: 'align-full-width',
				title: __( 'Full width', 'gt-layout-blocks' ),
			},
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

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Section Settings', 'gt-layout-blocks' ) } initialOpen={ false } className="gt-section-settings-panel gt-panel">

						{ wideControlsEnabled && (
							<BaseControl id="gt-block-alignment" label={ __( 'Block Alignment', 'gt-layout-blocks' ) }>
								<Toolbar
									controls={
										Object.keys( ALIGNMENT_CONTROLS ).map( ( control ) => ( {
											...ALIGNMENT_CONTROLS[ control ],
											isActive: blockAlignment === control,
											onClick: () => setAttributes( { blockAlignment: control } ),
										} ) )
									}
								/>
							</BaseControl>
						) }

						{ ( wideControlsEnabled && ( 'full' === blockAlignment || 'wide' === blockAlignment ) ) && (

							<SelectControl
								label={ __( 'Content Width', 'gt-layout-blocks' ) }
								value={ contentWidth }
								onChange={ ( newWidth ) => setAttributes( { contentWidth: newWidth } ) }
								options={ [
									{ value: 'narrow', label: __( 'Narrow width', 'gt-layout-blocks' ) },
									{ value: 'default', label: __( 'Default width', 'gt-layout-blocks' ) },
									{ value: 'wide', label: __( 'Wide width', 'gt-layout-blocks' ) },
									{ value: 'full', label: __( 'Full width', 'gt-layout-blocks' ) },
								] }
							/>

						) }

						<SelectControl
							label={ __( 'Padding', 'gt-layout-blocks' ) }
							value={ padding }
							onChange={ ( newPadding ) => setAttributes( { padding: newPadding } ) }
							options={ [
								{ value: 'none', label: __( 'None', 'gt-layout-blocks' ) },
								{ value: 'normal', label: __( 'Normal', 'gt-layout-blocks' ) },
								{ value: 'large', label: __( 'Large', 'gt-layout-blocks' ) },
							] }
						/>

					</PanelBody>

					<PanelColorSettings
						title={ __( 'Color Settings', 'gt-layout-blocks' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color', 'gt-layout-blocks' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'gt-layout-blocks' ),
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

					<PanelBody title={ __( 'Background Image', 'gt-layout-blocks' ) } initialOpen={ false } className="gt-background-image-panel gt-panel">

						<div className="gt-background-image">

							{ ! backgroundImageId ? (

								<MediaUpload
									title={ __( 'Set background image', 'gt-layout-blocks' ) }
									onSelect={ this.onSelectImage }
									type="image"
									render={ ( { open } ) => (
										<Button onClick={ open } className="gt-set-image">
											{ __( 'Set background image', 'gt-layout-blocks' ) }
										</Button>
									) }
								/>

							) : (

								<Fragment>

									<MediaUpload
										title={ __( 'Set background image', 'gt-layout-blocks' ) }
										onSelect={ this.onSelectImage }
										type="image"
										value={ backgroundImageId }
										render={ ( { open } ) => (
											<Button onClick={ open } className="gt-image-button">
												<img
													src={ backgroundImageUrl }
													alt={ __( 'Background image', 'gt-layout-blocks' ) }
												/>
											</Button>
										) }
									/>

									<div className="gt-image-controls">

										<MediaUpload
											title={ __( 'Set background image', 'gt-layout-blocks' ) }
											onSelect={ this.onSelectImage }
											type="image"
											value={ backgroundImageId }
											render={ ( { open } ) => (
												<Button onClick={ open } isDefault isLarge className="gt-replace-image">
													{ __( 'Replace image', 'gt-layout-blocks' ) }
												</Button>
											) }
										/>

										<Button onClick={ this.onRemoveImage } isLink isDestructive>
											{ __( 'Remove image', 'gt-layout-blocks' ) }
										</Button>

									</div>

								</Fragment>

							) }

						</div>

						{ backgroundImageId && (

							<Fragment>

								<RangeControl
									label={ __( 'Image Opacity', 'gt-layout-blocks' ) }
									value={ imageOpacity }
									onChange={ ( newOpacity ) => setAttributes( { imageOpacity: newOpacity } ) }
									min={ 0 }
									max={ 100 }
								/>

								<SelectControl
									label={ __( 'Background Position', 'gt-layout-blocks' ) }
									value={ backgroundPosition }
									onChange={ ( newPosition ) => setAttributes( { backgroundPosition: newPosition } ) }
									options={ [
										{ value: 'left top', label: __( 'Left Top', 'gt-layout-blocks' ) },
										{ value: 'left center', label: __( 'Left Center', 'gt-layout-blocks' ) },
										{ value: 'left bottom', label: __( 'Left Bottom', 'gt-layout-blocks' ) },
										{ value: 'center top', label: __( 'Center Top', 'gt-layout-blocks' ) },
										{ value: 'center center', label: __( 'Center Center', 'gt-layout-blocks' ) },
										{ value: 'center bottom', label: __( 'Center Bottom', 'gt-layout-blocks' ) },
										{ value: 'right top', label: __( 'Right Top', 'gt-layout-blocks' ) },
										{ value: 'right center', label: __( 'Right Center', 'gt-layout-blocks' ) },
										{ value: 'right bottom', label: __( 'Right Bottom', 'gt-layout-blocks' ) },
									] }
								/>

								<ToggleControl
									label={ __( 'Fixed Background', 'gt-layout-blocks' ) }
									checked={ !! fixedBackground }
									onChange={ () => setAttributes( { fixedBackground: ! fixedBackground } ) }
								/>

							</Fragment>

						) }

					</PanelBody>

				</InspectorControls>

				<div id={ blockId } className={ blockClasses } style={ blockStyles } data-background-image={ dataBackgroundImage }>

					{ backgroundImageId && (
						<div className={ overlayClasses } style={ overlayStyles }></div>
					) }

					<div className={ contentClasses }>

						{ children }

					</div>

				</div>

			</Fragment>
		);
	}
}

export default compose(
	withInstanceId,
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
)( BackgroundEdit );
