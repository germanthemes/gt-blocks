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
} = wp.blocks;

const {
    Button,
    IconButton,
    Placeholder,
    withAPIData,
} = wp.components;

class PortfolioImage extends Component {
    constructor() {
        super( ...arguments );
    }

    componentWillReceiveProps( { image } ) {
        const { id, addSize } = this.props;

        if ( image && image.data ) {
            const sizeObj = get( image, [ 'data', 'media_details', 'sizes' ], {} );
            addSize( id, sizeObj );
        }
    }

    render() {
        const { id, url, alt, onSelect, onRemove, isSelected } = this.props;

        return (
            <div className="gt-image">

                { ! id ? (

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

                    <div class="gt-image-wrapper">

                        { isSelected ? (

                            <div class="gt-edit-image">

                                <MediaUpload
                                    onSelect={ onSelect }
                                    type="image"
                                    value={ id }
                                    render={ ( { open } ) => (
                                        <img
                                            src={ url }
                                            alt={ alt }
                                            data-img-id={ id }
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
                                src={ url }
                                alt={ alt }
                                data-img-id={ id }
                            />

                        ) }

                    </div>

                ) }

            </div>
        );
    }
}

export default withAPIData( ( { id } ) => ( {
	image: id ? `/wp/v2/media/${ id }` : {},
} ) )( PortfolioImage );
