/**
 * External dependencies
 */
import classnames from 'classnames';
import memoize from 'memize';
const { times } = lodash;

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

const { compose, withInstanceId } = wp.compose;
const { createBlock } = wp.blocks;

const {
	dispatch,
	withSelect,
} = wp.data;

const {
	BlockControls,
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	Button,
	Dashicon,
	PanelBody,
	RangeControl,
	Toolbar,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';
import {
	gtIconNumberTwo,
	gtIconNumberThree,
	gtIconNumberFour,
} from '../../components/icons';

/**
 * Block Edit Component
 */
class GridEdit extends Component {
	constructor() {
		super( ...arguments );
		this.addBlock = this.addBlock.bind( this );
	}

	addBlock() {
		const {
			attributes,
			clientId,
			setAttributes,
			allowedBlocks,
			template,
			templateLock,
		} = this.props;

		const {
			items,
		} = attributes;

		// Create Block.
		const block = createBlock( 'gt-blocks/column', {
			allowedBlocks: allowedBlocks,
			template: template,
			templateLock: templateLock || false,
		} );

		// Insert Block.
		dispatch( 'core/editor' ).insertBlocks( block, items, clientId );

		// Select parent block.
		dispatch( 'core/editor' ).selectBlock( clientId );

		// Update number of items.
		setAttributes( { items: items + 1 } );
	}

	render() {
		const {
			attributes,
			setAttributes,
			isSelected,
			isChildBlockSelected,
			className,
			instanceId,
			allowedBlocks,
			template,
			templateLock,
		} = this.props;

		const {
			items,
			columns,
		} = attributes;

		const blockId = `gt-icon-grid-block-${ instanceId }`;

		const gridClasses = classnames( 'gt-grid-container', {
			[ `gt-columns-${ columns }` ]: columns,
		} );

		const columnIcons = {
			2: gtIconNumberTwo,
			3: gtIconNumberThree,
			4: gtIconNumberFour,
		};

		/**
		 * Returns the layouts configuration for a given number of items.
		 *
		 * @param {number} number Number of items.
		 *
		 * @return {Object[]} Items layout configuration.
		 */
		const getItemsTemplate = memoize( ( number ) => {
			const block = [ 'gt-blocks/column', {
				allowedBlocks: allowedBlocks,
				template: template,
				templateLock: templateLock || false,
			} ];

			return times( number, () => block );
		} );

		return (
			<Fragment>

				<BlockControls key="controls">

					<Toolbar
						controls={
							[ 2, 3, 4 ].map( column => ( {
								icon: columnIcons[ column ],
								title: sprintf( __( '%s Columns', 'gt-blocks' ), column ),
								isActive: column === columns,
								onClick: () => setAttributes( { columns: column } ),
							} ) )
						}
					/>

				</BlockControls>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Layout Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<RangeControl
							label={ __( 'Columns', 'gt-blocks' ) }
							value={ columns }
							onChange={ ( nextColumns ) => setAttributes( { columns: nextColumns } ) }
							min={ 2 }
							max={ 6 }
						/>

					</PanelBody>

				</InspectorControls>

				<div id={ blockId } className={ className }>

					<div className={ gridClasses }>

						<InnerBlocks
							template={ getItemsTemplate( items ) }
							templateLock="all"
							allowedBlocks={ [ 'gt-blocks/column' ] }
						/>

					</div>

					{ ( isSelected || isChildBlockSelected ) && (
						<Button
							isLarge
							onClick={ this.addBlock }
							className="gt-add-grid-item"
						>
							<Dashicon icon="insert" />
							{ __( 'Add block', 'gt-blocks' ) }
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
	withInstanceId,
] )( GridEdit );
