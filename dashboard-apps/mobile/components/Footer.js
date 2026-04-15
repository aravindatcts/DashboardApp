import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function Footer({ compact }) {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { title: 'Privacy Policy' },
        { title: 'Legal Disclaimer' },
        { title: 'Cookie Policy' },
        { title: 'Terms of Use' }
    ];

    return (
        <View style={[styles.footerContainer, compact && styles.compactFooter]}>
            {!compact && (
                <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>
                        "It calls upon us never to be indifferent toward despair. It commands us never to turn away from helplessness. It directs us never to ignore or to spurn those who suffer untended in a land that is bursting with abundance."
                    </Text>
                    <Text style={styles.quoteAuthor}>
                        —President Lyndon B. Johnson, upon signing Medicaid into law, July 30, 1965
                    </Text>
                </View>
            )}

            <View style={styles.brandSection}>
                <View style={styles.logoAndSocials}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoIcon}>🇺🇸</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={styles.logoTextMain}>Fictious</Text>
                            <Text style={styles.logoTextSub}> Health</Text>
                        </View>
                    </View>
                    <View style={styles.socialIconsContainer}>
                        <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}><Text style={styles.socialIconText}>f</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#FF0000' }]}><Text style={styles.socialIconText}>▶</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#0A66C2' }]}><Text style={styles.socialIconText}>in</Text></TouchableOpacity>
                    </View>
                </View>
                <View style={styles.divider} />
            </View>

            <View style={styles.footerLinks}>
                {footerLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity style={styles.linkButton}>
                            <Text style={styles.linkText}>{link.title}</Text>
                        </TouchableOpacity>
                        {index < footerLinks.length - 1 && <Text style={styles.separator}>|</Text>}
                    </React.Fragment>
                ))}
            </View>

            <View style={styles.copyrightContainer}>
                <Text style={styles.copyrightText}>
                    Copyright © 2001–{currentYear} FICTIOUSHEALTH. All rights reserved. Please see Terms of Use and Privacy Notice.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        backgroundColor: '#002E6D', // Brand Navy Blue
        paddingVertical: 20, // Reduced from 48 to make it more compact
        paddingHorizontal: '10%',
        alignItems: 'center',
        marginTop: 40,
        width: '100%',
    },
    compactFooter: {
        paddingVertical: 12,
        marginTop: 20,
    },
    quoteContainer: {
        marginBottom: 20, // Reduced from 40
        alignItems: 'center',
    },
    quoteText: {
        color: '#EEEEEE',
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 16,
        fontWeight: '300',
    },
    quoteAuthor: {
        color: '#EEEEEE',
        fontSize: 14,
        textAlign: 'right',
        alignSelf: 'flex-end',
        fontWeight: '300',
    },
    brandSection: {
        width: '100%',
        marginBottom: 32,
    },
    logoAndSocials: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12, // Reduced from 24
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        fontSize: 32,
        marginRight: 8,
    },
    logoTextMain: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 24,
    },
    logoTextSub: {
        color: '#ffffff',
        fontWeight: '300',
        fontSize: 24,
        fontStyle: 'italic',
    },
    socialIconsContainer: {
        flexDirection: 'row',
    },
    socialIcon: {
        width: 36,
        height: 36,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    socialIconText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    divider: {
        height: 1,
        backgroundColor: '#ffffff',
        width: '100%',
        opacity: 0.5,
    },
    footerLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // Reduced from 40
    },
    linkButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    linkText: {
        color: '#EEEEEE',
        fontSize: 15,
        fontWeight: '300',
    },
    separator: {
        color: '#ffffff',
        opacity: 0.5,
        fontSize: 16,
    },
    copyrightContainer: {
        width: '100%',
        alignItems: 'center',
    },
    copyrightText: {
        color: '#EEEEEE',
        fontSize: 12,
        textAlign: 'center',
        opacity: 0.7,
    }
});
