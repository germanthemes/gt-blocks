/**
 * External dependencies
 */
import classnames from 'classnames';
import { forEach, map } from 'lodash';
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
	BaseControl,
	Button,
	ButtonGroup,
	PanelBody,
	RangeControl,
	SelectControl,
	withFallbackStyles,
} = wp.components;

/* Define Padding Sizes */
const paddingSizes = {
	small: {
		name: 'S',
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	medium: {
		name: 'M',
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	large: {
		name: 'L',
		paddingVertical: 32,
		paddingHorizontal: 32,
	},
};

/**
 * Block Edit Component
 */
class HeroContentEdit extends Component {
	constructor() {
		super( ...arguments );

		this.setPaddingClass = this.setPaddingClass.bind( this );
		this.setVerticalPadding = this.setVerticalPadding.bind( this );
		this.setHorizontalPadding = this.setHorizontalPadding.bind( this );
	}

	setPaddingClass( size ) {
		const paddingV = paddingSizes[ size ] && paddingSizes[ size ].paddingVertical ? paddingSizes[ size ].paddingVertical : 24;
		const paddingH = paddingSizes[ size ] && paddingSizes[ size ].paddingHorizontal ? paddingSizes[ size ].paddingHorizontal : 24;

		this.props.setAttributes( {
			paddingClass: size,
			paddingVertical: paddingV,
			paddingHorizontal: paddingH,
		} );
	}

	setVerticalPadding( padding ) {
		this.props.setAttributes( { paddingVertical: padding } );
		this.updatePaddingClass( padding, this.props.attributes.paddingHorizontal );
	}

	setHorizontalPadding( padding ) {
		this.props.setAttributes( { paddingHorizontal: padding } );
		this.updatePaddingClass( this.props.attributes.paddingVertical, padding );
	}

	updatePaddingClass( vertical, horizontal ) {
		forEach( paddingSizes, ( { paddingVertical, paddingHorizontal }, size ) => {
			if ( paddingVertical === vertical && paddingHorizontal === horizontal ) {
				this.props.setAttributes( { paddingClass: size } );
				return false;
			}
			this.props.setAttributes( { paddingClass: undefined } );
		} );
	}

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
		} = this.props;

		const {
			heroLayout,
			paddingClass,
			paddingVertical,
			paddingHorizontal,
		} = attributes;

		const blockClasses = classnames( 'gt-hero-section', {
			[ `gt-hero-layout-${ heroLayout }` ]: heroLayout,
		} );

		const contentClasses = classnames( 'gt-hero-content', {
			[ `gt-padding-${ paddingClass }` ]: paddingClass,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const paddingStyles = ! paddingClass && backgroundColor.color;

		const contentStyles = {
			paddingTop: paddingStyles && paddingVertical !== 24 ? paddingVertical + 'px' : undefined,
			paddingBottom: paddingStyles && paddingVertical !== 24 ? paddingVertical + 'px' : undefined,
			paddingLeft: paddingStyles && paddingHorizontal !== 24 ? paddingHorizontal + 'px' : undefined,
			paddingRight: paddingStyles && paddingHorizontal !== 24 ? paddingHorizontal + 'px' : undefined,
			color: textColor.class ? undefined : textColor.color,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
		};

		return (
			<Fragment>

				<InspectorControls>

					<PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Hero Layout' ) }
							value={ heroLayout }
							onChange={ ( newLayout ) => setAttributes( { heroLayout: newLayout } ) }
							options={ [
								{ value: 'full', label: __( 'Fullwidth' ) },
								{ value: 'center', label: __( 'Center' ) },
								{ value: 'left', label: __( 'Left' ) },
								{ value: 'right', label: __( 'Right' ) },
							] }
						/>

					</PanelBody>

					{ backgroundColor.color && (
						<PanelBody title={ __( 'Padding Options' ) } initialOpen={ false } className="gt-panel-padding-options gt-panel">

							<BaseControl id="gt-padding-size" label={ __( 'Padding' ) }>

								<div className="gt-padding-size-picker">

									<ButtonGroup aria-label={ __( 'Padding' ) }>
										{ map( paddingSizes, ( { name }, size ) => (
											<Button
												key={ size }
												isLarge
												isPrimary={ paddingClass === size }
												aria-pressed={ paddingClass === size }
												onClick={ () => this.setPaddingClass( size ) }
											>
												{ name }
											</Button>
										) ) }
									</ButtonGroup>

									<Button
										isLarge
										onClick={ () => this.setPaddingClass( undefined ) }
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

				<div className={ blockClasses }>

					<div className={ contentClasses } style={ contentStyles }>

						<InnerBlocks
							allowedBlocks={ [ 'gt-layout-blocks/heading', 'core/paragraph' ] }
							template={ [
								[ 'gt-layout-blocks/heading', {
									placeholder: __( 'Write Hero Heading...' ),
									customFontSize: 48,
								} ],
								[ 'core/paragraph', {
									placeholder: __( 'Write Hero text...' ),
									customFontSize: 20,
								} ],
								[ 'gt-layout-blocks/buttons', {
									customClass: 'gt-buttons-wrapper',
									buttons: 2,
									buttonAttributes: {
										buttonSize: 'medium',
										customFontSize: 20,
										synchronizeStyling: true,
										parentBlock: 'gt-layout-blocks/buttons',
									},
								} ],
							] }
							templateLock="all"
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
] )( HeroContentEdit );
