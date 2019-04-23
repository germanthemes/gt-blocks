/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

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

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z" /></svg>,

		attributes: {
			imagePosition: {
				type: 'string',
				default: 'left',
			},
			verticalAlignment: {
				type: 'string',
				default: 'top',
			},
			...imageBlockAttributes,
		},

		edit,

		save( props ) {
			const {
				imagePosition,
				verticalAlignment,
			} = props.attributes;

			const blockClasses = classnames( {
				[ `gt-image-position-${ imagePosition }` ]: 'left' !== imagePosition,
				[ `gt-vertical-align-${ verticalAlignment }` ]: 'top' !== verticalAlignment,
			} );

			return (
				<div className={ blockClasses }>

					<div className="gt-image-column">
						<ImageBlock
							blockClass="gt-image"
							{ ...props }
						/>
					</div>

					<div className="gt-text-column">
						<InnerBlocks.Content />
					</div>

				</div>
			);
		},
	},
);
