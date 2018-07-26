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
const { Fragment } = wp.element;

const {
    InnerBlocks,
} = wp.editor;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/container',
    {
        title: __( 'GT Container' ),

        description: __( 'Add a description here' ),

        category: 'germanthemes',

        icon: {
            foreground: '#2585ff',
            background: '#ddeeff',
            src: 'carrot',
        },

        keywords: [
            __( 'German Themes' ),
            __( 'Container' ),
            __( 'Text' ),
        ],

        attributes: {
            blockAlignment: {
                type: 'string',
                default: 'center',
            },
            backgroundColor: {
                type: 'string',
            },
            customBackgroundColor: {
                type: 'string',
            },
        },

        getEditWrapperProps( attributes ) {
            const { blockAlignment } = attributes;
            if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
                return { 'data-align': blockAlignment };
            }
        },

        edit,

        save( { attributes } ) {

            const classNames = classnames( {
                [ `align${ attributes.blockAlignment }` ]: ( 'wide' === attributes.blockAlignment || 'full' === attributes.blockAlignment ),
            } );

            return (
                <div className={ classNames ? classNames : undefined }>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
);
