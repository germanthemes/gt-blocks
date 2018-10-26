/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
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
	'gt-layout-blocks/dual-heading',
	{
		title: __( 'GT Dual Heading' ),

		description: __( 'Add a heading and subheading.' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M496 80V48c0-8.837-7.163-16-16-16H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.621v128H154.379V96H192c8.837 0 16-7.163 16-16V48c0-8.837-7.163-16-16-16H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.275v320H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.621V288H357.62v128H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.275V96H480c8.837 0 16-7.163 16-16z" /></svg>,

		keywords: [
			__( 'Title' ),
			__( 'Subheading' ),
			__( 'Subtitle' ),
		],

		supports: {
			anchor: true,
		},

		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'core/paragraph' ],
					transform: ( { content } ) => {
						return createBlock( 'gt-layout-blocks/dual-heading', {
							title: content,
						} );
					},
				},
				{
					type: 'block',
					blocks: [ 'core/heading' ],
					transform: ( { content, level, align } ) => {
						return createBlock( 'gt-layout-blocks/dual-heading', {
							title: content,
							titleTag: level,
							textAlignment: align,
						} );
					},
				},
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/paragraph' ],
					transform: ( { title } ) => {
						return createBlock( 'core/paragraph', {
							content: title,
						} );
					},
				},
				{
					type: 'block',
					blocks: [ 'core/heading' ],
					transform: ( { title, titleTag, textAlignment } ) => {
						return createBlock( 'core/heading', {
							content: title,
							level: titleTag,
							align: textAlignment,
						} );
					},
				},
			],
		},

		attributes: {
			title: {
				source: 'html',
				selector: '.gt-heading',
			},
			titleTag: {
				type: 'number',
				default: 2,
			},
			titlePlaceholder: {
				type: 'string',
			},
			subtitle: {
				source: 'html',
				selector: '.gt-subheading',
			},
			subtitlePlaceholder: {
				type: 'string',
			},
			textAlignment: {
				type: 'string',
			},
			titleFontWeight: {
				type: 'string',
				default: 'bold',
			},
			titleFontStyle: {
				type: 'boolean',
				default: false,
			},
			titleTextTransform: {
				type: 'boolean',
				default: false,
			},
			subtitleFontWeight: {
				type: 'string',
				default: 'normal',
			},
			subtitleFontStyle: {
				type: 'boolean',
				default: true,
			},
			subtitleTextTransform: {
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
				title,
				titleTag,
				subtitle,
				textAlignment,
				titleFontWeight,
				titleFontStyle,
				titleTextTransform,
				subtitleFontWeight,
				subtitleFontStyle,
				subtitleTextTransform,
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

			const blockStyles = {
				textAlign: textAlignment,
			};

			const headingClasses = classnames( 'gt-heading', {
				'gt-is-bold': 'bold' === titleFontWeight,
				'gt-is-thin': 'thin' === titleFontWeight,
				'gt-is-italic': titleFontStyle,
				'gt-is-uppercase': titleTextTransform,
				'has-background': backgroundColor || customBackgroundColor,
				[ textColorClass ]: textColorClass,
				[ backgroundClass ]: backgroundClass,
				[ fontSizeClass ]: fontSizeClass,
			} );

			const headingStyles = {
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				color: textColorClass ? undefined : customTextColor,
				fontSize: fontSizeClass ? undefined : customFontSize,
			};

			const subheadingClasses = classnames( 'gt-subheading', {
				'gt-is-bold': 'bold' === subtitleFontWeight,
				'gt-is-thin': 'thin' === subtitleFontWeight,
				'gt-is-italic': subtitleFontStyle,
				'gt-is-uppercase': subtitleTextTransform,
				'has-background': backgroundColor || customBackgroundColor,
				[ textColorClass ]: textColorClass,
				[ backgroundClass ]: backgroundClass,
				[ fontSizeClass ]: fontSizeClass,
			} );

			const subheadingStyles = {};

			return (
				<header style={ blockStyles }>
					<RichText.Content
						tagName={ 'h' + titleTag }
						className={ headingClasses }
						style={ headingStyles }
						value={ title }
					/>

					<RichText.Content
						tagName="span"
						className={ subheadingClasses }
						style={ subheadingStyles }
						value={ subtitle }
					/>
				</header>
			);
		},
	},
);
