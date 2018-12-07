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

const { compose } = wp.compose;

const {
	AlignmentToolbar,
	BlockControls,
	ContrastChecker,
	FontSizePicker,
	InspectorControls,
	PanelColorSettings,
	RichText,
	URLInput,
	withColors,
	withFontSizes,
} = wp.editor;

const {
	Dashicon,
	IconButton,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	withFallbackStyles,
} = wp.components;

/**
 * Block Edit Component
 */
class ButtonEdit extends Component {
	constructor() {
		super( ...arguments );
		this.setHoverTextColor = this.setHoverTextColor.bind( this );
	}

	setHoverTextColor( color ) {
		const {
			setHoverColor,
			setAttributes,
		} = this.props;

		setHoverColor( color );
		setAttributes( { hoverTextColor: color } );
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
			hoverColor,
			hoverBackgroundColor,
			setHoverBackgroundColor,
			fontSize,
			setFontSize,
			fallbackFontSize,
			setAttributes,
			className,
			isSelected,
		} = this.props;

		const {
			url,
			title,
			text,
			placeholder,
			textAlignment,
			buttonSize,
			buttonShape,
			roundedCorners,
			borderWidth,
			fontWeight,
			italic,
			uppercase,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `gt-align-${ textAlignment }` ]: textAlignment,
		} );

		const hoverClasses = classnames( 'gt-button-wrap', {
			[ `gt-button-${ buttonShape }` ]: 'square' !== buttonShape,
			'has-hover-text-color': hoverColor.color,
			[ hoverColor.class ]: hoverColor.class,
			'has-hover-background': hoverBackgroundColor.color,
			[ hoverBackgroundColor.class ]: hoverBackgroundColor.class,
		} );

		const hoverStyles = {
			borderRadius: 'rounded' === buttonShape && 12 !== roundedCorners ? roundedCorners + 'px' : undefined,
			color: hoverColor.class ? undefined : hoverColor.color,
			backgroundColor: hoverBackgroundColor.class ? undefined : hoverBackgroundColor.color,
		};

		const buttonClasses = classnames( 'gt-button', {
			[ `gt-button-${ buttonSize }` ]: buttonSize,
			'gt-ghost-button': 'outline' === buttonShape,
			'gt-is-bold': 'bold' === fontWeight,
			'gt-is-thin': 'thin' === fontWeight,
			'gt-is-italic': italic,
			'gt-is-uppercase': uppercase,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			[ fontSize.class ]: fontSize.class,
		} );

		const buttonStyles = {
			borderRadius: ( 'rounded' === buttonShape || 'outline' === buttonShape ) && 12 !== roundedCorners ? roundedCorners + 'px' : undefined,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			color: textColor.class ? undefined : textColor.color,
			fontSize: fontSize.size ? fontSize.size + 'px' : undefined,
			borderWidth: 'outline' === buttonShape && borderWidth !== 2 ? borderWidth + 'px' : undefined,
		};

		const backgroundColorSettings = 'outline' !== buttonShape ? [ {
			value: backgroundColor.color,
			onChange: setBackgroundColor,
			label: __( 'Background Color' ),
		} ] : [];

		const hoverBackgroundColorSettings = 'outline' !== buttonShape ? [ {
			value: hoverBackgroundColor.color,
			onChange: setHoverBackgroundColor,
			label: __( 'Background Color' ),
		} ] : [];

		return (
			<Fragment>
				<BlockControls>

					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
					/>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Button Settings' ) } initialOpen={ false } className="gt-panel-button-settings gt-panel">

						<SelectControl
							label={ __( 'Button Size' ) }
							value={ buttonSize }
							onChange={ ( newSize ) => setAttributes( { buttonSize: newSize } ) }
							options={ [
								{ value: 'small', label: __( 'Small' ) },
								{ value: 'medium', label: __( 'Medium' ) },
								{ value: 'large', label: __( 'Large' ) },
								{ value: 'extra-large', label: __( 'Extra Large' ) },
							] }
						/>

						<SelectControl
							label={ __( 'Button Style' ) }
							value={ buttonShape }
							onChange={ ( newShape ) => setAttributes( { buttonShape: newShape } ) }
							options={ [
								{ value: 'squared', label: __( 'Squared' ) },
								{ value: 'rounded', label: __( 'Rounded' ) },
								{ value: 'circle', label: __( 'Circle' ) },
								{ value: 'outline', label: __( 'Outline' ) },
							] }
						/>

						{ ( 'rounded' === buttonShape || 'outline' === buttonShape ) && (
							<RangeControl
								label={ __( 'Rounded Corners' ) }
								value={ roundedCorners }
								onChange={ ( newRadius ) => setAttributes( { roundedCorners: newRadius } ) }
								min={ 0 }
								max={ 64 }
							/>
						) }

						{ 'outline' === buttonShape && (
							<RangeControl
								label={ __( 'Border Width' ) }
								value={ borderWidth }
								onChange={ ( newWidth ) => setAttributes( { borderWidth: newWidth } ) }
								min={ 1 }
								max={ 12 }
							/>
						) }

					</PanelBody>

					<PanelBody title={ __( 'Font Settings' ) } initialOpen={ false } className="gt-panel-font-settings gt-panel">

						<FontSizePicker
							fallbackFontSize={ fallbackFontSize }
							value={ fontSize.size }
							onChange={ setFontSize }
						/>

						<SelectControl
							label={ __( 'Font Weight' ) }
							value={ fontWeight }
							onChange={ ( newWeight ) => setAttributes( { fontWeight: newWeight } ) }
							options={ [
								{ value: 'thin', label: __( 'Thin' ) },
								{ value: 'normal', label: __( 'Normal' ) },
								{ value: 'bold', label: __( 'Bold' ) },
							] }
						/>

						<ToggleControl
							label={ __( 'Italic?' ) }
							checked={ !! italic }
							onChange={ () => setAttributes( { italic: ! italic } ) }
						/>

						<ToggleControl
							label={ __( 'Uppercase?' ) }
							checked={ !! uppercase }
							onChange={ () => setAttributes( { uppercase: ! uppercase } ) }
						/>

					</PanelBody>

					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={
							backgroundColorSettings.concat( [ {
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color' ),
							} ] )
						}
					>

						{ 'outline' === buttonShape && (
							<p className="components-base-control__help">
								{ __( 'Background colors are disabled because outline style is enabled.' ) }
							</p>
						) }

						{ ! 'outline' === buttonShape && (
							<ContrastChecker
								{ ...{
									textColor: textColor.color,
									backgroundColor: backgroundColor.color,
									fallbackTextColor,
									fallbackBackgroundColor,
								} }
								fontSize={ fontSize.size }
							/>
						) }
					</PanelColorSettings>

					<PanelColorSettings
						title={ __( 'Hover Colors' ) }
						initialOpen={ false }
						colorSettings={
							hoverBackgroundColorSettings.concat( [ {
								value: hoverColor.color,
								onChange: this.setHoverTextColor,
								label: __( 'Text Color' ),
							} ] )
						}
					>

						{ 'outline' === buttonShape && (
							<p className="components-base-control__help">
								{ __( 'Background colors are disabled because outline style is enabled.' ) }
							</p>
						) }

						{ ! 'outline' === buttonShape && (
							<ContrastChecker
								{ ...{
									textColor: hoverColor.color,
									backgroundColor: hoverBackgroundColor.color,
									fallbackTextColor,
									fallbackBackgroundColor,
								} }
								fontSize={ fontSize.size }
							/>
						) }
					</PanelColorSettings>

				</InspectorControls>

				<div className={ blockClasses }>

					<span className={ hoverClasses } style={ hoverStyles } title={ title }>
						<RichText
							className={ buttonClasses }
							style={ buttonStyles }
							onChange={ ( newText ) => setAttributes( { text: newText } ) }
							formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
							value={ text }
							placeholder={ placeholder || __( 'Add text…' ) }
							keepPlaceholderOnFocus
						/>
					</span>

					{ isSelected && (
						<form
							className="block-library-button__inline-link"
							onSubmit={ ( event ) => event.preventDefault() }>
							<Dashicon icon="admin-links" />
							<URLInput
								value={ url }
								onChange={ ( newURL ) => setAttributes( { url: newURL } ) }
								autoFocus={ false }
							/>
							<IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
						</form>
					) }

				</div>

			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' }, { hoverColor: 'color' }, { hoverBackgroundColor: 'background-color' } ),
	withFontSizes( 'fontSize' ),
	withFallbackStyles( ( node, ownProps ) => {
		const { textColor, backgroundColor, fontSize, customFontSize } = ownProps.attributes;
		const editableNode = node.querySelector( '[contenteditable="true"]' );
		//verify if editableNode is available, before using getComputedStyle.
		const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
		return {
			fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
			fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
			fallbackFontSize: fontSize || customFontSize || ! computedStyles ? undefined : parseInt( computedStyles.fontSize ) || undefined,
		};
	} ),
] )( ButtonEdit );
