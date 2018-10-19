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

		description: __( 'Insert a single icon.' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M264 448H56s60-42.743 60-176H84c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h40.209C95.721 210.56 76 181.588 76 148c0-46.392 37.608-84 84-84s84 37.608 84 84c0 33.588-19.721 62.56-48.209 76H236c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12h-32c0 133.257 60 176 60 176zm28 16H28c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h264c6.627 0 12-5.373 12-12v-24c0-6.627-5.373-12-12-12z" /></svg>,

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
