const token = localStorage.getItem("token");
if (!token) window.location.pathname = "/admin/login";
