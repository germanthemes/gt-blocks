<?php
/*
Plugin Name: GT Blocks
Plugin URI: https://germanthemes.de/en/blocks/
Description: With our flexible and innovative blocks for the new WordPress Editor, you can create complex layouts for your business website in just a few minutes.
Author: GermanThemes
Author URI: https://germanthemes.de/en/
Version: 1.3
Text Domain: gt-blocks
Domain Path: /languages/
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

GT Blocks
Copyright(C) 2020, germanthemes.de - support@germanthemes.de
*/

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main GermanThemes_Blocks Class
 *
 * @package GT Blocks
 */
class GermanThemes_Blocks {

	/**
	 * Call all Functions to setup the Plugin
	 *
	 * @uses GermanThemes_Blocks::constants() Setup the constants needed
	 * @uses GermanThemes_Blocks::includes() Include the required files
	 * @uses GermanThemes_Blocks::setup_actions() Setup the hooks and actions
	 * @return void
	 */
	static function setup() {

		// Setup Constants.
		self::constants();

		// Setup Translation.
		add_action( 'plugins_loaded', array( __CLASS__, 'translation' ) );

		// Enqueue Block Styles.
		add_action( 'enqueue_block_assets', array( __CLASS__, 'enqueue_block_scripts' ) );

		// Enqueue Block Scripts and Styles for Gutenberg Editor.
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_block_editor_scripts' ) );

		// Add block category.
		add_filter( 'block_categories', array( __CLASS__, 'block_categories' ), 10, 2 );
	}

	/**
	 * Setup plugin constants
	 *
	 * @return void
	 */
	static function constants() {

		// Define Version Number.
		define( 'GT_BLOCKS_VERSION', '1.3' );

		// Plugin Folder Path.
		define( 'GT_BLOCKS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

		// Plugin Folder URL.
		define( 'GT_BLOCKS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

		// Plugin Root File.
		define( 'GT_BLOCKS_PLUGIN_FILE', __FILE__ );
	}

	/**
	 * Load Translation File
	 *
	 * @return void
	 */
	static function translation() {
		load_plugin_textdomain( 'gt-blocks', false, dirname( plugin_basename( GT_BLOCKS_PLUGIN_FILE ) ) . '/languages/' );
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

		// Load javascript translation files.
		wp_set_script_translations( 'gt-blocks-editor', 'gt-blocks', GT_BLOCKS_PLUGIN_DIR . 'languages' );

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
}

// Run Plugin.
GermanThemes_Blocks::setup();
