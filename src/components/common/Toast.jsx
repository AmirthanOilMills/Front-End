export function showToast(message, type = "success") {
  // Remove old toast if exists
  const existing = document.getElementById("custom-toast");
  if (existing) existing.remove();

  // Create wrapper
  const toast = document.createElement("div");
  toast.id = "custom-toast";
  toast.className = `
    fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white 
    flex items-center space-x-3 animate-slide-in z-[9999]
    ${type === "success" ? "bg-green-600" : "bg-red-600"}
  `;
  toast.style.transition = "all 0.3s ease";

  // Message
  const text = document.createElement("span");
  text.innerText = message;

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "×";
  closeBtn.className = "text-white font-bold";
  closeBtn.onclick = () => toast.remove();

  toast.appendChild(text);
  toast.appendChild(closeBtn);

  document.body.appendChild(toast);

  // Auto remove after 3s
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
