/**
 * Setup Localization Domain
 */
wp.i18n.setLocaleData( { '': {} }, 'gt-layout-blocks' );

/**
 * Import Data Store
 */
import './data/store.js';
import './data/synchronize-styling';

/**
 * Import Child Blocks
 */
import './child-blocks/column';
import './child-blocks/wrapper';

/**
 * Import Blocks
 */
import './blocks/button';
import './blocks/container';
import './blocks/heading';
import './blocks/hero-image';
import './blocks/icon';
import './blocks/icon-grid';
import './blocks/image-text';
import './blocks/portfolio';
