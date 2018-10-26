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
	SelectControl,
	ToggleControl,
	Toolbar,
	withFallbackStyles,
} = wp.components;

/**
 * Block Edit Component
 */
class DualHeadingEdit extends Component {
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
			titlePlaceholder,
			subtitle,
			subtitlePlaceholder,
			textAlignment,
			titleFontWeight,
			titleFontStyle,
			titleTextTransform,
		} = attributes;

		const blockStyles = {
			textAlign: textAlignment,
		};

		const headingClasses = classnames( 'gt-heading', {
			'gt-is-bold': 'bold' === titleFontWeight,
			'gt-is-thin': 'thin' === titleFontWeight,
			'gt-is-italic': titleFontStyle,
			'gt-is-uppercase': titleTextTransform,
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

		const subheadingClasses = classnames( 'gt-subheading', {
			'gt-is-bold': 'bold' === titleFontWeight,
			'gt-is-thin': 'thin' === titleFontWeight,
			'gt-is-italic': titleFontStyle,
			'gt-is-uppercase': titleTextTransform,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			[ fontSize.class ]: fontSize.class,
		} );

		const subheadingStyles = {};

		return (
			<Fragment>
				<BlockControls>

					<Toolbar
						controls={
							range( 2, 5 ).map( ( level ) => ( {
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

					<PanelBody title={ __( 'Heading Settings' ) } initialOpen={ true } className="gt-panel-heading-settings gt-panel">

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

					</PanelBody>

					<PanelBody title={ __( 'Font Settings' ) } initialOpen={ false } className="gt-panel-font-settings gt-panel">

						<FontSizePicker
							fallbackFontSize={ fallbackFontSize }
							value={ fontSize.size }
							onChange={ setFontSize }
						/>

						<SelectControl
							label={ __( 'Font Weight' ) }
							value={ titleFontWeight }
							onChange={ ( newWeight ) => setAttributes( { titleFontWeight: newWeight } ) }
							options={ [
								{ value: 'thin', label: __( 'Thin' ) },
								{ value: 'normal', label: __( 'Normal' ) },
								{ value: 'bold', label: __( 'Bold' ) },
							] }
						/>

						<ToggleControl
							label={ __( 'Italic?' ) }
							checked={ !! titleFontStyle }
							onChange={ () => setAttributes( { titleFontStyle: ! titleFontStyle } ) }
						/>

						<ToggleControl
							label={ __( 'Uppercase?' ) }
							checked={ !! titleTextTransform }
							onChange={ () => setAttributes( { titleTextTransform: ! titleTextTransform } ) }
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

				</InspectorControls>

				<header className={ className } style={ blockStyles }>
					<RichText
						tagName={ 'h' + titleTag }
						value={ title }
						className={ headingClasses }
						style={ headingStyles }
						onChange={ ( newTitle ) => setAttributes( { title: newTitle } ) }
						placeholder={ titlePlaceholder || __( 'Write heading…' ) }
						keepPlaceholderOnFocus
					/>

					<RichText
						tagName="span"
						value={ subtitle }
						className={ subheadingClasses }
						style={ subheadingStyles }
						onChange={ ( newSubtitle ) => setAttributes( { subtitle: newSubtitle } ) }
						placeholder={ subtitlePlaceholder || __( 'Write subheading…' ) }
						keepPlaceholderOnFocus
					/>
				</header>

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
] )( DualHeadingEdit );
