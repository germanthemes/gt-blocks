/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;

const {
	getColorClassName,
	InnerBlocks,
} = wp.editor;

/**
 * Block Edit Component
 */
class gtGridColumnEdit extends Component {
	render() {
		const {
			attributes,
			className,
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
								[ 'gt-layout-blocks/heading', {
									placeholder: __( 'Write icon title...' ),
								} ],
								[ 'core/paragraph', {
									placeholder: __( 'Write icon description...' ),
								} ],
							] }
							templateLock="all"
						/>

					</div>

				</div>

			</Fragment>
		);
	}
}

export default gtGridColumnEdit;
