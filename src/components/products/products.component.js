import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProductService from "../../services/product.service";

const url = "";

export default class Products extends Component { 
    constructor(props) {
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.delete = this.delete.bind(this)
    
        this.state = {
          products: [],
          page: 0,
          size: 3,
          totalPages: 0
        };

        this.getProducts();
    }

    getProducts() {
        ProductService.getAll(this.state.page, this.state.size)
            .then(resp => {
                this.setState({products: resp.data?.content});
                this.setState({totalPages: resp.data?.totalPages});
            })
            .catch(e => console.log(e));
    }

    delete(id) { 
        ProductService.delete(id).catch(e => console.log(e));
        this.getProducts();
    }

    changePage(p) {
        this.setState({page: p});
        this.getProducts();
    }

    render() {
        const { products, page, size } = this.state;
        
        return (<div>
                <div className="container h2">Products</div>
                <div className="container h2">
                    <div className="text-right">
                    <button className="m-3 btn btn-sm btn-primary" onClick={this.create}><Link className="text-light" to={"/create-product"}>Create Product</Link></button>
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
                            <td>{ index }</td>
                            <td>{ product.name }</td>
                            <td>{ product.category }</td>
                            <td>{ product.price }</td>
                            <td>{ product.status }</td>
                            <td> <Link to={"/edit-product"}>Edit</Link></td>
                        </tr>))}
                    </tbody>
                    </table>
                </div>
                <div className="container">
                    <nav>
                        <ul className="pagination">
                            { this.state.page > 0 ? (
                                <li className="page-item" key={-1}><a className="page-link" onClick={this.changePage(this.state.page - 1)} href={url}>Previous</a></li>
                            ):(
                                <li className="page-item disabled" key={-1}><a className="page-link" href={url}>Previous</a></li>
                            )}
                            
                            {[...Array(this.state.totalPages)].map((x, i) => 
                                this.state.page == i ? 
                                (<li className="page-item active" key={i}><a className="page-link" onClick={this.changePage(i)} href={url}>{i+1}</a></li>):
                                (<li className="page-item" key={i}><a className="page-link" onClick={this.changePage(i)} href={url}>{i+1}</a></li>)
                            )}

                            { this.state.page < (this.state.totalPages-1) ? (
                                <li className="page-item" key={-2}><a className="page-link" onClick={this.changePage(this.state.page + 1)} href={url}>Next</a></li>
                            ):(
                                <li className="page-item disabled" key={-2}><a className="page-link" href={url}>Next</a></li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>);
    }
    
}