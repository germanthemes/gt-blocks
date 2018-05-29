/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import gtImageTextIcon from './icons';
import { default as gtImageTextBlock } from './block';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
    RichText,
    getColorClass,
} = wp.editor;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/image-text',
    {
        title: __( 'GT Image & Text' ),

        description: __( 'Add a description here' ),

        category: 'layout',

        icon: gtImageTextIcon,

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
                default: 'center',
            },
            textAlignment: {
                type: 'string',
            },
            verticalAlignment: {
                type: 'string',
                default: 'top',
            },
            spacing: {
                type: 'boolean',
                default: true,
            },
            fontSize: {
                type: 'number',
            },
            textColor: {
                type: 'string',
            },
            backgroundColor: {
                type: 'string',
            },
            customTextColor: {
                type: 'string',
            },
            customBackgroundColor: {
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

            const textClass = getColorClass( 'color', attributes.textColor );
            const backgroundClass = getColorClass( 'background-color', attributes.backgroundColor );

            const classNames = classnames( {
                [ `${ attributes.columnSize }` ]: attributes.columnSize,
                [ `align${ attributes.blockAlignment }` ]: ( attributes.blockAlignment !== 'center' ),
                [ `gt-vertical-align-${ attributes.verticalAlignment }` ]: ( attributes.verticalAlignment !== 'top' ),
                'gt-image-position-right': attributes.imagePosition,
                'gt-has-spacing': attributes.spacing,
                'has-text-color': attributes.textColor || attributes.customTextColor,
    			[ textClass ]: textClass,
    			'has-background': attributes.backgroundColor || attributes.customBackgroundColor,
                [ backgroundClass ]: backgroundClass,
            } );

            const styles = {
                backgroundColor: backgroundClass ? undefined : attributes.customBackgroundColor,
                color: textClass ? undefined : attributes.customTextColor,
                textAlign: attributes.textAlignment,
            };

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

                            <RichText.Content
                                tagName={ attributes.titleTag.toLowerCase() }
                                className="block-title"
                                value={ attributes.title }
                            />

                            <RichText.Content
                                tagName="div"
                                style={ { fontSize: attributes.fontSize } }
                                className="block-text"
                                value={ attributes.text }
                            />

                        </div>

                    </div>

                </div>
            );
        },
    },
);
