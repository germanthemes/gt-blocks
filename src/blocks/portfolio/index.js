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
const ALLOWED_BLOCKS = [ 'gt-layout-blocks/image', 'gt-layout-blocks/heading', 'core/paragraph' ];

// Define blocks for each column.
const TEMPLATE = [
	[ 'gt-layout-blocks/image', {
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/portfolio',
	} ],
	[ 'gt-layout-blocks/heading', {
		placeholder: __( 'Project' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/portfolio',
	} ],
	[ 'core/paragraph', {
		placeholder: __( 'Write project description...' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/portfolio',
	} ],
];

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/portfolio',
	{
		title: __( 'GT Portfolio' ),

		description: __( 'Add a block that displays your projects or services in a grid layout.' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64v-96h160v96zm0-160H64v-96h160v96zm224 160H288v-96h160v96zm0-160H288v-96h160v96z" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Image' ),
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
