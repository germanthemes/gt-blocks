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
	'gt-layout-blocks/heading',
	{
		title: __( 'GT Heading' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z" /><path fill="#010101" d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zm-2-8v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zm-1.5 6l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7z" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Heading' ),
			__( 'Title' ),
		],

		attributes: {
			title: {
				type: 'array',
				source: 'children',
				selector: '.gt-heading',
			},
			titleTag: {
				type: 'number',
				default: 2,
			},
			placeholder: {
				type: 'string',
			},
			textAlignment: {
				type: 'string',
			},
			headingLayout: {
				type: 'string',
				default: 'block',
			},
			paddingTop: {
				type: 'number',
			},
			paddingBottom: {
				type: 'number',
			},
			paddingLeft: {
				type: 'number',
			},
			paddingRight: {
				type: 'number',
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
				default: 4,
			},
		},

		edit,

		save( { attributes } ) {
			const {
				title,
				titleTag,
				textAlignment,
				headingLayout,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				fontWeight,
				italic,
				uppercase,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
				fontSize,
				customFontSize,
				border,
				borderWidth,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );
			const fontSizeClass = getFontSizeClass( fontSize );

			const blockStyles = {
				textAlign: textAlignment,
			};

			const headingClasses = classnames( 'gt-heading', {
				'gt-is-inline-block': 'inline-block' === headingLayout,
				'gt-is-bold': 'bold' === fontWeight,
				'gt-is-thin': 'thin' === fontWeight,
				'gt-is-italic': italic,
				'gt-is-uppercase': uppercase,
				'has-background': backgroundColor || customBackgroundColor,
				[ textColorClass ]: textColorClass,
				[ backgroundClass ]: backgroundClass,
				[ fontSizeClass ]: fontSizeClass,
				[ `gt-border-${ border }` ]: 'none' !== border,
			} );

			const headingStyles = {
				textAlign: 'block' === headingLayout ? textAlignment : undefined,
				paddingTop: 'undefined' !== typeof paddingTop ? paddingTop + 'px' : undefined,
				paddingBottom: 'undefined' !== typeof paddingBottom ? paddingBottom + 'px' : undefined,
				paddingLeft: 'undefined' !== typeof paddingLeft ? paddingLeft + 'px' : undefined,
				paddingRight: 'undefined' !== typeof paddingRight ? paddingRight + 'px' : undefined,
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				color: textColorClass ? undefined : customTextColor,
				fontSize: fontSizeClass ? undefined : customFontSize,
				borderWidth: borderWidth !== 4 ? borderWidth + 'px' : undefined,
			};

			const heading = <RichText.Content
				tagName={ 'h' + titleTag }
				className={ headingClasses }
				style={ headingStyles }
				value={ title }
			/>;

			if ( 'inline-block' === headingLayout ) {
				return (
					<div style={ blockStyles }>
						{ heading }
					</div>
				);
			}

			return heading;
		},
	},
);
