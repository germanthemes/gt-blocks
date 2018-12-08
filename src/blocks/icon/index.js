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
	'gt-layout-blocks/icon',
	{
		title: __( 'GT Icon', 'gt-layout-blocks' ),

		description: __( 'Insert a single icon.', 'gt-layout-blocks' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z" /></svg>,

		keywords: [
			__( 'GT Blocks', 'gt-layout-blocks' ),
			__( 'Icon', 'gt-layout-blocks' ),
			__( 'Layout', 'gt-layout-blocks' ),
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
				type: 'number',
				default: 32,
			},
			iconPadding: {
				type: 'number',
				default: 32,
			},
			outlineBorderWidth: {
				type: 'number',
				default: 2,
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
				outlineBorderWidth,
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
				[ `gt-icon-${ iconLayout }` ]: ( iconLayout !== 'default' ),
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

			const paddingStyles = {
				paddingTop: iconPadding !== 32 ? iconPadding + 'px' : undefined,
				paddingBottom: iconPadding !== 32 ? iconPadding + 'px' : undefined,
				paddingLeft: ( iconLayout !== 'default' && iconPadding !== 32 ) ? iconPadding + 'px' : undefined,
				paddingRight: ( iconLayout !== 'default' && iconPadding !== 32 ) ? iconPadding + 'px' : undefined,
				borderWidth: ( iconLayout === 'outline' && outlineBorderWidth !== 2 ) ? outlineBorderWidth + 'px' : undefined,
			};

			const svgStyles = {
				width: iconSize !== 32 ? iconSize + 'px' : undefined,
				height: iconSize !== 32 ? iconSize + 'px' : undefined,
			};

			const pluginURL = select( 'gt-layout-blocks-store' ).getPluginURL();
			const svgURL = pluginURL + 'assets/icons/fontawesome.svg#' + icon;
			const svgClass = classnames( 'icon', `icon-${ icon }` );

			return (
				<div style={ blockStyles }>
					<div className={ iconClasses } style={ iconStyles }>

						<span className="gt-icon-svg" style={ paddingStyles } data-icon={ icon }>
							<svg className={ svgClass } style={ svgStyles } aria-hidden="true" role="img">
								<use href={ svgURL }></use>
							</svg>
						</span>

					</div>
				</div>
			);
		},
	},
);
