/**
 * External dependencies
 */
import classnames from 'classnames';
import { castArray, last } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { dispatch, select } = wp.data;
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

		const index = 2;

		return (
			<Fragment>

				<div className={ className }>

					<div className={ itemClasses } style={ itemStyles }>

						<InnerBlocks
							allowedBlocks={ [ 'gt-layout-blocks/heading', 'core/paragraph' ] }
							template={ [
								[ 'gt-layout-blocks/heading', {
									placeholder: __( 'Write icon title...' ),
									synchronizeStyling: true,
									parentBlock: 'gt-layout-blocks/icon-grid',
								} ],
								[ 'core/paragraph', {
									placeholder: __( 'Write icon description...' ),
									synchronizeStyling: true,
									parentBlock: 'gt-layout-blocks/icon-grid',
								} ],
							] }
							templateLock="all"
						/>

					</div>

					{ isSelected && (
						<div className="gt-grid-item-controls">
							<IconButton
								className="move-up-item"
								label={ __( 'Move up' ) }
								icon="arrow-up-alt2"
								onClick={ () => this.moveUpItem( index ) }
								disabled={ index === 0 }
							/>

							<IconButton
								className="move-down-item"
								label={ __( 'Move down' ) }
								icon="arrow-down-alt2"
								onClick={ () => this.moveDownItem( index ) }
								disabled={ ( index + 1 ) === 4 }
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

export default gtGridColumnEdit;
