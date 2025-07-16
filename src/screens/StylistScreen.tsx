import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  StyleSheet,
} from 'react-native';
import React, { useState, useRef } from 'react';

const brands = ['Brand A', 'Brand B', 'Brand C'];
const prices = ['Low', 'Medium', 'High'];
const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
const styles = ['Casual', 'Formal', 'Sporty'];

const mockTops = [
  { id: 'top1', name: 'Blue Shirt', image: 'https://m.media-amazon.com/images/I/510clbmuN3L._AC_SY879_.jpg', brand: 'Brand A', price: '$30', material: 'Cotton' },
  { id: 'top2', name: 'Red T-Shirt', image: 'https://m.media-amazon.com/images/I/81uAQ5ENBPL._AC_SY879_.jpg', brand: 'Brand B', price: '$25', material: 'Polyester' },
  { id: 'top3', name: 'Green Hoodie', image: 'https://m.media-amazon.com/images/I/71IUMJCF66L._AC_SY879_.jpg', brand: 'Brand C', price: '$40', material: 'Fleece' },
];

const mockBottoms = [
  { id: 'bottom1', name: 'Jeans', image: 'https://m.media-amazon.com/images/I/61cPaNKthYS._AC_SX679_.jpg', brand: 'Brand A', price: '$50', material: 'Denim' },
  { id: 'bottom2', name: 'Black Pants', image: 'https://m.media-amazon.com/images/I/61dWiA2iCsL._AC_SX679_.jpg', brand: 'Brand B', price: '$45', material: 'Cotton' },
  { id: 'bottom3', name: 'Shorts', image: 'https://m.media-amazon.com/images/I/915TNAqRkKS._AC_SX679_.jpg', brand: 'Brand C', price: '$35', material: 'Linen' },
];

const StylistScreen = () => {
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>(prices[0]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string[]>([]);


  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const [brandDropdownVisible, setBrandDropdownVisible] = useState(false);
  const [priceDropdownVisible, setPriceDropdownVisible] = useState(false);
  const [colorDropdownVisible, setColorDropdownVisible] = useState(false);
  const [styleDropdownVisible, setStyleDropdownVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState<any>(null);

  const topPan = useRef(new Animated.ValueXY()).current;
  const bottomPan = useRef(new Animated.ValueXY()).current;

  const closeAllDropdowns = () => {
    setBrandDropdownVisible(false);
    setPriceDropdownVisible(false);
    setColorDropdownVisible(false);
    setStyleDropdownVisible(false);
  };

  const panResponderTop = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderMove: Animated.event([null, { dx: topPan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe right - go to next item
          setTopIndex((prev) => (prev === mockTops.length - 1 ? 0 : prev + 1));
        } else if (gestureState.dx < -50) {
          // Swipe left - go to previous item
          setTopIndex((prev) => (prev === 0 ? mockTops.length - 1 : prev - 1));
        }
        Animated.spring(topPan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const panResponderBottom = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderMove: Animated.event([null, { dx: bottomPan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe right - go to next item
          setBottomIndex((prev) => (prev === mockBottoms.length - 1 ? 0 : prev + 1));
        } else if (gestureState.dx < -50) {
          // Swipe left - go to previous item
          setBottomIndex((prev) => (prev === 0 ? mockBottoms.length - 1 : prev - 1));
        }
        Animated.spring(bottomPan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const renderDropdown = (
    title: string,
    options: string[],
    selected: string | string[],
    setSelected: React.Dispatch<React.SetStateAction<string | string[]>>,
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const isMultiSelect = Array.isArray(selected);
    const toggleOption = (option: string) => {
      if (!isMultiSelect) {
        setSelected(option);
        setVisible(false);
        return;
      }
      const selectedArray = selected as string[];
      if (selectedArray.includes(option)) {
        setSelected(selectedArray.filter((item) => item !== option));
      } else {
        setSelected([...selectedArray, option]);
      }
    };
    const displaySelected = () => {
      if (!isMultiSelect) {
        return selected as string;
      }
      if ((selected as string[]).length === 0) {
        return 'None';
      }
      return (selected as string[]).join(', ');
    };
    return (
      <View style={{ flex: 1, marginHorizontal: 5 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            if (!visible) {
              closeAllDropdowns();
            }
            setVisible(!visible);
          }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            backgroundColor: '#fff',
          }}
        >
          <Text>{displaySelected()}</Text>
        </TouchableOpacity>
        {visible && (
          <View
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              zIndex: 1000,
            }}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => toggleOption(option)}
                style={{ padding: 10 }}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      {/* Filters Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {renderDropdown('Brand', brands, selectedBrand, setSelectedBrand as any, brandDropdownVisible, setBrandDropdownVisible)}
        {renderDropdown('Price', prices, selectedPrice, setSelectedPrice as any, priceDropdownVisible, setPriceDropdownVisible)}
        {renderDropdown('Color', colors, selectedColor, setSelectedColor as any, colorDropdownVisible, setColorDropdownVisible)}
        {renderDropdown('Style', styles, selectedStyle, setSelectedStyle as any, styleDropdownVisible, setStyleDropdownVisible)}
      </View>

      {/* Recommended Outfit */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View
          {...panResponderTop.panHandlers}
          style={[{ marginBottom: 20, alignItems: 'center' }, topPan.getLayout()]}
        >
          <Image
            source={{ uri: mockTops[topIndex].image }}
            style={{ width: 200, height: 200, resizeMode: 'contain' }}
            onPress={() => {
              setModalItem(mockTops[topIndex]);
              setModalVisible(true);
            }}
          />
        </Animated.View>

        <Animated.View
          {...panResponderBottom.panHandlers}
          style={[{ alignItems: 'center' }, bottomPan.getLayout()]}
        >
          <Image
            source={{ uri: mockBottoms[bottomIndex].image }}
            style={{ width: 200, height: 200, resizeMode: 'contain' }}
            onPress={() => {
              setModalItem(mockBottoms[bottomIndex]);
              setModalVisible(true);
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

import { Image, Modal, Pressable } from 'react-native';

export default StylistScreen;
