/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * Internal dependencies
 */
import { default as GridEdit } from '../../components/grid-container/edit';

// Define blocks for each column.
const TEMPLATE = [
	[ 'gt-blocks/image', {} ],
	[ 'gt-blocks/heading', {
		placeholder: __( 'Project', 'gt-blocks' ),
	} ],
	[ 'core/paragraph', {
		placeholder: __( 'Write project description...', 'gt-blocks' ),
	} ],
];

/**
 * Block Edit Component
 */
class PortfolioEdit extends Component {
	render() {
		return (
			<GridEdit
				template={ TEMPLATE }
				{ ...this.props }
			/>
		);
	}
}

export default PortfolioEdit;
