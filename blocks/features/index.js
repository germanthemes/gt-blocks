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
                    icon: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.gt-icon-svg',
                        attribute: 'data-icon',
                    },
                    title: {
                        type: 'array',
                        source: 'children',
                        selector: '.gt-title',
                    },
                    text: {
                        type: 'array',
                        source: 'children',
                        selector: '.gt-text',
                    },
                },
                default: [
                    { 'icon': '', 'title': '', 'text': '' },
                    { 'icon': '', 'title': '', 'text': '' },
                    { 'icon': '', 'title': '', 'text': '' },
                ]
            },
            blockAlignment: {
                type: 'string',
                default: 'center',
            },
            textAlignment: {
                type: 'string',
                default: 'center',
            },
            columns: {
                type: 'number',
                default: 3,
            },
            iconLayout: {
                type: 'string',
                default: 'default',
            },
            titleTag: {
                type: 'number',
                default: 2,
            },
            iconColor: {
                type: 'string',
            },
            iconBackgroundColor: {
                type: 'string',
            },
            customIconColor: {
                type: 'string',
            },
            customIconBackgroundColor: {
                type: 'string',
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
                iconLayout,
                iconColor,
                iconBackgroundColor,
                customIconColor,
                customIconBackgroundColor,
                backgroundColor,
                textColor,
                customBackgroundColor,
                customTextColor,
                fontSize,
                customFontSize,
            } = attributes;

            const iconColorClass = getColorClass( 'color', iconColor );
            const iconBackgroundClass = getColorClass( 'background-color', iconBackgroundColor );

            const textColorClass = getColorClass( 'color', textColor );
            const backgroundClass = getColorClass( 'background-color', backgroundColor );
            const fontSizeClass = getFontSizeClass( fontSize );

            const classNames = classnames( {
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
                [ `align${ attributes.blockAlignment }` ]: ( 'wide' === attributes.blockAlignment || 'full' === attributes.blockAlignment ),
            } );

            const iconClasses = classnames( 'gt-icon', {
                [ `gt-icon-${ iconLayout }` ]: ( iconLayout !== 'default' ),
                'has-icon-color': iconColor || customIconColor,
                [ iconColorClass ]: iconColorClass,
                'has-icon-background': iconBackgroundColor || customIconBackgroundColor,
                [ iconBackgroundClass ]: iconBackgroundClass,
            } );

            const iconStyles = {
                color: iconColorClass ? undefined : customIconColor,
                backgroundColor: iconBackgroundClass ? undefined : customIconBackgroundColor,
            };

            const contentClasses = classnames( 'gt-content', {
                'has-text-color': textColor || customTextColor,
                [ textColorClass ]: textColorClass,
                'has-background': backgroundColor || customBackgroundColor,
                [ backgroundClass ]: backgroundClass,
            } );

            const contentStyles = {
                textAlign: attributes.textAlignment,
                color: textColorClass ? undefined : customTextColor,
                backgroundColor: backgroundClass ? undefined : customBackgroundColor,
            };

            const textClasses = classnames( 'gt-text', {
                [ fontSizeClass ]: fontSizeClass,
            } );

            const textStyles = {
                fontSize: fontSizeClass ? undefined : customFontSize,
            };

            const pluginURL = select( 'gt-blocks' ).getPluginURL();
            const titleTag = 'h' + attributes.titleTag;

            return (
                <div className={ classNames ? classNames : undefined }>
                    <div className="gt-grid-container">

                        {
                            attributes.items.map( ( item, index ) => {

                                const svgURL = pluginURL + '/assets/icons/fontawesome.svg#' + item.icon;
                                const svgClass = classnames( 'icon', `icon-${item.icon}` );

                                return (
                                    <div className="gt-grid-item" key={ index }>

                                        <div className="gt-icon-wrap">
                                            <div className={ iconClasses } style={ iconStyles }>

                                                <span className="gt-icon-svg" data-icon={ item.icon }>
                                                    <svg className={ svgClass } aria-hidden="true" role="img">
                                                        <use href={ svgURL }></use>
                                                    </svg>
                                                </span>

                                            </div>
                                        </div>

                                        <div className={ contentClasses } style={ contentStyles }>

                                            <RichText.Content
                                                tagName={ titleTag }
                                                className="gt-title"
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
