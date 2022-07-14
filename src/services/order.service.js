
import http from "./base.service";

class OrderService {

  BASE = "/order";

  getAll(page, size) {
    return http.get(`${this.BASE}?page=${page}&size=${size}`);
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

  reject(id, data) {
    return http.post(`${this.BASE}/${id}/reject`, data);
  }

  complete(id, data) {
    return http.post(`${this.BASE}/${id}/complete`, data);
  }

  addProduct(number, id, data) {
    return http.put(`${this.BASE}/${number}/add/${id}`, data);
  }

  deleteProduct(number, id, data) {
    return http.put(`${this.BASE}/${number}/delete/${id}`, data);
  }

  addItems(number, itemsSelected) {
    return http.put(`${this.BASE}/${number}/add-items`, itemsSelected);
  }

}

export default new OrderService();