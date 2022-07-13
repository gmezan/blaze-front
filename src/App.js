
import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Orders from "./components/orders/orders.component"
import Products from "./components/products/products.component";
import CreateProduct from "./components/products/create-product.component";
import EditProduct from "./components/products/edit-product.component";
import CreateOrder from "./components/orders/create-order.component";
import EditOrder from "./components/orders/edit-order.component";

function App() {
  return (<div>
        <nav className="navbar navbar-expand navbar-light">
          <div className="navbar-brand">
            BLAZE
          </div>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/orders"} className="nav-link">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/products"} className="nav-link">
                Products
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path="/orders" component={Orders} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/create-product" component={CreateProduct} />
            <Route exact path="/edit-product" component={EditProduct} />
            <Route exact path="/create-order" component={CreateOrder} />
            <Route exact path="/edit-order" component={EditOrder} />
          </Switch>
        </div>
      </div>
  );
}

export default App;
