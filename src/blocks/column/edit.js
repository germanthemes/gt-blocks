/**
 * External dependencies
 */
const { partial, castArray, last } = lodash;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { dispatch, select, withDispatch, withSelect } = wp.data;
const { Component } = wp.element;
const { InnerBlocks } = wp.editor;

const {
	IconButton,
} = wp.components;

const {
	cloneBlock,
} = wp.blocks;

/**
 * Internal dependencies
 */
import { default as ContentContainerEdit } from '../../components/content-container/edit';

/**
 * Block Edit Component
 */
class columnEdit extends Component {
	duplicateColumn() {
		const {
			getBlocksByClientId,
			getBlockIndex,
			getBlockRootClientId,
		} = select( 'core/editor' );

		const {
			insertBlocks,
			updateBlockAttributes,
		} = dispatch( 'core/editor' );

		// Get current block.
		const { clientId } = this.props;
		const block = getBlocksByClientId( clientId )[ 0 ];

		// Get parent block.
		const rootClientId = getBlockRootClientId( clientId );
		const parentBlock = getBlocksByClientId( rootClientId )[ 0 ];

		// Get position to insert duplicated block.
		const lastSelectedIndex = getBlockIndex( last( castArray( clientId ) ), rootClientId );

		// Clone and insert block.
		const clonedBlock = cloneBlock( block );
		insertBlocks( clonedBlock, lastSelectedIndex + 1, rootClientId );

		// Update number of items in parent block.
		updateBlockAttributes( rootClientId, { items: parentBlock.attributes.items + 1 } );
	}

	removeColumn() {
		const {
			getBlocksByClientId,
			getBlockRootClientId,
		} = select( 'core/editor' );

		const {
			removeBlocks,
			updateBlockAttributes,
		} = dispatch( 'core/editor' );

		// Get parent block.
		const rootClientId = getBlockRootClientId( this.props.clientId );
		const parentBlock = getBlocksByClientId( rootClientId )[ 0 ];

		// Remove block.
		removeBlocks( this.props.clientId );

		// Update number of items in parent block.
		updateBlockAttributes( rootClientId, { items: parentBlock.attributes.items - 1 } );
	}

	render() {
		const {
			attributes,
			className,
			isSelected,
			isParentBlockSelected,
			isChildBlockSelected,
			onMoveUp,
			onMoveDown,
			isFirstColumn,
			isLastColumn,
		} = this.props;

		const {
			allowedBlocks,
			template,
			templateLock,
		} = attributes;

		const showColumnControls = isSelected || isParentBlockSelected || isChildBlockSelected;

		return (
			<div className={ className }>

				<ContentContainerEdit showInserter={ showColumnControls } { ...this.props }>
					<InnerBlocks
						template={ template || undefined }
						templateLock={ templateLock || false }
						{ ...( allowedBlocks && { allowedBlocks } ) }
					/>
				</ContentContainerEdit>

				{ showColumnControls && (
					<div className="gt-column-controls">

						<IconButton
							className="move-up-column"
							label={ __( 'Move up', 'gt-blocks' ) }
							icon="arrow-left-alt2"
							onClick={ isFirstColumn ? null : onMoveUp }
							disabled={ isFirstColumn }
						/>

						<IconButton
							className="move-down-column"
							label={ __( 'Move down', 'gt-blocks' ) }
							icon="arrow-right-alt2"
							onClick={ isLastColumn ? null : onMoveDown }
							disabled={ isLastColumn }
						/>

						<IconButton
							className="duplicate-column"
							label={ __( 'Duplicate', 'gt-blocks' ) }
							icon="admin-page"
							onClick={ () => this.duplicateColumn() }
						/>

						<IconButton
							className="remove-column"
							label={ __( 'Remove', 'gt-blocks' ) }
							icon="trash"
							onClick={ () => this.removeColumn() }
						/>
					</div>
				) }

			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const {
			getBlockCount,
			getBlockIndex,
			getBlockRootClientId,
			isBlockSelected,
			hasSelectedInnerBlock,
		} = select( 'core/editor' );

		const rootClientId = getBlockRootClientId( clientId );
		const columnIndex = getBlockIndex( clientId, rootClientId );
		const columnCount = getBlockCount( rootClientId );

		return {
			isParentBlockSelected: isBlockSelected( rootClientId ),
			isChildBlockSelected: hasSelectedInnerBlock( rootClientId, true ),
			isFirstColumn: 0 === columnIndex,
			isLastColumn: columnCount === ( columnIndex + 1 ),
			rootClientId,
		};
	} ),
	withDispatch( ( dispatch, { clientId, rootClientId } ) => {
		const { moveBlocksDown, moveBlocksUp } = dispatch( 'core/editor' );
		return {
			onMoveDown: partial( moveBlocksDown, clientId, rootClientId ),
			onMoveUp: partial( moveBlocksUp, clientId, rootClientId ),
		};
	} ),
] )( columnEdit );
