const register_request = async ({ name, login, password }) => {
  return await request("/users/register", "POST", { name, login, password });
};

const login_request = async ({ login, password }) => {
  return await request("/users/login", "POST", { login, password });
};

const current_request = async () => {
  return await request("/users/", "GET");
};

const getUserById_request = async (id) => {
  return await request(`/users/${id}`, "GET");
};

const getAllPosts_request = async () => {
  return await request("/posts/", "GET");
};

const likePosts_request = async (id) => {
  return await request(`/posts/${id}/like`, "POST");
};

const unLikePosts_request = async (id) => {
  return await request(`/posts/${id}/unlike`, "POST");
};

const isLiked_request = async (id) => {
  return await request(`/posts/${id}/liked`, "GET");
};

const edit_user_request = async (data) => {
  return await request(`/users/`, "POST", data, {
    "content-type": "multipart/form-data",
  });
};

const edit_banner_request = async (data) => {
  return await request(`/users/set-banner`, "PUT", { data });
};
