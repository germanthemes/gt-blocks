/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const { InnerBlocks } = wp.editor;

/**
 * Internal dependencies
 */
import './style.scss';

class GridContainer extends Component {
	render() {
		const {
			columns,
			columnGap,
		} = this.props.attributes;

		const gridClasses = classnames( 'gt-grid-container', {
			[ `gt-columns-${ columns }` ]: columns,
			[ `gt-${ columnGap }-column-gap` ]: 'normal' !== columnGap,
		} );

		return (
			<div className={ gridClasses }>

				<InnerBlocks.Content />

			</div>
		);
	}
}

export default GridContainer;
