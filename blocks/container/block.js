/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { Component } = wp.element;
const { __ } = wp.i18n;
const {
    ColorPalette,
    InnerBlocks,
    InspectorControls,
} = wp.blocks;

const {
    PanelColor,
    Toolbar,
} = wp.components;

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

class gtContainerBlock extends Component {
    constructor() {
        super( ...arguments );
    }

    render() {
        const { attributes, setAttributes, isSelected, className } = this.props;

        const classNames= classnames( className, {
            'gt-has-background': attributes.backgroundColor,
        } );

        const styles = {
            backgroundColor: attributes.backgroundColor,
            color: attributes.textColor,
        };

        return [
            isSelected && (
                <InspectorControls key="inspector">

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

                    <PanelColor title={ __( 'Background Color' ) } colorValue={ attributes.backgroundColor } initialOpen={ false }>
                        <ColorPalette
                            value={ attributes.backgroundColor }
                            onChange={ ( colorValue ) => setAttributes( { backgroundColor: colorValue } ) }
                        />
                    </PanelColor>

                    <PanelColor title={ __( 'Text Color' ) } colorValue={ attributes.textColor } initialOpen={ false }>
                        <ColorPalette
                            value={ attributes.textColor }
                            onChange={ ( colorValue ) => setAttributes( { textColor: colorValue } ) }
                        />
                    </PanelColor>

                </InspectorControls>
            ),

            <div className={ classNames } style={ styles }>
                <div className="block-content">
                    <InnerBlocks />
                </div>
            </div>
        ];
    }
}

export default gtContainerBlock;
