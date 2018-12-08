/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import { default as GridEdit } from '../../components/grid-container/edit';
import { default as GridContainer } from '../../components/grid-container';

// Define allowed child blocks.
const ALLOWED_BLOCKS = [ 'gt-layout-blocks/image', 'gt-layout-blocks/heading', 'core/paragraph' ];

// Define blocks for each column.
const TEMPLATE = [
	[ 'gt-layout-blocks/image', {
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/team-members',
	} ],
	[ 'gt-layout-blocks/content', {
		template: [
			[ 'gt-layout-blocks/dual-heading', {
				synchronizeStyling: true,
				parentBlock: 'gt-layout-blocks/team-members',
				titlePlaceholder: __( 'Name', 'gt-layout-blocks' ),
				subtitlePlaceholder: __( 'Job Title', 'gt-layout-blocks' ),
				titleTag: 'p',
				customFontSize: 20,
				subtitleCustomFontSize: 15,
			} ],
			[ 'core/paragraph', {
				placeholder: __( 'Write some words...', 'gt-layout-blocks' ),
				synchronizeStyling: true,
				parentBlock: 'gt-layout-blocks/team-members',
			} ],
		],
	} ],
];

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/team-members',
	{
		title: __( 'GT Team Members', 'gt-layout-blocks' ),

		description: __( 'Display your team members or employees in a grid layout.', 'gt-layout-blocks' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z" /></svg>,

		keywords: [
			__( 'Employees', 'gt-layout-blocks' ),
			__( 'Image', 'gt-layout-blocks' ),
			__( 'Grid', 'gt-layout-blocks' ),
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
		},

		edit( props ) {
			return (
				<GridEdit
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
					templateLock="all"
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
