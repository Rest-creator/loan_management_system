import axios from "axios";
import { BASE_API_URL } from "./api";

class Server {
  // *******************
  // CSRF token helper
  //   *******************
  static getCSRFToken(): string {
    const name = "csrftoken=";
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name)) return cookie.substring(name.length);
    }
    return "";
  }

  //  *******************
  // Login method
  //   *******************
  static login(email: string, password: string) {
    return axios.post(
      `${BASE_API_URL}/auth/session/login/`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Server.getCSRFToken(),
        },
        withCredentials: true, // this ensures cookies are sent
      }
    );
  }

  //  *******************
  // Logout method
  //   *******************
  static logout() {
    return axios.post(
      `${BASE_API_URL}/auth/session/logout/`,
      {}, // POST body, can be empty
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Server.getCSRFToken(),
        },
        withCredentials: true, // send cookies
      }
    );
  }

  //  *******************
  // Example: fetch current user
  //   *******************
  static fetchMe() {
    return axios.get(`${BASE_API_URL}/auth/session/me/`, {
      withCredentials: true,
    });
  }

  //   *******************
  // add agent
  //   *******************
  static addAgent(data) {
    return axios.post(`${BASE_API_URL}/agents/add/`, data, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Server.getCSRFToken(),
      },
      withCredentials: true, // this ensures cookies are sent
    });
  }

  //   *******************
  // get agents
  //   *******************
  static getAgents() {
    return axios.get(`${BASE_API_URL}/all/agents/`, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Server.getCSRFToken(),
      },
      withCredentials: true,
    });
  }
}

export default Server;
