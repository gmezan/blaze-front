import React, { Component } from "react";
import OrderService from "../../services/order.service"
import ProductService from "../../services/product.service"

function getFormattedDate(date) {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
  }

export default class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.saveOrder = this.saveOrder.bind(this);
        this.onChangeCustomer = this.onChangeCustomer.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeProducts = this.onChangeProducts.bind(this);
    
        let today = new Date();

        this.state = {
            number: null,
            status: "PENDING",
            date: today.toISOString().split('T')[0],
            customer: "",
            products: [],
            items: []
        };

        this.loadProducts()

    }

    loadProducts() {
        ProductService.getAll(0,9999)
        .then(resp => {
            this.setState({items: resp.data?.content});
        })
        .catch(e => console.log(e));
    }

    onChangeCustomer(e) {
        this.setState({
          customer: e.target.value
        });
    }

    onChangeStatus(e) {
        this.setState({
          status: e.target.value
        });
    }

    onChangeDate(e) {
        this.setState({
          date: e.target.value
        });
    }

    onChangeProducts(e) {
        this.setState({
          products: e.target.value
        });
    }

    saveOrder() {
        
        var data = {
            number: null,
            status: this.state.status,
            date: getFormattedDate(new Date(this.state.date)),
            customer: this.state.customer,
            products: this.state.products
        };
    
        OrderService.create(data)
          .then(response => {
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });

        this.props.history.push("/orders");
    }

    handleChange= (e) => {
        let products = this.state.products;

        if (!e.target.checked) {
            products = products.filter(p => p.id!==e.target.value);
        } else {
            products = products.filter(p => p.id!==e.target.value);
            products.push({id: e.target.value, quantity: 1});
        }
        this.setState({products: products})
    }

    render() {
        return (
            <div>
                <div className="container h2">Create Order</div>
                <div className="container">
                    <div className="submit-form">
                        <div className="form-group">
                            <label htmlFor="customer">Customer</label>
                            <input
                                type="customer"
                                className="form-control"
                                id="customer"
                                required
                                value={this.state.customer}
                                onChange={this.onChangeCustomer}
                                name="customer"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                required
                                value={this.state.date}
                                onChange={this.onChangeDate}
                                name="date"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="products">Select Products</label>
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Add</th>
                                    </tr>
                                </thead>
                                <tbody>{this.state.items && this.state.items.map((item, index) => (
                                        <tr hidden={!(item.status!==null && item.status === "ACTIVE")} key={index}>
                                            <td>{ index}</td>
                                            <td>{ item.name }</td>
                                            <td>{ item.category }</td>
                                            <td>$ { item.price }</td>
                                            <td><input className="form-check form-check-input" type="checkbox" value={item.id} onChange={this.handleChange}/></td>
                                        </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <div className="form-group">
                            <button disabled={(this.state.products.length === 0) || (this.state.customer.length === 0) } 
                            onClick={this.saveOrder} className="btn btn-success">
                                Save
                            </button>
                            <button type="button" onClick={() => this.props.history.push("/orders")} className="btn">
                              Back
                          </button>
                        </div>
                    </div>
                 </div>
            </div>)}
 }