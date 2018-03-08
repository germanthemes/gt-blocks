/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import { default as gtImageTextBlock } from './block';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/image-text',
    {
        title: __( 'GT Image & Text' ),
        description: __( 'Add a description here' ),
        category: 'layout',
        icon: 'wordpress-alt',
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
            text: {
                type: 'array',
                source: 'children',
                selector: '.block-text',
            },
            alignment: {
                type: 'string',
            },
            editable: {
                type: 'string',
            },
            columnSize: {
                type: 'string',
                default: 'block-column-50'
            },
            verticalAlignment: {
                type: 'boolean',
                default: false,
            },
            invertLayout: {
                type: 'boolean',
                default: false,
            },
        },
        edit: gtImageTextBlock,
        save: props => {
            const verticalAlignment = props.attributes.verticalAlignment ? 'gt-vertical-centered' : '';
            const invertLayout = props.attributes.invertLayout ? 'gt-invert-layout' : '';

            return (
                <div className={ `${props.attributes.columnSize} ${verticalAlignment} ${invertLayout}` }>
                    <div className="block-image">
                        <img
                            src={props.attributes.imgURL}
                            alt={props.attributes.imgAlt}
                        />
                    </div>

                    <div className="block-content" style={ { textAlign: props.attributes.alignment } }>
                        <h2 className="block-title" >
                            { props.attributes.title }
                        </h2>
                        <div className="block-text">
                            { props.attributes.text }
                        </div>
                    </div>
                </div>
            );
        },
    },
);
