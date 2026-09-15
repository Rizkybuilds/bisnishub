// ============================================================================
// TRANSACTION LIST SCREEN (MUTASI & FILTERING)
// File: src/screens/transactions/TransactionListScreen.tsx
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme/tokens';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { formatRupiah } from '../../utils/formatCurrency';

interface TransactionListScreenProps {
  onOpenQuickAdd: () => void;
}

type FilterType = 'ALL' | 'EXPENSE' | 'INCOME';

export const TransactionListScreen: React.FC<TransactionListScreenProps> = ({
  onOpenQuickAdd,
}) => {
  const { transactions, wallets, showBalance } = useApp();

  const [typeFilter, setTypeFilter] = useState<FilterType>('ALL');
  const [walletFilter, setWalletFilter] = useState<string>('ALL');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchType =
        typeFilter === 'ALL' || tx.type === typeFilter;
      const matchWallet =
        walletFilter === 'ALL' || tx.wallet_id === walletFilter;
      return matchType && matchWallet;
    });
  }, [transactions, typeFilter, walletFilter]);

  // Aggregate stats for filtered list
  const totalFilteredAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => {
      return tx.type === 'INCOME' ? sum + tx.amount : sum - tx.amount;
    }, 0);
  }, [filteredTransactions]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: { [date: string]: typeof transactions } = {};
    filteredTransactions.forEach((tx) => {
      const d = tx.transaction_date;
      if (!groups[d]) {
        groups[d] = [];
      }
      groups[d].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  const dates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  return (
    <View style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Transaksi</Text>
        <Text style={styles.subtitle}>
          {filteredTransactions.length} transaksi ditemukan
        </Text>
      </View>

      {/* 2. PRIMARY FILTER TABS (Semua | Pengeluaran | Pemasukan) */}
      <View style={styles.filterRow}>
        {(['ALL', 'EXPENSE', 'INCOME'] as FilterType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              typeFilter === tab && styles.filterTabActive,
            ]}
            onPress={() => setTypeFilter(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                typeFilter === tab && styles.filterTabTextActive,
              ]}
            >
              {tab === 'ALL'
                ? 'Semua'
                : tab === 'EXPENSE'
                ? '↓ Pengeluaran'
                : '↑ Pemasukan'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. SECONDARY WALLET CHIP FILTER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.walletFilterRow}
      >
        <TouchableOpacity
          style={[
            styles.walletChip,
            walletFilter === 'ALL' && styles.walletChipActive,
          ]}
          onPress={() => setWalletFilter('ALL')}
        >
          <Text
            style={[
              styles.walletChipText,
              walletFilter === 'ALL' && styles.walletChipTextActive,
            ]}
          >
            Semua Dompet
          </Text>
        </TouchableOpacity>

        {wallets.map((w) => (
          <TouchableOpacity
            key={w.id}
            style={[
              styles.walletChip,
              walletFilter === w.id && styles.walletChipActive,
            ]}
            onPress={() => setWalletFilter(w.id)}
          >
            <Text style={styles.walletChipIcon}>{w.icon}</Text>
            <Text
              style={[
                styles.walletChipText,
                walletFilter === w.id && styles.walletChipTextActive,
              ]}
            >
              {w.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 4. SUMMARY BAR */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryLabel}>Total Mutasi Terpilih:</Text>
        <Text
          style={[
            styles.summaryValue,
            totalFilteredAmount >= 0 ? styles.incomeText : styles.expenseText,
          ]}
        >
          {showBalance
            ? `${totalFilteredAmount >= 0 ? '+' : ''}${formatRupiah(totalFilteredAmount)}`
            : '••••••••••'}
        </Text>
      </View>

      {/* 5. TRANSACTION LIST GROUPED BY DATE */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {dates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Tidak Ada Transaksi</Text>
            <Text style={styles.emptyText}>
              Belum ada mutasi kas untuk filter yang dipilih.
            </Text>
            <TouchableOpacity style={styles.addNowBtn} onPress={onOpenQuickAdd}>
              <Text style={styles.addNowBtnText}>+ Catat Transaksi Baru</Text>
            </TouchableOpacity>
          </View>
        ) : (
          dates.map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
              <Card variant="elevated" style={styles.dateCard}>
                {groupedTransactions[date].map((tx, index) => {
                  const wallet = wallets.find((w) => w.id === tx.wallet_id);
                  const isLast = index === groupedTransactions[date].length - 1;
                  return (
                    <View key={tx.id}>
                      <View style={styles.txRow}>
                        <Text style={styles.txIcon}>{tx.category_icon}</Text>
                        <View style={styles.txDetails}>
                          <Text style={styles.txDesc}>{tx.description || tx.category_name}</Text>
                          <View style={styles.txSub}>
                            <Badge
                              label={tx.category_name}
                              variant="neutral"
                              style={{ marginRight: 6 }}
                            />
                            <Text style={styles.txWalletName}>
                              {wallet?.name || 'Dompet'}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[
                            styles.txAmount,
                            tx.type === 'EXPENSE' ? styles.expenseText : styles.incomeText,
                          ]}
                        >
                          {tx.type === 'EXPENSE' ? '-' : '+'}
                          {showBalance ? formatRupiah(tx.amount) : '••••••'}
                        </Text>
                      </View>
                      {!isLast && <View style={styles.divider} />}
                    </View>
                  );
                })}
              </Card>
            </View>
          ))
        )}
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity style={styles.fab} onPress={onOpenQuickAdd} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>⚡</Text>
        <Text style={styles.fabText}>Catat Kas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  subtitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.foregroundMuted,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  walletFilterRow: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
  },
  walletChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  walletChipIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  walletChipText: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
  },
  walletChipTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardSecondary,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.foregroundMuted,
  },
  summaryValue: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 110,
  },
  dateGroup: {
    marginBottom: Spacing.md,
  },
  dateHeader: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: Colors.foregroundMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  dateCard: {
    padding: 0,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  txIcon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  txDetails: {
    flex: 1,
  },
  txDesc: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.foreground,
  },
  txSub: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  txWalletName: {
    fontSize: Typography.sizes.micro,
    color: Colors.foregroundMuted,
  },
  txAmount: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
  expenseText: {
    color: Colors.expense,
  },
  incomeText: {
    color: Colors.income,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  addNowBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  addNowBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.body,
  },
  fab: {
    position: 'absolute',
    bottom: 85,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    ...Shadows.lg,
  },
  fabIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.body,
  },
});
