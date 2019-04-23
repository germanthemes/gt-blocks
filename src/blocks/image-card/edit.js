/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const {
	__,
} = wp.i18n;

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
import ImageBlockEdit from '../../components/image-block/edit';
import {
	gtIconVerticalAlignTop,
	gtIconVerticalAlignCenter,
	gtIconVerticalAlignBottom,
} from '../../components/icons';

// Define vertical alignment controls.
const verticalAlignmentControls = {
	top: {
		icon: gtIconVerticalAlignTop,
		title: __( 'Top', 'gt-blocks' ),
	},
	center: {
		icon: gtIconVerticalAlignCenter,
		title: __( 'Center', 'gt-blocks' ),
	},
	bottom: {
		icon: gtIconVerticalAlignBottom,
		title: __( 'Bottom', 'gt-blocks' ),
	},
};

// Define block template.
const TEMPLATE = [
	[ 'gt-blocks/content', {
		template: [
			[ 'core/paragraph' ],
		],
	} ],
];

/**
 * Block Edit Component
 */
class ImageCardEdit extends Component {
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
					<PanelBody title={ __( 'Layout Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Image Position', 'gt-blocks' ) }
							value={ imagePosition }
							onChange={ ( newLayout ) => setAttributes( { imagePosition: newLayout } ) }
							options={ [
								{ value: 'left', label: __( 'Left', 'gt-blocks' ) },
								{ value: 'right', label: __( 'Right', 'gt-blocks' ) },
							] }
						/>

						<BaseControl id="gt-vertical-alignment" label={ __( 'Vertical Alignment', 'gt-blocks' ) }>
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

					<div className="gt-image-column">

						<ImageBlockEdit
							customClasses="gt-image"
							{ ...this.props }
						/>

					</div>

					<div className="gt-text-column">

						<InnerBlocks
							allowedBlocks={ [ 'gt-blocks/content' ] }
							template={ TEMPLATE }
							templateLock="all"
						/>

					</div>

				</div>

			</Fragment>
		);
	}
}

export default ImageCardEdit;
