/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { Component, Fragment } = wp.element;
const { __ } = wp.i18n;
const { select } = wp.data;

const {
    PlainText,
 } = wp.editor;

const {
    Button,
    IconButton,
    Placeholder,
} = wp.components;

class IconPicker extends Component {
    constructor() {
        super( ...arguments );

        this.showIconPicker = this.showIconPicker.bind( this );
        this.hideIconPicker = this.hideIconPicker.bind( this );

        this.state = {
            displayed: false,
        };
    }

    showIconPicker() {
        this.setState( { displayed: true } );
    }

    hideIconPicker() {
        this.setState( { displayed: false } );
    }

    componentDidUpdate( prevProps ) {
		const { isSelected } = this.props;

		// Hide IconPicker if block is unselected.
		if ( this.state.displayed && ! isSelected && prevProps.isSelected ) {
            this.setState( { displayed: false } );
		}
	}

    setIcon( icon ) {
        const { onChange } = this.props;

        // Change Icon with function from parent.
        onChange( icon );

        // Hide IconPicker after icon is selected.
        this.hideIconPicker();
    }

    render() {
        const {
            icon,
            index,
            onChange,
            isSelected
        } = this.props;

        const pluginURL = select( 'gt-blocks' ).getPluginURL();
        const iconURL = pluginURL + '/assets/icons/fontawesome.svg#' + icon;
        const iconClass = classnames( 'icon', `icon-${icon}` );

        return (
            <div className="gt-icon-wrapper">

                { ! icon ? (

                    <Placeholder
                        className="gt-icon-placeholder"
                        instructions={ __( 'Choose an icon here.' ) }
                        icon="carrot"
                        label={ __( 'Icon' ) }
                    >
                        <Button isLarge onClick={ this.showIconPicker }>
                            { __( 'Select Icon' ) }
                        </Button>
                    </Placeholder>

                ) : (

                    <Fragment>

                        { isSelected ? (

                            <a className="gt-show-icon-picker" onClick={ this.showIconPicker }>
                                <div className="gt-icon" data-icon={ icon }>
                                    <svg className={ iconClass } aria-hidden="true" role="img">
                                        <use href={ iconURL }></use>
                                    </svg>
                                </div>
                            </a>

                        ) : (

                            <div className="gt-icon" data-icon={ icon }>
                                <svg className={ iconClass } aria-hidden="true" role="img">
                                    <use href={ iconURL }></use>
                                </svg>
                            </div>

                        ) }

                    </Fragment>

                ) }

                { ( isSelected && this.state.displayed ) && (
                    <div className="gt-icon-picker">
                        <div className="gt-icon-picker-box">

                            <h4 className="gt-icon-picker-title">
                                Select Icon
                            </h4>

                            <div className="gt-icon-picker-list">
                                <a onClick={ () => this.setIcon( 'home' ) }>Home</a>
                                <a onClick={ () => this.setIcon( 'music' ) }>Music</a>
                                <a onClick={ () => this.setIcon( 'cog' ) }>Cog</a>
                            </div>

                        </div>
                    </div>
                ) }

            </div>
        );
    }
}

export default IconPicker;
