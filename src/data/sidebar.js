/**
 * WordPress dependencies
 */
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;
const { Fragment } = wp.element;
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { __ } = wp.i18n;
const { ToggleControl } = wp.components;

function PageOptions( { hideTitle, onUpdate } ) {
	return (
		<Fragment>

			<PluginSidebarMoreMenuItem
				target="gt-page-options-sidebar"
			>
				{ __( 'GT Page Options' ) }
			</PluginSidebarMoreMenuItem>

			<PluginSidebar
				name="gt-page-options-sidebar"
				title={ __( 'GT Page Options' ) }
			>
				Content of the sidebar
				<ToggleControl
					label={ __( 'Hide page title' ) }
					checked={ hideTitle === 'yes' ? true : false }
					onChange={ () => onUpdate( hideTitle === 'yes' ? false : true ) }
				/>
			</PluginSidebar>

		</Fragment>
	);
};

const plugin = compose( [
	withSelect( ( select ) => {
		return {
			hideTitle: select( 'core/editor' ).getEditedPostAttribute( 'meta' ).gt_hide_page_title,
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		onUpdate( hideTitle ) {
			dispatch( 'core/editor' ).editPost( { meta: { gt_hide_page_title: hideTitle ? 'yes' : 'no' } } );
		},
	} ) ),
] )( PageOptions );

registerPlugin( 'gt-page-options', {
	icon: 'book-alt',
	render: plugin,
} );
