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
			subtitleBackgroundColor,
			setSubtitleBackgroundColor,
			subtitleFallbackBackgroundColor,
			subtitleColor,
			setSubtitleColor,
			subtitleFallbackTextColor,
			fontSize,
			setFontSize,
			fallbackFontSize,
			subtitleFontSize,
			setSubtitleFontSize,
			subtitleFallbackFontSize,
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
			titleTextTransform,
			subtitleFontWeight,
			subtitleTextTransform,
		} = attributes;

		const blockStyles = {
			textAlign: textAlignment,
		};

		const headingClasses = classnames( 'gt-heading', {
			'gt-is-bold': titleFontWeight,
			'gt-is-uppercase': titleTextTransform,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			[ fontSize.class ]: fontSize.class,
		} );

		const headingStyles = {
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			color: textColor.class ? undefined : textColor.color,
			fontSize: fontSize.size ? fontSize.size + 'px' : undefined,
		};

		const subheadingClasses = classnames( 'gt-subheading', {
			'gt-is-bold': subtitleFontWeight,
			'gt-is-uppercase': subtitleTextTransform,
			'has-background': subtitleBackgroundColor.color,
			[ subtitleBackgroundColor.class ]: subtitleBackgroundColor.class,
			'has-text-color': subtitleColor.color,
			[ subtitleColor.class ]: subtitleColor.class,
			[ subtitleFontSize.class ]: subtitleFontSize.class,
		} );

		const subheadingStyles = {
			backgroundColor: subtitleBackgroundColor.class ? undefined : subtitleBackgroundColor.color,
			color: subtitleColor.class ? undefined : subtitleColor.color,
			fontSize: subtitleFontSize.size ? subtitleFontSize.size + 'px' : undefined,
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

					<PanelBody title={ __( 'Heading Settings', 'gt-layout-blocks' ) } initialOpen={ false } className="gt-panel-heading-settings gt-panel">

						<BaseControl id="gt-title-tag" label={ __( 'Title Tag', 'gt-layout-blocks' ) }>
							<Toolbar
								controls={
									range( 1, 6 ).map( ( level ) => ( {
										icon: 'heading',
										title: sprintf( __( 'Heading %s', 'gt-layout-blocks' ), level ),
										isActive: 'h' + level === titleTag,
										onClick: () => setAttributes( { titleTag: 'h' + level } ),
										subscript: level,
									} ) ).concat( [ {
										icon: 'editor-paragraph',
										title: __( 'Paragraph', 'gt-layout-blocks' ),
										isActive: 'p' === titleTag,
										onClick: () => setAttributes( { titleTag: 'p' } ),
									} ] )
								}
							/>
						</BaseControl>

						<FontSizePicker
							fallbackFontSize={ fallbackFontSize }
							value={ fontSize.size }
							onChange={ setFontSize }
						/>

						<ToggleControl
							label={ __( 'Bold?', 'gt-layout-blocks' ) }
							checked={ !! titleFontWeight }
							onChange={ () => setAttributes( { titleFontWeight: ! titleFontWeight } ) }
						/>

						<ToggleControl
							label={ __( 'Uppercase?', 'gt-layout-blocks' ) }
							checked={ !! titleTextTransform }
							onChange={ () => setAttributes( { titleTextTransform: ! titleTextTransform } ) }
						/>

					</PanelBody>

					<PanelBody title={ __( 'Subheading Settings', 'gt-layout-blocks' ) } initialOpen={ false } className="gt-panel-subheading-settings gt-panel">

						<FontSizePicker
							fallbackFontSize={ subtitleFallbackFontSize }
							value={ subtitleFontSize.size }
							onChange={ setSubtitleFontSize }
						/>

						<ToggleControl
							label={ __( 'Bold?', 'gt-layout-blocks' ) }
							checked={ !! subtitleFontWeight }
							onChange={ () => setAttributes( { subtitleFontWeight: ! subtitleFontWeight } ) }
						/>

						<ToggleControl
							label={ __( 'Uppercase?', 'gt-layout-blocks' ) }
							checked={ !! subtitleTextTransform }
							onChange={ () => setAttributes( { subtitleTextTransform: ! subtitleTextTransform } ) }
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

					<PanelColorSettings
						title={ __( 'Subheading Colors', 'gt-layout-blocks' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: subtitleBackgroundColor.color,
								onChange: setSubtitleBackgroundColor,
								label: __( 'Background Color', 'gt-layout-blocks' ),
							},
							{
								value: subtitleColor.color,
								onChange: setSubtitleColor,
								label: __( 'Text Color', 'gt-layout-blocks' ),
							},
						] }
					>

						<ContrastChecker
							{ ...{
								textColor: subtitleColor.color,
								backgroundColor: subtitleBackgroundColor.color,
								subtitleFallbackTextColor,
								subtitleFallbackBackgroundColor,
							} }
							fontSize={ subtitleFontSize.size }
						/>
					</PanelColorSettings>

				</InspectorControls>

				<header className={ className } style={ blockStyles }>
					<RichText
						tagName={ titleTag }
						value={ title }
						className={ headingClasses }
						style={ headingStyles }
						onChange={ ( newTitle ) => setAttributes( { title: newTitle } ) }
						placeholder={ titlePlaceholder || __( 'Write heading…', 'gt-layout-blocks' ) }
						keepPlaceholderOnFocus
					/>

					<RichText
						value={ subtitle }
						className={ subheadingClasses }
						style={ subheadingStyles }
						onChange={ ( newSubtitle ) => setAttributes( { subtitle: newSubtitle } ) }
						placeholder={ subtitlePlaceholder || __( 'Write subheading…', 'gt-layout-blocks' ) }
						keepPlaceholderOnFocus
					/>
				</header>

			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' }, { subtitleColor: 'color' }, { subtitleBackgroundColor: 'background-color' } ),
	withFontSizes( 'fontSize', 'subtitleFontSize' ),
	withFallbackStyles( ( node, ownProps ) => {
		const {
			textColor,
			backgroundColor,
			subtitleColor,
			subtitleBackgroundColor,
			fontSize,
			customFontSize,
			subtitleFontSize,
			subtitleCustomFontSize,
		} = ownProps.attributes;
		const editableNode = node.querySelector( '[contenteditable="true"]' );
		//verify if editableNode is available, before using getComputedStyle.
		const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
		return {
			fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
			fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
			fallbackFontSize: fontSize || customFontSize || ! computedStyles ? undefined : parseInt( computedStyles.fontSize ) || undefined,
			subtitleFallbackBackgroundColor: subtitleBackgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
			subtitleFallbackTextColor: subtitleColor || ! computedStyles ? undefined : computedStyles.color,
			subtitleFallbackFontSize: subtitleFontSize || subtitleCustomFontSize || ! computedStyles ? undefined : parseInt( computedStyles.fontSize ) || undefined,
		};
	} ),
] )( DualHeadingEdit );
