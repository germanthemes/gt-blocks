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
	RichText,
	getColorClassName,
	getFontSizeClass,
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
	'gt-layout-blocks/button',
	{
		title: __( 'GT Button' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z" /><path fill="#010101" d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zm-2-8v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zm-1.5 6l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7z" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Button' ),
			__( 'Title' ),
		],

		attributes: {
			url: {
				type: 'string',
				source: 'attribute',
				selector: 'a',
				attribute: 'href',
			},
			title: {
				type: 'string',
				source: 'attribute',
				selector: 'a',
				attribute: 'title',
			},
			text: {
				type: 'array',
				source: 'children',
				selector: '.gt-button-text',
			},
			placeholder: {
				type: 'string',
			},
			fontStyle: {
				type: 'string',
				default: 'bold',
			},
			uppercase: {
				type: 'boolean',
				default: false,
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
			fontSize: {
				type: 'string',
			},
			customFontSize: {
				type: 'number',
			},
		},

		edit,

		save( { attributes } ) {
			const {
				url,
				title,
				text,
				fontStyle,
				uppercase,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
				fontSize,
				customFontSize,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );
			const fontSizeClass = getFontSizeClass( fontSize );

			const blockClasses = {};
			const blockStyles = {};

			const buttonClasses = classnames( 'gt-button', {
				'gt-is-bold': 'bold' === fontStyle || 'bold-italic' === fontStyle,
				'gt-is-italic': 'italic' === fontStyle || 'bold-italic' === fontStyle,
				'gt-is-uppercase': uppercase,
				[ fontSizeClass ]: fontSizeClass,
			} );

			const buttonStyles = {
				fontSize: fontSizeClass ? undefined : customFontSize,
			};

			const textClasses = classnames( 'gt-button-text', {
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
				'has-text-color': textColor || customTextColor,
				[ textColorClass ]: textColorClass,
			} );

			const textStyles = {
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				color: textColorClass ? undefined : customTextColor,
			};

			return (
				<div className={ blockClasses ? blockClasses : undefined } style={ blockStyles }>

					<a
						href={ url }
						title={ title }
						className={ buttonClasses }
						style={ buttonStyles }
					>
						<RichText.Content
							tagName="span"
							className={ textClasses }
							style={ textStyles }
							value={ text }
						/>
					</a>

				</div>
			);
		},
	},
);
