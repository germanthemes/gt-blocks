/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';

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
    'german-themes-blocks/services',
    {
        title: __( 'GT Services' ),

        description: __( 'Add a description here' ),

        category: 'layout',

        icon: {
            background: '#7e70af',
            src: 'carrot',
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

        edit,

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
