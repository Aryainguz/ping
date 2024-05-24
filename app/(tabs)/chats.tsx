// Chats.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { IconButton, FAB } from 'react-native-paper';

const Chats = () => {
  const chats = [
    { id: '1', name: 'TYLER', message: 'Hey, how are you?', time: '12:00 PM', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUfCIeX0gI4cZt6Gik97kXpOnkXwPycykyJ3iU6RvBuA&s' },
    { id: '2', name: 'NARRATOR', message: 'Let’s catch up soon!', time: '11:45 AM', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUfCIeX0gI4cZt6Gik97kXpOnkXwPycykyJ3iU6RvBuA&s' },
    { id: '3', name: 'ME', message: 'Are you coming to the party?', time: '10:30 AM', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUfCIeX0gI4cZt6Gik97kXpOnkXwPycykyJ3iU6RvBuA&s' },
    // Add more chat items here
  ];

  const renderItem = ({ item }: { item: { id: string, name: string, message: string, time: string, avatar: string } }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ping</Text>
      </View>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />
      <FAB
        style={styles.fab}
        icon="message-plus"
        color="#fff"
        onPress={() => console.log('New chat pressed')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    height: 90,
    backgroundColor: '#002DE3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075E54',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatMessage: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#002DE3',
  },
});

export default Chats;
