import React, { Component } from "react";
import { Link } from "react-router-dom";
import OrderService from "../../services/order.service"

export default class Orders extends Component { 
    constructor(props) {
        super(props);
        this.getOrders = this.getOrders.bind(this);
    
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

    componentDidUpdate() {
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

    render() {
        const { orders } = this.state;
        
        return (<div>
                <div className="container h2">Orders</div>
                <div className="container h2">
                    <div className="text-right">
                    <button className="m-3 btn btn-sm btn-primary" onClick={this.create}><Link className="text-light" to={"/create-order"}>Create Order</Link></button>
                    </div>
                </div>

                <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Nº</th>
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
                            <td>$ { order.totalAmount + order.totalTaxes }</td>
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