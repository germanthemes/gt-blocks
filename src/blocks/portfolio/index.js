/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';
import { default as GridContainer } from '../../components/grid-container';

/**
 * Register block
 */
registerBlockType(
	'gt-blocks/portfolio',
	{
		title: __( 'GT Portfolio', 'gt-blocks' ),

		description: __( 'Add a block that displays your projects or services in a grid layout.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.607 25.607 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z" /></svg>,

		keywords: [
			__( 'GT Blocks', 'gt-blocks' ),
			__( 'Image', 'gt-blocks' ),
			__( 'Grid', 'gt-blocks' ),
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
				type: 'string',
				default: 'normal',
			},
		},

		transforms: {
			to: [
				{
					type: 'block',
					isMultiBlock: true,
					blocks: [ 'core/columns' ],
					transform: ( {}, columns ) => {
						return createBlock(
							'core/columns',
							{},
							columns[ 0 ].map( ( { attributes, innerBlocks } ) => {
								let content;
								if ( attributes.backgroundColor || attributes.customBackgroundColor ) {
									content = [ createBlock( 'core/group', {
										textColor: attributes.textColor,
										backgroundColor: attributes.backgroundColor,
										customTextColor: attributes.customTextColor,
										customBackgroundColor: attributes.customBackgroundColor,
									}, innerBlocks ) ];
								} else {
									content = innerBlocks;
								}
								return createBlock( 'core/column', {}, content );
							} )
						);
					},
				},
			],
		},

		edit,

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
