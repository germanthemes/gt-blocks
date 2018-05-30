/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import { default as gtPortfolioBlock } from './block';

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

        icon: 'wordpress-alt',

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
                        selector: '.gt-title',
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
            showButtons: {
                type: 'boolean',
                default: false,
            },
            imageSize: {
                type: 'string',
                default: 'full',
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

        edit: gtPortfolioBlock,

        save( { attributes } ) {

            const textClass = getColorClass( 'color', attributes.textColor );
            const backgroundClass = getColorClass( 'background-color', attributes.backgroundColor );

            const classNames = classnames( {
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
                [ `align${ attributes.blockAlignment }` ]: ( attributes.blockAlignment !== 'center' ),
            } );

            const itemClasses = classnames( 'gt-content', {
                'has-text-color': attributes.textColor || attributes.customTextColor,
                [ textClass ]: textClass,
                'has-background': attributes.backgroundColor || attributes.customBackgroundColor,
                [ backgroundClass ]: backgroundClass,
            } );

            const itemStyles = {
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

                                const title = <RichText.Content
                                    tagName="h2"
                                    className="gt-title"
                                    value={ item.title }
                                />;

                                return (
                                    <div className="gt-grid-item">

                                        <div className="gt-image">
                                            { item.itemURL ? <a href={  item.itemURL }>{ image }</a> : image }
                                        </div>

                                        <div className={ itemClasses }>

                                            { item.itemURL ? <a href={  item.itemURL } title={ item.title }>{ title }</a> : title }

                                            <RichText.Content
                                                tagName="div"
                                                className="gt-text"
                                                value={ item.text }
                                            />

                                            { ( attributes.showButtons && item.buttonText && item.itemURL ) ?
                                                <RichText.Content
                                                    tagName="a"
                                                    href={ item.itemURL }
                                                    className="gt-button"
                                                    value={ item.buttonText }
                                                /> : null
                                            }

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
