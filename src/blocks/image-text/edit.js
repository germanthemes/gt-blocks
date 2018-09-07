/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	startCase,
	isEmpty,
	map,
	get,
	range,
} from 'lodash';
const { getComputedStyle } = window;

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const {
	__,
	sprintf,
} = wp.i18n;

const { compose } = wp.compose;

const {
	AlignmentToolbar,
	BlockControls,
	ContrastChecker,
	InspectorControls,
	MediaUpload,
	PanelColorSettings,
	RichText,
	withColors,
	withFontSizes,
} = wp.editor;

const {
	Button,
	FontSizePicker,
	IconButton,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	Toolbar,
	Tooltip,
	withFallbackStyles,
} = wp.components;

const {
	withSelect,
} = wp.data;

/**
 * Internal dependencies
 */
import { default as GtImagePlaceholder } from '../../components/image-placeholder';
import {
	gtVerticalAlignTopIcon,
	gtVerticalAlignCenterIcon,
	gtVerticalAlignBottomIcon,
	gtImagePositionIcon,
} from './icons';

const blockAlignmentControls = {
	center: {
		icon: 'align-center',
		title: __( 'Align center' ),
	},
	wide: {
		icon: 'align-wide',
		title: __( 'Wide width' ),
	},
	full: {
		icon: 'align-full-width',
		title: __( 'Full width' ),
	},
};

/* Set Fallback Styles */
const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor, fontSize, customFontSize } = ownProps.attributes;
	const editableNode = node.querySelector( '[contenteditable="true"]' );
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		fallbackFontSize: fontSize || customFontSize || ! computedStyles ? undefined : parseInt( computedStyles.fontSize ) || undefined,
	};
} );

/**
 * Block Edit Component
 */
class gtImageTextEdit extends Component {
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
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			fontSize,
			setFontSize,
			fallbackFontSize,
			fontSizes,
			setAttributes,
			isSelected,
			className,
		} = this.props;

		const {
			imgURL,
			imgID,
			imgAlt,
			title,
			titleTag,
			text,
			columnSize,
			imagePosition,
			blockAlignment,
			textAlignment,
			verticalAlignment,
			spacing,
		} = attributes;

		const availableSizes = this.getAvailableSizes();

		const blockClasses = classnames( className, {
			[ `${ columnSize }` ]: columnSize,
			[ `gt-vertical-align-${ verticalAlignment }` ]: ( verticalAlignment !== 'top' ),
			'gt-image-position-right': imagePosition,
			'gt-has-spacing': spacing,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			[ fontSize.class ]: fontSize.class,
		} );

		const styles = {
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
			color: textColor.class ? undefined : textColor.color,
			textAlign: textAlignment,
		};

		const verticalAlignmentControls = {
			top: {
				icon: gtVerticalAlignTopIcon,
				title: __( 'Top' ),
			},
			center: {
				icon: gtVerticalAlignCenterIcon,
				title: __( 'Center' ),
			},
			bottom: {
				icon: gtVerticalAlignBottomIcon,
				title: __( 'Bottom' ),
			},
		};

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

						<Tooltip text={ __( 'Flip Image Position' ) }>
							<Button
								className={ classnames(
									'components-icon-button',
									'components-toolbar__control',
									'gt-image-position-toolbar-icon',
									{ 'is-active': imagePosition },
								) }
								onClick={ () => setAttributes( { imagePosition: ! imagePosition } ) }
							>
								{ gtImagePositionIcon }
							</Button>
						</Tooltip>
					</Toolbar>

					<AlignmentToolbar
						value={ textAlignment }
						onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
					/>

					<Toolbar
						controls={
							range( 1, 5 ).map( ( level ) => ( {
								icon: 'heading',
								title: sprintf( __( 'Heading %s' ), level ),
								isActive: level === titleTag,
								onClick: () => setAttributes( { titleTag: level } ),
								subscript: level,
							} ) )
						}
					/>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Column Size' ) }
							value={ columnSize }
							onChange={ ( newSize ) => setAttributes( { columnSize: newSize } ) }
							options={ [
								{ value: 'gt-column-25', label: __( '25%' ) },
								{ value: 'gt-column-33', label: __( '33%' ) },
								{ value: 'gt-column-40', label: __( '40%' ) },
								{ value: 'gt-column-50', label: __( '50%' ) },
								{ value: 'gt-column-66', label: __( '66%' ) },
							] }
						/>

						<SelectControl
							label={ __( 'Image Position' ) }
							value={ imagePosition }
							onChange={ () => setAttributes( { imagePosition: ! imagePosition } ) }
							options={ [
								{ value: false, label: __( 'Left' ) },
								{ value: true, label: __( 'Right' ) },
							] }
						/>

						<p><label htmlFor="gt-block-alignment" className="blocks-base-control__label">
							{ __( 'Block Alignment' ) }
						</label></p>
						<Toolbar
							controls={
								[ 'center', 'wide', 'full' ].map( control => {
									return {
										...blockAlignmentControls[ control ],
										isActive: blockAlignment === control,
										onClick: () => setAttributes( { blockAlignment: control } ),
									};
								} )
							}
						/>

						<ToggleControl
							label={ __( 'Add bottom spacing?' ) }
							checked={ !! spacing }
							onChange={ () => setAttributes( { spacing: ! spacing } ) }
						/>

					</PanelBody>

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

					<PanelBody title={ __( 'Text Settings' ) } initialOpen={ false } className="gt-panel-text-settings gt-panel">

						<p><label htmlFor="gt-title-tag" className="blocks-base-control__label">
							{ __( 'Heading' ) }
						</label></p>
						<Toolbar
							controls={
								range( 1, 7 ).map( ( level ) => ( {
									icon: 'heading',
									title: sprintf( __( 'Heading %s' ), level ),
									isActive: level === titleTag,
									onClick: () => setAttributes( { titleTag: level } ),
									subscript: level,
								} ) )
							}
						/>

						<p><label htmlFor="gt-font-size" className="blocks-base-control__label">
							{ __( 'Font Size' ) }
						</label></p>
						<FontSizePicker
							fontSizes={ fontSizes }
							fallbackFontSize={ fallbackFontSize }
							value={ fontSize.size }
							onChange={ setFontSize }
						/>

						<p><label htmlFor="gt-vertical-alignment" className="blocks-base-control__label">
							{ __( 'Vertical Alignment' ) }
						</label></p>
						<Toolbar
							className="gt-vertical-align-control"
							controls={
								[ 'top', 'center', 'bottom' ].map( control => {
									return {
										...verticalAlignmentControls[ control ],
										isActive: verticalAlignment === control,
										onClick: () => setAttributes( { verticalAlignment: control } ),
									};
								} )
							}
						/>

					</PanelBody>

					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color' ),
							},
						] }
					>

						<ContrastChecker
							{ ...{
								textColor: textColor.color,
								backgroundColor: backgroundColor.color,
								fallbackTextColor,
								fallbackBackgroundColor,
							} }
							fontSize={ fontSize.size }
						/>
					</PanelColorSettings>

				</InspectorControls>

				<div className={ blockClasses }>

					<div className="gt-image">

						<GtImagePlaceholder
							imgID={ imgID }
							imgURL={ imgURL }
							imgAlt={ imgAlt }
							onSelect={ ( img ) => this.onSelectImage( img ) }
							onRemove={ () => this.onRemoveImage() }
							isSelected={ isSelected }
						/>

					</div>

					<div className="gt-content" style={ styles }>

						<div className="gt-inner-content">

							<RichText
								tagName={ 'h' + titleTag }
								placeholder={ __( 'Enter a title' ) }
								value={ title }
								className="gt-title"
								style={ styles }
								onChange={ ( newTitle ) => setAttributes( { title: newTitle } ) }
								keepPlaceholderOnFocus
							/>

							<RichText
								tagName="div"
								multiline="p"
								placeholder={ __( 'Enter your text here.' ) }
								value={ text }
								className="gt-text"
								style={ { fontSize: fontSize.size ? fontSize.size + 'px' : undefined } }
								onChange={ ( newText ) => setAttributes( { text: newText } ) }
								keepPlaceholderOnFocus
							/>

						</div>

					</div>

				</div>

			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	withFontSizes( 'fontSize' ),
	applyFallbackStyles,
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { imgID } = props.attributes;
		const { fontSizes } = select( 'core/editor' ).getEditorSettings();

		return {
			image: imgID ? getMedia( imgID ) : null,
			fontSizes,
		};
	} ),
] )( gtImageTextEdit );
