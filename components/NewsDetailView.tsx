import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Linking } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface NewsDetailViewProps {
  news: Array<{
    id: string;
    category: string;
    headline: string;
    deck: string;
    image: string;
    aiSummary: string;
    keyPoints: string[];
    quote?: {
      text: string;
      author: string;
    };
    sources: Array<{
      name: string;
      title: string;
      url: string;
      credibility: 'high' | 'medium';
    }>;
    publishedAt: string;
    readTime: string;
  }>;
  currentIndex: number;
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function NewsDetailView({ news, currentIndex, onBack, onNext, onPrevious }: NewsDetailViewProps) {
  const currentNews = news[currentIndex];

  if (!news || news.length === 0 || !currentNews) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-back" size={20} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="volume-high-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="share-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="bookmark-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Category & Meta */}
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentNews.category.toUpperCase()}</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>{currentNews.publishedAt}</Text>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.metaText}>{currentNews.readTime}</Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>{currentNews.headline}</Text>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentNews.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* AI Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="sparkles" size={16} color="#60A5FA" />
            <Text style={styles.summaryLabel}>AI SUMMARY</Text>
          </View>
          <Text style={styles.summaryText}>{currentNews.aiSummary}</Text>
        </View>

        {/* Key Points */}
        {currentNews.keyPoints && currentNews.keyPoints.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Points</Text>
            {currentNews.keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPoint}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quote */}
        {currentNews.quote && (
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{currentNews.quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {currentNews.quote.author}</Text>
          </View>
        )}

        {/* Full Article Content */}
        <View style={styles.section}>
          <Text style={styles.articleText}>
            This is where the full article content would appear. In a production app, 
            this would include the complete story with multiple paragraphs, quotes, 
            and additional context.
          </Text>
          <Text style={styles.articleText}>
            The article would continue with more detailed information, expert analysis, 
            and comprehensive coverage of the news story.
          </Text>
        </View>

        {/* Related Sources */}
        {currentNews.sources && currentNews.sources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Coverage</Text>
            {currentNews.sources.map((source, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(source.url)}
                style={styles.sourceCard}
                activeOpacity={0.7}
              >
                <View style={styles.sourceContent}>
                  <Text style={styles.sourceTitle}>{source.title}</Text>
                  <Text style={styles.sourceName}>{source.name}</Text>
                </View>
                <View style={[
                  styles.credibilityBadge,
                  source.credibility === 'high' ? styles.credibilityHigh : styles.credibilityMedium
                ]}>
                  <Text style={styles.credibilityText}>
                    {source.credibility === 'high' ? 'Verified' : 'Trusted'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <TouchableOpacity
          onPress={onPrevious}
          style={[styles.navButton, styles.navButtonLeft]}
          activeOpacity={0.7}
        >
          <BlurView intensity={80} tint="dark" style={styles.navButtonBlur}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </BlurView>
        </TouchableOpacity>
      )}
      
      {currentIndex < news.length - 1 && (
        <TouchableOpacity
          onPress={onNext}
          style={[styles.navButton, styles.navButtonRight]}
          activeOpacity={0.7}
        >
          <BlurView intensity={80} tint="dark" style={styles.navButtonBlur}>
            <Ionicons name="chevron-forward" size={24} color="#ffffff" />
          </BlurView>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  headerBlur: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 100,
    paddingBottom: 96,
    paddingHorizontal: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: 'rgba(37,99,235,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  metaSeparator: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  headline: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 38,
    marginBottom: 24,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 256,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  keyPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  bulletPoint: {
    color: '#60A5FA',
    fontSize: 16,
    marginTop: 2,
  },
  keyPointText: {
    flex: 1,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    lineHeight: 24,
  },
  quoteContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#EAB308',
    paddingLeft: 16,
    marginBottom: 24,
  },
  quoteText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 28,
    marginBottom: 8,
  },
  quoteAuthor: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  articleText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  sourceCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  sourceContent: {
    flex: 1,
  },
  sourceTitle: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 4,
  },
  sourceName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  credibilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  credibilityHigh: {
    backgroundColor: 'rgba(16,185,129,0.2)',
  },
  credibilityMedium: {
    backgroundColor: 'rgba(37,99,235,0.2)',
  },
  credibilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  navButtonLeft: {
    left: 20,
  },
  navButtonRight: {
    right: 20,
  },
  navButtonBlur: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
