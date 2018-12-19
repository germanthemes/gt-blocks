<?php
/**
 * GT Blocks Settings Page
 *
 * @package GT Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * GT Blocks Settings Page Class
 */
class GT_Blocks_Settings_Page {
	/**
	 * Setup the Settings Page class
	 *
	 * @return void
	 */
	static function setup() {

		// Add settings page to WordPress.
		add_action( 'admin_menu', array( __CLASS__, 'add_settings_page' ) );

		// Enqueue Settings CSS.
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'settings_page_css' ) );
	}

	/**
	 * Add Settings Page to Admin menu
	 *
	 * @return void
	 */
	static function add_settings_page() {
		add_options_page(
			esc_html__( 'GT Blocks', 'gt-blocks' ),
			esc_html__( 'GT Blocks', 'gt-blocks' ),
			'manage_options',
			'gt-blocks',
			array( __CLASS__, 'display_settings_page' )
		);
	}

	/**
	 * Display settings page
	 *
	 * @return void
	 */
	static function display_settings_page() {
		ob_start();
		?>

		<div id="gt-blocks-settings" class="gt-blocks-settings wrap">

			<h1><?php esc_html_e( 'GT Blocks', 'gt-blocks' ); ?></h1>

			<form class="gt-blocks-settings-form" method="post" action="options.php">
				<?php
					settings_fields( 'gt_blocks_settings' );
					do_settings_sections( 'gt_blocks_settings' );
					submit_button();
				?>
			</form>

		</div>

		<?php
		echo ob_get_clean();
	}

	/**
	 * Enqueues CSS for Settings page
	 *
	 * @param String $hook Slug of settings page.
	 * @return void
	 */
	static function settings_page_css( $hook ) {

		// Load styles and scripts only on theme info page.
		if ( 'settings_page_gt-blocks' != $hook ) {
			return;
		}

		// Embed theme info css style.
		wp_enqueue_style( 'gt-blocks-settings', GT_BLOCKS_PLUGIN_URL . 'assets/css/settings.css', array(), GT_BLOCKS_VERSION );
	}
}

// Run Settings Page Class.
GT_Blocks_Settings_Page::setup();
