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

const { compose } = wp.compose;
const { dispatch, select } = wp.data;

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

/**
 * Returns the layouts configuration for a given number of items.
 *
 * @param {number} items Number of items.
 *
 * @return {Object[]} Items layout configuration.
 */
const getItemsTemplate = memoize( ( items ) => {
	return times( items, () => [ 'gt-layout-blocks/icon-grid-column' ] );
} );

/**
 * Block Edit Component
 */
class gtIconGridEdit extends Component {
	constructor() {
		super( ...arguments );
		this.addIconGridItem = this.addIconGridItem.bind( this );

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

	addIconGridItem() {
		const newItems = [ ...this.props.attributes.items ];
		newItems.push( {} );
		this.props.setAttributes( { items: newItems } );
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
			className,
			wideControlsEnabled,
		} = this.props;

		const {
			items,
			blockAlignment,
			columns,
		} = attributes;

		const gridClasses = classnames( 'gt-grid-container', {
			[ `gt-columns-${ columns }` ]: columns,
		} );

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

				<div className={ className }>
					<div className={ gridClasses }>

						<InnerBlocks
							template={ getItemsTemplate( items ) }
							templateLock="all"
							allowedBlocks={ [ 'gt-layout-blocks/icon-grid-column' ] }
						/>

					</div>

					{ isSelected && (
						<Button
							isLarge
							onClick={ this.addIconGridItem }
							className="gt-add-icon-grid-item"
						>
							<Dashicon icon="insert" />
							{ __( 'Add item' ) }
						</Button>
					) }
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	applyFallbackStyles,
] )( gtIconGridEdit );
