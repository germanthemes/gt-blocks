/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';
import memoize from 'memize';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const {
	__,
} = wp.i18n;

const {
	AlignmentToolbar,
	BlockControls,
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	BaseControl,
	PanelBody,
	RangeControl,
} = wp.components;

/**
 * Block Edit Component
 */
class ButtonsEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			className,
		} = this.props;

		const {
			customClass,
			buttons,
			buttonAttributes,
			alignment,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `${ customClass }` ]: customClass,
			[ `gt-align-${ alignment }` ]: 'center' === alignment || 'right' === alignment,
		} );

		/**
		 * Returns the layouts configuration for a given number of buttons.
		 *
		 * @param {number} number Number of buttons.
		 *
		 * @return {Object[]} Items layout configuration.
		 */
		const getTemplate = memoize( ( number ) => {
			return times( number, () => [ 'gt-layout-blocks/button', buttonAttributes || {} ] );
		} );

		return (
			<Fragment>

				<BlockControls>

					<AlignmentToolbar
						value={ alignment }
						onChange={ ( newAlignment ) => setAttributes( { alignment: newAlignment } ) }
					/>

				</BlockControls>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Layout Settings' ) } initialOpen={ true } className="gt-panel-layout-settings gt-panel">

						<RangeControl
							label={ __( 'Number of buttons' ) }
							value={ buttons }
							onChange={ ( newValue ) => setAttributes( { buttons: newValue } ) }
							min={ 1 }
							max={ 6 }
						/>

						<BaseControl id="gt-alignment-control" label={ __( 'Alignment' ) }>
							<AlignmentToolbar
								value={ alignment }
								onChange={ ( newAlignment ) => setAttributes( { alignment: newAlignment } ) }
							/>
						</BaseControl>

					</PanelBody>

				</InspectorControls>

				<div className={ blockClasses }>

					<InnerBlocks
						template={ getTemplate( buttons ) }
						templateLock="all"
					/>

				</div>

			</Fragment>
		);
	}
}

export default ButtonsEdit;
