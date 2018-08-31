/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
const { Component, Fragment } = wp.element;
const { __ } = wp.i18n;
const { select, withDispatch } = wp.data;

const {
    PlainText,
 } = wp.editor;

const {
    Button,
    IconButton,
    Placeholder,
    Tooltip,
} = wp.components;

class IconPicker extends Component {
    constructor() {
        super( ...arguments );
    }

    displayIcon( icon ) {
        const { iconSize } = this.props;
        const pluginURL = select( 'gt-layout-blocks-store' ).getPluginURL();

        const svgURL = pluginURL + 'assets/icons/fontawesome.svg#' + icon;
        const svgClass = classnames( 'icon', `icon-${icon}` );
        const svgStyles = {
            width: iconSize !== 32 ? iconSize + 'px' : undefined,
            height: iconSize !== 32 ? iconSize + 'px' : undefined,
        };

        return (
            <span className="gt-icon-svg" data-icon={ icon }>
                <svg className={ svgClass } style={ svgStyles } aria-hidden="true" role="img">
                    <use href={ svgURL }></use>
                </svg>
            </span>
        );
    }

    render() {
        const {
            icon,
            iconClasses,
            iconStyles,
            isSelected,
            openModal,
        } = this.props;

        return (
            <div className="gt-icon-wrapper">

                { ! icon ? (

                    <Fragment>
                        <Placeholder
                            className="gt-icon-placeholder"
                            instructions={ __( 'Choose an icon here.' ) }
                            icon="carrot"
                            label={ __( 'Icon' ) }
                        >
                            <Button isLarge onClick={ () => {
                                { this.props.onModalOpen ? this.props.onModalOpen() : null }
                                openModal( 'gt-layout-blocks/icon-picker-modal' );
                            } }>
                                { __( 'Select icon' ) }
                            </Button>
                        </Placeholder>

                    </Fragment>

                ) : (

                    <Fragment>

                        { isSelected ? (

                            <a className="gt-show-icon-picker" onClick={ () => {
                                { this.props.onModalOpen ? this.props.onModalOpen() : null }
                                openModal( 'gt-layout-blocks/icon-picker-modal' );
                            } }>
                                <Tooltip text={ __( 'Edit icon' ) }>
                                    <div className={ iconClasses } style={ iconStyles }>
                                            { this.displayIcon( icon ) }
                                    </div>
                                </Tooltip>
                            </a>

                        ) : (

                            <div className={ iconClasses } style={ iconStyles }>
                                { this.displayIcon( icon ) }
                            </div>

                        ) }

                    </Fragment>

                ) }

            </div>
        );
    }
}

export default withDispatch( ( dispatch, ) => {
	const {
		openModal,
	} = dispatch( 'core/edit-post' );

	return {
		openModal,
	};
} )( IconPicker );
