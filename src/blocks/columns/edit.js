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
const { compose } = wp.compose;

const {
	select,
	dispatch,
	withSelect,
} = wp.data;

const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	BaseControl,
	Button,
	ButtonGroup,
	Dashicon,
	PanelBody,
	SelectControl,
	Tooltip,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

/* Two Column Layouts */
const twoColumnLayouts = [
	{ value: '50-50', label: __( '50% | 50%', 'gt-blocks' ) },
	{ value: '60-40', label: __( '60% | 40%', 'gt-blocks' ) },
	{ value: '40-60', label: __( '40% | 60%', 'gt-blocks' ) },
	{ value: '66-33', label: __( '66% | 33%', 'gt-blocks' ) },
	{ value: '33-66', label: __( '33% | 66%', 'gt-blocks' ) },
	{ value: '75-25', label: __( '75% | 25%', 'gt-blocks' ) },
	{ value: '25-75', label: __( '25% | 75%', 'gt-blocks' ) },
];

/* Three Column Layouts */
const threeColumnLayouts = [
	{ value: '33-33-33', label: __( '33% | 33% | 33%', 'gt-blocks' ) },
	{ value: '30-40-30', label: __( '30% | 40% | 30%', 'gt-blocks' ) },
	{ value: '20-60-20', label: __( '20% | 60% | 20%', 'gt-blocks' ) },
	{ value: '50-25-25', label: __( '50% | 25% | 25%', 'gt-blocks' ) },
	{ value: '25-50-25', label: __( '25% | 50% | 25%', 'gt-blocks' ) },
	{ value: '25-25-50', label: __( '25% | 25% | 50%', 'gt-blocks' ) },
];

/* Three Column Layouts */
const fourColumnLayouts = [
	{ value: '25-25-25-25', label: __( '25% | 25% | 25% | 25%', 'gt-blocks' ) },
	{ value: '40-20-20-20', label: __( '40% | 20% | 20% | 20%', 'gt-blocks' ) },
	{ value: '20-20-20-40', label: __( '20% | 20% | 20% | 40%', 'gt-blocks' ) },
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
	}

	componentDidUpdate() {
		const {
			clientId,
			setAttributes,
		} = this.props;

		// Get block.
		const block = select( 'core/editor' ).getBlocksByClientId( clientId )[ 0 ];

		// Update number of items.
		setAttributes( { items: block.innerBlocks.length } );
	}

	updateColumns( columnLayout, columns ) {
		const {
			attributes,
			setAttributes,
		} = this.props;
		const { items } = attributes;

		// Check if new columns have to be added.
		if ( items < columns ) {
			for ( let i = 0; i < columns - items; i++ ) {
				this.addColumn();
			}
		}

		// Update attributes.
		setAttributes( {
			columns: columns,
			columnLayout: columnLayout,
		} );
	}

	addColumn() {
		const {
			attributes,
			clientId,
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
	}

	displayColumnButton( layout, label ) {
		const columns = layout.split( '-' );
		let start = 0;
		return (
			<Tooltip text={ label }>
				<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
					{ columns.map( ( column, i ) => {
						const width = parseInt( column ) - 5;
						const path = <rect key={ i } x={ start } y="0" width={ width } height="50"></rect>;
						start = start + parseInt( column );
						return path;
					} ) }
				</svg>
			</Tooltip>
		);
	}

	render() {
		const {
			attributes,
			setAttributes,
			className,
			clientId,
			isChildBlockSelected,
			isSelected,
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

					<PanelBody title={ __( 'Layout Settings', 'gt-blocks' ) } className="gt-panel-layout-settings gt-panel">

						<BaseControl label={ __( 'Two Columns', 'gt-blocks' ) } className="gt-column-layout-control">

							<ButtonGroup>
								{ twoColumnLayouts.map( ( { value, label } ) => (
									<Button
										key={ value }
										isDefault={ false }
										isPrimary={ columnLayout === value }
										aria-pressed={ columnLayout === value }
										onClick={ () => this.updateColumns( value, 2 ) }
									>
										{ this.displayColumnButton( value, label ) }
									</Button>
								) ) }
							</ButtonGroup>

						</BaseControl>

						<BaseControl label={ __( 'Three Columns', 'gt-blocks' ) } className="gt-column-layout-control">

							<ButtonGroup>
								{ threeColumnLayouts.map( ( { value, label } ) => (
									<Button
										key={ value }
										isDefault={ false }
										isPrimary={ columnLayout === value }
										aria-pressed={ columnLayout === value }
										onClick={ () => this.updateColumns( value, 3 ) }
									>
										{ this.displayColumnButton( value, label ) }
									</Button>
								) ) }
							</ButtonGroup>

						</BaseControl>

						<BaseControl label={ __( 'Four Columns', 'gt-blocks' ) } className="gt-column-layout-control">

							<ButtonGroup>
								{ fourColumnLayouts.map( ( { value, label } ) => (
									<Button
										key={ value }
										isDefault={ false }
										isPrimary={ columnLayout === value }
										aria-pressed={ columnLayout === value }
										onClick={ () => this.updateColumns( value, 4 ) }
									>
										{ this.displayColumnButton( value, label ) }
									</Button>
								) ) }
							</ButtonGroup>

						</BaseControl>

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

					{ ( isSelected || isChildBlockSelected ) && (
						<Button
							isLarge
							onClick={ () => dispatch( 'core/editor' ).selectBlock( clientId ) }
							className={ classnames( 'gt-change-column-layout', 'gt-columns-button', {
								'has-parent-block-selected': isSelected,
							} ) }
						>
							<Dashicon icon="editor-table" />
							{ __( 'Change column layout', 'gt-blocks' ) }
						</Button>
					) }

				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const { hasSelectedInnerBlock } = select( 'core/editor' );
		return {
			isChildBlockSelected: hasSelectedInnerBlock( clientId, true ),
		};
	} ),
] )( ColumnsEdit );
