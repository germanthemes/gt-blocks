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
import { default as BackgroundEdit } from '../../components/background-section/edit';
import { default as BackgroundSection } from '../../components/background-section';

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/container',
	{
		title: __( 'GT Container' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /><path d="M0 0h24v24H0z" fill="none" /></svg>,

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
			imageOpacity: {
				type: 'number',
				default: 100,
			},
			backgroundPosition: {
				type: 'string',
				default: 'center center',
			},
			fixedBackground: {
				type: 'boolean',
				default: false,
			},
		},

		getEditWrapperProps( attributes ) {
			const { blockAlignment } = attributes;
			if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
				return { 'data-align': blockAlignment };
			}
		},

		edit( props ) {
			return (
				<BackgroundEdit { ...props }>
					<InnerBlocks />
				</BackgroundEdit>
			);
		},

		save( props ) {
			return (
				<BackgroundSection { ...props }>
					<InnerBlocks.Content />
				</BackgroundSection>
			);
		},
	},
);
