function Header({ backendStatus }) {

  return (
    <header className="header">

      <div className="brand">

        <span className="brand-symbol">
          ◈
        </span>

        <span>
          DOCUAI
        </span>

      </div>


      <div className="header-actions">

        <button className="search-button">
          Search
        </button>


        <div className="user-profile">

          <span
            className={`backend-indicator ${backendStatus}`}
          >
            ●
          </span>

          <span>
            Raj
          </span>

          <span className="user-status">
            •••
          </span>

        </div>

      </div>

    </header>
  );
}

export default Header;