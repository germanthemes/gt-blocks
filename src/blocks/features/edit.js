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
	[ 'gt-blocks/icon', {} ],
	[ 'gt-blocks/heading', {
		placeholder: __( 'Feature', 'gt-blocks' ),
	} ],
	[ 'core/paragraph', {
		placeholder: __( 'Write feature description...', 'gt-blocks' ),
	} ],
];

/**
 * Block Edit Component
 */
class FeaturesEdit extends Component {
	render() {
		return (
			<GridEdit
				template={ TEMPLATE }
				{ ...this.props }
			/>
		);
	}
}

export default FeaturesEdit;
