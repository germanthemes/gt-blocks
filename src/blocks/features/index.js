/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import './style.scss';
import { default as GridEdit } from '../../components/grid-container/edit';
import { default as GridContainer } from '../../components/grid-container';

// Define allowed child blocks.
const ALLOWED_BLOCKS = [ 'gt-layout-blocks/icon', 'gt-layout-blocks/heading', 'core/paragraph' ];

// Define blocks for each column.
const TEMPLATE = [
	[ 'gt-layout-blocks/icon', {
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/features',
		containerBlock: 'gt-layout-blocks/column',
	} ],
	[ 'gt-layout-blocks/heading', {
		placeholder: __( 'Feature' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/features',
		containerBlock: 'gt-layout-blocks/column',
	} ],
	[ 'core/paragraph', {
		placeholder: __( 'Write feature description...' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/features',
		containerBlock: 'gt-layout-blocks/column',
	} ],
];

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/features',
	{
		title: __( 'GT Features' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Icon' ),
			__( 'Grid' ),
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
			columnGap: {
				type: 'number',
				default: 32,
			},
		},

		edit( props ) {
			return (
				<GridEdit
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
					parentBlock={ props.name }
					{ ...props }
				/>
			);
		},

		save( props ) {
			return (
				<div>
					<GridContainer
						{ ...props }
					/>
				</div>
			);
		},
	},
);
