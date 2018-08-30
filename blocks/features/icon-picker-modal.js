/**
 * Internal dependencies
 */
const { Component, Fragment } = wp.element;
const { Modal } = wp.components;
const { __, sprintf } = wp.i18n;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;

const MODAL_NAME = 'gt-layout-blocks/icon-picker-modal';

class IconPickerModal extends Component {
    constructor() {
        super( ...arguments );
    }

    render() {
        const {
            isModalActive,
            toggleModal,
        } = this.props;

        const title = (
            <span className="gt-layout-blocks-icon-picker-modal-title">
                { __( 'Select Icon' ) }
            </span>
        );

        return (
            <Fragment>
                { isModalActive && (
                    <Modal
                        className="gt-layout-blocks-icon-picker-modal"
                        title={ title }
                        closeLabel={ __( 'Close' ) }
                        onRequestClose={ toggleModal }
                    >

                        { __( 'Content' ) }

                    </Modal>
                ) }
            </Fragment>
        );
    }
}

export default compose( [
	withSelect( ( select ) => ( {
		isModalActive: select( 'core/edit-post' ).isModalActive( MODAL_NAME ),
	} ) ),
	withDispatch( ( dispatch, { isModalActive } ) => {
		const {
			openModal,
			closeModal,
		} = dispatch( 'core/edit-post' );

		return {
			toggleModal: () => isModalActive ? closeModal() : openModal( MODAL_NAME ),
		};
	} ),
] )( IconPickerModal );
