/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import './style.scss';
import { default as GridEdit } from '../../components/grid-container/edit';
import { default as GridContainer } from '../../components/grid-container';

/**
 * Register block
 */
registerBlockType(
	'gt-blocks/grid-layout',
	{
		title: __( 'GT Grid Layout', 'gt-blocks' ),

		description: __( 'Add a block that displays child blocks in a grid layout.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z" /></svg>,

		keywords: [
			__( 'GT Blocks', 'gt-blocks' ),
			__( 'Multiple', 'gt-blocks' ),
			__( 'Columns', 'gt-blocks' ),
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

		edit( props ) {
			return (
				<GridEdit
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
