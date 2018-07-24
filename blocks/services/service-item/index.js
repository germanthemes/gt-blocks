/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
    RichText,
} = wp.editor;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/service-item',
    {
        title: __( 'GT Service Item' ),

        description: __( 'Add a description here' ),

        parent: [ 'german-themes-blocks/services' ],

        category: 'layout',

        icon: {
            background: '#7e70af',
            src: 'wordpress-alt',
        },

        keywords: [
            __( 'German Themes' ),
            __( 'Services' ),
            __( 'Text' ),
        ],

        attributes: {
            text: {
                type: 'array',
                source: 'children',
                selector: '.block-text',
            },
        },

        edit( { attributes, setAttributes, isSelected, className } ) {

            return (
                <div className={ className }>

                    <RichText
                        tagName="div"
                        multiline="p"
                        placeholder={ __( 'Enter your text here.' ) }
                        value={ attributes.text }
                        className="block-text"
                        onChange={ ( newText ) => setAttributes( { text: newText } ) }
                    />

                </div>
            );
        },

        save( { attributes } ) {

            return (
                <div>
                    <RichText.Content
                        tagName="div"
                        className='block-text'
                        value={ attributes.text }
                    />
                </div>
            );
        },
    },
);
