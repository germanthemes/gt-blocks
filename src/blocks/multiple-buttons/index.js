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
	InnerBlocks,
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
	'gt-blocks/multiple-buttons',
	{
		title: __( 'GT Multiple Buttons', 'gt-blocks' ),

		description: __( 'Insert multiple buttons.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 304H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32zm0-192H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>,

		attributes: {
			customClass: {
				type: 'string',
			},
			buttons: {
				type: 'number',
				default: 2,
			},
			buttonAttributes: {
				type: 'array',
			},
			alignment: {
				type: 'string',
			},
		},

		transforms: {
			to: [
				{
					type: 'block',
					isMultiBlock: true,
					blocks: [ 'core/buttons' ],
					transform: ( {}, buttons ) => {
						// Creates the buttons block
						return createBlock(
							'core/buttons',
							{},
							// Loop the selected buttons
							buttons[ 0 ].map( ( { attributes } ) => {
								// Create singular button in the buttons block
								return createBlock( 'core/button', {
									url: attributes.url,
									title: attributes.title,
									text: attributes.text,
									textColor: attributes.textColor,
									backgroundColor: attributes.backgroundColor,
									customTextColor: attributes.customTextColor,
									customBackgroundColor: attributes.customBackgroundColor,
								} );
							} )
						);
					},
				},
			],
		},

		edit,

		save( { attributes } ) {
			const {
				customClass,
				alignment,
			} = attributes;

			const blockClasses = classnames( {
				[ `${ customClass }` ]: customClass,
				[ `gt-align-${ alignment }` ]: 'center' === alignment || 'right' === alignment,
			} );

			return (
				<div className={ blockClasses ? blockClasses : undefined }>

					<InnerBlocks.Content />

				</div>
			);
		},
	},
);
