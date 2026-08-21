function Header({ backendStatus }) {

  return (
    <header className="header">

      <div className="brand">

        <span className="brand-symbol">
          ◈
        </span>

        <span className="brand-name">
          DOCUAI
        </span>

      </div>


      <div className="header-actions">

        <div className="user-profile">

          <span
            className={`backend-indicator ${backendStatus}`}
            title={`Backend: ${backendStatus}`}
          >
            ●
          </span>

          <span className="user-name">
            Raj
          </span>

          <div className="user-avatar">
            R
          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;
