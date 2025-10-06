import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

// Food courses examples
const COURSES = ["Starters", "Mains", "Desserts"];

// Utility to calculate stats
const getAverages = (items) => {
  const count = items.length;
  const Starters = items.filter(i => i.course === "Starters").reduce((sum, i) => sum + Number(i.price), 0) / Math.max(1, items.filter(i => i.course === "Starters").length);
  const Mains = items.filter(i => i.course === "Mains").reduce((sum, i) => sum + Number(i.price), 0) / Math.max(1, items.filter(i => i.course === "Mains").length);
  const Desserts = items.filter(i => i.course === "Desserts").reduce((sum, i) => sum + Number(i.price), 0) / Math.max(1, items.filter(i => i.course === "Desserts").length);
  return { count, Starters: Starters.toFixed(2), Mains: Mains.toFixed(2), Desserts: Desserts.toFixed(2) };
};

// Header Section
function HeaderSection({ search, setSearch, titleOverride }) {
  const route = useRoute(); 
  const title = titleOverride || route.name;

  const getIcon = () => {
    switch (title) {
      case "Home": return require("../assets/hometop.png");
      case "Add Items": return require("../assets/addtop.png");
      case "Filter": return require("../assets/filtertop.png");
      default: return require("../assets/hometop.png");
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <View style={styles.logoRow}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <View>
            <Text style={styles.brand}>Fork</Text>
            <Text style={styles.brand}>and</Text>
            <Text style={styles.brand}>Knife</Text>
          </View>
        </View>

        <View style={styles.pageRow}>
          <Image source={getIcon()} style={styles.pageIcon} />
          <Text style={styles.pageTitle}>{title}</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search Meal"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}

// Tab Bar under header
function TabBar({ activeTab, setScreen }) {
  const tabs = ["Home", "Add Items", "Filter"];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => setScreen(tab)} // just use tab string directly
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab}
            </Text>
            {/* Underline */}
            {isActive && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Bottom Navigation (persistent)
function BottomNav({ current, setScreen }) {
  const tabs = [
    { label: "Home", icon: require("../assets/home.png"), screen: "Home" },
    { label: "Add Items", icon: require("../assets/add.png"), screen: "Add Items" },
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
            <Image source={tab.icon} style={styles.icon} />
            <Text style={[styles.navText, { color: isActive ? "#fff" : "#D3D3E0" }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


// Home Screen
function HomeScreen({ items, onRemove, search, setSearch, setScreen, activeTab }) {
  const stats = useMemo(() => getAverages(items), [items]);
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 180, paddingHorizontal: 16 }}>
        <HeaderSection titleOverride="Home" search={search} setSearch={setSearch} />
        <TabBar activeTab={activeTab} setScreen={setScreen} />

        <Text style={styles.title}>Food Menu</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}><Text>Total Items: {stats.count}</Text></View>
          <View style={styles.statBox}><Text>Avg Starter Price: R {stats.Starters}</Text></View>
          <View style={styles.statBox}><Text>Avg Main Price: R {stats.Mains}</Text></View>
          <View style={styles.statBox}><Text>Avg Dessert Price: R {stats.Desserts}</Text></View>
        </View>

        <Text style={styles.heading}>Full Menu</Text>
        {filtered.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dish}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.course}>{item.course}</Text>
              <Text style={styles.price}>R {item.price}</Text>
              <TouchableOpacity onPress={() => onRemove(item.id)}>
                <Ionicons name="trash" size={18} color="#080029" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Add Item Screen
function AddItemScreen({ onSave, onBack, activeTab, setScreen }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("Starters");
  const [price, setPrice] = useState("");

  const handleSave = () => {
    if (!name || !description || !price) return;
    onSave({ id: Date.now().toString(), name, description, course, price });
    setName(""); setDescription(""); setPrice("");
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 180, paddingHorizontal: 16 }}>
        {/* FIX: Pass correct titleOverride */}
        <HeaderSection titleOverride="Add Items" search="" setSearch={() => {}} />
        <TabBar activeTab="Add Items" setScreen={setScreen} />

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
              style={[styles.courseOption, course === c && styles.courseOptionActive]}
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
      </ScrollView>
    </SafeAreaView>
  );
}


// Filter Screen
function FilterScreen({ items, onBack, activeTab, setScreen }) {
  const [selected, setSelected] = useState("All");
  const filtered = selected === "All" ? items : items.filter((i) => i.course === selected);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 180, paddingHorizontal: 16 }}>
        <HeaderSection titleOverride="Filter" search="" setSearch={() => {}} />
        <TabBar activeTab={activeTab} setScreen={setScreen} />

        <Text style={styles.title}>Filter by Course</Text>
        <View style={styles.pickerRow}>
          {["All", ...COURSES].map((c) => (
            <TouchableOpacity key={c} onPress={() => setSelected(c)} style={[styles.courseOption, selected === c && styles.courseOptionActive]}>
              <Text style={{ color: selected === c ? "#fff" : "#080029" }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dish}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.course}>{item.course}</Text>
              <Text style={styles.price}>R {item.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Main App
export default function App() {
  const [screen, setScreen] = useState("Home");
  const [items, setItems] = useState([
    { id: "1", name: "Heirloom Tomato Carpaccio", description: "Basil oil, micro greens, sea salt.", course: "Starters", price: "85" },
    { id: "2", name: "Sous-vide Lamb Rump", description: "Smoked aubergine, rosemary jus.", course: "Mains", price: "210" },
    { id: "3", name: "Dark Chocolate Fondant", description: "Vanilla bean ice cream.", course: "Desserts", price: "95" },
  ]);

  const addItem = (item) => setItems((prev) => [item, ...prev]);
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const [search, setSearch] = useState("");

  let ActiveScreen;
  if (screen === "Add Items") ActiveScreen = <AddItemScreen onSave={addItem} onBack={() => setScreen("Home")} activeTab={screen} setScreen={setScreen} />;
  else if (screen === "Filter") ActiveScreen = <FilterScreen items={items} onBack={() => setScreen("Home")} activeTab={screen} setScreen={setScreen} />;
  else ActiveScreen = <HomeScreen items={items} onRemove={removeItem} search={search} setSearch={setSearch} setScreen={setScreen} activeTab={screen} />;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {ActiveScreen}
      <BottomNav current={screen} setScreen={setScreen} />
    </View>
  );
}


// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { marginBottom: 10, paddingHorizontal: 20, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 100, height: 100, marginRight: 12, borderRadius: 12 },
  brand: { fontSize: 18, fontWeight: '700', color: '#080029' },
  pageRow: { flexDirection: 'row', alignItems: 'center' },
  pageIcon: { width: 30, height: 30, marginRight: 12, resizeMode: 'contain' },
  pageTitle: { fontSize: 20, fontWeight: '600', color: '#080029' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 20, paddingHorizontal: 12, height: 40, marginTop: 10 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0, marginLeft: 8 },

  tabBar: {
  flexDirection: "row",
  backgroundColor: "#f5f5f5",
  borderRadius: 12,
  marginBottom: 12,
  marginHorizontal: 2,
  justifyContent: "space-between",
  paddingVertical: 4,
},
tabItem: {
  flex: 1,
  alignItems: "center",
  paddingVertical: 10,
},
tabText: {
  color: "#888",
  fontWeight: "bold",
  fontSize: 15,
},
tabTextActive: {
  color: "#080029", // active text color
},
tabUnderline: {
  height: 3,
  width: "100%",
  backgroundColor: "#080029", // your blue underline
  marginTop: 4,
  borderRadius: 2,
},

  card: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F5F5FC", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#E4E4E4", marginBottom: 8 },
  dish: { fontWeight: "600" },
  desc: { color: "#555", fontSize: 13 },
  course: { backgroundColor: "#080029", color: "#fff", paddingHorizontal: 6, borderRadius: 8, textAlign: "center", marginBottom: 3, fontSize: 12 },
  price: { fontWeight: "bold", marginBottom: 4 },

  input: { borderWidth: 1, borderColor: "#C3C3E5", borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: "#F5F5FC" },
  pickerRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
  courseOption: { borderWidth: 1, borderColor: "#080029", borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 },
  courseOptionActive: { backgroundColor: "#080029" },
  saveBtn: { backgroundColor: "#080029", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 6 },
  saveText: { color: "#fff", fontWeight: "600" },
  backBtn: { marginTop: 20, alignItems: "center" },
  backText: { color: "#080029", fontWeight: "500" },

  statsContainer: { marginVertical: 8 },
  statBox: { backgroundColor: "#fff", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: "#e5e5ef", marginBottom: 6 },
  title: { fontSize: 22, fontWeight: "700", marginVertical: 10 },
  heading: { fontSize: 18, fontWeight: "600", marginVertical: 10 },

  bottomNav: { position: "absolute", bottom: 20, left: 20, right: 20, flexDirection: "row", justifyContent: "space-around", backgroundColor: "#080029", borderRadius: 30, paddingVertical: 10, paddingHorizontal: 10, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  navItem: { alignItems: "center", paddingHorizontal: 20, paddingVertical: 5 },
  navItemActive: { backgroundColor: "#3a3a5a", borderRadius: 20 },
  icon: { width: 34, height: 34, marginBottom: 4, resizeMode: "contain" },
  navText: { fontSize: 12 },
});
