/**
 * External dependencies
 */
import classnames from 'classnames';
const { range } = window.lodash;
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
	sprintf,
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
	withColors,
	withFontSizes,
} = wp.editor;

const {
	BaseControl,
	PanelBody,
	ToggleControl,
	Toolbar,
	withFallbackStyles,
} = wp.components;

/**
 * Block Edit Component
 */
class gtHeadingEdit extends Component {
	render() {
		const {
			attributes,
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			fontSize,
			setFontSize,
			fallbackFontSize,
			setAttributes,
			className,
		} = this.props;

		const {
			title,
			titleTag,
			placeholder,
			textAlignment,
			isBold,
			isUppercase,
		} = attributes;

		const headingClasses = classnames( className, 'gt-heading', {
			'gt-is-bold': isBold,
			'gt-is-uppercase': isUppercase,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			[ fontSize.class ]: fontSize.class,
		} );

		const headingStyles = {
			textAlign: textAlignment,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			color: textColor.class ? undefined : textColor.color,
			fontSize: fontSize.size ? fontSize.size + 'px' : undefined,
		};

		return (
			<Fragment>
				<BlockControls>

					<Toolbar
						controls={
							range( 2, 5 ).map( ( level ) => ( {
								icon: 'heading',
								title: sprintf( __( 'Heading %s', 'gt-layout-blocks' ), level ),
								isActive: level === titleTag,
								onClick: () => setAttributes( { titleTag: level } ),
								subscript: level,
							} ) )
						}
					/>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Heading Settings', 'gt-layout-blocks' ) } initialOpen={ true } className="gt-panel-heading-settings gt-panel">

						<BaseControl id="gt-title-tag" label={ __( 'Level', 'gt-layout-blocks' ) }>
							<Toolbar
								controls={
									range( 1, 7 ).map( ( level ) => ( {
										icon: 'heading',
										title: sprintf( __( 'Heading %s', 'gt-layout-blocks' ), level ),
										isActive: level === titleTag,
										onClick: () => setAttributes( { titleTag: level } ),
										subscript: level,
									} ) )
								}
							/>
						</BaseControl>

						<BaseControl id="gt-text-alignment" label={ __( 'Text Alignment', 'gt-layout-blocks' ) }>
							<AlignmentToolbar
								value={ textAlignment }
								onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
							/>
						</BaseControl>

						<FontSizePicker
							fallbackFontSize={ fallbackFontSize }
							value={ fontSize.size }
							onChange={ setFontSize }
						/>

						<ToggleControl
							label={ __( 'Bold?', 'gt-layout-blocks' ) }
							checked={ !! isBold }
							onChange={ () => setAttributes( { isBold: ! isBold } ) }
						/>

						<ToggleControl
							label={ __( 'Uppercase?', 'gt-layout-blocks' ) }
							checked={ !! isUppercase }
							onChange={ () => setAttributes( { isUppercase: ! isUppercase } ) }
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
							fontSize={ fontSize.size }
						/>
					</PanelColorSettings>

				</InspectorControls>

				<RichText
					tagName={ 'h' + titleTag }
					value={ title }
					className={ headingClasses }
					style={ headingStyles }
					onChange={ ( newTitle ) => setAttributes( { title: newTitle } ) }
					placeholder={ placeholder || __( 'Write heading…', 'gt-layout-blocks' ) }
					keepPlaceholderOnFocus
				/>

			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
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
] )( gtHeadingEdit );
