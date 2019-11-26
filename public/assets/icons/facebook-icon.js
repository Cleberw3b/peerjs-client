import "./facebook-icon.scss";

const FacebookIcon = ({ color, height, width }) => (
  <svg
    height={height ? `${height}px` : "24px"}
    width={width ? `${width}px` : "24px"}
    className={setColor(color)}
    viewBox="0 0 24 24"
  >
    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z" />
  </svg>
);

function setColor(color) {
  if (color === "white") return "facebook-icon-white";
  return "facebook-icon-black";
}

export default FacebookIcon;
