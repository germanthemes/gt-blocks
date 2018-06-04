/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import { gtPortfolioIcon } from './icons';
import edit from './edit';

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
    'german-themes-blocks/portfolio',
    {
        title: __( 'GT Portfolio' ),

        description: __( 'Add a description here' ),

        category: 'layout',

        icon: gtPortfolioIcon,

        keywords: [
            __( 'German Themes' ),
            __( 'Portfolio' ),
            __( 'Layout' ),
        ],

        attributes: {
            items: {
                type: 'array',
                source: 'query',
                selector: '.gt-grid-item',
                query: {
                    imgID: {
                        type: 'number',
                        source: 'attribute',
                        attribute: 'data-img-id',
                        selector: '.gt-image img',
                    },
                    imgURL: {
                        type: 'string',
                        source: 'attribute',
                        attribute: 'src',
                        selector: '.gt-image img',
                    },
                    imgAlt: {
                        type: 'string',
                        source: 'attribute',
                        attribute: 'alt',
                        selector: '.gt-image img',
                    },
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
                    buttonText: {
                        type: 'array',
                        source: 'children',
                        selector: '.gt-button',
                    },
                    itemURL: {
                        type: 'string',
                        source: 'attribute',
                        attribute: 'href',
                        selector: '.gt-item-url',
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
            showButtons: {
                type: 'boolean',
                default: false,
            },
            imageSize: {
                type: 'string',
                default: 'full',
            },
            titleTag: {
                type: 'string',
                source: 'property',
                selector: 'h1,h2,h3,h4,h5,h6',
                property: 'nodeName',
                default: 'H2',
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
            const { blockAlignment } = attributes;
            if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
                return { 'data-align': blockAlignment };
            }
        },

        edit,

        save( { attributes } ) {

            const textClass = getColorClass( 'color', attributes.textColor );
            const backgroundClass = getColorClass( 'background-color', attributes.backgroundColor );

            const classNames = classnames( {
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
                [ `align${ attributes.blockAlignment }` ]: ( 'wide' === attributes.blockAlignment || 'full' === attributes.blockAlignment ),
            } );

            const contentClasses = classnames( 'gt-content', {
                'has-text-color': attributes.textColor || attributes.customTextColor,
                [ textClass ]: textClass,
                'has-background': attributes.backgroundColor || attributes.customBackgroundColor,
                [ backgroundClass ]: backgroundClass,
            } );

            const contentStyles = {
                textAlign: attributes.textAlignment,
                backgroundColor: backgroundClass ? undefined : attributes.customBackgroundColor,
                color: textClass ? undefined : attributes.customTextColor,
            };

            return (
                <div className={ classNames ? classNames : undefined }>
                    <div className="gt-grid-container">

                        {
                            attributes.items.map( ( item, index ) => {

                                const image = <img
                                    src={ item.imgURL }
                                    alt={ item.imgAlt }
                                    data-img-id={ item.imgID }
                                />;

                                const titleText = <span class="gt-title-text">{ item.title }</span>;
                                const title = item.itemURL ? <a href={ item.itemURL } className="gt-item-url" title={ titleText }>{ titleText }</a> : titleText;

                                return (
                                    <div className="gt-grid-item">

                                        <div className="gt-image">
                                            { item.itemURL ? <a href={  item.itemURL } className="gt-item-url">{ image }</a> : image }
                                        </div>

                                        <div className={ contentClasses } style={ contentStyles }>

                                            <RichText.Content
                                                tagName={ attributes.titleTag.toLowerCase() }
                                                className="gt-title"
                                                value={ title }
                                            />

                                            <RichText.Content
                                                tagName="div"
                                                className="gt-text"
                                                value={ item.text }
                                            />

                                            { ( item.itemURL && item.buttonText.length > 0 ) && (
                                                <RichText.Content
                                                    tagName="a"
                                                    href={ item.itemURL }
                                                    className={ classnames( 'gt-button', { 'gt-button-hidden': ! attributes.showButtons } ) }
                                                    value={ item.buttonText }
                                                />
                                            ) }

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
