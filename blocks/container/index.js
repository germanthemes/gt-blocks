/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;

const {
    getColorClass,
    InnerBlocks,
} = wp.editor;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/container',
    {
        title: __( 'GT Container' ),

        description: __( 'Add a description here' ),

        category: 'germanthemes',

        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>,

        keywords: [
            __( 'German Themes' ),
            __( 'Container' ),
            __( 'Text' ),
        ],

        attributes: {
            blockAlignment: {
                type: 'string',
                default: 'center',
            },
            contentWidth: {
                type: 'number',
                default: 720,
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
            backgroundImageId: {
                type: 'number',
            },
            backgroundImageUrl: {
                type: 'string',
                source: 'attribute',
                selector: '.gt-has-background-image',
                attribute: 'data-background-image',
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
                textColor,
                backgroundColor,
                customTextColor,
                customBackgroundColor,
            } = attributes;

            const textColorClass = getColorClass( 'color', textColor );
            const backgroundClass = getColorClass( 'background-color', backgroundColor );

            const classNames = classnames( {
                [ `align${ attributes.blockAlignment }` ]: ( attributes.blockAlignment !== 'center' ),
                'has-text-color': textColor || customTextColor,
                [ textColorClass ]: textColorClass,
                'has-background': backgroundColor || customBackgroundColor,
                [ backgroundClass ]: backgroundClass,
                'gt-has-background-image': attributes.backgroundImageId,
            } );

            const blockStyles = {
                color: textColorClass ? undefined : customTextColor,
                backgroundColor: backgroundClass ? undefined : customBackgroundColor,
                backgroundImage: attributes.backgroundImageId ? `url(${attributes.backgroundImageUrl})` : undefined,
            };

            const contentStyles = {
                maxWidth: attributes.contentWidth + 'px',
            };

            const dataBackgroundImage = attributes.backgroundImageId ? attributes.backgroundImageUrl : undefined;

            return (
                <div className={ classNames ? classNames : undefined } style={ blockStyles } data-background-image={ dataBackgroundImage }>
                    <div className="gt-inner-content" style={ contentStyles }>
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
);
