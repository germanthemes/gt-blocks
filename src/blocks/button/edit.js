/**
 * External dependencies
 */
import classnames from 'classnames';
import { forEach, map } from 'lodash';
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
	InspectorControls,
	PanelColorSettings,
	RichText,
	URLInput,
	withColors,
	withFontSizes,
} = wp.editor;

const {
	BaseControl,
	Button,
	ButtonGroup,
	Dashicon,
	FontSizePicker,
	IconButton,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	withFallbackStyles,
} = wp.components;

const {
	withSelect,
} = wp.data;

/* Set Fallback Styles */
const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor, fontSize, customFontSize } = ownProps.attributes;
	const editableNode = node.querySelector( '[contenteditable="true"]' );
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		fallbackFontSize: fontSize || customFontSize || ! computedStyles ? undefined : parseInt( computedStyles.fontSize ) || undefined,
	};
} );

/* Define Button Sizes */
const buttonSizes = {
	small: {
		name: 'S',
		paddingVertical: 8,
		paddingHorizontal: 14,
	},
	medium: {
		name: 'M',
		paddingVertical: 16,
		paddingHorizontal: 28,
	},
	large: {
		name: 'L',
		paddingVertical: 24,
		paddingHorizontal: 42,
	},
};

/**
 * Block Edit Component
 */
class gtButtonEdit extends Component {
	constructor() {
		super( ...arguments );

		this.setButtonSize = this.setButtonSize.bind( this );
		this.setVerticalPadding = this.setVerticalPadding.bind( this );
		this.setHorizontalPadding = this.setHorizontalPadding.bind( this );
		this.setHoverTextColor = this.setHoverTextColor.bind( this );
	}

	setButtonSize( size ) {
		const paddingV = buttonSizes[ size ] && buttonSizes[ size ].paddingVertical ? buttonSizes[ size ].paddingVertical : 6;
		const paddingH = buttonSizes[ size ] && buttonSizes[ size ].paddingHorizontal ? buttonSizes[ size ].paddingHorizontal : 18;

		this.props.setAttributes( {
			buttonSize: size,
			paddingVertical: paddingV,
			paddingHorizontal: paddingH,
		} );
	}

	setVerticalPadding( padding ) {
		this.props.setAttributes( { paddingVertical: padding } );
		this.updateButtonSize( padding, this.props.attributes.paddingHorizontal );
	}

	setHorizontalPadding( padding ) {
		this.props.setAttributes( { paddingHorizontal: padding } );
		this.updateButtonSize( this.props.attributes.paddingVertical, padding );
	}

	updateButtonSize( vertical, horizontal ) {
		forEach( buttonSizes, ( { paddingVertical, paddingHorizontal }, size ) => {
			if ( paddingVertical === vertical && paddingHorizontal === horizontal ) {
				this.props.setAttributes( { buttonSize: size } );
				return false;
			}
			this.props.setAttributes( { buttonSize: undefined } );
		} );
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
			fontSizes,
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
			paddingVertical,
			paddingHorizontal,
			buttonShape,
			roundedCorners,
			fontWeight,
			italic,
			uppercase,
			border,
			borderWidth,
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
			'gt-is-bold': 'bold' === fontWeight,
			'gt-is-thin': 'thin' === fontWeight,
			'gt-is-italic': italic,
			'gt-is-uppercase': uppercase,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			[ fontSize.class ]: fontSize.class,
			'has-border': 'none' !== border,
			[ `gt-border-${ border }` ]: 'none' !== border,
		} );

		const buttonStyles = {
			paddingTop: ! buttonSize && paddingVertical !== 6 ? paddingVertical + 'px' : undefined,
			paddingBottom: ! buttonSize && paddingVertical !== 6 ? paddingVertical + 'px' : undefined,
			paddingLeft: ! buttonSize && paddingHorizontal !== 18 ? paddingHorizontal + 'px' : undefined,
			paddingRight: ! buttonSize && paddingHorizontal !== 18 ? paddingHorizontal + 'px' : undefined,
			borderRadius: 'rounded' === buttonShape && 12 !== roundedCorners ? roundedCorners + 'px' : undefined,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			color: textColor.class ? undefined : textColor.color,
			fontSize: fontSize.size ? fontSize.size + 'px' : undefined,
			borderWidth: borderWidth !== 2 ? borderWidth + 'px' : undefined,
		};

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

						<BaseControl id="gt-button-size" label={ __( 'Button Size' ) }>

							<div className="gt-button-size-picker">

								<ButtonGroup aria-label={ __( 'Button Size' ) }>
									{ map( buttonSizes, ( { name }, size ) => (
										<Button
											key={ size }
											isLarge
											isPrimary={ buttonSize === size }
											aria-pressed={ buttonSize === size }
											onClick={ () => this.setButtonSize( size ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>

								<Button
									isLarge
									onClick={ () => this.setButtonSize( undefined ) }
								>
									{ __( 'Reset' ) }
								</Button>

							</div>

						</BaseControl>

						<RangeControl
							label={ __( 'Vertical Padding' ) }
							value={ paddingVertical }
							onChange={ this.setVerticalPadding }
							min={ 0 }
							max={ 64 }
						/>

						<RangeControl
							label={ __( 'Horizontal Padding' ) }
							value={ paddingHorizontal }
							onChange={ this.setHorizontalPadding }
							min={ 0 }
							max={ 64 }
						/>

						<SelectControl
							label={ __( 'Button Shape' ) }
							value={ buttonShape }
							onChange={ ( newShape ) => setAttributes( { buttonShape: newShape } ) }
							options={ [
								{ value: 'square', label: __( 'Square' ) },
								{ value: 'rounded', label: __( 'Rounded Corners' ) },
								{ value: 'circle', label: __( 'Circle' ) },
							] }
						/>

						{ buttonShape === 'rounded' && (
							<RangeControl
								label={ __( 'Rounded Corners' ) }
								value={ roundedCorners }
								onChange={ ( newRadius ) => setAttributes( { roundedCorners: newRadius } ) }
								min={ 0 }
								max={ 64 }
							/>
						) }

					</PanelBody>

					<PanelBody title={ __( 'Font Settings' ) } initialOpen={ false } className="gt-panel-font-settings gt-panel">

						<BaseControl id="gt-font-size" label={ __( 'Font Size' ) }>
							<FontSizePicker
								fontSizes={ fontSizes }
								fallbackFontSize={ fallbackFontSize }
								value={ fontSize.size }
								onChange={ setFontSize }
							/>
						</BaseControl>

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
							fontSize={ fontSize.size }
						/>
					</PanelColorSettings>

					<PanelColorSettings
						title={ __( 'Hover Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: hoverBackgroundColor.color,
								onChange: setHoverBackgroundColor,
								label: __( 'Background Color' ),
							},
							{
								value: hoverColor.color,
								onChange: this.setHoverTextColor,
								label: __( 'Text Color' ),
							},
						] }
					>
					</PanelColorSettings>

					<PanelBody title={ __( 'Border Settings' ) } initialOpen={ false } className="gt-panel-border-settings gt-panel">

						<SelectControl
							label={ __( 'Border' ) }
							value={ border }
							onChange={ ( newBorderStyle ) => setAttributes( { border: newBorderStyle } ) }
							options={ [
								{ value: 'none', label: __( 'None' ) },
								{ value: 'top', label: __( 'Top' ) },
								{ value: 'bottom', label: __( 'Bottom' ) },
								{ value: 'horizontal', label: __( 'Horizontal' ) },
								{ value: 'vertical', label: __( 'Vertical' ) },
								{ value: 'full', label: __( 'All sides' ) },
							] }
						/>

						{ 'none' !== border && (
							<RangeControl
								label={ __( 'Border Width' ) }
								value={ borderWidth }
								onChange={ ( newWidth ) => setAttributes( { borderWidth: newWidth } ) }
								min={ 1 }
								max={ 12 }
							/>
						) }

					</PanelBody>

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
	applyFallbackStyles,
	withSelect( ( select ) => {
		const { fontSizes } = select( 'core/editor' ).getEditorSettings();

		return {
			fontSizes,
		};
	} ),
] )( gtButtonEdit );
