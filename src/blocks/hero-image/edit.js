/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const { InnerBlocks } = wp.editor;

/**
 * Internal dependencies
 */
import { default as BackgroundEdit } from '../../components/background-section/edit';

/**
 * Block Edit Component
 */
class HeroImageEdit extends Component {
	render() {
		return (
			<BackgroundEdit { ...this.props }>

				<InnerBlocks
					allowedBlocks={ [ 'gt-layout-blocks/hero-content' ] }
					template={ [
						[ 'gt-layout-blocks/hero-content', {} ],
					] }
					templateLock="all"
				/>

			</BackgroundEdit>
		);
	}
}

export default HeroImageEdit;
