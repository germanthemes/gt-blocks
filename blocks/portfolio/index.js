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
        edit: gtPortfolioBlock,
        save: props => {
            return (
                <div>
                    <h2 className="block-title" >
                        { props.attributes.title }
                    </h2>
                    <div className="block-text">
                        { props.attributes.text }
                    </div>
                </div>
            );
        },
    },
);
