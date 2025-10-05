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

function HomeScreen({ items, onNavigate, onRemove }) {
  const stats = useMemo(() => getAverages(items), [items]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Chef Christoffel’s Menu</Text>

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.button} onPress={() => onNavigate("Add")}>
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.btnText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onNavigate("Filter")}>
            <Ionicons name="filter" size={20} color="#fff" />
            <Text style={styles.btnText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <Text>Total Items: {stats.count}</Text>
          <Text>Avg Starter Price: R {stats.Starters}</Text>
          <Text>Avg Main Price: R {stats.Mains}</Text>
          <Text>Avg Dessert Price: R {stats.Desserts}</Text>
        </View>

        <Text style={styles.heading}>Full Menu</Text>
        <FlatList
          data={items}
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
                  <Ionicons name="trash" size={18} color="#c00" />
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
            <Text style={{ color: course === c ? "#fff" : "#161736" }}>{c}</Text>
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
            <Text style={{ color: selected === c ? "#fff" : "#161736" }}>{c}</Text>
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
    { id: "1", name: "Heirloom Tomato Carpaccio", description: "Basil oil, micro greens, sea salt.", course: "Starters", price: "85" },
    { id: "2", name: "Sous-vide Lamb Rump", description: "Smoked aubergine, rosemary jus.", course: "Mains", price: "210" },
    { id: "3", name: "Dark Chocolate Fondant", description: "Vanilla bean ice cream.", course: "Desserts", price: "95" },
  ]);

  const addItem = (item) => setItems((prev) => [item, ...prev]);
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  if (screen === "Add")
    return <AddItemScreen onSave={addItem} onBack={() => setScreen("Home")} />;
  if (screen === "Filter")
    return <FilterScreen items={items} onBack={() => setScreen("Home")} />;

  return (
    <HomeScreen items={items} onNavigate={setScreen} onRemove={removeItem} />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "#161736", marginBottom: 12 },
  heading: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  toolbar: { flexDirection: "row", gap: 10, marginBottom: 10 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161736",
    borderRadius: 12,
    padding: 8,
    gap: 6,
  },
  btnText: { color: "#fff", fontSize: 14 },
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
    backgroundColor: "#161736",
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
    borderColor: "#161736",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  courseOptionActive: { backgroundColor: "#161736" },
  saveBtn: {
    backgroundColor: "#161736",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  saveText: { color: "#fff", fontWeight: "600" },
  backBtn: { marginTop: 20, alignItems: "center" },
  backText: { color: "#161736", fontWeight: "500" },
})