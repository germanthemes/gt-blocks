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
	gtIconImagePosition,
} from '../../components/icons';

// Define vertical alignment controls.
const verticalAlignmentControls = {
	top: {
		icon: gtIconVerticalAlignTop,
		title: __( 'Top' ),
	},
	center: {
		icon: gtIconVerticalAlignCenter,
		title: __( 'Center' ),
	},
	bottom: {
		icon: gtIconVerticalAlignBottom,
		title: __( 'Bottom' ),
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
class MediaTextEdit extends Component {
	render() {
		const {
			attributes,
			setAttributes,
			className,
		} = this.props;

		const {
			mediaPosition,
			verticalAlignment,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `gt-media-position-${ mediaPosition }` ]: 'left' !== mediaPosition,
			[ `gt-vertical-align-${ verticalAlignment }` ]: 'top' !== verticalAlignment,
		} );

		return (
			<Fragment>

				<InspectorControls>

					<PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<SelectControl
							label={ __( 'Media Position' ) }
							value={ mediaPosition }
							onChange={ ( newLayout ) => setAttributes( { mediaPosition: newLayout } ) }
							options={ [
								{ value: 'left', label: __( 'Left' ) },
								{ value: 'right', label: __( 'Right' ) },
							] }
						/>

						<BaseControl id="gt-vertical-alignment" label={ __( 'Vertical Alignment' ) }>
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

export default MediaTextEdit;
