/**
 * WordPress dependencies
 */
const { Component } = wp.element;
const { InnerBlocks } = wp.editor;
const { __ } = wp.i18n;

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

				<div className="gt-hero-section">
					<InnerBlocks
						allowedBlocks={ [ 'gt-layout-blocks/heading', 'core/paragraph' ] }
						template={ [
							[ 'gt-layout-blocks/heading', {
								placeholder: __( 'Write Hero Heading...' ),
								customFontSize: 48,
							} ],
							[ 'core/paragraph', {
								placeholder: __( 'Write Hero text...' ),
								customFontSize: 20,
							} ],
							[ 'gt-layout-blocks/buttons', {
								customClass: 'gt-buttons-wrapper',
								buttons: 2,
								buttonAttributes: {
									buttonSize: 'medium',
									customFontSize: 20,
									synchronizeStyling: true,
									parentBlock: 'gt-layout-blocks/hero-image',
								},
							} ],
						] }
						templateLock="all"
					/>
				</div>

			</BackgroundEdit>
		);
	}
}

export default HeroImageEdit;
