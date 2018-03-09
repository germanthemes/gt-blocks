/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import { default as gtImageTextBlock } from './block';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

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
            },
            verticalAlignment: {
                type: 'boolean',
                default: false,
            },
            invertLayout: {
                type: 'boolean',
                default: false,
            },
            blockAlignment: {
                type: 'string',
            },
        },

        getEditWrapperProps( attributes ) {
            if ( [ 'wide', 'full' ].indexOf( attributes.blockAlignment ) !== -1 ) {
                return { 'data-align': attributes.blockAlignment };
            }
        },

        edit: gtImageTextBlock,

        save( { attributes } ) {
            const verticalAlignment = attributes.verticalAlignment ? 'gt-vertical-centered' : '';
            const invertLayout = attributes.invertLayout ? 'gt-invert-layout' : '';

            const classNames = classnames( {
                [ `${ attributes.columnSize }` ]: attributes.columnSize,
                [ `align${ attributes.blockAlignment }` ]: attributes.blockAlignment,
                'gt-vertical-centered': attributes.verticalAlignment,
                'gt-invert-layout': attributes.invertLayout,
            } );

            return (
                <div className={ classNames ? classNames : undefined }>

                    <div className="block-image">
                        <img
                            src={attributes.imgURL}
                            alt={attributes.imgAlt}
                        />
                    </div>

                    <div className="block-content" style={ { textAlign: attributes.alignment } }>
                        <h2 className="block-title" >
                            { attributes.title }
                        </h2>
                        <div className="block-text">
                            { attributes.text }
                        </div>
                    </div>
                </div>
            );
        },
    },
);
