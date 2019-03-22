/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';
import { default as contentContainerAttributes } from '../../components/content-container/attributes';
import { default as ContentContainer } from '../../components/content-container';

/**
 * Register block
 */
registerBlockType(
	'gt-blocks/column',
	{
		title: __( 'GT Column', 'gt-blocks' ),

		description: __( 'A single column within a grid block.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64V160h160v256zm224 0H288V160h160v256z" /></svg>,

		parent: [ 'gt-blocks/features', 'gt-blocks/grid-layout', 'gt-blocks/portfolio' ],

		attributes: {
			contentClass: {
				type: 'string',
				default: 'gt-column',
			},
			...contentContainerAttributes,
		},

		supports: {
			inserter: false,
		},

		edit,

		save( props ) {
			return (
				<div>
					<ContentContainer { ...props }>
						<InnerBlocks.Content />
					</ContentContainer>
				</div>
			);
		},
	},
);
