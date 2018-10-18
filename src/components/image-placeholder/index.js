/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const { __ } = wp.i18n;
const { MediaPlaceholder, MediaUpload } = wp.editor;
const { Button, IconButton } = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

class GtImagePlaceholder extends Component {
	render() {
		const {
			imgID,
			imgURL,
			imgAlt,
			onSelect,
			onRemove,
			isSelected,
			className,
		} = this.props;

		const figure = (
			<figure className={ className }>
				<img
					src={ imgURL }
					alt={ imgAlt }
					data-img-id={ imgID }
				/>
			</figure>
		);

		return (
			<div className="gt-image-placeholder-wrapper">

				{ ! imgID ? (

					<MediaPlaceholder
						icon="format-image"
						className="gt-image-placeholder"
						labels={ {
							title: __( 'Image' ),
							name: __( 'an image' ),
						} }
						onSelect={ onSelect }
						accept="image/*"
						type="image"
					/>

				) : (

					<Fragment>

						{ isSelected ? (

							<div className="gt-image-editor">

								<MediaUpload
									onSelect={ onSelect }
									type="image"
									value={ imgID }
									render={ ( { open } ) => (
										<Button onClick={ open } className="gt-replace-image">
											{ figure }
										</Button>
									) }
								/>

								<IconButton
									className="gt-remove-image"
									label={ __( 'Remove Image' ) }
									icon="no-alt"
									onClick={ onRemove }
								/>

							</div>

						) : (

							figure

						) }

					</Fragment>

				) }

			</div>
		);
	}
}

export default GtImagePlaceholder;
