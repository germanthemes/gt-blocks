/**
 * Setup Localization Domain
 */
wp.i18n.setLocaleData( { '': {} }, 'gt-layout-blocks' );

/**
 * Import Plugins
 */
import './plugins/data-store/';
import './plugins/synchronize-styling';

/**
 * Import Blocks
 */
import './blocks/button';
import './blocks/buttons';
import './blocks/column';
import './blocks/container';
import './blocks/features';
import './blocks/heading';
import './blocks/hero-image';
import './blocks/hero-content';
import './blocks/icon';
import './blocks/image';
import './blocks/image-text';
import './blocks/portfolio';
import './blocks/services';
