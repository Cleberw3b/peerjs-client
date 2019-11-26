import "./search-icon.scss";

const SearchIcon = ({ height, width }) => (
  <svg
    height={height ? `${height}px` : "24px"}
    width={width ? `${width}px` : "24px"}
    className="search-icon"
    fillRule="evenodd"
    clipRule="evenodd"
    viewBox="0 0 24 24"
  >
    <path d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z" />
  </svg>
);

export default SearchIcon;
