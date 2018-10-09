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
			imgID: img.id,
			imgURL: img.url,
			imgAlt: img.alt,
		} );
	}

	onRemoveImage() {
		this.props.setAttributes( {
			imgID: undefined,
			imgURL: undefined,
			imgAlt: undefined,
		} );
	}

	updateImageURL( url ) {
		this.props.setAttributes( { imgURL: url } );
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
			imgURL,
			imgID,
			imgAlt,
		} = attributes;

		const availableSizes = this.getAvailableSizes();

		return (
			<Fragment>
				<BlockControls>

					<Toolbar className="components-toolbar">
						<MediaUpload
							onSelect={ this.onSelectImage }
							type="image"
							value={ imgID }
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

						{ ! isEmpty( availableSizes ) && (
							<SelectControl
								label={ __( 'Size' ) }
								value={ imgURL }
								options={ map( availableSizes, ( size, name ) => ( {
									value: size.source_url,
									label: startCase( name ),
								} ) ) }
								onChange={ this.updateImageURL }
							/>
						) }

						<TextControl
							label={ __( 'Textual Alternative' ) }
							value={ imgAlt }
							onChange={ ( newAlt ) => setAttributes( { imgAlt: newAlt } ) }
							help={ __( 'Describe the purpose of the image. Leave empty if the image is not a key part of the content.' ) }
						/>

					</PanelBody>

				</InspectorControls>

				<div className={ className }>

					<GtImagePlaceholder
						imgID={ imgID }
						imgURL={ imgURL }
						imgAlt={ imgAlt }
						onSelect={ ( img ) => this.onSelectImage( img ) }
						onRemove={ () => this.onRemoveImage() }
						isSelected={ isSelected }
					/>

				</div>

			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { imgID } = props.attributes;
		const { fontSizes } = select( 'core/editor' ).getEditorSettings();

		return {
			image: imgID ? getMedia( imgID ) : null,
			fontSizes,
		};
	} ),
] )( ImageEdit );
