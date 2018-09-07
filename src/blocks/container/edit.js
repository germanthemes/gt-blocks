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

const {
	BlockAlignmentToolbar,
	BlockControls,
	ContrastChecker,
	InnerBlocks,
	MediaUpload,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	withFallbackStyles,
} = wp.components;

/* Set Fallback Styles */
const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor } = ownProps.attributes;
	const editableNode = node.querySelector( '[contenteditable="true"]' );
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
	};
} );

/**
 * Block Edit Component
 */
class gtContainerEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
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
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			setAttributes,
			instanceId,
			className,
		} = this.props;

		const {
			blockAlignment,
			contentWidth,
			backgroundImageId,
			backgroundImageUrl,
			imageOpacity,
			backgroundPosition,
			fixedBackground,
		} = attributes;

		const blockId = `gt-container-block-${ instanceId }`;

		const blockClasses = classnames( className, {
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
			backgroundPosition: backgroundPosition,
		};

		const overlayClasses = classnames( 'gt-background-overlay', {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const overlayStyles = {
			backgroundColor: backgroundColor.color ? backgroundColor.color : '#ffffff',
			opacity: ( 100 - imageOpacity ) / 100,
		};

		const contentStyles = `
			#${ blockId } .gt-inner-content .editor-block-list__block {
				max-width: ${ contentWidth }px;
			}
		`;

		const dataBackgroundImage = backgroundImageId ? backgroundImageUrl : undefined;

		return (
			<Fragment>

				<BlockControls>

					<BlockAlignmentToolbar
						value={ blockAlignment }
						onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
						controls={ [ 'wide', 'full' ] }
					/>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false }>

						<BlockAlignmentToolbar
							value={ blockAlignment }
							onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
							controls={ [ 'wide', 'full' ] }
						/>

						<RangeControl
							label={ __( 'Content Width (in px)' ) }
							value={ contentWidth }
							onChange={ ( maxWidth ) => setAttributes( { contentWidth: maxWidth } ) }
							min={ 100 }
							max={ 2500 }
						/>

					</PanelBody>

					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color' ),
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

					<PanelBody title={ __( 'Background Image' ) } initialOpen={ false } className="gt-blocks-container-background-image-panel">

						<div className="gt-background-image">

							{ ! backgroundImageId ? (

								<MediaUpload
									title={ __( 'Set background image' ) }
									onSelect={ this.onSelectImage }
									type="image"
									render={ ( { open } ) => (
										<Button onClick={ open } className="gt-set-image">
											{ __( 'Set background image' ) }
										</Button>
									) }
								/>

							) : (

								<Fragment>

									<MediaUpload
										title={ __( 'Set background image' ) }
										onSelect={ this.onSelectImage }
										type="image"
										value={ backgroundImageId }
										render={ ( { open } ) => (
											<Button onClick={ open } className="gt-image-button">
												<img
													src={ backgroundImageUrl }
													alt={ __( 'Background image' ) }
												/>
											</Button>
										) }
									/>

									<div className="gt-image-controls">

										<MediaUpload
											title={ __( 'Set background image' ) }
											onSelect={ this.onSelectImage }
											type="image"
											value={ backgroundImageId }
											render={ ( { open } ) => (
												<Button onClick={ open } isDefault isLarge className="gt-replace-image">
													{ __( 'Replace image' ) }
												</Button>
											) }
										/>

										<Button onClick={ this.onRemoveImage } isLink isDestructive>
											{ __( 'Remove image' ) }
										</Button>

									</div>

								</Fragment>

							) }

						</div>

						{ backgroundImageId && (

							<Fragment>

								<RangeControl
									label={ __( 'Image Opacity' ) }
									value={ imageOpacity }
									onChange={ ( newOpacity ) => setAttributes( { imageOpacity: newOpacity } ) }
									min={ 0 }
									max={ 100 }
								/>

								<SelectControl
									label={ __( 'Background Position' ) }
									value={ backgroundPosition }
									onChange={ ( newPosition ) => setAttributes( { backgroundPosition: newPosition } ) }
									options={ [
										{ value: 'left top', label: __( 'Left Top' ) },
										{ value: 'left center', label: __( 'Left Center' ) },
										{ value: 'left bottom', label: __( 'Left Bottom' ) },
										{ value: 'center top', label: __( 'Center Top' ) },
										{ value: 'center center', label: __( 'Center Center' ) },
										{ value: 'center bottom', label: __( 'Center Bottom' ) },
										{ value: 'right top', label: __( 'Right Top' ) },
										{ value: 'right center', label: __( 'Right Center' ) },
										{ value: 'right bottom', label: __( 'Right Bottom' ) },
									] }
								/>

								<ToggleControl
									label={ __( 'Fixed Background' ) }
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

					<style>{ contentStyles }</style>
					<div className="gt-inner-content">
						<InnerBlocks />
					</div>

				</div>

			</Fragment>
		);
	}
}

export default compose(
	withInstanceId,
	withColors( 'backgroundColor', { textColor: 'color' } ),
	applyFallbackStyles,
)( gtContainerEdit );
