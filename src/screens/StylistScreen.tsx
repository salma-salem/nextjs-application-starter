import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  StyleSheet,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { mockWardrobeItems } from '../utils/mockWardrobeItems';

const brands = ['Brand A', 'Brand B', 'Brand C'];
const prices = ['All', 'Low', 'Medium', 'High'];
const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
const styles = ['Casual', 'Formal', 'Sporty'];

const mockTops = [
  { id: 'top1', name: 'Blue Shirt', image: 'https://m.media-amazon.com/images/I/510clbmuN3L._AC_SY879_.jpg', brand: 'Brand A', price: 'Low', color: 'Blue', style: 'Casual', material: 'Cotton' },
  { id: 'top2', name: 'Red T-Shirt', image: 'https://m.media-amazon.com/images/I/81uAQ5ENBPL._AC_SY879_.jpg', brand: 'Brand B', price: 'Medium', color: 'Red', style: 'Sporty', material: 'Polyester' },
  { id: 'top3', name: 'Green Hoodie', image: 'https://m.media-amazon.com/images/I/71IUMJCF66L._AC_SY879_.jpg', brand: 'Brand C', price: 'High', color: 'Green', style: 'Casual', material: 'Fleece' },
];

const mockBottoms = [
  { id: 'bottom1', name: 'Jeans', image: 'https://m.media-amazon.com/images/I/61cPaNKthYS._AC_SX679_.jpg', brand: 'Brand A', price: 'High', color: 'Blue', style: 'Casual', material: 'Denim' },
  { id: 'bottom2', name: 'Black Pants', image: 'https://m.media-amazon.com/images/I/61dWiA2iCsL._AC_SX679_.jpg', brand: 'Brand B', price: 'Medium', color: 'Black', style: 'Formal', material: 'Cotton' },
  { id: 'bottom3', name: 'Shorts', image: 'https://m.media-amazon.com/images/I/915TNAqRkKS._AC_SX679_.jpg', brand: 'Brand C', price: 'Low', color: 'White', style: 'Sporty', material: 'Linen' },
];

const StylistScreen = () => {
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string[]>([]);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [topSource, setTopSource] = useState<'wardrobe' | 'newItem'>('wardrobe');
  const [bottomSource, setBottomSource] = useState<'wardrobe' | 'newItem'>('wardrobe');

  const [brandDropdownVisible, setBrandDropdownVisible] = useState(false);
  const [priceDropdownVisible, setPriceDropdownVisible] = useState(false);
  const [colorDropdownVisible, setColorDropdownVisible] = useState(false);
  const [styleDropdownVisible, setStyleDropdownVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState<any>(null);

  const topPan = useRef(new Animated.ValueXY()).current;
  const bottomPan = useRef(new Animated.ValueXY()).current;

  const topPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderMove: Animated.event([null, { dx: topPan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          setTopIndex((prev) => (prev === mockTops.length - 1 ? 0 : prev + 1));
        } else if (gestureState.dx < -50) {
          setTopIndex((prev) => (prev === 0 ? mockTops.length - 1 : prev - 1));
        }
        Animated.spring(topPan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const bottomPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderMove: Animated.event([null, { dx: bottomPan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          setBottomIndex((prev) => (prev === mockBottoms.length - 1 ? 0 : prev + 1));
        } else if (gestureState.dx < -50) {
          setBottomIndex((prev) => (prev === 0 ? mockBottoms.length - 1 : prev - 1));
        }
        Animated.spring(bottomPan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const closeAllDropdowns = () => {
  setBrandDropdownVisible(false);
  setPriceDropdownVisible(false);
  setColorDropdownVisible(false);
  setStyleDropdownVisible(false);
};

const renderDropdown = (
    title: string,
    options: string[],
    selected: string | string[],
    setSelected: React.Dispatch<React.SetStateAction<any>>,
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const isMulti = Array.isArray(selected);
    const toggle = (value: string) => {
      if (!isMulti) {
        setSelected(value);
        setVisible(false);
        return;
      }
      setSelected(
        selected.includes(value)
          ? selected.filter((v: string) => v !== value)
          : [...selected, value]
      );
    };
    return (
      <View style={{ flex: 1, marginHorizontal: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        <TouchableOpacity
          style={{ borderWidth: 1, padding: 8, borderRadius: 5, marginBottom: 5 }}
          onPress={() => {
            if (!visible) closeAllDropdowns();
            setVisible(!visible);
          }}
        >
          <Text>{isMulti ? (selected.length ? selected.join(', ') : 'None') : selected}</Text>
        </TouchableOpacity>
        {visible && (
          <View style={{ position: 'absolute', top: 60, zIndex: 1000, backgroundColor: '#fff', borderWidth: 1, width: '100%' }}>
            {options.map((opt) => (
              <TouchableOpacity key={opt} onPress={() => toggle(opt)} style={{ padding: 10 }}>
                <Text>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderSourceSegmentedControl = (
    source: 'wardrobe' | 'newItem',
    setSource: React.Dispatch<React.SetStateAction<'wardrobe' | 'newItem'>>,
    label: string
  ) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label} from</Text>
      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#89CFF0', borderRadius: 5, overflow: 'hidden' }}>
        {['wardrobe', 'newItem'].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSource(option as 'wardrobe' | 'newItem')}
            style={{
              flex: 1,
              padding: 8,
              backgroundColor: source === option ? '#89CFF0' : '#fff',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: source === option ? '#fff' : '#007AFF' }}>
              {option === 'wardrobe' ? 'Wardrobe' : 'New item'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const filterItems = (items: any[]) =>
    items.filter((item) =>
      (!selectedBrand.length || selectedBrand.includes(item.brand)) &&
      (selectedPrice === 'All' || item.price === selectedPrice) &&
      (!selectedColor.length || selectedColor.includes(item.color)) &&
      (!selectedStyle.length || selectedStyle.includes(item.style))
    );

  

const wardrobeTops = mockWardrobeItems.filter(item => item.category === 'tops').map(item => ({
  id: item.id,
  name: item.name,
  brand: '',
  price: 'Low', // or a default
  color: item.color,
  style: '',
  image: item.imagePath,
}));

const filteredTops = filterItems(topSource === 'wardrobe' ? wardrobeTops : mockTops);
  const wardrobeBottoms = mockWardrobeItems.filter(item => item.category === 'bottoms').map(item => ({
  id: item.id,
  name: item.name,
  brand: '',
  price: 'Low',
  color: item.color,
  style: '',
  image: item.imagePath,
}));

const filteredBottoms = filterItems(bottomSource === 'wardrobe' ? wardrobeBottoms : mockBottoms);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {renderDropdown('Brand', brands, selectedBrand, setSelectedBrand, brandDropdownVisible, setBrandDropdownVisible)}
        {renderDropdown('Price', prices, selectedPrice, setSelectedPrice, priceDropdownVisible, setPriceDropdownVisible)}
        {renderDropdown('Color', colors, selectedColor, setSelectedColor, colorDropdownVisible, setColorDropdownVisible)}
        {renderDropdown('Style', styles, selectedStyle, setSelectedStyle, styleDropdownVisible, setStyleDropdownVisible)}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          {renderSourceSegmentedControl(topSource, setTopSource, 'Top')}
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          {renderSourceSegmentedControl(bottomSource, setBottomSource, 'Bottom')}
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View {...topPanResponder.panHandlers} style={[{ marginBottom: 20 }, topPan.getLayout()]}>
          <TouchableOpacity onPress={() => { setModalItem(filteredTops[topIndex % filteredTops.length]); setModalVisible(true); }}>
            <Image source={{ uri: filteredTops[topIndex % filteredTops.length]?.image }} style={{ width: 190, height: 190, resizeMode: 'contain' }} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View {...bottomPanResponder.panHandlers} style={[bottomPan.getLayout()]}>
          <TouchableOpacity onPress={() => { setModalItem(filteredBottoms[bottomIndex % filteredBottoms.length]); setModalVisible(true); }}>
            <Image source={{ uri: filteredBottoms[bottomIndex % filteredBottoms.length]?.image }} style={{ width: 190, height: 190, resizeMode:'contain' }} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: 300 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{modalItem?.name}</Text>
            <Image source={{ uri: modalItem?.image }} style={{ width: '100%', aspectRatio: 1, resizeMode: 'contain', marginVertical: 10 }} />
            <Text>Brand: {modalItem?.brand}</Text>
            <Text>Price: {modalItem?.price}</Text>
            <Text>Style: {modalItem?.style}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 }}>
  <Pressable onPress={() => setModalVisible(false)} style={{ backgroundColor: '#89CFF0', padding: 10, borderRadius: 5 }}>
    <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
  </Pressable>
  {modalItem?.brand && (
    <Pressable onPress={() => console.log('Add to cart')} style={{ backgroundColor: '#89CFF0', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 }}>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>🛒</Text>
</Pressable>
  )}
</View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StylistScreen;
