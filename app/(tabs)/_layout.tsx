import { Tabs } from "expo-router";
import { TabBar } from "@/components/tabs/TabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: "Loans",
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: "Savings",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
