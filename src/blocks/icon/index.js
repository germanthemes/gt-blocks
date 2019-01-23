/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { select } = wp.data;
const { registerBlockType } = wp.blocks;
const { getColorClassName } = wp.editor;

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
	'gt-blocks/icon',
	{
		title: __( 'GT Icon', 'gt-blocks' ),

		description: __( 'Insert a single icon.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" /></svg>,

		keywords: [
			__( 'GT Blocks', 'gt-blocks' ),
			__( 'Icon', 'gt-blocks' ),
			__( 'Layout', 'gt-blocks' ),
		],

		attributes: {
			icon: {
				type: 'string',
				source: 'attribute',
				selector: '.gt-icon-svg',
				attribute: 'data-icon',
			},
			textAlignment: {
				type: 'string',
			},
			iconLayout: {
				type: 'string',
				default: 'default',
			},
			iconSize: {
				type: 'string',
				default: 'normal',
			},
			iconPadding: {
				type: 'string',
				default: 'normal',
			},
			borderWidth: {
				type: 'string',
				default: 'normal',
			},
			roundedCorners: {
				type: 'number',
				default: 0,
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

		edit,

		save( { attributes } ) {
			const {
				icon,
				textAlignment,
				iconLayout,
				iconSize,
				iconPadding,
				borderWidth,
				roundedCorners,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const blockStyles = {
				textAlign: textAlignment,
			};

			const iconClasses = classnames( 'gt-icon', {
				[ `gt-icon-${ iconLayout }` ]: 'default' !== iconLayout,
				[ `gt-icon-${ iconSize }` ]: 'normal' !== iconSize,
				[ `gt-icon-${ iconPadding }-padding` ]: 'normal' !== iconPadding,
				[ `gt-icon-${ borderWidth }-border` ]: 'normal' !== borderWidth && 'outline' === iconLayout,
				'has-text-color': textColor || customTextColor,
				[ textColorClass ]: textColorClass,
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
			} );

			const iconStyles = {
				color: textColorClass ? undefined : customTextColor,
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				borderRadius: ( iconLayout === 'square' && roundedCorners !== 0 ) ? roundedCorners + 'px' : undefined,
			};

			const pluginURL = select( 'gt-blocks-store' ).getPluginURL();
			const svgURL = pluginURL + 'assets/icons/fontawesome.svg#' + icon;
			const svgClasses = classnames( 'icon', `icon-${ icon }` );

			return (
				<div style={ blockStyles }>
					<div className={ iconClasses } style={ iconStyles }>

						<span className="gt-icon-svg" data-icon={ icon }>
							<svg className={ svgClasses } aria-hidden="true" role="img">
								<use href={ svgURL }></use>
							</svg>
						</span>

					</div>
				</div>
			);
		},
	},
);
