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

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /><path d="M0 0h24v24H0z" fill="none" /></svg>,

		parent: [ 'gt-layout-blocks/features' ],

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
			paddingClass: {
				type: 'string',
			},
			paddingVertical: {
				type: 'number',
				default: 24,
			},
			paddingHorizontal: {
				type: 'number',
				default: 24,
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
				paddingClass,
				paddingVertical,
				paddingHorizontal,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const columnClasses = classnames( 'gt-column', {
				[ `gt-padding-${ paddingClass }` ]: paddingClass,
				'has-text-color': textColor || customTextColor,
				[ textColorClass ]: textColorClass,
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
			} );

			const paddingStyles = ! paddingClass && ( textColor || customTextColor );

			const columnStyles = {
				paddingTop: paddingStyles && paddingVertical !== 24 ? paddingVertical + 'px' : undefined,
				paddingBottom: paddingStyles && paddingVertical !== 24 ? paddingVertical + 'px' : undefined,
				paddingLeft: paddingStyles && paddingHorizontal !== 24 ? paddingHorizontal + 'px' : undefined,
				paddingRight: paddingStyles && paddingHorizontal !== 24 ? paddingHorizontal + 'px' : undefined,
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
