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

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.607 25.607 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z" /></svg>,

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
