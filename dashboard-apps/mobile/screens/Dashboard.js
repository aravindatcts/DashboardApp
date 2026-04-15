import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { usePcpData } from '@shared/hooks/usePcpData';
import { useIdCard } from '@shared/hooks/useIdCard';
import { useAccumulators } from '@shared/hooks/useAccumulators';
import { useDashboardData } from '@shared/hooks/useDashboardData';


const AnimatedView = Animated.createAnimatedComponent(View);

const FullCard = ({ title, children, style, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      })
    ]).start();
  }, [delay, fadeAnim, slideAnim]);

  return (
    <AnimatedView style={[styles.card, style, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </AnimatedView>
  );
};

const AgenticConcierge = ({ delay }) => {
  const [messages, setMessages] = useState([{ id: 1, text: "Hi Sarah. I reviewed your recent City Radiology claim—it's mostly covered. Do you need help finding an in-network physical therapist nearby?", isUser: false }]);
  const [inputText, setInputText] = useState('');

  return (
    <FullCard title="Care Concierge" delay={delay}>
      <View style={{ flex: 1, marginBottom: 12 }}>
        {messages.map(msg => (
          <View key={msg.id} style={{
            alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
            backgroundColor: msg.isUser ? '#0066cc' : '#f5f5f7',
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            maxWidth: '85%'
          }}>
            <Text style={{ fontSize: 15, color: msg.isUser ? '#fff' : '#1d1d1f', lineHeight: 22 }}>{msg.text}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TextInput
          style={{ flex: 1, backgroundColor: '#f5f5f7', borderRadius: 980, paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, color: '#1d1d1f' }}
          placeholder="Ask about claims, coverage, or care..."
          placeholderTextColor="#86868b"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={[styles.btnOutline, { backgroundColor: '#0066cc' }]}>
          <Text style={[styles.btnOutlineText, { color: '#fff' }]}>Send</Text>
        </TouchableOpacity>
      </View>
    </FullCard>
  );
};

const PlanInfo = ({ delay, planInfo }) => {
  return (
    <FullCard title="Plan Information" delay={delay}>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Plan:</Text>
        <Text style={styles.value}>{planInfo.plan}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Member ID:</Text>
        <Text style={styles.value}>{planInfo.memberId}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Group ID:</Text>
        <Text style={styles.value}>{planInfo.groupId}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Effective:</Text>
        <Text style={styles.value}>{planInfo.effective}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { color: '#34c759' }]}>{planInfo.status}</Text>
      </View>
    </FullCard>
  );
};

const PcpInfo = ({ delay }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { selectedMember, setSelectedMember, currentPcp, memberOptions } = usePcpData();

  return (
    <FullCard title={t("Primary Care Provider")} delay={delay}>
      {/* Dropdown Selector */}
      <View style={{ alignSelf: 'flex-start', minWidth: 250, marginBottom: 24, borderWidth: 1, borderColor: '#d2d2d7', borderRadius: 8, backgroundColor: '#f5f5f7', overflow: 'hidden' }}>
        <Picker
          selectedValue={selectedMember}
          onValueChange={(itemValue) => setSelectedMember(itemValue)}
          style={{ height: 44, width: '100%', fontFamily: '-apple-system' }}
          itemStyle={{ fontSize: 15, color: '#1d1d1f' }}
        >
          {memberOptions.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
        </Picker>
      </View>

      <View style={styles.pcpHeader}>
        <View style={[styles.providerPhoto, { backgroundColor: '#e5e5ea', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 24, color: '#86868b' }}>👨‍⚕️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1d1d1f', marginBottom: 4 }}>{currentPcp.doc}</Text>
          <Text style={{ fontSize: 14, color: '#86868b' }}>{currentPcp.spec}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{currentPcp.phone}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{currentPcp.addr}</Text>
      </View>
      <View style={{ marginTop: 24, flexDirection: 'row', gap: 16 }}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.navigate('SearchPcp')}>
          <Text style={styles.btnOutlineText}>Update PCP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnOutline, { backgroundColor: '#0066cc' }]}>
          <Text style={[styles.btnOutlineText, { color: '#fff' }]}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </FullCard>
  );
};

const IdCardDisplay = ({ delay }) => {
  const { t } = useTranslation();
  const { selectedMember, setSelectedMember, showBack, toggleSide, memberId, memberOptions } = useIdCard();

  return (
    <FullCard title={t("ID Cards")} delay={delay}>
      {/* Dropdown Selector */}
      <View style={{ alignSelf: 'flex-start', minWidth: 250, marginBottom: 24, borderWidth: 1, borderColor: '#d2d2d7', borderRadius: 8, backgroundColor: '#f5f5f7', overflow: 'hidden' }}>
        <Picker
          selectedValue={selectedMember}
          onValueChange={(itemValue) => setSelectedMember(itemValue)}
          style={{ height: 44, width: '100%', fontFamily: '-apple-system' }}
          itemStyle={{ fontSize: 15, color: '#1d1d1f' }}
        >
          {memberOptions.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
        </Picker>
      </View>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={{
          width: 340,
          height: 215,
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 18,
          shadowColor: '#004a99',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 10,
          borderWidth: 1,
          borderColor: '#e5e5ea',
        }}>
          {!showBack ? (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderBottomWidth: 2, borderBottomColor: '#004a99', paddingBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 32, height: 32, backgroundColor: '#004a99', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', fontFamily: '-apple-system' }}>A</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#004a99', letterSpacing: -0.5, fontFamily: '-apple-system' }}>America Health Insurance</Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, color: '#1d1d1f', marginBottom: 2, fontFamily: '-apple-system' }}>{selectedMember}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#1d1d1f', marginBottom: 8, fontFamily: '-apple-system' }}>{memberId}</Text>

                  <View style={{ borderTopWidth: 1, borderTopColor: '#d2d2d7', paddingTop: 6, gap: 2 }}>
                    <View style={{ flexDirection: 'row' }}><Text style={{ width: 60, fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>Group No.</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>12345</Text></View>
                    <View style={{ flexDirection: 'row' }}><Text style={{ width: 60, fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>RXBIN</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>001234</Text></View>
                    <View style={{ flexDirection: 'row' }}><Text style={{ width: 60, fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>RXPCN</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>ABC</Text></View>
                    <View style={{ flexDirection: 'row' }}><Text style={{ width: 60, fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>RXGRP</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>RX1234</Text></View>
                    <View style={{ flexDirection: 'row' }}><Text style={{ width: 60, fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>Plan Code</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>123-456</Text></View>
                  </View>
                </View>

                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={{ paddingBottom: 6, gap: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 10, color: '#1d1d1f', fontWeight: '600', fontFamily: '-apple-system' }}>In Network</Text><Text style={{ fontSize: 10, color: '#1d1d1f', fontWeight: '600', fontFamily: '-apple-system' }}>Out Network</Text></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 10, color: '#86868b', fontFamily: '-apple-system' }}>Indv$/Fam$</Text><Text style={{ fontSize: 10, color: '#86868b', fontFamily: '-apple-system' }}>Indv$/Fam$</Text></View>
                  </View>
                  <View style={{ borderTopWidth: 1, borderTopColor: '#d2d2d7', paddingTop: 6, gap: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>DED</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>XX/XX</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>XX/XX</Text></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>OPM</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>XX/XX</Text><Text style={{ fontSize: 10, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>XX/XX</Text></View>
                  </View>
                  <Text style={{ fontSize: 9, color: '#86868b', marginTop: 12, lineHeight: 12, fontFamily: '-apple-system' }}>Full plan details and cost share info available on mobile app or at americahealthinsurance.com.</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ width: '120%', height: 40, backgroundColor: '#1d1d1f', marginBottom: 16, marginLeft: -20, marginTop: -10 }} />
              <Text style={{ fontSize: 11, color: '#1d1d1f', fontWeight: 'bold', fontFamily: '-apple-system' }}>For Providers</Text>
              <Text style={{ fontSize: 10, color: '#86868b', marginBottom: 12, fontFamily: '-apple-system' }}>File claims to your local America Health Insurance plan.</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>Medical Claims:</Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1d1d1f', fontFamily: '-apple-system' }}>1-800-555-1234</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 10, color: '#1d1d1f', fontFamily: '-apple-system' }}>Pharmacy Help Desk:</Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1d1d1f', fontFamily: '-apple-system' }}>1-800-555-9876</Text>
              </View>
              <Text style={{ fontSize: 9, color: '#86868b', marginTop: 'auto', fontFamily: '-apple-system' }}>This card is for identification purposes only and does not guarantee coverage.</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 16, marginTop: 32 }}>
          <TouchableOpacity style={styles.btnOutline} onPress={toggleSide}>
            <Text style={styles.btnOutlineText}>{showBack ? 'Show Front' : 'Show Back'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnOutline, { backgroundColor: '#0066cc', shadowColor: '#0066cc', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }]}>
            <Text style={[styles.btnOutlineText, { color: '#fff' }]}>Add to Apple Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FullCard>
  );
};

const MemberInfo = ({ delay, coveredMembers }) => {
  const { t } = useTranslation();
  return (
    <FullCard title={t("Covered Members")} delay={delay}>
      <View style={{ gap: 16 }}>
        {coveredMembers.map(m => (
          <View key={m.name} style={styles.infoRow}>
            <Text style={styles.value}>{m.name}</Text>
            <Text style={styles.label}>{m.rel}</Text>
          </View>
        ))}
      </View>
    </FullCard>
  );
};

const HraInfo = ({ delay, hraBalance }) => {
  const { t } = useTranslation();
  return (
    <FullCard title={t("Health Reimbursement Account")} delay={delay}>
      <View style={{ backgroundColor: '#f5f5f7', padding: 24, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 13, color: '#86868b', marginBottom: 4 }}>Available Balance</Text>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#34c759' }}>{hraBalance}</Text>
        </View>
        <TouchableOpacity style={[styles.btnOutline, { backgroundColor: '#fff' }]}>
          <Text style={styles.btnOutlineText}>View Transactions</Text>
        </TouchableOpacity>
      </View>
    </FullCard>
  );
};

const AccumulatorsInfo = ({ delay, isDetailed = false }) => {
  const { t } = useTranslation();
  const { selectedMember, setSelectedMember, tabs, activeTab, setTab, data, memberOptions } = useAccumulators(isDetailed);

  return (
    <FullCard title={t("Accumulators")} delay={delay}>
      {/* Dropdown Selector (Only show on Finances / Detailed view) */}
      {isDetailed && (
        <View style={{ alignSelf: 'flex-start', minWidth: 250, marginBottom: 24, borderWidth: 1, borderColor: '#d2d2d7', borderRadius: 8, backgroundColor: '#f5f5f7', overflow: 'hidden' }}>
          <Picker
            selectedValue={selectedMember}
            onValueChange={(itemValue) => setSelectedMember(itemValue)}
            style={{ height: 44, width: '100%', fontFamily: '-apple-system' }}
            itemStyle={{ fontSize: 15, color: '#1d1d1f' }}
          >
            {memberOptions.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
          </Picker>
        </View>
      )}

      <View style={{ flexDirection: 'row', backgroundColor: '#e5e5ea', borderRadius: 8, padding: 4, marginBottom: 32, alignSelf: 'flex-start' }}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={t(tab)}
            onPress={() => setTab(tab)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderRadius: 6,
              backgroundColor: activeTab === tab ? '#fff' : 'transparent',
              shadowColor: activeTab === tab ? '#000' : 'transparent',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: activeTab === tab ? 2 : 0,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: activeTab === tab ? '600' : '500', color: activeTab === tab ? '#1d1d1f' : '#86868b', fontFamily: '-apple-system' }}>{t(tab)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ gap: 32 }}>
        {data.map((item, idx) => {
          const percentage = Math.round((item.spent / item.total) * 100);
          const remaining = item.total - item.spent;
          return (
            <View key={idx} style={styles.barContainer}>
              <View style={styles.barHeader}>
                <Text style={[styles.label, { color: '#1d1d1f', fontWeight: '700', fontSize: 15, fontFamily: '-apple-system' }]}>{item.label}</Text>
                <Text style={[styles.value, { fontFamily: '-apple-system' }]}>${item.total.toLocaleString()} Total</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ fontSize: 13, color: '#86868b', fontWeight: '500', fontFamily: '-apple-system' }}>Spent: ${item.spent.toLocaleString()}</Text>
                <Text style={{ fontSize: 13, color: '#86868b', fontWeight: '500', fontFamily: '-apple-system' }}>Remaining: ${remaining.toLocaleString()}</Text>
              </View>

              <View style={[styles.barTrack, { height: 28, borderRadius: 14, overflow: 'visible', backgroundColor: '#e5e5ea' }]}>
                <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: item.color, borderRadius: 14 }]} />

                {percentage > 0 && (
                  <View style={{
                    position: 'absolute',
                    left: `${percentage}%`,
                    top: -6,
                    bottom: -6,
                    width: 3,
                    backgroundColor: '#1d1d1f',
                    borderRadius: 2,
                    zIndex: 10
                  }} />
                )}

                {percentage > 0 && (
                  <View style={{
                    position: 'absolute',
                    left: `${percentage}%`,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    paddingLeft: 10,
                    zIndex: 5
                  }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1d1d1f', fontFamily: '-apple-system' }}>
                      ${item.spent.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </FullCard>
  );
};

const RecentClaims = ({ delay, recentClaims }) => {
  const navigation = useNavigation();

  return (
    <FullCard title="Recent Activity" delay={delay}>
      <View style={{ gap: 16 }}>
        {recentClaims.map(claim => (
          <TouchableOpacity
            key={claim.id}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              backgroundColor: '#f5f5f7',
              borderRadius: 16
            }}
            onPress={() => navigation.navigate('ClaimDetail', { claimId: claim.id })}
          >
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1d1d1f' }}>{claim.provider}</Text>
              <Text style={{ fontSize: 13, color: '#86868b' }}>{claim.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1d1d1f' }}>{claim.amount}</Text>
              <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: claim.color + '20' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: claim.color }}>{claim.status.toUpperCase()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={{ marginTop: 12, alignItems: 'center' }}
          onPress={() => navigation.navigate('Claims')}
        >
          <Text style={{ color: '#0066cc', fontWeight: '600', fontSize: 15 }}>View All Activity →</Text>
        </TouchableOpacity>
      </View>
    </FullCard>
  );
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeDashboardTab, setActiveDashboardTab] = useState('Overview');
  const { planInfo, coveredMembers, hraBalance, recentClaims, dashboardTabs } = useDashboardData();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.scrollContent}>
          {/* Hero Salutation */}
          <View style={styles.heroSection}>
            <View>
              <Text style={styles.salutationSmall}>Welcome back,</Text>
              <Text style={styles.salutationLarge}>Sarah Jenkins</Text>
            </View>
          </View>

          {/* Apple-style Tab Bar */}
          <View style={styles.appleTabBar}>
            {dashboardTabs.map(tab => (
              <TouchableOpacity
                key={t(tab)}
                onPress={() => setActiveDashboardTab(tab)}
                style={[styles.appleTabItem, activeDashboardTab === tab && styles.appleTabItemActive]}
              >
                <Text style={[styles.appleTabText, activeDashboardTab === tab && styles.appleTabTextActive]}>{t(tab)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dashboardTabContent}>
            {activeDashboardTab === 'Overview' && (
              <View style={styles.singleColumnLayout}>
                <AgenticConcierge delay={50} />
                <RecentClaims delay={150} recentClaims={recentClaims} />
                <AccumulatorsInfo delay={250} />
              </View>
            )}

            {activeDashboardTab === 'ID Cards' && (
              <View style={styles.singleColumnLayout}>
                <IdCardDisplay delay={50} />
              </View>
            )}

            {activeDashboardTab === 'Care' && (
              <View style={styles.singleColumnLayout}>
                <PcpInfo delay={100} />
              </View>
            )}

            {activeDashboardTab === 'Coverage' && (
              <View style={styles.singleColumnLayout}>
                <PlanInfo delay={100} planInfo={planInfo} />
                <MemberInfo delay={200} coveredMembers={coveredMembers} />
              </View>
            )}

            {activeDashboardTab === 'Finances' && (
              <View style={styles.singleColumnLayout}>
                <AccumulatorsInfo delay={100} isDetailed={true} />
                <HraInfo delay={200} hraBalance={hraBalance} />
              </View>
            )}
          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  scrollContent: {
    paddingHorizontal: '12%',
    paddingTop: 40,
    alignItems: 'center',
  },

  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
    maxWidth: 900,
  },
  salutationSmall: {
    fontSize: 16,
    color: '#86868b',
    fontWeight: '500',
    letterSpacing: -0.2,
    fontFamily: '-apple-system',
  },
  salutationLarge: {
    fontSize: 40,
    color: '#1d1d1f',
    fontWeight: '700',
    letterSpacing: -1,
    fontFamily: '-apple-system',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d2d2d7',
  },

  appleTabBar: {
    flexDirection: 'row',
    gap: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#d2d2d7',
    marginBottom: 40,
    width: '100%',
    maxWidth: 900,
  },
  appleTabItem: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  appleTabItemActive: {
    borderBottomColor: '#0066cc',
  },
  appleTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#86868b',
    fontFamily: '-apple-system',
  },
  appleTabTextActive: {
    color: '#1d1d1f',
  },

  dashboardTabContent: {
    width: '100%',
    maxWidth: 900,
  },
  singleColumnLayout: {
    width: '100%',
    gap: 32,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1d1d1f',
    letterSpacing: -0.5,
    fontFamily: '-apple-system',
  },
  cardContent: {
    width: '100%',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f7',
  },
  label: {
    fontSize: 14,
    color: '#86868b',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#1d1d1f',
    fontWeight: '600',
  },

  btnOutline: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 980,
    borderWidth: 1,
    borderColor: '#0066cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: '#0066cc',
    fontSize: 15,
    fontWeight: '600',
  },

  pcpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  providerPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  barContainer: {
    marginBottom: 24,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barTrack: {
    height: 8,
    backgroundColor: '#e5e5ea',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  }
});
