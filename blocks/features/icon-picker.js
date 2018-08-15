/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { Component } = wp.element;
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
                        instructions={ __( 'You can choose from over 700 Fontawesome icons.' ) }
                        icon="format-image"
                        label={ __( 'Icon' ) }
                    >
                        <Button isLarge onClick={ console.log('clicked') }>
                            { __( 'Select Icon' ) }
                        </Button>
                    </Placeholder>

                ) : (

                    <div className="gt-icon" data-icon={ icon }>
                        <svg className={ iconClass } aria-hidden="true" role="img">
                            <use href={ iconURL }></use>
                        </svg>
                    </div>

                ) }

                { isSelected && (
                    <div className="gt-icon-input">
                        <PlainText
                            className="input-control"
                            id={ `gt-icon-input-${ index }` }
                            value={ icon }
                            onChange={ onChange }
                        />

                        <div className="gt-icon-picker">
                            <a onClick={ () => onChange( 'home' ) }>Home</a>
                            <a onClick={ () => onChange( 'music' ) }>Music</a>
                            <a onClick={ () => onChange( 'cog' ) }>Cog</a>
                        </div>
                    </div>
                ) }

            </div>
        );
    }
}

export default IconPicker;
