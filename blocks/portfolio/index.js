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
                source: 'query',
                selector: '.gt-grid-item',
                query: {
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
                    { 'title': '', 'text': '' },
                    { 'title': '', 'text': '' },
                ]
            },
            editable: {
                type: 'string',
            },
        },

        edit: gtPortfolioBlock,

        save: props => {
            return (
                <div>
                    <div className="gt-grid-container">

                        {
                            props.attributes.items.map( ( item, index ) => {
                                return (
                                    <div className="gt-grid-item">

                                        <div className="gt-content">
                                            <h2 className="gt-title" >
                                                { item.title }
                                            </h2>

                                            <div className="gt-text">
                                                { item.text }
                                            </div>
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
