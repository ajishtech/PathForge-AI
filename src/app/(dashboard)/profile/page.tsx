"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { CAREER_ROLES } from "@/lib/career-data";

interface Profile {
  name: string;
  email: string;
  careerGoal: string;
  bio: string;
  githubUsername: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "", email: "", careerGoal: "Full-Stack Developer", bio: "", githubUsername: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then(setProfile);
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <DashboardHeader
        title="Profile & Settings"
        description="Manage your account and career preferences"
      />

      <Card className="max-w-2xl">
        <CardTitle className="mb-6">Personal Information</CardTitle>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email || ""} disabled className="opacity-60" />
          </div>
          <div>
            <Label htmlFor="careerGoal">Career Goal</Label>
            <Select
              id="careerGoal"
              value={profile.careerGoal}
              onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
            >
              {CAREER_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="github">GitHub Username</Label>
            <Input
              id="github"
              value={profile.githubUsername || ""}
              onChange={(e) => setProfile({ ...profile, githubUsername: e.target.value })}
              placeholder="your-username"
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : saved ? (
              "Saved!"
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
