/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;

const {
    BlockAlignmentToolbar,
    BlockControls,
    InspectorControls,
    InnerBlocks,
} = wp.editor;

const {
    PanelBody,
} = wp.components;

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/container',
    {
        title: __( 'GT Container' ),

        description: __( 'Add a description here' ),

        category: 'germanthemes',

        icon: {
            foreground: '#2585ff',
            background: '#ddeeff',
            src: 'carrot',
        },

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
        },

        getEditWrapperProps( attributes ) {
            const { blockAlignment } = attributes;
            if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
                return { 'data-align': blockAlignment };
            }
        },

        edit( { attributes, setAttributes, isSelected, className } ) {

            return (
                <Fragment>

                    <BlockControls key="controls">

                        <BlockAlignmentToolbar
                            value={ attributes.blockAlignment }
                            onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
                            controls={ [ 'wide', 'full' ] }
                        />

                    </BlockControls>

                    <InspectorControls key="inspector">

                        <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

                            <BlockAlignmentToolbar
                                value={ attributes.blockAlignment }
                                onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
                                controls={ [ 'wide', 'full' ] }
                            />

                        </PanelBody>

                    </InspectorControls>

                    <div className={ className }>
                        <InnerBlocks />
                    </div>

                </Fragment>
            );
        },

        save( { attributes } ) {

            const classNames = classnames( {
                [ `align${ attributes.blockAlignment }` ]: ( 'wide' === attributes.blockAlignment || 'full' === attributes.blockAlignment ),
            } );

            return (
                <div className={ classNames ? classNames : undefined }>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
);
