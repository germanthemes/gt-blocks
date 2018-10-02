/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks,
} = wp.editor;

/**
 * Block Edit Component
 */
class gtGridColumnEdit extends Component {
	render() {
		const {
			className,
		} = this.props;

		const itemClasses = {};
		const itemStyles = {};

		return (
			<Fragment>

				<div className={ className }>

					<div className={ itemClasses } style={ itemStyles }>

						<InnerBlocks
							allowedBlocks={ [ 'gt-layout-blocks/heading', 'core/paragraph' ] }
							template={ [
								[ 'gt-layout-blocks/heading', {
									placeholder: __( 'Write icon title...' ),
								} ],
								[ 'core/paragraph', {
									placeholder: __( 'Write icon description...' ),
								} ],
							] }
							templateLock="all"
						/>

					</div>

				</div>

			</Fragment>
		);
	}
}

export default gtGridColumnEdit;
