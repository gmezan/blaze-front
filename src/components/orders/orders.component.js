import React, { Component } from "react";
import { Link } from "react-router-dom";
import OrderService from "../../services/order.service"

const PAGE_SIZE = [3,5,10,20];

export default class Orders extends Component { 
    constructor(props) {
        super(props);
        this.getOrders = this.getOrders.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
    
        this.state = {
          orders: [],
          page: 0,
          size: 3,
          totalPages: 0,
          offset: 0
        };

        this.getOrders();
    }

    componentDidMount() {
        this.getOrders();
    }

    getOrders() {
        OrderService.getAll(this.state.page, this.state.size)
            .then(resp => {
                this.setState({orders: resp.data?.content});
                this.setState({totalPages: resp.data?.totalPages});
                this.setState({offset: resp.data?.pageable?.offset || 0});
            })
            .catch(e => console.log(e));
    }

    changePage(p) {
        OrderService.getAll(p, this.state.size)
            .then(resp => {
                this.setState({orders: resp.data?.content});
                this.setState({totalPages: resp.data?.totalPages});
                this.setState({offset: resp.data?.pageable?.offset || 0});
            })
            .catch(e => console.log(e));
        this.setState({page: p});
        return false;
    }

    changePageSize(e) {
        this.setState({size: e.target.value});
        OrderService.getAll(this.state.page, e.target.value)
            .then(resp => {
                this.setState({orders: resp.data?.content});
                this.setState({totalPages: resp.data?.totalPages});
                this.setState({offset: resp.data?.pageable?.offset || 0});
            })
            .catch(e => console.log(e));
    }

    render() {
        const { orders } = this.state;
        
        return (<div>
                <div className="container h2">Orders</div>
                <div className="col-2 float-right h2">
                    <div className="text-right">
                        <button className="m-3 btn btn-sm btn-primary" onClick={this.create}><Link className="text-light" to={"/create-order"}>Create Order</Link></button>
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
                        <th scope="col">N??</th>
                        <th scope="col">Consumer</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total</th>
                        <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>{orders && orders.map((order, index) => (
                        <tr key={index}>
                            <td>{ index + this.state.offset }</td>
                            <td>{ order.customer }</td>
                            <td>{ order.status }</td>
                            <td>{ order.date }</td>
                            <td>$ { (order.totalAmount + order.totalTaxes)?.toFixed(2) }</td>
                            <td> <Link to={"/orders/" + order.number }>Edit</Link></td>
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