/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	InnerBlocks,
} = wp.editor;

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/buttons',
	{
		title: __( 'GT Buttons' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /><path d="M0 0h24v24H0z" fill="none" /></svg>,

		parent: [ 'gt-layout-blocks/hero-image' ],

		attributes: {
			customClass: {
				type: 'string',
			},
			buttons: {
				type: 'number',
				default: 2,
			},
			buttonAttributes: {
				type: 'array',
			},
			buttonGap: {
				type: 'string',
				default: 'medium',
			},
			alignment: {
				type: 'string',
			},
		},

		supports: {
			inserter: false,
		},

		edit,

		save( { attributes } ) {
			const {
				customClass,
				buttonGap,
				alignment,
			} = attributes;

			const blockClasses = classnames( {
				[ `${ customClass }` ]: customClass,
				[ `gt-${ buttonGap }-gap` ]: 'none' !== buttonGap,
				[ `gt-align-${ alignment }` ]: 'center' === alignment || 'right' === alignment,
			} );

			return (
				<div className={ blockClasses ? blockClasses : undefined }>

					<InnerBlocks.Content />

				</div>
			);
		},
	},
);
