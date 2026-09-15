// ============================================================================
// ZERO DOUBLE-ENTRY: DIRECT PAY OBLIGATION MODAL
// File: src/components/wallet/PayObligationModal.tsx
// ============================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../../theme/tokens';
import { SocialObligation } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { formatRupiah } from '../../utils/formatCurrency';

interface PayObligationModalProps {
  obligation: SocialObligation | null;
  visible: boolean;
  onClose: () => void;
}

export const PayObligationModal: React.FC<PayObligationModalProps> = ({
  obligation,
  visible,
  onClose,
}) => {
  const { wallets, payObligation } = useApp();
  const [selectedWalletId, setSelectedWalletId] = useState<string>(
    wallets[0]?.id || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (!obligation) return null;

  const currentWallet =
    wallets.find((w) => w.id === (selectedWalletId || wallets[0]?.id)) ||
    wallets[0];

  const handleConfirmPay = async () => {
    if (!currentWallet) {
      Alert.alert('Perhatian', 'Pilih dompet sumber pembayaran.');
      return;
    }

    if (currentWallet.balance < obligation.amount) {
      Alert.alert(
        'Saldo Tidak Cukup',
        `Saldo di ${currentWallet.name} (${formatRupiah(currentWallet.balance)}) tidak mencukupi tagihan ${formatRupiah(obligation.amount)}. Pilih dompet lain.`
      );
      return;
    }

    setIsProcessing(true);
    try {
      const success = await payObligation(obligation.id, currentWallet.id);
      if (success) {
        Alert.alert(
          '🎉 Pembayaran Berhasil & Tersinkron!',
          `Tagihan ${obligation.title} telah lunas.\n\n` +
          `• Saldo ${currentWallet.name} terpotong ${formatRupiah(obligation.amount)}\n` +
          `• Transaksi pengeluaran otomatis tercatat di kas pribadi tanpa catat ganda!`
        );
        onClose();
      } else {
        Alert.alert('Gagal', 'Kewajiban ini sudah lunas atau tidak ditemukan.');
      }
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan sistem saat memproses pembayaran.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>⚡ Bayar & Catat Otomatis</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View style={styles.content}>
            <View style={styles.tagihanCard}>
              <Text style={styles.tagihanGroup}>{obligation.group_name}</Text>
              <Text style={styles.tagihanTitle}>{obligation.title}</Text>
              <Text style={styles.tagihanAmount}>{formatRupiah(obligation.amount)}</Text>
              <Text style={styles.tagihanDue}>Jatuh Tempo: {obligation.due_date}</Text>
            </View>

            {/* Zero Double-Entry Value Prop Banner */}
            <View style={styles.syncBanner}>
              <Text style={styles.syncIcon}>🔄</Text>
              <Text style={styles.syncText}>
                <Text style={{ fontWeight: 'bold' }}>Zero Double-Entry Engine:</Text> Sekali bayar, status tagihan lunas dan mutasi pengeluaran langsung masuk pembukuan pribadi.
              </Text>
            </View>

            {/* Wallet Selector */}
            <Text style={styles.sectionLabel}>POTONG DARI DOMPET:</Text>
            <View style={styles.walletList}>
              {wallets.map((w) => {
                const isSelected = (currentWallet?.id === w.id);
                return (
                  <TouchableOpacity
                    key={w.id}
                    style={[styles.walletItem, isSelected && styles.walletItemSelected]}
                    onPress={() => setSelectedWalletId(w.id)}
                  >
                    <View style={styles.walletLeft}>
                      <Text style={styles.walletIcon}>{w.icon}</Text>
                      <View>
                        <Text style={[styles.walletName, isSelected && styles.walletNameSelected]}>
                          {w.name}
                        </Text>
                        <Text style={styles.walletBalance}>
                          Saldo: {formatRupiah(w.balance)}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Buttons */}
            <Button
              title={isProcessing ? 'Memproses...' : `Bayar ${formatRupiah(obligation.amount)}`}
              size="lg"
              loading={isProcessing}
              onPress={handleConfirmPay}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
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
  },
  headerTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: Colors.foregroundMuted,
    fontWeight: Typography.weights.bold,
  },
  content: {
    padding: Spacing.xl,
  },
  tagihanCard: {
    backgroundColor: Colors.primaryLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
  },
  tagihanGroup: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryHover,
  },
  tagihanTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
    marginVertical: Spacing.xs,
    textAlign: 'center',
  },
  tagihanAmount: {
    fontSize: 28,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  tagihanDue: {
    fontSize: Typography.sizes.micro,
    color: Colors.foregroundMuted,
    marginTop: 4,
  },
  syncBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
  },
  syncIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  syncText: {
    flex: 1,
    fontSize: Typography.sizes.caption,
    color: '#1E40AF',
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: Colors.foregroundMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  walletList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  walletItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  walletName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.foreground,
  },
  walletNameSelected: {
    color: Colors.primary,
  },
  walletBalance: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  radioCircleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
});
