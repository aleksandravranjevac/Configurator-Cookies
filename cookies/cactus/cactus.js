import Cookies from "../../js/Cookies.js";
import * as data from "./data.js";

export default class Cactus extends Cookies {
  constructor() {
    super();

    this.data = data;
  }
}
