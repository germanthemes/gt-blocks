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
} = wp.blockEditor;

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
	'gt-blocks/heading',
	{
		title: __( 'GT Heading', 'gt-blocks' ),

		description: __( 'Add a headline and style it.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M496 80V48c0-8.837-7.163-16-16-16H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.621v128H154.379V96H192c8.837 0 16-7.163 16-16V48c0-8.837-7.163-16-16-16H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.275v320H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.621V288H357.62v128H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.275V96H480c8.837 0 16-7.163 16-16z" /></svg>,

		keywords: [
			__( 'Title', 'gt-blocks' ),
			__( 'Subheading', 'gt-blocks' ),
			__( 'Subtitle', 'gt-blocks' ),
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
						return createBlock( 'gt-blocks/heading', {
							title: content,
						} );
					},
				},
				{
					type: 'block',
					blocks: [ 'core/heading' ],
					transform: ( { content, level, align } ) => {
						return createBlock( 'gt-blocks/heading', {
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
				selector: 'h1,h2,h3,h4,h5,h6',
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
				textAlignment,
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

			const headingClasses = classnames( 'gt-heading', {
				'has-background': backgroundColor || customBackgroundColor,
				[ textColorClass ]: textColorClass,
				[ backgroundClass ]: backgroundClass,
				[ fontSizeClass ]: fontSizeClass,
			} );

			const headingStyles = {
				textAlign: textAlignment,
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				color: textColorClass ? undefined : customTextColor,
				fontSize: fontSizeClass ? undefined : customFontSize,
			};

			return (
				<RichText.Content
					tagName={ 'h' + titleTag }
					className={ headingClasses }
					style={ headingStyles }
					value={ title }
				/>
			);
		},
	},
);
