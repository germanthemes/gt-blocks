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
				selector: '.gt-button',
			},
			placeholder: {
				type: 'string',
			},
			textAlignment: {
				type: 'string',
			},
			buttonSize: {
				type: 'string',
			},
			paddingVertical: {
				type: 'number',
				default: 6,
			},
			paddingHorizontal: {
				type: 'number',
				default: 18,
			},
			buttonShape: {
				type: 'string',
				default: 'square',
			},
			roundedCorners: {
				type: 'number',
				default: 12,
			},
			fontWeight: {
				type: 'string',
				default: 'bold',
			},
			italic: {
				type: 'boolean',
				default: false,
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
			hoverColor: {
				type: 'string',
			},
			hoverBackgroundColor: {
				type: 'string',
			},
			customHoverColor: {
				type: 'string',
			},
			customHoverBackgroundColor: {
				type: 'string',
			},
			fontSize: {
				type: 'string',
			},
			customFontSize: {
				type: 'number',
			},
			border: {
				type: 'string',
				default: 'none',
			},
			borderWidth: {
				type: 'number',
				default: 2,
			},
			borderColor: {
				type: 'string',
				default: 'text-color',
			},
			ghostButton: {
				type: 'boolean',
				default: false,
			},
		},

		edit,

		save( { attributes } ) {
			const {
				url,
				title,
				text,
				textAlignment,
				buttonSize,
				paddingVertical,
				paddingHorizontal,
				buttonShape,
				roundedCorners,
				fontWeight,
				italic,
				uppercase,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
				hoverColor,
				hoverBackgroundColor,
				customHoverColor,
				customHoverBackgroundColor,
				fontSize,
				customFontSize,
				border,
				borderWidth,
				borderColor,
				ghostButton,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const hoverColorClass = getColorClassName( 'color', hoverColor );
			const hoverBackgroundClass = getColorClassName( 'background-color', hoverBackgroundColor );

			const fontSizeClass = getFontSizeClass( fontSize );

			const blockClasses = classnames( {
				[ `gt-align-${ textAlignment }` ]: textAlignment,
			} );

			const hoverClasses = classnames( 'gt-button-wrap', {
				[ `gt-button-${ buttonShape }` ]: 'square' !== buttonShape,
				'gt-ghost-button': ghostButton,
				'has-hover-text-color': hoverColor || customHoverColor,
				[ hoverColorClass ]: hoverColorClass,
				'has-hover-background': hoverBackgroundColor || customHoverBackgroundColor,
				[ hoverBackgroundClass ]: hoverBackgroundClass,
			} );

			const hoverStyles = {
				borderRadius: 'rounded' === buttonShape && 12 !== roundedCorners ? roundedCorners + 'px' : undefined,
				color: hoverColorClass ? undefined : customHoverColor,
				backgroundColor: hoverBackgroundClass ? undefined : customHoverBackgroundColor,
			};

			const buttonClasses = classnames( 'gt-button', {
				[ `gt-button-${ buttonSize }` ]: buttonSize,
				'gt-is-bold': 'bold' === fontWeight,
				'gt-is-thin': 'thin' === fontWeight,
				'gt-is-italic': italic,
				'gt-is-uppercase': uppercase,
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
				'has-text-color': textColor || customTextColor,
				[ textColorClass ]: textColorClass,
				[ fontSizeClass ]: fontSizeClass,
				'has-border': 'none' !== border,
				[ `gt-border-${ border }` ]: 'none' !== border,
				[ `gt-border-${ borderColor }` ]: 'text-color' !== borderColor,
				'gt-ghost-button': ghostButton,
			} );

			const buttonStyles = {
				paddingTop: ! buttonSize && paddingVertical !== 6 ? paddingVertical + 'px' : undefined,
				paddingBottom: ! buttonSize && paddingVertical !== 6 ? paddingVertical + 'px' : undefined,
				paddingLeft: ! buttonSize && paddingHorizontal !== 18 ? paddingHorizontal + 'px' : undefined,
				paddingRight: ! buttonSize && paddingHorizontal !== 18 ? paddingHorizontal + 'px' : undefined,
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				color: textColorClass ? undefined : customTextColor,
				fontSize: fontSizeClass ? undefined : customFontSize,
				borderWidth: borderWidth !== 2 ? borderWidth + 'px' : undefined,
			};

			return (
				<div className={ blockClasses ? blockClasses : undefined }>

					<span className={ hoverClasses } style={ hoverStyles }>
						<RichText.Content
							tagName="a"
							href={ url }
							title={ title }
							className={ buttonClasses }
							style={ buttonStyles }
							value={ text }
						/>
					</span>

				</div>
			);
		},
	},
);
