/**
 * External dependencies
 */
import classnames from 'classnames';
import { partial, castArray, last } from 'lodash';
const { getComputedStyle } = window;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { dispatch, select, withDispatch, withSelect } = wp.data;
const {
	Component,
	Fragment,
} = wp.element;

const {
	ContrastChecker,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	IconButton,
	PanelBody,
	withFallbackStyles,
} = wp.components;

const {
	cloneBlock,
} = wp.blocks;

/**
 * Internal dependencies
 */
import { default as PaddingOptions } from '../../components/padding-options';

/**
 * Block Edit Component
 */
class columnEdit extends Component {
	duplicateColumn() {
		const {
			getBlocksByClientId,
			getBlockIndex,
			getBlockRootClientId,
		} = select( 'core/editor' );

		const {
			insertBlocks,
			updateBlockAttributes,
		} = dispatch( 'core/editor' );

		// Get current block.
		const { clientId } = this.props;
		const block = getBlocksByClientId( clientId )[ 0 ];

		// Get parent block.
		const rootClientId = getBlockRootClientId( clientId );
		const parentBlock = getBlocksByClientId( rootClientId )[ 0 ];

		// Get position to insert duplicated block.
		const lastSelectedIndex = getBlockIndex( last( castArray( clientId ) ), rootClientId );

		// Clone and insert block.
		const clonedBlock = cloneBlock( block );
		insertBlocks( clonedBlock, lastSelectedIndex + 1, rootClientId );

		// Update number of items in parent block.
		updateBlockAttributes( rootClientId, { items: parentBlock.attributes.items + 1 } );
	}

	removeColumn() {
		const {
			getBlocksByClientId,
			getBlockRootClientId,
		} = select( 'core/editor' );

		const {
			removeBlocks,
			updateBlockAttributes,
		} = dispatch( 'core/editor' );

		// Get parent block.
		const rootClientId = getBlockRootClientId( this.props.clientId );
		const parentBlock = getBlocksByClientId( rootClientId )[ 0 ];

		// Remove block.
		removeBlocks( this.props.clientId );

		// Update number of items in parent block.
		updateBlockAttributes( rootClientId, { items: parentBlock.attributes.items - 1 } );
	}

	render() {
		const {
			attributes,
			setAttributes,
			backgroundColor,
			setBackgroundColor,
			fallbackBackgroundColor,
			textColor,
			setTextColor,
			fallbackTextColor,
			className,
			isSelected,
			isParentBlockSelected,
			isChildBlockSelected,
			onMoveUp,
			onMoveDown,
			isFirstColumn,
			isLastColumn,
		} = this.props;

		const {
			allowedBlocks,
			template,
			templateLock,
			paddingClass,
			paddingVertical,
			paddingHorizontal,
		} = attributes;

		const columnClasses = classnames( 'gt-column', {
			[ `gt-padding-${ paddingClass }` ]: paddingClass,
			'has-text-color': textColor.color,
			[ textColor.class ]: textColor.class,
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const paddingStyles = ! paddingClass && backgroundColor.color;

		const columnStyles = {
			display: paddingStyles && paddingVertical === 0 ? 'flex' : undefined,
			paddingTop: paddingStyles && paddingVertical !== 24 ? paddingVertical + 'px' : undefined,
			paddingBottom: paddingStyles && paddingVertical !== 24 ? paddingVertical + 'px' : undefined,
			paddingLeft: paddingStyles && paddingHorizontal !== 24 ? paddingHorizontal + 'px' : undefined,
			paddingRight: paddingStyles && paddingHorizontal !== 24 ? paddingHorizontal + 'px' : undefined,
			color: textColor.class ? undefined : textColor.color,
			backgroundColor: backgroundColor.class ? undefined : backgroundColor.color,
		};

		return (
			<Fragment>

				<InspectorControls key="inspector">

					{ backgroundColor.color && (
						<PanelBody title={ __( 'Padding Options' ) } initialOpen={ false } className="gt-panel-padding-options gt-panel">

							<PaddingOptions
								title={ __( 'Column Padding' ) }
								paddingClass={ paddingClass }
								paddingVertical={ paddingVertical }
								paddingHorizontal={ paddingHorizontal }
								setPadding={ ( atts ) => setAttributes( atts ) }
							/>

						</PanelBody>
					) }

					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color' ),
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

				<div className={ className }>

					<div className={ columnClasses } style={ columnStyles }>

						<InnerBlocks
							template={ template || undefined }
							templateLock={ templateLock || false }
							{ ...( allowedBlocks && { allowedBlocks } ) }
						/>

					</div>

					{ ( isSelected || isParentBlockSelected || isChildBlockSelected ) && (
						<div className="gt-column-controls">

							<IconButton
								className="move-up-column"
								label={ __( 'Move up' ) }
								icon="arrow-left-alt2"
								onClick={ isFirstColumn ? null : onMoveUp }
								disabled={ isFirstColumn }
							/>

							<IconButton
								className="move-down-column"
								label={ __( 'Move down' ) }
								icon="arrow-right-alt2"
								onClick={ isLastColumn ? null : onMoveDown }
								disabled={ isLastColumn }
							/>

							<IconButton
								className="duplicate-column"
								label={ __( 'Duplicate' ) }
								icon="admin-page"
								onClick={ () => this.duplicateColumn() }
							/>

							<IconButton
								className="remove-column"
								label={ __( 'Remove' ) }
								icon="trash"
								onClick={ () => this.removeColumn() }
							/>
						</div>
					) }

				</div>

			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const {
			getBlockCount,
			getBlockIndex,
			getBlockRootClientId,
			isBlockSelected,
			hasSelectedInnerBlock,
		} = select( 'core/editor' );

		const rootClientId = getBlockRootClientId( clientId );
		const columnIndex = getBlockIndex( clientId, rootClientId );
		const columnCount = getBlockCount( rootClientId );

		return {
			isParentBlockSelected: isBlockSelected( rootClientId ),
			isChildBlockSelected: hasSelectedInnerBlock( rootClientId, true ),
			isFirstColumn: 0 === columnIndex,
			isLastColumn: columnCount === ( columnIndex + 1 ),
			rootClientId,
		};
	} ),
	withDispatch( ( dispatch, { clientId, rootClientId } ) => {
		const { moveBlocksDown, moveBlocksUp } = dispatch( 'core/editor' );
		return {
			onMoveDown: partial( moveBlocksDown, clientId, rootClientId ),
			onMoveUp: partial( moveBlocksUp, clientId, rootClientId ),
		};
	} ),
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
] )( columnEdit );
