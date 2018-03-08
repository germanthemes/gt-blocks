/**
 * Internal block libraries
 */
const { Component } = wp.element;
const { __ } = wp.i18n;
const {
    RichText,
} = wp.blocks;

class gtPortfolioBlock extends Component {
    constructor() {
        super( ...arguments );

        this.onChangeTitle = this.onChangeTitle.bind( this );
        this.onChangeText = this.onChangeText.bind( this );
        this.onSetActiveEditable = this.onSetActiveEditable.bind( this );
    }

    onChangeTitle( newTitle ) {
        this.props.setAttributes( { title: newTitle } )
    };

    onChangeText( newText ) {
        this.props.setAttributes( { text: newText } )
    };

    onSetActiveEditable( newEditable ) {
        this.props.setAttributes( { editable: newEditable  } );
    }

    render() {
        const { attributes, isSelected, className } = this.props;

        return (
            <div className={ className }>

                <RichText
                    tagName="h2"
                    placeholder={ __( 'Enter a title' ) }
                    value={ attributes.title }
                    className="block-title"
                    onChange={ this.onChangeTitle }
                    isSelected={ isSelected && attributes.editable === 'title' }
                    onFocus={ () => this.onSetActiveEditable( 'title' ) }
                />

                <RichText
                    tagName="div"
                    multiline="p"
                    placeholder={ __( 'Enter your text here.' ) }
                    value={ attributes.text }
                    className="block-text"
                    onChange={ this.onChangeText }
                    isSelected={ isSelected && attributes.editable === 'text' }
                    onFocus={ () => this.onSetActiveEditable( 'text' ) }
                />

            </div>
        );
    }
}

export default gtPortfolioBlock;
