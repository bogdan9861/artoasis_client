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

  description_text.innerHTML = user?.description;
  bio_text.innerHTML = user?.bio;
  education_text.innerHTML = user?.Education;
  exhibitions_text.innerHTML = user?.Exhibitions;
  banner.src = setFile(user?.banner);
  followers_count.innerHTML = user?.subscribedTo.length;
  artworks_count.innerHTML = user?.posts.length;

  // render arts

  const profileArtworkGrid = document.getElementById("profile-artwork-grid");
  const profileLikedGrid = document.getElementById("liked-tab");

  const artworks = user.posts.map((art) => ({
    id: art.id,
    title: art.title,
    artist: art.User.name,
    artistId: art.User.id,
    imageSrc: setFile(art.media),
    likes: art.rating,
    comments: art.comments.length,
    tags: art.tags || [],
    featured: false,
    artistAvatar: setFile(art.User.avatar),
  }));

  user.likes.forEach((el) => {
    console.log(el);
  });

  const likes = user.likes.map((like) => ({
    id: like.Post.id,
    title: like.Post.title,
    artist: like.User.name,
    imageSrc: setFile(like.Post.media),
    likes: like.Post.rating,
    comments: like.Post.comments.length,
    tags: like.Post.tags || [],
    featured: false,
    artistAvatar: setFile(like.User.avatar),
    profileSlug: "youssef",
  }));

  renderArtworks(artworks, profileArtworkGrid);
  renderArtworks(likes, profileLikedGrid);

  // edit modal

  const modal_trigger = document.querySelector("#edit-modal-trigger");
  const modal_close_btns = document.querySelectorAll("#edit-modal__close");
  const modal = document.querySelector(".edit-modal__bg");
  const inputs = modal.querySelectorAll("#edit-modal-input");
  const fileInput = document.querySelector("#invisible-file-upload");
  const submit = modal.querySelector("#edit-modal-submit");

  let fields = {};

  const handleUserEdit = async () => {
    const formData = new FormData();

    formData.append("name", "lilkebab2");

    // Object.keys(fields).forEach(key => {
    //   formData.append(key, fields[key])
    // })

    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ': ' + pair[1]);
    // }

    edit_user_request(formData)
      .then((res) => {
        modal.classList.remove("active");
        console.log(res);
      })
      .catch((e) => {
        alert("Error");
      });
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
};

getUserById_request(user_id)
  .then(onUserLoaded)
  .catch((e) => {
    console.log(e);
  });
