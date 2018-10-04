/**
 * External dependencies
 */
import classnames from 'classnames';
import { range } from 'lodash';
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

const { withSelect } = wp.data;
const { compose } = wp.compose;

const {
	AlignmentToolbar,
	BlockAlignmentToolbar,
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
	Button,
	Dashicon,
	FontSizePicker,
	IconButton,
	PanelBody,
	RangeControl,
	SelectControl,
	Toolbar,
	withFallbackStyles,
} = wp.components;

/**
 * Internal dependencies
 */
import { default as IconPicker } from '../../components/icon-picker';
import {
	gtIconNumberTwo,
	gtIconNumberThree,
	gtIconNumberFour,
} from '../../components/icons';

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
class gtIconEdit extends Component {
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
			isSelected,
			className,
		} = this.props;

		const {
			icon,
			textAlignment,
			iconLayout,
			iconSize,
			iconPadding,
			outlineBorderWidth,
			roundedCorners,
		} = attributes;

		const blockStyles = {
			textAlign: textAlignment,
		};

		const iconClasses = classnames( 'gt-icon', {
			[ `gt-icon-${ iconLayout }` ]: ( iconLayout !== 'default' ),
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const iconStyles = {
			color: textColor.class ? undefined : textColor.color,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			borderRadius: ( iconLayout === 'square' && roundedCorners !== 0 ) ? roundedCorners + 'px' : undefined,
		};

		const paddingStyles = iconLayout === 'default' ? {} : {
			paddingTop: iconPadding !== 32 ? iconPadding + 'px' : undefined,
			paddingBottom: iconPadding !== 32 ? iconPadding + 'px' : undefined,
			paddingLeft: ( iconLayout !== 'full' && iconPadding !== 32 ) ? iconPadding + 'px' : undefined,
			paddingRight: ( iconLayout !== 'full' && iconPadding !== 32 ) ? iconPadding + 'px' : undefined,
			borderWidth: ( iconLayout === 'outline' && outlineBorderWidth !== 2 ) ? outlineBorderWidth + 'px' : undefined,
		};

		return (
			<Fragment>

				<BlockControls key="controls">

					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
					/>

				</BlockControls>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Icon Settings' ) } initialOpen={ false } className="gt-panel-icon-settings gt-panel">

						<SelectControl
							label={ __( 'Icon Style' ) }
							value={ iconLayout }
							onChange={ ( newStyle ) => setAttributes( { iconLayout: newStyle } ) }
							options={ [
								{ value: 'default', label: __( 'Default' ) },
								{ value: 'circle', label: __( 'Circle' ) },
								{ value: 'outline', label: __( 'Outline' ) },
								{ value: 'square', label: __( 'Square' ) },
								{ value: 'full', label: __( 'Full' ) },
							] }
						/>

						<RangeControl
							label={ __( 'Icon Size' ) }
							value={ iconSize }
							onChange={ ( newSize ) => setAttributes( { iconSize: newSize } ) }
							min={ 16 }
							max={ 128 }
						/>

						{ iconLayout !== 'default' && (
							<RangeControl
								label={ __( 'Icon Padding' ) }
								value={ iconPadding }
								onChange={ ( newPadding ) => setAttributes( { iconPadding: newPadding } ) }
								min={ 16 }
								max={ 64 }
							/>
						) }

						{ iconLayout === 'outline' && (
							<RangeControl
								label={ __( 'Border Width' ) }
								value={ outlineBorderWidth }
								onChange={ ( newWidth ) => setAttributes( { outlineBorderWidth: newWidth } ) }
								min={ 1 }
								max={ 12 }
							/>
						) }

						{ iconLayout === 'square' && (
							<RangeControl
								label={ __( 'Rounded Corners' ) }
								value={ roundedCorners }
								onChange={ ( newRadius ) => setAttributes( { roundedCorners: newRadius } ) }
								min={ 0 }
								max={ 48 }
							/>
						) }

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
							fontSize={ iconSize }
						/>
					</PanelColorSettings>

				</InspectorControls>

				<div className={ className } style={ blockStyles }>
					<IconPicker
						icon={ icon }
						iconClasses={ iconClasses }
						iconStyles={ iconStyles }
						iconSize={ iconSize }
						paddingStyles={ paddingStyles }
						isSelected={ isSelected }
						onChange={ ( newIcon ) => setAttributes( { icon: newIcon } ) }
					/>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	applyFallbackStyles,
] )( gtIconEdit );
