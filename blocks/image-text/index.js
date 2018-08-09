/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import { gtImageTextIcon } from './icons';
import edit from './edit';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
    RichText,
    getColorClass,
    getFontSizeClass,
} = wp.editor;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/image-text',
    {
        title: __( 'GT Image & Text' ),

        description: __( 'Add a description here' ),

        category: 'germanthemes',

        icon: {
            foreground: '#2585ff',
            background: '#ddeeff',
            src: gtImageTextIcon,
        },

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
                type: 'number',
                default: 2,
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
            fontSize: {
                type: 'string',
            },
            customFontSize: {
                type: 'number',
            },
        },

        getEditWrapperProps( attributes ) {
            if ( [ 'wide', 'full' ].indexOf( attributes.blockAlignment ) !== -1 ) {
                return { 'data-align': attributes.blockAlignment };
            }
        },

        edit,

        save( { attributes } ) {
            const {
                backgroundColor,
                textColor,
                customBackgroundColor,
                customTextColor,
                fontSize,
                customFontSize,
            } = attributes;

            const textClass = getColorClass( 'color', textColor );
            const backgroundClass = getColorClass( 'background-color', backgroundColor );
            const fontSizeClass = getFontSizeClass( fontSize );

            const classNames = classnames( {
                [ `${ attributes.columnSize }` ]: attributes.columnSize,
                [ `align${ attributes.blockAlignment }` ]: ( attributes.blockAlignment !== 'center' ),
                [ `gt-vertical-align-${ attributes.verticalAlignment }` ]: ( attributes.verticalAlignment !== 'top' ),
                'gt-image-position-right': attributes.imagePosition,
                'gt-has-spacing': attributes.spacing,
                'has-background': backgroundColor || customBackgroundColor,
                [ textClass ]: textClass,
                [ backgroundClass ]: backgroundClass,
            } );

            const styles = {
                backgroundColor: backgroundClass ? undefined : customBackgroundColor,
    			color: textClass ? undefined : customTextColor,
                textAlign: attributes.textAlignment,
            };

            const textClassNames = classnames( 'block-text', {
                [ fontSizeClass ]: fontSizeClass,
            } );

            const textStyles = {
                fontSize: fontSizeClass ? undefined : customFontSize,
            };

            const titleTag = 'h' + attributes.titleTag;

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
                                tagName={ titleTag }
                                className="block-title"
                                value={ attributes.title }
                            />

                            <RichText.Content
                                tagName="div"
                                style={ textStyles }
                                className={ textClassNames }
                                value={ attributes.text }
                            />

                        </div>

                    </div>

                </div>
            );
        },
    },
);
