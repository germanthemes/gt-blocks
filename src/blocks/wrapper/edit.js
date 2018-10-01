/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks,
} = wp.editor;

const { dispatch, select } = wp.data;

/**
 * Block Edit Component
 */
class gtWrapperEdit extends Component {
	componentDidMount() {
		// Get Child Blocks.
		const children = select( 'core/editor' ).getBlocksByClientId( this.props.clientId )[ 0 ].innerBlocks;
		const childBlocks = children.map( child => child.clientId );

		// Save siblings in each child block.
		childBlocks.forEach( child => {
			dispatch( 'core/editor' ).updateBlockAttributes( child, { siblings: childBlocks } );
		} );
	}

	render() {
		const {
			attributes,
			className,
		} = this.props;

		const {
			customClass,
			allowedBlocks,
			template,
			templateLock,
		} = attributes;

		const classes = classnames( className, {
			[ `${ customClass }` ]: customClass,
		} );

		return (
			<Fragment>

				<div className={ classes }>

					<InnerBlocks
						allowedBlocks={ allowedBlocks || undefined }
						template={ template || [ [ 'core/paragraph', {} ] ] }
						templateLock={ templateLock || false }
					/>

				</div>

			</Fragment>
		);
	}
}

export default gtWrapperEdit;
