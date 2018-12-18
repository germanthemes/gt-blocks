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
	'gt-blocks/button',
	{
		title: __( 'GT Button', 'gt-blocks' ),

		description: __( 'Add a button and style it.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M304.793 243.891c33.639-18.537 53.657-54.16 53.657-95.693 0-48.236-26.25-87.626-68.626-104.179C265.138 34.01 240.849 32 209.661 32H24c-8.837 0-16 7.163-16 16v33.049c0 8.837 7.163 16 16 16h33.113v318.53H24c-8.837 0-16 7.163-16 16V464c0 8.837 7.163 16 16 16h195.69c24.203 0 44.834-1.289 66.866-7.584C337.52 457.193 376 410.647 376 350.014c0-52.168-26.573-91.684-71.207-106.123zM142.217 100.809h67.444c16.294 0 27.536 2.019 37.525 6.717 15.828 8.479 24.906 26.502 24.906 49.446 0 35.029-20.32 56.79-53.029 56.79h-76.846V100.809zm112.642 305.475c-10.14 4.056-22.677 4.907-31.409 4.907h-81.233V281.943h84.367c39.645 0 63.057 25.38 63.057 63.057.001 28.425-13.66 52.483-34.782 61.284z" /></svg>,

		keywords: [
			__( 'Link', 'gt-blocks' ),
			__( 'Call to Action', 'gt-blocks' ),
			__( 'German Themes', 'gt-blocks' ),
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
				selector: '.gt-button-inner',
			},
			placeholder: {
				type: 'string',
			},
			textAlignment: {
				type: 'string',
			},
			isUppercase: {
				type: 'boolean',
				default: false,
			},
			isBold: {
				type: 'boolean',
				default: false,
			},
			isItalic: {
				type: 'boolean',
				default: false,
			},
			buttonSize: {
				type: 'string',
				default: 'medium',
			},
			buttonShape: {
				type: 'string',
				default: 'squared',
			},
			hoverStyle: {
				type: 'string',
				default: 'lightened',
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
			customHoverColor: {
				type: 'string',
			},
		},

		edit,

		save( { attributes } ) {
			const {
				url,
				title,
				text,
				textAlignment,
				isUppercase,
				isBold,
				isItalic,
				buttonSize,
				buttonShape,
				hoverStyle,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
				hoverColor,
				customHoverColor,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );
			const hoverColorClass = getColorClassName( 'background-color', hoverColor );

			const blockClasses = classnames( {
				[ `gt-align-${ textAlignment }` ]: textAlignment,
				'has-text-color': textColor || customTextColor,
				[ textColorClass ]: textColorClass,
			} );

			const blockStyles = {
				color: textColorClass ? undefined : customTextColor,
			};

			const buttonClasses = classnames( 'gt-button', {
				[ `gt-button-${ buttonSize }` ]: buttonSize,
				[ `gt-button-${ buttonShape }` ]: 'squared' !== buttonShape,
				[ `gt-hover-style-${ hoverStyle }` ]: 'custom' !== hoverStyle,
				'gt-is-uppercase': isUppercase,
				'gt-is-bold': isBold,
				'gt-is-italic': isItalic,
				'has-hover-color': 'custom' === hoverStyle && ( hoverColorClass || customHoverColor ),
				[ hoverColorClass ]: 'custom' === hoverStyle && hoverColorClass,
			} );

			const buttonStyles = {
				backgroundColor: ( 'custom' === hoverStyle && ! hoverColorClass ) ? customHoverColor : undefined,
			};

			const backgroundClasses = classnames( 'gt-button-inner', {
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
			} );

			const backgroundStyles = {
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			};

			return (
				<div className={ blockClasses ? blockClasses : undefined } style={ blockStyles }>

					<a href={ url } title={ title } className={ buttonClasses } style={ buttonStyles }>
						<RichText.Content
							tagName="span"
							className={ backgroundClasses }
							style={ backgroundStyles }
							value={ text }
						/>
					</a>

				</div>
			);
		},
	},
);
