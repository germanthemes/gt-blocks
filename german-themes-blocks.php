<?php
/*
Plugin Name: GT Blocks
Plugin URI: https://themezee.com/plugins/gt-blocks/
Description: A Custom Gutenberg Block to turn your WordPress theme into a powerful magazine website.
Author: ThemeZee
Author URI: https://themezee.com/
Version: 1.0
Text Domain: german-themes-blocks
Domain Path: /languages/
License: GPL v3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

German Themes Blocks
Copyright(C) 2018, ThemeZee.com - support@themezee.com
*/

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main German_Themes_Blocks Class
 *
 * @package German Themes Blocks
 */
class German_Themes_Blocks {

	/**
	 * Call all Functions to setup the Plugin
	 *
	 * @uses German_Themes_Blocks::constants() Setup the constants needed
	 * @uses German_Themes_Blocks::includes() Include the required files
	 * @uses German_Themes_Blocks::setup_actions() Setup the hooks and actions
	 * @return void
	 */
	static function setup() {

		// Setup Constants.
		self::constants();

		// Setup Translation.
		add_action( 'plugins_loaded', array( __CLASS__, 'translation' ) );

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

		// Define Plugin Name.
		define( 'GTB_NAME', 'German Themes Blocks' );

		// Define Version Number.
		define( 'GTB_VERSION', '1.0' );

		// Plugin Folder Path.
		define( 'GTB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

		// Plugin Folder URL.
		define( 'GTB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

		// Plugin Root File.
		define( 'GTB_PLUGIN_FILE', __FILE__ );

	}

	/**
	 * Load Translation File
	 *
	 * @return void
	 */
	static function translation() {

		load_plugin_textdomain( 'german-themes-blocks', false, dirname( plugin_basename( GTB_PLUGIN_FILE ) ) . '/languages/' );

	}

	/**
	 * Include required files
	 *
	 * @return void
	 */
	static function includes() {

		// Include Admin Classes.
		#require_once GTB_PLUGIN_DIR . '/includes/admin/class-themezee-plugins-page.php';
		#require_once GTB_PLUGIN_DIR . '/includes/admin/class-tzba-plugin-updater.php';

		// Include Settings Classes.
		#require_once GTB_PLUGIN_DIR . '/includes/settings/class-tzba-settings.php';
		#require_once GTB_PLUGIN_DIR . '/includes/settings/class-tzba-settings-page.php';

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
	}

	/**
	 * Enqueue Block Styles
	 *
	 * Used in Frontend and Backend
	 *
	 * @return void
	 */
	static function enqueue_block_scripts() {
		wp_enqueue_style( 'german-themes-blocks', GTB_PLUGIN_URL . 'assets/css/gt-blocks.css', array( 'wp-blocks' ), GTB_VERSION );
	}

	/**
	 * Enqueue Scripts and Styles for Blocks
	 *
	 * Used in Backend in Gutenberg Editor only
	 *
	 * @return void
	 */
	static function enqueue_block_editor_scripts() {
		wp_enqueue_script( 'german-themes-blocks-editor', GTB_PLUGIN_URL . 'assets/js/gt-blocks-editor.js', array(
			'wp-editor',
			'wp-i18n',
			'wp-element',
		), GTB_VERSION );

		wp_enqueue_style( 'german-themes-blocks-editor', GTB_PLUGIN_URL . 'assets/css/gt-blocks-editor.css', array( 'wp-edit-blocks' ), GTB_VERSION );
	}

	/**
	 * Define custom image sizes
	 *
	 * @return void
	 */
	static function add_image_sizes() {

		#add_image_size( 'GT-square-400-x-400', 400, 400, true );
		add_image_size( 'GT-square-800-x-800', 800, 800, true );

		#add_image_size( 'GT-rectangular-400-x-300', 400, 300, true );
		add_image_size( 'GT-rectangular-800-x-600', 800, 600, true );

		#add_image_size( 'GT-landscape-480-x-270', 480, 270, true );
		add_image_size( 'GT-landscape-960-x-540', 960, 540, true );

		#add_image_size( 'GT-portrait-320-x-480', 320, 480, true );
		add_image_size( 'GT-portrait-640-x-600', 640, 960, true );
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
					'slug'  => 'germanthemes',
					'title' => __( 'GT Blocks', 'german-themes-blocks' ),
				),
			)
		);
	}
}

// Run Plugin.
German_Themes_Blocks::setup();
