/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	range,
} from 'lodash';
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
	RangeControl,
	SelectControl,
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
			headingLayout,
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight,
			fontWeight,
			italic,
			uppercase,
			border,
			borderWidth,
		} = attributes;

		const blockStyles = {
			textAlign: textAlignment,
		};

		const headingClasses = classnames( 'gt-heading', {
			'gt-is-inline-block': 'inline-block' === headingLayout,
			'gt-is-bold': 'bold' === fontWeight,
			'gt-is-thin': 'thin' === fontWeight,
			'gt-is-italic': italic,
			'gt-is-uppercase': uppercase,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			[ fontSize.class ]: fontSize.class,
			[ `gt-border-${ border }` ]: ( 'none' !== border ),
		} );

		const headingStyles = {
			paddingTop: 'undefined' !== typeof paddingTop ? paddingTop + 'px' : undefined,
			paddingBottom: 'undefined' !== typeof paddingBottom ? paddingBottom + 'px' : undefined,
			paddingLeft: 'undefined' !== typeof paddingLeft ? paddingLeft + 'px' : undefined,
			paddingRight: 'undefined' !== typeof paddingRight ? paddingRight + 'px' : undefined,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			color: textColor.class ? undefined : textColor.color,
			fontSize: fontSize.size ? fontSize.size + 'px' : undefined,
			borderWidth: borderWidth !== 4 ? borderWidth + 'px' : undefined,
		};

		return (
			<Fragment>
				<BlockControls>

					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
					/>

					<Toolbar
						controls={
							range( 1, 5 ).map( ( level ) => ( {
								icon: 'heading',
								title: sprintf( __( 'Heading %s' ), level ),
								isActive: level === titleTag,
								onClick: () => setAttributes( { titleTag: level } ),
								subscript: level,
							} ) )
						}
					/>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Heading Settings' ) } initialOpen={ false } className="gt-panel-heading-settings gt-panel">

						<BaseControl id="gt-title-tag" label={ __( 'Level' ) }>
							<Toolbar
								controls={
									range( 1, 7 ).map( ( level ) => ( {
										icon: 'heading',
										title: sprintf( __( 'Heading %s' ), level ),
										isActive: level === titleTag,
										onClick: () => setAttributes( { titleTag: level } ),
										subscript: level,
									} ) )
								}
							/>
						</BaseControl>

						<BaseControl id="gt-text-alignment" label={ __( 'Text Alignment' ) }>
							<AlignmentToolbar
								value={ textAlignment }
								onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
							/>
						</BaseControl>

						<SelectControl
							label={ __( 'Layout' ) }
							value={ headingLayout }
							onChange={ ( newStyle ) => setAttributes( { headingLayout: newStyle } ) }
							options={ [
								{ value: 'block', label: __( 'Block' ) },
								{ value: 'inline-block', label: __( 'Inline Block' ) },
							] }
							help={ __( 'The effect of this setting is only visible with a border or background color assigned.' ) }
						/>

					</PanelBody>

					<PanelBody title={ __( 'Padding Options' ) } initialOpen={ false } className="gt-panel-padding-options gt-panel">

						<RangeControl
							label={ __( 'Padding Top' ) }
							value={ paddingTop }
							onChange={ ( newPadding ) => setAttributes( { paddingTop: newPadding } ) }
							min={ 0 }
							max={ 64 }
						/>

						<RangeControl
							label={ __( 'Padding Bottom' ) }
							value={ paddingBottom }
							onChange={ ( newPadding ) => setAttributes( { paddingBottom: newPadding } ) }
							min={ 0 }
							max={ 64 }
						/>

						<RangeControl
							label={ __( 'Padding Left' ) }
							value={ paddingLeft }
							onChange={ ( newPadding ) => setAttributes( { paddingLeft: newPadding } ) }
							min={ 0 }
							max={ 64 }
						/>

						<RangeControl
							label={ __( 'Padding Right' ) }
							value={ paddingRight }
							onChange={ ( newPadding ) => setAttributes( { paddingRight: newPadding } ) }
							min={ 0 }
							max={ 64 }
						/>

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

				<div className={ className } style={ blockStyles }>
					<RichText
						tagName={ 'h' + titleTag }
						value={ title }
						className={ headingClasses }
						style={ headingStyles }
						onChange={ ( newTitle ) => setAttributes( { title: newTitle } ) }
						placeholder={ placeholder || __( 'Write heading…' ) }
						keepPlaceholderOnFocus
					/>
				</div>

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
