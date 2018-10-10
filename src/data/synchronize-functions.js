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
		headingWidth,
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
		headingWidth,
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

export const getSiblings = ( blockId, blockType, parentBlock, containerBlock = '' ) => {
	// Get all blocks.
	const blocks = select( 'core/editor' ).getBlocks();

	// Filter out parent blocks.
	const parentBlocks = blocks.filter( block => block.name === parentBlock );

	// Retrieve siblings.
	if ( '' !== containerBlock ) {
		return getSecondLevelSiblings( blockId, blockType, parentBlocks, containerBlock );
	}

	return getFirstLevelSiblings( blockId, blockType, parentBlocks );
};

export const getFirstLevelSiblings = ( blockId, blockType, parentBlocks ) => {
	let siblings = [];

	// Loop through parent blocks until siblings are found.
	parentBlocks.some( block => {
		// Get child blocks of parent blocks.
		const siblingIds = block.innerBlocks

			// Filter out sibling blocks (= blocks with same block type).
			.filter( child => child.name === blockType )

			// Get clientIds for all siblings.
			.map( child => child.clientId );

		// Check if blockId matches siblings.
		if ( siblingIds.includes( blockId ) ) {
			siblings = siblingIds;
			return true;
		}
	} );

	return siblings;
};

export const getSecondLevelSiblings = ( blockId, blockType, parentBlocks, containerBlock ) => {
	let siblings = [];

	// Loop through parent blocks until siblings are found.
	parentBlocks.some( block => {
		// Get child blocks of parent blocks.
		const siblingIds = block.innerBlocks

			// Filter out container blocks.
			.filter( child => child.name === containerBlock )

			// Get child blocks of container blocks.
			.map( item => item.innerBlocks )

			// Reduce child blocks to one array.
			.reduce( ( a, b ) => a.concat( b ), [] )

			// Filter out sibling blocks (= blocks with same block type).
			.filter( child => child.name === blockType )

			// Get clientIds for all siblings.
			.map( child => child.clientId );

		// Check if blockId matches siblings.
		if ( siblingIds.includes( blockId ) ) {
			siblings = siblingIds;
			return true;
		}
	} );

	return siblings;
};
