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

const { __ } = wp.i18n;
const { compose } = wp.compose;

const {
	AlignmentToolbar,
	BlockControls,
	ContrastChecker,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	PanelBody,
	RangeControl,
	SelectControl,
	withFallbackStyles,
} = wp.components;

/**
 * Internal dependencies
 */
import { default as IconPicker } from '../../components/icon-picker';

/**
 * Block Edit Component
 */
class IconEdit extends Component {
	getIconSizeInPixel( sizeStr ) {
		switch ( sizeStr ) {
			case 'small': {
				return 16;
			}
			case 'medium': {
				return 48;
			}
			case 'large': {
				return 64;
			}
			case 'extra-large': {
				return 96;
			}
			case 'huge': {
				return 128;
			}
		}

		return 32;
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
			[ `gt-icon-${ iconLayout }` ]: 'default' !== iconLayout,
			[ `gt-icon-${ iconPadding }-padding` ]: 'normal' !== iconPadding,
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

					<PanelBody title={ __( 'Icon Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-icon-settings gt-panel">

						<SelectControl
							label={ __( 'Icon Style', 'gt-blocks' ) }
							value={ iconLayout }
							onChange={ ( newStyle ) => setAttributes( { iconLayout: newStyle } ) }
							options={ [
								{ value: 'default', label: __( 'Default', 'gt-blocks' ) },
								{ value: 'circle', label: __( 'Circle', 'gt-blocks' ) },
								{ value: 'outline', label: __( 'Outline', 'gt-blocks' ) },
								{ value: 'square', label: __( 'Square', 'gt-blocks' ) },
								{ value: 'full', label: __( 'Full', 'gt-blocks' ) },
							] }
						/>

						<SelectControl
							label={ __( 'Icon Size', 'gt-blocks' ) }
							value={ iconSize }
							onChange={ ( newSize ) => setAttributes( { iconSize: newSize } ) }
							options={ [
								{ value: 'small', label: __( 'Small', 'gt-blocks' ) },
								{ value: 'normal', label: __( 'Normal', 'gt-blocks' ) },
								{ value: 'medium', label: __( 'Medium', 'gt-blocks' ) },
								{ value: 'large', label: __( 'Large', 'gt-blocks' ) },
								{ value: 'extra-large', label: __( 'Extra Large', 'gt-blocks' ) },
								{ value: 'huge', label: __( 'Huge', 'gt-blocks' ) },
							] }
						/>

						{ iconLayout !== 'default' && (
							<SelectControl
								label={ __( 'Icon Padding', 'gt-blocks' ) }
								value={ iconPadding }
								onChange={ ( newPadding ) => setAttributes( { iconPadding: newPadding } ) }
								options={ [
									{ value: 'small', label: __( 'Small', 'gt-blocks' ) },
									{ value: 'normal', label: __( 'Normal', 'gt-blocks' ) },
									{ value: 'medium', label: __( 'Medium', 'gt-blocks' ) },
									{ value: 'large', label: __( 'Large', 'gt-blocks' ) },
								] }
							/>
						) }

						{ iconLayout === 'outline' && (
							<RangeControl
								label={ __( 'Border Width', 'gt-blocks' ) }
								value={ outlineBorderWidth }
								onChange={ ( newWidth ) => setAttributes( { outlineBorderWidth: newWidth } ) }
								min={ 1 }
								max={ 12 }
							/>
						) }

						{ iconLayout === 'square' && (
							<RangeControl
								label={ __( 'Rounded Corners', 'gt-blocks' ) }
								value={ roundedCorners }
								onChange={ ( newRadius ) => setAttributes( { roundedCorners: newRadius } ) }
								min={ 0 }
								max={ 48 }
							/>
						) }

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
							fontSize={ 32 }
						/>
					</PanelColorSettings>

				</InspectorControls>

				<div className={ className } style={ blockStyles }>
					<IconPicker
						icon={ icon }
						iconClasses={ iconClasses }
						iconStyles={ iconStyles }
						iconSize={ this.getIconSizeInPixel( iconSize ) }
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
] )( IconEdit );
