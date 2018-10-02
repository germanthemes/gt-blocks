/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

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
	'gt-layout-blocks/icon-grid',
	{
		title: __( 'GT Icon Grid' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Icon Grid' ),
			__( 'Layout' ),
		],

		attributes: {
			items: {
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
			const { blockAlignment } = attributes;
			if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
				return { 'data-align': blockAlignment };
			}
		},

		edit,

		save( { attributes } ) {
			const {
				blockAlignment,
				columns,
			} = attributes;

			const blockClasses = classnames( {
				[ `align${ blockAlignment }` ]: ( 'wide' === blockAlignment || 'full' === blockAlignment ),
			} );

			const gridClasses = classnames( 'gt-grid-container', {
				[ `gt-columns-${ columns }` ]: columns,
			} );

			return (
				<div className={ blockClasses ? blockClasses : undefined }>
					<div className={ gridClasses }>

						<InnerBlocks.Content />

					</div>
				</div>
			);
		},

	},
);
