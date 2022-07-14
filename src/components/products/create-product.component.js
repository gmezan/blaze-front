import React, { Component } from "react";

import ProductService from "../../services/product.service"

const CATEGORIES = ["Cookies", "Candies", "Cakes", "Desserts", "Drinks"];

export default class CreateProduct extends Component {
    constructor(props) {
        super(props);
        this.saveProduct = this.saveProduct.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
    
        this.state = {
            id: null,
            name: "",
            category: CATEGORIES[0],
            price: 0.0,
            status: "INACTIVE"
        };

    }

    onChangeName(e) {
        this.setState({
          name: e.target.value
        });
    }

    onChangeCategory(e) {
        this.setState({
          category: e.target.value
        });
    }

    onChangePrice(e) {
        this.setState({
          price: e.target.value
        });
    }

    onChangeStatus(e) {
        this.setState({
          status: e.target.value
        });
    }

    saveProduct() {
        var data = {
            id: null,
            name: this.state.name,
            category: this.state.category,
            price: this.state.price,
            status: this.state.status
        };
    
        ProductService.create(data)
          .then(response => {
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });

        this.props.history.push("/products");
    }

    render() {
        const { name, category, price, status} = this.state;

        return (
            <div>
                <div className="container h2">Create Product</div>
                <div className="container">
                    <div className="submit-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="name"
                                className="form-control"
                                id="name"
                                required
                                value={this.state.name}
                                onChange={this.onChangeName}
                                name="name"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                type="category"
                                className="form-control"
                                id="category"
                                required
                                value={this.state.category}
                                onChange={this.onChangeCategory}
                                name="category">
                                    {CATEGORIES.map((c,idx)=> (
                                        <option key={idx} value={c}>{c}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="price"
                                required
                                value={this.state.price}
                                onChange={this.onChangePrice}
                                name="price"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                type="select"
                                className="form-control"
                                id="status"
                                required
                                value={this.state.status}
                                onChange={this.onChangeStatus}
                                name="status">
                                <option value={"ACTIVE"}>ACTIVE</option>
                                <option value={"INACTIVE"}>INACTIVE</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <button disabled={!(name && category && price && status)} onClick={this.saveProduct} className="btn btn-success mr-2">
                                Save
                            </button>
                            <button type="button" onClick={() => this.props.history.push("/products")} className="btn">
                              Back
                          </button>
                        </div>
                    </div>
                 </div>
            </div>)}
 }