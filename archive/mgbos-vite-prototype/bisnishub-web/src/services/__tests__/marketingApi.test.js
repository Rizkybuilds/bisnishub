import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getContentPlans, 
  saveContentPlan, 
  deleteContentPlan, 
  updatePlanStatus, 
  resetDefaultContentPlans, 
  calculateMarketingKpis, 
  exportContentCalendarCsv, 
  PILLARS_4E, 
  SWIPE_FILES, 
  CHANNELS_CONFIG 
} from '../marketingApi.js';

describe('Marketing & Content Strategy API Services', () => {
  beforeEach(() => {
    resetDefaultContentPlans();
  });

  describe('Pillars & Swipe Files Verification', () => {
    it('should configure 4E content pillars framework with proper target percentages', () => {
      expect(PILLARS_4E.entertain.targetPercent).toBe(30);
      expect(PILLARS_4E.educate.targetPercent).toBe(30);
      expect(PILLARS_4E.emotion.targetPercent).toBe(25);
      expect(PILLARS_4E.promote.targetPercent).toBe(15);
    });

    it('should have curated high-converting swipe files', () => {
      expect(SWIPE_FILES.length).toBeGreaterThanOrEqual(5);
      const hook = SWIPE_FILES.find(s => s.category === 'video_hook');
      expect(hook).toBeDefined();
      expect(hook.text).toContain('NSA Heavyweight 24s');

      const objection = SWIPE_FILES.find(s => s.category === 'objection');
      expect(objection).toBeDefined();
      expect(objection.text).toContain('180-190 gsm');
    });

    it('should support social channels (TikTok, Instagram, WhatsApp)', () => {
      expect(CHANNELS_CONFIG.tiktok).toBeDefined();
      expect(CHANNELS_CONFIG.instagram).toBeDefined();
      expect(CHANNELS_CONFIG.whatsapp).toBeDefined();
    });
  });

  describe('getContentPlans & Defaults', () => {
    it('should return initial content plans containing 4E framework', () => {
      const plans = getContentPlans();
      expect(plans.length).toBeGreaterThanOrEqual(4);
      
      const bts = plans.find(p => p.id === 'cnt-01');
      expect(bts).toBeDefined();
      expect(bts.channel).toBe('tiktok');
      expect(bts.pillar).toBe('emotion');
    });
  });

  describe('saveContentPlan & deleteContentPlan', () => {
    it('should add a new content plan to the calendar', () => {
      const newPlan = {
        title: 'Video Edukasi: Cara Merawat Sablon DTF Biar Awet 5 Tahun',
        channel: 'tiktok',
        pillar: 'educate',
        targetDate: '2026-09-25',
        hookCopy: '"Jangan pernah cuci kaos sablon kamu kayak gini..."',
        caption: 'Tips cuci inside-out dan hindari pemutih. Link bio untuk belanja! #teestock',
        seoKeywords: 'cara mencuci kaos sablon, perawatan dtf'
      };

      const updated = saveContentPlan(newPlan);
      expect(updated.length).toBeGreaterThan(4);
      
      const saved = updated.find(p => p.title === 'Video Edukasi: Cara Merawat Sablon DTF Biar Awet 5 Tahun');
      expect(saved).toBeDefined();
      expect(saved.pillar).toBe('educate');
      expect(saved.status).toBe('draft');
    });

    it('should update existing content plan if id matches', () => {
      const existing = getContentPlans()[0];
      const updated = saveContentPlan({
        ...existing,
        title: 'Updated Title: BTS Heat Press Teflon',
        status: 'published'
      });

      const found = updated.find(p => p.id === existing.id);
      expect(found.title).toBe('Updated Title: BTS Heat Press Teflon');
      expect(found.status).toBe('published');
    });

    it('should delete a content plan by id', () => {
      const initialCount = getContentPlans().length;
      const updated = deleteContentPlan('cnt-04');
      expect(updated.length).toBe(initialCount - 1);
      expect(updated.some(p => p.id === 'cnt-04')).toBe(false);
    });
  });

  describe('updatePlanStatus', () => {
    it('should advance status from draft to ready or published', () => {
      const updated = updatePlanStatus('cnt-02', 'ready');
      const plan = updated.find(p => p.id === 'cnt-02');
      expect(plan.status).toBe('ready');

      const published = updatePlanStatus('cnt-02', 'published');
      const planPublished = published.find(p => p.id === 'cnt-02');
      expect(planPublished.status).toBe('published');
    });
  });

  describe('calculateMarketingKpis', () => {
    it('should calculate accurate 4E pillar distribution and status breakdown', () => {
      const samplePlans = [
        { pillar: 'entertain', status: 'published', channel: 'tiktok' },
        { pillar: 'educate', status: 'ready', channel: 'tiktok' },
        { pillar: 'emotion', status: 'draft', channel: 'instagram' },
        { pillar: 'promote', status: 'draft', channel: 'whatsapp' }
      ];

      const kpis = calculateMarketingKpis(samplePlans);
      expect(kpis.totalPlans).toBe(4);
      expect(kpis.publishedCount).toBe(1);
      expect(kpis.readyCount).toBe(1);
      expect(kpis.draftCount).toBe(2);
      expect(kpis.pillarPercentages.entertain).toBe(25);
      expect(kpis.pillarPercentages.educate).toBe(25);
      expect(kpis.channelCounts.tiktok).toBe(2);
      expect(kpis.swipeFileCount).toBeGreaterThanOrEqual(5);
    });
  });

  describe('exportContentCalendarCsv', () => {
    it('should generate CSV with UTF-8 BOM and correct headers', () => {
      const plans = getContentPlans();
      const csv = exportContentCalendarCsv(plans);
      expect(csv).toBeDefined();
      expect(csv.startsWith('\uFEFF')).toBe(true);
      expect(csv).toContain('ID Konten');
      expect(csv).toContain('Pilar Konten 4E');
      expect(csv).toContain('BTS Heat Press');
    });
  });
});
