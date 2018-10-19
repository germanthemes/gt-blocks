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

		description: __( 'Add a button and style it.' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M304.793 243.891c33.639-18.537 53.657-54.16 53.657-95.693 0-48.236-26.25-87.626-68.626-104.179C265.138 34.01 240.849 32 209.661 32H24c-8.837 0-16 7.163-16 16v33.049c0 8.837 7.163 16 16 16h33.113v318.53H24c-8.837 0-16 7.163-16 16V464c0 8.837 7.163 16 16 16h195.69c24.203 0 44.834-1.289 66.866-7.584C337.52 457.193 376 410.647 376 350.014c0-52.168-26.573-91.684-71.207-106.123zM142.217 100.809h67.444c16.294 0 27.536 2.019 37.525 6.717 15.828 8.479 24.906 26.502 24.906 49.446 0 35.029-20.32 56.79-53.029 56.79h-76.846V100.809zm112.642 305.475c-10.14 4.056-22.677 4.907-31.409 4.907h-81.233V281.943h84.367c39.645 0 63.057 25.38 63.057 63.057.001 28.425-13.66 52.483-34.782 61.284z" /></svg>,

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
