/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import edit from './edit';
import { default as backgroundAttributes } from '../../components/background-section/attributes';
import { default as BackgroundSection } from '../../components/background-section';

/**
 * Register block
 */
registerBlockType(
	'gt-blocks/hero-image',
	{
		title: __( 'GT Hero Image', 'gt-blocks' ),

		description: __( 'Add a block with an eye catching headline and call to action buttons.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M528 448H112c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm64-320c-26.5 0-48 21.5-48 48 0 7.1 1.6 13.7 4.4 19.8L476 239.2c-15.4 9.2-35.3 4-44.2-11.6L350.3 85C361 76.2 368 63 368 48c0-26.5-21.5-48-48-48s-48 21.5-48 48c0 15 7 28.2 17.7 37l-81.5 142.6c-8.9 15.6-28.9 20.8-44.2 11.6l-72.3-43.4c2.7-6 4.4-12.7 4.4-19.8 0-26.5-21.5-48-48-48S0 149.5 0 176s21.5 48 48 48c2.6 0 5.2-.4 7.7-.8L128 416h384l72.3-192.8c2.5.4 5.1.8 7.7.8 26.5 0 48-21.5 48-48s-21.5-48-48-48z" /></svg>,

		keywords: [
			__( 'GT Blocks', 'gt-blocks' ),
			__( 'Hero Image', 'gt-blocks' ),
			__( 'Text', 'gt-blocks' ),
		],

		attributes: {
			heroLayout: {
				type: 'string',
				default: 'left',
			},
			heroWidth: {
				type: 'string',
				default: '50',
			},
			heroImage: {
				type: 'boolean',
				default: true,
			},
			...backgroundAttributes,
		},

		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'core/group' ],
					transform: ( { blockAlignment, textColor, backgroundColor, customTextColor, customBackgroundColor, heroLayout }, columns ) => {
						let imageBlock;
						let columnsContent;

						// Transform GT Content to Group block.
						const contentBlock = [ createBlock( 'core/group', {
							textColor: columns[ 0 ].attributes.textColor,
							backgroundColor: columns[ 0 ].attributes.backgroundColor,
							customTextColor: columns[ 0 ].attributes.customTextColor,
							customBackgroundColor: columns[ 0 ].attributes.customBackgroundColor,
						}, columns[ 0 ].innerBlocks ) ];

						// Check if we have both GT Content and GT Image block.
						if ( columns.length > 1 ) {
							// Transform GT Image to Image block.
							imageBlock = [ createBlock( 'core/image', {
								id: columns[ 1 ].attributes.id,
								url: columns[ 1 ].attributes.url,
								alt: columns[ 1 ].attributes.alt,
								linkDestination: columns[ 1 ].attributes.linkDestination,
								href: columns[ 1 ].attributes.href,
							} ) ];
						} else {
							imageBlock = undefined;
						}

						if ( heroLayout === 'left' ) {
							columnsContent = [
								createBlock( 'core/column', {}, contentBlock ),
								createBlock( 'core/column', {}, imageBlock ),
							];
						} else {
							columnsContent = [
								createBlock( 'core/column', {}, imageBlock ),
								createBlock( 'core/column', {}, contentBlock ),
							];
						}

						const groupContent = [ createBlock(
							'core/columns',
							{},
							columnsContent,
						) ];

						return createBlock( 'core/group', {
							align: blockAlignment,
							textColor,
							backgroundColor,
							customTextColor,
							customBackgroundColor,
						},
						groupContent );
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
				heroLayout,
				heroWidth,
				heroImage,
			} = props.attributes;

			const heroClasses = classnames( 'gt-hero-section', {
				[ `gt-hero-layout-${ heroLayout }` ]: heroLayout,
				[ `gt-hero-content-width-${ heroWidth }` ]: '50' !== heroWidth,
				'gt-has-hero-image': heroImage,
			} );

			return (
				<BackgroundSection { ...props }>

					<div className={ heroClasses }>

						<InnerBlocks.Content />

					</div>

				</BackgroundSection>
			);
		},
	},
);
