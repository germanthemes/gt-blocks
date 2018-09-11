/**
 * Setup Localization Domain
 */
wp.i18n.setLocaleData( { '' : {} }, 'gt-layout-blocks' );

/**
 * Import Data Store
 */
import './data/store.js';

/**
 * Import Blocks
 */
import './blocks/container';
import './blocks/features';
import './blocks/image-text';
import './blocks/portfolio';

/**
 * Test Sidebar Plugin
 */
import './data/sidebar.js';
