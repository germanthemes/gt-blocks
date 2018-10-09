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
		} );

		const gridStyles = {
			gridGap: 32 !== columnGap ? ( columnGap / 16 ).toFixed( 2 ) + 'rem' : undefined,
		};

		return (
			<div className={ gridClasses } style={ gridStyles }>

				<InnerBlocks.Content />

			</div>
		);
	}
}

export default GridContainer;
