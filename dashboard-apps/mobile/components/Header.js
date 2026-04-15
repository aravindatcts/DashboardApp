/**
 * Header.js — Mobile-native header
 *
 * Layout:
 *  ┌─────────────────────────────────────┐
 *  │ ☰  FictiousHealth     🔔  👤        │  ← compact top bar
 *  └─────────────────────────────────────┘
 *
 * Hamburger  → full-screen slide-in drawer with:
 *   - Nav items (Plans, Providers, Claims, Health, Prescriptions)
 *   - Language switcher
 *   - Account menu (Member Info, Preferences, …)
 *
 * Bell icon → notification bottom-sheet
 */
import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity,
    Modal, ScrollView, SafeAreaView, Dimensions,
    Platform, StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_H } = Dimensions.get('window');

const NOTIFICATIONS = [
    { id: 1, icon: '📄', text: 'CLM001 for General Hospital is processed.', time: '2h ago', unread: true },
    { id: 2, icon: '🆔', text: 'Your new physical ID card has been shipped.', time: '1d ago', unread: true },
    { id: 3, icon: '✅', text: 'Prior Auth for Radiology (MRT) approved.', time: '2d ago', unread: false },
    { id: 4, icon: '❤️', text: 'Reminder: Annual preventive check-up due.', time: '3d ago', unread: false },
];

const NAV_SECTIONS = [
    {
        title: 'Plans',
        items: [
            { label: 'My Plans', screen: 'MyPlans' },
            { label: 'Deductible & Out-of-Pocket Tracker' },
        ],
    },
    {
        title: 'Find a Provider',
        items: [{ label: 'Search Provider', screen: 'SearchPcp' }],
    },
    {
        title: 'Claims',
        items: [
            { label: 'Search a Claim', screen: 'Claims' },
            { label: 'Submit a Claim' },
        ],
    },
    {
        title: 'Health & Wellbeing',
        items: [
            { label: 'Prior Authorizations' },
            { label: 'Health Actions Card' },
        ],
    },
    {
        title: 'Prescriptions',
        items: [{ label: 'Coming soon' }],
    },
];

const ACCOUNT_ITEMS = [
    { label: 'Member Information', screen: 'MemberInformation' },
    { label: 'Access Permission', screen: 'AccessPermission' },
    { label: 'Preferences', screen: 'Preferences' },
    { label: 'Security Details', screen: 'SecurityDetails' },
];

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'ta', label: 'தமிழ்' },
];

export default function Header() {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();

    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const [showAccount, setShowAccount] = useState(false);
    const [showLang, setShowLang] = useState(false);

    const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

    const navigate = (screen) => {
        setMenuOpen(false);
        setNotifOpen(false);
        if (screen) navigation.navigate(screen);
    };

    const toggleSection = (title) =>
        setExpandedSection(prev => (prev === title ? null : title));

    // ─── Top Bar ─────────────────────────────────────────────────────────────
    return (
        <View style={[styles.bar, { paddingTop: insets.top || (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0) }]}>
            {/* Hamburger */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuOpen(true)}>
                <View style={styles.ham} />
                <View style={styles.ham} />
                <View style={styles.ham} />
            </TouchableOpacity>

            {/* Logo */}
            <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.logoRow}>
                <Text style={styles.logoEmoji}>🇺🇸</Text>
                <View>
                    <Text style={styles.logoMain}>America</Text>
                    <Text style={styles.logoSub}>Health Insurance</Text>
                </View>
            </TouchableOpacity>

            {/* Right icons */}
            <View style={styles.rightIcons}>
                {/* Bell */}
                <TouchableOpacity style={styles.iconBtn} onPress={() => setNotifOpen(true)}>
                    <Text style={styles.iconEmoji}>🔔</Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Avatar */}
                <TouchableOpacity
                    style={[styles.iconBtn, styles.avatarBtn]}
                    onPress={() => setMenuOpen(true)}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarInitial}>S</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* ── Drawer Menu Modal ──────────────────────────────────────── */}
            <Modal
                visible={menuOpen}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setMenuOpen(false)}
            >
                <SafeAreaView style={styles.drawer}>
                    {/* Drawer header */}
                    <View style={styles.drawerHeader}>
                        <View style={styles.drawerLogoRow}>
                            <Text style={styles.logoEmoji}>🇺🇸</Text>
                            <View>
                                <Text style={[styles.logoMain, { fontSize: 16 }]}>America</Text>
                                <Text style={[styles.logoSub, { fontSize: 14 }]}>Health Insurance</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setMenuOpen(false)} style={styles.closeBtn}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
                        {/* Member bar */}
                        <View style={styles.memberBar}>
                            <View style={styles.memberAvatar}>
                                <Text style={styles.memberAvatarText}>S</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.memberName}>Sarah Jenkins</Text>
                                <Text style={styles.memberPlan}>America Health Insurance Choice POS II</Text>
                            </View>
                        </View>

                        {/* Nav sections */}
                        {NAV_SECTIONS.map((section) => (
                            <View key={section.title}>
                                <TouchableOpacity
                                    style={styles.sectionHeader}
                                    onPress={() => toggleSection(section.title)}
                                >
                                    <Text style={styles.sectionTitle}>{t(section.title)}</Text>
                                    <Text style={styles.chevron}>
                                        {expandedSection === section.title ? '▲' : '▼'}
                                    </Text>
                                </TouchableOpacity>
                                {expandedSection === section.title && (
                                    <View style={styles.sectionItems}>
                                        {section.items.map((item, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                style={styles.sectionItem}
                                                onPress={() => navigate(item.screen)}
                                                disabled={!item.screen}
                                            >
                                                <Text style={[
                                                    styles.sectionItemText,
                                                    !item.screen && { color: '#bbb' },
                                                ]}>
                                                    {t(item.label)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}

                        <View style={styles.divider} />

                        {/* Account */}
                        <TouchableOpacity
                            style={styles.sectionHeader}
                            onPress={() => setShowAccount(v => !v)}
                        >
                            <Text style={styles.sectionTitle}>My Account</Text>
                            <Text style={styles.chevron}>{showAccount ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                        {showAccount && (
                            <View style={styles.sectionItems}>
                                {ACCOUNT_ITEMS.map((item) => (
                                    <TouchableOpacity
                                        key={item.label}
                                        style={styles.sectionItem}
                                        onPress={() => navigate(item.screen)}
                                    >
                                        <Text style={styles.sectionItemText}>{t(item.label)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Language */}
                        <TouchableOpacity
                            style={styles.sectionHeader}
                            onPress={() => setShowLang(v => !v)}
                        >
                            <Text style={styles.sectionTitle}>🌐  Language</Text>
                            <Text style={styles.chevron}>{showLang ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                        {showLang && (
                            <View style={styles.sectionItems}>
                                {LANGUAGES.map((lang) => (
                                    <TouchableOpacity
                                        key={lang.code}
                                        style={[
                                            styles.sectionItem,
                                            i18n.language === lang.code && styles.activeLang,
                                        ]}
                                        onPress={() => { i18n.changeLanguage(lang.code); setShowLang(false); }}
                                    >
                                        <Text style={[
                                            styles.sectionItemText,
                                            i18n.language === lang.code && { color: '#004a99', fontWeight: '700' },
                                        ]}>
                                            {lang.label}
                                        </Text>
                                        {i18n.language === lang.code && (
                                            <Text style={{ color: '#004a99' }}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <View style={styles.divider} />

                        {/* Logoff */}
                        <TouchableOpacity style={styles.logoffBtn}>
                            <Text style={styles.logoffText}>Sign Out</Text>
                        </TouchableOpacity>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* ── Notifications Bottom-Sheet ─────────────────────────────── */}
            <Modal
                visible={notifOpen}
                animationType="slide"
                transparent
                onRequestClose={() => setNotifOpen(false)}
            >
                <TouchableOpacity
                    style={styles.notifOverlay}
                    activeOpacity={1}
                    onPress={() => setNotifOpen(false)}
                />
                <View style={[styles.notifSheet, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.sheetHandle} />
                    <View style={styles.notifSheetHeader}>
                        <Text style={styles.notifSheetTitle}>Notifications</Text>
                        <TouchableOpacity onPress={() => setNotifOpen(false)}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {NOTIFICATIONS.map((n) => (
                            <TouchableOpacity
                                key={n.id}
                                style={[styles.notifItem, n.unread && styles.notifUnread]}
                                onPress={() => setNotifOpen(false)}
                            >
                                <View style={styles.notifIconCircle}>
                                    <Text style={styles.notifIconEmoji}>{n.icon}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.notifText, n.unread && { fontWeight: '600', color: '#1d1d1f' }]}>
                                        {n.text}
                                    </Text>
                                    <Text style={styles.notifTime}>{n.time}</Text>
                                </View>
                                {n.unread && <View style={styles.unreadDot} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.seeAllRow} onPress={() => setNotifOpen(false)}>
                        <Text style={styles.seeAllText}>See all notifications</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    // ── Top bar ────────────────────────────────────────────────────────────
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#d2d2d7',
        zIndex: 100,
        elevation: 4,
    },
    iconBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    ham: {
        width: 20,
        height: 2,
        backgroundColor: '#1d1d1f',
        borderRadius: 1,
        marginVertical: 2,
    },
    logoRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
        gap: 6,
    },
    logoEmoji: { fontSize: 22 },
    logoMain: { color: '#004a99', fontWeight: '800', fontSize: 15, fontStyle: 'italic', lineHeight: 18 },
    logoSub: { color: '#0083cc', fontWeight: '400', fontSize: 13, fontStyle: 'italic', lineHeight: 16 },
    rightIcons: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    iconEmoji: { fontSize: 20 },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
    avatarBtn: { marginLeft: 2 },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#004a99',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: { color: '#fff', fontSize: 14, fontWeight: '700' },

    // ── Drawer ──────────────────────────────────────────────────────────────
    drawer: { flex: 1, backgroundColor: '#fff' },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ebebeb',
    },
    drawerLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    closeBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f7', borderRadius: 18 },
    closeBtnText: { fontSize: 16, color: '#3c3c43', fontWeight: '600' },
    drawerScroll: { flex: 1 },

    memberBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        margin: 16,
        padding: 16,
        backgroundColor: '#f0f5ff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#d6e4ff',
    },
    memberAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#004a99',
        justifyContent: 'center',
        alignItems: 'center',
    },
    memberAvatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    memberName: { fontSize: 15, fontWeight: '700', color: '#1d1d1f' },
    memberPlan: { fontSize: 12, color: '#86868b', marginTop: 2 },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1d1d1f' },
    chevron: { fontSize: 12, color: '#86868b' },
    sectionItems: { backgroundColor: '#fafafa', paddingLeft: 20 },
    sectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 13,
        paddingRight: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f0f0f0',
    },
    sectionItemText: { fontSize: 15, color: '#444' },
    activeLang: { backgroundColor: '#f0f5ff' },

    divider: { height: 8, backgroundColor: '#f5f5f7', marginVertical: 8 },

    logoffBtn: {
        marginHorizontal: 20,
        marginVertical: 8,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#ff3b30',
        alignItems: 'center',
    },
    logoffText: { color: '#ff3b30', fontWeight: '700', fontSize: 15 },

    // ── Notification bottom-sheet ────────────────────────────────────────
    notifOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    notifSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: SCREEN_H * 0.7,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
    },
    sheetHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#d0d0d8',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 6,
    },
    notifSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ebebeb',
    },
    notifSheetTitle: { fontSize: 18, fontWeight: '700', color: '#1d1d1f' },
    notifItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f5f5f7',
    },
    notifUnread: { backgroundColor: '#f0f8ff' },
    notifIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifIconEmoji: { fontSize: 18 },
    notifText: { fontSize: 13, color: '#555', lineHeight: 18 },
    notifTime: { fontSize: 11, color: '#aaa', marginTop: 3 },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007aff',
        flexShrink: 0,
    },
    seeAllRow: {
        paddingVertical: 16,
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ebebeb',
    },
    seeAllText: { color: '#007aff', fontWeight: '600', fontSize: 14 },
});
