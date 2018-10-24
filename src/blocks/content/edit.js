/**
 * External dependencies
 */
import classnames from 'classnames';
const { getComputedStyle } = window;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const {
	Component,
	Fragment,
} = wp.element;

const {
	ContrastChecker,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	PanelBody,
	withFallbackStyles,
} = wp.components;

/**
 * Internal dependencies
 */
import { default as PaddingOptions } from '../../components/padding-options';

/**
 * Block Edit Component
 */
class contentEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			className,
		} = this.props;

		const {
			allowedBlocks,
			template,
			templateLock,
			paddingClass,
			paddingVertical,
			paddingHorizontal,
		} = attributes;

		const contentClasses = classnames( 'gt-content', {
			[ `gt-padding-${ paddingClass }` ]: paddingClass,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const paddingStyles = ! paddingClass && backgroundColor.color;

		const contentStyles = {
			display: paddingStyles && paddingVertical === 0 ? 'flex' : undefined,
			paddingTop: paddingStyles && paddingVertical !== 24 ? paddingVertical + 'px' : undefined,
			paddingBottom: paddingStyles && paddingVertical !== 24 ? paddingVertical + 'px' : undefined,
			paddingLeft: paddingStyles && paddingHorizontal !== 24 ? paddingHorizontal + 'px' : undefined,
			paddingRight: paddingStyles && paddingHorizontal !== 24 ? paddingHorizontal + 'px' : undefined,
			color: textColor.class ? undefined : textColor.color,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
		};

		return (
			<Fragment>

				<InspectorControls key="inspector">

					{ backgroundColor.color && (
						<PanelBody title={ __( 'Padding Options' ) } initialOpen={ false } className="gt-panel-padding-options gt-panel">

							<PaddingOptions
								paddingClass={ paddingClass }
								paddingVertical={ paddingVertical }
								paddingHorizontal={ paddingHorizontal }
								setPadding={ ( atts ) => setAttributes( atts ) }
							/>

						</PanelBody>
					) }

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

				</InspectorControls>

				<div className={ className }>

					<div className={ contentClasses } style={ contentStyles }>

						<InnerBlocks
							template={ template || undefined }
							templateLock={ templateLock || false }
							{ ...( allowedBlocks && { allowedBlocks } ) }
						/>

					</div>

				</div>

			</Fragment>
		);
	}
}

export default compose( [
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
] )( contentEdit );
