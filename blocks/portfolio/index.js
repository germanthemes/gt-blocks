/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register block
 */
export default registerBlockType(
    'german-themes-blocks/portfolio',
    {
        title: __( 'GT Portfolio' ),
        category: 'layout',
        icon: 'wordpress-alt',
        keywords: [
            __( 'German Themes' ),
            __( 'Services' ),
            __( 'Layout' ),
        ],
        edit: props => {
          return (
            <div className={ props.className }>
              <h2>{ __( 'GT Portfolio' ) }</h2>
              <p>{ __( 'This is really important!' ) }</p>
              {
                !! props.focus && (
                  <p className="sorry warning">✋ Sorry! You cannot edit this block ✋</p>
                )
              }
            </div>
          );
        },
        save: props => {
          return (
            <div>
              <h2>{ __( 'GT Portfolio' ) }</h2>
              <p>{ __( 'This is really important!' ) }</p>
            </div>
          );
        },
    },
);
