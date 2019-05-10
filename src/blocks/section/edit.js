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
import BackgroundEdit from '../../components/background-section/edit';

/**
 * Block Edit Component
 */
class sectionEdit extends Component {
	render() {
		const {
			isSelected,
			isChildBlockSelected,
		} = this.props;

		const showBlockInserter = isSelected || isChildBlockSelected;

		return (
			<BackgroundEdit showInserter={ showBlockInserter } { ...this.props }>
				<InnerBlocks />
			</BackgroundEdit>
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
] )( sectionEdit );
