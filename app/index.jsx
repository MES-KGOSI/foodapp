import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COURSES = ["Starters", "Mains", "Desserts"];

const getAverages = (items) => {
  const totals = { Starters: [], Mains: [], Desserts: [] };
  items.forEach((i) => totals[i.course].push(parseFloat(i.price)));
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b) / arr.length : 0);
  return {
    count: items.length,
    Starters: avg(totals.Starters).toFixed(2),
    Mains: avg(totals.Mains).toFixed(2),
    Desserts: avg(totals.Desserts).toFixed(2),
  };
};

function HeaderSection({ search, setSearch }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoRow}>
        <Image source={require("../assets/logo.png")} style={styles.logo} /> // added app logo

        <View>
  <Text style={styles.brand}>Fork</Text>
  <Text style={styles.brand}>and</Text>
  <Text style={styles.brand}>Knife</Text>
</View> </View>


      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search dishes..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}

function BottomNav({ current, setScreen }) {
  const tabs = [
    { label: "Home", icon: require("../assets/home.png"), screen: "Home" },
    { label: "Add", icon: require("../assets/add.png"), screen: "Add" },
    { label: "Filter", icon: require("../assets/filter.png"), screen: "Filter" },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = current === tab.screen;
        return (
          <TouchableOpacity
            key={tab.label}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => setScreen(tab.screen)}
          >
            <Image
          source={tab.icon}
         style={[styles.icon, { width: 24, height: 24 }]}
          />


            <Text style={[styles.navText, { color: isActive ? "#fff" : "#D3D3E0" }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


function HomeScreen({ items, onNavigate, onRemove }) {
  const stats = useMemo(() => getAverages(items), [items]);
  const [search, setSearch] = useState("");
  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <HeaderSection search={search} setSearch={setSearch} />

        <Text style={styles.title}>Food Menu</Text>

        <View style={styles.stats}>
          <Text>Total Items: {stats.count}</Text>
          <Text>Avg Starter Price: R {stats.Starters}</Text>
          <Text>Avg Main Price: R {stats.Mains}</Text>
          <Text>Avg Dessert Price: R {stats.Desserts}</Text>
        </View>

        <Text style={styles.heading}>Full Menu</Text>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dish}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.course}>{item.course}</Text>
                <Text style={styles.price}>R {item.price}</Text>
                <TouchableOpacity onPress={() => onRemove(item.id)}>
                  <Ionicons name="trash" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function AddItemScreen({ onSave, onBack }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("Starters");
  const [price, setPrice] = useState("");

  const handleSave = () => {
    if (!name || !description || !price) return;
    onSave({ id: Date.now().toString(), name, description, course, price });
    setName("");
    setDescription("");
    setPrice("");
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection search="" setSearch={() => {}} />
      <Text style={styles.title}>Add Menu Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.pickerRow}>
        {COURSES.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCourse(c)}
            style={[
              styles.courseOption,
              course === c && styles.courseOptionActive,
            ]}
          >
            <Text style={{ color: course === c ? "#fff" : "#080029" }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Price (R)"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Item</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function FilterScreen({ items, onBack }) {
  const [selected, setSelected] = useState("All");
  const filtered =
    selected === "All" ? items : items.filter((i) => i.course === selected);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection search="" setSearch={() => {}} />
      <Text style={styles.title}>Filter by Course</Text>

      <View style={styles.pickerRow}>
        {["All", ...COURSES].map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setSelected(c)}
            style={[
              styles.courseOption,
              selected === c && styles.courseOptionActive,
            ]}
          >
            <Text style={{ color: selected === c ? "#fff" : "#080029" }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dish}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.course}>{item.course}</Text>
              <Text style={styles.price}>R {item.price}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState("Home");
  const [items, setItems] = useState([
    {
      id: "1",
      name: "Heirloom Tomato Carpaccio",
      description: "Basil oil, micro greens, sea salt.",
      course: "Starters",
      price: "85",
    },
    {
      id: "2",
      name: "Sous-vide Lamb Rump",
      description: "Smoked aubergine, rosemary jus.",
      course: "Mains",
      price: "210",
    },
    {
      id: "3",
      name: "Dark Chocolate Fondant",
      description: "Vanilla bean ice cream.",
      course: "Desserts",
      price: "95",
    },
  ]);

  const addItem = (item) => setItems((prev) => [item, ...prev]);
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  let ActiveScreen;
  if (screen === "Add")
    ActiveScreen = <AddItemScreen onSave={addItem} onBack={() => setScreen("Home")} />;
  else if (screen === "Filter")
    ActiveScreen = <FilterScreen items={items} onBack={() => setScreen("Home")} />;
  else ActiveScreen = <HomeScreen items={items} onNavigate={setScreen} onRemove={removeItem} />;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {ActiveScreen}
      <BottomNav current={screen} setScreen={setScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerContainer: { marginBottom: 16 },
  logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  logo: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  brand: { fontSize: 18, fontWeight: "700", color: "#080029" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  searchInput: { flex: 1, padding: 8 },
  title: { fontSize: 20, fontWeight: "bold", color: "#080029", marginVertical: 10 },
  heading: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  stats: {
    backgroundColor: "#E9E9F7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F5FC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    marginBottom: 8,
  },
  dish: { fontWeight: "600" },
  desc: { color: "#555", fontSize: 13 },
  course: {
    backgroundColor: "#080029",
    color: "#fff",
    paddingHorizontal: 6,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 3,
    fontSize: 12,
  },
  price: { fontWeight: "bold", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#C3C3E5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#F5F5FC",
  },
  pickerRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
  courseOption: {
    borderWidth: 1,
    borderColor: "#080029",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  courseOptionActive: { backgroundColor: "#080029" },
  saveBtn: {
    backgroundColor: "#080029",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  saveText: { color: "#fff", fontWeight: "600" },
  backBtn: { marginTop: 20, alignItems: "center" },
  backText: { color: "#080029", fontWeight: "500" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#080029",
    paddingVertical: 10,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, marginTop: 4 },



  bottomNav: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#080029",
    borderRadius: 30,
    paddingVertical: 10,
    elevation: 5, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  navItemActive: {
    backgroundColor: "#3a3a5a",
    borderRadius: 20,
  },
  icon: {
    width: 34,
    height: 34,
    marginBottom: 4,
    resizeMode: "contain",
  },
  navText: {
    fontSize: 12,
  },
});
