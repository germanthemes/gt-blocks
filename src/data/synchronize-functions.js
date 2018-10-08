/**
 * WordPress dependencies
 */
const { dispatch } = wp.data;

export const synchronizeButtons = ( blockList, attributes ) => {
	const {
		buttonSize,
		paddingVertical,
		paddingHorizontal,
		buttonShape,
		roundedCorners,
		fontStyle,
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
		fontStyle,
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
		fontStyle,
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
		fontStyle,
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
