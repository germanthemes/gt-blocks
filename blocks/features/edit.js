/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    map,
    range,
    startCase,
    uniq,
} from 'lodash';

/**
 * Block dependencies
 */
import { default as IconPicker } from './icon-picker';
import { default as IconPickerModal } from './icon-picker-modal';
import {
    gtTwoColumns,
    gtThreeColumns,
    gtFourColumns,
} from './icons';

/**
 * Internal block libraries
 */
 const {
    Component,
    Fragment,
} = wp.element;

const {
    __,
    sprintf,
} = wp.i18n;

const { withSelect } = wp.data;
const { compose } = wp.compose;

const {
    AlignmentToolbar,
    BlockAlignmentToolbar,
    BlockControls,
    ContrastChecker,
    InspectorControls,
    PanelColorSettings,
    RichText,
    withColors,
    withFontSizes,
 } = wp.editor;

 const {
    Button,
    Dashicon,
    FontSizePicker,
    IconButton,
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
    Toolbar,
    withFallbackStyles,
 } = wp.components;

/* Block Alignment Controls */
const blockAlignmentControls = {
    center: {
        icon: 'align-center',
        title: __( 'Align center' ),
    },
    wide: {
        icon: 'align-wide',
        title: __( 'Wide width' ),
    },
    full: {
        icon: 'align-full-width',
        title: __( 'Full width' ),
    },
};

/* Column Icons */
const columnIcons = {
    2: gtTwoColumns,
    3: gtThreeColumns,
    4: gtFourColumns,
};

const { getComputedStyle } = window;

const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor, fontSize, customFontSize } = ownProps.attributes;
	const editableNode = node.querySelector( '[contenteditable="true"]' );
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
		fallbackFontSize: fontSize || customFontSize || ! computedStyles ? undefined : parseInt( computedStyles.fontSize ) || undefined,
	};
} );

class gtFeaturesEdit extends Component {
    constructor() {
        super( ...arguments );

        this.addFeaturesItem = this.addFeaturesItem.bind( this );
        this.onChangeIcon    = this.onChangeIcon.bind( this );
        this.onChangeTitle   = this.onChangeTitle.bind( this );
        this.onChangeText    = this.onChangeText.bind( this );
    }

    addFeaturesItem() {
        const newItems = [...this.props.attributes.items];
        newItems.push( { 'icon': '', 'title': '', 'text': '' } );
        this.props.setAttributes( { items: newItems } );
    }

    moveUpFeaturesItem( index ) {
        // Return early if item is already on top.
        if ( index === 0 ) {
            return false;
        }

        // Swap Items.
        const newItems = [...this.props.attributes.items];
        [newItems[index-1], newItems[index]] = [newItems[index], newItems[index-1]];
        this.props.setAttributes( { items: newItems } );
    }

    moveDownFeaturesItem( index ) {
        const newItems = [...this.props.attributes.items];

        // Return early if item is already on top.
        if ( ( index + 1 ) === newItems.length ) {
            return false;
        }

        // Swap Items.
        [newItems[index], newItems[index+1]] = [newItems[index+1], newItems[index]];
        this.props.setAttributes( { items: newItems } );
    }

    duplicateFeaturesItem( index ) {
        const newItems = [...this.props.attributes.items];

        // Duplicate Item.
        newItems.splice( index+1, 0, {...newItems[index]} );
        this.props.setAttributes( { items: newItems } );
    }

    removeFeaturesItem( index ) {
        const newItems = [...this.props.attributes.items].filter( (value, key) => key !== index );
        this.props.setAttributes( { items: newItems } );
    }

    onChangeIcon( newIcon, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].icon = newIcon;
        }
        this.props.setAttributes( { items: newItems } );
    }

    onChangeTitle( newTitle, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].title = newTitle;
        }
        this.props.setAttributes( { items: newItems } );
    }

    onChangeText( newText, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].text = newText;
        }
        this.props.setAttributes( { items: newItems } );
    }

    render() {
        const {
            attributes,
            iconColor,
            setIconColor,
            iconBackgroundColor,
            setIconBackgroundColor,
            backgroundColor,
            setBackgroundColor,
            fallbackBackgroundColor,
            textColor,
            setTextColor,
            fallbackTextColor,
            fontSize,
            setFontSize,
            fallbackFontSize,
            fontSizes,
            setAttributes,
            isSelected,
            className,
            wideControlsEnabled,
        } = this.props;

        const blockClasses= classnames( className, {
            [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
        } );

        const iconClasses = classnames( 'gt-icon', {
            [ `gt-icon-${ attributes.iconLayout }` ]: ( attributes.iconLayout !== 'default' ),
            'has-icon-color': iconColor.value,
            [ iconColor.class ]: iconColor.class,
            'has-icon-background': iconBackgroundColor.value,
            [ iconBackgroundColor.class ]: iconBackgroundColor.class,
        } );

        const iconStyles = {
            color: iconColor.class ? undefined : iconColor.value,
            backgroundColor: iconBackgroundColor.class ? undefined : iconBackgroundColor.value,
        };

        const contentClasses = classnames( 'gt-content', {
            'has-text-color': textColor.value,
            [ textColor.class ]: textColor.class,
            'has-background': backgroundColor.value,
            [ backgroundColor.class ]: backgroundColor.class,
        } );

        const contentStyles = {
            textAlign: attributes.textAlignment,
            color: textColor.class ? undefined : textColor.value,
            backgroundColor: backgroundColor.class ? undefined : backgroundColor.value,
        };

        const textClasses = classnames( 'gt-text', {
            [ fontSize.class ]: fontSize.class,
        } );

        const textStyles = {
            fontSize: fontSize.size ? fontSize.size + 'px' : undefined,
        };

        const titleTag = 'h' + attributes.titleTag;

        return (
            <Fragment>
                <IconPickerModal/>
                <BlockControls key="controls">

                    <BlockAlignmentToolbar
                        value={ attributes.blockAlignment }
                        onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
                        controls={ [ 'wide', 'full' ] }
                    />

                    <Toolbar
                        controls={
                            [ 2, 3, 4 ].map( column => ( {
                                icon: columnIcons[ column ],
                                title: sprintf( __( '%s Columns' ), column ),
                                isActive: column === attributes.columns,
                                onClick: () => setAttributes( { columns: column } ),
                            } ) )
                        }
                    />

                    <AlignmentToolbar
                        value={ attributes.textAlignment }
                        onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
                    />

                </BlockControls>

                <InspectorControls key="inspector">

                    <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

                        <RangeControl
                            label={ __( 'Columns' ) }
                            value={ attributes.columns }
                            onChange={ ( nextColumns ) => setAttributes( { columns: nextColumns } ) }
                            min={ 2 }
                            max={ 6 }
                        />

                        { wideControlsEnabled && [
                            <p><label className="blocks-base-control__label">{ __( 'Block Alignment' ) }</label></p>,
                            <BlockAlignmentToolbar
                                value={ attributes.blockAlignment }
                                onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
                                controls={ [ 'center', 'wide', 'full' ] }
                            />
                        ] }

                    </PanelBody>

                    <PanelBody title={ __( 'Icon Settings' ) } initialOpen={ false } className="gt-panel-icon-settings gt-panel">

                        <SelectControl
                            label={ __( 'Icon Style' ) }
                            value={ attributes.iconLayout }
                            onChange={ ( newStyle ) => setAttributes( { iconLayout: newStyle } ) }
                            options={ [
                                { value: 'default', label: __( 'Default' ) },
                                { value: 'circle', label: __( 'Circle' ) },
                                { value: 'outline', label: __( 'Outline' ) },
                                { value: 'square', label: __( 'Square' ) },
                            ] }
                        />

                        <RangeControl
                            label={ __( 'Icon Size' ) }
                            value={ attributes.iconSize }
                            onChange={ ( newSize ) => setAttributes( { iconSize: newSize } ) }
                            min={ 16 }
                            max={ 128 }
                        />

                    </PanelBody>

                    <PanelBody title={ __( 'Text Settings' ) } initialOpen={ false } className="gt-panel-text-settings gt-panel">

                        <p><label className="blocks-base-control__label">{ __( 'Heading' ) }</label></p>
                        <Toolbar
                            controls={
                            range( 1, 7 ).map( ( level ) => ( {
                                icon: 'heading',
                                title: sprintf( __( 'Heading %s' ), level ),
                                isActive: level === attributes.titleTag,
                                onClick: () => setAttributes( { titleTag: level } ),
                                subscript: level,
                            } ) )
                            }
                        />

                        <p><label className="blocks-base-control__label">{ __( 'Font Size' ) }</label></p>
                        <FontSizePicker
                            fontSizes={ fontSizes }
                            fallbackFontSize={ fallbackFontSize }
							value={ fontSize.size }
							onChange={ setFontSize }
						/>

                    </PanelBody>

                    <PanelColorSettings
                        title={ __( 'Icon Color' ) }
                        initialOpen={ false }
                        colorSettings={ [
                            {
                                value: iconBackgroundColor.value,
                                onChange: setIconBackgroundColor,
                                label: __( 'Background Color' ),
                            },
                            {
                                value: iconColor.value,
                                onChange: setIconColor,
                                label: __( 'Icon Color' ),
                            },
                        ] }
                    >
                    </PanelColorSettings>

                    <PanelColorSettings
                        title={ __( 'Color Settings' ) }
                        initialOpen={ false }
                        colorSettings={ [
                            {
                                value: backgroundColor.value,
                                onChange: setBackgroundColor,
                                label: __( 'Background Color' ),
                            },
                            {
                                value: textColor.value,
                                onChange: setTextColor,
                                label: __( 'Text Color' ),
                            },
                        ] }
                    >
                        <ContrastChecker
                            { ...{
                                textColor: textColor.value,
                                backgroundColor: backgroundColor.value,
                                fallbackTextColor,
                                fallbackBackgroundColor,
                            } }
                            fontSize={ fontSize.size }
                        />
                    </PanelColorSettings>

                </InspectorControls>

                <div className={ blockClasses }>
                    <div className="gt-grid-container">

                        {
                            attributes.items.map( ( item, index ) => {
                                return (
                                    <div className="gt-grid-item" key={ index }>

                                        <div className="gt-icon-wrap">
                                            <IconPicker
                                                icon={ item.icon }
                                                iconClasses={ iconClasses }
                                                iconStyles={ iconStyles }
                                                iconSize={ attributes.iconSize }
                                                onChange={ ( newIcon ) => this.onChangeIcon( newIcon, index ) }
                                                isSelected={ isSelected }
                                            />
                                        </div>

                                        <div className={ contentClasses } style={ contentStyles }>

                                            <RichText
                                                tagName={ titleTag }
                                                placeholder={ __( 'Enter a title' ) }
                                                value={ item.title }
                                                className="gt-title"
                                                onChange={ ( newTitle ) => this.onChangeTitle( newTitle, index ) }
                                                formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                                keepPlaceholderOnFocus
                                            />

                                            <RichText
                                                tagName="div"
                                                multiline="p"
                                                placeholder={ __( 'Enter your text here.' ) }
                                                value={ item.text }
                                                className={ textClasses }
                                                style={ textStyles }
                                                onChange={ ( newText ) => this.onChangeText( newText, index ) }
                                                keepPlaceholderOnFocus
                                            />

                                        </div>

                                        { isSelected && (
                                            <div className="gt-grid-item-controls">
                                                <IconButton
                                                    className="move-up-features-item"
                                                    label={ __( 'Move up' ) }
                                                    icon="arrow-up-alt2"
                                                    onClick={ () => this.moveUpFeaturesItem( index ) }
                                                    disabled={ index === 0 }
                                                />

                                                <IconButton
                                                    className="move-down-features-item"
                                                    label={ __( 'Move down' ) }
                                                    icon="arrow-down-alt2"
                                                    onClick={ () => this.moveDownFeaturesItem( index ) }
                                                    disabled={ ( index + 1 ) === attributes.items.length }
                                                />

                                                <IconButton
                                                    className="duplicate-features-item"
                                                    label={ __( 'Duplicate' ) }
                                                    icon="admin-page"
                                                    onClick={ () => this.duplicateFeaturesItem( index ) }
                                                />

                                                <IconButton
                                                    className="remove-features-item"
                                                    label={ __( 'Remove' ) }
                                                    icon="trash"
                                                    onClick={ () => this.removeFeaturesItem( index ) }
                                                />
                                            </div>
                                        ) }

                                    </div>
                                );
                            })
                        }

                    </div>

                    { isSelected && (
                        <Button
                            isLarge
                            onClick={ this.addFeaturesItem }
                            className="gt-add-features-item"
                        >
                            <Dashicon icon="insert" />
                            { __( 'Add features item' ) }
                        </Button>
                    ) }
                </div>
            </Fragment>
        );
    }
}

export default compose( [
    withColors( 'backgroundColor', { textColor: 'color' }, { iconColor: 'color' }, { iconBackgroundColor: 'background-color' } ),
    withFontSizes( 'fontSize' ),
	applyFallbackStyles,
    withSelect(
        ( select ) => {
            const { fontSizes } = select( 'core/editor' ).getEditorSettings();
            return { fontSizes };
        }
    )
] )( gtFeaturesEdit );
