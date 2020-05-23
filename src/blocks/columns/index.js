/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';

/**
 * Register block
 */
registerBlockType(
	'gt-blocks/columns',
	{
		title: __( 'GT Columns', 'gt-blocks' ),

		description: __( 'Display your content in multiple columns with flexible widths.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64V160h160v256zm224 0H288V160h160v256z" /></svg>,

		keywords: [
			__( 'GT Blocks', 'gt-blocks' ),
			__( 'Column', 'gt-blocks' ),
			__( 'Layout', 'gt-blocks' ),
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
			columnLayout: {
				type: 'string',
				default: '50-50',
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
			const {
				columns,
				columnLayout,
				columnGap,
			} = props.attributes;

			const columnClasses = classnames( 'gt-columns-container', {
				[ `gt-columns-${ columnLayout }` ]: columnLayout,
				[ `gt-column-count-${ columns }` ]: columns,
				[ `gt-${ columnGap }-column-gap` ]: 'normal' !== columnGap,
			} );

			return (
				<div>
					<div className={ columnClasses }>

						<InnerBlocks.Content />

					</div>
				</div>
			);
		},
	},
);
