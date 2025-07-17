import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CommunityPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  liked: boolean;
  imageUrl?: string;
};

const mockPosts: CommunityPost[] = [
  { id: '1', title: 'Love this new style!', category: 'Fashion', author: 'Alice', liked: false, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
  { id: '2', title: 'Best places to shop', category: 'Shopping', author: 'Bob', liked: false, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
  { id: '3', title: 'Summer outfit ideas', category: 'Fashion', author: 'Carol', liked: false, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  { id: '4', title: 'How to mix colors', category: 'Tips', author: 'Dave', liked: false, imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400' },
];

const categories = ['All', 'Fashion', 'Shopping', 'Tips'];

const CommunityScreen = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    filterPosts();
  }, [selectedCategory, posts]);

  const filterPosts = () => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  };

  const toggleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, liked: !post.liked } : post
      )
    );
  };

  const renderPost = ({ item }: { item: CommunityPost }) => (
    <View style={{ backgroundColor: 'white', padding: 12, marginVertical: 6, marginHorizontal: 12, borderRadius: 8, elevation: 2 }}>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 8 }}
          resizeMode="cover"
        />
      )}
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{item.title}</Text>
      <Text style={{ color: 'gray', marginBottom: 4 }}>{item.category}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontStyle: 'italic' }}>By {item.author}</Text>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={24} color={item.liked ? 'red' : 'gray'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: selectedCategory === category ? '#007AFF' : '#E0E0E0',
        marginRight: 8,
      }}
    >
      <Text style={{ color: selectedCategory === category ? 'white' : 'black' }}>{category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingTop: 16 }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 12 }}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => renderCategoryButton(item)}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: 'gray' }}>No posts found.</Text>
          </View>
        }
      />
    </View>
  );
};

export default CommunityScreen;
