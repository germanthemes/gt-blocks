/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';
import memoize from 'memize';
const { getComputedStyle } = window;

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const {
	__,
	sprintf,
} = wp.i18n;

const { compose, withInstanceId } = wp.compose;
const { createBlock } = wp.blocks;

const {
	dispatch,
	select,
	withSelect,
} = wp.data;

const {
	BlockAlignmentToolbar,
	BlockControls,
	ContrastChecker,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	BaseControl,
	Button,
	Dashicon,
	PanelBody,
	RangeControl,
	Toolbar,
	withFallbackStyles,
} = wp.components;

/**
 * Internal dependencies
 */
import {
	gtIconNumberTwo,
	gtIconNumberThree,
	gtIconNumberFour,
} from '../../components/icons';

/* Set Fallback Styles */
const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor } = ownProps.attributes;
	const editableNode = node.querySelector( '[contenteditable="true"]' );
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
	};
} );

// Define column child blocks.
const ALLOWED_BLOCKS = [ 'gt-layout-blocks/icon', 'gt-layout-blocks/heading', 'core/paragraph' ];
const TEMPLATE = [
	[ 'gt-layout-blocks/icon', {
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/icon-grid',
		containerBlock: 'gt-layout-blocks/column',
	} ],
	[ 'gt-layout-blocks/heading', {
		placeholder: __( 'Feature' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/icon-grid',
		containerBlock: 'gt-layout-blocks/column',
	} ],
	[ 'core/paragraph', {
		placeholder: __( 'Write feature description...' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/icon-grid',
		containerBlock: 'gt-layout-blocks/column',
	} ],
];

/**
 * Returns the layouts configuration for a given number of items.
 *
 * @param {number} items Number of items.
 *
 * @return {Object[]} Items layout configuration.
 */
const getItemsTemplate = memoize( ( items ) => {
	const template = [ 'gt-layout-blocks/column', {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		templateLock: 'all',
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/icon-grid',
	} ];

	return times( items, () => template );
} );

/**
 * Block Edit Component
 */
class gtIconGridEdit extends Component {
	constructor() {
		super( ...arguments );
		this.addBlock = this.addBlock.bind( this );

		this.state = {
			childBlocks: [],
		};
	}

	componentDidMount() {
		// Get Child Blocks.
		const children = select( 'core/editor' ).getBlocksByClientId( this.props.clientId )[ 0 ].innerBlocks;
		const childBlocks = children.map( child => child.clientId );

		this.setState( { childBlocks: childBlocks } );
	}

	componentDidUpdate( prevProps ) {
		const {
			textColor,
			backgroundColor,
			customTextColor,
			customBackgroundColor,
		} = this.props.attributes;

		if ( textColor !== prevProps.attributes.textColor ) {
			this.updateChildBlocks( 'textColor', textColor );
		}

		if ( backgroundColor !== prevProps.attributes.backgroundColor ) {
			this.updateChildBlocks( 'backgroundColor', backgroundColor );
		}

		if ( customTextColor !== prevProps.attributes.customTextColor ) {
			this.updateChildBlocks( 'customTextColor', customTextColor );
		}

		if ( customBackgroundColor !== prevProps.attributes.customBackgroundColor ) {
			this.updateChildBlocks( 'customBackgroundColor', customBackgroundColor );
		}
	}

	updateChildBlocks( attribute, value ) {
		this.state.childBlocks.forEach( child => {
			dispatch( 'core/editor' ).updateBlockAttributes( child, { [ attribute ]: value } );
		} );
	}

	addBlock() {
		const {
			attributes,
			clientId,
			setAttributes,
		} = this.props;

		const {
			items,
			textColor,
			backgroundColor,
			customTextColor,
			customBackgroundColor,
		} = attributes;

		// Create Block.
		const block = createBlock( 'gt-layout-blocks/column', {
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			templateLock: 'all',
			textColor,
			backgroundColor,
			customTextColor,
			customBackgroundColor,
			synchronizeStyling: true,
			parentBlock: 'gt-layout-blocks/icon-grid',
		} );

		// Insert Block.
		dispatch( 'core/editor' ).insertBlocks( block, items, clientId );

		// Update number of items.
		setAttributes( { items: items + 1 } );
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
			setAttributes,
			isSelected,
			isChildBlockSelected,
			className,
			instanceId,
			wideControlsEnabled,
		} = this.props;

		const {
			items,
			blockAlignment,
			columns,
			columnGap,
		} = attributes;

		const blockId = `gt-icon-grid-block-${ instanceId }`;

		const gridClasses = classnames( 'gt-grid-container', {
			[ `gt-columns-${ columns }` ]: columns,
		} );

		const gridGap = 32 !== columnGap ? ( columnGap / 16 ).toFixed( 2 ) : '2.0';

		const gridInlineStyles = `
			#${ blockId } .gt-grid-container > .editor-inner-blocks > .editor-block-list__layout {
				grid-column-gap: calc( ${ gridGap }rem - 28px );
				grid-row-gap: calc( ${ gridGap }rem - 28px );
			}
		`;

		const columnIcons = {
			2: gtIconNumberTwo,
			3: gtIconNumberThree,
			4: gtIconNumberFour,
		};

		return (
			<Fragment>

				<BlockControls key="controls">

					<BlockAlignmentToolbar
						value={ blockAlignment }
						onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign ? newAlign : blockAlignment } ) }
						controls={ [ 'center', 'wide', 'full' ] }
					/>

					<Toolbar
						controls={
							[ 2, 3, 4 ].map( column => ( {
								icon: columnIcons[ column ],
								title: sprintf( __( '%s Columns' ), column ),
								isActive: column === columns,
								onClick: () => setAttributes( { columns: column } ),
							} ) )
						}
					/>

				</BlockControls>

				<InspectorControls key="inspector">

					<PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

						<RangeControl
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ ( nextColumns ) => setAttributes( { columns: nextColumns } ) }
							min={ 2 }
							max={ 6 }
						/>

						<RangeControl
							label={ __( 'Column Gap' ) }
							value={ columnGap }
							onChange={ ( newGap ) => setAttributes( { columnGap: newGap } ) }
							min={ 0 }
							max={ 64 }
						/>

						{ wideControlsEnabled && (
							<BaseControl id="gt-block-alignment" label={ __( 'Block Alignment' ) }>
								<BlockAlignmentToolbar
									value={ blockAlignment }
									onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign ? newAlign : blockAlignment } ) }
									controls={ [ 'center', 'wide', 'full' ] }
								/>
							</BaseControl>
						) }

					</PanelBody>

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

				<div id={ blockId } className={ className }>

					<style>{ gridInlineStyles }</style>
					<div className={ gridClasses }>

						<InnerBlocks
							template={ getItemsTemplate( items ) }
							templateLock="all"
							allowedBlocks={ [ 'gt-layout-blocks/column' ] }
						/>

					</div>

					{ ( isSelected || isChildBlockSelected ) && (
						<Button
							isLarge
							onClick={ this.addBlock }
							className="gt-add-icon-grid-item"
						>
							<Dashicon icon="insert" />
							{ __( 'Add block' ) }
						</Button>
					) }
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const { hasSelectedInnerBlock } = select( 'core/editor' );
		return {
			isChildBlockSelected: hasSelectedInnerBlock( clientId, true ),
		};
	} ),
	withColors( 'backgroundColor', { textColor: 'color' } ),
	applyFallbackStyles,
	withInstanceId,
] )( gtIconGridEdit );
