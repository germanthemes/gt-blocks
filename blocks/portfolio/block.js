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
     AlignmentToolbar,
     BlockAlignmentToolbar,
     BlockControls,
     ColorPalette,
     ImagePlaceholder,
     InspectorControls,
     MediaUpload,
     registerBlockType,
     RichText,
     UrlInput,
 } = wp.blocks;

 const {
     Button,
     Dashicon,
     DropZone,
     FormFileUpload,
     IconButton,
     PanelBody,
     PanelColor,
     Placeholder,
     RangeControl,
     SelectControl,
     TextControl,
     ToggleControl,
     Toolbar,
     Tooltip,
     withAPIData,
 } = wp.components;

 const {
     mediaUpload,
 } = wp.utils;

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

class gtPortfolioBlock extends Component {
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
        this.onChangeButtonURL  = this.onChangeButtonURL.bind( this );

        this.state = {
            editItems: false,
            editText: null,
            imageSizes: {},
        };
    }

    componentWillReceiveProps( nextProps ) {
        // Deactivate item editing when deselecting the block
        if ( ! nextProps.isSelected && this.props.isSelected ) {
            this.setState( {
                editItems: false,
                editText: null,
            } );
        }
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

    onChangeButtonURL( newButtonURL, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].buttonURL = newButtonURL;
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
        const { attributes, setAttributes, isSelected, className } = this.props;
        const availableSizes = this.getAvailableSizes();

        const classNames= classnames( className, {
            'gt-items-edited': this.state.editItems,
            [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
        } );

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

                    <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false }>

                        <RangeControl
                            label={ __( 'Columns' ) }
                            value={ attributes.columns }
                            onChange={ ( nextColumns ) => setAttributes( { columns: nextColumns } ) }
                            min={ 2 }
                            max={ 6 }
                        />

                        <label className="blocks-base-control__label">{ __( 'Block Alignment' ) }</label>
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

                    </PanelBody>

                    <PanelBody title={ __( 'Image Settings' ) } initialOpen={ false } className="gt-panel-image-settings">

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

                                    <div className="gt-content">

                                        <RichText
                                            tagName="h2"
                                            placeholder={ __( 'Enter a title' ) }
                                            value={ item.title }
                                            className="gt-title"
                                            onChange={ ( newTitle ) => this.onChangeTitle( newTitle, index ) }
                                            isSelected={ isSelected && this.state.editText === `title${index}` }
                                            onFocus={ () => this.setState( { editText: `title${index}` } ) }
                                        />

                                        <RichText
                                            tagName="div"
                                            multiline="p"
                                            placeholder={ __( 'Enter your text here.' ) }
                                            value={ item.text }
                                            className="gt-text"
                                            onChange={ ( newText ) => this.onChangeText( newText, index ) }
                                            isSelected={ isSelected && this.state.editText === `text${index}` }
                                            onFocus={ () => this.setState( { editText: `text${index}` } ) }
                                        />

                                        <RichText
                                            tagName="a"
                                            placeholder={ __( 'Add button text' ) }
                                            value={ item.buttonText }
                                            className="gt-button"
                                            onChange={ ( newButtonText ) => this.onChangeButtonText( newButtonText, index ) }
                                            formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                            isSelected={ isSelected && this.state.editText === `button${index}` }
                                            onFocus={ () => this.setState( { editText: `button${index}` } ) }
                                            keepPlaceholderOnFocus
                                        />

                                        { isSelected && (
                                            <form
                                                className="gt-url-input"
                                                onSubmit={ ( event ) => event.preventDefault() }>
                                                <Dashicon icon="admin-links" />
                                                <UrlInput
                                                    value={ item.buttonURL }
                                                    onChange={ ( newButtonURL ) => this.onChangeButtonURL( newButtonURL, index ) }
                                                    autoFocus= { false }
                                                />
                                                <IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
                                            </form>
                                        ) }

                                    </div>

                                    { isSelected && (
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
                                    ) }

                                </div>
                            );
                        })
                    }

                </div>

                { isSelected && (
                    <div class="gt-editor-portolio-controls">

                        <Button
                            isLarge
                            onClick={ this.addPortfolioItem }
                        >
                            { __( 'Add portfolio item' ) }
                        </Button>

                        <Button
                            isLarge
                            onClick={ () => this.setState( { editItems: ! this.state.editItems } ) }
                        >
                            { __( 'Edit portfolio items' ) }
                        </Button>
                    </div>
                ) }
            </div>
        ];
    }
}

export default gtPortfolioBlock;
