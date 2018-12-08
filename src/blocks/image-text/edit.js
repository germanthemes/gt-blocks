/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks,
	InspectorControls,
} = wp.editor;

const {
	BaseControl,
	PanelBody,
	SelectControl,
	Toolbar,
} = wp.components;

/**
 * Internal dependencies
 */
import {
	gtIconVerticalAlignTop,
	gtIconVerticalAlignCenter,
	gtIconVerticalAlignBottom,
} from '../../components/icons';

// Define vertical alignment controls.
const verticalAlignmentControls = {
	top: {
		icon: gtIconVerticalAlignTop,
		title: __( 'Top', 'gt-layout-blocks' ),
	},
	center: {
		icon: gtIconVerticalAlignCenter,
		title: __( 'Center', 'gt-layout-blocks' ),
	},
	bottom: {
		icon: gtIconVerticalAlignBottom,
		title: __( 'Bottom', 'gt-layout-blocks' ),
	},
};

// Define block template.
const TEMPLATE = [
	[ 'gt-layout-blocks/image', {} ],
	[ 'gt-layout-blocks/content', {
		template: [
			[ 'gt-layout-blocks/heading' ],
			[ 'core/paragraph' ],
		],
	} ],
];

/**
 * Block Edit Component
 */
class ImageTextEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			className,
		} = this.props;

		const {
			imagePosition,
			verticalAlignment,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `gt-image-position-${ imagePosition }` ]: 'left' !== imagePosition,
			[ `gt-vertical-align-${ verticalAlignment }` ]: 'top' !== verticalAlignment,
		} );

		return (
			<Fragment>

				<InspectorControls>

					<PanelBody title={ __( 'Layout Settings', 'gt-layout-blocks' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Image Position', 'gt-layout-blocks' ) }
							value={ imagePosition }
							onChange={ ( newLayout ) => setAttributes( { imagePosition: newLayout } ) }
							options={ [
								{ value: 'left', label: __( 'Left', 'gt-layout-blocks' ) },
								{ value: 'right', label: __( 'Right', 'gt-layout-blocks' ) },
							] }
						/>

						<BaseControl id="gt-vertical-alignment" label={ __( 'Vertical Alignment', 'gt-layout-blocks' ) }>
							<Toolbar
								className="gt-vertical-align-control"
								controls={
									[ 'top', 'center', 'bottom' ].map( control => {
										return {
											...verticalAlignmentControls[ control ],
											isActive: verticalAlignment === control,
											onClick: () => setAttributes( { verticalAlignment: control } ),
										};
									} )
								}
							/>
						</BaseControl>

					</PanelBody>

				</InspectorControls>

				<div className={ blockClasses }>

					<InnerBlocks
						allowedBlocks={ [ 'gt-layout-blocks/image', 'gt-layout-blocks/content' ] }
						template={ TEMPLATE }
						templateLock="all"
					/>

				</div>

			</Fragment>
		);
	}
}

export default ImageTextEdit;
