// ============================================================================
// COMMUNITY SCREEN (IN-APP WHATSAPP-STYLE ADMIN & SPOKES)
// File: src/screens/community/CommunityScreen.tsx
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
  Linking,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme/tokens';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatRupiah } from '../../utils/formatCurrency';
import {
  generateWhatsAppLink,
  getFriendlyDuesReminderText,
  getArisanWinnerBroadcastText,
} from '../../utils/deepLinkHelper';

export const CommunityScreen: React.FC = () => {
  const [communalBalance, setCommunalBalance] = useState(4250000);
  const [arisanModalVisible, setArisanModalVisible] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);

  // Pending transfer slips waiting for treasurer review
  const [pendingReviews, setPendingReviews] = useState([
    { id: 'rev_1', name: 'Budi Santoso', amount: 50000, note: 'Iuran Sampah & Keamanan Okt' },
    { id: 'rev_2', name: 'Ibu Siti Rahma', amount: 50000, note: 'Iuran Sampah & Keamanan Okt' },
  ]);

  // Residents list
  const [residents, setResidents] = useState([
    { id: 'w_1', name: 'Pak Ahmad (Blok A/1)', status: 'PAID', phone: '081234567801' },
    { id: 'w_2', name: 'Mas Joko (Blok C/8)', status: 'UNPAID', phone: '081234567802' },
    { id: 'w_3', name: 'Bu Hendra (Blok B/3)', status: 'PAID', phone: '081234567803' },
    { id: 'w_4', name: 'Pak RT Bambang (Blok A/0)', status: 'PAID', phone: '081234567804' },
    { id: 'w_5', name: 'Mbak Dewi (Blok D/12)', status: 'UNPAID', phone: '081234567805' },
  ]);

  // Handle Approve Payment Slip
  const handleApprovePayment = (id: string, name: string, amount: number) => {
    Alert.alert(
      'Persetujuan Iuran',
      `Setujui bukti transfer ${formatRupiah(amount)} dari ${name}?\n\nSaldo Kas RT akan bertambah otomatis.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Setujui (Approve)',
          onPress: () => {
            setPendingReviews((prev) => prev.filter((item) => item.id !== id));
            setCommunalBalance((prev) => prev + amount);
            Alert.alert('Sukses!', `Pembayaran ${name} telah diverifikasi dan masuk kas bersama RT.`);
          },
        },
      ]
    );
  };

  // Kocok Arisan Logic
  const handleDrawArisan = () => {
    setIsDrawing(true);
    setWinnerName(null);

    const candidates = [
      'Ibu Siti (Slot #02)',
      'Pak Ahmad (Slot #07)',
      'Mbak Linda (Slot #11)',
      'Bu Hendra (Slot #05)',
      'Mas Joko (Slot #09)',
    ];

    setTimeout(() => {
      const winner = candidates[Math.floor(Math.random() * candidates.length)];
      setWinnerName(winner);
      setIsDrawing(false);
    }, 1800);
  };

  // WhatsApp Nudge for unpaid member
  const handleColekWa = (name: string, phone: string) => {
    const text = getFriendlyDuesReminderText(
      name,
      'RT 05 Sukamaju',
      'Oktober 2026',
      50000,
      'https://kaskita.id/pay/rt05-oktober'
    );
    const waLink = generateWhatsAppLink(phone, text);

    Alert.alert(
      'Colek Pembayaran via WhatsApp',
      `Buka template pesan sopan ke ${name}?\n\nPesan: "${text}"`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Kirim WhatsApp',
          onPress: () => {
            Linking.canOpenURL(waLink).then((supported) => {
              if (supported) {
                Linking.openURL(waLink);
              } else {
                Alert.alert('Info', 'Tautan WhatsApp disiapkan:\n\n' + waLink);
              }
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Komunitas & Paguyuban</Text>
        <Text style={styles.subtitle}>
          Pengelolaan Iuran RT & Arisan langsung dari ponsel (In-App Admin)
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. GROUP ADMIN CARD (RT 05 Sukamaju) */}
        <Card variant="elevated" style={styles.groupCard}>
          <View style={styles.groupCardTop}>
            <View>
              <Text style={styles.groupName}>RT 05 Sukamaju</Text>
              <Text style={styles.groupMembers}>48 Kepala Keluarga Terdaftar</Text>
            </View>
            <Badge label="ANDA BENDAHARA" variant="warning" />
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo Kas Bersama RT:</Text>
            <Text style={styles.balanceValue}>{formatRupiah(communalBalance)}</Text>
          </View>

          {/* WHATSAPP STYLE ADMIN TOOLBAR */}
          <View style={styles.adminToolbar}>
            <TouchableOpacity
              style={styles.adminActionBtn}
              onPress={() =>
                Alert.alert(
                  'Tautan Tagihan Web Instan (Zero-Install)',
                  'Tautan: https://kaskita.id/pay/rt05-oktober\n\nTautan ini siap dibagikan ke grup WhatsApp warga agar warga bisa bayar langsung via QRIS/Transfer tanpa harus install aplikasi!',
                  [{ text: 'Salin Tautan' }, { text: 'Tutup' }]
                )
              }
            >
              <Text style={styles.adminActionIcon}>🔗</Text>
              <Text style={styles.adminActionLabel}>Tautan WA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.adminActionBtn}
              onPress={() =>
                Alert.alert(
                  'Terbitkan Tagihan Massal',
                  'Terbitkan tagihan periode Oktober 2026 (@ Rp 50.000) ke 48 warga?',
                  [
                    { text: 'Batal', style: 'cancel' },
                    {
                      text: 'Terbitkan',
                      onPress: () =>
                        Alert.alert('Sukses', '48 Tagihan berhasil diterbitkan & status diperbarui!'),
                    },
                  ]
                )
              }
            >
              <Text style={styles.adminActionIcon}>📝</Text>
              <Text style={styles.adminActionLabel}>Buat Tagihan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.adminActionBtn, { backgroundColor: '#FEF3C7' }]}
              onPress={() => setArisanModalVisible(true)}
            >
              <Text style={styles.adminActionIcon}>🎲</Text>
              <Text style={[styles.adminActionLabel, { color: '#B45309' }]}>Kocok Arisan</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 3. PENDING REVIEW BANNER */}
        {pendingReviews.length > 0 && (
          <View style={styles.reviewBanner}>
            <View style={styles.reviewBannerHeader}>
              <Text style={styles.reviewBannerTitle}>
                ⚠️ {pendingReviews.length} Bukti Transfer Menunggu Verifikasi
              </Text>
            </View>

            {pendingReviews.map((item) => (
              <View key={item.id} style={styles.reviewItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewItemName}>{item.name}</Text>
                  <Text style={styles.reviewItemNote}>
                    {formatRupiah(item.amount)} • {item.note}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApprovePayment(item.id, item.name, item.amount)}
                >
                  <Text style={styles.approveBtnText}>Setujui</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 4. RESIDENTS STATUS LIST */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Status Warga Bulan Ini</Text>
          <Text style={styles.sectionLink}>Lihat 48 Warga</Text>
        </View>

        <Card variant="elevated" style={styles.residentsCard}>
          {residents.map((r, idx) => {
            const isLast = idx === residents.length - 1;
            return (
              <View key={r.id}>
                <View style={styles.residentRow}>
                  <View>
                    <Text style={styles.residentName}>{r.name}</Text>
                    <Text style={styles.residentPhone}>{r.phone}</Text>
                  </View>
                  {r.status === 'PAID' ? (
                    <Badge label="Lunas Rp 50.000" variant="success" />
                  ) : (
                    <TouchableOpacity
                      style={styles.nudgeBtn}
                      onPress={() => handleColekWa(r.name, r.phone)}
                    >
                      <Text style={styles.nudgeBtnText}>📲 Colek via WA</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {!isLast && <View style={styles.divider} />}
              </View>
            );
          })}
        </Card>
      </ScrollView>

      {/* ARISAN DIGITAL DRAW MODAL */}
      <Modal visible={arisanModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderTitle}>🎲 Kocokan Arisan Digital</Text>
            <Text style={styles.modalSubtitle}>Total Tarikan: Rp 1.500.000 (15 Anggota)</Text>

            <View style={styles.lotteryBox}>
              {isDrawing ? (
                <Text style={styles.drawingText}>🔄 Mengacak nama peserta...</Text>
              ) : winnerName ? (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40 }}>🎉</Text>
                  <Text style={styles.winnerText}>SELAMAT KEPADA:</Text>
                  <Text style={styles.winnerNameText}>{winnerName}</Text>
                </View>
              ) : (
                <Text style={styles.idleText}>
                  Tekan tombol di bawah untuk mengundi pemenang secara acak dan adil.
                </Text>
              )}
            </View>

            <Button
              title={isDrawing ? 'Sedang Mengocok...' : 'Kocok Sekarang!'}
              variant="secondary"
              size="lg"
              loading={isDrawing}
              onPress={handleDrawArisan}
              style={{ marginBottom: Spacing.md }}
            />

            {winnerName && (
              <Button
                title="📲 Bagikan Pemenang ke Grup WA"
                variant="primary"
                size="md"
                onPress={() => {
                  const broadcast = getArisanWinnerBroadcastText(
                    'Arisan RT 05 Sukamaju',
                    4,
                    winnerName,
                    1500000
                  );
                  Alert.alert(
                    'Siap Dibagikan ke Grup WA',
                    broadcast,
                    [
                      {
                        text: 'Salin & Buka WA',
                        onPress: () => {
                          const link = generateWhatsAppLink('', broadcast);
                          Linking.openURL(link).catch(() => {});
                          setArisanModalVisible(false);
                        },
                      },
                      { text: 'Tutup', onPress: () => setArisanModalVisible(false) },
                    ]
                  );
                }}
                style={{ marginBottom: Spacing.md }}
              />
            )}

            <Button
              title="Tutup"
              variant="outline"
              size="md"
              onPress={() => setArisanModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 110,
  },
  groupCard: {
    marginBottom: Spacing.lg,
    backgroundColor: '#0F172A',
  },
  groupCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  groupName: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  groupMembers: {
    fontSize: Typography.sizes.caption,
    color: '#94A3B8',
    marginTop: 2,
  },
  balanceContainer: {
    marginVertical: Spacing.lg,
  },
  balanceLabel: {
    fontSize: Typography.sizes.caption,
    color: '#94A3B8',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: Typography.weights.bold,
    color: '#34D399',
    marginTop: 2,
  },
  adminToolbar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: Spacing.md,
  },
  adminActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  adminActionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  adminActionLabel: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: '#F8FAFC',
  },
  reviewBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#FCD34D',
    marginBottom: Spacing.lg,
  },
  reviewBannerHeader: {
    marginBottom: Spacing.sm,
  },
  reviewBannerTitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: '#92400E',
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  reviewItemName: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  reviewItemNote: {
    fontSize: Typography.sizes.micro,
    color: Colors.foregroundMuted,
  },
  approveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
  },
  sectionLink: {
    fontSize: Typography.sizes.caption,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  residentsCard: {
    padding: 0,
    marginBottom: Spacing.lg,
  },
  residentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  residentName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.foreground,
  },
  residentPhone: {
    fontSize: Typography.sizes.micro,
    color: Colors.foregroundMuted,
    marginTop: 2,
  },
  nudgeBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  nudgeBtnText: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
    color: '#B45309',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  modalHeaderTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  lotteryBox: {
    backgroundColor: Colors.cardSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    marginBottom: Spacing.xl,
  },
  drawingText: {
    fontSize: Typography.sizes.body,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  idleText: {
    fontSize: Typography.sizes.caption,
    color: Colors.foregroundMuted,
    textAlign: 'center',
  },
  winnerText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.secondary,
    letterSpacing: 1,
    marginTop: 4,
  },
  winnerNameText: {
    fontSize: 22,
    fontWeight: Typography.weights.bold,
    color: Colors.foreground,
    marginTop: 2,
  },
});
