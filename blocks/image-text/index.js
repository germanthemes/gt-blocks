/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
    registerBlockType,
    RichText,
    AlignmentToolbar,
    BlockControls,
    MediaUpload,
} = wp.blocks;

const {
    Button,
} = wp.components;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/image-text',
    {
        title: __( 'GT Image & Text' ),
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
            titleAlignment: {
                type: 'string',
            },
            textAlignment: {
                type: 'string',
            },
            editable: {
                type: 'string',
            },
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
            const onChangeTitle = newTitle => {
                props.setAttributes( { title: newTitle } )
            };
            const onChangeText = newText => {
                props.setAttributes( { text: newText } )
            };
            const onChangeTitleAlignment = newAlignment => {
                props.setAttributes( { titleAlignment: newAlignment } );
            };
            const onChangeTextAlignment = newAlignment => {
                props.setAttributes( { textAlignment: newAlignment } );
            };
            const onSetActiveEditable = ( newEditable ) => () => {
                props.setAttributes( { editable: newEditable  } );
            };
            return (
                <div className={ props.className }>

                    <div className="block-image">

                        { ! props.attributes.imgID ? (

                            <MediaUpload
                                onSelect={ onSelectImage }
                                type="image"
                                value={ props.attributes.imgID }
                                render={ ( { open } ) => (
                                    <Button
                                        className="components-button button button-medium"
                                        onClick={ open }
                                    >
                                        { __( ' Upload Image') }
                                    </Button>
                                ) }
                            />

                        ) : (

                            <p class="image-wrapper">
                                <img
                                    src={ props.attributes.imgURL }
                                    alt={ props.attributes.imgAlt }
                                />

                                { props.isSelected ? (
                                    <Button
                                        className="remove-image"
                                        onClick={ onRemoveImage }
                                    >
                                        { __( ' Remove Image') }
                                    </Button>
                                ) : null }

                            </p>
                        ) }

                    </div>

                    <div className="block-content">
                        {
                            props.isSelected && props.attributes.editable === 'title' && (
                                <BlockControls key="controls">
                                    <AlignmentToolbar
                                        value={ props.attributes.titleAlignment }
                                        onChange={ onChangeTitleAlignment }
                                    />
                                </BlockControls>
                            )
                        }
                        <RichText
                            tagName="h2"
                            placeholder={ __( 'Enter a title' ) }
                            value={ props.attributes.title }
                            className="block-title"
                            style={ { textAlign: props.attributes.titleAlignment } }
                            onChange={ onChangeTitle }
                            isSelected={ props.isSelected && props.attributes.editable === 'title' }
                            onFocus={ onSetActiveEditable( 'title' ) }
                        />

                        {
                            props.isSelected && props.attributes.editable === 'text' && (
                                <BlockControls key="controls">
                                    <AlignmentToolbar
                                        value={ props.attributes.textAlignment }
                                        onChange={ onChangeTextAlignment }
                                    />
                                </BlockControls>
                            )
                        }
                        <RichText
                            tagName="div"
                            multiline="p"
                            placeholder={ __( 'Enter your text here.' ) }
                            value={ props.attributes.text }
                            className="block-text"
                            style={ { textAlign: props.attributes.textAlignment } }
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
                <div>
                    <div className="block-image">
                        <img
                            src={props.attributes.imgURL}
                            alt={props.attributes.imgAlt}
                        />
                    </div>

                    <div className="block-content">
                        <h2 className="block-title" style={ { textAlign: props.attributes.titleAlignment } }>
                            { props.attributes.title }
                        </h2>
                        <div className="block-text" style={ { textAlign: props.attributes.textAlignment } }>
                            { props.attributes.text }
                        </div>
                    </div>
                </div>
            );
        },
    },
);
