import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todos';

export default function HomeScreen({ navigation }) {
  const [todos, setTodos] = useState([]);

  // Load todos from AsyncStorage when app starts
  useEffect(() => {
    loadTodos();
    // Reload when coming back from AddTodo screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadTodos();
    });
    return unsubscribe;
  }, [navigation]);

  const loadTodos = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTodos(JSON.parse(stored));
      } else {
        // Default todos for first time
        const defaultTodos = [
          {
            id: '1',
            title: 'Buy milk',
            description: 'Get 2 liters of milk',
            finished: false,
            expanded: false,
          },
          {
            id: '2',
            title: 'Buy bread',
            description: 'Get whole wheat bread',
            finished: false,
            expanded: false,
          },
          {
            id: '3',
            title: 'Buy eggs',
            description: 'Get a dozen eggs',
            finished: false,
            expanded: false,
          },
        ];
        setTodos(defaultTodos);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTodos));
      }
    } catch (error) {
      console.error('Failed to load todos', error);
    }
  };

  const saveTodos = async (newTodos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error('Failed to save todos', error);
    }
  };

  // Toggle expand/collapse when caret icon is tapped
  const toggleExpand = (id) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, expanded: !todo.expanded } : todo
    );
    saveTodos(updated);
  };

  // Mark todo as finished (green tick)
  const markFinished = (id) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, finished: true, expanded: false } : todo
    );
    saveTodos(updated);
    Alert.alert('✅ Todo marked as finished');
  };

  // Delete todo (red trash)
  const deleteTodo = (id) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const filtered = todos.filter(todo => todo.id !== id);
            saveTodos(filtered);
            Alert.alert('🗑 Todo deleted');
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Add new todo (passed from AddTodoScreen)
  const addNewTodo = (newTodo) => {
    const updated = [newTodo, ...todos];
    saveTodos(updated);
  };

  // Pass addNewTodo to AddTodoScreen
  React.useEffect(() => {
    navigation.setParams({ addNewTodo });
  }, [todos]);

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoCard}>
      {/* Header: Title + Caret icon */}
      <View style={styles.todoHeader}>
        <Text style={[styles.todoTitle, item.finished && styles.finishedTitle]}>
          {item.title}
        </Text>
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Ionicons
            name={item.expanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      {/* Expanded content: Description + Action buttons */}
      {item.expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.todoDescription}>{item.description}</Text>
          <View style={styles.actionButtons}>
            {!item.finished && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.completeBtn]}
                onPress={() => markFinished(item.id)}
              >
                <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                <Text style={styles.actionText}>Complete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => deleteTodo(item.id)}
            >
              <Ionicons name="trash-bin" size={24} color="#FF3B30" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>My Todo List</Text>
      
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTodo', { addNewTodo })}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Todo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    color: '#000',
  },
  listContainer: {
    padding: 16,
  },
  todoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  finishedTitle: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  todoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completeBtn: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
});