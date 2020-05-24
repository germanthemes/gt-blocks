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
	InspectorControls,
	PanelColorSettings,
	RichText,
	URLInput,
	withColors,
} = wp.blockEditor;

const {
	Dashicon,
	IconButton,
	PanelBody,
	SelectControl,
	Toolbar,
	ToolbarButton,
	withFallbackStyles,
} = wp.components;

/**
 * Internal dependencies
 */
import {
	iconBold,
	iconItalic,
	iconUppercase,
} from '../../components/icons';

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
			setHoverColor,
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
			isUppercase,
			isBold,
			isItalic,
			buttonSize,
			buttonShape,
			hoverStyle,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `gt-align-${ textAlignment }` ]: textAlignment,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
		} );

		const blockStyles = {
			color: textColor.class ? undefined : textColor.color,
		};

		const buttonClasses = classnames( 'gt-button', {
			[ `gt-button-${ buttonShape }` ]: 'square' !== buttonShape,
			[ `gt-button-${ buttonSize }` ]: buttonSize,
			[ `gt-hover-style-${ hoverStyle }` ]: 'custom' !== hoverStyle,
			'gt-is-uppercase': isUppercase,
			'gt-is-bold': isBold,
			'gt-is-italic': isItalic,
			'has-hover-color': 'custom' === hoverStyle && hoverColor.color,
			[ hoverColor.class ]: 'custom' === hoverStyle && hoverColor.class,
		} );

		const buttonStyles = {
			backgroundColor: ( 'custom' === hoverStyle && ! hoverColor.class ) ? hoverColor.color : undefined,
		};

		const backgroundClasses = classnames( 'gt-button-inner', {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const backgroundStyles = {
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
		};

		return (
			<Fragment>
				<BlockControls>

					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
					/>

					<Toolbar className="components-toolbar">
						<ToolbarButton
							className="components-toolbar__control"
							title={ __( 'Uppercase', 'gt-blocks' ) }
							icon={ iconUppercase }
							isActive={ !! isUppercase }
							onClick={ () => setAttributes( { isUppercase: ! isUppercase } ) }
						/>

						<ToolbarButton
							className="components-toolbar__control"
							title={ __( 'Bold', 'gt-blocks' ) }
							icon={ iconBold }
							isActive={ !! isBold }
							onClick={ () => setAttributes( { isBold: ! isBold } ) }
						/>

						<ToolbarButton
							className="components-toolbar__control"
							title={ __( 'Italic', 'gt-blocks' ) }
							icon={ iconItalic }
							isActive={ !! isItalic }
							onClick={ () => setAttributes( { isItalic: ! isItalic } ) }
						/>
					</Toolbar>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Button Settings', 'gt-blocks' ) } initialOpen={ true } className="gt-panel-button-settings gt-panel">

						<SelectControl
							label={ __( 'Button Size', 'gt-blocks' ) }
							value={ buttonSize }
							onChange={ ( newSize ) => setAttributes( { buttonSize: newSize } ) }
							options={ [
								{ value: 'small', label: __( 'Small', 'gt-blocks' ) },
								{ value: 'medium', label: __( 'Medium', 'gt-blocks' ) },
								{ value: 'large', label: __( 'Large', 'gt-blocks' ) },
								{ value: 'extra-large', label: __( 'Extra Large', 'gt-blocks' ) },
							] }
						/>

						<SelectControl
							label={ __( 'Button Shape', 'gt-blocks' ) }
							value={ buttonShape }
							onChange={ ( newShape ) => setAttributes( { buttonShape: newShape } ) }
							options={ [
								{ value: 'squared', label: __( 'Squared', 'gt-blocks' ) },
								{ value: 'rounded', label: __( 'Rounded Corners', 'gt-blocks' ) },
								{ value: 'circular', label: __( 'Circular', 'gt-blocks' ) },
							] }
						/>

						<SelectControl
							label={ __( 'Hover Style', 'gt-blocks' ) }
							value={ hoverStyle }
							onChange={ ( newStyle ) => setAttributes( { hoverStyle: newStyle } ) }
							options={ [
								{ value: 'lightened', label: __( 'Transparent White', 'gt-blocks' ) },
								{ value: 'darkened', label: __( 'Transparent Black', 'gt-blocks' ) },
								{ value: 'underlined', label: __( 'Underlined', 'gt-blocks' ) },
								{ value: 'custom', label: __( 'Background Color', 'gt-blocks' ) },
							] }
						/>

					</PanelBody>

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

					{ ( 'custom' === hoverStyle ) && (
						<PanelColorSettings
							title={ __( 'Hover Color', 'gt-blocks' ) }
							initialOpen={ false }
							colorSettings={ [
								{
									value: hoverColor.color,
									onChange: setHoverColor,
									label: __( 'Hover Color', 'gt-blocks' ),
								},
							] }
						>
						</PanelColorSettings>
					) }

				</InspectorControls>

				<div className={ blockClasses } style={ blockStyles }>

					<span className={ buttonClasses } style={ buttonStyles } title={ title }>
						<RichText
							className={ backgroundClasses }
							style={ backgroundStyles }
							onChange={ ( newText ) => setAttributes( { text: newText } ) }
							allowedFormats={ [] }
							value={ text }
							placeholder={ placeholder || __( 'Add text…', 'gt-blocks' ) }
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
								// eslint-disable-next-line jsx-a11y/no-autofocus
								autoFocus={ false }
							/>
							<IconButton icon="editor-break" label={ __( 'Apply', 'gt-blocks' ) } type="submit" />
						</form>
					) }

				</div>

			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' }, { hoverColor: 'background-color' } ),
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
] )( ButtonEdit );
