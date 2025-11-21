import { useQuery } from "@tanstack/react-query";

export interface ProfileData {
  basicProfile: {
    name: string;
    dob: Date | null;
    gender: string | null;
  };
  healthWellness: {
    height: number | null;
    weight: number | null;
    activityLevel: string | null;
    primaryGoal: string | null;
    dietaryPreference: string | null;
  };
  journaling: {
    journalingStyle: string | null;
    journalingTimeOfDay: string | null;
    moodTrackingEnabled: boolean;
  };
  habits: Array<{
    id: string;
    name: string;
    type: string;
    target: number | null;
    unit: string | null;
    enabled: boolean;
  }>;
  healthConditions: string[];
  goal: string | null;
}

const fetchProfile = async (userId: string): Promise<ProfileData> => {
  const response = await fetch(`/api/user/profile?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }

  const data = await response.json();

  // Convert date string to Date object
  if (data.basicProfile.dob) {
    data.basicProfile.dob = new Date(data.basicProfile.dob);
  }

  return data;
};

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1,
  });
};
