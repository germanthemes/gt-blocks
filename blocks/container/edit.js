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
    IconButton,
    PanelBody,
    RangeControl,
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

        const classNames= classnames( className, {
            'has-text-color': textColor.value,
            [ textColor.class ]: textColor.class,
            'has-background': backgroundColor.value,
            [ backgroundColor.class ]: backgroundColor.class,
        } );

        const blockStyles = {
            backgroundColor: backgroundColor.class ? undefined : backgroundColor.value,
            color: textColor.class ? undefined : textColor.value,
        };

        const contentStyles = `
            #${blockId} .gt-inner-content .editor-block-list__block {
                max-width: ${attributes.contentWidth}px;
            }
        `;

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

                    <PanelBody title={ __( 'Background Image' ) } initialOpen={ false }>

                        <div className="gt-background-image">

                            { ! attributes.backgroundImageId ? (

                                <MediaUpload
                                    title={ __( 'Set background image' ) }
                                    onSelect={ this.onSelectImage }
                                    type="image"
                                    render={ ( { open } ) => (
                                        <Button onClick={ open } isDefault isLarge>
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

                                    <MediaUpload
                                        title={ __( 'Set background image' ) }
                                        onSelect={ this.onSelectImage }
                                        type="image"
                                        value={ attributes.backgroundImageId }
                                        render={ ( { open } ) => (
                                            <Button onClick={ open } isDefault isLarge>
                    							{ __( 'Replace image' ) }
                    						</Button>
                                        ) }
                                    />

                                    <IconButton
                                        className="remove-image"
                                        label={ __( 'Remove Image' ) }
                                        icon="no-alt"
                                        onClick={ this.onRemoveImage }
                                    />

                                </Fragment>

                            ) }

                        </div>

                    </PanelBody>

                </InspectorControls>

                <div id={ blockId } className={ classNames } style={ blockStyles }>
                    <img
                        src={ attributes.backgroundImageUrl }
                    />

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
