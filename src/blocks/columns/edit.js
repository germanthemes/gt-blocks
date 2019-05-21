/**
 * External dependencies
 */
import classnames from 'classnames';
import memoize from 'memize';
const { times } = lodash;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	PanelBody,
	SelectControl,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Returns the layouts configuration for a given number of items.
 *
 * @param {number} number Number of items.
 *
 * @return {Object[]} Items layout configuration.
 */
const getTemplate = memoize( ( number ) => {
	return times( number, () => [ 'gt-blocks/column', {} ] );
} );

/**
 * Block Edit Component
 */
class ColumnsEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			className,
		} = this.props;

		const {
			items,
			columns,
			columnGap,
		} = attributes;

		const columnClasses = classnames( 'gt-columns-container', {
			[ `gt-columns-${ columns }` ]: columns,
			[ `gt-${ columnGap }-column-gap` ]: 'normal' !== columnGap,
		} );

		return (
			<Fragment>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Layout Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Columns', 'gt-blocks' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							options={ [
								{ value: '1-2', label: __( '33% | 66%', 'gt-blocks' ) },
								{ value: '2-1', label: __( '66% | 33%', 'gt-blocks' ) },
								{ value: '2', label: __( '50% | 50%', 'gt-blocks' ) },
								{ value: '1-3', label: __( '25% | 75%', 'gt-blocks' ) },
								{ value: '3-1', label: __( '75% | 25%', 'gt-blocks' ) },
								{ value: '3', label: __( '33% | 33% | 33%', 'gt-blocks' ) },
							] }
						/>

						<SelectControl
							label={ __( 'Column Gap', 'gt-blocks' ) }
							value={ columnGap }
							onChange={ ( value ) => setAttributes( { columnGap: value } ) }
							options={ [
								{ value: 'none', label: __( 'None', 'gt-blocks' ) },
								{ value: 'small', label: __( 'Small', 'gt-blocks' ) },
								{ value: 'normal', label: __( 'Normal', 'gt-blocks' ) },
								{ value: 'medium', label: __( 'Medium', 'gt-blocks' ) },
								{ value: 'large', label: __( 'Large', 'gt-blocks' ) },
								{ value: 'extra-large', label: __( 'Extra Large', 'gt-blocks' ) },
							] }
						/>

					</PanelBody>

				</InspectorControls>

				<div className={ className }>

					<div className={ columnClasses }>

						<InnerBlocks
							template={ getTemplate( items ) }
							templateLock={ false }
							allowedBlocks={ [ 'gt-blocks/column' ] }
						/>

					</div>

				</div>
			</Fragment>
		);
	}
}

export default ColumnsEdit;
