/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { Component } = wp.element;
const { __, sprintf } = wp.i18n;
const {
    AlignmentToolbar,
    BlockControls,
    ColorPalette,
    ImagePlaceholder,
    InspectorControls,
    MediaUpload,
    registerBlockType,
    RichText,
} = wp.blocks;

const {
    Button,
    DropZone,
    FormFileUpload,
    IconButton,
    PanelBody,
    PanelColor,
    Placeholder,
    SelectControl,
    ToggleControl,
    Toolbar,
} = wp.components;

const {
    mediaUpload,
} = wp.utils;


const columnSizes = [
    { value: 'block-column-25', label: __( '25%' ) },
    { value: 'block-column-33', label: __( '33%' ) },
    { value: 'block-column-40', label: __( '40%' ) },
    { value: 'block-column-50', label: __( '50%' ) },
    { value: 'block-column-66', label: __( '66%' ) },
];

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

class gtImageTextBlock extends Component {
    constructor() {
        super( ...arguments );

        this.onSelectImage       = this.onSelectImage.bind( this );
        this.onRemoveImage       = this.onRemoveImage.bind( this );
        this.setImage            = this.setImage.bind( this );
        this.uploadFromFiles     = this.uploadFromFiles.bind( this );
        this.onFilesDrop         = this.onFilesDrop.bind( this );
        this.onHTMLDrop          = this.onHTMLDrop.bind( this );
        this.onSetActiveEditable = this.onSetActiveEditable.bind( this );
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
            imgID: null,
            imgURL: null,
            imgAlt: null,
        } );
    }

    setImage( [ image ] ) {
        this.onSelectImage( image )
    };

    uploadFromFiles( event ) {
        mediaUpload( event.target.files, this.setImage );
    }

    onFilesDrop( files ) {
        mediaUpload( files, this.setImage );
    }

    onHTMLDrop( HTML ) {
        this.setImage( map(
            rawHandler( { HTML, mode: 'BLOCKS' } )
                .filter( ( { name } ) => name === 'core/image' ),
            'attributes'
        ) );
    }

    onSetActiveEditable( newEditable ) {
        this.props.setAttributes( { editable: newEditable  } );
    }

    setBlockAlignment( align ) {
        const newBlockAlignment = this.props.attributes.blockAlignment === align ? undefined : align;
        this.props.setAttributes( { blockAlignment: newBlockAlignment  } );
    }

    render() {
        const { attributes, setAttributes, isSelected, className } = this.props;

        const classNames= classnames( className, {
            [ `${ attributes.columnSize }` ]: attributes.columnSize,
            'has-background': attributes.backgroundColor,
            'gt-vertical-centered': attributes.verticalAlignment,
            'gt-image-position-right': attributes.imagePosition,
            'gt-has-spacing': attributes.spacing,
        } );

        const styles = {
            backgroundColor: attributes.backgroundColor,
            color: attributes.textColor,
            textAlign: attributes.textAlignment,
        };

        return [
            isSelected && (
                <BlockControls key="controls">

                    <AlignmentToolbar
                        value={ attributes.textAlignment }
                        onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
                    />

                    <Toolbar
                        controls={
                        '234'.split( '' ).map( ( level ) => ( {
                            icon: 'heading',
                            title: sprintf( __( 'Heading %s' ), level ),
                            isActive: 'H' + level === attributes.titleTag,
                            onClick: () => setAttributes( { titleTag: 'H' + level } ),
                            subscript: level,
                        } ) )
                        }
                    />

                </BlockControls>
            ),
            isSelected && (
                <InspectorControls key="inspector">

                    <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ true }>

                        <SelectControl
                            label={ __( 'Image Size' ) }
                            value={ attributes.columnSize }
                            onChange={ ( newSize ) => setAttributes( { columnSize: newSize } ) }
                            options={ columnSizes }
                        />

                        <SelectControl
                            label={ __( 'Image Position' ) }
                            value={ attributes.imagePosition }
                            onChange={ () => setAttributes( { imagePosition: ! attributes.imagePosition } ) }
                            options={ [
                                { value: false, label: __( 'Left' ) },
                                { value: true, label: __( 'Right' ) }
                            ] }
                        />

                        <label className="blocks-base-control__label">{ __( 'Block Alignment' ) }</label>
                        <Toolbar
                            controls={
                                [ 'center', 'wide', 'full' ].map( control => {
                                    return {
                                        ...blockAlignmentControls[ control ],
                                        isActive: attributes.blockAlignment === control,
                                        onClick: () => setAttributes( { blockAlignment: control } ),
                                    };
                                } )
                            }
                        />

                        <ToggleControl
                            label={ __( 'Add bottom spacing?' ) }
                            checked={ !! attributes.spacing }
                            onChange={ () => setAttributes( { spacing: ! attributes.spacing } ) }
                        />

                    </PanelBody>

                    <PanelBody title={ __( 'Content Settings' ) } initialOpen={ false }>

                        <p>{ __( 'Heading' ) }</p>
                        <Toolbar
                            controls={
                            '123456'.split( '' ).map( ( level ) => ( {
                                icon: 'heading',
                                title: sprintf( __( 'Heading %s' ), level ),
                                isActive: 'H' + level === attributes.titleTag,
                                onClick: () => setAttributes( { titleTag: 'H' + level } ),
                                subscript: level,
                            } ) )
                            }
                        />

                        <ToggleControl
                            label={ __( 'Center vertically?' ) }
                            checked={ !! attributes.verticalAlignment }
                            onChange={ () => setAttributes( { verticalAlignment: ! attributes.verticalAlignment } ) }
                        />

                    </PanelBody>

                    <PanelColor title={ __( 'Background Color' ) } colorValue={ attributes.backgroundColor } initialOpen={ false }>
                        <ColorPalette
                            value={ attributes.backgroundColor }
                            onChange={ ( colorValue ) => setAttributes( { backgroundColor: colorValue } ) }
                        />
                    </PanelColor>

                    <PanelColor title={ __( 'Text Color' ) } colorValue={ attributes.textColor } initialOpen={ false }>
                        <ColorPalette
                            value={ attributes.textColor }
                            onChange={ ( colorValue ) => setAttributes( { textColor: colorValue } ) }
                        />
                    </PanelColor>

                </InspectorControls>
            ),

            <div className={ classNames }>

                <div className="block-image">

                    { ! attributes.imgID ? (

                        <Placeholder
                            className="block-image-placeholder"
                            instructions={ __( 'Drag image here or add from media library' ) }
                            icon="format-image"
                            label={ __( 'Image' ) } >

                            <DropZone
                                onFilesDrop={ this.onFilesDrop }
                                onHTMLDrop={ this.onHTMLDrop }
                            />

                            <FormFileUpload
                                isLarge
                                className="wp-block-image__upload-button"
                                onChange={ this.uploadFromFiles }
                                accept="image/*"
                            >
                                { __( 'Upload' ) }
                            </FormFileUpload>

                            <MediaUpload
                                onSelect={ this.onSelectImage }
                                type="image"
                                render={ ( { open } ) => (
                                    <Button isLarge onClick={ open }>
                                        { __( 'Add from Media Library' ) }
                                    </Button>
                                ) }
                            />
                        </Placeholder>

                    ) : (

                        <div class="image-wrapper">

                            <img
                                src={ attributes.imgURL }
                                alt={ attributes.imgAlt }
                            />

                            { isSelected ? (
                                <div class="image-buttons">
                                    <MediaUpload
                                        onSelect={ this.onSelectImage }
                                        type="image"
                                        value={ attributes.imgID }
                                        render={ ( { open } ) => (
                                            <IconButton
                                                className="edit-image"
                                                label={ __( 'Edit Image' ) }
                                                icon="edit"
                                                onClick={ open }
                                            />
                                        ) }
                                    />
                                    <IconButton
                                        className="remove-image"
                                        label={ __( 'Remove Image' ) }
                                        icon="trash"
                                        onClick={ this.onRemoveImage }
                                    />
                                </div>
                            ) : null }

                        </div>
                    ) }

                </div>

                <div className="block-content" style={ styles }>

                    <div className="block-content-inner">

                        <RichText
                            tagName={ attributes.titleTag.toLowerCase() }
                            placeholder={ __( 'Enter a title' ) }
                            value={ attributes.title }
                            className="block-title"
                            style={ styles }
                            onChange={ ( newTitle ) => setAttributes( { title: newTitle } ) }
                            isSelected={ isSelected && attributes.editable === 'title' }
                            onFocus={ () => this.onSetActiveEditable( 'title' ) }
                        />

                        <RichText
                            tagName="div"
                            multiline="p"
                            placeholder={ __( 'Enter your text here.' ) }
                            value={ attributes.text }
                            className="block-text"
                            onChange={ ( newText ) => setAttributes( { text: newText } ) }
                            isSelected={ isSelected && attributes.editable === 'text' }
                            onFocus={ () => this.onSetActiveEditable( 'text' ) }
                        />

                    </div>

                </div>

            </div>
        ];
    }
}

export default gtImageTextBlock;
