const user_id = window.location.href.split("?").pop()?.split("=").pop();

const onUserLoaded = (user) => {
  const header_authorize = document.querySelector(".header__profile-controls");
  const follow_btn = document.querySelector("#follow-button");

  if (localStorage.getItem("ArtOasis-token")) {
    header_authorize.style.display = "none";
  }

  const name_node = document.querySelector(".profile-name");
  const description_node = document.querySelector(".profile-about__text");
  const avatar_nodes = document.querySelectorAll(".profile-avatar__img");
  const isMe = JSON.parse(localStorage.getItem("ArtOasis-user")).id === user.id;
  follow_btn.style.display = isMe ? "none" : "block";

  name_node.innerHTML = user?.name;

  avatar_nodes.forEach((avatar) => {
    avatar.setAttribute("src", setFile(user?.avatar));
  });

  description_node.innerHTML = user?.description;

  // render profile info

  const description_text = document.querySelector(".profile-about__text");
  const bio_text = document.querySelector("#bio-text");
  const education_text = document.querySelector("#education-text");
  const exhibitions_text = document.querySelector("#exhibitions-text");
  const banner = document.querySelector("#profile-banner");
  const followers_count = document.querySelector("#followers-count");
  const artworks_count = document.querySelector("#artworks-count");
  const default_banner =
    "https://files.kick.com/images/channel/1621122/banner_image/a551ede8-2a97-4c04-9177-d6ee5761356d";

  description_text.innerHTML = user?.description;
  bio_text.innerHTML = user?.bio;
  education_text.innerHTML = user?.Education;
  exhibitions_text.innerHTML = user?.Exhibitions;
  banner.src = setFile(user?.banner) || default_banner;
  followers_count.innerHTML = user?.subscribedTo.length;
  artworks_count.innerHTML = user?.posts.length;

  // render arts

  const profileArtworkGrid = document.getElementById("profile-artwork-grid");
  const profileLikedGrid = document.getElementById("liked-tab");
  const profileFavoriteGrid = document.getElementById("favorites-tab");

  const artworks = user.posts.map((art) => ({
    id: art.id,
    title: art.title,
    artist: art.User.name,
    artistId: art.User.id,
    imageSrc: setFile(art.media),
    likes: art.rating,
    comments: art.comments,
    tags: art.tags || [],
    featured: false,
    artistAvatar: setFile(art.User.avatar),
  }));

  const likes = user.likes.map((like) => ({
    id: like?.Post?.id,
    title: like?.Post?.title,
    artist: like?.Post?.User?.name,
    imageSrc: setFile(like?.Post?.media),
    likes: like?.Post?.rating,
    comments: like?.Post?.comments,
    tags: like?.Post?.tags || [],
    featured: false,
    artistAvatar: setFile(like?.Post?.User?.avatar),
    profileSlug: "youssef",
  }));

  const favorites = user.Favorite?.map((favorite) => ({
    id: favorite?.post.id,
    title: favorite?.post.title,
    artist: favorite?.user.name,
    imageSrc: setFile(favorite?.post.media),
    likes: favorite?.post.rating,
    comments: favorite?.post.comments,
    tags: favorite?.post.tags || [],
    featured: false,
    artistAvatar: setFile(favorite?.user.avatar),
    profileSlug: "youssef",
  }));

  renderArtworks(artworks, profileArtworkGrid);
  renderArtworks(likes, profileLikedGrid);
  renderArtworks(favorites, profileFavoriteGrid);

  // edit modal

  const modal_trigger = document.querySelector("#edit-modal-trigger");
  const modal_close_btns = document.querySelectorAll("#edit-modal__close");
  const modal = document.querySelector(".edit-modal__bg");
  const inputs = modal.querySelectorAll("#edit-modal-input");
  const fileInput = document.querySelector("#invisible-file-upload");
  const bannerFileInput = document.querySelector("#banner-input");
  const submit = modal.querySelector("#edit-modal-submit");

  let fields = {};

  const token = localStorage.getItem("ArtOasis-token");

  const handleUserEdit = async () => {
    const formData = new FormData();

    Object.keys(fields).forEach((key) => {
      formData.append(key, fields[key]);
    });

    const avatar = fileInput?.files[0];

    if (avatar) {
      formData.append("image", avatar);
    }

    fetch("https://artoasis-server.onrender.com/api/users/", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка сети");
        }

        window.location.reload();
        return response.json();
      })
      .then((data) => {
        console.log("Ответ сервера:", data);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });

    const banner = bannerFileInput?.files[0];

    if (banner) {
      formData.append("banner", banner);

      fetch("https://artoasis-server.onrender.com/api/users/set-banner", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка сети");
          }

          modal.classList.remove("active");
          window.location.reload();
          return response.json();
        })
        .then((data) => {
          console.log("Ответ сервера:", data);
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });
    }
  };

  inputs.forEach((input) => {
    input.value = user[input.name] || "";

    input.addEventListener("change", (e) => {
      fields[e.target.name] = e.target.value;
    });
  });

  fileInput.addEventListener("change", () => {
    formData.append("image", fileInput.files[0]);
  });

  submit.addEventListener("click", () => {
    handleUserEdit();
  });

  modal_trigger.addEventListener("click", () => {
    modal.classList.add("active");
  });

  modal_close_btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  });

  // create modal

  const create_modal = document.querySelector(".create-modal-bg");
  const create_modal_trigger = document.querySelector("#create-modal-trigger");
  const create_modal_close = document.querySelectorAll("#crete-modal-close");
  const create_modal_submit = document.querySelector("#create-modal-submit");

  const create_modal_fileInput = document.querySelector("#create-modal-img");
  const create_modal_title = document.querySelector("#create-modal-input");

  create_modal_trigger.addEventListener("click", () => {
    create_modal.classList.add("active");
  });

  create_modal_close.forEach((close) => {
    close.addEventListener("click", () => {
      create_modal.classList.remove("active");
    });
  });

  create_modal_submit.addEventListener("click", () => {
    const formData = new FormData();

    const title = create_modal_title.value;
    const file = create_modal_fileInput?.files[0];

    formData.append("title", title);
    formData.append("file", file);

    create_modal.classList.remove("active");

    fetch("https://artoasis-server.onrender.com/api/posts/", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка сети");
        }

        window.location.reload();
        return response.json();
      })
      .then((data) => {
        console.log("Ответ сервера:", data);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });
  });

  // subscriptions

  const follow = document.querySelector("#follow-button");

  let isFollow;

  isFollowed_request(user_id)
    .then((res) => {
      isFollow = res.isFollowed;
      if (res.isFollowed) {
        follow.className = "btn following btn-outline";
        follow.innerHTML = "following";
      } else {
        follow.className = "btn btn-primary";
        follow.innerHTML = "follow";
      }
      isFollowedInitialized(res.isFollowed);
    })
    .catch((e) => {
      console.log(e);
    });

  const onFollow = () => {
    follow_request(user_id)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onUnFollow = () => {
    unfollow_request(user_id)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const isFollowedInitialized = (isFollowed) => {
    follow.addEventListener("click", () => {
      if (isFollowed) {
        onUnFollow();
      } else {
        onFollow();
      }
    });
  };
};

getUserById_request(user_id)
  .then(onUserLoaded)
  .catch((e) => {
    console.log(e);
  });
