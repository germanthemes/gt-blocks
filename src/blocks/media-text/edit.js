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
	PanelBody,
	SelectControl,
} = wp.components;

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
		} = attributes;

		const blockClasses = classnames( className, {
			[ `gt-media-position-${ mediaPosition }` ]: 'left' !== mediaPosition,
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
