class ProductList extends React.Component { // eslint-disable-line no-unused-vars
  constructor(props, context) {
    super(props,context);
    this.state = {
      products:[]
    }
    this.handleUpVote = this.handleUpVote.bind(this);
  }

  componentDidMount() {
    this.setState({
      products: Seed.products
    });
  }

  handleUpVote(productId) {
    // console.log(productId + ' was upvoted!');
    const votedProducts = this.state.products.map(product => {
      return product.id == productId ? Object.assign({}, product, { votes: product.votes + 1}):
        product;
    });
    this.setState({
      products: votedProducts
    });
  }

  render() {
    const sortedProducts = this.state.products.sort((a, b) => {
      return (b.votes - a.votes);
    });
    const productComponents = sortedProducts.map((product) => (
      <Product
        key={'product-' + product.id}
        id={product.id}
        title={product.title}
        description={product.description}
        url={product.url}
        votes={product.votes}
        submitterAvatarUrl={product.submitterAvatarUrl}
        productImageUrl={product.productImageUrl}
        handleUpVote={this.handleUpVote}
        />
    ));
    return (
        <div className="ui unstackable items">
          {productComponents}
        </div>
    );
  }
}

class Product extends React.Component {
  constructor(props, context) {
    super(props,context);
    this.handleProductUpVote = this.handleProductUpVote.bind(this);
  }

  handleProductUpVote() {
    this.props.handleUpVote(this.props.id)
  }
  render() {
    return (
      <div className='item'>
        <div className='image'>
          <img src={this.props.productImageUrl} />
        </div>
        <div className='middle aligned content'>
          <div className='header'>
            <a>
              <i className='large caret up icon' onClick={this.handleProductUpVote}/>
            </a>
            {this.props.votes}
          </div>
          <div className='description'>
            <a href={this.props.url}>
              {this.props.title}
            </a>
            <p>
              {this.props.description}
            </p>
          </div>
          <div className='extra'>
            <span>Submitted by:</span>
            <img
              className='ui avatar image'
              src={this.props.submitterAvatarUrl}
            />
          </div>
        </div>
      </div>
    );
  }
}

// what,where
ReactDOM.render( // eslint-disable-line no-undef
  <ProductList />,
  document.getElementById('content')
);
