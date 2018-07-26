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

const { compose } = wp.compose;

const {
    BlockAlignmentToolbar,
    BlockControls,
    InnerBlocks,
    InspectorControls,
    PanelColor,
    withColors,
} = wp.editor;

const {
    PanelBody,
} = wp.components;

class gtContainerEdit extends Component {
    constructor() {
        super( ...arguments );
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            className
        } = this.props;

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

                    </PanelBody>

                </InspectorControls>

                <div className={ className }>
                    <InnerBlocks />
                </div>

            </Fragment>
        );
    }
}

export default gtContainerEdit;
