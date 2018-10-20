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
	'gt-layout-blocks/image-text',
	{
		title: __( 'GT Image & Text' ),

		description: __( 'Display an image and any content blocks in a two column layout.' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 0c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48H176c-26.51 0-48-21.49-48-48V48c0-26.51 21.49-48 48-48h288M176 416c-44.112 0-80-35.888-80-80V128H48c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h288c26.51 0 48-21.49 48-48v-48H176z" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Image' ),
			__( 'Text' ),
		],

		attributes: {
			imagePosition: {
				type: 'string',
				default: 'left',
			},
			verticalAlignment: {
				type: 'string',
				default: 'top',
			},
		},

		getEditWrapperProps( attributes ) {
			const { blockAlignment } = attributes;
			if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
				return { 'data-align': blockAlignment };
			}
		},

		edit,

		save( props ) {
			const {
				imagePosition,
				verticalAlignment,
			} = props.attributes;

			const blockClasses = classnames( {
				[ `gt-image-position-${ imagePosition }` ]: 'left' !== imagePosition,
				[ `gt-vertical-align-${ verticalAlignment }` ]: 'top' !== verticalAlignment,
			} );

			return (
				<div className={ blockClasses }>

					<InnerBlocks.Content />

				</div>
			);
		},
	},
);
