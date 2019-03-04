<?php
/***
 * GT Blocks Settings Class
 *
 * Registers all plugin settings with the WordPress Settings API.
 *
 * @link https://codex.wordpress.org/Settings_API
 * @package GT Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * GT Blocks Settings
 */
class GT_Blocks_Settings {
	/** Singleton *************************************************************/

	/**
	 * @var instance The one true GT_Blocks_Settings instance
	 */
	private static $instance;

	/**
	 * @var options Plugin options array
	 */
	private $options;

	/**
	 * Creates or returns an instance of this class.
	 *
	 * @return GT_Blocks_Settings A single instance of this class.
	 */
	public static function instance() {

		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Plugin Settings Setup
	 *
	 * @return void
	*/
	public function __construct() {
		// Register Settings.
		add_action( 'admin_init', array( $this, 'register_settings' ) );

		// Add License API functions.
		add_action( 'admin_init', array( $this, 'activate_license' ) );
		add_action( 'admin_init', array( $this, 'deactivate_license' ) );
		add_action( 'admin_init', array( $this, 'check_license' ) );

		// Merge Plugin Options Array from Database with Default Settings Array.
		$this->options = wp_parse_args(

			// Get saved plugin settings from WP database.
			get_option( 'gt_blocks_settings', array() ),
			// Merge with Default Settings if setting was not saved yet.
			$this->default_settings()
		);
	}

	/**
	 * Get the value of a specific setting
	 *
	 * @return mixed
	*/
	public function get( $key, $default = false ) {
		$value = ! empty( $this->options[ $key ] ) ? $this->options[ $key ] : $default;
		return $value;
	}

	/**
	 * Get all settings
	 *
	 * @return array
	*/
	public function get_all() {
		return $this->options;
	}

	/**
	 * Retrieve default settings
	 *
	 * @return array
	*/
	public function default_settings() {

		$default_settings = array();

		foreach ( $this->get_registered_settings() as $key => $option ) :

			if ( 'multicheck' === $option['type'] ) :

				foreach ( $option['options'] as $index => $value ) :

					$default_settings[ $key ][ $index ] = isset( $option['default'] ) ? $option['default'] : false;

				endforeach;

			else :

				$default_settings[ $key ] = isset( $option['default'] ) ? $option['default'] : false;

			endif;

		endforeach;

		return $default_settings;
	}

	/**
	 * Register all settings sections and fields
	 *
	 * @return void
	*/
	function register_settings() {

		// Make sure that options exist in database
		if ( false == get_option( 'gt_blocks_settings' ) ) {
			add_option( 'gt_blocks_settings' );
		}

		// Add Sections
		add_settings_section( 'gt_blocks_settings_activate_blocks', esc_html__( 'Activate Blocks', 'gt-blocks' ), '__return_false', 'gt_blocks_settings' );
		add_settings_section( 'gt_blocks_settings_image_sizes', esc_html__( 'Image Sizes', 'gt-blocks' ), array( $this, 'image_section_intro' ), 'gt_blocks_settings' );
		add_settings_section( 'gt_blocks_settings_automatic_updates', esc_html__( 'Automatic Updates', 'gt-blocks' ), array( $this, 'license_section_intro' ), 'gt_blocks_settings' );

		// Add Settings
		foreach ( $this->get_registered_settings() as $key => $option ) :

			$name    = isset( $option['name'] ) ? $option['name'] : '';
			$section = isset( $option['section'] ) ? $option['section'] : 'widgets';

			add_settings_field(
				'gt_blocks_settings[' . $key . ']',
				$name,
				is_callable( array( $this, $option['type'] . '_callback' ) ) ? array( $this, $option['type'] . '_callback' ) : array( $this, 'missing_callback' ),
				'gt_blocks_settings',
				'gt_blocks_settings_' . $section,
				array(
					'id'      => $key,
					'name'    => isset( $option['name'] ) ? $option['name'] : null,
					'desc'    => ! empty( $option['desc'] ) ? $option['desc'] : '',
					'size'    => isset( $option['size'] ) ? $option['size'] : null,
					'max'     => isset( $option['max'] ) ? $option['max'] : null,
					'min'     => isset( $option['min'] ) ? $option['min'] : null,
					'step'    => isset( $option['step'] ) ? $option['step'] : null,
					'options' => isset( $option['options'] ) ? $option['options'] : '',
					'default' => isset( $option['default'] ) ? $option['default'] : '',
				)
			);

		endforeach;

		// Creates our settings in the options table
		register_setting( 'gt_blocks_settings', 'gt_blocks_settings', array( $this, 'sanitize_settings' ) );
	}

	/**
	 * Image Section Intro
	 *
	 * @return void
	*/
	function image_section_intro() {
		esc_html_e( 'Enabled custom image sizes. This setting will only affect new uploaded images unless you regenerate existing thumbnails with a plugin.', 'gt-blocks' );
	}

	/**
	 * License Section Intro
	 *
	 * @return void
	*/
	function license_section_intro() {
		esc_html_e( 'Please activate your license in order to receive automatic plugin updates and support.', 'gt-blocks' );
	}

	/**
	 * Sanitize the Plugin Settings
	 *
	 * @return array
	*/
	function sanitize_settings( $input = array() ) {

		if ( empty( $_POST['_wp_http_referer'] ) ) {
			return $input;
		}

		$saved = get_option( 'gt_blocks_settings', array() );

		if ( ! is_array( $saved ) ) {
			$saved = array();
		}

		$settings = $this->get_registered_settings();
		$input    = $input ? $input : array();

		// Loop through each setting being saved and pass it through a sanitization filter.
		foreach ( $input as $key => $value ) :

			// Get the setting type (checkbox, select, etc).
			$type = isset( $settings[ $key ]['type'] ) ? $settings[ $key ]['type'] : false;

			// Sanitize user input based on setting type.
			if ( 'text' === $type or 'license' === $type ) :

				$input[ $key ] = sanitize_text_field( $value );

			elseif ( 'checkbox' === $type or 'multicheck' === $type ) :

				$input[ $key ] = $value; // Validate Checkboxes later.

			else :

				// Default Sanitization.
				$input[ $key ] = esc_html( $value );

			endif;

		endforeach;

		// Ensure a value is always passed for every checkbox.
		if ( ! empty( $settings ) ) :
			foreach ( $settings as $key => $setting ) :

				// Single checkbox
				if ( isset( $settings[ $key ]['type'] ) && 'checkbox' == $settings[ $key ]['type'] ) :
					$input[ $key ] = ! empty( $input[ $key ] );
				endif;

				// Multicheck list
				if ( isset( $settings[ $key ]['type'] ) && 'multicheck' == $settings[ $key ]['type'] ) :
					foreach ( $settings[ $key ]['options'] as $index => $value ) :
						$input[ $key ][ $index ] = ! empty( $input[ $key ][ $index ] );
					endforeach;
				endif;

			endforeach;
		endif;

		return array_merge( $saved, $input );
	}

	/**
	 * Retrieve the array of plugin settings
	 *
	 * @return array
	*/
	function get_registered_settings() {

		$settings = array(
			'basic_blocks' => array(
				'name'    => esc_html__( 'Basic Blocks', 'gt-blocks' ),
				'section' => 'activate_blocks',
				'type'    => 'multicheck',
				'default' => true,
				'options' => array(
					'gt-blocks/button'  => esc_html__( 'GT Button', 'gt-blocks' ),
					'gt-blocks/heading' => esc_html__( 'GT Heading', 'gt-blocks' ),
					'gt-blocks/icon'    => esc_html__( 'GT Icon', 'gt-blocks' ),
				),
			),
			'layout_blocks' => array(
				'name'    => esc_html__( 'Layout Blocks', 'gt-blocks' ),
				'section' => 'activate_blocks',
				'type'    => 'multicheck',
				'default' => true,
				'options' => array(
					'gt-blocks/hero-image'       => esc_html__( 'GT Hero Image', 'gt-blocks' ),
					'gt-blocks/multiple-buttons' => esc_html__( 'GT Multiple Buttons', 'gt-blocks' ),
					'gt-blocks/section'          => esc_html__( 'GT Section', 'gt-blocks' ),
				),
			),
			'grid_blocks' => array(
				'name'    => esc_html__( 'Grid Blocks', 'gt-blocks' ),
				'section' => 'activate_blocks',
				'type'    => 'multicheck',
				'default' => true,
				'options' => array(
					'gt-blocks/features'    => esc_html__( 'GT Features', 'gt-blocks' ),
					'gt-blocks/grid-layout' => esc_html__( 'GT Grid Layout', 'gt-blocks' ),
					'gt-blocks/portfolio'   => esc_html__( 'GT Portfolio', 'gt-blocks' ),
				),
			),
			'image_sizes' => array(
				'name'    => esc_html__( 'Image Sizes', 'gt-blocks' ),
				'section' => 'image_sizes',
				'type'    => 'multicheck',
				'default' => true,
				'options' => array(
					'square'      => esc_html__( 'Square 640 x 640 pixel', 'gt-blocks' ),
					'rectangular' => esc_html__( 'Rectangular 640 x 480 pixel', 'gt-blocks' ),
					'landscape'   => esc_html__( 'Landscape 640 x 360 pixel', 'gt-blocks' ),
					'portrait'    => esc_html__( 'Portrait 480 x 640 pixel', 'gt-blocks' ),
				),
			),
			'license_status' => array(
				'name'    => esc_html__( 'License Status', 'gt-blocks' ),
				'section' => 'automatic_updates',
				'type'    => 'license_status',
				'default' => '',
			),
			'license_key' => array(
				'name'    => esc_html__( 'License Key', 'gt-blocks' ),
				'section' => 'automatic_updates',
				'type'    => 'license_key',
				'default' => '',
			),
		);

		return apply_filters( 'gt_blocks_settings', $settings );
	}

	/**
	 * Checkbox Callback
	 *
	 * Renders checkboxes.
	 *
	 * @param array $args Arguments passed by the setting
	 * @global $this->options Array of all options
	 * @return void
	 */
	function checkbox_callback( $args ) {

		$checked = isset( $this->options[ $args['id'] ] ) ? checked( 1, $this->options[ $args['id'] ], false ) : '';

		$html  = '<input type="checkbox" id="gt_blocks_settings[' . $args['id'] . ']" name="gt_blocks_settings[' . $args['id'] . ']" value="1" ' . $checked . '/>';
		$html .= '<label for="gt_blocks_settings[' . $args['id'] . ']"> ' . $args['desc'] . '</label>';

		echo $html;
	}

	/**
	 * Multicheck Callback
	 *
	 * Renders multiple checkboxes.
	 *
	 * @param array $args Arguments passed by the setting
	 * @global $this->options Array of all options
	 * @return void
	 */
	function multicheck_callback( $args ) {

		if ( ! empty( $args['options'] ) ) :
			foreach ( $args['options'] as $key => $option ) {
				$checked = isset( $this->options[ $args['id'] ][ $key ] ) ? checked( 1, $this->options[ $args['id'] ][ $key ], false ) : '';
				echo '<input name="gt_blocks_settings[' . $args['id'] . '][' . $key . ']" id="gt_blocks_settings[' . $args['id'] . '][' . $key . ']" type="checkbox" value="1" ' . $checked . '/>&nbsp;';
				echo '<label for="gt_blocks_settings[' . $args['id'] . '][' . $key . ']">' . $option . '</label><br/>';
			}
		endif;
		echo '<p class="description">' . $args['desc'] . '</p>';
	}

	/**
	 * License Status Callback
	 *
	 * Renders license status field.
	 *
	 * @return void
	 */
	function license_status_callback( $args ) {
		$html = '';

		// Get License Status and Key.
		$license_status = $this->get( 'license_status' );
		$license_key    = ! empty( $this->options['license_key'] ) ? $this->options['license_key'] : false;

		if ( 'valid' === $license_status ) {

			$html .= '<span class="license-status license-active">' . esc_html__( 'Active', 'gt-blocks' ) . '</span>';
			$html .= '<span class="license-description">' . esc_html__( 'You are receiving updates.', 'gt-blocks' ) . '</span>';

		} elseif ( 'expired' === $license_status ) {

			$renewal_url = esc_url( add_query_arg( array(
				'edd_license_key' => $license_key,
				'download_id'     => GT_BLOCKS_PRODUCT_ID,
			), 'https://germanthemes.de/kasse' ) );

			$html .= '<span class="license-status license-expired">' . esc_html__( 'Expired', 'gt-blocks' ) . '</span>';
			$html .= '<p class="license-description">' . esc_html__( 'Your license has expired, renew today to continue getting updates and support!', 'gt-blocks' ) . '</p>';
			$html .= '<a href="' . esc_url( $renewal_url ) . '" class="license-renewal button-primary">' . esc_html__( 'Renew Your License', 'gt-blocks' ) . '</a>';

		} elseif ( 'invalid' === $license_status ) {

			$html .= '<span class="license-status license-invalid">' . esc_html__( 'Invalid', 'gt-blocks' ) . '</span>';
			$html .= '<p class="license-description">' . esc_html__( 'Please make sure you have not reached site limits and/or expiration date.', 'gt-blocks' ) . '</p>';

		} else {

			$html .= '<span class="license-status license-inactive">' . esc_html__( 'Inactive', 'gt-blocks' ) . '</span>';

		}

		echo $html;
	}

	/**
	 * License Key Callback
	 *
	 * Renders license key field.
	 *
	 * @return void
	 */
	function license_key_callback( $args ) {
		$html = '';

		// Get License Status and Key.
		$license_status = $this->get( 'license_status' );
		$license_key    = ! empty( $this->options['license_key'] ) ? $this->options['license_key'] : false;

		if ( 'valid' === $license_status && ! empty( $license_key ) ) {

			$html .= '<input type="text" class="regular-text" readonly="readonly" id="gt_blocks_settings[license_key]" name="gt_blocks_settings[license_key]" value="' . esc_attr( stripslashes( $license_key ) ) . '"/><br/><br/>';
			$html .= '<input type="submit" class="button" name="gt_blocks_deactivate_license" value="' . esc_attr__( 'Deactivate License', 'gt-blocks' ) . '"/>';

		} else {

			$html .= '<input type="text" class="regular-text" id="gt_blocks_settings[license_key]" name="gt_blocks_settings[license_key]" value="' . esc_attr( stripslashes( $license_key ) ) . '"/><br/><br/>';
			$html .= '<input type="submit" class="button" name="gt_blocks_activate_license" value="' . esc_attr__( 'Activate License', 'gt-blocks' ) . '"/>';

		}

		echo $html;
	}

	/**
	 * Missing Callback
	 *
	 * If a function is missing for settings callbacks alert the user.
	 *
	 * @param array $args Arguments passed by the setting
	 * @return void
	 */
	function missing_callback( $args ) {
		printf( __( 'The callback function used for the <strong>%s</strong> setting is missing.', 'gt-blocks' ), $args['id'] );
	}

	/**
	 * Activate license key
	 *
	 * @return void
	 */
	public function activate_license() {

		if ( ! isset( $_POST['gt_blocks_settings'] ) ) {
			return;
		}

		if ( ! isset( $_POST['gt_blocks_activate_license'] ) ) {
			return;
		}

		if ( ! isset( $_POST['gt_blocks_settings']['license_key'] ) ) {
			return;
		}

		// Retrieve the license from the database.
		$status  = $this->get( 'license_status' );
		$license = trim( $_POST['gt_blocks_settings']['license_key'] );

		// Data to send in our API request.
		$api_params = array(
			'edd_action' => 'activate_license',
			'license'    => $license,
			'item_id'    => GT_BLOCKS_PRODUCT_ID,
			'url'        => home_url(),
		);

		// Call the custom API.
		$response = wp_remote_post( GT_BLOCKS_STORE_API_URL, array(
			'timeout'   => 35,
			'sslverify' => true,
			'body'      => $api_params,
		) );

		// Make sure the response came back okay.
		if ( is_wp_error( $response ) ) {
			return false;
		}

		// Decode the license data.
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		$options = $this->get_all();

		$options['license_status'] = $license_data->license;

		update_option( 'gt_blocks_settings', $options );

		delete_transient( 'gt_blocks_license_check' );
	}

	/**
	 * Deactivate license key
	 *
	 * @return void
	*/
	public function deactivate_license() {

		if ( ! isset( $_POST['gt_blocks_settings'] ) ) {
			return;
		}

		if ( ! isset( $_POST['gt_blocks_deactivate_license'] ) ) {
			return;
		}

		if ( ! isset( $_POST['gt_blocks_settings']['license_key'] ) ) {
			return;
		}

		// Retrieve the license from the database.
		$license = trim( $_POST['gt_blocks_settings']['license_key'] );

		// Data to send in our API request.
		$api_params = array(
			'edd_action' => 'deactivate_license',
			'license'    => $license,
			'item_id'    => GT_BLOCKS_PRODUCT_ID,
			'url'        => home_url(),
		);

		// Call the custom API.
		$response = wp_remote_post( GT_BLOCKS_STORE_API_URL, array(
			'timeout'   => 35,
			'sslverify' => true,
			'body'      => $api_params,
		) );

		// Make sure the response came back okay.
		if ( is_wp_error( $response ) ) {
			return false;
		}

		$options = $this->get_all();

		$options['license_status'] = 'inactive';

		update_option( 'gt_blocks_settings', $options );

		delete_transient( 'gt_blocks_license_check' );
	}

	/**
	 * Check license key
	 *
	 * @return void
	*/
	public function check_license() {

		if ( ! empty( $_POST['gt_blocks_settings'] ) ) {
			return; // Don't fire when saving settings.
		}

		$status = get_transient( 'gt_blocks_license_check' );

		// Run the license check a maximum of once per day.
		if ( false === $status ) {

			$options = $this->get_all();

			$license_key = $options['license_key'];

			if ( '' !== $license_key and 'inactive' !== $options['license_status'] ) {

				// Data to send in our API request.
				$api_params = array(
					'edd_action' => 'check_license',
					'license'    => $license_key,
					'item_id'    => GT_BLOCKS_PRODUCT_ID,
					'url'        => home_url(),
				);

				// Call the custom API.
				$response = wp_remote_post( GT_BLOCKS_STORE_API_URL, array( 'timeout' => 25, 'sslverify' => true, 'body' => $api_params ) );

				// Make sure the response came back okay.
				if ( is_wp_error( $response ) ) {
					return false;
				}

				$license_data = json_decode( wp_remote_retrieve_body( $response ) );

				$status = $license_data->license;

			} else {

				$status = 'inactive';

			}

			$options['license_status'] = $status;

			update_option( 'gt_blocks_settings', $options );

			set_transient( 'gt_blocks_license_check', $status, DAY_IN_SECONDS );
		}

		return $status;
	}
}

// Run Setting Class
GT_Blocks_Settings::instance();
