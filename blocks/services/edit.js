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

class gtServicesEdit extends Component {
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
                <div className={ className }>

                    <RichText
                        tagName="div"
                        multiline="p"
                        placeholder={ __( 'Enter your text here.' ) }
                        value={ attributes.text }
                        className="block-text"
                        onChange={ ( newText ) => setAttributes( { text: newText } ) }
                    />

                </div>

            </Fragment>
        );
    }
}

export default gtServicesEdit;
