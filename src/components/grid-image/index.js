/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const { compose } = wp.compose;
const { withSelect } = wp.data;

/**
* Internal dependencies
*/
import { default as GtImagePlaceholder } from '../image-placeholder';

class GridImage extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			currentImage: 0,
		};
	}

	static getDerivedStateFromProps( nextProps ) {
		if ( nextProps.image ) {
			return { currentImage: nextProps.imgID };
		}
		return null;
	}

	componentDidUpdate( prevProps, prevState ) {
		const { imgID, addSize } = this.props;

		if ( this.props.image && imgID !== prevState.currentImage ) {
			const sizeObj = get( this.props.image, [ 'media_details', 'sizes' ], {} );
			addSize( imgID, sizeObj );
		}
	}

	render() {
		const {
			imgID,
			imgURL,
			imgAlt,
			onSelect,
			onRemove,
			isSelected,
		} = this.props;

		return (
			<GtImagePlaceholder
				imgID={ imgID }
				imgURL={ imgURL }
				imgAlt={ imgAlt }
				onSelect={ onSelect }
				onRemove={ onRemove }
				isSelected={ isSelected }
			/>
		);
	}
}

export default compose( [
	withSelect( ( select, { imgID } ) => {
		const { getMedia } = select( 'core' );
		return {
			image: imgID ? getMedia( imgID ) : null,
		};
	} ),
] )( GridImage );
