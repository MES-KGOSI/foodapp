import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const COURSE_OPTIONS = ["Starters", "Mains", "Desserts"];

function getAvgPrice(menu, course) {
  const items = menu.filter((item) => item.course === course);
  if (items.length === 0) return 0;
  return (items.reduce((sum, item) => sum + parseFloat(item.price), 0) / items.length).toFixed(2);
}

function HomeScreen({ menu }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Fork and Knife</Text>

      <TextInput style={styles.searchBar} placeholder="Search Meal" placeholderTextColor="#666" />

      <View style={styles.statsCard}>
        <Text style={styles.statTitle}>Total Items: {menu.length}</Text>
        <Text>Avg Starter Price: R {getAvgPrice(menu, "Starters")}</Text>
        <Text>Avg Main Price: R {getAvgPrice(menu, "Mains")}</Text>
        <Text>Avg Dessert Price: R {getAvgPrice(menu, "Desserts")}</Text>
      </View>

      <Text style={styles.sectionTitle}>Full Menu</Text>

      <FlatList
        data={menu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.price}>R {item.price}</Text>
              <Text style={styles.course}>{item.course}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No items yet.</Text>}
      />
    </SafeAreaView>
  );
}

function AddItemScreen({ addMenuItem }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState(COURSE_OPTIONS[0]);
  const [price, setPrice] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Fork and Knife</Text>
      <View style={styles.formCard}>
        <TextInput style={styles.input} placeholder="Dish Name e.g. Hamburger with Fries" value={name} onChangeText={setName} />
        <TextInput style={[styles.input, { height: 70 }]} placeholder="Short description of the dish" value={description} onChangeText={setDescription} multiline />
        <Text style={styles.label}>Course</Text>
        <Picker selectedValue={course} style={styles.picker} onValueChange={setCourse}>
          {COURSE_OPTIONS.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
        <TextInput style={styles.input} placeholder="Price (R)" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <Button
          title="Save Item"
          onPress={() => {
            if (name && description && price) {
              addMenuItem({ name, description, course, price });
              setName(""); setDescription(""); setPrice("");
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

function FilterScreen({ menu }) {
  const [selectedCourse, setSelectedCourse] = useState("All");
  const filtered = selectedCourse === "All" ? menu : menu.filter((i) => i.course === selectedCourse);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Fork and Knife</Text>
      <TextInput style={styles.searchBar} placeholder="Search Meal" placeholderTextColor="#666" />
      <Text style={styles.label}>Course</Text>
      <Picker selectedValue={selectedCourse} style={styles.picker} onValueChange={setSelectedCourse}>
        <Picker.Item label="All (Starter, Main, Dessert)" value="All" />
        {COURSE_OPTIONS.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <Text style={styles.dishName}>{item.name}</Text>
            <Text style={styles.price}>R {item.price}</Text>
            <Text style={styles.course}>{item.course}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No dishes found.</Text>}
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [menu, setMenu] = useState([]);
  const addMenuItem = (item) => setMenu([...menu, item]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = { Home: "home", "Add Items": "add-circle", Filter: "filter" };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#161736", paddingVertical: 8 },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#aaa",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home">{() => <HomeScreen menu={menu} />}</Tab.Screen>
      <Tab.Screen name="Add Items">{() => <AddItemScreen addMenuItem={addMenuItem} />}</Tab.Screen>
      <Tab.Screen name="Filter">{() => <FilterScreen menu={menu} />}</Tab.Screen>
    </Tab.Navigator>
  ); // ✅ this return is inside the function
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 18 },
  logo: { fontWeight: "bold", fontSize: 22, alignSelf: "center", color: "#161736", marginBottom: 10 },
  searchBar: { backgroundColor: "#F5F5FC", borderRadius: 10, padding: 10, marginBottom: 15, borderWidth: 1, borderColor: "#DDD" },
  statsCard: { backgroundColor: "#E9E9F7", padding: 12, borderRadius: 8, marginBottom: 20 },
  statTitle: { fontWeight: "600", marginBottom: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  menuCard: { backgroundColor: "#F5F5FC", borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E4E4E4" },
  dishName: { fontWeight: "700", fontSize: 16 },
  price: { color: "#161736", fontWeight: "600" },
  course: { backgroundColor: "#161736", color: "#fff", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4, marginBottom: 6 },
  desc: { color: "#555" },
  formCard: { backgroundColor: "#fff", borderRadius: 10, padding: 15, borderWidth: 1, borderColor: "#E4E4E4" },
  input: { borderWidth: 1, borderColor: "#C3C3E5", backgroundColor: "#F5F5FC", borderRadius: 8, padding: 12, marginBottom: 12 },
  picker: { borderWidth: 1, borderColor: "#C3C3E5", borderRadius: 8, marginBottom: 10 },
  label: { fontWeight: "600", marginBottom: 5 },
  empty: { textAlign: "center", color: "#888", marginTop: 50 },
});

