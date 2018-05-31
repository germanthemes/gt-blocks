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

/**
 * Internal block libraries
 */
 const { Component } = wp.element;
 const { __, sprintf } = wp.i18n;
 const {
     BlockAlignmentToolbar,
     BlockControls,
     InspectorControls,
     RichText,
     UrlInput,
     withColors,
     PanelColor,
 } = wp.editor;

 const {
     Button,
     Dashicon,
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

    render() {
        const {
            attributes,
            backgroundColor,
            textColor,
            setBackgroundColor,
            setTextColor,
            setAttributes,
            isSelected,
            className
        } = this.props;
        const availableSizes = this.getAvailableSizes();

        const classNames= classnames( className, {
            [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
        } );

        const itemClasses = classnames( 'gt-content', {
            'has-background': backgroundColor.value,
            [ backgroundColor.class ]: backgroundColor.class,
            'has-text-color': textColor.value,
            [ textColor.class ]: textColor.class,
        } );

        const itemStyles = {
            backgroundColor: backgroundColor.class ? undefined : backgroundColor.value,
            color: textColor.class ? undefined : textColor.value,
        };

        return [
            isSelected && (
                <BlockControls key="controls">
                    <BlockAlignmentToolbar
                        controls={ [ 'wide', 'full' ] }
                        value={ attributes.blockAlignment }
                        onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
                    />
                </BlockControls>
            ),
            isSelected && (
                <InspectorControls key="inspector">

                    <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

                        <RangeControl
                            label={ __( 'Columns' ) }
                            value={ attributes.columns }
                            onChange={ ( nextColumns ) => setAttributes( { columns: nextColumns } ) }
                            min={ 2 }
                            max={ 6 }
                        />

                        <p><label className="blocks-base-control__label">{ __( 'Block Alignment' ) }</label></p>
                        <Toolbar
                            controls={
                                [ 'center', 'wide', 'full' ].map( control => {
                                    return {
                                        ...blockAlignmentControls[ control ],
                                        isActive: attributes.blockAlignment === control,
                                        onClick: () => setAttributes( { blockAlignment: control } ),
                                    };
                                } )
                            }
                        />

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

                </InspectorControls>
            ),
            <div className={ classNames }>
                <div className="gt-grid-container">

                    {
                        attributes.items.map( ( item, index ) => {
                            return (
                                <div className="gt-grid-item">

                                    <PortfolioImage
                                        id={ item.imgID }
                                        url={ item.imgURL }
                                        alt={ item.imgAlt }
                                        onSelect={ ( img ) => this.onSelectImage( img, index ) }
                                        onRemove={ () => this.onRemoveImage( index ) }
                                        addSize={ this.addImageSize }
                                        isSelected={ isSelected }
                                    />

                                    <div className={ itemClasses }>

                                        <RichText
                                            tagName={ attributes.titleTag.toLowerCase() }
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
                                            className="gt-text"
                                            onChange={ ( newText ) => this.onChangeText( newText, index ) }
                                            keepPlaceholderOnFocus
                                        />

                                        { attributes.showButtons && (
                                            <RichText
                                                tagName="a"
                                                placeholder={ __( 'Add button text' ) }
                                                value={ item.buttonText }
                                                className="gt-button"
                                                onChange={ ( newButtonText ) => this.onChangeButtonText( newButtonText, index ) }
                                                formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                                keepPlaceholderOnFocus
                                            />
                                        ) }

                                    </div>

                                    { isSelected && [
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
                                    ] }

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
        ];
    }
}

export default withColors( ( getColor, setColor, { attributes } ) => {
    return {
        backgroundColor: getColor( attributes.backgroundColor, attributes.customBackgroundColor, 'background-color' ),
        setBackgroundColor: setColor( 'backgroundColor', 'customBackgroundColor' ),
        textColor: getColor( attributes.textColor, attributes.customTextColor, 'color' ),
        setTextColor: setColor( 'textColor', 'customTextColor' ),
    };
} )( gtPortfolioEdit );
