import React from 'react'
import { Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer'

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#2563eb',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  contactItem: {
    fontSize: 10,
    color: '#475569',
  },
  bio: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
    textAlign: 'left',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
    marginBottom: 10,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#2563eb',
    marginLeft: 6,
  },
  itemDate: {
    fontSize: 10,
    color: '#64748b',
  },
  itemDesc: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
    marginTop: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
    color: '#94a3b8',
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.4,
  },
  skillsGrid: {
    flexDirection: 'column',
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  skillCategory: {
    width: 120,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  skillList: {
    flex: 1,
    fontSize: 10,
    color: '#334155',
  }
})

interface Props {
  profile: any
  experiences: any[]
  education: any[]
  skillsByCategory: Record<string, string[]>
  projects: any[]
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Present'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function ResumePDF({ profile, experiences, education, skillsByCategory, projects }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header} wrap={false}>
          <Text style={styles.name}>{profile.full_name}</Text>
          <Text style={styles.title}>{profile.title}</Text>
          
          <View style={styles.contactRow}>
            {profile.email && <Text style={styles.contactItem}>{profile.email}</Text>}
            {profile.location && <Text style={styles.contactItem}>• {profile.location}</Text>}
            {profile.github_url && (
              <Text style={styles.contactItem}>
                • {profile.github_url.replace('https://', '').replace('github.com/', '')}
              </Text>
            )}
            {profile.linkedin_url && (
              <Text style={styles.contactItem}>
                • {profile.linkedin_url.replace('https://www.linkedin.com/in/', '')}
              </Text>
            )}
          </View>

          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
        </View>

        {/* EXPERIENCE */}
        {experiences && experiences.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experiences.map((exp: any) => (
              <View key={exp.id} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitle}>{exp.role}</Text>
                    <Text style={styles.itemSubtitle}>| {exp.company} {exp.location && `• ${exp.location}`}</Text>
                  </View>
                  <Text style={styles.itemDate}>
                    {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                  </Text>
                </View>
                <View style={styles.itemDesc}>
                  {exp.description?.split('\n').map((line: string, i: number) => {
                    const trimmed = line.trim()
                    if (!trimmed) return null
                    if (trimmed.startsWith('-')) {
                      return (
                        <View key={i} style={styles.bulletPoint}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletText}>{trimmed.replace('-', '').trim()}</Text>
                        </View>
                      )
                    }
                    return <Text key={i} style={{ marginBottom: 4 }}>{trimmed}</Text>
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Selected Projects</Text>
            {projects.map((proj: any) => (
              <View key={proj.id} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.title}</Text>
                  <Text style={styles.itemDate}>
                    {(proj.technologies || []).join(' • ')}
                  </Text>
                </View>
                <View style={styles.itemDesc}>
                  <Text>{proj.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any) => (
              <View key={edu.id} style={styles.item} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={styles.itemSubtitle}>| {edu.institution}</Text>
                  </View>
                  <Text style={styles.itemDate}>
                    {formatDate(edu.start_date)} - {edu.current ? 'Present' : formatDate(edu.end_date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {skillsByCategory && Object.keys(skillsByCategory).length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillsGrid}>
              {Object.entries(skillsByCategory).map(([category, items]: [string, string[]]) => (
                <View key={category} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>{category}</Text>
                  <Text style={styles.skillList}>{items.join(', ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </Page>
    </Document>
  )
}
