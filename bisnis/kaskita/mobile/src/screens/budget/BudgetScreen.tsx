// ============================================================================
// BUDGET & OBLIGATION CALENDAR SCREEN
// File: src/screens/budget/BudgetScreen.tsx
// ============================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme/tokens';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { PayObligationModal } from '../../components/wallet/PayObligationModal';
import { formatRupiah } from '../../utils/formatCurrency';
import { SocialObligation } from '../../types';

export const BudgetScreen: React.FC = () => {
  const {
    budgets,
    transactions,
    obligations,
    categories,
    updateBudget,
    showBalance,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'BUDGET' | 'CALENDAR'>('BUDGET');
  const [selectedObligation, setSelectedObligation] = useState<SocialObligation | null>(null);

  // Edit Budget Modal State
  const [editBudgetModalVisible, setEditBudgetModalVisible] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');
  const [budgetAmountRaw, setBudgetAmountRaw] = useState('');

  // Calculate used amount per category in the current month
  const currentMonth = new Date().toISOString().slice(0, 7);

  const getCategoryExpense = (catId: string) => {
    return transactions
      .filter(
        (t) =>
          t.type === 'EXPENSE' &&
          t.category_id === catId &&
          t.transaction_date.startsWith(currentMonth)
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit_amount, 0);
  const totalBudgetUsed = budgets.reduce(
    (sum, b) => sum + getCategoryExpense(b.category_id),
    0
  );

  const handleSaveBudget = async () => {
    const amount = parseInt(budgetAmountRaw.replace(/\D/g, ''), 10) || 0;
    if (amount <= 0) {
      Alert.alert('Perhatian', 'Masukkan batas anggaran yang valid.');
      return;
    }

    await updateBudget(selectedCatId, amount);
    setEditBudgetModalVisible(false);
    setBudgetAmountRaw('');
    Alert.alert('Berhasil', 'Batas anggaran bulanan telah diperbarui.');
  };

  return (
    <View style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Anggaran & Kalender</Text>
        <Text style={styles.subtitle}>
          Kendalikan batas belanja & pantau jatuh tempo komunal
        </Text>
      </View>

      {/* 2. SUB-TAB SWITCHER */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeSubTab === 'BUDGET' && styles.tabBtnActive]}
          onPress={() => setActiveSubTab('BUDGET')}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeSubTab === 'BUDGET' && styles.tabBtnTextActive,
            ]}
          >
            🎯 Anggaran Bulanan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeSubTab === 'CALENDAR' && styles.tabBtnActive]}
          onPress={() => setActiveSubTab('CALENDAR')}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeSubTab === 'CALENDAR' && styles.tabBtnTextActive,
            ]}
          >
            📅 Kalender Kewajiban
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SUB-TAB 1: MONTHLY BUDGETING */}
        {activeSubTab === 'BUDGET' && (
          <>
            {/* SUMMARY CARD */}
            <Card variant="elevated" style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View>
                  <Text style={styles.summaryLabel}>TOTAL ANGGARAN SEPTEMBER</Text>
                  <Text style={styles.summaryTotal}>
                    {showBalance ? formatRupiah(totalBudgetLimit) : '••••••••'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addBudgetBtn}
                  onPress={() => setEditBudgetModalVisible(true)}
                >
                  <Text style={styles.addBudgetBtnText}>+ Atur Batas</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.summaryProgressContainer}>
                <View
                  style={[
                    styles.summaryProgressBar,
                    {
                      width: `${Math.min(
                        100,
                        totalBudgetLimit > 0 ? (totalBudgetUsed / totalBudgetLimit) * 100 : 0
                      )}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.summaryBottom}>
                <Text style={styles.usedText}>
                  Terpakai: {showBalance ? formatRupiah(totalBudgetUsed) : '••••••'}
                </Text>
                <Text style={styles.remainingText}>
                  Sisa:{' '}
                  {showBalance
                    ? formatRupiah(Math.max(0, totalBudgetLimit - totalBudgetUsed))
                    : '••••••'}
                </Text>
              </View>
            </Card>

            {/* CATEGORY BUDGETS LIST */}
            <Text style={styles.sectionTitle}>Batas Anggaran Kategori</Text>
            {budgets.map((b) => {
              const used = getCategoryExpense(b.category_id);
              const percentage = Math.min(100, Math.round((used / b.limit_amount) * 100));
              const remaining = Math.max(0, b.limit_amount - used);

              // Color based on threshold: Green <75%, Yellow 75-90%, Red >90%
              let barColor = Colors.primary;
              let statusVariant: 'success' | 'warning' | 'danger' = 'success';
              let statusLabel = `${percentage}% Aman`;

              if (percentage >= 90) {
                barColor = Colors.expense;
                statusVariant = 'danger';
                statusLabel = `${percentage}% Kritis!`;
              } else if (percentage >= 75) {
                barColor = Colors.warning;
                statusVariant = 'warning';
                statusLabel = `${percentage}% Waspada`;
              }

              return (
                <Card key={b.category_id} variant="elevated" style={styles.budgetCard}>
                  <View style={styles.budgetCardHeader}>
                    <View style={styles.budgetCatLeft}>
                      <Text style={styles.catIcon}>{b.category_icon}</Text>
                      <View>
                        <Text style={styles.catName}>{b.category_name}</Text>
                        <Text style={styles.catLimit}>
                          Batas: {showBalance ? formatRupiah(b.limit_amount) : '••••••'}
                        </Text>
                      </View>
                    </View>
                    <Badge label={statusLabel} variant={statusVariant} />
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${percentage}%`, backgroundColor: barColor },
                      ]}
                    />
                  </View>

                  <View style={styles.budgetCardFooter}>
                    <Text style={styles.budgetUsedText}>
                      Terpakai: {showBalance ? formatRupiah(used) : '••••••'}
                    </Text>
                    <Text style={styles.budgetRemainingText}>
                      Sisa: {showBalance ? formatRupiah(remaining) : '••••••'}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {/* SUB-TAB 2: FINANCIAL OBLIGATION CALENDAR */}
        {activeSubTab === 'CALENDAR' && (
          <>
            <View style={styles.calendarInfoBanner}>
              <Text style={styles.calendarInfoIcon}>💡</Text>
              <Text style={styles.calendarInfoText}>
                Fitur <Text style={{ fontWeight: 'bold' }}>Zero Double-Entry</Text> memastikan
                saat Anda klik 'Bayar', saldo dompet langsung dipotong dan mutasi pengeluaran
                tercatat otomatis tanpa entri berulang!
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Daftar Jatuh Tempo Finansial</Text>
            {obligations.map((item) => (
              <Card key={item.id} variant="elevated" style={styles.calendarCard}>
                <View style={styles.calendarCardLeft}>
                  <Text style={styles.calendarIcon}>
                    {item.type === 'RT_DUES' ? '🏢' : item.type === 'ARISAN' ? '🎲' : '🤝'}
                  </Text>
                  <View style={{ flex: 1, marginRight: Spacing.sm }}>
                    <Text style={styles.calendarTitle}>{item.title}</Text>
                    <Text style={styles.calendarGroup}>{item.group_name}</Text>
                    <Text style={styles.calendarDueDate}>
                      ⏰ {item.due_date} • {formatRupiah(item.amount)}
                    </Text>
                  </View>
                </View>

                {item.status === 'UNPAID' ? (
                  <TouchableOpacity
                    style={styles.directPayBtn}
                    onPress={() => setSelectedObligation(item)}
                  >
                    <Text style={styles.directPayBtnText}>Bayar & Catat</Text>
                  </TouchableOpacity>
                ) : (
                  <Badge label="LUNAS & TERCATAT" variant="success" />
                )}
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      {/* EDIT BUDGET MODAL */}
      <Modal visible={editBudgetModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎯 Atur Anggaran Kategori</Text>
              <TouchableOpacity
                onPress={() => setEditBudgetModalVisible(false)}
                style={styles.closeBtn}
              >
                <Text style={{ fontSize: 16, color: Colors.foregroundMuted }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
              <Text style={styles.label}>PILIH KATEGORI PENGELUARAN</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg }}>
                {categories
                  .filter((c) => c.type === 'EXPENSE')
                  .map((c) => {
                    const isSel = selectedCatId === c.id;
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.catChip, isSel && styles.catChipSel]}
                        onPress={() => setSelectedCatId(c.id)}
                      >
                        <Text style={{ marginRight: 4 }}>{c.icon}</Text>
                        <Text style={[styles.catChipText, isSel && styles.catChipTextSel]}>
                          {c.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>

              <Text style={styles.label}>BATAS MAKSIMAL PER BULAN (RP)</Text>
              <Input
                placeholder="Cth: 1500000"
                keyboardType="numeric"
                value={budgetAmountRaw}
                onChangeText={setBudgetAmountRaw}
              />

              <Button
                title="Simpan Batas Anggaran"
                size="lg"
                onPress={handleSaveBudget}
                style={{ marginTop: Spacing.md }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PAY OBLIGATION MODAL */}
      <PayObligationModal
        obligation={selectedObligation}
        visible={!!selectedObligation}
        onClose={() => setSelectedObligation(null)}
      />
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
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabBtnText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.foregroundMuted,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 110,
  },
  summaryCard: {
    marginBottom: Spacing.xl,
    backgroundColor: '#064E3B',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  summaryTotal: {
    fontSize: 26,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginTop: 2,
  },
  addBudgetBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  addBudgetBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
  },
  summaryProgressContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginVertical: Spacing.md,
    overflow: 'hidden',
  },
  summaryProgressBar: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 4,
  },
  summaryBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usedText: {
    fontSize: Typography.sizes.caption,
    color: '#E2E8F0',
  },
  remainingText: {
    fontSize: Typography.sizes.caption,
    color: '#A7F3D0',
    fontWeight: Typography.weights.bold,
  },
  sectionTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
    marginBottom: Spacing.md,
  },
  budgetCard: {
    marginBottom: Spacing.md,
  },
  budgetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetCatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  catName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.foreground,
  },
  catLimit: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 4,
    marginVertical: Spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetUsedText: {
    fontSize: Typography.sizes.micro,
    color: Colors.foregroundMuted,
  },
  budgetRemainingText: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  calendarInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: Spacing.lg,
  },
  calendarInfoIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  calendarInfoText: {
    flex: 1,
    fontSize: Typography.sizes.caption,
    color: '#1E40AF',
    lineHeight: 18,
  },
  calendarCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  calendarCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  calendarIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  calendarTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.foreground,
  },
  calendarGroup: {
    fontSize: Typography.sizes.micro,
    color: Colors.foregroundMuted,
  },
  calendarDueDate: {
    fontSize: Typography.sizes.caption,
    color: Colors.primaryHover,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  directPayBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  directPayBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.caption,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
    paddingBottom: Spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  modalTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.foregroundMuted,
    marginBottom: Spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
  },
  catChipSel: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  catChipText: {
    fontSize: Typography.sizes.caption,
    color: Colors.foreground,
  },
  catChipTextSel: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
