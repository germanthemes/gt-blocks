/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal block libraries
 */
const { Component } = wp.element;
const { __ } = wp.i18n;
const { compose } = wp.compose;

const {
	MediaUpload,
} = wp.editor;

const {
	Button,
	IconButton,
	Placeholder,
} = wp.components;

const {
	withSelect,
} = wp.data;

class PortfolioImage extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			currentImage: 0,
		};
	}

	static getDerivedStateFromProps( nextProps ) {
		if ( nextProps.image ) {
			return { currentImage: nextProps.imgID };
		}
		return null;
	}

	componentDidUpdate( prevProps, prevState ) {
		const { imgID, addSize } = this.props;

		if ( this.props.image && imgID !== prevState.currentImage ) {
			const sizeObj = get( this.props.image, [ 'media_details', 'sizes' ], {} );
			addSize( imgID, sizeObj );
		}
	}

	render() {
		const { imgID, imgURL, imgAlt, onSelect, onRemove, isSelected } = this.props;

		return (
			<div className="gt-image">

				{ ! imgID ? (

					<Placeholder
						className="gt-image-placeholder"
						instructions={ __( 'Drag image here or add from media library' ) }
						icon="format-image"
						label={ __( 'Image' ) } >

						<MediaUpload
							onSelect={ onSelect }
							type="image"
							render={ ( { open } ) => (
								<Button isLarge onClick={ open }>
									{ __( 'Add from Media Library' ) }
								</Button>
							) }
						/>
					</Placeholder>

				) : (

					<div className="gt-image-wrapper">

						{ isSelected ? (

							<div className="gt-edit-image">

								<MediaUpload
									onSelect={ onSelect }
									type="image"
									value={ imgID }
									render={ ( { open } ) => (
										<Button onClick={ open } className="gt-image-button">
											<img
												src={ imgURL }
												alt={ imgAlt }
												data-img-id={ imgID }
											/>
										</Button>
									) }
								/>

								<IconButton
									className="remove-image"
									label={ __( 'Remove Image' ) }
									icon="no-alt"
									onClick={ onRemove }
								/>

							</div>

						) : (

							<img
								src={ imgURL }
								alt={ imgAlt }
								data-img-id={ imgID }
							/>

						) }

					</div>

				) }

			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, { imgID } ) => {
		const { getMedia } = select( 'core' );
		return {
			image: imgID ? getMedia( imgID ) : null,
		};
	} ),
] )( PortfolioImage );
