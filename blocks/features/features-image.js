/**
 * External dependencies
 */
import {
    startCase,
    isEmpty,
    map,
    get,
} from 'lodash';

/**
 * Internal block libraries
 */
const { Component } = wp.element;
const { __ } = wp.i18n;
const {
    MediaUpload,
} = wp.editor;

const {
    Button,
    IconButton,
    Placeholder,
    withAPIData,
} = wp.components;

class FeaturesImage extends Component {
    constructor() {
        super( ...arguments );
    }

    componentWillReceiveProps( { image } ) {
        const { imgID, addSize } = this.props;

        if ( image && image.data ) {
            const sizeObj = get( image, [ 'data', 'media_details', 'sizes' ], {} );
            addSize( imgID, sizeObj );
        }
    }

    render() {
        const { imgID, imgURL, imgAlt, onSelect, onRemove, isSelected } = this.props;

        return (
            <div className="gt-image">

                { ! imgID ? (

                    <Placeholder
                        className="gt-image-placeholder"
                        instructions={ __( 'Drag image here or add from media library' ) }
                        icon="format-image"
                        label={ __( 'Image' ) } >

                        <MediaUpload
                            onSelect={ onSelect }
                            type="image"
                            render={ ( { open } ) => (
                                <Button isLarge onClick={ open }>
                                    { __( 'Add from Media Library' ) }
                                </Button>
                            ) }
                        />
                    </Placeholder>

                ) : (

                    <div className="gt-image-wrapper">

                        { isSelected ? (

                            <div className="gt-edit-image">

                                <MediaUpload
                                    onSelect={ onSelect }
                                    type="image"
                                    value={ imgID }
                                    render={ ( { open } ) => (
                                        <img
                                            src={ imgURL }
                                            alt={ imgAlt }
                                            data-img-id={ imgID }
                                            onClick={ open }
                                        />
                                    ) }
                                />

                                <IconButton
                                    className="remove-image"
                                    label={ __( 'Remove Image' ) }
                                    icon="no-alt"
                                    onClick={ onRemove }
                                />

                            </div>

                        ) : (

                            <img
                                src={ imgURL }
                                alt={ imgAlt }
                                data-img-id={ imgID }
                            />

                        ) }

                    </div>

                ) }

            </div>
        );
    }
}

export default withAPIData( ( { imgID } ) => ( {
	image: imgID ? `/wp/v2/media/${ imgID }` : {},
} ) )( FeaturesImage );
