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
                selector: '.block-item',
                query: {
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
                    <div className="block-container">

                        {
                            props.attributes.items.map( ( item, index ) => {
                                return (
                                    <div className="block-item">

                                        <h2 className="block-title" >
                                            { item.title }
                                        </h2>

                                        <div className="block-text">
                                            { item.text }
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
