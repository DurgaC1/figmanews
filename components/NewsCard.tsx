import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Article {
  id: string;
  headline: string;
  image: string;
  category: string;
  source: string;
  sourceCredibility: 'verified' | 'trusted' | 'emerging';
  aiSummary: string;
  keyQuote?: string;
  relatedDiscussions: number;
  timestamp: string;
}

interface NewsCardProps {
  articles: Article[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onTapToRead: (index: number) => void;
}

export function NewsCard({ articles, currentIndex, onIndexChange, onTapToRead }: NewsCardProps) {
  const flatListRef = useRef<FlatList>(null);

  const getCredibilityIcon = (credibility: 'verified' | 'trusted' | 'emerging') => {
    switch (credibility) {
      case 'verified':
        return 'checkmark-circle';
      case 'trusted':
        return 'shield-checkmark';
      case 'emerging':
        return 'information-circle';
    }
  };

  const renderItem = ({ item, index }: { item: Article; index: number }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => onTapToRead(index)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        {/* Top Section - Category & Source */}
        <View style={styles.topSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          </View>
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>{item.source}</Text>
            <Ionicons 
              name={getCredibilityIcon(item.sourceCredibility)} 
              size={14} 
              color="rgba(255,255,255,0.6)" 
            />
          </View>
        </View>

        {/* Bottom Section - Main Content */}
        <View style={styles.bottomSection}>
          <Text style={styles.headline}>{item.headline}</Text>

          {/* AI Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="sparkles" size={16} color="#60A5FA" />
              <Text style={styles.summaryLabel}>AI SUMMARY</Text>
            </View>
            <Text style={styles.summaryText}>{item.aiSummary}</Text>
          </View>

          {/* Key Quote */}
          {item.keyQuote && (
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{item.keyQuote}"</Text>
            </View>
          )}

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="chatbubble-outline" size={16} color="rgba(255,255,255,0.6)" />
              <Text style={styles.metaText}>{item.relatedDiscussions.toLocaleString()}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.6)" />
              <Text style={styles.metaText}>{item.timestamp}</Text>
            </View>
          </View>

          {/* Call to Action */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => onTapToRead(index)}
          >
            <Text style={styles.ctaText}>TAP TO READ FULL STORY</Text>
          </TouchableOpacity>
        </View>

        {/* Right Side Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="volume-high-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={articles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / height);
        onIndexChange(index);
      }}
      getItemLayout={(data, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width,
    height,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
  },
  gradient: {
    position: 'absolute',
    width,
    height,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    marginTop: 80,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(37,99,235,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  bottomSection: {
    marginBottom: 112,
    marginHorizontal: 20,
  },
  headline: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 38,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  summaryText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  quoteContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#EAB308',
    paddingLeft: 16,
    marginBottom: 16,
  },
  quoteText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  actionButtons: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -48,
    gap: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
