/**
 * WordPress dependencies
 */
const { dispatch, select } = wp.data;

export const synchronizeButtons = ( blockList, attributes ) => {
	const {
		buttonSize,
		paddingVertical,
		paddingHorizontal,
		buttonShape,
		roundedCorners,
		fontWeight,
		italic,
		uppercase,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
		hoverColor,
		hoverBackgroundColor,
		customHoverColor,
		customHoverBackgroundColor,
		fontSize,
		customFontSize,
	} = attributes;

	const newAttributes = {
		buttonSize,
		paddingVertical,
		paddingHorizontal,
		buttonShape,
		roundedCorners,
		fontWeight,
		italic,
		uppercase,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
		hoverColor,
		hoverBackgroundColor,
		customHoverColor,
		customHoverBackgroundColor,
		fontSize,
		customFontSize,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

export const synchronizeColumns = ( blockList, attributes ) => {
	const {
		paddingClass,
		paddingVertical,
		paddingHorizontal,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
	} = attributes;

	const newAttributes = {
		paddingClass,
		paddingVertical,
		paddingHorizontal,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

export const synchronizeHeadings = ( blockList, attributes ) => {
	const {
		titleTag,
		blockAlignment,
		textAlignment,
		headingLayout,
		marginTop,
		marginBottom,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		fontWeight,
		italic,
		uppercase,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
		fontSize,
		customFontSize,
		border,
		borderWidth,
	} = attributes;

	const newAttributes = {
		titleTag,
		blockAlignment,
		textAlignment,
		headingLayout,
		marginTop,
		marginBottom,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		fontWeight,
		italic,
		uppercase,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
		fontSize,
		customFontSize,
		border,
		borderWidth,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

export const synchronizeIcons = ( blockList, attributes ) => {
	const {
		textAlignment,
		iconLayout,
		iconSize,
		iconPadding,
		outlineBorderWidth,
		roundedCorners,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
	} = attributes;

	const newAttributes = {
		textAlignment,
		iconLayout,
		iconSize,
		iconPadding,
		outlineBorderWidth,
		roundedCorners,
		textColor,
		backgroundColor,
		customTextColor,
		customBackgroundColor,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

export const synchronizeImages = ( blockList, attributes ) => {
	const {
		size,
	} = attributes;

	const newAttributes = {
		size,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

export const synchronizeParagraphs = ( blockList, attributes ) => {
	const {
		align,
		dropCap,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		fontSize,
		customFontSize,
	} = attributes;

	const newAttributes = {
		align,
		dropCap,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		fontSize,
		customFontSize,
	};

	blockList.forEach( block => {
		dispatch( 'core/editor' ).updateBlockAttributes( block, newAttributes );
	} );
};

export const getSiblings = ( blockId, blockType, parentBlockName ) => {
	const {
		getBlocksByClientId,
		getBlockRootClientId,
	} = select( 'core/editor' );

	// Get container block.
	const containerClientId = getBlockRootClientId( blockId );
	const containerBlock = getBlocksByClientId( containerClientId )[ 0 ];

	// Return early if container block does not exist.
	if ( ! containerBlock ) {
		return [];
	}

	// Get siblings in case we have reached the root level.
	if ( parentBlockName === containerBlock.name ) {
		return getFirstLevelSiblings( blockType, containerBlock );
	}

	// Get root block.
	const rootClientId = getBlockRootClientId( containerClientId );
	const rootBlock = getBlocksByClientId( rootClientId )[ 0 ];

	// Return early if root block does not exist.
	if ( ! rootBlock ) {
		return [];
	}

	// Get siblings in case we have reached the root level.
	if ( parentBlockName === rootBlock.name ) {
		return getSecondLevelSiblings( blockType, rootBlock, containerBlock.name );
	}

	return [];
};

export const getFirstLevelSiblings = ( blockType, parentBlock ) => {
	// Get child blocks of parent block.
	const siblings = parentBlock.innerBlocks

		// Filter out sibling blocks (= blocks with same block type).
		.filter( child => child.name === blockType )

		// Get clientIds for all siblings.
		.map( child => child.clientId );

	return siblings;
};

export const getSecondLevelSiblings = ( blockType, parentBlock, containerBlockName ) => {
	// Get child blocks of parent blocks.
	const siblings = parentBlock.innerBlocks

		// Filter out container blocks.
		.filter( child => child.name === containerBlockName )

		// Get child blocks of container blocks.
		.map( item => item.innerBlocks )

		// Reduce child blocks to one array.
		.reduce( ( a, b ) => a.concat( b ), [] )

		// Filter out sibling blocks (= blocks with same block type).
		.filter( child => child.name === blockType )

		// Get clientIds for all siblings.
		.map( child => child.clientId );

	return siblings;
};
