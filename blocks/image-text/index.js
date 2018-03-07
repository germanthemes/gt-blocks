/**
 * Block dependencies
 */
import classnames from 'classnames';
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
    AlignmentToolbar,
    BlockControls,
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
    Placeholder,
    SelectControl,
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

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/image-text',
    {
        title: __( 'GT Image & Text' ),
        description: __( 'Add a description here' ),
        category: 'layout',
        icon: 'wordpress-alt',
        keywords: [
            __( 'German Themes' ),
            __( 'Image' ),
            __( 'Text' ),
        ],
        attributes: {
            imgURL: {
                type: 'string',
                source: 'attribute',
                attribute: 'src',
                selector: 'img',
            },
            imgID: {
                type: 'number',
            },
            imgAlt: {
                type: 'string',
                source: 'attribute',
                attribute: 'alt',
                selector: 'img',
            },
            title: {
                type: 'array',
                source: 'children',
                selector: '.block-title',
            },
            text: {
                type: 'array',
                source: 'children',
                selector: '.block-text',
            },
            alignment: {
                type: 'string',
            },
            editable: {
                type: 'string',
            },
            columnSize: {
                type: 'string',
                default: 'block-column-50'
            }
        },
        edit: props => {
            const onSelectImage = img => {
                props.setAttributes( {
                    imgID: img.id,
                    imgURL: img.url,
                    imgAlt: img.alt,
                } );
            };
            const onRemoveImage = () => {
                props.setAttributes( {
                    imgID: null,
                    imgURL: null,
                    imgAlt: null,
                } );
            };
            const setImage = ( [ image ] ) => onSelectImage( image );
            const uploadFromFiles = ( event ) => mediaUpload( event.target.files, setImage );
            const onFilesDrop = ( files ) => mediaUpload( files, setImage );
            const onHTMLDrop = ( HTML ) => setImage( map(
                rawHandler( { HTML, mode: 'BLOCKS' } )
                    .filter( ( { name } ) => name === 'core/image' ),
                'attributes'
            ) );
            const onChangeTitle = newTitle => {
                props.setAttributes( { title: newTitle } )
            };
            const onChangeText = newText => {
                props.setAttributes( { text: newText } )
            };
            const onChangeAlignment = newAlignment => {
                props.setAttributes( { alignment: newAlignment } );
            };
            const onSetActiveEditable = ( newEditable ) => () => {
                props.setAttributes( { editable: newEditable  } );
            };
            const onChangeColumnSize = newColumnSize => {
                props.setAttributes( { columnSize: newColumnSize  } );
            };
            return (
                <div className={ `${props.className} ${props.attributes.columnSize}` }>

                    <div className="block-image">
                        {
                            props.isSelected && (
                                <InspectorControls key="inspector">

                                    <SelectControl
                                        label={ __( 'Image Size' ) }
                                        value={ props.attributes.columnSize }
                                        onChange={ onChangeColumnSize }
                                        options={ columnSizes }
                                    />

                                </InspectorControls>
                            )
                        }

                        { ! props.attributes.imgID ? (

                            <Placeholder
                                className="block-image-placeholder"
                                instructions={ __( 'Drag image here or add from media library' ) }
                                icon="format-image"
                                label={ __( 'Image' ) } >

                                <DropZone
                                    onFilesDrop={ onFilesDrop }
                                    onHTMLDrop={ onHTMLDrop }
                                />

                                <FormFileUpload
                                    isLarge
                                    className="wp-block-image__upload-button"
                                    onChange={ uploadFromFiles }
                                    accept="image/*"
                                >
                                    { __( 'Upload test' ) }
                                </FormFileUpload>

                                <MediaUpload
                                    onSelect={ onSelectImage }
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
                                    src={ props.attributes.imgURL }
                                    alt={ props.attributes.imgAlt }
                                />

                                { props.isSelected ? (
                                    <div class="image-buttons">
                                        <MediaUpload
                                            onSelect={ onSelectImage }
                                            type="image"
                                            value={ props.attributes.imgID }
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
                                            onClick={ onRemoveImage }
                                        />
                                    </div>
                                ) : null }

                            </div>
                        ) }

                    </div>

                    <div className="block-content">
                        {
                            props.isSelected && (
                                <BlockControls key="controls">
                                    <AlignmentToolbar
                                        value={ props.attributes.alignment }
                                        onChange={ onChangeAlignment }
                                    />
                                </BlockControls>
                            )
                        }
                        <RichText
                            tagName="h2"
                            placeholder={ __( 'Enter a title' ) }
                            value={ props.attributes.title }
                            className="block-title"
                            style={ { textAlign: props.attributes.alignment } }
                            onChange={ onChangeTitle }
                            isSelected={ props.isSelected && props.attributes.editable === 'title' }
                            onFocus={ onSetActiveEditable( 'title' ) }
                        />

                        <RichText
                            tagName="div"
                            multiline="p"
                            placeholder={ __( 'Enter your text here.' ) }
                            value={ props.attributes.text }
                            className="block-text"
                            style={ { textAlign: props.attributes.alignment } }
                            onChange={ onChangeText }
                            isSelected={ props.isSelected && props.attributes.editable === 'text' }
                            onFocus={ onSetActiveEditable( 'text' ) }
                        />
                    </div>
                </div>
            );
        },
        save: props => {
            return (
                <div className={props.attributes.columnSize}>
                    <div className="block-image">
                        <img
                            src={props.attributes.imgURL}
                            alt={props.attributes.imgAlt}
                        />
                    </div>

                    <div className="block-content" style={ { textAlign: props.attributes.alignment } }>
                        <h2 className="block-title" >
                            { props.attributes.title }
                        </h2>
                        <div className="block-text">
                            { props.attributes.text }
                        </div>
                    </div>
                </div>
            );
        },
    },
);
