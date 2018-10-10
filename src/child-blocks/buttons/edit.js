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
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	PanelBody,
	RangeControl,
	SelectControl,
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
			items,
			itemTemplate,
			columnGap,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `${ customClass }` ]: customClass,
			[ `gt-${ columnGap }-gap` ]: 'none' !== columnGap,
		} );

		/**
		 * Returns the layouts configuration for a given number of items.
		 *
		 * @param {number} number Number of items.
		 *
		 * @return {Object[]} Items layout configuration.
		 */
		const getTemplate = memoize( ( number ) => {
			const blockTemplate = itemTemplate || [ 'gt-layout-blocks/button' ];
			return times( number, () => blockTemplate );
		} );

		return (
			<Fragment>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Layout Settings' ) } initialOpen={ true } className="gt-panel-layout-settings gt-panel">

						<RangeControl
							label={ __( 'Number of buttons' ) }
							value={ items }
							onChange={ ( newValue ) => setAttributes( { items: newValue } ) }
							min={ 1 }
							max={ 6 }
						/>

						<SelectControl
							label={ __( 'Column Gap' ) }
							value={ columnGap }
							onChange={ ( newValue ) => setAttributes( { columnGap: newValue } ) }
							options={ [
								{ value: 'none', label: __( 'None' ) },
								{ value: 'small', label: __( 'Small' ) },
								{ value: 'medium', label: __( 'Medium' ) },
								{ value: 'large', label: __( 'Large' ) },
								{ value: 'extra-large', label: __( 'Extra Large' ) },
							] }
						/>

					</PanelBody>

				</InspectorControls>

				<div className={ blockClasses }>

					<InnerBlocks
						template={ getTemplate( items ) }
						templateLock="all"
					/>

				</div>

			</Fragment>
		);
	}
}

export default ButtonsEdit;
