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

		description: __( 'Add a headline and style it.' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M496 80V48c0-8.837-7.163-16-16-16H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.621v128H154.379V96H192c8.837 0 16-7.163 16-16V48c0-8.837-7.163-16-16-16H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.275v320H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.621V288H357.62v128H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.275V96H480c8.837 0 16-7.163 16-16z" /></svg>,

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
