import {
  LayoutDashboard,
  CalendarDays,
  Search,
  Tag,
  Heart,
  User,
  Bell,
  Headphones,
  Settings,
  LogOut
} from "lucide-react";

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🍽</div>

        <div>
          <h2>RestoReserve</h2>
          <p>Delight in every reservation</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${page === "dashboard" ? "active" : ""}`}
          onClick={() => setPage("dashboard")}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div className="nav-item">
          <CalendarDays size={20} />
          <span>My Reservations</span>
        </div>

        <div
          className={`nav-item ${page === "restaurants" ? "active" : ""}`}
          onClick={() => setPage("restaurants")}
        >
          <Search size={20} />
          <span>Explore Restaurants</span>
        </div>

        <div className="nav-item">
          <Tag size={20} />
          <span>Offers & Deals</span>
        </div>

        <div className="nav-item">
          <Heart size={20} />
          <span>Favorites</span>
        </div>

        <div className="nav-item">
          <User size={20} />
          <span>Profile</span>
        </div>

        <div className="nav-item notification-item">
          <Bell size={20} />
          <span>Notifications</span>
          <b>3</b>
        </div>

        <div className="nav-item">
          <Headphones size={20} />
          <span>Support</span>
        </div>

        <div className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="nav-item logout">
          <LogOut size={20} />
          <span>Logout</span>
        </div>

        <div className="refer-card">
          <div className="gift">🎁</div>
          <h3>Refer & Earn!</h3>
          <p>Invite your friends and earn exciting rewards.</p>
          <button>Refer Now</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;