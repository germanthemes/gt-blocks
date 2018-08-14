/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import { gtFeaturesIcon } from './icons';
import edit from './edit';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { select } = wp.data;
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
    'german-themes-blocks/features',
    {
        title: __( 'GT Features' ),

        description: __( 'Add a description here' ),

        category: 'germanthemes',

        icon: {
            background: '#ddeeff',
            src: gtFeaturesIcon,
        },

        keywords: [
            __( 'German Themes' ),
            __( 'Features' ),
            __( 'Layout' ),
        ],

        attributes: {
            items: {
                type: 'array',
                source: 'query',
                selector: '.gt-grid-item',
                query: {
                    title: {
                        type: 'array',
                        source: 'children',
                        selector: '.gt-title-text',
                    },
                    text: {
                        type: 'array',
                        source: 'children',
                        selector: '.gt-text',
                    },
                },
                default: [
                    { 'title': '', 'text': '' },
                    { 'title': '', 'text': '' },
                ]
            },
            columns: {
                type: 'number',
                default: 2,
            },
            blockAlignment: {
                type: 'string',
                default: 'center',
            },
            textAlignment: {
                type: 'string',
            },
            titleTag: {
                type: 'number',
                default: 2,
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
            const { blockAlignment } = attributes;
            if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
                return { 'data-align': blockAlignment };
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
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
                [ `align${ attributes.blockAlignment }` ]: ( 'wide' === attributes.blockAlignment || 'full' === attributes.blockAlignment ),
            } );

            const contentClasses = classnames( 'gt-content', {
                'has-background': backgroundColor || customBackgroundColor,
                [ backgroundClass ]: backgroundClass,
            } );

            const contentStyles = {
                textAlign: attributes.textAlignment,
                backgroundColor: backgroundClass ? undefined : customBackgroundColor,
            };

            const textClasses = classnames( 'gt-text', {
                'has-text-color': textColor || customTextColor,
                [ textClass ]: textClass,
                [ fontSizeClass ]: fontSizeClass,
            } );

            const textStyles = {
                color: textClass ? undefined : customTextColor,
                fontSize: fontSizeClass ? undefined : customFontSize,
            };

            const pluginURL = select( 'gt-blocks' ).getPluginURL();

            return (
                <div className={ classNames ? classNames : undefined }>
                    <div className="gt-grid-container">

                        {
                            attributes.items.map( ( item, index ) => {

                                const iconURL = pluginURL + '/assets/icons/fontawesome.svg#' + 'address-card';
                                const titleTag = 'h' + attributes.titleTag;

                                return (
                                    <div className="gt-grid-item" key={ index }>

                                        <div className="gt-icon">
                                            <svg className="icon icon-address-card" aria-hidden="true" role="img">
                                                <use href={ iconURL }></use>
                                            </svg>
                                        </div>

                                        <div className={ contentClasses } style={ contentStyles }>

                                            <RichText.Content
                                                tagName={ titleTag }
                                                className="gt-title-text"
                                                value={ item.title }
                                            />

                                            <RichText.Content
                                                tagName="div"
                                                className={ textClasses }
                                                value={ item.text }
                                                style={ textStyles }
                                            />

                                        </div>

                                    </div>
                                );
                            })
                        }

                    </div>
                </div>
            );
        },

    },
);
