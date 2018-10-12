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
		title: __( 'GT Icon' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Icon' ),
			__( 'Layout' ),
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
