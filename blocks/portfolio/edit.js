/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    map,
    startCase,
    uniq,
} from 'lodash';

/**
 * Block dependencies
 */
import { default as PortfolioImage } from './portfolio-image';
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

const {
    AlignmentToolbar,
    BlockAlignmentToolbar,
    BlockControls,
    InspectorControls,
    PanelColor,
    RichText,
    UrlInput,
    withColors,
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

/* Font Sizes */
const FONT_SIZES = [
    {
        name: 'small',
        shortName: 'S',
        size: 14,
    },
    {
        name: 'regular',
        shortName: 'M',
        size: 16,
    },
    {
        name: 'large',
        shortName: 'L',
        size: 24,
    },
    {
        name: 'larger',
        shortName: 'XL',
        size: 36,
    },
];

class gtPortfolioEdit extends Component {
    constructor() {
        super( ...arguments );

        this.addPortfolioItem   = this.addPortfolioItem.bind( this );
        this.onSelectImage      = this.onSelectImage.bind( this );
        this.onRemoveImage      = this.onRemoveImage.bind( this );
        this.addImageSize       = this.addImageSize.bind( this );
        this.updateImageURLs    = this.updateImageURLs.bind( this );
        this.onChangeTitle      = this.onChangeTitle.bind( this );
        this.onChangeText       = this.onChangeText.bind( this );
        this.onChangeButtonText = this.onChangeButtonText.bind( this );
        this.onChangeItemURL  = this.onChangeItemURL.bind( this );
        this.getFontSize = this.getFontSize.bind( this );
        this.setFontSize = this.setFontSize.bind( this );

        this.state = {
            imageSizes: {},
        };
    }

    addPortfolioItem() {
        const newItems = [...this.props.attributes.items];
        newItems.push( { 'title': '', 'text': '' } );
        this.props.setAttributes( { items: newItems } );
    }

    moveUpPortfolioItem( index ) {
        // Return early if item is already on top.
        if ( index === 0 ) {
            return false;
        }

        // Swap Items.
        const newItems = [...this.props.attributes.items];
        [newItems[index-1], newItems[index]] = [newItems[index], newItems[index-1]];
        this.props.setAttributes( { items: newItems } );
    }

    moveDownPortfolioItem( index ) {
        const newItems = [...this.props.attributes.items];

        // Return early if item is already on top.
        if ( ( index + 1 ) === newItems.length ) {
            return false;
        }

        // Swap Items.
        [newItems[index], newItems[index+1]] = [newItems[index+1], newItems[index]];
        this.props.setAttributes( { items: newItems } );
    }

    removePortfolioItem( index ) {
        const newItems = [...this.props.attributes.items].filter( (value, key) => key !== index );
        this.props.setAttributes( { items: newItems } );
    }

    onSelectImage( img, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            const newImgURL = this.getImageURL( img.id, this.props.attributes.imageSize );
            newItems[index].imgID = img.id;
            newItems[index].imgURL = newImgURL ? newImgURL : img.url;
            newItems[index].imgAlt = img.alt;
        }
        this.props.setAttributes( { items: newItems } );
    }

    onRemoveImage( index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].imgID = null;
            newItems[index].imgURL = null;
            newItems[index].imgAlt = null;
        }
        this.props.setAttributes( { items: newItems } );
    }

    addImageSize( imgID, sizeObj ) {
        const newSizes = { ...this.state.imageSizes };
        if( ! newSizes[imgID] ) {
            newSizes[imgID] = sizeObj;
            this.setState( { imageSizes: newSizes } );

            // Update Image URLs after new Image Sizes were added.
            const newItems = [...this.props.attributes.items];
            newItems.forEach( ( item, index ) => {
                if( item.imgID === imgID ) {
                    const newURL = this.getImageURL( item.imgID, this.props.attributes.imageSize, newSizes );

                    if( newItems[index].imgURL !== newURL ) {
                        newItems[index].imgURL = newURL;
                        this.props.setAttributes( { items: newItems } );
                    }
                }
            });
        }
    }

    getImageURL( imgID, size, imageSizes = this.state.imageSizes ) {
        // Check if image exists in imageSizes state.
        if( imageSizes[imgID] !== undefined ) {

            // Get image from imageSizes array.
            const image = imageSizes[imgID];

            // Select the new Image Size.
            const newSize = ( image[size] !== undefined ) ? image[size] : image['full'];

            return newSize['source_url'];
        }
        return null;
    }

    updateImageURLs( size ) {
        const newItems = [...this.props.attributes.items];
        newItems.forEach( ( item, index ) => {
            newItems[index].imgURL = this.getImageURL( item.imgID, size );
        });

        this.props.setAttributes( {
            items: newItems,
            imageSize: size,
        } );
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

    onChangeButtonText( newButtonText, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].buttonText = newButtonText;
        }
        this.props.setAttributes( { items: newItems } );
    }

    onChangeItemURL( newItemURL, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].itemURL = newItemURL;
        }
        this.props.setAttributes( { items: newItems } );
    }

    getAvailableSizes() {
        const availableSizes = Object.values( this.state.imageSizes )
            .map( img => Object.keys(img) )
            .reduce( ( sizes, img ) => sizes.concat( img ), [] );
        return uniq( availableSizes );
    }

    getFontSize() {
        const { customFontSize, fontSize } = this.props.attributes;
        if ( fontSize ) {
            const fontSizeObj = find( FONT_SIZES, { name: fontSize } );
            if ( fontSizeObj ) {
                return fontSizeObj.size;
            }
        }

        if ( customFontSize ) {
            return customFontSize;
        }
    }

    setFontSize( fontSizeValue ) {
        const { setAttributes } = this.props;
        const thresholdFontSize = find( FONT_SIZES, { size: fontSizeValue } );
        if ( thresholdFontSize ) {
            setAttributes( {
                fontSize: thresholdFontSize.name,
                customFontSize: undefined,
            } );
            return;
        }
        setAttributes( {
            fontSize: undefined,
            customFontSize: fontSizeValue,
        } );
    }

    render() {
        const {
            attributes,
            backgroundColor,
            textColor,
            titleColor,
            setBackgroundColor,
            setTextColor,
            setTitleColor,
            wideControlsEnabled,
            setAttributes,
            isSelected,
            className
        } = this.props;

        const availableSizes = this.getAvailableSizes();
        const fontSize = this.getFontSize();

        const classNames= classnames( className, {
            [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
        } );

        const contentClasses = classnames( 'gt-content', {
            'has-background': backgroundColor.value,
            [ backgroundColor.class ]: backgroundColor.class,
        } );

        const contentStyles = {
            textAlign: attributes.textAlignment,
            backgroundColor: backgroundColor.class ? undefined : backgroundColor.value,
        };

        const textClasses = classnames( 'gt-text', {
            'has-text-color': textColor.value,
            [ textColor.class ]: textColor.class,
        } );

        const textStyles = {
            fontSize: fontSize ? fontSize + 'px' : undefined,
            color: textColor.class ? undefined : textColor.value,
        };

        const titleClasses = classnames( 'gt-title', {
            'has-text-color': titleColor.value,
            [ titleColor.class ]: titleColor.class,
        } );

        const titleStyles = {
            color: titleColor.class ? undefined : titleColor.value,
        };

        return (
            <Fragment>
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

                        <ToggleControl
                            label={ __( 'Show buttons?' ) }
                            checked={ !! attributes.showButtons }
                            onChange={ () => setAttributes( { showButtons: ! attributes.showButtons } ) }
                        />

                    </PanelBody>

                    <PanelBody title={ __( 'Image Settings' ) } initialOpen={ false } className="gt-panel-image-settings gt-panel">

                        { ! isEmpty( availableSizes ) && (
                            <SelectControl
                                label={ __( 'Size' ) }
                                value={ attributes.imageSize }
                                options={ map( availableSizes, ( size ) => ( {
                                    value: size,
                                    label: startCase( size ),
                                } ) ) }
                                onChange={ this.updateImageURLs }
                            />
                        ) }

                    </PanelBody>

                    <PanelBody title={ __( 'Text Settings' ) } initialOpen={ false } className="gt-panel-text-settings gt-panel">

                        <p><label className="blocks-base-control__label">{ __( 'Heading' ) }</label></p>
                        <Toolbar
                            controls={
                            '123456'.split( '' ).map( ( level ) => ( {
                                icon: 'heading',
                                title: sprintf( __( 'Heading %s' ), level ),
                                isActive: 'H' + level === attributes.titleTag,
                                onClick: () => setAttributes( { titleTag: 'H' + level } ),
                                subscript: level,
                            } ) )
                            }
                        />

                        <p><label className="blocks-base-control__label">{ __( 'Font Size' ) }</label></p>
                        <FontSizePicker
                            fontSizes={ FONT_SIZES }
                            value={ fontSize }
                            onChange={ this.setFontSize }
                        />

                    </PanelBody>

                    <PanelColor
                        colorValue={ backgroundColor.value }
                        initialOpen={ false }
                        title={ __( 'Background Color' ) }
                        onChange={ setBackgroundColor }
                    />

                    <PanelColor
                        colorValue={ textColor.value }
                        initialOpen={ false }
                        title={ __( 'Text Color' ) }
                        onChange={ setTextColor }
                    />

                    <PanelColor
                        colorValue={ titleColor.value }
                        initialOpen={ false }
                        title={ __( 'Title Color' ) }
                        onChange={ setTitleColor }
                    />

                </InspectorControls>

                <div className={ classNames }>
                    <div className="gt-grid-container">

                        {
                            attributes.items.map( ( item, index ) => {
                                return (
                                    <div className="gt-grid-item" key={ index }>

                                        <PortfolioImage
                                            imgID={ item.imgID }
                                            imgURL={ item.imgURL }
                                            imgAlt={ item.imgAlt }
                                            onSelect={ ( img ) => this.onSelectImage( img, index ) }
                                            onRemove={ () => this.onRemoveImage( index ) }
                                            addSize={ this.addImageSize }
                                            isSelected={ isSelected }
                                        />

                                        <div className={ contentClasses } style={ contentStyles }>

                                            <RichText
                                                tagName={ attributes.titleTag.toLowerCase() }
                                                placeholder={ __( 'Enter a title' ) }
                                                value={ item.title }
                                                className={ titleClasses }
                                                style={ titleStyles }
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

                                            <RichText
                                                tagName="a"
                                                placeholder={ __( 'Add button text' ) }
                                                value={ item.buttonText }
                                                className={ classnames( 'gt-button', { 'gt-button-hidden': ! attributes.showButtons } ) }
                                                onChange={ ( newButtonText ) => this.onChangeButtonText( newButtonText, index ) }
                                                formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                                keepPlaceholderOnFocus
                                            />

                                        </div>

                                        { isSelected && (
                                            <Fragment>
                                                <form
                                                    className="gt-url-input"
                                                    onSubmit={ ( event ) => event.preventDefault() }>
                                                    <Dashicon icon="admin-links" />
                                                    <UrlInput
                                                        value={ item.itemURL }
                                                        onChange={ ( newItemURL ) => this.onChangeItemURL( newItemURL, index ) }
                                                        autoFocus= { false }
                                                    />
                                                    <IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
                                                </form>,

                                                <div className="gt-grid-item-controls">
                                                    <div className="gt-grid-item-number">
                                                        #{ index + 1 }
                                                    </div>

                                                    { index !== 0 && (
                                                        <IconButton
                                                            className="move-up-portfolio-item"
                                                            label={ __( 'Move up' ) }
                                                            icon="arrow-up-alt2"
                                                            onClick={ () => this.moveUpPortfolioItem( index ) }
                                                        />
                                                    ) }

                                                    { ( ( index + 1 ) !== attributes.items.length ) && (
                                                        <IconButton
                                                            className="move-down-portfolio-item"
                                                            label={ __( 'Move down' ) }
                                                            icon="arrow-down-alt2"
                                                            onClick={ () => this.moveDownPortfolioItem( index ) }
                                                        />
                                                    ) }

                                                    <IconButton
                                                        className="remove-portfolio-item"
                                                        label={ __( 'Remove Item' ) }
                                                        icon="trash"
                                                        onClick={ () => this.removePortfolioItem( index ) }
                                                    />
                                                </div>
                                            </Fragment>
                                        ) }

                                    </div>
                                );
                            })
                        }

                    </div>

                    { isSelected && (
                        <Button
                            isLarge
                            onClick={ this.addPortfolioItem }
                            className="gt-add-portfolio-item"
                        >
                            <Dashicon icon="insert" />
                            { __( 'Add portfolio item' ) }
                        </Button>
                    ) }
                </div>
            </Fragment>
        );
    }
}

export default wp.compose.compose( [
    withColors( ( getColor, setColor, { attributes } ) => {
        return {
            backgroundColor: getColor( attributes.backgroundColor, attributes.customBackgroundColor, 'background-color' ),
            setBackgroundColor: setColor( 'backgroundColor', 'customBackgroundColor' ),
            textColor: getColor( attributes.textColor, attributes.customTextColor, 'color' ),
            setTextColor: setColor( 'textColor', 'customTextColor' ),
            titleColor: getColor( attributes.titleColor, attributes.customTitleColor, 'color' ),
            setTitleColor: setColor( 'titleColor', 'customTitleColor' ),
        };
    } ),
    withSelect( ( select  ) => ( {
        wideControlsEnabled: select( 'core/editor' ).getEditorSettings().alignWide,
    } ) )
] )( gtPortfolioEdit );
