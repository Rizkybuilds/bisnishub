// ============================================================================
// KASKITA MOBILE APP ENTRY POINT
// File: App.tsx
// ============================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from './src/theme/tokens';
import { AppProvider, useApp, TabType } from './src/context/AppContext';
import { HomeScreen } from './src/screens/home/HomeScreen';
import { TransactionListScreen } from './src/screens/transactions/TransactionListScreen';
import { BudgetScreen } from './src/screens/budget/BudgetScreen';
import { CommunityScreen } from './src/screens/community/CommunityScreen';
import { AddTransactionModal } from './src/components/transactions/AddTransactionModal';

function MainApp() {
  const { activeTab, setActiveTab, isLoading } = useApp();
  const [quickAddVisible, setQuickAddVisible] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingLogo}>💰 KasKita</Text>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing.lg }} />
        <Text style={styles.loadingText}>Memuat pembukuan kas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* ACTIVE SCREEN CONTENT */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen onOpenQuickAdd={() => setQuickAddVisible(true)} />
        )}
        {activeTab === 'transactions' && (
          <TransactionListScreen onOpenQuickAdd={() => setQuickAddVisible(true)} />
        )}
        {activeTab === 'budget' && <BudgetScreen />}
        {activeTab === 'community' && <CommunityScreen />}
      </View>

      {/* BOTTOM TAB BAR (MODERN 4-TAB NAVIGATION + FAST ENTRY) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Beranda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('transactions')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, activeTab === 'transactions' && styles.navIconActive]}>
            📊
          </Text>
          <Text style={[styles.navLabel, activeTab === 'transactions' && styles.navLabelActive]}>
            Transaksi
          </Text>
        </TouchableOpacity>

        {/* QUICK CATAT CENTER BUTTON */}
        <TouchableOpacity
          style={styles.quickAddBtn}
          onPress={() => setQuickAddVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.quickAddIcon}>⚡</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('budget')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, activeTab === 'budget' && styles.navIconActive]}>🎯</Text>
          <Text style={[styles.navLabel, activeTab === 'budget' && styles.navLabelActive]}>
            Anggaran
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('community')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, activeTab === 'community' && styles.navIconActive]}>
            👥
          </Text>
          <Text style={[styles.navLabel, activeTab === 'community' && styles.navLabelActive]}>
            Komunitas
          </Text>
        </TouchableOpacity>
      </View>

      {/* QUICK TRANSACTION INPUT MODAL */}
      <AddTransactionModal
        visible={quickAddVisible}
        onClose={() => setQuickAddVisible(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  screenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    fontSize: 32,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  loadingText: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
    marginTop: Spacing.sm,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    ...Shadows.md,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 60,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  navLabel: {
    fontSize: Typography.sizes.micro,
    color: Colors.foregroundMuted,
    marginTop: 2,
    fontWeight: Typography.weights.medium,
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  quickAddBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    ...Shadows.lg,
  },
  quickAddIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
});
