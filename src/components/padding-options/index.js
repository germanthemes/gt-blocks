/**
 * External dependencies
 */
import { forEach, map } from 'lodash';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const { __ } = wp.i18n;

const {
	BaseControl,
	Button,
	ButtonGroup,
	RangeControl,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

class PaddingOptions extends Component {
	constructor() {
		super( ...arguments );

		this.setPaddingClass = this.setPaddingClass.bind( this );
		this.setVerticalPadding = this.setVerticalPadding.bind( this );
		this.setHorizontalPadding = this.setHorizontalPadding.bind( this );

		const defaultPaddingSizes = {
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

		this.paddingSizes = this.props.paddingSizes ? this.props.paddingSizes : defaultPaddingSizes;

		this.defaultVertical = this.props.defaultVertical ? this.props.defaultVertical : 24;
		this.defaultHorizontal = this.props.defaultHorizontal ? this.props.defaultHorizontal : 24;
	}

	setPaddingClass( size ) {
		const paddingV = this.paddingSizes[ size ] && this.paddingSizes[ size ].paddingVertical ? this.paddingSizes[ size ].paddingVertical : this.defaultVertical;
		const paddingH = this.paddingSizes[ size ] && this.paddingSizes[ size ].paddingHorizontal ? this.paddingSizes[ size ].paddingHorizontal : this.defaultHorizontal;

		this.props.setPadding( {
			paddingClass: size,
			paddingVertical: paddingV,
			paddingHorizontal: paddingH,
		} );
	}

	setVerticalPadding( padding ) {
		this.props.setPadding( { paddingVertical: padding } );
		this.updatePaddingClass( padding, this.props.paddingHorizontal );
	}

	setHorizontalPadding( padding ) {
		this.props.setPadding( { paddingHorizontal: padding } );
		this.updatePaddingClass( this.props.paddingVertical, padding );
	}

	updatePaddingClass( vertical, horizontal ) {
		forEach( this.paddingSizes, ( { paddingVertical, paddingHorizontal }, size ) => {
			if ( paddingVertical === vertical && paddingHorizontal === horizontal ) {
				this.props.setPadding( { paddingClass: size } );
				return false;
			}
			this.props.setPadding( { paddingClass: undefined } );
		} );
	}

	render() {
		const {
			title,
			paddingClass,
			paddingVertical,
			paddingHorizontal,
		} = this.props;

		const label = title ? title : __( 'Padding' );

		return (
			<Fragment>
				<BaseControl id="gt-padding-size" label={ label }>

					<div className="gt-padding-options-size-picker">

						<ButtonGroup aria-label={ __( 'Padding' ) }>
							{ map( this.paddingSizes, ( { name }, size ) => (
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

			</Fragment>
		);
	}
}

export default PaddingOptions;
