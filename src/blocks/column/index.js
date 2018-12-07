/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	getColorClassName,
	InnerBlocks,
} = wp.editor;

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
	'gt-layout-blocks/column',
	{
		title: __( 'GT Column' ),

		description: __( 'A single column within a grid block.' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64V160h160v256zm224 0H288V160h160v256z" /></svg>,

		parent: [ 'gt-layout-blocks/features', 'gt-layout-blocks/grid-layout', 'gt-layout-blocks/portfolio' ],

		attributes: {
			allowedBlocks: {
				type: 'array',
			},
			template: {
				type: 'array',
			},
			templateLock: {
				type: 'string',
			},
			textColor: {
				type: 'string',
			},
			backgroundColor: {
				type: 'string',
			},
			customTextColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
		},

		supports: {
			inserter: false,
		},

		edit,

		save( { attributes } ) {
			const {
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const columnClasses = classnames( 'gt-column', {
				'has-text-color': textColor || customTextColor,
				[ textColorClass ]: textColorClass,
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
			} );

			const columnStyles = {
				color: textColorClass ? undefined : customTextColor,
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			};

			return (
				<div>
					<div className={ columnClasses } style={ columnStyles }>

						<InnerBlocks.Content />

					</div>
				</div>
			);
		},
	},
);
