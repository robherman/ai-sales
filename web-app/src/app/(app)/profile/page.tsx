"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/loading-spinner";
import { useAuth } from "../../../lib/providers/auth-context";
import { getUserProfile } from "../../../lib/app/actions";
import ProtectedRoute from "../../../components/protected";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfile(response);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  if (!profile) return <div>Failed to load profile</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">User Profile</h1>
      <div className="card bg-base-100 shadow-xl">
        <figure className="px-10 pt-10">
          <Image
            src={profile.avatar}
            alt="User Avatar"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{profile.name}</h2>
          <p>{profile.email}</p>
          <div className="card-actions">
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
