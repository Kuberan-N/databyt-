import React from "react";
import {
  Document, Page, Text, View, StyleSheet, Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff", fontWeight: 700 },
  ],
});

const colors = {
  primary:  "#6366f1",
  success:  "#22c55e",
  warning:  "#facc15",
  danger:   "#ef4444",
  bg:       "#0f172a",
  surface:  "#0F172A",
  text:     "#f1f5f9",
  muted:    "#333333",
  border:   "#111111",
};

const s = StyleSheet.create({
  page:        { backgroundColor: colors.bg, padding: 40, fontFamily: "Inter", color: colors.text },
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  logoBox:     { width: 36, height: 36, backgroundColor: colors.primary, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  logoText:    { color: "white", fontWeight: 700, fontSize: 14 },
  orgName:     { fontSize: 10, color: colors.muted, marginTop: 4 },
  reportTitle: { fontSize: 10, color: colors.muted, textAlign: "right" },
  reportDate:  { fontSize: 18, fontWeight: 700, color: colors.text, textAlign: "right" },
  section:     { marginBottom: 24 },
  sectionTitle:{ fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  metricsGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  metricCard:  { flex: 1, backgroundColor: colors.surface, borderRadius: 10, padding: 14, border: `1px solid ${colors.border}` },
  metricValue: { fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 2 },
  metricLabel: { fontSize: 9, color: colors.muted },
  metricSub:   { fontSize: 9, color: colors.muted, marginTop: 2 },
  table:       { borderRadius: 10, overflow: "hidden", border: `1px solid ${colors.border}` },
  tableHeader: { flexDirection: "row", backgroundColor: colors.surface, padding: "10 12", borderBottom: `1px solid ${colors.border}` },
  tableRow:    { flexDirection: "row", padding: "9 12", borderBottom: `1px solid ${colors.border}` },
  tableRowAlt: { flexDirection: "row", padding: "9 12", borderBottom: `1px solid ${colors.border}`, backgroundColor: "#0f1a2b" },
  thText:      { fontSize: 9, color: colors.muted, fontWeight: 700, textTransform: "uppercase" },
  tdText:      { fontSize: 10, color: colors.text },
  tdMuted:     { fontSize: 10, color: colors.muted },
  col1:        { flex: 2 },
  col2:        { flex: 1, textAlign: "right" },
  col3:        { flex: 1, textAlign: "right" },
  col4:        { flex: 1, textAlign: "right" },
  bucketBar:   { marginBottom: 10 },
  barLabel:    { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  barTrack:    { height: 8, backgroundColor: colors.surface, borderRadius: 4, overflow: "hidden" },
  barFill:     { height: 8, borderRadius: 4 },
  footer:      { position: "absolute", bottom: 30, left: 40, right: 40, borderTop: `1px solid ${colors.border}`, paddingTop: 12, flexDirection: "row", justifyContent: "space-between" },
  footerText:  { fontSize: 8, color: colors.muted },
  badge:       { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, fontSize: 8, fontWeight: 700 },
});

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export interface ReportData {
  orgName: string;
  generatedAt: string;
  totalOutstanding: number;
  dso: number;
  collectedThisMonth: number;
  collectedLastMonth: number;
  overdueCount: number;
  overdueAmount: number;
  customerCount: number;
  agingBuckets: Array<{ label: string; amount: number; count: number; color: string }>;
  topOverdue: Array<{ name: string; totalOwed: number; maxDaysOverdue: number; invoiceCount: number; segment: string }>;
  recentCollected: Array<{ customerName: string; amount: number; date: string }>;
}

const BUCKET_COLORS: Record<string, string> = {
  "Current":    "#22c55e",
  "1â€“30 days":  "#facc15",
  "31â€“60 days": "#f97316",
  "61â€“90 days": "#ef4444",
  "90+ days":   "#991b1b",
};

export function CFOReport({ data }: { data: ReportData }) {
  const totalAR = data.totalOutstanding || 1;
  const collectionTrend = data.collectedLastMonth > 0
    ? Math.round(((data.collectedThisMonth - data.collectedLastMonth) / data.collectedLastMonth) * 100)
    : 0;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <View style={s.logoBox}><Text style={s.logoText}>D</Text></View>
            <Text style={s.orgName}>{data.orgName}</Text>
          </View>
          <View>
            <Text style={s.reportTitle}>AR Collections Report</Text>
            <Text style={s.reportDate}>{data.generatedAt}</Text>
          </View>
        </View>

        {/* Metric cards */}
        <Text style={s.sectionTitle}>Executive Summary</Text>
        <View style={s.metricsGrid}>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>{fmt(data.totalOutstanding)}</Text>
            <Text style={s.metricLabel}>Total AR Outstanding</Text>
            <Text style={s.metricSub}>{data.customerCount} customers</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>{data.dso} days</Text>
            <Text style={s.metricLabel}>Days Sales Outstanding</Text>
            <Text style={{ ...s.metricSub, color: data.dso > 45 ? colors.danger : colors.success }}>
              {data.dso > 45 ? "Above 45d target" : "Within target"}
            </Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>{fmt(data.collectedThisMonth)}</Text>
            <Text style={s.metricLabel}>Collected This Month</Text>
            <Text style={{ ...s.metricSub, color: collectionTrend >= 0 ? colors.success : colors.danger }}>
              {collectionTrend >= 0 ? "+" : ""}{collectionTrend}% vs last month
            </Text>
          </View>
          <View style={s.metricCard}>
            <Text style={{ ...s.metricValue, color: colors.danger }}>{data.overdueCount}</Text>
            <Text style={s.metricLabel}>Overdue Invoices</Text>
            <Text style={s.metricSub}>{fmt(data.overdueAmount)} at risk</Text>
          </View>
        </View>

        {/* Aging buckets */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>AR Aging Breakdown</Text>
          {data.agingBuckets.map(b => {
            const pct = (b.amount / totalAR) * 100;
            const barColor = BUCKET_COLORS[b.label] ?? colors.primary;
            return (
              <View key={b.label} style={s.bucketBar}>
                <View style={s.barLabel}>
                  <Text style={{ fontSize: 10, color: colors.text }}>{b.label}</Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>{fmt(b.amount)} Â· {b.count} inv</Text>
                </View>
                <View style={s.barTrack}>
                  <View style={[s.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Top overdue customers */}
        {data.topOverdue.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Top Overdue Customers</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.thText, s.col1]}>Customer</Text>
                <Text style={[s.thText, s.col2]}>Amount Owed</Text>
                <Text style={[s.thText, s.col3]}>Days Overdue</Text>
                <Text style={[s.thText, s.col4]}>Invoices</Text>
              </View>
              {data.topOverdue.slice(0, 8).map((c, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tdText, s.col1]}>{c.name}</Text>
                  <Text style={[s.tdText, s.col2]}>{fmt(c.totalOwed)}</Text>
                  <Text style={[{ ...s.tdText, color: c.maxDaysOverdue > 60 ? colors.danger : colors.warning }, s.col3]}>
                    {c.maxDaysOverdue}d
                  </Text>
                  <Text style={[s.tdMuted, s.col4]}>{c.invoiceCount}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>DataByt AR Collections Â· Confidential</Text>
          <Text style={s.footerText}>{data.orgName} Â· Generated {data.generatedAt}</Text>
        </View>
      </Page>
    </Document>
  );
}
