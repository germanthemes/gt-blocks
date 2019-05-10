/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const { getColorClassName } = wp.editor;

/**
 * Internal dependencies
 */
import './style.scss';

class ContentContainer extends Component {
	render() {
		const {
			attributes,
			children,
		} = this.props;

		const {
			contentClass,
			padding,
			removeFirstBlockPadding,
			textColor,
			backgroundColor,
			customTextColor,
			customBackgroundColor,
		} = attributes;

		const textColorClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const contentClasses = classnames( contentClass, {
			[ `gt-padding gt-${ padding }-padding` ]: 'default' !== padding,
			'gt-remove-first-block-padding': removeFirstBlockPadding,
			'has-text-color': textColor || customTextColor,
			[ textColorClass ]: textColorClass,
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ]: backgroundClass,
		} );

		const contentStyles = {
			color: textColorClass ? undefined : customTextColor,
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
		};

		return (
			<div className={ contentClasses } style={ contentStyles }>

				{ children }

			</div>
		);
	}
}

export default ContentContainer;
