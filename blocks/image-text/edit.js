/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    startCase,
    isEmpty,
    map,
    get,
} from 'lodash';

/**
 * Block dependencies
 */
import {
    gtVerticalAlignTopIcon,
    gtVerticalAlignCenterIcon,
    gtVerticalAlignBottomIcon,
    gtImagePositionIcon,
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

const {
    AlignmentToolbar,
    BlockControls,
    InspectorControls,
    MediaPlaceholder,
    MediaUpload,
    RichText,
    withColors,
    PanelColor,
} = wp.editor;

const {
    Button,
    FontSizePicker,
    IconButton,
    PanelBody,
    RangeControl,
    SelectControl,
    TextControl,
    ToggleControl,
    Toolbar,
    Tooltip,
    withAPIData,
} = wp.components;

const columnSizes = [
    { value: 'block-column-25', label: __( '25%' ) },
    { value: 'block-column-33', label: __( '33%' ) },
    { value: 'block-column-40', label: __( '40%' ) },
    { value: 'block-column-50', label: __( '50%' ) },
    { value: 'block-column-66', label: __( '66%' ) },
];

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

const verticalAlignmentControls = {
    top: {
        icon: gtVerticalAlignTopIcon,
        title: __( 'Top' ),
    },
    center: {
        icon: gtVerticalAlignCenterIcon,
        title: __( 'Center' ),
    },
    bottom: {
        icon: gtVerticalAlignBottomIcon,
        title: __( 'Bottom' ),
    },
};

class gtImageTextEdit extends Component {
    constructor() {
        super( ...arguments );

        this.onSelectImage = this.onSelectImage.bind( this );
        this.onRemoveImage = this.onRemoveImage.bind( this );
        this.updateImageURL = this.updateImageURL.bind( this );
        this.getAvailableSizes = this.getAvailableSizes.bind( this );
        this.getFontSize = this.getFontSize.bind( this );
        this.setFontSize = this.setFontSize.bind( this );
    }

    onSelectImage( img ) {
        this.props.setAttributes( {
            imgID: img.id,
            imgURL: img.url,
            imgAlt: img.alt,
        } );
    }

    onRemoveImage() {
        this.props.setAttributes( {
            imgID: undefined,
            imgURL: undefined,
            imgAlt: undefined,
        } );
    }

    updateImageURL( url ) {
        this.props.setAttributes( { imgURL: url } );
    }

    getAvailableSizes() {
        return get( this.props.image, [ 'data', 'media_details', 'sizes' ], {} );
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
            setBackgroundColor,
            setTextColor,
            setAttributes,
            isSelected,
            className
        } = this.props;

        const availableSizes = this.getAvailableSizes();
        const fontSize = this.getFontSize();

        const classNames= classnames( className, {
            [ `${ attributes.columnSize }` ]: attributes.columnSize,
            [ `gt-vertical-align-${ attributes.verticalAlignment }` ]: ( attributes.verticalAlignment !== 'top' ),
            'gt-image-position-right': attributes.imagePosition,
            'gt-has-spacing': attributes.spacing,
            'has-background': backgroundColor.value,
            [ backgroundColor.class ]: backgroundColor.class,
            'has-text-color': textColor.value,
            [ textColor.class ]: textColor.class,
        } );

        const styles = {
            backgroundColor: backgroundColor.class ? undefined : backgroundColor.value,
            color: textColor.class ? undefined : textColor.value,
            textAlign: attributes.textAlignment,
        };

        return (
            <Fragment>
                <BlockControls>

                    <Toolbar className='components-toolbar'>
                        <MediaUpload
                            onSelect={ this.onSelectImage }
                            type="image"
                            value={ attributes.imgID }
                            render={ ( { open } ) => (
                                <IconButton
                                    className="components-toolbar__control"
                                    label={ __( 'Edit image' ) }
                                    icon="edit"
                                    onClick={ open }
                                    />
                            ) }
                        />

                        <Tooltip text={ __( 'Flip Image Position' )  }>
                            <Button
                                className={ classnames(
                                    'components-icon-button',
                                    'components-toolbar__control',
                                    'gt-image-position-toolbar-icon',
                                    { 'is-active': attributes.imagePosition },
                                ) }
                                onClick={ () => setAttributes( { imagePosition: ! attributes.imagePosition } ) }
                            >
                                { gtImagePositionIcon }
                            </Button>
                        </Tooltip>
                    </Toolbar>

                    <AlignmentToolbar
                        value={ attributes.textAlignment }
                        onChange={ ( newAlignment ) => setAttributes( { textAlignment: newAlignment } ) }
                    />

                    <Toolbar
                        controls={
                        '234'.split( '' ).map( ( level ) => ( {
                            icon: 'heading',
                            title: sprintf( __( 'Heading %s' ), level ),
                            isActive: 'H' + level === attributes.titleTag,
                            onClick: () => setAttributes( { titleTag: 'H' + level } ),
                            subscript: level,
                        } ) )
                        }
                    />

                </BlockControls>

                <InspectorControls>

                    <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

                        <SelectControl
                            label={ __( 'Column Size' ) }
                            value={ attributes.columnSize }
                            onChange={ ( newSize ) => setAttributes( { columnSize: newSize } ) }
                            options={ columnSizes }
                        />

                        <SelectControl
                            label={ __( 'Image Position' ) }
                            value={ attributes.imagePosition }
                            onChange={ () => setAttributes( { imagePosition: ! attributes.imagePosition } ) }
                            options={ [
                                { value: false, label: __( 'Left' ) },
                                { value: true, label: __( 'Right' ) }
                            ] }
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
                            label={ __( 'Add bottom spacing?' ) }
                            checked={ !! attributes.spacing }
                            onChange={ () => setAttributes( { spacing: ! attributes.spacing } ) }
                        />

                    </PanelBody>

                    <PanelBody title={ __( 'Image Settings' ) } initialOpen={ false } className="gt-panel-image-settings gt-panel">

                        { ! isEmpty( availableSizes ) && (
                            <SelectControl
                                label={ __( 'Size' ) }
                                value={ attributes.imgURL }
                                options={ map( availableSizes, ( size, name ) => ( {
                                    value: size.source_url,
                                    label: startCase( name ),
                                } ) ) }
                                onChange={ this.updateImageURL }
                            />
                        ) }

                        <TextControl
                            label={ __( 'Textual Alternative' ) }
                            value={ attributes.imgAlt }
                            onChange={ ( newAlt ) => setAttributes( { imgAlt: newAlt } ) }
                            help={ __( 'Describe the purpose of the image. Leave empty if the image is not a key part of the content.' ) }
                        />

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

                        <p><label className="blocks-base-control__label">{ __( 'Vertical Alignment' ) }</label></p>
                        <Toolbar
                            className='gt-vertical-align-control'
                            controls={
                                [ 'top', 'center', 'bottom' ].map( control => {
                                    return {
                                        ...verticalAlignmentControls[ control ],
                                        isActive: attributes.verticalAlignment === control,
                                        onClick: () => setAttributes( { verticalAlignment: control } ),
                                    };
                                } )
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

                <div className={ classNames }>

                    <div className="block-image">

                    { ! attributes.imgID ? (

                        <MediaPlaceholder
                            icon="format-image"
                            className="block-image-placeholder"
                            labels={ {
                                title: __( 'Image' ),
                                name: __( 'an image' ),
                            } }
                            onSelect={ this.onSelectImage }
                            accept="image/*"
                            type="image"
                        />

                    ) : (

                            <div className="image-wrapper">

                                { isSelected ? (

                                    <div className="edit-image">

                                        <MediaUpload
                                            onSelect={ this.onSelectImage }
                                            type="image"
                                            value={ attributes.imgID }
                                            render={ ( { open } ) => (
                                                <img
                                                    src={ attributes.imgURL }
                                                    alt={ attributes.imgAlt }
                                                    onClick={ open }
                                                />
                                            ) }
                                        />

                                        <IconButton
                                            className="remove-image"
                                            label={ __( 'Remove Image' ) }
                                            icon="no-alt"
                                            onClick={ this.onRemoveImage }
                                        />

                                    </div>

                                ) : (

                                    <img
                                        src={ attributes.imgURL }
                                        alt={ attributes.imgAlt }
                                    />

                                ) }

                            </div>

                        ) }

                    </div>

                    <div className="block-content" style={ styles }>

                        <div className="block-content-inner">

                            <RichText
                                tagName={ attributes.titleTag.toLowerCase() }
                                placeholder={ __( 'Enter a title' ) }
                                value={ attributes.title }
                                className="block-title"
                                style={ styles }
                                onChange={ ( newTitle ) => setAttributes( { title: newTitle } ) }
                            />

                            <RichText
                                tagName="div"
                                multiline="p"
                                placeholder={ __( 'Enter your text here.' ) }
                                value={ attributes.text }
                                className="block-text"
                                style={ { fontSize: fontSize ? fontSize + 'px' : undefined } }
                                onChange={ ( newText ) => setAttributes( { text: newText } ) }
                            />

                        </div>

                    </div>

                </div>

            </Fragment>
        );
    }
}

export default wp.compose.compose( [
    withAPIData( ( props ) => {
        const { imgID } = props.attributes;
        if ( ! imgID ) {
            return {};
        }

        return {
            image: `/wp/v2/media/${ imgID }`,
        };
    } ),
    withColors( ( getColor, setColor, { attributes } ) => {
        return {
            backgroundColor: getColor( attributes.backgroundColor, attributes.customBackgroundColor, 'background-color' ),
            setBackgroundColor: setColor( 'backgroundColor', 'customBackgroundColor' ),
            textColor: getColor( attributes.textColor, attributes.customTextColor, 'color' ),
            setTextColor: setColor( 'textColor', 'customTextColor' ),
        };
    } )
] )( gtImageTextEdit );
