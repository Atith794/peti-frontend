import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppLayout from './AppLayout';

const CHIP_COLORS = {
  all: '#FFE9E2',
  shows: '#E9E9FF',
  training: '#E6F6EA',
};

const Events = () => {
  const insets = useSafeAreaInsets();
  // const [activeChip, setActiveChip] = useState<'all' | 'shows' | 'training'>('all');
  const [activeChip, setActiveChip] = useState('all');


  // --- Static data (showcase only) ---
  const featured = useMemo(
    () => [
      {
        id: 'f1',
        title: 'International Dog Show 2024',
        subtitle: 'Premium Championship Event',
        location: 'Madison Square Garden, New York',
        date: 'Mar 25, 2024',
        image:
          'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=1600&auto=format&fit=crop',
        price: 45,
        rating: 4.8,
        tag: 'POPULAR',
      },
      {
        id: 'f2',
        title: 'Feline Gala & Parade',
        subtitle: 'Cat Lovers Fest',
        location: 'Staples Center, Los Angeles',
        date: 'Apr 12, 2024',
        image:
          'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1600&auto=format&fit=crop',
        price: 35,
        rating: 4.7,
        tag: 'TRENDING',
      },
      {
        id: 'f3',
        title: 'Paws & Friends Expo',
        subtitle: 'All Pets Welcome',
        location: 'Downtown Arena, Chicago',
        date: 'May 5, 2024',
        image:
          'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1600&auto=format&fit=crop',
        price: 30,
        rating: 4.6,
        tag: 'NEW',
      },
    ],
    []
  );

  const allEvents = useMemo(
    () => [
      {
        id: 'e1',
        title: 'Golden Retriever Meet',
        subtitle: 'Central Park Gathering',
        location: 'Central Park, New York',
        date: 'Mar 10, 2024',
        time: '3:00 PM',
        attendees: '58 attending',
        image:
          'https://images.unsplash.com/photo-1542587227-8802646daa0b?q=80&w=1600&auto=format&fit=crop',
        price: 15,
        rating: 4.6,
      },
      {
        id: 'e2',
        title: 'Pet Photography Walk',
        subtitle: 'Capture Perfect Moments',
        location: 'Brooklyn Bridge Park, NYC',
        date: 'Apr 2, 2024',
        time: '10:00 AM',
        attendees: '200 attending',
        image:
          'https://images.unsplash.com/photo-1541597455161-0b4bd7a6a58e?q=80&w=1600&auto=format&fit=crop',
        price: 25,
        rating: 4.7,
      },
      {
        id: 'e3',
        title: 'Puppy Training Basics',
        subtitle: 'Basic Obedience Course',
        location: 'Canine Academy, San Francisco',
        date: 'Apr 25, 2024',
        time: '9:00 AM',
        attendees: '45 attending',
        image:
          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop',
        price: 85,
        rating: 4.8,
      },
      {
        id: 'e4',
        title: 'Exotic Pet Expo',
        subtitle: 'Rare Animals & Birds',
        location: 'Convention Center, Miami',
        date: 'Jun 10, 2024',
        time: '10:00 AM',
        attendees: '1200 attending',
        image:
          'https://images.unsplash.com/photo-1545249390-6bdfa2860323?q=80&w=1600&auto=format&fit=crop',
        price: 30,
        rating: 4.5,
      },
    ],
    []
  );

  // Filter is cosmetic in this static screen
  const filteredEvents = allEvents; // could filter by activeChip if you want

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search + filter pill */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔎</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search events, venues…"
                placeholderTextColor="#9AA3AF"
                editable={false} // static demo
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
              <Text style={styles.filterIcon}>⏳</Text>
            </TouchableOpacity>
          </View>

          {/* Category chips */}
          <View style={styles.chipsRow}>
            <Chip
              label="All Events"
              active={activeChip === 'all'}
              onPress={() => setActiveChip('all')}
              bg={CHIP_COLORS.all}
            />
            <Chip
              label="Pet Shows"
              active={activeChip === 'shows'}
              onPress={() => setActiveChip('shows')}
              bg={CHIP_COLORS.shows}
            />
            <Chip
              label="Training"
              active={activeChip === 'training'}
              onPress={() => setActiveChip('training')}
              bg={CHIP_COLORS.training}
            />
          </View>

          {/* Featured */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Featured Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featured}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => <FeaturedCard item={item} />}
            style={{ marginBottom: 16 }}
          />

          {/* All Events */}
          <Text style={[styles.sectionTitle, { marginTop: 8, marginHorizontal: 16 }]}>
            All Events
          </Text>

          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
            {filteredEvents.map((item) => (
              <EventRow key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      </AppLayout>
    </View>
  );
};

/* -------------------------- Small subcomponents -------------------------- */

const Chip = ({ label, active, onPress, bg }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        { backgroundColor: bg || '#EEE' },
        active && { borderWidth: 1, borderColor: '#111827' },
      ]}
    >
      <Text style={[styles.chipText, active && { color: '#111827', fontWeight: '700' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const FeaturedCard = ({ item }: any) => {
  return (
    <View style={styles.featuredCard}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      {/* tag */}
      <View style={styles.tagPill}>
        <Text style={styles.tagText}>{item.tag}</Text>
      </View>
      {/* rating */}
      <View style={styles.ratingPill}>
        <Text style={styles.ratingText}>{item.rating.toFixed(1)} ★</Text>
      </View>

      <View style={styles.featuredBody}>
        <Text numberOfLines={1} style={styles.featuredTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.featuredSubtitle}>
          {item.subtitle}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLine}>📍 {item.location}</Text>
          <Text style={styles.metaLine}>📅 {item.date}</Text>
        </View>

        <View style={styles.ctaRow}>
          <Text style={styles.priceText}>From ${item.price}</Text>
          <TouchableOpacity style={styles.bookBtn} activeOpacity={0.9}>
            <Text style={styles.bookBtnText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const EventRow = ({ item }: any) => {
  return (
    <View style={styles.rowCard}>
      <Image source={{ uri: item.image }} style={styles.rowImage} />

      <View style={{ flex: 1, paddingVertical: 10, paddingRight: 10 }}>
        <View style={styles.rowTitleWrap}>
          <Text numberOfLines={1} style={styles.rowTitle}>
            {item.title}
          </Text>
          <Text style={styles.rowRating}>{item.rating.toFixed(1)} ★</Text>
        </View>
        <Text numberOfLines={1} style={styles.rowSubtitle}>
          {item.subtitle}
        </Text>

        <Text style={styles.rowMeta}>📍 {item.location}</Text>
        <View style={{ height: 4 }} />
        <View style={styles.rowMetaInline}>
          <Text style={styles.rowMetaSmall}>📅 {item.date}</Text>
          <Text style={styles.rowDot}>•</Text>
          <Text style={styles.rowMetaSmall}>⏰ {item.time}</Text>
          <Text style={styles.rowDot}>•</Text>
          <Text style={styles.rowMetaSmall}>👥 {item.attendees}</Text>
        </View>

        <View style={styles.rowCtaWrap}>
          <Text style={styles.rowPrice}>From ${item.price}</Text>
          <TouchableOpacity style={styles.rowBookBtn} activeOpacity={0.9}>
            <Text style={styles.rowBookText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* --------------------------------- Styles -------------------------------- */

const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#6B7280';
const ORANGE = '#FF6A3D';
const SHADOW =
  Platform.OS === 'ios'
    ? {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      }
    : { elevation: 4 };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  scrollContent: { paddingBottom: 32 },

  /* Search */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    ...SHADOW,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: TEXT_PRIMARY },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    ...SHADOW,
  },
  filterIcon: { fontSize: 18 },

  /* Chips */
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { color: '#374151', fontSize: 13 },

  /* Section header */
  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: TEXT_PRIMARY },
  seeAll: { color: '#6366F1', fontWeight: '600' },

  /* Featured card */
  featuredCard: {
    width: 280,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOW,
  },
  featuredImage: { width: '100%', height: 150 },
  tagPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF4D67',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  ratingPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  featuredBody: { padding: 12, gap: 6 },
  featuredTitle: { color: TEXT_PRIMARY, fontSize: 16, fontWeight: '800' },
  featuredSubtitle: { color: TEXT_SECONDARY, fontSize: 12 },
  metaRow: { gap: 4, marginTop: 2 },
  metaLine: { color: TEXT_SECONDARY, fontSize: 12 },
  ctaRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: { color: ORANGE, fontWeight: '800' },
  bookBtn: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bookBtnText: { color: '#FFF', fontWeight: '700' },

  /* All-events row card */
  rowCard: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    ...SHADOW,
  },
  rowImage: { width: 96, height: 96, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  rowTitleWrap: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { flex: 1, color: TEXT_PRIMARY, fontWeight: '800', fontSize: 15 },
  rowRating: { marginLeft: 6, color: TEXT_PRIMARY, fontWeight: '700', fontSize: 12 },
  rowSubtitle: { color: TEXT_SECONDARY, marginTop: 2, fontSize: 12 },
  rowMeta: { color: TEXT_SECONDARY, marginTop: 6, fontSize: 12 },
  rowMetaInline: { flexDirection: 'row', alignItems: 'center' },
  rowMetaSmall: { color: TEXT_SECONDARY, fontSize: 12 },
  rowDot: { marginHorizontal: 6, color: '#9CA3AF' },
  rowCtaWrap: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowPrice: { color: ORANGE, fontWeight: '800' },
  rowBookBtn: {
    backgroundColor: '#FF6A3D',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  rowBookText: { color: '#FFF', fontWeight: '800' },
});

export default Events;
