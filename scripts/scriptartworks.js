// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const header = document.getElementById("main-header");
const searchInput = document.getElementById("search-input");
const artworkGrid = document.getElementById("artwork-grid");
const noResults = document.getElementById("no-results");
const resetFilters = document.getElementById("reset-filters");
const tabButtons = document.querySelectorAll(".tab-button");
const currentYearElement = document.getElementById("current-year");

// Template
const artworkCardTemplate = document.getElementById("artwork-card-template");

// Sample Data
const artworks = [];

const getPosts = () => {
  getAllPosts_request()
    .then((res) => {
      const artworks = res.map((art) => ({
        title: art.title,
        artist: art.User.name,
        artistId: art.User.id,
        imageSrc: setFile(art.media),
        likes: art.rating,
        comments: art.comments.length,
        tags: art.tags,
        featured: false,
        artistAvatar: setFile(art.User.avatar),
        profileSlug: "youssef",
      }));

      renderArtworks(artworks);
    })
    .catch((e) => {
      console.log(e);
    });
};

getPosts();

// State
let activeCategory = "all";
let searchQuery = "";
let filteredArtworks = [...artworks];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  currentYearElement.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem("theme");
  if (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  renderArtworks(artworks);
  initScrollObservers();
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerHTML = isDark
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
});

// Header Scroll Effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Search Functionality
searchInput?.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  filterArtworks();
});

// Category Tabs
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    filterArtworks();
  });
});

// Reset Filters
resetFilters.addEventListener("click", () => {
  searchQuery = "";
  activeCategory = "all";
  searchInput.value = "";
  tabButtons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.category === "all") btn.classList.add("active");
  });
  filterArtworks();
});

// Filter Artworks
function filterArtworks() {
  filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      searchQuery === "" ||
      artwork.title.toLowerCase().includes(searchQuery) ||
      artwork.artist.toLowerCase().includes(searchQuery) ||
      artwork.tags.some((tag) => tag.toLowerCase().includes(searchQuery));
    const matchesCategory =
      activeCategory === "all" ||
      artwork.tags.some(
        (tag) => tag.toLowerCase() === activeCategory.toLowerCase()
      );
    return matchesSearch && matchesCategory;
  });
  renderArtworks(filteredArtworks);
}

// Render Artworks
function renderArtworks(artworks) {
  artworkGrid.innerHTML = "";
  if (artworks.length === 0) {
    noResults.style.display = "block";
    return;
  }
  noResults.style.display = "none";
  artworks.forEach((artwork, index) => {
    console.log(artwork);
    

    const card = artworkCardTemplate.content.cloneNode(true);
    const artworkCard = card.querySelector(".artwork-card");
    if (artwork.featured) artworkCard.classList.add("featured");
    artworkCard.style.animationDelay = `${index * 0.1}s`;
    card.querySelector(".artwork-image").src = artwork.imageSrc;
    card.querySelector(".artwork-image").alt = artwork.title;
    const artworkLinks = card.querySelectorAll(".artwork-link");
    artworkLinks.forEach((link) => {
      link.href = `./artwork.html?id=${artwork.id}`;
      link.textContent = artwork.title;
    });
    const artistLinks = card.querySelectorAll(".artist-link");
    artistLinks.forEach((link) => {
      link.href = `profile.html?id=${artwork.artistId}`;
      link.textContent = artwork.artist;
    });
    card.querySelector(".avatar-image").src = artwork.artistAvatar;
    card.querySelector(".avatar-image").alt = artwork.artist;
    card.querySelector(".like-count").textContent = artwork.likes;
    card.querySelector(".comment-count").textContent = artwork.comments;
    const tagsContainer = card.querySelector(".artwork-tags");
    artwork.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "artwork-tag";
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });
    const likeButton = card.querySelector(".like-button");
    likeButton.addEventListener("click", function () {
      this.classList.toggle("active");
      const likeCount = this.parentNode.querySelector(".like-count");
      if (this.classList.contains("active")) {
        likeCount.textContent = Number.parseInt(likeCount.textContent) + 1;
        this.innerHTML = '<i class="fas fa-heart"></i>';
      } else {
        likeCount.textContent = Number.parseInt(likeCount.textContent) - 1;
        this.innerHTML = '<i class="far fa-heart"></i>';
      }
    });
    const saveButton = card.querySelector(".save-button");
    saveButton.addEventListener("click", function () {
      this.classList.toggle("active");
      if (this.classList.contains("active")) {
        this.innerHTML = '<i class="fas fa-bookmark"></i>';
      } else {
        this.innerHTML = '<i class="far fa-bookmark"></i>';
      }
    });
    const shareButton = card.querySelector(".share-button");
    shareButton.addEventListener("click", () => {
      const url = `${window.location.origin}/artwork/${artwork.title
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      navigator.clipboard
        .writeText(url)
        .then(() => alert("Link copied to clipboard!"));
    });
    artworkGrid.appendChild(card);
  });
}

// Initialize Scroll Observers
function initScrollObservers() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  setTimeout(
    () =>
      document
        .querySelectorAll(".artwork-card")
        .forEach((card) => observer.observe(card)),
    100
  );
}

const uploadForm = document.getElementById("upload-form");
if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);

    try {
      const response = await fetch("http://localhost:3000/uploadArtwork", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Работа успешно загружена!");
        uploadForm.reset();
        location.reload();
      } else {
        alert("Ошибка при загрузке работы.");
      }
    } catch (err) {
      console.error("Ошибка при отправке:", err);
    }
  });
}
