import "../index.css";

export default function Loader({ isVisible }) {
  return isVisible ? (
    <div className="loaderParent">
      <div className="loader"></div>
    </div>
  ) : null;
}
