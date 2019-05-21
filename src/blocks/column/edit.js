/**
 * External dependencies
 */
const { partial } = lodash;

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
			clientId,
			rootClientId,
			lastSelectedIndex,
			onInsertBlock,
		} = this.props;

		const {
			getBlocksByClientId,
		} = select( 'core/editor' );

		const {
			selectBlock,
			updateBlockAttributes,
		} = dispatch( 'core/editor' );

		// Get current block.
		const block = getBlocksByClientId( clientId )[ 0 ];

		// Get parent block.
		const parentBlock = getBlocksByClientId( rootClientId )[ 0 ];

		// Clone block.
		const clonedBlock = cloneBlock( block );

		// Insert Block.
		onInsertBlock( clonedBlock, lastSelectedIndex + 1, rootClientId );

		// Select Parent Block.
		selectBlock( rootClientId );

		// Update number of items in parent block.
		updateBlockAttributes( rootClientId, { items: parentBlock.attributes.items + 1 } );
	}

	removeColumn() {
		const {
			clientId,
			rootClientId,
		} = this.props;

		const {
			getBlocksByClientId,
		} = select( 'core/editor' );

		const {
			removeBlocks,
			selectBlock,
			updateBlockAttributes,
		} = dispatch( 'core/editor' );

		// Get parent block.
		const parentBlock = getBlocksByClientId( rootClientId )[ 0 ];

		// Remove block.
		removeBlocks( clientId );

		// Select Parent Block.
		selectBlock( rootClientId );

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
	// eslint-disable-next-line no-shadow
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
			lastSelectedIndex: columnIndex,
			rootClientId,
		};
	} ),
	// eslint-disable-next-line no-shadow
	withDispatch( ( dispatch, { clientId, rootClientId } ) => {
		const {
			insertBlock,
			moveBlocksDown,
			moveBlocksUp,
		} = dispatch( 'core/editor' );
		return {
			onMoveDown: partial( moveBlocksDown, clientId, rootClientId ),
			onMoveUp: partial( moveBlocksUp, clientId, rootClientId ),
			onInsertBlock( block, index ) {
				insertBlock( block, index, rootClientId );
			},
		};
	} ),
] )( columnEdit );
