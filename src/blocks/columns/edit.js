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
const { createBlock } = wp.blocks;
const { select, dispatch } = wp.data;

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

/* Three Column Layouts */
const threeColumnLayouts = [
	'25-25-50',
	'25-50-25',
	'50-25-25',
	'30-40-30',
	'20-60-20',
	'33-33-33',
];

/* Four Column Layouts */
const fourColumnLayouts = [
	'25-25-25-25',
];

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
	constructor() {
		super( ...arguments );
		this.updateColumns = this.updateColumns.bind( this );
		this.addColumn = this.addColumn.bind( this );
		this.removeColumn = this.removeColumn.bind( this );
	}

	updateColumns( value ) {
		const {
			attributes,
			setAttributes,
		} = this.props;
		const { items } = attributes;

		const columns = this.getColumnCount( value );

		// Check if new column has to be added.
		if ( items < columns ) {
			this.addColumn();
		} else if ( items > columns ) {
			this.removeColumn();
		}

		// Update attributes.
		setAttributes( {
			columns: columns,
			columnLayout: value,
		} );
	}

	getColumnCount( layout ) {
		if ( threeColumnLayouts.includes( layout ) ) {
			return 3;
		} else if ( fourColumnLayouts.includes( layout ) ) {
			return 4;
		}

		return 2;
	}

	addColumn() {
		const {
			attributes,
			clientId,
			setAttributes,
		} = this.props;

		const {
			items,
		} = attributes;

		// Create Block.
		const block = createBlock( 'gt-blocks/column', {} );

		// Insert Block.
		dispatch( 'core/editor' ).insertBlocks( block, items, clientId );

		// Select Parent Block.
		dispatch( 'core/editor' ).selectBlock( clientId );

		// Update number of items.
		setAttributes( { items: items + 1 } );
	}

	removeColumn() {
		const {
			attributes,
			clientId,
			setAttributes,
		} = this.props;

		const {
			items,
		} = attributes;

		// Get block.
		const block = select( 'core/editor' ).getBlocksByClientId( clientId )[ 0 ];

		// Get last column block.
		const lastColumn = block.innerBlocks[ items - 1 ];

		// Check if last column block is empty.
		if ( 0 === lastColumn.innerBlocks.length ) {
			// Remove block.
			dispatch( 'core/editor' ).removeBlocks( lastColumn.clientId );

			// Select Parent Block.
			dispatch( 'core/editor' ).selectBlock( clientId );

			// Update number of items.
			setAttributes( { items: items - 1 } );
		}
	}

	render() {
		const {
			attributes,
			setAttributes,
			className,
		} = this.props;

		const {
			items,
			columns,
			columnLayout,
			columnGap,
		} = attributes;

		const columnClasses = classnames( 'gt-columns-container', {
			[ `gt-columns-${ columnLayout }` ]: columnLayout,
			[ `gt-column-count-${ columns }` ]: columns,
			[ `gt-${ columnGap }-column-gap` ]: 'normal' !== columnGap,
		} );

		return (
			<Fragment>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Layout Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Columns', 'gt-blocks' ) }
							value={ columnLayout }
							onChange={ this.updateColumns }
							options={ [
								{ value: '25-75', label: __( '25% | 75%', 'gt-blocks' ) },
								{ value: '75-25', label: __( '75% | 25%', 'gt-blocks' ) },
								{ value: '33-66', label: __( '33% | 66%', 'gt-blocks' ) },
								{ value: '66-33', label: __( '66% | 33%', 'gt-blocks' ) },
								{ value: '40-60', label: __( '40% | 60%', 'gt-blocks' ) },
								{ value: '60-40', label: __( '60% | 40%', 'gt-blocks' ) },
								{ value: '50-50', label: __( '50% | 50%', 'gt-blocks' ) },
								{ value: '25-25-50', label: __( '25% | 25% | 50%', 'gt-blocks' ) },
								{ value: '25-50-25', label: __( '25% | 50% | 25%', 'gt-blocks' ) },
								{ value: '50-25-25', label: __( '50% | 25% | 25%', 'gt-blocks' ) },
								{ value: '30-40-30', label: __( '30% | 40% | 30%', 'gt-blocks' ) },
								{ value: '20-60-20', label: __( '20% | 60% | 20%', 'gt-blocks' ) },
								{ value: '33-33-33', label: __( '33% | 33% | 33%', 'gt-blocks' ) },
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
