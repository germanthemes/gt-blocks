/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
 const { Component, compose } = wp.element;
 const { __, sprintf } = wp.i18n;
 const {
     AlignmentToolbar,
     BlockControls,
     ColorPalette,
     ImagePlaceholder,
     InspectorControls,
     MediaUpload,
     registerBlockType,
     RichText,
 } = wp.blocks;

 const {
     Button,
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

        this.addPortfolioItem = this.addPortfolioItem.bind( this );
        this.onSelectImage       = this.onSelectImage.bind( this );
        this.onRemoveImage       = this.onRemoveImage.bind( this );
        this.setImage            = this.setImage.bind( this );
        this.uploadFromFiles     = this.uploadFromFiles.bind( this );
        this.onFilesDrop         = this.onFilesDrop.bind( this );
        this.onHTMLDrop          = this.onHTMLDrop.bind( this );
        this.onChangeTitle = this.onChangeTitle.bind( this );
        this.onChangeText = this.onChangeText.bind( this );

        this.state = {
            editItems: false,
            editText: null,
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

    removePortfolioItem( index ) {
        const newItems = [...this.props.attributes.items].filter( (value, key) => key !== index );
        this.props.setAttributes( { items: newItems } );
    }

    onSelectImage( img, index ) {
        const newItems = [...this.props.attributes.items];
        if( newItems[index] !== undefined ) {
            newItems[index].imgID = img.id;
            newItems[index].imgURL = img.url;
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

    setImage( [ image ] ) {
        this.onSelectImage( image );
    };

    uploadFromFiles( event ) {
        mediaUpload( event.target.files, this.setImage );
    }

    onFilesDrop( files ) {
        mediaUpload( files, this.setImage );
    }

    onHTMLDrop( HTML ) {
        this.setImage( map(
            rawHandler( { HTML, mode: 'BLOCKS' } )
                .filter( ( { name } ) => name === 'core/image' ),
            'attributes'
        ) );
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
        const { attributes, setAttributes, isSelected, className } = this.props;

        const classNames= classnames( className, {
            'gt-items-edited': this.state.editItems,
            [ `gt-columns-${ attributes.columns }` ]: attributes.columns,
        } );

        return [
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

                </InspectorControls>
            ),
            <div className={ classNames }>
                <div className="gt-grid-container">

                    {
                        attributes.items.map( ( item, index ) => {
                            return (
                                <div className="gt-grid-item">

                                    <div className="gt-image">

                                        { ! item.imgID ? (

                                            <Placeholder
                                                className="gt-image-placeholder"
                                                instructions={ __( 'Drag image here or add from media library' ) }
                                                icon="format-image"
                                                label={ __( 'Image' ) } >

                                                <DropZone
                                                    onFilesDrop={ this.onFilesDrop }
                                                    onHTMLDrop={ this.onHTMLDrop }
                                                />

                                                <FormFileUpload
                                                    isLarge
                                                    className="wp-block-image__upload-button"
                                                    onChange={ this.uploadFromFiles }
                                                    accept="image/*"
                                                >
                                                    { __( 'Upload' ) }
                                                </FormFileUpload>

                                                <MediaUpload
                                                    onSelect={ ( img ) => this.onSelectImage( img, index ) }
                                                    type="image"
                                                    render={ ( { open } ) => (
                                                        <Button isLarge onClick={ open }>
                                                            { __( 'Add from Media Library' ) }
                                                        </Button>
                                                    ) }
                                                />
                                            </Placeholder>

                                        ) : (

                                            <div class="gt-image-wrapper">

                                                { isSelected ? (

                                                    <div class="gt-edit-image">

                                                        <MediaUpload
                                                            onSelect={ ( img ) => this.onSelectImage( img, index ) }
                                                            type="image"
                                                            value={ item.imgID }
                                                            render={ ( { open } ) => (
                                                                <img
                                                                    src={ item.imgURL }
                                                                    alt={ item.imgAlt }
                                                                    data-img-id={ item.imgID }
                                                                    onClick={ open }
                                                                />
                                                            ) }
                                                        />

                                                        <IconButton
                                                            className="remove-image"
                                                            label={ __( 'Remove Image' ) }
                                                            icon="no-alt"
                                                            onClick={ () => this.onRemoveImage( index ) }
                                                        />

                                                    </div>

                                                ) : (

                                                    <img
                                                        src={ item.imgURL }
                                                        alt={ item.imgAlt }
                                                        data-img-id={ item.imgID }
                                                    />

                                                ) }

                                            </div>

                                        ) }

                                    </div>

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

                                    </div>

                                    { this.state.editItems && (
                                        <IconButton
                                            className="remove-portfolio-item"
                                            label={ __( 'Remove Item' ) }
                                            icon="no-alt"
                                            onClick={ () => this.removePortfolioItem( index ) }
                                        />
                                    ) }

                                </div>
                            );
                        })
                    }

                </div>

                { isSelected && [
                    <Button
                        isLarge
                        onClick={ this.addPortfolioItem }
                    >
                        { __( 'Add portfolio item' ) }
                    </Button>
                    ,
                    <Button
                        isLarge
                        onClick={ () => this.setState( { editItems: ! this.state.editItems } ) }
                    >
                        { __( 'Edit portfolio items' ) }
                    </Button>
                ] }
            </div>
        ];
    }
}

export default gtPortfolioBlock;
