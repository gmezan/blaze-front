
import http from "./base.service";

class OrderService {

  BASE = "/order";

  getAll() {
    return http.get(this.BASE);
  }

  get(id) {
    return http.get(`${this.BASE}/${id}`);
  }

  create(data) {
    return http.post(this.BASE, data);
  }

  update(id, data) {
    return http.put(`${this.BASE}/${id}`, data);
  }

  delete(id) {
    return http.delete(`${this.BASE}/${id}`);
  }

}

export default new OrderService();