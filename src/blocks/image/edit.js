/**
 * External dependencies
 */
import {
	startCase,
	isEmpty,
	map,
	get,
} from 'lodash';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const {
	__,
} = wp.i18n;

const { compose } = wp.compose;

const {
	BlockControls,
	InspectorControls,
	MediaUpload,
} = wp.editor;

const {
	IconButton,
	PanelBody,
	SelectControl,
	TextareaControl,
	TextControl,
	Toolbar,
} = wp.components;

const {
	withSelect,
} = wp.data;

/**
 * Internal dependencies
 */
import { default as GtImagePlaceholder } from '../../components/image-placeholder';

/* Constants */
const LINK_DESTINATION_NONE = 'none';
const LINK_DESTINATION_MEDIA = 'media';
const LINK_DESTINATION_ATTACHMENT = 'attachment';
const LINK_DESTINATION_CUSTOM = 'custom';

/**
 * Block Edit Component
 */
class ImageEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
		this.updateImageSize = this.updateImageSize.bind( this );
		this.updateImageURL = this.updateImageURL.bind( this );
		this.onSetCustomHref = this.onSetCustomHref.bind( this );
		this.onSetLinkDestination = this.onSetLinkDestination.bind( this );

		this.state = {
			currentId: 0,
			currentSize: '',
		};
	}

	static getDerivedStateFromProps( nextProps ) {
		if ( nextProps.image ) {
			return {
				currentId: nextProps.attributes.id,
				currentSize: nextProps.attributes.size,
			};
		}
		return null;
	}

	componentDidUpdate( prevProps, prevState ) {
		const { id, size } = this.props.attributes;
		const { currentId, currentSize } = prevState;

		// Update image url if new image size was chosen.
		if ( size !== prevProps.attributes.size ) {
			this.updateImageURL( size );
		}

		// Update image size if new image was uploaded or selected from media library.
		if ( this.props.image && currentId && id !== currentId ) {
			this.updateImageSize( currentSize );
		}
	}

	onSelectImage( img ) {
		this.props.setAttributes( {
			id: img.id,
			url: img.url,
			alt: img.alt,
			size: 'full',
		} );
	}

	onRemoveImage() {
		this.props.setAttributes( {
			id: undefined,
			url: undefined,
			alt: undefined,
			size: 'full',
		} );
	}

	updateImageSize( size ) {
		this.props.setAttributes( { size: size } );
	}

	updateImageURL( size ) {
		const availableSizes = this.getAvailableSizes();

		// Return early if image sizes are not available yet.
		if ( isEmpty( availableSizes ) ) {
			return;
		}

		// Check if image size exists.
		if ( availableSizes.hasOwnProperty( size ) ) {
			this.props.setAttributes( { url: availableSizes[ size ].source_url } );
		} else {
			this.props.setAttributes( {
				url: availableSizes.full.source_url,
				size: 'full',
			} );
		}
	}

	onSetLinkDestination( value ) {
		let href;

		if ( value === LINK_DESTINATION_NONE ) {
			href = undefined;
		} else if ( value === LINK_DESTINATION_MEDIA ) {
			href = this.props.attributes.url;
		} else if ( value === LINK_DESTINATION_ATTACHMENT ) {
			href = this.props.image && this.props.image.link;
		} else {
			href = this.props.attributes.href;
		}

		this.props.setAttributes( {
			linkDestination: value,
			href,
		} );
	}

	onSetCustomHref( value ) {
		this.props.setAttributes( { href: value } );
	}

	getAvailableSizes() {
		return get( this.props.image, [ 'media_details', 'sizes' ], {} );
	}

	getLinkDestinationOptions() {
		return [
			{ value: LINK_DESTINATION_NONE, label: __( 'None' ) },
			{ value: LINK_DESTINATION_MEDIA, label: __( 'Media File' ) },
			{ value: LINK_DESTINATION_ATTACHMENT, label: __( 'Attachment Page' ) },
			{ value: LINK_DESTINATION_CUSTOM, label: __( 'Custom URL' ) },
		];
	}

	render() {
		const {
			attributes,
			setAttributes,
			isSelected,
			className,
		} = this.props;

		const {
			url,
			id,
			alt,
			size,
			href,
			linkDestination,
		} = attributes;

		const availableSizes = this.getAvailableSizes();
		const isLinkURLInputDisabled = linkDestination !== LINK_DESTINATION_CUSTOM;

		return (
			<Fragment>
				<BlockControls>

					<Toolbar className="components-toolbar">
						<MediaUpload
							onSelect={ this.onSelectImage }
							type="image"
							value={ id }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Edit image' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Image Settings' ) } initialOpen={ false } className="gt-panel-image-settings gt-panel">

						<TextareaControl
							label={ __( 'Alt Text (Alternative Text)' ) }
							value={ alt }
							onChange={ ( newAlt ) => setAttributes( { alt: newAlt } ) }
							help={ __( 'Describe the purpose of the image. Leave empty if the image is not a key part of the content.' ) }
						/>

						{ ! isEmpty( availableSizes ) && (
							<SelectControl
								label={ __( 'Image Size' ) }
								value={ size }
								options={ map( availableSizes, ( tet, name ) => ( {
									value: name,
									label: startCase( name ),
								} ) ) }
								onChange={ this.updateImageSize }
							/>
						) }

					</PanelBody>

					<PanelBody title={ __( 'Link Settings' ) } initialOpen={ false } className="gt-panel-link-settings gt-panel">

						<SelectControl
							label={ __( 'Link To' ) }
							value={ linkDestination }
							options={ this.getLinkDestinationOptions() }
							onChange={ this.onSetLinkDestination }
						/>

						{ linkDestination !== LINK_DESTINATION_NONE && (
							<TextControl
								label={ __( 'Link URL' ) }
								value={ href || '' }
								onChange={ this.onSetCustomHref }
								placeholder={ ! isLinkURLInputDisabled ? 'https://' : undefined }
								disabled={ isLinkURLInputDisabled }
							/>
						) }

					</PanelBody>

				</InspectorControls>

				<GtImagePlaceholder
					imgID={ id }
					imgURL={ url }
					imgAlt={ alt }
					onSelect={ ( img ) => this.onSelectImage( img ) }
					onRemove={ () => this.onRemoveImage() }
					isSelected={ isSelected }
					className={ className }
				/>

			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props.attributes;

		return {
			image: id ? getMedia( id ) : null,
		};
	} ),
] )( ImageEdit );
