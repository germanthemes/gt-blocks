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
	BlockControls,
	ContrastChecker,
	InspectorControls,
	PanelColorSettings,
	RichText,
	withColors,
	withFontSizes,
} = wp.editor;

const {
	BaseControl,
	FontSizePicker,
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

/**
 * Block Edit Component
 */
class gtButtonEdit extends Component {
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
			fontSizes,
			setAttributes,
			className,
		} = this.props;

		const {
			url,
			title,
			text,
			placeholder,
			paddingVertical,
			paddingHorizontal,
			fontStyle,
			uppercase,
		} = attributes;

		const blockStyles = {};

		const buttonClasses = classnames( 'gt-button', {
			'gt-is-bold': ( 'bold' === fontStyle || 'bold-italic' === fontStyle ),
			'gt-is-italic': ( 'italic' === fontStyle || 'bold-italic' === fontStyle ),
			'gt-is-uppercase': uppercase,
			'has-hover-text-color': hoverColor.color,
			[ hoverColor.class ]: hoverColor.class,
			'has-hover-background': hoverBackgroundColor.color,
			[ hoverBackgroundColor.class ]: hoverBackgroundColor.class,
			[ fontSize.class ]: fontSize.class,
		} );

		const buttonStyles = {
			color: hoverColor.color,
			backgroundColor: hoverBackgroundColor.class ? undefined : hoverBackgroundColor.color,
			fontSize: fontSize.size ? fontSize.size + 'px' : undefined,
		};

		const textClasses = classnames( 'gt-button-text', {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
		} );

		const textStyles = {
			paddingTop: paddingVertical !== 6 ? paddingVertical + 'px' : undefined,
			paddingBottom: paddingVertical !== 6 ? paddingVertical + 'px' : undefined,
			paddingLeft: paddingHorizontal !== 18 ? paddingHorizontal + 'px' : undefined,
			paddingRight: paddingHorizontal !== 18 ? paddingHorizontal + 'px' : undefined,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			color: textColor.class ? undefined : textColor.color,
		};

		return (
			<Fragment>
				<BlockControls>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Button Settings' ) } initialOpen={ false } className="gt-panel-button-settings gt-panel">

						<RangeControl
							label={ __( 'Vertical Padding' ) }
							value={ paddingVertical }
							onChange={ ( newPadding ) => setAttributes( { paddingVertical: newPadding } ) }
							min={ 0 }
							max={ 64 }
						/>

						<RangeControl
							label={ __( 'Horizontal Padding' ) }
							value={ paddingHorizontal }
							onChange={ ( newPadding ) => setAttributes( { paddingHorizontal: newPadding } ) }
							min={ 0 }
							max={ 64 }
						/>

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
							label={ __( 'Font Style' ) }
							value={ fontStyle }
							onChange={ ( newStyle ) => setAttributes( { fontStyle: newStyle } ) }
							options={ [
								{ value: 'none', label: __( 'None' ) },
								{ value: 'bold', label: __( 'Bold' ) },
								{ value: 'italic', label: __( 'Italic' ) },
								{ value: 'bold-italic', label: __( 'Bold & Italic' ) },
							] }
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

				</InspectorControls>

				<div className={ className } style={ blockStyles }>
					<a
						href={ url }
						title={ title }
						className={ buttonClasses }
						style={ buttonStyles }
					>
						<RichText
							tagName="span"
							className={ textClasses }
							style={ textStyles }
							onChange={ ( newText ) => setAttributes( { text: newText } ) }
							value={ text }
							placeholder={ placeholder || __( 'Write button…' ) }
							keepPlaceholderOnFocus
						/>
					</a>
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
