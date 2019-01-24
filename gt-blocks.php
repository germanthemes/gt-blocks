<?php
/*
Plugin Name: GT Blocks
Plugin URI: https://germanthemes.de/blocks/
Description: Page Building Blocks
Author: GermanThemes
Author URI: https://germanthemes.de/
Version: 0.4
Text Domain: gt-blocks
Domain Path: /languages/
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

GT Blocks
Copyright(C) 2018, germanthemes.de - support@germanthemes.de
*/

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main GT_Blocks Class
 *
 * @package GT Blocks
 */
class GT_Blocks {

	/**
	 * Call all Functions to setup the Plugin
	 *
	 * @uses GT_Blocks::constants() Setup the constants needed
	 * @uses GT_Blocks::includes() Include the required files
	 * @uses GT_Blocks::setup_actions() Setup the hooks and actions
	 * @return void
	 */
	static function setup() {

		// Setup Constants.
		self::constants();

		// Setup Translation.
		add_action( 'init', array( __CLASS__, 'translation' ) );

		// Include Files.
		self::includes();

		// Setup Action Hooks.
		self::setup_actions();
	}

	/**
	 * Setup plugin constants
	 *
	 * @return void
	 */
	static function constants() {

		// Define Version Number.
		define( 'GT_BLOCKS_VERSION', '0.4' );

		// Plugin Folder Path.
		define( 'GT_BLOCKS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

		// Plugin Folder URL.
		define( 'GT_BLOCKS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

		// Plugin Root File.
		define( 'GT_BLOCKS_PLUGIN_FILE', __FILE__ );

		// Define Product ID.
		define( 'GT_BLOCKS_PRODUCT_ID', 171494 );

		// Define Update API URL.
		define( 'GT_BLOCKS_STORE_API_URL', 'https://themezee.com' );
	}

	/**
	 * Load Translation File
	 *
	 * @return void
	 */
	static function translation() {
		load_plugin_textdomain( 'gt-blocks', false, dirname( plugin_basename( GT_BLOCKS_PLUGIN_FILE ) ) . '/languages/php/' );
	}

	/**
	 * Include required files
	 *
	 * @return void
	 */
	static function includes() {

		// Include Plugin Updater.
		require_once GT_BLOCKS_PLUGIN_DIR . '/includes/class-gt-blocks-plugin-updater.php';

		// Include Plugin Settings.
		require_once GT_BLOCKS_PLUGIN_DIR . '/includes/class-gt-blocks-settings.php';
		require_once GT_BLOCKS_PLUGIN_DIR . '/includes/class-gt-blocks-settings-page.php';
	}

	/**
	 * Setup Action Hooks
	 *
	 * @see https://codex.wordpress.org/Function_Reference/add_action WordPress Codex
	 * @return void
	 */
	static function setup_actions() {

		// Enqueue Block Styles.
		add_action( 'enqueue_block_assets', array( __CLASS__, 'enqueue_block_scripts' ) );

		// Enqueue Block Scripts and Styles for Gutenberg Editor.
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_block_editor_scripts' ) );

		// Add custom image sizes.
		add_action( 'after_setup_theme', array( __CLASS__, 'add_image_sizes' ) );

		// Add block category.
		add_filter( 'block_categories', array( __CLASS__, 'block_categories' ), 10, 2 );

		// Add License Key admin notice.
		add_action( 'admin_notices', array( __CLASS__, 'license_key_admin_notice' ) );

		// Add plugin updater.
		add_action( 'admin_init', array( __CLASS__, 'plugin_updater' ), 0 );
	}

	/**
	 * Enqueue Block Styles
	 *
	 * Used in Frontend and Backend
	 *
	 * @return void
	 */
	static function enqueue_block_scripts() {
		wp_enqueue_style( 'gt-blocks', GT_BLOCKS_PLUGIN_URL . 'assets/css/gt-blocks.css', array(), GT_BLOCKS_VERSION );
	}

	/**
	 * Enqueue Scripts and Styles for Blocks
	 *
	 * Used in Backend in Gutenberg Editor only
	 *
	 * @return void
	 */
	static function enqueue_block_editor_scripts() {
		// Enqueue GT Blocks in Gutenberg.
		wp_enqueue_script( 'gt-blocks-editor', GT_BLOCKS_PLUGIN_URL . 'assets/js/gt-blocks-editor.js', array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-components',
			'wp-editor',
			'lodash',
		), GT_BLOCKS_VERSION );

		// Transfer Data from PHP to GT Blocks Redux Store.
		wp_add_inline_script( 'gt-blocks-editor', self::get_dispatch_data(), 'after' );

		// Add block options as JavaScript object.
		wp_localize_script( 'gt-blocks-editor', 'gtEnabledBlocks', self::get_block_options() );

		// Load javascript translation files.
		wp_set_script_translations( 'gt-blocks-editor', 'gt-blocks', GT_BLOCKS_PLUGIN_DIR . 'languages/js' );

		// Enqueue Editor Stylesheet for GT Blocks.
		wp_enqueue_style( 'gt-blocks-editor', GT_BLOCKS_PLUGIN_URL . 'assets/css/gt-blocks-editor.css', array( 'wp-edit-blocks', 'gt-blocks' ), GT_BLOCKS_VERSION );
	}

	/**
	 * Generate Code to dispatch data from PHP to Redux store.
	 *
	 * @return $script Data Dispatch code.
	 */
	static function get_dispatch_data() {
		$script = '';

		// Add Plugin URL.
		$script .= sprintf( 'wp.data.dispatch( "gt-blocks-store" ).setPluginURL( %s );', wp_json_encode( GT_BLOCKS_PLUGIN_URL ) );

		return $script;
	}

	/**
	 * Retrieve enabled and disabled blocks.
	 *
	 * @return $blocks Block options..
	 */
	static function get_block_options() {
		// Get Plugin Settings.
		$instance = GT_Blocks_Settings::instance();
		$options  = $instance->get_all();

		// Retrieve block options.
		$block_options = array_merge(
			$options['basic_blocks'],
			$options['layout_blocks'],
			$options['grid_blocks']
		);

		return $block_options;
	}

	/**
	 * Define custom image sizes
	 *
	 * @return void
	 */
	static function add_image_sizes() {
		// Get Plugin Settings.
		$instance = GT_Blocks_Settings::instance();
		$options  = $instance->get_all();

		if ( true === $options['image_sizes']['square'] ) {
			add_image_size( 'GT-square-640-x-640', 640, 640, true );
		}

		if ( true === $options['image_sizes']['rectangular'] ) {
			add_image_size( 'GT-rectangular-640-x-480', 640, 480, true );
		}

		if ( true === $options['image_sizes']['landscape'] ) {
			add_image_size( 'GT-landscape-640-x-360', 640, 360, true );
		}

		if ( true === $options['image_sizes']['portrait'] ) {
			add_image_size( 'GT-portrait-480-x-640', 480, 640, true );
		}
	}

	/**
	 * Define custom image sizes
	 *
	 * @return void
	 */
	static function block_categories( $categories, $post ) {
		return array_merge(
			$categories,
			array(
				array(
					'slug'  => 'gt-blocks',
					'title' => __( 'GT Blocks', 'gt-blocks' ),
				),
			)
		);
	}

	/**
	 * Add license key admin notice
	 *
	 * @return void
	 */
	static function license_key_admin_notice() {
		global $pagenow;

		// Display only on Plugins and Updates page.
		if ( ! ( 'plugins.php' == $pagenow or 'update-core.php' == $pagenow ) ) {
			return;
		}

		// Get Settings.
		$options = GT_Blocks_Settings::instance();

		if ( 'valid' !== $options->get( 'license_status' ) ) :
			?>

			<div class="updated">
				<p>
					<?php
					printf( __( 'Please activate your license key for GT Blocks in order to receive updates and support. <a href="%s">Activate License</a>', 'gt-blocks' ),
						admin_url( 'options-general.php?page=gt-blocks' )
					);
					?>
				</p>
			</div>

			<?php
		endif;
	}

	/**
	 * Plugin Updater
	 *
	 * @return void
	 */
	static function plugin_updater() {

		if ( ! is_admin() ) :
			return;
		endif;

		$options = GT_Blocks_Settings::instance();

		if ( 'valid' === $options->get( 'license_status' ) ) :

			// setup the updater
			$tzss_updater = new GT_Blocks_Plugin_Updater( GT_BLOCKS_STORE_API_URL, __FILE__, array(
				'version' => GT_BLOCKS_VERSION,
				'license' => trim( $options->get( 'license_key' ) ),
				'item_id' => GT_BLOCKS_PRODUCT_ID,
			) );

		endif;
	}
}

// Run Plugin.
GT_Blocks::setup();
