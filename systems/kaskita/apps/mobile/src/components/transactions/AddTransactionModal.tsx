// ============================================================================
// QUICK ADD TRANSACTION MODAL (<5s Entry Flow)
// File: src/components/transactions/AddTransactionModal.tsx
// ============================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../../theme/tokens';
import { TransactionType } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatRupiah } from '../../utils/formatCurrency';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
}) => {
  const { wallets, categories, addTransaction } = useApp();

  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amountRaw, setAmountRaw] = useState<string>('');
  const [selectedWalletId, setSelectedWalletId] = useState<string>(
    wallets[0]?.id || ''
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter categories by type
  const availableCategories = categories.filter((c) => c.type === type);

  // Set default category when type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const newCats = categories.filter((c) => c.type === newType);
    if (newCats.length > 0) {
      setSelectedCategoryId(newCats[0].id);
    }
  };

  // Format amount for display
  const numericAmount = parseInt(amountRaw.replace(/\D/g, ''), 10) || 0;

  const handleSubmit = async () => {
    if (numericAmount <= 0) {
      Alert.alert('Perhatian', 'Mohon masukkan nominal transaksi yang valid.');
      return;
    }

    const walletId = selectedWalletId || wallets[0]?.id;
    if (!walletId) {
      Alert.alert('Perhatian', 'Mohon pilih dompet sumber/tujuan.');
      return;
    }

    const categoryId = selectedCategoryId || availableCategories[0]?.id;
    if (!categoryId) {
      Alert.alert('Perhatian', 'Mohon pilih kategori transaksi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction({
        wallet_id: walletId,
        category_id: categoryId,
        type,
        amount: numericAmount,
        description: description.trim() || (type === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'),
      });

      // Reset form
      setAmountRaw('');
      setDescription('');
      onClose();
    } catch (err) {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan transaksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header Bar */}
          <View style={styles.header}>
            <Text style={styles.title}>⚡ Catat Cepat Kas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* TYPE TOGGLE (Pill Switch) */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeTab,
                  type === 'EXPENSE' && styles.typeTabActiveExpense,
                ]}
                onPress={() => handleTypeChange('EXPENSE')}
              >
                <Text
                  style={[
                    styles.typeTabText,
                    type === 'EXPENSE' && styles.typeTabTextActive,
                  ]}
                >
                  ↓ Pengeluaran
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeTab,
                  type === 'INCOME' && styles.typeTabActiveIncome,
                ]}
                onPress={() => handleTypeChange('INCOME')}
              >
                <Text
                  style={[
                    styles.typeTabText,
                    type === 'INCOME' && styles.typeTabTextActive,
                  ]}
                >
                  ↑ Pemasukan
                </Text>
              </TouchableOpacity>
            </View>

            {/* AMOUNT DISPLAY & INPUT */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>NOMINAL (RP)</Text>
              <Text
                style={[
                  styles.amountFormatted,
                  type === 'EXPENSE' ? { color: Colors.expense } : { color: Colors.income },
                ]}
              >
                {numericAmount > 0 ? formatRupiah(numericAmount) : 'Rp 0'}
              </Text>
              <Input
                placeholder="Ketik angka (cth: 25000)"
                keyboardType="numeric"
                value={amountRaw}
                onChangeText={setAmountRaw}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>

            {/* WALLET SELECTOR CHIPS */}
            <Text style={styles.sectionLabel}>PILIH DOMPET</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
              {wallets.map((w) => {
                const isSelected = (selectedWalletId || wallets[0]?.id) === w.id;
                return (
                  <TouchableOpacity
                    key={w.id}
                    style={[styles.walletChip, isSelected && styles.walletChipSelected]}
                    onPress={() => setSelectedWalletId(w.id)}
                  >
                    <Text style={styles.chipIcon}>{w.icon}</Text>
                    <View>
                      <Text
                        style={[styles.chipTitle, isSelected && styles.chipTitleSelected]}
                      >
                        {w.name}
                      </Text>
                      <Text style={styles.chipBalance}>{formatRupiah(w.balance)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* CATEGORY SELECTOR */}
            <Text style={styles.sectionLabel}>KATEGORI</Text>
            <View style={styles.categoryGrid}>
              {availableCategories.map((cat) => {
                const isSelected =
                  (selectedCategoryId || availableCategories[0]?.id) === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catChip, isSelected && styles.catChipSelected]}
                    onPress={() => setSelectedCategoryId(cat.id)}
                  >
                    <Text style={styles.catIcon}>{cat.icon}</Text>
                    <Text
                      style={[styles.catName, isSelected && styles.catNameSelected]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* DESCRIPTION INPUT */}
            <Input
              label="Catatan / Keterangan (Opsional)"
              placeholder="Cth: Beli Nasi Padang Siang"
              value={description}
              onChangeText={setDescription}
            />

            {/* SUBMIT BUTTON */}
            <Button
              title={isSubmitting ? 'Menyimpan...' : `Simpan ${type === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}`}
              variant={type === 'EXPENSE' ? 'danger' : 'primary'}
              size="lg"
              loading={isSubmitting}
              onPress={handleSubmit}
              style={{ marginTop: Spacing.md }}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
    paddingBottom: Spacing.xxl,
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  title: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: Colors.foregroundMuted,
    fontWeight: Typography.weights.bold,
  },
  scrollBody: {
    padding: Spacing.xl,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.cardSecondary,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  typeTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  typeTabActiveExpense: {
    backgroundColor: Colors.expense,
  },
  typeTabActiveIncome: {
    backgroundColor: Colors.primary,
  },
  typeTabText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.foregroundMuted,
  },
  typeTabTextActive: {
    color: '#FFFFFF',
  },
  amountBox: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  amountLabel: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: Colors.foregroundMuted,
    letterSpacing: 0.5,
  },
  amountFormatted: {
    fontSize: 32,
    fontWeight: Typography.weights.bold,
    marginVertical: Spacing.xs,
  },
  sectionLabel: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: Colors.foregroundMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  walletChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  chipIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  chipTitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  chipTitleSelected: {
    color: Colors.primary,
  },
  chipBalance: {
    fontSize: Typography.sizes.micro,
    color: Colors.foregroundMuted,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  catChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  catIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  catName: {
    fontSize: Typography.sizes.caption,
    color: Colors.foreground,
    fontWeight: Typography.weights.medium,
  },
  catNameSelected: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
