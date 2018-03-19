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

    onChangeTitle( newTitle, index ) {
        let newItems = [...this.props.attributes.items];
        newItems[index].title = newTitle;
        this.props.setAttributes( { items: newItems } );
    }

    onChangeText( newText, index ) {
        let newItems = [...this.props.attributes.items];
        newItems[index].text = newText;
        this.props.setAttributes( { items: newItems } );
    }

    onSetActiveEditable( newEditable ) {
        this.props.setAttributes( { editable: newEditable  } );
    }

    render() {
        const { attributes, isSelected, className } = this.props;

        return (
            <div className={ className }>
                <div className="block-container">

                    {
                        attributes.items.map( ( item, index ) => {
                            return (
                                <div className="block-item">

                                    <RichText
                                        tagName="h2"
                                        placeholder={ __( 'Enter a title' ) }
                                        value={ item.title }
                                        className="block-title"
                                        onChange={ ( newTitle ) => this.onChangeTitle( newTitle, index ) }
                                        isSelected={ isSelected && attributes.editable === `title${index}` }
                                        onFocus={ () => this.onSetActiveEditable( `title${index}` ) }
                                    />

                                    <RichText
                                        tagName="div"
                                        multiline="p"
                                        placeholder={ __( 'Enter your text here.' ) }
                                        value={ item.text }
                                        className="block-text"
                                        onChange={ ( newText ) => this.onChangeText( newText, index ) }
                                        isSelected={ isSelected && attributes.editable === `text${index}` }
                                        onFocus={ () => this.onSetActiveEditable( `text${index}` ) }
                                    />

                                </div>
                            );
                        })
                    }

                </div>
            </div>
        );
    }
}

export default gtPortfolioBlock;
