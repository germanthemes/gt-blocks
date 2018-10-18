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
class contentEdit extends Component {
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
						<PanelBody title={ __( 'Spacing Options' ) } initialOpen={ false } className="gt-panel-spacing-options gt-panel">

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

				<div className={ className }>

					<div className={ contentClasses } style={ contentStyles }>

						<InnerBlocks
							allowedBlocks={ allowedBlocks || undefined }
							template={ template || [ [ 'core/paragraph', {} ] ] }
							templateLock={ templateLock || false }
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
