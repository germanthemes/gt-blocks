/**
 * External dependencies
 */
import { find } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { withDispatch } = wp.data;

const {
	Component,
	Fragment,
} = wp.element;

const { InspectorControls } = wp.editor;

const {
	PanelBody,
	SelectControl,
} = wp.components;

/**
 * Internal dependencies
 */
import { default as GridEdit } from '../../components/grid-container/edit';

// Define allowed child blocks.
const ALLOWED_BLOCKS = [ 'gt-layout-blocks/image', 'gt-layout-blocks/heading', 'core/paragraph' ];

// Define blocks for each column.
const TEMPLATE = [
	[ 'gt-layout-blocks/image', {
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/portfolio',
	} ],
	[ 'gt-layout-blocks/heading', {
		placeholder: __( 'Project', 'gt-layout-blocks' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/portfolio',
	} ],
	[ 'core/paragraph', {
		placeholder: __( 'Write project description...', 'gt-layout-blocks' ),
		synchronizeStyling: true,
		parentBlock: 'gt-layout-blocks/portfolio',
	} ],
];

/**
 * Block Edit Component
 */
class PortfolioEdit extends Component {
	getActiveStyle( styles, className ) {
		if ( className ) {
			for ( const style of className.split( ' ' ) ) {
				if ( 'is-style-' !== style.substring( 0, 9 ) ) {
					continue;
				}

				const activeStyle = find( styles, { value: style.substring( 9 ) } );

				if ( activeStyle ) {
					return activeStyle.value;
				}
			}
		}

		return 'default';
	}

	replaceActiveStyle( className = '', activeStyle, newStyle ) {
		let classes = className.split( ' ' );

		// Remove active Style.
		classes = classes.filter( ( style ) => style !== 'is-style-' + activeStyle );

		// Add new style.
		classes.push( 'is-style-' + newStyle );

		return classes.join( ' ' );
	}

	render() {
		const {
			attributes,
			onChangeClassName,
		} = this.props;

		const blockStyles = [
			{ value: 'default', label: __( 'Default', 'gt-layout-blocks' ) },
			{ value: 'card', label: __( 'Card', 'gt-layout-blocks' ) },
		];

		const activeStyle = this.getActiveStyle( blockStyles, attributes.className );

		const updateClassName = ( newStyle ) => {
			const updatedClassName = this.replaceActiveStyle( attributes.className, activeStyle, newStyle );
			onChangeClassName( updatedClassName );
		};

		return (
			<Fragment>

				<InspectorControls>

					<PanelBody title={ __( 'Styles', 'gt-layout-blocks' ) } initialOpen={ false } className="gt-panel-styles gt-panel">

						<SelectControl
							label={ __( 'Styles', 'gt-layout-blocks' ) }
							value={ activeStyle }
							onChange={ ( newStyle ) => updateClassName( newStyle ) }
							options={ blockStyles }
						/>

					</PanelBody>

				</InspectorControls>

				<GridEdit
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
					templateLock="all"
					parentBlock={ this.props.name }
					{ ...this.props }
				/>

			</Fragment>
		);
	}
}

export default compose( [
	withDispatch( ( dispatch, { clientId } ) => {
		return {
			onChangeClassName( newClassName ) {
				dispatch( 'core/editor' ).updateBlockAttributes( clientId, {
					className: newClassName,
				} );
			},
		};
	} ),
] )( PortfolioEdit );
