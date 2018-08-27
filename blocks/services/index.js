/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';
import memoize from 'memize';

/**
 * Import Child Block
 */
import './service-item';

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
    InspectorControls,
    InnerBlocks,
} = wp.editor;

const {
    PanelBody,
    RangeControl,
} = wp.components;

/**
 * InnerBlock Settings
 */
const ALLOWED_BLOCKS = [ 'german-themes-blocks/service-item' ];

/**
 * Returns the number of service boxes.
 *
 * @param {number} services Number of services.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getServicesTemplate = memoize( ( services ) => {
    return times( services, () => [ 'german-themes-blocks/service-item', { text: 'Enter your service' } ] );
} );

/**
 * Register block
 */
registerBlockType(
    'german-themes-blocks/services',
    {
        title: __( 'GT Services' ),

        description: __( 'Add a description here' ),

        category: 'germanthemes',

        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 5v6h5L7 7l4 1V3H5c-1.1 0-2 .9-2 2zm5 8H3v6c0 1.1.9 2 2 2h6v-5l-4 1 1-4zm9 4l-4-1v5h6c1.1 0 2-.9 2-2v-6h-5l1 4zm2-14h-6v5l4-1-1 4h5V5c0-1.1-.9-2-2-2z"/></svg>,

        keywords: [
            __( 'German Themes' ),
            __( 'Services' ),
            __( 'Text' ),
        ],

        attributes: {
            services: {
                type: 'number',
                default: 3,
            },
            columns: {
                type: 'number',
                default: 3,
            },
            blockAlignment: {
                type: 'string',
                default: 'center',
            },
        },

        edit( { attributes, setAttributes, isSelected, className } ) {

            const classNames= classnames( className, {
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
            } );

            return (
                <Fragment>

                    <InspectorControls key="inspector">

                        <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

                            <RangeControl
                                label={ __( 'Columns' ) }
                                value={ attributes.columns }
                                onChange={ ( nextColumns ) => setAttributes( { columns: nextColumns } ) }
                                min={ 2 }
                                max={ 6 }
                            />

                        </PanelBody>

                    </InspectorControls>

                    <div className={ classNames }>
                        <div className="gt-grid-container">

                            <InnerBlocks
                                template={ getServicesTemplate( attributes.services ) }
                                templateLock='all'
                                allowedBlocks={ ALLOWED_BLOCKS }
                            />

                        </div>
                    </div>

                </Fragment>
            );
        },

        save( { attributes } ) {

            const classNames = classnames( {
                [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
                [ `align${ attributes.blockAlignment }` ]: ( 'wide' === attributes.blockAlignment || 'full' === attributes.blockAlignment ),
            } );

            return (
                <div className={ classNames ? classNames : undefined }>
                    <div className="gt-grid-container">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
);
