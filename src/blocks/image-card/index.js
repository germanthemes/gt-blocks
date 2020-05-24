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
	getColorClassName,
	InnerBlocks,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';
import imageBlockAttributes from '../../components/image-block/attributes';
import ImageBlock from '../../components/image-block';

/**
 * Register block
 */
registerBlockType(
	'gt-blocks/image-card',
	{
		title: __( 'GT Image Card', 'gt-blocks' ),

		description: __( 'Insert a single image with a text card side-by-side.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path></svg>,

		attributes: {
			blockAlignment: {
				type: 'string',
				default: 'wide',
			},
			imagePosition: {
				type: 'string',
				default: 'left',
			},
			contentWidth: {
				type: 'string',
				default: '50',
			},
			verticalAlignment: {
				type: 'string',
				default: 'top',
			},
			columnGap: {
				type: 'string',
				default: 'normal',
			},
			overlayCard: {
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
			...imageBlockAttributes,
		},

		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'core/media-text' ],
					transform: ( { blockAlignment, id, url, alt, imagePosition, linkDestination, href, verticalAlignment, backgroundColor, customBackgroundColor }, innerBlocks ) => {
						return createBlock( 'core/media-text', {
							align: blockAlignment,
							mediaId: id,
							mediaUrl: url,
							mediaType: 'image',
							mediaAlt: alt,
							mediaPosition: imagePosition,
							linkDestination,
							href,
							verticalAlignment,
							backgroundColor,
							customBackgroundColor,
						}, innerBlocks );
					},
				},
			],
		},

		getEditWrapperProps( attributes ) {
			const { blockAlignment } = attributes;
			if ( 'wide' === blockAlignment || 'full' === blockAlignment ) {
				return { 'data-align': blockAlignment };
			}
		},

		edit,

		save( props ) {
			const {
				blockAlignment,
				imagePosition,
				contentWidth,
				verticalAlignment,
				columnGap,
				overlayCard,
				textColor,
				backgroundColor,
				customTextColor,
				customBackgroundColor,
			} = props.attributes;

			const textColorClass = getColorClassName( 'color', textColor );
			const backgroundClass = getColorClassName( 'background-color', backgroundColor );

			const blockClasses = classnames( {
				[ `align${ blockAlignment }` ]: 'default' !== blockAlignment,
				[ `gt-image-position-${ imagePosition }` ]: 'left' !== imagePosition,
				[ `gt-content-width-${ contentWidth }` ]: '50' !== contentWidth,
				[ `gt-vertical-align-${ verticalAlignment }` ]: 'top' !== verticalAlignment,
				[ `gt-${ columnGap }-column-gap` ]: 'normal' !== columnGap,
				'gt-overlay-card': overlayCard,
				'has-text-color': textColor || customTextColor,
				[ textColorClass ]: textColorClass,
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
			} );

			const blockStyles = {
				color: textColorClass ? undefined : customTextColor,
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			};

			return (
				<div className={ blockClasses } style={ blockStyles }>

					<div className="gt-image-card-columns">

						<div className="gt-image-column">
							<ImageBlock
								customClasses="gt-image"
								{ ...props }
							/>
						</div>

						<div className="gt-text-column">
							<InnerBlocks.Content />
						</div>

					</div>

				</div>
			);
		},
	},
);
