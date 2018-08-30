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
    'gt-layout-blocks/image-text',
    {
        title: __( 'GT Image & Text' ),

        description: __( 'Add a description here' ),

        category: 'gt-layout-blocks',

        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="#010101" d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zm-2-8v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zm-1.5 6l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7z"/></svg>,

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
                selector: '.gt-title',
            },
            titleTag: {
                type: 'number',
                default: 2,
            },
            text: {
                type: 'array',
                source: 'children',
                selector: '.gt-text',
            },
            columnSize: {
                type: 'string',
                default: 'gt-column-50'
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

            const textColorClass = getColorClass( 'color', textColor );
            const backgroundClass = getColorClass( 'background-color', backgroundColor );
            const fontSizeClass = getFontSizeClass( fontSize );

            const blockClasses = classnames( {
                [ `${ attributes.columnSize }` ]: attributes.columnSize,
                [ `align${ attributes.blockAlignment }` ]: ( attributes.blockAlignment !== 'center' ),
                [ `gt-vertical-align-${ attributes.verticalAlignment }` ]: ( attributes.verticalAlignment !== 'top' ),
                'gt-image-position-right': attributes.imagePosition,
                'gt-has-spacing': attributes.spacing,
                'has-background': backgroundColor || customBackgroundColor,
                [ textColorClass ]: textColorClass,
                [ backgroundClass ]: backgroundClass,
            } );

            const styles = {
                backgroundColor: backgroundClass ? undefined : customBackgroundColor,
    			color: textColorClass ? undefined : customTextColor,
                textAlign: attributes.textAlignment,
            };

            const textClasses = classnames( 'gt-text', {
                [ fontSizeClass ]: fontSizeClass,
            } );

            const textStyles = {
                fontSize: fontSizeClass ? undefined : customFontSize,
            };

            const titleTag = 'h' + attributes.titleTag;

            return (
                <div className={ blockClasses ? blockClasses : undefined }>

                    <div className="gt-image">
                        <img
                            src={attributes.imgURL}
                            alt={attributes.imgAlt}
                        />
                    </div>

                    <div className="gt-content" style={ styles }>

                        <div className="gt-inner-content">

                            <RichText.Content
                                tagName={ titleTag }
                                className="gt-title"
                                value={ attributes.title }
                            />

                            <RichText.Content
                                tagName="div"
                                style={ textStyles }
                                className={ textClasses }
                                value={ attributes.text }
                            />

                        </div>

                    </div>

                </div>
            );
        },
    },
);
