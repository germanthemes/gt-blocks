/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks,
} = wp.editor;

/**
 * Block Edit Component
 */
class ButtonsEdit extends Component {
	render() {
		const {
			attributes,
			className,
		} = this.props;

		const {
			customClass,
			allowedBlocks,
			template,
			templateLock,
		} = attributes;

		const classes = classnames( className, {
			[ `${ customClass }` ]: customClass,
		} );

		return (
			<Fragment>

				<div className={ classes }>

					<InnerBlocks
						allowedBlocks={ allowedBlocks || undefined }
						template={ template || [ [ 'core/paragraph', {} ] ] }
						templateLock={ templateLock || false }
					/>

				</div>

			</Fragment>
		);
	}
}

export default ButtonsEdit;
