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
    InspectorControls,
    PanelColorSettings,
    withColors,
} = wp.editor;

const {
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

                    <PanelBody title={ __( 'Layout Settings' ) } initialOpen={ false } className="gt-panel-layout-settings gt-panel">

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

                </InspectorControls>

                <div id={ blockId } className={ classNames } style={ blockStyles }>
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
