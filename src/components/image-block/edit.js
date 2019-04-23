/**
 * External dependencies
 */
import classnames from 'classnames';
const {
	startCase,
	isEmpty,
	map,
	get,
} = lodash;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { withSelect } = wp.data;

const {
	Component,
	Fragment,
} = wp.element;

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

/**
 * Internal dependencies
 */
import './editor.scss';
import GtImagePlaceholder from '../../components/image-placeholder';

/* Constants */
const LINK_DESTINATION_NONE = 'none';
const LINK_DESTINATION_MEDIA = 'media';
const LINK_DESTINATION_ATTACHMENT = 'attachment';
const LINK_DESTINATION_CUSTOM = 'custom';

/**
 * Block Edit Component
 */
class ImageBlockEdit extends Component {
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
			{ value: LINK_DESTINATION_NONE, label: __( 'None', 'gt-blocks' ) },
			{ value: LINK_DESTINATION_MEDIA, label: __( 'Media File', 'gt-blocks' ) },
			{ value: LINK_DESTINATION_ATTACHMENT, label: __( 'Attachment Page', 'gt-blocks' ) },
			{ value: LINK_DESTINATION_CUSTOM, label: __( 'Custom URL', 'gt-blocks' ) },
		];
	}

	render() {
		const {
			attributes,
			setAttributes,
			isSelected,
			className,
			customClasses,
			showBlockClass,
		} = this.props;

		const {
			url,
			id,
			alt,
			size,
			maxWidth,
			href,
			linkDestination,
		} = attributes;

		const blockClasses = classnames( {
			[ className ]: showBlockClass,
			[ customClasses ]: customClasses,
			[ `gt-max-width-${ maxWidth }` ]: '100' !== maxWidth,
		} );

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
									label={ __( 'Edit image', 'gt-blocks' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Image Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-image-settings gt-panel">

						<TextareaControl
							label={ __( 'Alt Text (Alternative Text)', 'gt-blocks' ) }
							value={ alt }
							onChange={ ( newAlt ) => setAttributes( { alt: newAlt } ) }
							help={ __( 'Describe the purpose of the image. Leave empty if the image is not a key part of the content.', 'gt-blocks' ) }
						/>

						{ ! isEmpty( availableSizes ) && (
							<SelectControl
								label={ __( 'Image Size', 'gt-blocks' ) }
								value={ size }
								options={ map( availableSizes, ( tet, name ) => ( {
									value: name,
									label: startCase( name ),
								} ) ) }
								onChange={ this.updateImageSize }
							/>
						) }

						<SelectControl
							label={ __( 'Maximum Width', 'gt-blocks' ) }
							value={ maxWidth }
							onChange={ ( newWidth ) => setAttributes( { maxWidth: newWidth } ) }
							options={ [
								{ value: '100', label: __( '100%', 'gt-blocks' ) },
								{ value: '85', label: __( '85%', 'gt-blocks' ) },
								{ value: '75', label: __( '75%', 'gt-blocks' ) },
								{ value: '60', label: __( '60%', 'gt-blocks' ) },
								{ value: '50', label: __( '50%', 'gt-blocks' ) },
								{ value: '40', label: __( '40%', 'gt-blocks' ) },
								{ value: '25', label: __( '25%', 'gt-blocks' ) },
							] }
						/>

					</PanelBody>

					<PanelBody title={ __( 'Link Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-link-settings gt-panel">

						<SelectControl
							label={ __( 'Link To', 'gt-blocks' ) }
							value={ linkDestination }
							options={ this.getLinkDestinationOptions() }
							onChange={ this.onSetLinkDestination }
						/>

						{ linkDestination !== LINK_DESTINATION_NONE && (
							<TextControl
								label={ __( 'Link URL', 'gt-blocks' ) }
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
					className={ blockClasses }
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
] )( ImageBlockEdit );
