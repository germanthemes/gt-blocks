/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { Component } = wp.element;
const { __ } = wp.i18n;
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

const alignmentControls = {
    none: {
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
        this.onChangeTitle       = this.onChangeTitle.bind( this );
        this.onChangeText        = this.onChangeText.bind( this );
        this.onChangeAlignment   = this.onChangeAlignment.bind( this );
        this.onSetActiveEditable = this.onSetActiveEditable.bind( this );
        this.onChangeColumnSize  = this.onChangeColumnSize.bind( this );
        this.toggleVerticalAlignment  = this.toggleVerticalAlignment.bind( this );
        this.toggleInvertLayout  = this.toggleInvertLayout.bind( this );
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

    onChangeTitle( newTitle ) {
        this.props.setAttributes( { title: newTitle } )
    }

    onChangeText( newText ) {
        this.props.setAttributes( { text: newText } )
    }

    onChangeAlignment( newAlignment ) {
        this.props.setAttributes( { alignment: newAlignment } );
    }

    onSetActiveEditable( newEditable ) {
        this.props.setAttributes( { editable: newEditable  } );
    }

    onChangeColumnSize( newColumnSize ) {
        this.props.setAttributes( { columnSize: newColumnSize  } );
    }

    toggleVerticalAlignment() {
        this.props.setAttributes( { verticalAlignment: ! this.props.attributes.verticalAlignment  } );
    }

    toggleInvertLayout() {
        this.props.setAttributes( { invertLayout: ! this.props.attributes.invertLayout  } );
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
            'gt-invert-layout': attributes.invertLayout,
        } );

        const styles = {
            backgroundColor: attributes.backgroundColor,
            color: attributes.textColor,
            textAlign: attributes.alignment,
        };

        return [
            isSelected && (
                <BlockControls key="controls">
                    <AlignmentToolbar
                        value={ attributes.alignment }
                        onChange={ this.onChangeAlignment }
                    />
                </BlockControls>
            ),
            isSelected && (
                <InspectorControls key="inspector">

                    <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false }>

                        <SelectControl
                            label={ __( 'Image Size' ) }
                            value={ attributes.columnSize }
                            onChange={ this.onChangeColumnSize }
                            options={ columnSizes }
                        />

                        <ToggleControl
                            label={ __( 'Invert Layout?' ) }
                            checked={ !! attributes.invertLayout }
                            onChange={ this.toggleInvertLayout }
                        />

                        <label className="blocks-base-control__label">{ __( 'Block Alignment' ) }</label>
                        <Toolbar
                            controls={
                                [ 'none', 'wide', 'full' ].map( control => {
                                    return {
                                        ...alignmentControls[ control ],
                                        isActive: attributes.blockAlignment === control,
                                        onClick: () => this.setBlockAlignment( control ),
                                    };
                                } )
                            }
                        />

                    </PanelBody>

                    <PanelBody title={ __( 'Content Settings' ) } initialOpen={ false }>

                        <ToggleControl
                            label={ __( 'Center vertically?' ) }
                            checked={ !! attributes.verticalAlignment }
                            onChange={ this.toggleVerticalAlignment }
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
                            tagName="h2"
                            placeholder={ __( 'Enter a title' ) }
                            value={ attributes.title }
                            className="block-title"
                            style={ styles }
                            onChange={ this.onChangeTitle }
                            isSelected={ isSelected && attributes.editable === 'title' }
                            onFocus={ () => this.onSetActiveEditable( 'title' ) }
                        />

                        <RichText
                            tagName="div"
                            multiline="p"
                            placeholder={ __( 'Enter your text here.' ) }
                            value={ attributes.text }
                            className="block-text"
                            onChange={ this.onChangeText }
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
