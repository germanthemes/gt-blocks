/**
 * External dependencies
 */
import classnames from 'classnames';
import { forEach, map, partial, castArray, last } from 'lodash';
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
	BaseControl,
	Button,
	ButtonGroup,
	IconButton,
	PanelBody,
	RangeControl,
	withFallbackStyles,
} = wp.components;

const {
	cloneBlock,
} = wp.blocks;

/* Define Padding Sizes */
const paddingSizes = {
	small: {
		name: 'S',
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	medium: {
		name: 'M',
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	large: {
		name: 'L',
		paddingVertical: 32,
		paddingHorizontal: 32,
	},
};

/**
 * Block Edit Component
 */
class columnEdit extends Component {
	constructor() {
		super( ...arguments );

		this.setPaddingClass = this.setPaddingClass.bind( this );
		this.setVerticalPadding = this.setVerticalPadding.bind( this );
		this.setHorizontalPadding = this.setHorizontalPadding.bind( this );
	}

	setPaddingClass( size ) {
		const paddingV = paddingSizes[ size ] && paddingSizes[ size ].paddingVertical ? paddingSizes[ size ].paddingVertical : 24;
		const paddingH = paddingSizes[ size ] && paddingSizes[ size ].paddingHorizontal ? paddingSizes[ size ].paddingHorizontal : 24;

		this.props.setAttributes( {
			paddingClass: size,
			paddingVertical: paddingV,
			paddingHorizontal: paddingH,
		} );
	}

	setVerticalPadding( padding ) {
		this.props.setAttributes( { paddingVertical: padding } );
		this.updatePaddingClass( padding, this.props.attributes.paddingHorizontal );
	}

	setHorizontalPadding( padding ) {
		this.props.setAttributes( { paddingHorizontal: padding } );
		this.updatePaddingClass( this.props.attributes.paddingVertical, padding );
	}

	updatePaddingClass( vertical, horizontal ) {
		forEach( paddingSizes, ( { paddingVertical, paddingHorizontal }, size ) => {
			if ( paddingVertical === vertical && paddingHorizontal === horizontal ) {
				this.props.setAttributes( { paddingClass: size } );
				return false;
			}
			this.props.setAttributes( { paddingClass: undefined } );
		} );
	}

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
						<PanelBody title={ __( 'Spacing Options' ) } initialOpen={ false } className="gt-panel-spacing-options gt-panel">

							<BaseControl id="gt-padding-size" label={ __( 'Padding' ) }>

								<div className="gt-padding-size-picker">

									<ButtonGroup aria-label={ __( 'Padding' ) }>
										{ map( paddingSizes, ( { name }, size ) => (
											<Button
												key={ size }
												isLarge
												isPrimary={ paddingClass === size }
												aria-pressed={ paddingClass === size }
												onClick={ () => this.setPaddingClass( size ) }
											>
												{ name }
											</Button>
										) ) }
									</ButtonGroup>

									<Button
										isLarge
										onClick={ () => this.setPaddingClass( undefined ) }
									>
										{ __( 'Reset' ) }
									</Button>

								</div>

							</BaseControl>

							<RangeControl
								label={ __( 'Vertical Padding' ) }
								value={ paddingVertical }
								onChange={ this.setVerticalPadding }
								min={ 0 }
								max={ 64 }
							/>

							<RangeControl
								label={ __( 'Horizontal Padding' ) }
								value={ paddingHorizontal }
								onChange={ this.setHorizontalPadding }
								min={ 0 }
								max={ 64 }
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
							allowedBlocks={ allowedBlocks || undefined }
							template={ template || undefined }
							templateLock={ templateLock || false }
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
