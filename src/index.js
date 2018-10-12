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
import './child-blocks/buttons';
import './child-blocks/column';
import './child-blocks/hero-content';
import './child-blocks/image';

/**
 * Import Blocks
 */
import './blocks/button';
import './blocks/container';
import './blocks/features';
import './blocks/heading';
import './blocks/hero-image';
import './blocks/icon';
import './blocks/image-text';
import './blocks/portfolio';
import './blocks/services';
