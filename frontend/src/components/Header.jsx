function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-symbol">◈</span>
        <span>DOCUAI</span>
      </div>

      <div className="header-actions">
        <button className="search-button">
          Search
        </button>

        <div className="user-profile">
          <span className="user-status">◐</span>
          <span>Raj</span>
          <span>•••</span>
        </div>
      </div>
    </header>
  );
}

export default Header;