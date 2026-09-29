// ============================================================================
// ADD WALLET MODAL
// File: src/components/wallet/AddWalletModal.tsx
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
import { WalletType } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatRupiah } from '../../utils/formatCurrency';

interface AddWalletModalProps {
  visible: boolean;
  onClose: () => void;
}

const PRESET_ICONS = ['🏦', '📱', '💵', '💳', '🪙', '💰', '💼'];

export const AddWalletModal: React.FC<AddWalletModalProps> = ({ visible, onClose }) => {
  const { addWallet } = useApp();

  const [name, setName] = useState('');
  const [walletType, setWalletType] = useState<WalletType>('BANK');
  const [selectedIcon, setSelectedIcon] = useState('🏦');
  const [balanceRaw, setBalanceRaw] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericBalance = parseInt(balanceRaw.replace(/\D/g, ''), 10) || 0;

  const handleTypeSelect = (type: WalletType) => {
    setWalletType(type);
    if (type === 'BANK') setSelectedIcon('🏦');
    if (type === 'EWALLET') setSelectedIcon('📱');
    if (type === 'CASH') setSelectedIcon('💵');
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Perhatian', 'Mohon masukkan nama dompet/rekening.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addWallet({
        name: name.trim(),
        wallet_type: walletType,
        balance: numericBalance,
        icon: selectedIcon,
      });

      // Reset
      setName('');
      setBalanceRaw('');
      onClose();
      Alert.alert('Berhasil', `Dompet "${name}" berhasil ditambahkan.`);
    } catch (err) {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menambahkan dompet.');
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>➕ Tambah Dompet Baru</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Wallet Type */}
            <Text style={styles.label}>TIPE DOMPET</Text>
            <View style={styles.typeRow}>
              {(['BANK', 'EWALLET', 'CASH'] as WalletType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeBtn, walletType === t && styles.typeBtnSelected]}
                  onPress={() => handleTypeSelect(t)}
                >
                  <Text
                    style={[styles.typeBtnText, walletType === t && styles.typeBtnTextSelected]}
                  >
                    {t === 'BANK' ? '🏦 Bank' : t === 'EWALLET' ? '📱 E-Wallet' : '💵 Tunai'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Wallet Name */}
            <Input
              label="Nama Dompet / Rekening"
              placeholder="Cth: Bank Mandiri, ShopeePay, Kas Harian"
              value={name}
              onChangeText={setName}
            />

            {/* Initial Balance */}
            <Text style={styles.label}>SALDO AWAL (RP)</Text>
            <Text style={styles.balancePreview}>{formatRupiah(numericBalance)}</Text>
            <Input
              placeholder="0 (atau ketik nominal saldo awal)"
              keyboardType="numeric"
              value={balanceRaw}
              onChangeText={setBalanceRaw}
            />

            {/* Icon Picker */}
            <Text style={styles.label}>PILIH IKON</Text>
            <View style={styles.iconRow}>
              {PRESET_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconChip, selectedIcon === icon && styles.iconChipSelected]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={{ fontSize: 24 }}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit */}
            <Button
              title={isSubmitting ? 'Menyimpan...' : 'Simpan Dompet'}
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
    maxHeight: '85%',
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
  label: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.foregroundMuted,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  typeBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  typeBtnText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.foregroundMuted,
  },
  typeBtnTextSelected: {
    color: Colors.primary,
  },
  balancePreview: {
    fontSize: 24,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  iconRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
});
