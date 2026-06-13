import apiClient from "./services";

export default {




  getUser(id) // not sure why the original getUser was for all users? Adding new getUser for a single user
  {
    return apiClient.get("users/" + id);
  },

  getUsers() { // 
    return apiClient.get("users/");
  },
  addUser(user) {
    return apiClient.post("users/", user);
  },

  updateUser(user) {
    return apiClient.put("users/" + user.id, user);

  },

  deleteUser(id) {
    return apiClient.delete("users/" + id)
  },

  loginUser(user) {
    console.log(user);
    return apiClient.post("login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },
};
