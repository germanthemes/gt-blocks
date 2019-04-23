/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const {
	AlignmentToolbar,
	BlockControls,
} = wp.editor;

/**
 * Internal dependencies
 */
import ImageBlockEdit from '../../components/image-block/edit';

/**
 * Block Edit Component
 */
class ImageEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
		} = this.props;

		const {
			className,
			textAlignment,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `gt-align-${ textAlignment }` ]: textAlignment,
		} );

		return (
			<Fragment>

				<BlockControls>

					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
					/>

				</BlockControls>

				<ImageBlockEdit
					blockClass={ blockClasses }
					{ ...this.props }
				/>

			</Fragment>
		);
	}
}

export default ImageEdit;
