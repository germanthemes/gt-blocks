/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;

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
	'gt-blocks/image-card',
	{
		title: __( 'GT Image Card', 'gt-blocks' ),

		description: __( 'Insert a single image with a text card side-by-side.', 'gt-blocks' ),

		category: 'gt-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z" /></svg>,

		attributes: {
			id: {
				type: 'number',
			},
			url: {
				type: 'string',
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			alt: {
				type: 'string',
				source: 'attribute',
				selector: 'img',
				attribute: 'alt',
				default: '',
			},
			size: {
				type: 'string',
				default: 'full',
			},
			maxWidth: {
				type: 'string',
				default: '100',
			},
			href: {
				type: 'string',
				source: 'attribute',
				selector: 'figure > a',
				attribute: 'href',
			},
			linkDestination: {
				type: 'string',
				default: 'none',
			},
		},

		edit,

		save( { attributes } ) {
			const {
				id,
				url,
				alt,
				maxWidth,
				href,
			} = attributes;

			const blockClasses = classnames( {
				[ `gt-max-width-${ maxWidth }` ]: '100' !== maxWidth,
			} );

			const image = (
				<img
					src={ url }
					alt={ alt }
					className={ id ? `wp-image-${ id }` : null }
				/>
			);

			const figure = (
				<Fragment>
					{ href ? <a href={ href }>{ image }</a> : image }
				</Fragment>
			);

			return (
				<figure className={ blockClasses ? blockClasses : undefined }>
					{ figure }
				</figure>
			);
		},
	},
);
