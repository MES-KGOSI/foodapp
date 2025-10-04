import { StyleSheet, Text, View } from "react-native";
const Home = () => {
return (

  <View style={styles.container}>
    <Text>{}</Text>
    <Text>{}</Text>
    <Text style={styles.title}>Food Menu</Text>

    <Text style={styles.subtitle}>Welcome, Chef Christoffel!</Text>

    <Text style={styles.sectionLabel}>Today’s Specials:</Text>

    <View style={styles.menuBox}>
      <Text style={styles.item}>• Roasted Beet Salad — Starter</Text>
      <Text style={styles.item}>• Lemon Butter Salmon — Main</Text>
      <Text style={styles.item}>• Chocolate Lava Cake — Dessert</Text>
    </View>

    <Text style={styles.footer}>Swipe down to refresh the menu</Text>
  </View>
)};


export default Home

const styles = StyleSheet.create({})
