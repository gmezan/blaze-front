import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProductService from "../../services/product.service";

const PAGE_SIZE = [3,5,10,20];

export default class Products extends Component { 
    constructor(props) {
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
    
        this.state = {
          products: [],
          page: 0,
          size: 3,
          totalPages: 0,
          offset: 0
        };

        this.getProducts();
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts() {
        ProductService.getAll(this.state.page, this.state.size)
            .then(resp => {
                this.setState({products: resp.data?.content});
                this.setState({totalPages: resp.data?.totalPages});
                this.setState({offset: resp.data?.pageable?.offset || 0});
            })
            .catch(e => console.log(e));
    }

    changePage(p) {
        ProductService.getAll(p, this.state.size)
            .then(resp => {
                this.setState({products: resp.data?.content});
                this.setState({totalPages: resp.data?.totalPages});
                this.setState({offset: resp.data?.pageable?.offset || 0});
            })
            .catch(e => console.log(e));
        this.setState({page: p});
        return false;
    }

    changePageSize(e) {
        this.setState({size: e.target.value});
        ProductService.getAll(this.state.page, e.target.value)
            .then(resp => {
                this.setState({products: resp.data?.content});
                this.setState({totalPages: resp.data?.totalPages});
                this.setState({offset: resp.data?.pageable?.offset || 0});
            })
            .catch(e => console.log(e));
    }

    render() {
        const { products} = this.state;
        
        return (<div>
                <div className="container h2">Products</div>
                <div className="col-2 float-right h2">
                    <div className="text-right">
                        <button className="m-3 btn btn-sm btn-primary" onClick={this.create}><Link className="text-light" to={"/create-product"}>Create Product</Link></button>
                        <select className="form-control"
                                id="category"
                                value={this.state.size}
                                onChange={this.changePageSize}
                                name="category">
                                    {PAGE_SIZE.map((c,idx)=> (
                                        <option key={idx} value={c}>{c}</option>
                                    ))}
                            </select>  
                    </div>
                </div>

                <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Nº</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>{products && products.map((product, index) => (
                        <tr key={index}>
                            <td>{ product.id }</td>
                            <td>{ product.name }</td>
                            <td>{ product.category }</td>
                            <td>$ { product.price }</td>
                            <td>{ product.status }</td>
                            <td> <Link to={"/products/" + product.id }>Edit</Link></td>
                        </tr>))}
                    </tbody>
                    </table>
                </div>
                <div className="container">
                    <nav>
                        <ul className="pagination">
                            { this.state.page > 0 ? (
                                <li className="page-item" key={-1}><button className="page-link" onClick={() => this.changePage(this.state.page - 1)}>Previous</button></li>
                            ):(
                                <li className="page-item disabled" key={-1}><button className="page-link">Previous</button></li>
                            )}
                            
                            {this.state.totalPages>0 && [...Array(this.state.totalPages)].map((x, i) => 
                                this.state.page === i ? 
                                (<li className="page-item active" key={i}><button className="page-link" onClick={() => this.changePage(i)}>{i+1}</button></li>):
                                (<li className="page-item" key={i}><button className="page-link" onClick={() => this.changePage(i)}>{i+1}</button></li>)
                            )}

                            { this.state.page < (this.state.totalPages-1) ? (
                                <li className="page-item" key={-2}><button className="page-link" onClick={() => this.changePage(this.state.page + 1)}>Next</button></li>
                            ):(
                                <li className="page-item disabled" key={-2}><button className="page-link">Next</button></li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>);
    }
    
}