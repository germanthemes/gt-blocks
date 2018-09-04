/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const {
	getColorClassName,
	InnerBlocks,
} = wp.editor;

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/container',
	{
		title: __( 'GT Container' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /><path d="M0 0h24v24H0z" fill="none" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Container' ),
			__( 'Text' ),
		],

		attributes: {
			blockAlignment: {
				type: 'string',
				default: 'center',
			},
			contentWidth: {
				type: 'number',
				default: 720,
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
			backgroundImageId: {
				type: 'number',
			},
			backgroundImageUrl: {
				type: 'string',
				source: 'attribute',
				selector: '.gt-has-background-image',
				attribute: 'data-background-image',
			},
			imageOpacity: {
				type: 'number',
				default: 100,
			},
			backgroundPosition: {
				type: 'string',
				default: 'center center',
			},
			fixedBackground: {
				type: 'boolean',
				default: false,
			},
		},

		getEditWrapperProps( attributes ) {
			const { blockAlignment } = attributes;
			if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
				return { 'data-align': blockAlignment };
			}
		},

		edit,

		save( { attributes } ) {
			const {
				blockAlignment,
				contentWidth,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
				backgroundImageId,
				backgroundImageUrl,
				imageOpacity,
				backgroundPosition,
				fixedBackground,
			} = attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const blockClasses = classnames( {
				[ `align${ blockAlignment }` ]: ( blockAlignment !== 'center' ),
				'has-text-color': textColor || customTextColor,
				[ textColorClass ]: textColorClass,
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
				'gt-has-background-image': backgroundImageId,
				'gt-fixed-background': fixedBackground,
			} );

			const blockStyles = {
				color: textColorClass ? undefined : customTextColor,
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				backgroundImage: backgroundImageId ? `url(${ backgroundImageUrl })` : undefined,
				backgroundPosition: backgroundPosition,
			};

			const overlayClasses = classnames( 'gt-background-overlay', {
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
			} );

			const overlayColor = customBackgroundColor ? customBackgroundColor : '#ffffff';

			const overlayStyles = {
				backgroundColor: backgroundClass ? undefined : overlayColor,
				opacity: ( 100 - imageOpacity ) / 100,
			};

			const contentStyles = {
				maxWidth: contentWidth + 'px',
			};

			const dataBackgroundImage = backgroundImageId ? backgroundImageUrl : undefined;

			return (
				<div className={ blockClasses ? blockClasses : undefined } style={ blockStyles } data-background-image={ dataBackgroundImage }>

					{ backgroundImageId && (
						<div className={ overlayClasses } style={ overlayStyles }></div>
					) }

					<div className="gt-inner-content" style={ contentStyles }>
						<InnerBlocks.Content />
					</div>

				</div>
			);
		},
	},
);
