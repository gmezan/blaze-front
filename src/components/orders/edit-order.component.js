import React, { Component } from "react";
import OrderService from "../../services/order.service"
import ProductService from "../../services/product.service"
import { Link } from "react-router-dom";


export default class EditOrder extends Component {
    constructor(props) {
        super(props);
        this.saveOrder = this.saveOrder.bind(this);
        this.onChangeCustomer = this.onChangeCustomer.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeProducts = this.onChangeProducts.bind(this);
        this.getOrder = this.getOrder.bind(this);
        this.completeOrder = this.completeOrder.bind(this);
        this.rejectOrder = this.rejectOrder.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.addItem = this.addItem.bind(this);
        this.hideAddItem = this.hideAddItem.bind(this);
        this.saveAddItem = this.saveAddItem.bind(this);
    
        this.state = {
            number: null,
            status: "",
            date: "",
            customer: "",
            products: [],
            taxesAmounts: null,
            totalTaxes: null,
            totalAmount: null,
            items: [],
            isAdd: false,
            itemsSelected: []
        };

        this.getOrder(this.props.match.params.id)

    }

    completeOrder() {
        OrderService.complete(this.state.number, this.state)
            .then(r => this.updateState(r))
            .catch(e => {
                console.log(e);
              });
    }

    rejectOrder() {
        OrderService.reject(this.state.number, this.state)
            .then(r => this.updateState(r))
            .catch(e => {
                console.log(e);
              });
    }

    getOrder(id) {
        OrderService.get(id)
          .then(r => this.updateState(r))
          .catch(e => {
            console.log(e);
          });
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

    addItem() {
        ProductService.getAll(0,9999999)
            .then(r => {
                let items = r.data.content;
                let filter = this.state.products.map((p)=> p.id);
                items = items.filter((i) => !filter.includes(i.id) && i.status==='ACTIVE')
                this.setState({items: items});
                this.setState({itemsSelected: []});
            })
        this.setState({isAdd: true});
    }

    hideAddItem() {
        this.setState({isAdd: false});
    }

    saveOrder() {
        
        var data = {
            number: null,
            status: this.state.status,
            date: this.state.date,
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

    updateState = (r) => {
        this.setState({number: r.data.number});
        this.setState({status: r.data.status});
        this.setState({date: r.data.date});
        this.setState({customer: r.data.customer});
        this.setState({products: r.data.products});
        this.setState({taxesAmounts: r.data.taxesAmounts});
        this.setState({totalTaxes: r.data.totalTaxes});
        this.setState({totalAmount: r.data.totalAmount});
    }

    addProduct(id) {
        OrderService.addProduct(this.state.number, id, this.state)
            .then(r => this.updateState(r))
            .catch(e => {
                console.log(e);
              }); 
    }

    deleteProduct(id) {
        OrderService.deleteProduct(this.state.number, id, this.state)
            .then(r => this.updateState(r))
            .catch(e => {
                console.log(e);
              }); 
    }

    saveAddItem() {
        let data = {itemsSelected: this.state.itemsSelected};
        OrderService.addItems(this.state.number, data)
            .then(r => {
                this.updateState(r);
                this.setState({isAdd: false});
            })
            .catch(e => {
                console.log(e);
              }); 
    }

    handleChange= (e) => {
        let itemsSelected = this.state.itemsSelected;

        if (!e.target.checked) {
            itemsSelected = itemsSelected.filter(p => p.id!==e.target.value);
        } else {
            itemsSelected = itemsSelected.filter(p => p.id!==e.target.value);
            itemsSelected.push({id: e.target.value, quantity: 1});
        }
        this.setState({itemsSelected: itemsSelected})
    }

    render() {
        return (
            <div>
                <div className="container h2">Order Nº {this.state.number}</div>
                <div className="container h2">
                    <div className="text-right">
                    <button className="m-3 btn btn-sm btn-info" onClick={this.create}><Link className="text-light" to={"/orders"}>Back</Link></button>
                    </div>
                </div>
                <div className="container py-3">
                    <div className="row py-1">Customer: {this.state.customer}</div>
                    <div className="row py-1">Status: {this.state.status}</div>
                    <div className="row py-1">Date: {this.state.date}</div>
                </div>
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">Nº</th>
                            <th scope="col">Name</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Unit Price</th>
                            <th scope="col">Cost</th>
                            <th hidden={this.state.status !== "PENDING"} scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.products && this.state.products.map((p, index) => (
                                <tr key={p.id}>
                                    <td>{ p.id}</td>
                                    <td>{ p.name}</td>
                                    <td>{ p.quantity }</td>
                                    <td>$ { p.price }</td>
                                    <td>$ { p.price * p.quantity }</td>
                                    <td hidden={this.state.status !== "PENDING"}>
                                        <button onClick={()=>this.addProduct(p.id)} className="btn">Add</button>
                                        <button onClick={()=>this.deleteProduct(p.id)} className="btn">Delete</button>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>

                <div id="itemAdder" hidden={!this.state.isAdd}>
                    <div className="submit-form">
                    
                        <div className="form-group">
                            <label htmlFor="products">Select Products to Add</label>
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
                                            <td>{ item.id}</td>
                                            <td>{ item.name }</td>
                                            <td>{ item.category }</td>
                                            <td>$ { item.price }</td>
                                            <td><input className="form-check form-check-input" type="checkbox" value={item.id} onChange={this.handleChange}/></td>
                                        </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <div className="form-group">
                            <button disabled={this.state.itemsSelected.length === 0 } 
                            onClick={this.saveAddItem} className="btn btn-success">
                                Add Items
                            </button>
                            <button type="button" onClick={() => this.hideAddItem()} className="btn">
                              Cancel
                          </button>
                        </div>
                    </div> 
                </div>

                <div className="col-4 float-right">
                    <div hidden={(this.state.status !== "PENDING") || this.state.isAdd} className="row py-3 text-right">
                        <button onClick={this.addItem} className="btn btn-primary">
                            Add Item+
                        </button>
                    </div>

                    <div className="row py-3">
                        <div className="col-6 font-weight-bold text-left">Subtotal</div>
                        <div className="col-6 text-right">$ {this.state.totalAmount?.toFixed(2)}</div>

                        <div className="col-12 font-weight-bold text-left">Taxes</div>
                        
                        {this.state.taxesAmounts && Object.entries(this.state.taxesAmounts).map(([key, value]) => (
                            <div key={key} className="container text-right">
                                <div className="small"><div className="font-weight-bold">{key}</div> $ {value?.toFixed(2)}</div> 
                            </div>)
                        )}

                        <div className="col-6 font-weight-bold text-left pt-2">Total Taxes</div>
                        <div className="col-6 text-right pt-2">$ {this.state.totalTaxes?.toFixed(2)}</div>  

                        <div className="col-6 font-weight-bold text-left">Total</div>
                        <div className="col-6 text-right">$ {(this.state.totalAmount + this.state.totalTaxes)?.toFixed(2)}</div>  

                    </div>

                    <div hidden={this.state.status !== "PENDING"} className="row py-3">
                        <button disabled={(this.state.products==null || this.state.products.length === 0) || (this.state.customer.length === 0) } 
                                onClick={this.completeOrder} className="btn btn-success mr-2">
                            Complete Order
                        </button>
                        <button type="button" onClick={this.rejectOrder} className="btn btn-danger">
                            Reject Order
                        </button>
                    </div>
                </div>
            </div>)}
 }