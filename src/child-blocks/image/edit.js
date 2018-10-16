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
	Toolbar,
} = wp.components;

const {
	withSelect,
} = wp.data;

/**
 * Internal dependencies
 */
import { default as GtImagePlaceholder } from '../../components/image-placeholder';

/**
 * Block Edit Component
 */
class ImageEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
		this.updateImageURL = this.updateImageURL.bind( this );
		this.getAvailableSizes = this.getAvailableSizes.bind( this );
	}

	onSelectImage( img ) {
		this.props.setAttributes( {
			id: img.id,
			url: img.url,
			alt: img.alt,
		} );
	}

	onRemoveImage() {
		this.props.setAttributes( {
			id: undefined,
			url: undefined,
			alt: undefined,
		} );
	}

	updateImageURL( url ) {
		this.props.setAttributes( { url: url } );
	}

	getAvailableSizes() {
		return get( this.props.image, [ 'media_details', 'sizes' ], {} );
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
		} = attributes;

		const availableSizes = this.getAvailableSizes();

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
								value={ url }
								options={ map( availableSizes, ( size, name ) => ( {
									value: size.source_url,
									label: startCase( name ),
								} ) ) }
								onChange={ this.updateImageURL }
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
