// Closes the mobile sidebar drawer (daisyUI drawer in pages/HomePage.jsx).
export const closeDrawer = () => {
  const toggle = document.getElementById("my-drawer-2");
  if (toggle) toggle.checked = false;
};
