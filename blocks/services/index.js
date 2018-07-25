/**
 * External dependencies
 */
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
const {
    InnerBlocks,
} = wp.editor;

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

        category: 'layout',

        icon: {
            background: '#7e70af',
            src: 'carrot',
        },

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
        },

        edit( { attributes, setAttributes, isSelected, className } ) {

            return (
                <div className={ className }>

                    <InnerBlocks
                        template={ getServicesTemplate( attributes.services ) }
                        templateLock='all'
                        allowedBlocks={ ALLOWED_BLOCKS }
                    />

                </div>
            );
        },

        save( { attributes } ) {

            return (
                <div>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
);
