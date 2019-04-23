/**
 * External dependencies
 */
import classnames from 'classnames';
const { getComputedStyle } = window;

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const { __ } = wp.i18n;
const { compose } = wp.compose;

const {
	BlockControls,
	ContrastChecker,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	BaseControl,
	PanelBody,
	Toolbar,
	withFallbackStyles,
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
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
		} = this.props;

		const {
			imagePosition,
			verticalAlignment,
		} = attributes;

		const blockClasses = classnames( className, {
			[ `gt-image-position-${ imagePosition }` ]: 'left' !== imagePosition,
			[ `gt-vertical-align-${ verticalAlignment }` ]: 'top' !== verticalAlignment,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const blockStyles = {
			color: textColor.class ? undefined : textColor.color,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
		};

		return (
			<Fragment>

				<BlockControls>

					<Toolbar
						className="gt-image-position-control"
						controls={ [ {
							icon: 'align-pull-left',
							title: __( 'Show image on left', 'gt-blocks' ),
							isActive: imagePosition === 'left',
							onClick: () => setAttributes( { imagePosition: 'left' } ),
						}, {
							icon: 'align-pull-right',
							title: __( 'Show image on right', 'gt-blocks' ),
							isActive: imagePosition === 'right',
							onClick: () => setAttributes( { imagePosition: 'right' } ),
						} ] }
					/>

				</BlockControls>

				<InspectorControls>

					<PanelBody title={ __( 'Layout Settings', 'gt-blocks' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

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

				<div className={ blockClasses } style={ blockStyles }>

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

				<InspectorControls>

					<PanelColorSettings
						title={ __( 'Color Settings', 'gt-blocks' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color', 'gt-blocks' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'gt-blocks' ),
							},
						] }
					>
						<ContrastChecker
							{ ...{
								textColor: textColor.color,
								backgroundColor: backgroundColor.color,
								fallbackTextColor,
								fallbackBackgroundColor,
							} }
						/>
					</PanelColorSettings>

				</InspectorControls>

			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	withFallbackStyles( ( node, ownProps ) => {
		const { textColor, backgroundColor } = ownProps.attributes;
		const editableNode = node.querySelector( '[contenteditable="true"]' );
		//verify if editableNode is available, before using getComputedStyle.
		const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
		return {
			fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
			fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		};
	} ),
] )( ImageCardEdit );
