export default function Header(){
  return (
    <>
      <img src="images/logo.png" className="logo" title="מקוואות המועצה הדתית בת ים"/>
      <svg className="header-wave" viewBox="0 0 500 55" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"></stop>
            <stop offset="100%"></stop>
          </linearGradient>
        </defs>
        <path d="M0 39 C150 110 271 -90 500 39 L500 0 L0 0 Z"></path>
      </svg>
    </>
  );
}