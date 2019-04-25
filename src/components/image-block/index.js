/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;

/**
 * Internal dependencies
 */
import './style.scss';

class ImageBlock extends Component {
	render() {
		const {
			attributes,
			className,
			customClasses,
			showBlockClass,
		} = this.props;

		const {
			id,
			url,
			alt,
			maxWidth,
			href,
		} = attributes;

		const blockClasses = classnames( {
			[ className ]: showBlockClass,
			[ customClasses ]: customClasses,
			[ `gt-max-width-${ maxWidth }` ]: '100' !== maxWidth,
		} );

		const image = (
			<img
				src={ url }
				alt={ alt }
				className={ id ? `wp-image-${ id }` : null }
			/>
		);

		const figure = (
			<Fragment>
				{ href ? <a href={ href }>{ image }</a> : image }
			</Fragment>
		);

		return (
			<figure className={ blockClasses ? blockClasses : undefined }>
				{ figure }
			</figure>
		);
	}
}

export default ImageBlock;
