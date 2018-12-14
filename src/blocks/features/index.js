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

// Define blocks for each column.
const TEMPLATE = [
	[ 'gt-layout-blocks/icon', {
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/features',
	} ],
	[ 'gt-layout-blocks/heading', {
		placeholder: __( 'Feature', 'gt-layout-blocks' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/features',
	} ],
	[ 'core/paragraph', {
		placeholder: __( 'Write feature description...', 'gt-layout-blocks' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/features',
	} ],
];

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/features',
	{
		title: __( 'GT Features', 'gt-layout-blocks' ),

		description: __( 'Add a block that displays your product or service features.', 'gt-layout-blocks' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M485.5 0L576 160H474.9L405.7 0h79.8zm-128 0l69.2 160H149.3L218.5 0h139zm-267 0h79.8l-69.2 160H0L90.5 0zM0 192h100.7l123 251.7c1.5 3.1-2.7 5.9-5 3.3L0 192zm148.2 0h279.6l-137 318.2c-1 2.4-4.5 2.4-5.5 0L148.2 192zm204.1 251.7l123-251.7H576L357.3 446.9c-2.3 2.7-6.5-.1-5-3.2z" /></svg>,

		keywords: [
			__( 'GT Blocks', 'gt-layout-blocks' ),
			__( 'Icon', 'gt-layout-blocks' ),
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
