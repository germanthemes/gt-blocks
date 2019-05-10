/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { withSelect } = wp.data;
const { Component } = wp.element;
const { InnerBlocks } = wp.editor;

/**
 * Internal dependencies
 */
import { default as ContentContainerEdit } from '../../components/content-container/edit';

/**
 * Block Edit Component
 */
class contentEdit extends Component {
	render() {
		const {
			attributes,
			className,
			isSelected,
			isParentBlockSelected,
			isChildBlockSelected,
		} = this.props;

		const {
			allowedBlocks,
			template,
			templateLock,
		} = attributes;

		const showBlockInserter = isSelected || isParentBlockSelected || isChildBlockSelected;

		return (
			<div className={ className }>

				<ContentContainerEdit showInserter={ showBlockInserter } { ...this.props }>
					<InnerBlocks
						template={ template || undefined }
						templateLock={ templateLock || false }
						{ ...( allowedBlocks && { allowedBlocks } ) }
					/>
				</ContentContainerEdit>

			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const {
			getBlockRootClientId,
			isBlockSelected,
			hasSelectedInnerBlock,
		} = select( 'core/editor' );

		const rootClientId = getBlockRootClientId( clientId );

		return {
			isParentBlockSelected: isBlockSelected( rootClientId ),
			isChildBlockSelected: hasSelectedInnerBlock( rootClientId, true ),
		};
	} ),
] )( contentEdit );
