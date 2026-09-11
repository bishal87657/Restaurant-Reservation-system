import { Search, Bell } from "lucide-react";

function Topbar({ search, setSearch }) {
  return (
    <header className="topbar">
      <button className="menu-button">☰</button>

      <div className="search-box">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search restaurants, cuisines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="top-user">
        <div className="notification">
          <Bell size={22} />
          <span>3</span>
        </div>

        <div className="avatar">C</div>

        <div className="user-info">
          <strong>Hi, Bishal 👋</strong>
          <small>Customer</small>
        </div>
      </div>
    </header>
  );
}

export default Topbar;