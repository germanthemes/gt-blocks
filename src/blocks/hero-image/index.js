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
import { default as backgroundAttributes } from '../../components/background-section/attributes';
import { default as BackgroundSection } from '../../components/background-section';

/**
 * Register block
 */
registerBlockType(
	'gt-layout-blocks/hero-image',
	{
		title: __( 'GT Hero Image' ),

		description: __( 'Add a description here' ),

		category: 'gt-layout-blocks',

		icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /><path d="M0 0h24v24H0z" fill="none" /></svg>,

		keywords: [
			__( 'German Themes' ),
			__( 'Hero Image' ),
			__( 'Text' ),
		],

		attributes: {
			heroLayout: {
				type: 'string',
				default: 'full',
			},
			heroImage: {
				type: 'boolean',
			},
			...backgroundAttributes,
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
			} = props.attributes;

			const heroClasses = classnames( 'gt-hero-section', {
				[ `gt-hero-layout-${ heroLayout }` ]: heroLayout,
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
