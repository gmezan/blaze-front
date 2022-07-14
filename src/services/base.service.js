import axios from "axios";

export default axios.create({
  baseURL: "https://secret-garden-88021.herokuapp.com",
  headers: {
    "Content-type": "application/json"
  }
});