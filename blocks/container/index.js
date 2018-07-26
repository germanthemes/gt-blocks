/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import { default as gtContainerBlock } from './block';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType, InnerBlocks } = wp.blocks;

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
            src: 'wordpress-alt',
        },

        keywords: [
            __( 'German Themes' ),
            __( 'Container' ),
            __( 'Layout' ),
        ],

        attributes: {
            blockAlignment: {
                type: 'string',
                default: 'full',
            },
            textColor: {
                type: 'string',
            },
            backgroundColor: {
                type: 'string',
                default: '#eeeeee',
            },
        },

        getEditWrapperProps( attributes ) {
            if ( [ 'wide', 'full' ].indexOf( attributes.blockAlignment ) !== -1 ) {
                return { 'data-align': attributes.blockAlignment };
            }
        },

        edit: gtContainerBlock,

        save( { attributes } ) {

            const classNames = classnames( {
                [ `align${ attributes.blockAlignment }` ]: ( attributes.blockAlignment !== 'center' ),
                'gt-has-background': attributes.backgroundColor,
            } );

            const styles = {
                backgroundColor: attributes.backgroundColor,
                color: attributes.textColor,
            };

            return (
                <div className={ classNames ? classNames : undefined } style={ styles }>
                    <div className="block-content">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
);
