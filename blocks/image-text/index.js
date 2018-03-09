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
            titleTag: {
                type: 'string',
                source: 'property',
                selector: 'h1,h2,h3,h4,h5,h6',
                property: 'nodeName',
                default: 'H2',
            },
            text: {
                type: 'array',
                source: 'children',
                selector: '.block-text',
            },
            editable: {
                type: 'string',
            },
            columnSize: {
                type: 'string',
                default: 'block-column-50'
            },
            imagePosition: {
                type: 'boolean',
                default: false, // false = left, true = right
            },
            blockAlignment: {
                type: 'string',
            },
            textAlignment: {
                type: 'string',
            },
            verticalAlignment: {
                type: 'boolean',
                default: false,
            },
            textColor: {
                type: 'string',
            },
            backgroundColor: {
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

            const classNames = classnames( {
                [ `${ attributes.columnSize }` ]: attributes.columnSize,
                [ `align${ attributes.blockAlignment }` ]: attributes.blockAlignment,
                'has-background': attributes.backgroundColor,
                'gt-vertical-centered': attributes.verticalAlignment,
                'gt-image-position-right': attributes.imagePosition,
            } );

            const styles = {
                backgroundColor: attributes.backgroundColor,
                color: attributes.textColor,
                textAlign: attributes.textAlignment,
            };

            const TitleTag = attributes.titleTag.toLowerCase();

            return (
                <div className={ classNames ? classNames : undefined }>

                    <div className="block-image">
                        <img
                            src={attributes.imgURL}
                            alt={attributes.imgAlt}
                        />
                    </div>

                    <div className="block-content" style={ styles }>

                        <div className="block-content-inner">

                            <TitleTag className="block-title" >
                                { attributes.title }
                            </TitleTag>

                            <div className="block-text">
                                { attributes.text }
                            </div>

                        </div>

                    </div>

                </div>
            );
        },
    },
);
