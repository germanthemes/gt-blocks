/**
 * External dependencies
 */
import classnames from 'classnames';

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

const { compose, withInstanceId } = wp.compose;

const {
    BlockAlignmentToolbar,
    BlockControls,
    ContrastChecker,
    InnerBlocks,
    MediaUpload,
    InspectorControls,
    PanelColorSettings,
    withColors,
} = wp.editor;

const {
    Button,
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
    withFallbackStyles,
} = wp.components;

const { getComputedStyle } = window;

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

class gtContainerEdit extends Component {
    constructor() {
        super( ...arguments );

        this.onSelectImage = this.onSelectImage.bind( this );
        this.onRemoveImage = this.onRemoveImage.bind( this );
    }

    onSelectImage( img ) {
        this.props.setAttributes( {
            backgroundImageId: img.id,
            backgroundImageUrl: img.url,
        } );
    }

    onRemoveImage() {
        this.props.setAttributes( {
            backgroundImageId: undefined,
            backgroundImageUrl: undefined,
        } );
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
            instanceId,
            isSelected,
            className,
        } = this.props;

        const blockId = `gt-container-block-${instanceId}`;

        const blockClasses= classnames( className, {
            'has-text-color': textColor.value,
            [ textColor.class ]: textColor.class,
            'has-background': backgroundColor.value,
            [ backgroundColor.class ]: backgroundColor.class,
            'gt-has-background-image': attributes.backgroundImageId,
            'gt-fixed-background': attributes.fixedBackground,
        } );

        const blockStyles = {
            backgroundColor: backgroundColor.class ? undefined : backgroundColor.value,
            color: textColor.class ? undefined : textColor.value,
            backgroundImage: attributes.backgroundImageId ? `url(${attributes.backgroundImageUrl})` : undefined,
            backgroundPosition: attributes.backgroundPosition,
        };

        const overlayClasses = classnames( 'gt-background-overlay', {
            'has-background': backgroundColor.value,
            [ backgroundColor.class ]: backgroundColor.class,
        } );

        const overlayStyles = {
            backgroundColor: backgroundColor.value ? backgroundColor.value : '#000000',
            opacity: ( 100 - attributes.imageOpacity ) / 100,
        };

        const contentStyles = `
            #${blockId} .gt-inner-content .editor-block-list__block {
                max-width: ${attributes.contentWidth}px;
            }
        `;

        const dataBackgroundImage = attributes.backgroundImageId ? attributes.backgroundImageUrl : undefined;

        return (
            <Fragment>

                <BlockControls>

                    <BlockAlignmentToolbar
                        value={ attributes.blockAlignment }
                        onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
                        controls={ [ 'wide', 'full' ] }
                    />

                </BlockControls>

                <InspectorControls>

                    <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false }>

                        <BlockAlignmentToolbar
                            value={ attributes.blockAlignment }
                            onChange={ ( newAlign ) => setAttributes( { blockAlignment: newAlign } ) }
                            controls={ [ 'wide', 'full' ] }
                        />

                        <RangeControl
                            label={ __( 'Content Width (in px)' ) }
                            value={ attributes.contentWidth }
                            onChange={ ( maxWidth ) => setAttributes( { contentWidth: maxWidth } ) }
                            min={ 100 }
                            max={ 2500 }
                        />

                    </PanelBody>

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
                        />
                    </PanelColorSettings>

                    <PanelBody title={ __( 'Background Image' ) } initialOpen={ false } className="gt-blocks-container-background-image-panel">

                        <div className="gt-background-image">

                            { ! attributes.backgroundImageId ? (

                                <MediaUpload
                                    title={ __( 'Set background image' ) }
                                    onSelect={ this.onSelectImage }
                                    type="image"
                                    render={ ( { open } ) => (
                                        <Button onClick={ open } className="gt-set-image">
                							{ __( 'Set background image' ) }
                						</Button>
                                    ) }
                                />

                            ) : (

                                <Fragment>

                                    <MediaUpload
                                        title={ __( 'Set background image' ) }
                                        onSelect={ this.onSelectImage }
                                        type="image"
                                        value={ attributes.backgroundImageId }
                                        render={ ( { open } ) => (
                                            <img
                                                src={ attributes.backgroundImageUrl }
                                                onClick={ open }
                                            />
                                        ) }
                                    />

                                    <div className="gt-image-controls">

                                        <MediaUpload
                                            title={ __( 'Set background image' ) }
                                            onSelect={ this.onSelectImage }
                                            type="image"
                                            value={ attributes.backgroundImageId }
                                            render={ ( { open } ) => (
                                                <Button onClick={ open } isDefault isLarge className="gt-replace-image">
                        							{ __( 'Replace image' ) }
                        						</Button>
                                            ) }
                                        />

                                        <Button onClick={ this.onRemoveImage } isLink isDestructive>
                                            { __( 'Remove image' ) }
                                        </Button>

                                    </div>

                                </Fragment>

                            ) }

                        </div>

                        { attributes.backgroundImageId && (

                            <Fragment>

                                <RangeControl
                                    label={ __( 'Image Opacity' ) }
                                    value={ attributes.imageOpacity }
                                    onChange={ ( newOpacity ) => setAttributes( { imageOpacity: newOpacity } ) }
                                    min={ 0 }
                                    max={ 100 }
                                />

                                <SelectControl
                                    label={ __( 'Background Position' ) }
                                    value={ attributes.backgroundPosition }
                                    onChange={ ( newPosition ) => setAttributes( { backgroundPosition: newPosition } ) }
                                    options={ [
                                        { value: 'left top', label: __( 'Left Top' ) },
                                        { value: 'left center', label: __( 'Left Center' ) },
                                        { value: 'left bottom', label: __( 'Left Bottom' ) },
                                        { value: 'center top', label: __( 'Center Top' ) },
                                        { value: 'center center', label: __( 'Center Center' ) },
                                        { value: 'center bottom', label: __( 'Center Bottom' ) },
                                        { value: 'right top', label: __( 'Right Top' ) },
                                        { value: 'right center', label: __( 'Right Center' ) },
                                        { value: 'right bottom', label: __( 'Right Bottom' ) },
                                    ] }
                                />

                                <ToggleControl
                                    label={ __( 'Fixed Background' ) }
                                    checked={ !! attributes.fixedBackground }
                                    onChange={ () => setAttributes( { fixedBackground: ! attributes.fixedBackground } ) }
                                />

                            </Fragment>

                        ) }

                    </PanelBody>

                </InspectorControls>

                <div id={ blockId } className={ blockClasses } style={ blockStyles } data-background-image={ dataBackgroundImage }>

                    { attributes.backgroundImageId && (
                        <div className={ overlayClasses } style={ overlayStyles }></div>
                    ) }

                    <style>{ contentStyles }</style>
                    <div className="gt-inner-content">
                        <InnerBlocks />
                    </div>

                </div>

            </Fragment>
        );
    }
}

export default compose(
    withInstanceId,
    withColors( 'backgroundColor', { textColor: 'color' } ),
    applyFallbackStyles,
)( gtContainerEdit );
