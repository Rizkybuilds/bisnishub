// ============================================================================
// HOME SCREEN (PERSONAL HUB & MULTI-WALLET)
// File: src/screens/home/HomeScreen.tsx
// ============================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme/tokens';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { AddWalletModal } from '../../components/wallet/AddWalletModal';
import { PayObligationModal } from '../../components/wallet/PayObligationModal';
import { formatRupiah } from '../../utils/formatCurrency';
import { SocialObligation } from '../../types';

interface HomeScreenProps {
  onOpenQuickAdd: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenQuickAdd }) => {
  const {
    wallets,
    transactions,
    obligations,
    showBalance,
    totalNetWorth,
    monthlyIncome,
    monthlyExpense,
    toggleBalanceVisibility,
    setActiveTab,
  } = useApp();

  const [addWalletModalVisible, setAddWalletModalVisible] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState<SocialObligation | null>(null);

  const pendingObligationsCount = obligations.filter((o) => o.status === 'UNPAID').length;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. GREETING HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Selamat Datang,</Text>
          <Text style={styles.userNameText}>Budi Santoso 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationBadge}
          onPress={() =>
            Alert.alert(
              'Notifikasi Finansial',
              pendingObligationsCount > 0
                ? `Ada ${pendingObligationsCount} kewajiban iuran/arisan yang mendekati jatuh tempo!`
                : 'Tidak ada pengingat baru hari ini.'
            )
          }
        >
          <Text style={{ fontSize: 18 }}>🔔</Text>
          {pendingObligationsCount > 0 && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      </View>

      {/* 2. NET WORTH CARD (KARTU SALDO BERSIH) */}
      <View style={styles.netWorthCard}>
        <View style={styles.netWorthTop}>
          <Text style={styles.netWorthLabel}>TOTAL KEKAYAAN BERSIH</Text>
          <TouchableOpacity onPress={toggleBalanceVisibility} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.eyeIcon}>{showBalance ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.netWorthValue}>
          {showBalance ? formatRupiah(totalNetWorth) : '••••••••••••'}
        </Text>
        <View style={styles.cashflowRow}>
          <View style={styles.cashflowPillIncome}>
            <Text style={styles.cashflowIn}>
              ↓ Masuk: {showBalance ? formatRupiah(monthlyIncome) : '••••••'}
            </Text>
          </View>
          <View style={styles.cashflowPillExpense}>
            <Text style={styles.cashflowOut}>
              ↑ Keluar: {showBalance ? formatRupiah(monthlyExpense) : '••••••'}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. MULTI-WALLET CAROUSEL */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Dompet Saya ({wallets.length})</Text>
        <TouchableOpacity onPress={() => setAddWalletModalVisible(true)}>
          <Text style={styles.sectionLink}>+ Tambah Dompet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.walletCarousel}
      >
        {wallets.map((wallet) => (
          <View key={wallet.id} style={styles.walletCard}>
            <View style={styles.walletCardHeader}>
              <Text style={styles.walletIcon}>{wallet.icon}</Text>
              <Badge
                label={wallet.wallet_type === 'BANK' ? 'Bank' : wallet.wallet_type === 'EWALLET' ? 'E-Wallet' : 'Tunai'}
                variant={wallet.wallet_type === 'BANK' ? 'info' : wallet.wallet_type === 'EWALLET' ? 'warning' : 'neutral'}
              />
            </View>
            <Text style={styles.walletName}>{wallet.name}</Text>
            <Text style={styles.walletBalance}>
              {showBalance ? formatRupiah(wallet.balance) : '••••••'}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* 4. UPCOMING OBLIGATIONS WIDGET */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Kewajiban Sosial Mendatang</Text>
        {pendingObligationsCount > 0 ? (
          <View style={styles.obligationBadge}>
            <Text style={styles.obligationBadgeText}>{pendingObligationsCount} Menunggu</Text>
          </View>
        ) : (
          <Badge label="Semua Lunas 🎉" variant="success" />
        )}
      </View>

      <View style={styles.obligationList}>
        {obligations.map((item) => (
          <Card key={item.id} variant="elevated" style={styles.obligationItem}>
            <View style={styles.obligationLeft}>
              <Text style={styles.obligationIcon}>
                {item.type === 'RT_DUES' ? '🏢' : item.type === 'ARISAN' ? '🎲' : '🤝'}
              </Text>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Text style={styles.obligationTitle}>{item.title}</Text>
                <Text style={styles.obligationSubtitle}>
                  {item.due_date} • {formatRupiah(item.amount)}
                </Text>
              </View>
            </View>

            {item.status === 'UNPAID' ? (
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => setSelectedObligation(item)}
              >
                <Text style={styles.payButtonText}>Bayar</Text>
              </TouchableOpacity>
            ) : (
              <Badge label="LUNAS" variant="success" />
            )}
          </Card>
        ))}
      </View>

      {/* 5. RECENT TRANSACTIONS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mutasi Kas Terakhir</Text>
        <TouchableOpacity onPress={() => setActiveTab('transactions')}>
          <Text style={styles.sectionLink}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <Card variant="elevated" style={styles.transactionCard}>
        {recentTransactions.length === 0 ? (
          <View style={{ paddingVertical: Spacing.xl, alignItems: 'center' }}>
            <Text style={{ color: Colors.foregroundMuted }}>Belum ada transaksi tercatat.</Text>
            <TouchableOpacity onPress={onOpenQuickAdd} style={{ marginTop: Spacing.sm }}>
              <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>+ Catat Transaksi Pertama</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recentTransactions.map((tx, idx) => {
            const wallet = wallets.find((w) => w.id === tx.wallet_id);
            const isLast = idx === recentTransactions.length - 1;
            return (
              <View key={tx.id}>
                <View style={styles.transactionItem}>
                  <View style={styles.txLeft}>
                    <Text style={styles.txCategoryIcon}>{tx.category_icon}</Text>
                    <View>
                      <Text style={styles.txTitle}>{tx.description || tx.category_name}</Text>
                      <Text style={styles.txWallet}>
                        {wallet?.name || 'Dompet'} • {tx.transaction_date}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      tx.type === 'EXPENSE' ? styles.expenseAmount : styles.incomeAmount,
                    ]}
                  >
                    {tx.type === 'EXPENSE' ? '-' : '+'}
                    {showBalance ? formatRupiah(tx.amount) : '••••••'}
                  </Text>
                </View>
                {!isLast && <View style={styles.divider} />}
              </View>
            );
          })
        )}
      </Card>

      {/* MODALS */}
      <AddWalletModal
        visible={addWalletModalVisible}
        onClose={() => setAddWalletModalVisible(false)}
      />

      <PayObligationModal
        obligation={selectedObligation}
        visible={!!selectedObligation}
        onClose={() => setSelectedObligation(null)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 100, // accommodate bottom tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greetingText: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
  },
  userNameText: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  notificationBadge: {
    position: 'relative',
    padding: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unreadDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.expense,
  },
  netWorthCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  netWorthTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  netWorthLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  eyeIcon: {
    fontSize: 18,
  },
  netWorthValue: {
    fontSize: 32,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },
  cashflowRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cashflowPillIncome: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  cashflowPillExpense: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  cashflowIn: {
    fontSize: Typography.sizes.caption,
    color: '#FFFFFF',
    fontWeight: Typography.weights.medium,
  },
  cashflowOut: {
    fontSize: Typography.sizes.caption,
    color: '#FECDD3',
    fontWeight: Typography.weights.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  sectionLink: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  walletCarousel: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  walletCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: 160,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  walletCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  walletIcon: {
    fontSize: 26,
  },
  walletName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.foreground,
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  obligationBadge: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  obligationBadgeText: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: Colors.secondaryForeground,
  },
  obligationList: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  obligationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  obligationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  obligationIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  obligationTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.foreground,
  },
  obligationSubtitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
    marginTop: 2,
  },
  payButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  payButtonText: {
    color: Colors.primaryForeground,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.caption,
  },
  transactionCard: {
    padding: 0,
    marginBottom: Spacing.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  txCategoryIcon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  txTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.foreground,
  },
  txWallet: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
    marginTop: 2,
  },
  txAmount: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
  expenseAmount: {
    color: Colors.expense,
  },
  incomeAmount: {
    color: Colors.income,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
});
