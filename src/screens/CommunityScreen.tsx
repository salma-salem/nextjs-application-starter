import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CommunityPost {
  id: string;
  title: string;
  topic: string;
  imageUrl: string;
  user: string;
  description: string;
  comments: string[];
}

const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'Street Style Today',
    topic: 'OOTD',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    user: 'stylebyjane',
    description: 'Loving this comfy but trendy look I wore downtown today!',
    comments: [],
  },
  {
    id: '2',
    title: 'Selling 2 pair of jeans',
    topic: '2Hand',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    user: 'eco_chic',
    description: 'Once wore once jeans, size 34',
    comments: [],
  },
  {
    id: '3',
    title: 'Nike x Carhatt limited edition',
    topic: '2Hand',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    user: 'brunch_babe',
    description: 'Brand new shoes',
    comments: [],
  },
  {
    id: '4',
    title: 'How should I  this?',
    topic: 'Styling Tips',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
    user: 'minimalfit',
    description: 'I would like to wear it, but dont know how',
    comments: [],
  },
  {
    id: '5',
    title: 'Graduation day!',
    topic: 'OOTD',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    user: 'mamamia',
    description: 'Finally graduated!',
    comments: [],
  },
  {
    id: '6',
    title: 'Is it too hot for summer?',
    topic: 'Styling Tips',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    user: 'layerqueen',
    description: 'Do not what to wear for 30 degrees',
    comments: [],
  },
];

const topics = ['OOTD', '2Hand', 'Styling Tips'];

const CommunityScreen = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [selectedTopic, setSelectedTopic] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newPostModalVisible, setNewPostModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    topic: '',
    imageUrl: '',
    description: '',
  });

  useEffect(() => {
    filterPosts();
  }, [selectedTopic, searchQuery, posts]);

  const filterPosts = () => {
    let filtered = posts;
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(p => p.topic === selectedTopic);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
  };

  const handleAddToFavorites = (post: CommunityPost) => {
    Alert.alert('Saved!', `You saved "${post.title}" to favorites.`);
  };

  const openCommentModal = (post: CommunityPost) => {
    setActivePost(post);
    setCommentModalVisible(true);
  };

  const submitComment = () => {
    if (!newComment.trim() || !activePost) return;
    const updatedPosts = posts.map(p => {
      if (p.id === activePost.id) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    setPosts(updatedPosts);
    setNewComment('');
    setCommentModalVisible(false);
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.topic || !newPost.imageUrl || !newPost.description) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    const createdPost: CommunityPost = {
      ...newPost,
      id: Date.now().toString(),
      user: 'me',
      comments: [],
    };
    setPosts([createdPost, ...posts]);
    setNewPost({ title: '', topic: '', imageUrl: '', description: '' });
    setNewPostModalVisible(false);
  };

  const renderPost = ({ item }: { item: CommunityPost }) => (
    <View className="bg-white rounded-lg shadow-md m-2 p-3 flex-1">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-32 rounded-lg mb-2"
        resizeMode="cover"
      />
      <Text className="font-semibold text-gray-800 mb-1" numberOfLines={2}>
        {item.title}
      </Text>
      <Text className="text-sm text-gray-600 mb-1">@{item.user}</Text>
      <Text className="text-sm text-gray-500 mb-2 capitalize">{item.topic}</Text>
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => handleAddToFavorites(item)}
          className="bg-blue-500 rounded-full p-2"
        >
          <Ionicons name="bookmark-outline" size={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openCommentModal(item)}
          className="bg-gray-200 rounded-full p-2 ml-2"
        >
          <Ionicons name="chatbubble-outline" size={16} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTopicButton = (topic: string | 'all') => (
    <TouchableOpacity
      key={topic}
      onPress={() => setSelectedTopic(topic)}
      className={`px-4 py-2 rounded-full mr-2 ${
        selectedTopic === topic ? 'bg-blue-500' : 'bg-gray-200'
      }`}
    >
      <Text
        className={`capitalize ${
          selectedTopic === topic ? 'text-white font-semibold' : 'text-gray-700'
        }`}
      >
        {topic}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-4 shadow-sm flex-row justify-between items-center">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search posts or users..."
              className="flex-1 ml-2 text-gray-700"
            />
          </View>
        </View>
        <TouchableOpacity className="p-2" onPress={() => setNewPostModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={28} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['all', ...topics]}
        renderItem={({ item }) => renderTopicButton(item)}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 4 }}
      />

      {filteredPosts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="people-circle-outline" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4">No posts found</Text>
          <Text className="text-gray-400 text-center mt-2 px-8">
            Try a different topic or search query.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
        />
      )}

      {/* Comment Modal */}
      <Modal visible={commentModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-lg p-5 w-11/12 max-h-[80%]">
            {activePost && (
              <ScrollView>
                <Image source={{ uri: activePost.imageUrl }} className="w-full h-64 rounded-lg mb-3" resizeMode="cover" />
                <Text className="text-xl font-bold text-gray-800 mb-1">{activePost.title}</Text>
                <Text className="text-sm text-gray-500 mb-1">@{activePost.user}</Text>
                <Text className="text-base text-gray-700 mb-3">{activePost.description}</Text>
                <Text className="font-semibold text-lg mb-2">Comments</Text>
                {(activePost.comments || []).map((comment: string, index: number) => (
                  <Text key={index} className="text-sm text-gray-800 mb-1">- {comment}</Text>
                ))}
              </ScrollView>
            )}
            <View className="flex-row items-center mt-4">
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write your comment..."
                className="border p-2 flex-1 rounded"
              />
              <TouchableOpacity onPress={submitComment} className="ml-2">
                <Text className="text-blue-600 font-semibold">Post</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setCommentModalVisible(false)}
              className="mt-4 self-end"
            >
              <Text className="text-gray-600">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Post Modal */}
      <Modal visible={newPostModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-lg p-5 w-11/12">
            <Text className="text-xl font-bold mb-4">Create New Post</Text>
            <ScrollView>
              <TextInput
                placeholder="Title"
                value={newPost.title}
                onChangeText={text => setNewPost(prev => ({ ...prev, title: text }))}
                className="border p-2 mb-3 rounded"
              />
              <TextInput
                placeholder="Topic"
                value={newPost.topic}
                onChangeText={text => setNewPost(prev => ({ ...prev, topic: text }))}
                className="border p-2 mb-3 rounded"
              />
              <View className="border p-2 mb-3 rounded h-[170px] relative justify-center items-center">
                <TextInput
                  placeholder="Image URL"
                  value={newPost.imageUrl}
                  onChangeText={text => setNewPost(prev => ({ ...prev, imageUrl: text }))}
                  className="absolute top-0 left-0 right-0 bottom-0 px-2"
                />
                <Ionicons name="image-outline" size={32} color="#9CA3AF" />
              </View>
              {newPost.imageUrl ? (
                <Image source={{ uri: newPost.imageUrl }} className="w-full h-40 rounded mb-3" resizeMode="cover" />
              ) : null}
              <TextInput
                placeholder="Description"
                value={newPost.description}
                onChangeText={text => setNewPost(prev => ({ ...prev, description: text }))}
                className="border p-2 mb-3 rounded"
                multiline
              />
              <TouchableOpacity onPress={handleCreatePost} className="bg-blue-500 py-2 rounded">
                <Text className="text-center text-white font-semibold">Publish</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewPostModalVisible(false)} className="mt-3">
                <Text className="text-center text-gray-600">Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommunityScreen;
