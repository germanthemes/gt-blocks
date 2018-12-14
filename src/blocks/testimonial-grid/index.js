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
	[ 'core/quote', {
		placeholder: __( 'Write testimonial...', 'gt-layout-blocks' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/testimonial-grid',
	} ],
];

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/testimonial-grid',
	{
		title: __( 'GT Testimonial Grid', 'gt-layout-blocks' ),

		description: __( 'Displays your testimonials in a grid layout.', 'gt-layout-blocks' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M485.5 0L576 160H474.9L405.7 0h79.8zm-128 0l69.2 160H149.3L218.5 0h139zm-267 0h79.8l-69.2 160H0L90.5 0zM0 192h100.7l123 251.7c1.5 3.1-2.7 5.9-5 3.3L0 192zm148.2 0h279.6l-137 318.2c-1 2.4-4.5 2.4-5.5 0L148.2 192zm204.1 251.7l123-251.7H576L357.3 446.9c-2.3 2.7-6.5-.1-5-3.2z" /></svg>,

		keywords: [
			__( 'Reviews', 'gt-layout-blocks' ),
			__( 'Reference', 'gt-layout-blocks' ),
			__( 'Grid', 'gt-layout-blocks' ),
		],

		attributes: {
			items: {
				type: 'number',
				default: 2,
			},
			columns: {
				type: 'number',
				default: 2,
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
