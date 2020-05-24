/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.blockEditor;

/**
 * Internal dependencies
 */
import './style.scss';
import edit from './edit';
import { default as backgroundAttributes } from '../../components/background-section/attributes';
import { default as BackgroundSection } from '../../components/background-section';

/**
 * Register block
 */
registerBlockType(
	'gt-blocks/section',
	{
		title: __( 'GT Section', 'gt-blocks' ),

		description: __( 'Add a section block, then use whatever content blocks you’d like.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" /></svg>,

		keywords: [
			__( 'GT Blocks', 'gt-blocks' ),
			__( 'Container', 'gt-blocks' ),
			__( 'Wrap', 'gt-blocks' ),
		],

		attributes: { ...backgroundAttributes },

		getEditWrapperProps( attributes ) {
			const { blockAlignment } = attributes;
			if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
				return { 'data-align': blockAlignment };
			}
		},

		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'core/group' ],
					transform: ( { blockAlignment, textColor, backgroundColor, customTextColor, customBackgroundColor }, innerBlocks ) => {
						return createBlock( 'core/group', {
							align: blockAlignment,
							textColor,
							backgroundColor,
							customTextColor,
							customBackgroundColor,
						}, innerBlocks );
					},
				},
				{
					type: 'block',
					blocks: [ 'core/cover' ],
					transform: ( { blockAlignment, backgroundImageUrl, textColor, backgroundColor, customTextColor, customBackgroundColor }, innerBlocks ) => {
						return createBlock( 'core/cover', {
							align: blockAlignment,
							url: backgroundImageUrl,
							textColor,
							backgroundColor,
							customTextColor,
							customBackgroundColor,
						}, innerBlocks );
					},
				},
			],
		},

		edit,

		save( props ) {
			return (
				<BackgroundSection { ...props }>
					<InnerBlocks.Content />
				</BackgroundSection>
			);
		},
	},
);
