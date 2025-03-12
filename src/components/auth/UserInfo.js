import Image from 'next/image';

export default function UserInfo({ user }) {
  return (
    <div className="user-info">
      {user.image && (
        <Image 
          src={user.image} 
          alt={user.name || "User"} 
          width={40} 
          height={40}
          className="avatar"
        />
      )}
      <div className="user-details">
        <p className="user-name">{user.name}</p>
        <p className="user-email">{user.email}</p>
        {user.role === "admin" && (
          <span className="admin-badge">Admin</span>
        )}
      </div>
    </div>
  );
}
