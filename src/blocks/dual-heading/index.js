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
		title: __( 'GT Dual Heading', 'gt-layout-blocks' ),

		description: __( 'Add a heading and subheading.', 'gt-layout-blocks' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M79.18 282.94a32.005 32.005 0 0 0-20.24 20.24L0 480l4.69 4.69 92.89-92.89c-.66-2.56-1.57-5.03-1.57-7.8 0-17.67 14.33-32 32-32s32 14.33 32 32-14.33 32-32 32c-2.77 0-5.24-.91-7.8-1.57l-92.89 92.89L32 512l176.82-58.94a31.983 31.983 0 0 0 20.24-20.24l33.07-84.07-98.88-98.88-84.07 33.07zM369.25 28.32L186.14 227.81l97.85 97.85 199.49-183.11C568.4 67.48 443.73-55.94 369.25 28.32z" /></svg>,

		keywords: [
			__( 'Title', 'gt-layout-blocks' ),
			__( 'Subheading', 'gt-layout-blocks' ),
			__( 'Subtitle', 'gt-layout-blocks' ),
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
				type: 'string',
				default: 'h2',
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
				type: 'boolean',
				default: true,
			},
			titleTextTransform: {
				type: 'boolean',
				default: false,
			},
			subtitleFontWeight: {
				type: 'boolean',
				default: false,
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
			subtitleColor: {
				type: 'string',
			},
			subtitleBackgroundColor: {
				type: 'string',
			},
			subtitleCustomTextColor: {
				type: 'string',
			},
			subtitleCustomBackgroundColor: {
				type: 'string',
			},
			fontSize: {
				type: 'string',
			},
			customFontSize: {
				type: 'number',
			},
			subtitleFontSize: {
				type: 'string',
			},
			subtitleCustomFontSize: {
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
				titleTextTransform,
				subtitleFontWeight,
				subtitleTextTransform,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
				subtitleColor,
				subtitleBackgroundColor,
				subtitleCustomTextColor,
				subtitleCustomBackgroundColor,
				fontSize,
				customFontSize,
				subtitleFontSize,
				subtitleCustomFontSize,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );
			const fontSizeClass = getFontSizeClass( fontSize );

			const subtitleColorClass = getColorClassName( 'color', subtitleColor );
			const subtitleBackgroundClass = getColorClassName( 'background-color', subtitleBackgroundColor );
			const subtitleFontSizeClass = getFontSizeClass( subtitleFontSize );

			const blockStyles = {
				textAlign: textAlignment,
			};

			const headingClasses = classnames( 'gt-heading', {
				'gt-is-bold': titleFontWeight,
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
				'gt-is-bold': subtitleFontWeight,
				'gt-is-uppercase': subtitleTextTransform,
				'has-background': subtitleBackgroundColor || subtitleCustomBackgroundColor,
				[ subtitleColorClass ]: subtitleColorClass,
				[ subtitleBackgroundClass ]: subtitleBackgroundClass,
				[ subtitleFontSizeClass ]: subtitleFontSizeClass,
			} );

			const subheadingStyles = {
				backgroundColor: subtitleBackgroundClass ? undefined : subtitleCustomBackgroundColor,
				color: subtitleColorClass ? undefined : subtitleCustomTextColor,
				fontSize: subtitleFontSizeClass ? undefined : subtitleCustomFontSize,
			};

			return (
				<header style={ blockStyles }>
					<RichText.Content
						tagName={ titleTag }
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
