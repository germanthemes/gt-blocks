/**
 * External dependencies
 */
import classnames from 'classnames';
import { partial, castArray, last } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { dispatch, select, withDispatch, withSelect } = wp.data;
const {
	Component,
	Fragment,
} = wp.element;

const {
	getColorClassName,
	InnerBlocks,
} = wp.editor;

const {
	IconButton,
} = wp.components;

const {
	cloneBlock,
} = wp.blocks;

/**
 * Block Edit Component
 */
class gtGridColumnEdit extends Component {
	duplicateItem() {
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

	removeItem() {
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
			textColor,
			backgroundColor,
			customTextColor,
			customBackgroundColor,
		} = attributes;

		const textColorClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const itemClasses = classnames( 'gt-grid-item', {
			'has-text-color': textColor || customTextColor,
			[ textColorClass ]: textColorClass,
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ]: backgroundClass,
		} );

		const itemStyles = {
			color: textColorClass ? undefined : customTextColor,
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
		};

		return (
			<Fragment>

				<div className={ className }>

					<div className={ itemClasses } style={ itemStyles }>

						<InnerBlocks
							allowedBlocks={ [ 'gt-layout-blocks/heading', 'core/paragraph' ] }
							template={ [
								[ 'gt-layout-blocks/icon', {
									synchronizeStyling: true,
									parentBlock: 'gt-layout-blocks/icon-grid',
								} ],
								[ 'gt-layout-blocks/heading', {
									placeholder: __( 'Feature' ),
									synchronizeStyling: true,
									parentBlock: 'gt-layout-blocks/icon-grid',
								} ],
								[ 'core/paragraph', {
									placeholder: __( 'Write feature description...' ),
									synchronizeStyling: true,
									parentBlock: 'gt-layout-blocks/icon-grid',
								} ],
							] }
							templateLock="all"
						/>

					</div>

					{ ( isSelected || isParentBlockSelected || isChildBlockSelected ) && (
						<div className="gt-grid-item-controls">

							<IconButton
								className="move-up-item"
								label={ __( 'Move up' ) }
								icon="arrow-left-alt2"
								onClick={ isFirstColumn ? null : onMoveUp }
								disabled={ isFirstColumn }
							/>

							<IconButton
								className="move-down-item"
								label={ __( 'Move down' ) }
								icon="arrow-right-alt2"
								onClick={ isLastColumn ? null : onMoveDown }
								disabled={ isLastColumn }
							/>

							<IconButton
								className="duplicate-item"
								label={ __( 'Duplicate' ) }
								icon="admin-page"
								onClick={ () => this.duplicateItem() }
							/>

							<IconButton
								className="remove-item"
								label={ __( 'Remove' ) }
								icon="trash"
								onClick={ () => this.removeItem() }
							/>
						</div>
					) }

				</div>

			</Fragment>
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
] )( gtGridColumnEdit );